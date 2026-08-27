import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserInterviews } from '../services/interview.api';
import { LoadingState } from '../components/LoadingState';
import { History, FileText, Play, Calendar, Tag } from 'lucide-react';

export const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getUserInterviews();
        setInterviews(res.data || []);
      } catch (err) {
        console.error('Failed to fetch interview history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <LoadingState message="Loading your interview history..." />;

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#2B1E16] font-geist">
          Interview History & Logs
        </h1>
        <p className="text-xs text-[#7A6B5D] mt-1">
          Review past mock interview sessions, resume in-progress interviews, and examine performance reports.
        </p>
      </div>

      {interviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((session) => (
            <div
              key={session._id}
              className="panel-card p-6 flex flex-col justify-between gap-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#2B1E16] text-base font-geist">{session.role}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono text-[#7A6B5D] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase font-mono border ${
                      session.status === 'completed'
                        ? 'bg-[#5B8C69]/10 text-[#5B8C69] border-[#5B8C69]/30'
                        : session.status === 'in-progress'
                        ? 'bg-[#D99B26]/10 text-[#D99B26] border-[#D99B26]/30 animate-pulse'
                        : 'bg-[#F7F3EB] text-[#7A6B5D] border-[#E8DEC8]'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-[#F7F3EB] border border-[#E8DEC8] text-[#7A6B5D]">
                    {session.interviewType} Round
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F7F3EB] border border-[#E8DEC8] text-[#B87D4B] font-medium">
                    {session.difficulty}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#F7F3EB] border border-[#E8DEC8] text-[#7A6B5D]">
                    {session.duration} mins
                  </span>
                </div>

                <p className="text-xs text-[#7A6B5D] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#B87D4B]" />
                  <span>{session.topics?.join(', ')}</span>
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#7A6B5D] block">Score</span>
                  <span className="text-lg font-bold text-[#2B1E16] font-geist">{session.overallScore || 0}%</span>
                </div>

                {session.status === 'completed' ? (
                  <Link
                    to={`/report/${session._id}`}
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </Link>
                ) : (
                  <Link
                    to={`/interview/${session._id}`}
                    className="btn-secondary text-xs flex items-center gap-1.5 text-[#B87D4B]"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#B87D4B]" />
                    <span>Resume Session</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="panel-card p-12 text-center text-[#7A6B5D] space-y-4">
          <History className="w-10 h-10 mx-auto text-[#7A6B5D]/60" />
          <p className="text-xs">No past interview records found.</p>
          <Link to="/interview/setup" className="btn-primary text-xs inline-block">
            Start Your First Interview
          </Link>
        </div>
      )}
    </div>
  );
};
