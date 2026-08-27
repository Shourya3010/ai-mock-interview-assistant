/**
 * Weighted Scoring Engine
 * Technical Accuracy = 40%
 * Relevance = 20%
 * Completeness = 15%
 * Communication = 15%
 * Problem Solving = 10%
 */

const calculateAnswerScore = (evalObj) => {
  const technicalAccuracy = Number(evalObj.technicalAccuracy) || 0;
  const relevance = Number(evalObj.relevance) || 0;
  const completeness = Number(evalObj.completeness) || 0;
  const communication = Number(evalObj.communication) || 0;
  const problemSolving = Number(evalObj.problemSolving) || 0;

  const rawWeightedScore = (
    technicalAccuracy * 0.40 +
    relevance * 0.20 +
    completeness * 0.15 +
    communication * 0.15 +
    problemSolving * 0.10
  );

  // Normalize 0-10 score to 0-100
  const normalizedScore = Math.round(rawWeightedScore * 10 * 10) / 10;
  return Math.min(100, Math.max(0, normalizedScore));
};

const calculateOverallInterviewScore = (answers) => {
  if (!answers || answers.length === 0) return 0;
  const total = answers.reduce((sum, ans) => sum + (ans.score || 0), 0);
  return Math.round((total / answers.length) * 10) / 10;
};

module.exports = {
  calculateAnswerScore,
  calculateOverallInterviewScore
};
