const OpenAI = require('openai');
const { z } = require('zod');
const env = require('../config/env');
const {
  getQuestionPrompt,
  getEvaluationPrompt,
  getFollowUpPrompt,
  getFinalReportPrompt
} = require('../utils/prompts');

// Zod Schemas for LLM Output Validation
const QuestionSchema = z.object({
  question: z.string().min(5),
  topic: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).catch('Medium'),
  questionType: z.enum(['conceptual', 'scenario', 'problem-solving', 'behavioral', 'coding']).catch('conceptual')
});

const EvaluationSchema = z.object({
  technicalAccuracy: z.number().min(0).max(10).catch(7),
  relevance: z.number().min(0).max(10).catch(7),
  completeness: z.number().min(0).max(10).catch(6),
  communication: z.number().min(0).max(10).catch(7),
  problemSolving: z.number().min(0).max(10).catch(6),
  strengths: z.array(z.string()).min(1).catch(['Provided clear explanation']),
  weaknesses: z.array(z.string()).catch(['Could elaborate further on edge cases']),
  feedback: z.string().catch('Good effort. Try adding more concrete examples.'),
  followUpNeeded: z.boolean().catch(false)
});

const FinalReportSchema = z.object({
  summary: z.string().min(10),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  recommendedTopics: z.array(z.string()).min(1)
});

// Initialize OpenAI client if key is available
let openaiClient = null;
if (env.aiApiKey) {
  openaiClient = new OpenAI({ apiKey: env.aiApiKey });
}

/**
 * Call LLM API with JSON format enforcement (Supports Gemini & OpenAI)
 */
