import React, { useState, useEffect } from 'react';
import { VoiceRecorder } from './VoiceRecorder';
import { useSpeech } from '../hooks/useSpeech';
import { Send, Loader2 } from 'lucide-react';

export const AnswerInput = ({ onSubmit, submitting = false }) => {
  const [answer, setAnswer] = useState('');
  const { isListening, transcript, speechSupported, startListening, stopListening, resetTranscript } = useSpeech();

  useEffect(() => {
    if (transcript) {
      setAnswer(prev => (prev ? `${prev} ${transcript}` : transcript));
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim() || submitting) return;
    if (isListening) stopListening();
    onSubmit(answer.trim());
    setAnswer('');
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <form onSubmit={handleSubmit} className="panel-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5D] font-mono">
          YOUR ANSWER
        </label>
        <span className="text-xs text-[#7A6B5D] font-mono">
          {wordCount} words
        </span>
      </div>

      <div className="relative">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Speak your answer or type here..."
          rows={4}
          disabled={submitting}
          className="w-full bg-[#FBF8F3] border border-[#E8DEC8] rounded-xl p-3.5 text-[#2B1E16] text-sm focus:outline-none focus:border-[#B87D4B] focus:bg-white transition-all resize-none font-sans placeholder:text-[#7A6B5D]/60 disabled:opacity-50"
        />
        {isListening && (
          <div className="absolute top-3 right-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#C95D56]/10 border border-[#C95D56]/30 text-[#C95D56] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#C95D56] animate-ping" />
            <span>Recording...</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <VoiceRecorder
          isListening={isListening}
          onStart={startListening}
          onStop={stopListening}
          isSupported={speechSupported}
        />

        <button
          type="submit"
          disabled={!answer.trim() || submitting}
          className="btn-primary text-xs flex items-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Evaluating...</span>
            </>
          ) : (
            <>
              <span>Submit Answer</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
