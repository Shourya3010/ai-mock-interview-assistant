const interviewService = require('../services/interview.service');

const createInterview = async (req, res, next) => {
  try {
    const interview = await interviewService.createInterview(req.user._id, req.body);
    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

const startInterview = async (req, res, next) => {
  try {
    const result = await interviewService.startInterview(req.params.id, req.user._id);

    // Emit Socket.IO event if available
    const io = req.app.get('io');
    if (io) {
      io.to(`interview_${req.params.id}`).emit('questionGenerated', result.question);
    }

    res.status(200).json({
      success: true,
      question: result.question,
      interview: result.interview
    });
  } catch (error) {
    next(error);
  }
};

const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, answer, duration } = req.body;
    const result = await interviewService.submitAnswer(req.params.id, req.user._id, {
      questionId,
      answer,
      duration
    });

    // Emit Socket.IO events if available
    const io = req.app.get('io');
    if (io) {
      io.to(`interview_${req.params.id}`).emit('evaluationCompleted', result.evaluation);
      if (result.nextQuestion) {
        io.to(`interview_${req.params.id}`).emit('nextQuestion', result.nextQuestion);
      }
      if (result.isCompleted) {
        io.to(`interview_${req.params.id}`).emit('interviewCompleted');
      }
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const endInterview = async (req, res, next) => {
  try {
    const result = await interviewService.endInterview(req.params.id, req.user._id);

    const io = req.app.get('io');
    if (io) {
      io.to(`interview_${req.params.id}`).emit('interviewCompleted', result.report);
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getUserInterviews = async (req, res, next) => {
  try {
    const interviews = await interviewService.getUserInterviews(req.user._id);
    res.status(200).json({
      success: true,
      data: interviews
    });
  } catch (error) {
    next(error);
  }
};

const getInterviewById = async (req, res, next) => {
  try {
    const data = await interviewService.getInterviewById(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterview,
  startInterview,
  submitAnswer,
  endInterview,
  getUserInterviews,
  getInterviewById
};
