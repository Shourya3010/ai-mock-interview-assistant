import React from 'react';
import { Volume2, Tag } from 'lucide-react';

export const QuestionCard = ({ question, sequenceNumber = 1, totalQuestions = 10, onSpeak }) => {
  if (!question) return null;

  return (
    <div className="panel-card p-6 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-[#B87D4B] bg-[#B87D4B]/10 border border-[#B87D4B]/20 px-2.5 py-0.5 rounded-full">
            Question {sequenceNumber} of {totalQuestions}
          </span>
          <span className="text-xs font-medium text-[#7A6B5D] bg-[#F7F3EB] border border-[#E8DEC8] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#B87D4B]" />
            {question.topic}
          </span>
        </div>

        {onSpeak && (
          <button
            onClick={() => onSpeak(question.question)}
            className="p-1.5 rounded-lg bg-[#F7F3EB] hover:bg-[#E8DEC8] text-[#7A6B5D] hover:text-[#2B1E16] border border-[#E8DEC8] transition-colors"
            title="Replay Question Audio"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Question Text */}
      <h2 className="text-lg sm:text-xl font-medium text-[#2B1E16] font-geist leading-relaxed">
        "{question.question}"
      </h2>
    </div>
  );
};
