import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ProgressChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-[#7A6B5D] text-xs panel-card">
        No interview history yet. Complete your first interview to see progress charts.
      </div>
    );
  }

  return (
    <div className="panel-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#2B1E16] text-sm font-geist">Performance Trajectory</h3>
        <span className="text-xs text-[#7A6B5D] font-mono">Overall Score Trend</span>
      </div>

      <div className="h-64 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B87D4B" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#B87D4B" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8DEC8" vertical={false} />
            <XAxis dataKey="interview" stroke="#7A6B5D" fontSize={11} tickLine={false} />
            <YAxis stroke="#7A6B5D" fontSize={11} domain={[0, 100]} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E8DEC8',
                borderRadius: '0.75rem',
                color: '#2B1E16',
                fontSize: '12px',
                boxShadow: '0 4px 12px rgba(43,30,22,0.08)'
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#B87D4B"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
