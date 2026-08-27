import React from 'react';
import { User, Volume2, Mic, Brain, Sparkles } from 'lucide-react';

export const InterviewerAvatar = ({ state = 'idle', role = 'Technical Interviewer' }) => {
  const getStateConfig = () => {
    switch (state) {
      case 'speaking':
        return {
          label: 'AI interviewer is speaking',
          badge: 'bg-[#5B8C69]/10 text-[#5B8C69] border-[#5B8C69]/30',
          avatarBorder: 'border-[#5B8C69]/50',
          icon: Volume2
        };
      case 'listening':
        return {
          label: 'Listening to your answer...',
          badge: 'bg-[#B87D4B]/10 text-[#B87D4B] border-[#B87D4B]/30',
          avatarBorder: 'border-[#B87D4B]/50',
          icon: Mic
        };
      case 'thinking':
        return {
          label: 'Preparing the next question...',
          badge: 'bg-[#D99B26]/10 text-[#D99B26] border-[#D99B26]/30',
          avatarBorder: 'border-[#D99B26]/50 animate-pulse',
          icon: Brain
        };
      default:
        return {
          label: 'Virtual Interviewer Ready',
          badge: 'bg-[#F7F3EB] text-[#7A6B5D] border-[#E8DEC8]',
          avatarBorder: 'border-[#E8DEC8]',
          icon: Sparkles
        };
    }
  };

  const config = getStateConfig();
  const Icon = config.icon;

  return (
    <div className="panel-card p-6 flex flex-col items-center justify-center relative">
      {/* Avatar Circular Container */}
      <div className="relative mb-4">
        <div className={`w-28 h-28 rounded-full border-2 ${config.avatarBorder} p-1 transition-all duration-200`}>
          <div className="w-full h-full rounded-full bg-[#F7F3EB] border border-[#E8DEC8] flex items-center justify-center relative overflow-hidden">
            <User className="w-12 h-12 text-[#6E503B]" />
            
            {/* Audio pulse graphic when speaking */}
            {state === 'speaking' && (
              <div className="absolute bottom-2 flex items-end gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-[#5B8C69]/30 shadow-sm">
                <span className="w-1 h-3 bg-[#5B8C69] rounded-full animate-pulse" />
                <span className="w-1 h-4 bg-[#5B8C69] rounded-full animate-pulse [animation-delay:0.15s]" />
                <span className="w-1 h-2 bg-[#5B8C69] rounded-full animate-pulse [animation-delay:0.3s]" />
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-[#2B1E16] text-sm font-geist mb-2">{role}</h3>

      {/* Minimal Status Badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${config.badge}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{config.label}</span>
      </div>
    </div>
  );
};
