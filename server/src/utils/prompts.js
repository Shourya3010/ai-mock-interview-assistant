/**
 * Prompt Templates for AI Mock Interview Engine
 */

const getQuestionPrompt = ({ role, interviewType, difficulty, topics, previousQuestions, previousAnswers, previousEvaluations }) => {
  const prevContext = (previousQuestions || []).map((q, idx) => {
    const ans = previousAnswers[idx] ? previousAnswers[idx].answer : 'No answer provided';
    const evalData = previousEvaluations[idx] ? `Score: ${previousEvaluations[idx].score}/100, Feedback: ${previousEvaluations[idx].feedback}` : 'N/A';
    return `Q${idx + 1}: ${q.question}\nAnswer: ${ans}\nEvaluation: ${evalData}`;
  }).join('\n\n');

  return `You are a senior technical interviewer conducting a live interview.

Candidate Context:
- Role: ${role}
- Interview Type: ${interviewType}
- Current Difficulty: ${difficulty}
- Selected Topics: ${topics.join(', ')}

${prevContext ? `Interview History so far:\n${prevContext}\n` : ''}

Rules:
1. Ask exactly ONE realistic, high-quality interview question tailored for the target role.
2. Focus on one of the selected topics: ${topics.join(', ')}.
3. Do NOT repeat any previously asked questions.
4. Adapt the difficulty to the candidate's recent performance.
5. Return ONLY a valid JSON object matching this exact format:

{
  "question": "The question text here...",
  "topic": "The target topic",
  "difficulty": "${difficulty}",
  "questionType": "conceptual" | "scenario" | "problem-solving" | "behavioral" | "coding"
}`;
};

const getEvaluationPrompt = ({ question, answer, role, interviewType }) => {
  return `You are a expert interviewer evaluating a candidate's answer.

Role: ${role}
Interview Type: ${interviewType}
Question: "${question.question}" (Topic: ${question.topic}, Difficulty: ${question.difficulty})
Candidate Answer: "${answer}"

Evaluate the candidate's response across these 5 key dimensions on a scale of 0 to 10:
1. technicalAccuracy (0-10): How technically accurate is the response?
2. relevance (0-10): Did the candidate directly address the question asked?
3. completeness (0-10): Is the answer thorough or missing critical details?
4. communication (0-10): Is the response clear, structured, and easy to follow?
5. problemSolving (0-10): Does the candidate display analytical thinking or problem-solving capability?

Identify 1-3 specific strengths, 1-3 actionable weaknesses, constructive feedback, and whether a follow-up question is required (followUpNeeded = true if answer is partially correct or missed key details).

Return ONLY a valid JSON object matching this exact format:
{
  "technicalAccuracy": 8,
  "relevance": 9,
  "completeness": 7,
  "communication": 8,
  "problemSolving": 7,
  "strengths": ["Clear explanation of core concepts"],
  "weaknesses": ["Missed discussing edge case handling"],
  "feedback": "Great overview of the fundamentals. Next time include details on error handling.",
  "followUpNeeded": true
}`;
};

const getFollowUpPrompt = ({ question, answer, evaluation, role }) => {
  return `You are a technical interviewer following up on a candidate's previous response.

Role: ${role}
Original Question: "${question.question}"
Candidate Answer: "${answer}"
Evaluation Feedback: "${evaluation.feedback}"
Identified Weaknesses: ${JSON.stringify(evaluation.weaknesses)}

Rules:
1. Ask ONE concise, specific follow-up question probing deeper into what the candidate missed or partially explained.
2. Keep it natural and conversational like a real interviewer.
3. Return ONLY a valid JSON object matching this exact format:

{
  "question": "The follow-up question text here...",
  "topic": "${question.topic}",
  "difficulty": "${question.difficulty}",
  "questionType": "scenario"
}`;
};

const getFinalReportPrompt = ({ interview, questions, answers }) => {
  const summaryQA = questions.map((q, idx) => {
    const a = answers[idx] || {};
    return `Q${idx + 1}: ${q.question} (Topic: ${q.topic})\nAnswer: ${a.answer || 'N/A'}\nScore: ${a.score || 0}/100`;
  }).join('\n\n');

  return `You are a lead hiring manager reviewing a candidate's completed mock interview.

Interview Config:
- Role: ${interview.role}
- Type: ${interview.interviewType}
- Topics: ${interview.topics.join(', ')}

Q&A Transcript:
${summaryQA}

Generate a comprehensive final performance report containing:
- High-level overall summary
- Key overall strengths (3-5 items)
- Critical areas for improvement / weaknesses (3-5 items)
- Recommended topics to study (3-5 items)

Return ONLY a valid JSON object matching this exact format:
{
  "summary": "Overall performance summary paragraph...",
  "strengths": ["Strong domain knowledge in React", "Good communication skill"],
  "weaknesses": ["Needs practice on database indexing", "Incomplete answers on concurrency"],
  "recommendedTopics": ["MongoDB Aggregations", "System Design Caching"]
}`;
};

module.exports = {
  getQuestionPrompt,
  getEvaluationPrompt,
  getFollowUpPrompt,
  getFinalReportPrompt
};
