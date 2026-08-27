import React from 'react';

export const LoadingState = ({ message = 'Loading AI Mock Interview System...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[350px] text-center">
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-[#B87D4B] text-white flex items-center justify-center font-bold text-xl font-geist shadow-md animate-pulse">
          AI
        </div>
      </div>
      <p className="text-[#7A6B5D] text-xs font-medium tracking-wide font-mono">{message}</p>
    </div>
  );
};
