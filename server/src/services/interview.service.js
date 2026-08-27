const Interview = require('../models/Interview');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Report = require('../models/Report');
const aiService = require('./ai.service');
const { calculateAnswerScore, calculateOverallInterviewScore } = require('../utils/scoring');

/**
 * Create a new interview configuration
 */
const createInterview = async (userId, data) => {
  const interview = await Interview.create({
    userId,
    role: data.role,
    interviewType: data.interviewType,
    difficulty: data.difficulty,
    topics: data.topics,
    duration: data.duration,
    status: 'created'
  });
  return interview;
};

/**
 * Start interview & generate first question
 */
const startInterview = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    const error = new Error('Interview not found');
    error.statusCode = 404;
    throw error;
  }

  if (interview.status === 'completed') {
    const error = new Error('Cannot start an already completed interview');
    error.statusCode = 400;
    throw error;
  }

  // Update status to in-progress if created
  if (interview.status === 'created') {
    interview.status = 'in-progress';
    interview.startedAt = new Date();
    interview.currentQuestionIndex = 1;
    await interview.save();
  }

  // Check if first question already exists (resume support)
  let firstQuestion = await Question.findOne({ interviewId, sequenceNumber: 1 });

  if (!firstQuestion) {
    const aiQuestion = await aiService.generateQuestion({
      role: interview.role,
      interviewType: interview.interviewType,
      difficulty: interview.difficulty,
      topics: interview.topics
    });

    firstQuestion = await Question.create({
      interviewId,
      question: aiQuestion.question,
      topic: aiQuestion.topic,
      difficulty: aiQuestion.difficulty,
      sequenceNumber: 1,
      questionType: aiQuestion.questionType
    });
  }

  return { interview, question: firstQuestion };
};

/**
 * Submit answer, evaluate, calculate weighted score, and generate next question or follow-up
 */
const submitAnswer = async (interviewId, userId, { questionId, answer, duration = 0 }) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    const error = new Error('Interview not found');
    error.statusCode = 404;
    throw error;
  }

  if (interview.status !== 'in-progress') {
    const error = new Error('Cannot submit answer to an interview that is not in progress');
    error.statusCode = 400;
    throw error;
  }

  const question = await Question.findOne({ _id: questionId, interviewId });
  if (!question) {
    const error = new Error('Question not found in this interview');
    error.statusCode = 404;
    throw error;
  }

  // Check duplicate answer
  const existingAnswer = await Answer.findOne({ questionId });
  if (existingAnswer) {
    const error = new Error('An answer has already been submitted for this question');
    error.statusCode = 400;
    throw error;
  }

  // 1. Evaluate answer via AI Service
  const evalResult = await aiService.evaluateAnswer(question, (answer || '').trim(), {
    role: interview.role,
    interviewType: interview.interviewType
  });

  // 2. Compute weighted score using scoring engine
  const computedScore = calculateAnswerScore(evalResult);

  // 3. Save Answer record
  const savedAnswer = await Answer.create({
    interviewId,
    questionId,
    answer,
    duration,
    technicalAccuracy: evalResult.technicalAccuracy,
    relevance: evalResult.relevance,
    completeness: evalResult.completeness,
    communication: evalResult.communication,
    problemSolving: evalResult.problemSolving,
    score: computedScore,
    strengths: evalResult.strengths,
    weaknesses: evalResult.weaknesses,
    feedback: evalResult.feedback,
    followUpNeeded: evalResult.followUpNeeded
  });

  // Fetch previous questions and answers for context
  const allQuestions = await Question.find({ interviewId }).sort({ sequenceNumber: 1 });
  const allAnswers = await Answer.find({ interviewId }).sort({ createdAt: 1 });

  // Determine difficulty adjustment
  let nextDifficulty = question.difficulty;
  if (computedScore >= 80) {
    if (nextDifficulty === 'Easy') nextDifficulty = 'Medium';
    else if (nextDifficulty === 'Medium') nextDifficulty = 'Hard';
  } else if (computedScore < 50) {
    if (nextDifficulty === 'Hard') nextDifficulty = 'Medium';
    else if (nextDifficulty === 'Medium') nextDifficulty = 'Easy';
  }

  // Check if max questions reached based on duration (15 min = 5 questions, 30 min = 8 questions, 45 min = 12 questions)
  const maxQuestions = Math.round(interview.duration / 3);
  const nextSeq = question.sequenceNumber + 1;

  let nextQuestion = null;
  let isCompleted = false;

  if (nextSeq > maxQuestions) {
    isCompleted = true;
  } else {
    // Generate follow-up or next question
    let aiQuestion;
    if (evalResult.followUpNeeded) {
      aiQuestion = await aiService.generateFollowUp(question, answer, evalResult, { role: interview.role });
    } else {
      aiQuestion = await aiService.generateQuestion({
        role: interview.role,
        interviewType: interview.interviewType,
        difficulty: nextDifficulty,
        topics: interview.topics,
        previousQuestions: allQuestions,
        previousAnswers: allAnswers,
        previousEvaluations: allAnswers
      });
    }

    nextQuestion = await Question.create({
      interviewId,
      question: aiQuestion.question,
      topic: aiQuestion.topic,
      difficulty: aiQuestion.difficulty,
      sequenceNumber: nextSeq,
      questionType: aiQuestion.questionType
    });

    interview.currentQuestionIndex = nextSeq;
    await interview.save();
  }

  return {
    evaluation: {
      technicalAccuracy: savedAnswer.technicalAccuracy,
      relevance: savedAnswer.relevance,
      completeness: savedAnswer.completeness,
      communication: savedAnswer.communication,
      problemSolving: savedAnswer.problemSolving,
      score: savedAnswer.score,
      strengths: savedAnswer.strengths,
      weaknesses: savedAnswer.weaknesses,
      feedback: savedAnswer.feedback,
      followUpNeeded: savedAnswer.followUpNeeded
    },
    answerId: savedAnswer._id,
    nextQuestion,
    isCompleted
  };
};

