const Report = require('../models/Report');
const Interview = require('../models/Interview');
const Answer = require('../models/Answer');

const getReportByInterviewId = async (interviewId, userId) => {
  const report = await Report.findOne({ interviewId, userId }).populate('interviewId');
  if (!report) {
    const error = new Error('Report not found');
    error.statusCode = 404;
    throw error;
  }
  return report;
};

const getUserAnalytics = async (userId) => {
  const reports = await Report.find({ userId }).sort({ createdAt: 1 });
  const allUserInterviews = await Interview.find({ userId }).sort({ createdAt: -1 });

  // Calculate practice time directly from MongoDB interview durations
  const totalPracticeMinutes = allUserInterviews.reduce((acc, inv) => acc + (inv.duration || 0), 0);
  const practiceHours = Math.floor(totalPracticeMinutes / 60);
  const practiceMins = totalPracticeMinutes % 60;
  const practiceTime = `${practiceHours}h ${practiceMins}m`;

  const totalInterviews = allUserInterviews.length;

  if (reports.length === 0) {
    return {
      totalInterviews,
      averageScore: 0,
      bestScore: 0,
      latestScore: 0,
      technicalAverage: 0,
      communicationAverage: 0,
      practiceTime,
      recentInterviews: allUserInterviews.slice(0, 5),
      strongTopics: [],
      weakTopics: [],
      progressChart: []
    };
  }

  const scores = reports.map(r => r.overallScore);
  const averageScore = Math.round((scores.reduce((a, b) => a + b, 0) / reports.length) * 10) / 10;
  const bestScore = Math.max(...scores);
  const latestScore = scores[scores.length - 1];

  const technicalAverage = Math.round((reports.reduce((a, b) => a + b.technicalScore, 0) / reports.length) * 10) / 10;
  const communicationAverage = Math.round((reports.reduce((a, b) => a + b.communicationScore, 0) / reports.length) * 10) / 10;

  // Aggregate strengths & weaknesses directly from MongoDB report records
  const allStrengths = reports.flatMap(r => r.strengths || []);
  const allWeaknesses = reports.flatMap(r => r.weaknesses || []);

  const progressChart = reports.map((r, idx) => ({
    interview: `Session #${idx + 1}`,
    score: r.overallScore,
    technical: r.technicalScore,
    communication: r.communicationScore,
    date: new Date(r.createdAt).toLocaleDateString()
  }));

  return {
    totalInterviews,
    averageScore,
    bestScore,
    latestScore,
    technicalAverage,
    communicationAverage,
    practiceTime,
    recentInterviews: allUserInterviews.slice(0, 5),
    strongTopics: Array.from(new Set(allStrengths)).slice(0, 5),
    weakTopics: Array.from(new Set(allWeaknesses)).slice(0, 5),
    progressChart
  };
};

module.exports = {
  getReportByInterviewId,
  getUserAnalytics
};
