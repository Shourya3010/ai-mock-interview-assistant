import React from 'react';

export const ScoreCard = ({ title = 'Performance Overview', overallScore = 0, technical = 0, communication = 0, problemSolving = 0, completeness = 0 }) => {
  const cards = [
    { label: 'Technical Knowledge', score: Math.round(technical * 10) },
    { label: 'Communication', score: Math.round(communication * 10) },
    { label: 'Problem Solving', score: Math.round(problemSolving * 10) },
    { label: 'Answer Quality', score: Math.round(completeness * 10) }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score Badge */}
      <div className="panel-card p-6 text-center">
        <span className="text-4xl font-extrabold text-[#B87D4B] font-geist block">
          {overallScore}%
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5D] font-mono mt-1 block">
          Overall Score
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="panel-card p-4">
            <span className="text-xs font-medium text-[#7A6B5D] block">{c.label}</span>
            <span className="text-xl font-bold text-[#2B1E16] font-geist mt-1 block">
              {c.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