/**
 * End interview & generate final report
 */
const endInterview = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    const error = new Error('Interview not found');
    error.statusCode = 404;
    throw error;
  }

  if (interview.status !== 'completed') {
    interview.status = 'completed';
    interview.completedAt = new Date();
  }

  const questions = await Question.find({ interviewId }).sort({ sequenceNumber: 1 });
  const answers = await Answer.find({ interviewId });

  // Calculate scores
  const overallScore = calculateOverallInterviewScore(answers);
  interview.overallScore = overallScore;
  await interview.save();

  // Aggregate sub scores (0-10 normalized to 0-100)
  const calcAvg = (field) => {
    if (answers.length === 0) return 0;
    const sum = answers.reduce((acc, a) => acc + (a[field] || 0), 0);
    return Math.round((sum / answers.length) * 10);
  };

  const technicalScore = calcAvg('technicalAccuracy');
  const communicationScore = calcAvg('communication');
  const completenessScore = calcAvg('completeness');
  const problemSolvingScore = calcAvg('problemSolving');

  // Check if report already exists
  let report = await Report.findOne({ interviewId });
  if (!report) {
    const aiReport = await aiService.generateFinalReport(interview, questions, answers);

    report = await Report.create({
      interviewId,
      userId,
      overallScore,
      technicalScore,
      communicationScore,
      completenessScore,
      problemSolvingScore,
      strengths: aiReport.strengths,
      weaknesses: aiReport.weaknesses,
      recommendedTopics: aiReport.recommendedTopics,
      summary: aiReport.summary
    });
  }

  return { interview, report };
};

/**
 * Get all user interviews
 */
const getUserInterviews = async (userId) => {
  return await Interview.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Get single interview state (with questions/answers for resume)
 */
const getInterviewById = async (interviewId, userId) => {
  const interview = await Interview.findOne({ _id: interviewId, userId });
  if (!interview) {
    const error = new Error('Interview not found');
    error.statusCode = 404;
    throw error;
  }

  const questions = await Question.find({ interviewId }).sort({ sequenceNumber: 1 });
  const answers = await Answer.find({ interviewId }).sort({ createdAt: 1 });
  const report = await Report.findOne({ interviewId });

  return {
    interview,
    questions,
    answers,
    report
  };
};

module.exports = {
  createInterview,
  startInterview,
  submitAnswer,
  endInterview,
  getUserInterviews,
  getInterviewById
};
