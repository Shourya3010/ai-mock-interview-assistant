const Answer = require('../models/Answer');
const { calculateAnswerScore } = require('../utils/scoring');
const aiService = require('./ai.service');

const evaluateCandidateAnswer = async (question, answer, context) => {
  const evalResult = await aiService.evaluateAnswer(question, answer, context);
  const score = calculateAnswerScore(evalResult);
  return {
    ...evalResult,
    score
  };
};

module.exports = { evaluateCandidateAnswer };
