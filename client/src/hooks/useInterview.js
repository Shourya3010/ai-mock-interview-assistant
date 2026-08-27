import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { startInterview, submitAnswer, getInterviewById, endInterview } from '../services/interview.api';

export const useInterview = (interviewId) => {
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [error, setError] = useState(null);

  const socketRef = useRef(null);

  // Initialize socket & fetch interview details
  useEffect(() => {
    if (!interviewId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl);
    socketRef.current = socket;

    socket.emit('joinInterview', interviewId);

    socket.on('questionGenerated', (question) => {
      setCurrentQuestion(question);
    });

    socket.on('evaluationCompleted', (evalData) => {
      setLastEvaluation(evalData);
    });

    socket.on('nextQuestion', (question) => {
      setCurrentQuestion(question);
      setLastEvaluation(null);
    });

    const loadInterview = async () => {
      try {
        setLoading(true);
        const data = await getInterviewById(interviewId);
        setInterview(data.data.interview);
        setAnswers(data.data.answers || []);

        const questions = data.data.questions || [];
        if (questions.length > 0) {
          const activeIndex = data.data.interview.currentQuestionIndex || 1;
          const activeQ = questions.find(q => q.sequenceNumber === activeIndex) || questions[questions.length - 1];
          setCurrentQuestion(activeQ);
        }

        // Initialize Timer based on duration (minutes to seconds)
        const durationSecs = (data.data.interview.duration || 15) * 60;
        setTimeLeft(durationSecs);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load interview');
      } finally {
        setLoading(false);
      }
    };

    loadInterview();

    return () => {
      socket.disconnect();
    };
  }, [interviewId]);

  // Timer Countdown Effect
  useEffect(() => {
    if (!interview || interview.status !== 'in-progress' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interview, timeLeft]);

  // Start Interview action
  const handleStart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await startInterview(interviewId);
      setInterview(res.interview);
      setCurrentQuestion(res.question);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  }, [interviewId]);

  // Submit Answer action
  const handleAnswerSubmit = useCallback(async (answerText, durationSeconds) => {
    if (!currentQuestion) return;
    try {
      setSubmitting(true);
      const res = await submitAnswer(interviewId, {
        questionId: currentQuestion._id,
        answer: answerText,
        duration: durationSeconds
      });

      setLastEvaluation(res.data.evaluation);

      if (res.data.isCompleted) {
        const finishRes = await endInterview(interviewId);
        setInterview(finishRes.data.interview);
        return { isCompleted: true, report: finishRes.data.report };
      } else {
        setCurrentQuestion(res.data.nextQuestion);
        return { isCompleted: false, nextQuestion: res.data.nextQuestion };
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [interviewId, currentQuestion]);

  return {
    interview,
    currentQuestion,
    answers,
    loading,
    submitting,
    lastEvaluation,
    timeLeft,
    error,
    handleStart,
    handleAnswerSubmit
  };
};
