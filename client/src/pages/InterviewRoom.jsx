import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInterview } from '../hooks/useInterview';
import { useSpeech } from '../hooks/useSpeech';
import { InterviewerAvatar } from '../components/InterviewerAvatar';
import { QuestionCard } from '../components/QuestionCard';
import { AnswerInput } from '../components/AnswerInput';
import { Timer } from '../components/Timer';
import { LoadingState } from '../components/LoadingState';
import { Volume2, VolumeX, AlertTriangle, ArrowRight } from 'lucide-react';

export const InterviewRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    interview,
    currentQuestion,
    loading,
    submitting,
    lastEvaluation,
    timeLeft,
    error,
    handleAnswerSubmit
  } = useInterview(id);

  const { speakText, cancelSpeech } = useSpeech();
  const [interviewerState, setInterviewerState] = useState('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  // Read question text when updated
  useEffect(() => {
    if (currentQuestion?.question && !isMuted) {
      setInterviewerState('speaking');
      speakText(currentQuestion.question);
      const timer = setTimeout(() => setInterviewerState('idle'), 4000);
      return () => clearTimeout(timer);
    }
  }, [currentQuestion, speakText, isMuted]);

  useEffect(() => {
    if (submitting) setInterviewerState('thinking');
  }, [submitting]);

  if (loading) return <LoadingState message="Entering Virtual Interview Room..." />;

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 panel-card text-center space-y-4">
        <h2 className="text-base font-bold text-[#2B1E16]">Session Error</h2>
        <p className="text-xs text-[#7A6B5D]">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary text-xs">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isCompletedState = interview?.status === 'completed';

  if (isCompletedState) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 panel-card text-center space-y-4">
        <h2 className="text-lg font-bold text-[#2B1E16] font-geist">Interview Complete</h2>
        <p className="text-xs text-[#7A6B5D]">Here's how you performed.</p>
        <button
          onClick={() => navigate(`/report/${id}`)}
          className="btn-primary text-xs flex items-center justify-center gap-2 w-full"
        >
          <span>View Performance Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const onSubmitAnswer = async (answerText) => {
    setInterviewerState('thinking');
    const result = await handleAnswerSubmit(answerText, 45);
    if (result?.isCompleted) {
      navigate(`/report/${id}`);
    } else {
      setInterviewerState('idle');
    }
  };

  const handleEndInterview = () => {
    setShowEndModal(false);
    navigate(`/report/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Controls Bar */}
      <div className="bg-white border border-[#E8DEC8] rounded-xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm tracking-tight font-geist text-[#2B1E16]">
            InterviewAI
          </span>
          <span className="text-xs text-[#7A6B5D] font-mono hidden sm:inline-block">
            {interview?.role}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Timer secondsLeft={timeLeft} />

          <button
            onClick={() => {
              if (!isMuted) cancelSpeech();
              setIsMuted(!isMuted);
            }}
            className="p-1.5 rounded-lg bg-[#F7F3EB] text-[#7A6B5D] hover:text-[#2B1E16] border border-[#E8DEC8]"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowEndModal(true)}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#C95D56]/10 text-[#C95D56] border border-[#C95D56]/30 hover:bg-[#C95D56]/20"
          >
            End Interview
          </button>
        </div>
      </div>

      {/* Main Room Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interviewer Avatar */}
        <div className="lg:col-span-1 space-y-4">
          <InterviewerAvatar state={interviewerState} role={interview?.role} />

          {lastEvaluation && (
            <div className="panel-card p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#7A6B5D]">Answer Feedback</span>
                <span className="text-[#5B8C69] font-bold">{lastEvaluation.score}%</span>
              </div>
              <p className="text-xs text-[#2B1E16] italic">
                "{lastEvaluation.feedback}"
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Question & Answer Interaction */}
        <div className="lg:col-span-2 space-y-6">
          <QuestionCard
            question={currentQuestion}
            sequenceNumber={currentQuestion?.sequenceNumber || 1}
            totalQuestions={Math.round((interview?.duration || 15) / 3)}
            onSpeak={speakText}
          />

          <AnswerInput onSubmit={onSubmitAnswer} submitting={submitting} />
        </div>
      </div>

      {/* End Interview Confirmation Modal */}
      {showEndModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8DEC8] rounded-xl p-6 max-w-sm w-full space-y-4 text-center shadow-lg">
            <div className="w-10 h-10 rounded-full bg-[#C95D56]/10 text-[#C95D56] border border-[#C95D56]/30 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2B1E16] text-sm font-geist">End interview?</h3>
              <p className="text-xs text-[#7A6B5D] mt-1">
                Your current progress will be saved.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowEndModal(false)}
                className="btn-secondary text-xs w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleEndInterview}
                className="bg-[#C95D56] hover:bg-[#B34B44] text-white font-medium px-4 py-2 rounded-xl text-xs w-full transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
