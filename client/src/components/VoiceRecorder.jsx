import React from 'react';
import { Mic, Square } from 'lucide-react';

export const VoiceRecorder = ({ isListening, onStart, onStop, isSupported = true }) => {
  if (!isSupported) {
    return (
      <span className="text-xs text-[#7A6B5D] italic">
        Voice input not supported in this browser.
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={isListening ? onStop : onStart}
      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
        isListening
          ? 'bg-[#C95D56]/15 text-[#C95D56] border border-[#C95D56]/30 animate-pulse'
          : 'bg-[#F7F3EB] text-[#2B1E16] hover:bg-[#E8DEC8] border border-[#E8DEC8]'
      }`}
    >
      {isListening ? (
        <>
          <Square className="w-3.5 h-3.5 fill-[#C95D56]" />
          <span>Stop Recording</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-[#B87D4B]" />
          <span>🎤 Hold to speak</span>
        </>
      )}
    </button>
  );
};