const callLLM = async (prompt) => {
  if (!env.aiApiKey) {
    throw new Error('AI_API_KEY is not configured');
  }

  if (env.aiProvider === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.aiModel || 'gemini-1.5-flash'}:generateContent?key=${env.aiApiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${prompt}\nIMPORTANT: Respond with pure JSON only.` }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(`Gemini API Error: ${data.error.message}`);
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(text);
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: env.aiApiKey });
  }

  const response = await openaiClient.chat.completions.create({
    model: env.aiModel || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are an expert AI interviewer. Return JSON responses only.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
};

// Fallback Mock Bank for offline / unconfigured API keys
const mockQuestionBank = {
  JavaScript: [
    { question: 'Explain event delegation in JavaScript and why it is useful for dynamic DOM elements.', topic: 'JavaScript', difficulty: 'Medium', questionType: 'conceptual' },
    { question: 'What is the difference between microtasks and macrotasks in the JavaScript Event Loop?', topic: 'JavaScript', difficulty: 'Hard', questionType: 'conceptual' },
    { question: 'How do closures work in JavaScript? Can you describe a practical use case?', topic: 'JavaScript', difficulty: 'Easy', questionType: 'conceptual' }
  ],
  React: [
    { question: 'Explain how React reconciliation and the Virtual DOM diffing algorithm work under the hood.', topic: 'React', difficulty: 'Medium', questionType: 'conceptual' },
    { question: 'What are the main differences between useEffect and useLayoutEffect, and when should each be used?', topic: 'React', difficulty: 'Hard', questionType: 'scenario' },
    { question: 'How would you optimize a React component that re-renders unnecessarily during parent state updates?', topic: 'React', difficulty: 'Medium', questionType: 'problem-solving' }
  ],
  'Node.js': [
    { question: 'How does Node.js handle non-blocking I/O operations using the libuv thread pool?', topic: 'Node.js', difficulty: 'Medium', questionType: 'conceptual' },
    { question: 'Explain memory leaks in Node.js applications and how you would diagnose and resolve them.', topic: 'Node.js', difficulty: 'Hard', questionType: 'scenario' }
  ],
  MongoDB: [
    { question: 'Compare MongoDB embedding vs referencing. What factors guide your schema design choice?', topic: 'MongoDB', difficulty: 'Medium', questionType: 'conceptual' },
    { question: 'How do compound indexes work in MongoDB, and what is the ESIR (Equality, Sort, Range) rule?', topic: 'MongoDB', difficulty: 'Hard', questionType: 'conceptual' }
  ],
  General: [
    { question: 'Describe a challenging technical problem you recently solved and how you arrived at the solution.', topic: 'General', difficulty: 'Medium', questionType: 'behavioral' },
    { question: 'Explain the principles of RESTful API design and how error handling should be structured.', topic: 'General', difficulty: 'Medium', questionType: 'conceptual' }
  ]
};

/**
 * AI Service Functions
 */
const generateQuestion = async (context) => {
  const { role, interviewType, difficulty, topics, previousQuestions = [], previousAnswers = [], previousEvaluations = [] } = context;
  const prompt = getQuestionPrompt({ role, interviewType, difficulty, topics, previousQuestions, previousAnswers, previousEvaluations });

  if (openaiClient) {
    try {
      const json = await callLLM(prompt);
      return QuestionSchema.parse(json);
    } catch (err) {
      console.warn(`[AI Service Warning] Falling back to mock question generator: ${err.message}`);
    }
  }

  // Fallback Mock Logic
  const availableTopic = topics.find(t => mockQuestionBank[t]) || 'General';
  const questionsForTopic = mockQuestionBank[availableTopic] || mockQuestionBank.General;
  const askedTexts = previousQuestions.map(q => q.question);
  const unasked = questionsForTopic.filter(q => !askedTexts.includes(q.question));
  const selected = unasked.length > 0 ? unasked[0] : questionsForTopic[Math.floor(Math.random() * questionsForTopic.length)];

  return {
    question: selected.question,
    topic: selected.topic,
    difficulty: difficulty || selected.difficulty,
    questionType: selected.questionType
  };
};

const evaluateAnswer = async (question, answer, context) => {
  const { role, interviewType } = context;
  const prompt = getEvaluationPrompt({ question, answer, role, interviewType });

  if (openaiClient) {
    try {
      const json = await callLLM(prompt);
      return EvaluationSchema.parse(json);
    } catch (err) {
      console.warn(`[AI Service Warning] Falling back to mock evaluation generator: ${err.message}`);
    }
  }

  // Fallback Mock Evaluation
  const wordCount = (answer || '').trim().split(/\s+/).length;
  let score = 7;
  if (wordCount < 10) score = 4;
  else if (wordCount > 30) score = 8;

  return {
    technicalAccuracy: score,
    relevance: Math.min(10, score + 1),
    completeness: Math.max(3, score - 1),
    communication: score,
    problemSolving: Math.max(4, score - 1),
    strengths: ['Identified key concepts in response', 'Good communication structure'],
    weaknesses: wordCount < 15 ? ['Answer was brief, add more technical details'] : ['Could include specific real-world code examples'],
    feedback: 'Solid attempt. Try to elaborate more on underlying architectural trade-offs.',
    followUpNeeded: wordCount < 20
  };
};

const generateFollowUp = async (question, answer, evaluation, context) => {
  const { role } = context;
  const prompt = getFollowUpPrompt({ question, answer, evaluation, role });

  if (openaiClient) {
    try {
      const json = await callLLM(prompt);
      return QuestionSchema.parse(json);
    } catch (err) {
      console.warn(`[AI Service Warning] Falling back to mock follow-up generator: ${err.message}`);
    }
  }

  return {
    question: `Follow-up on ${question.topic}: Can you expand on how you would handle potential edge cases or failure scenarios in that approach?`,
    topic: question.topic,
    difficulty: question.difficulty,
    questionType: 'scenario'
  };
};

const generateFinalReport = async (interview, questions, answers) => {
  const prompt = getFinalReportPrompt({ interview, questions, answers });

  if (openaiClient) {
    try {
      const json = await callLLM(prompt);
      return FinalReportSchema.parse(json);
    } catch (err) {
      console.warn(`[AI Service Warning] Falling back to mock final report generator: ${err.message}`);
    }
  }

  return {
    summary: `The candidate completed a ${interview.interviewType} interview for the ${interview.role} role covering ${interview.topics.join(', ')}. Demonstrated strong fundamentals with consistent performance across questions.`,
    strengths: ['Clear articulate answers', 'Good understanding of core concepts'],
    weaknesses: ['Needs deeper detail on edge-case error handling', 'Consider practicing time-bounded problem solving'],
    recommendedTopics: interview.topics.map(t => `${t} Deep Dive & Advanced Architecture`)
  };
};

module.exports = {
  generateQuestion,
  evaluateAnswer,
  generateFollowUp,
  generateFinalReport
};
