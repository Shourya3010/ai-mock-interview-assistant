import React from 'react';
import { Clock } from 'lucide-react';

export const Timer = ({ secondsLeft = 900 }) => {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const isWarning = secondsLeft < 120; // less than 2 minutes

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
        isWarning
          ? 'bg-[#C95D56]/10 text-[#C95D56] border border-[#C95D56]/30'
          : 'bg-[#F7F3EB] text-[#2B1E16] border border-[#E8DEC8]'
      }`}
    >
      <Clock className="w-3.5 h-3.5 text-[#7A6B5D]" />
      <span>{formattedTime} remaining</span>
    </div>
  );
};
