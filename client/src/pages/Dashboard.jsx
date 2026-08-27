import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAnalytics } from '../services/report.api';
import { LoadingState } from '../components/LoadingState';
import { Plus, ArrowRight } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingState message="Retrieving Candidate Data from Database..." />;

  const statCards = [
    { label: 'Total Interviews', value: analytics?.totalInterviews ?? 0 },
    { label: 'Average Score', value: `${analytics?.averageScore ?? 0}%` },
    { label: 'Best Score', value: `${analytics?.bestScore ?? 0}%` },
    { label: 'Practice Time', value: analytics?.practiceTime ?? '0h 0m' }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2B1E16] font-geist">
            Welcome, {user?.name || 'Candidate'}
          </h1>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Ready for your next interview session?
          </p>
        </div>

        <Link
          to="/interview/setup"
          className="btn-primary text-xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Interview</span>
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="panel-card p-5">
            <span className="text-xs font-medium text-[#7A6B5D] block">{card.label}</span>
            <span className="text-2xl font-bold text-[#2B1E16] font-geist mt-1.5 block">
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* Recent Interviews Table */}
      <div className="panel-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[#2B1E16] text-sm font-geist">Recent Interviews</h3>
          <Link to="/interviews" className="text-xs text-[#B87D4B] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E8DEC8] text-[#7A6B5D] font-mono uppercase">
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DEC8]/60">
              {analytics?.recentInterviews?.length > 0 ? (
                analytics.recentInterviews.map((item) => (
                  <tr key={item._id} className="text-[#2B1E16] hover:bg-[#F7F3EB]/60 transition-colors">
                    <td className="py-3.5 font-medium">{item.role}</td>
                    <td className="py-3.5">
                      <span className="bg-[#F7F3EB] border border-[#E8DEC8] text-[#7A6B5D] px-2 py-0.5 rounded text-[11px]">
                        {item.interviewType}
                      </span>
                    </td>
                    <td className="py-3.5 font-semibold text-[#2B1E16]">{item.overallScore || 0}%</td>
                    <td className="py-3.5 text-[#7A6B5D] font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-right">
                      {item.status === 'completed' ? (
                        <Link
                          to={`/report/${item._id}`}
                          className="text-[#B87D4B] hover:underline font-medium"
                        >
                          View Report
                        </Link>
                      ) : (
                        <Link
                          to={`/interview/${item._id}`}
                          className="text-[#B87D4B] hover:underline font-medium"
                        >
                          Resume
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#7A6B5D]">
                    No interviews found in database. Click 'Start New Interview' to begin your first round.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
