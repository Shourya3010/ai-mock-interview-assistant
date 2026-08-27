const reportService = require('../services/report.service');

const getReport = async (req, res, next) => {
  try {
    const report = await reportService.getReportByInterviewId(req.params.interviewId, req.user._id);
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await reportService.getUserAnalytics(req.user._id);
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReport,
  getAnalytics
};
