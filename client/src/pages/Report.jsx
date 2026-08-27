import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getReport } from '../services/report.api';
import { ScoreCard } from '../components/ScoreCard';
import { LoadingState } from '../components/LoadingState';
import { Check, AlertTriangle, BookOpen, RotateCcw, Printer } from 'lucide-react';

export const Report = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await getReport(id);
        setReport(res.data);
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <LoadingState message="Generating Performance Assessment..." />;

  if (!report) {
    return (
      <div className="text-center my-12 space-y-4">
        <p className="text-[#7A6B5D] text-sm">Report not found.</p>
        <Link to="/dashboard" className="btn-primary text-xs">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 print:p-0">
      {/* Result Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2B1E16] font-geist">
            Interview Complete
          </h1>
          <p className="text-xs text-[#7A6B5D] mt-1">
            Here's how you performed.
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <Link
            to="/interview/setup"
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </Link>
        </div>
      </div>

      {/* Large Overall Score & 4 Cards */}
      <ScoreCard
        overallScore={report.overallScore}
        technical={report.technicalScore / 10}
        communication={report.communicationScore / 10}
        problemSolving={report.problemSolvingScore / 10}
        completeness={report.completenessScore / 10}
      />

      {/* Performance Summary */}
      <div className="panel-card p-6 space-y-3">
        <h3 className="font-semibold text-[#2B1E16] text-sm font-geist">
          Performance Summary
        </h3>
        <p className="text-[#2B1E16] text-xs leading-relaxed bg-[#F7F3EB] p-4 rounded-xl border border-[#E8DEC8] font-sans">
          "{report.summary}"
        </p>
      </div>

      {/* Strengths & Areas to Improve Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Strengths */}
        <div className="panel-card p-6 space-y-3">
          <h3 className="font-semibold text-[#2B1E16] text-sm font-geist flex items-center gap-2">
            <span className="text-[#5B8C69] font-bold">✓</span>
            <span>Your Strengths</span>
          </h3>
          <ul className="space-y-2">
            {report.strengths?.map((str, idx) => (
              <li key={idx} className="text-xs text-[#2B1E16] bg-[#F7F3EB] border border-[#E8DEC8] p-2.5 rounded-xl flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#5B8C69] shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white border border-[#E8DEC8] rounded-xl p-6 space-y-3 shadow-sm">
          <h3 className="font-semibold text-[#2B1E16] text-sm font-geist flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#D99B26]" />
            <span>Areas to Improve</span>
          </h3>
          <ul className="space-y-2">
            {report.weaknesses?.map((wk, idx) => (
              <li key={idx} className="text-xs text-[#2B1E16] bg-[#F7F3EB] border border-[#E8DEC8] p-2.5 rounded-xl flex items-center gap-2">
                <span className="text-[#D99B26] font-bold text-xs">⚠</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Practice Section */}
      <div className="panel-card p-6 space-y-4">
        <h3 className="font-semibold text-[#2B1E16] text-sm font-geist">
          Recommended for your next practice
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {report.recommendedTopics?.map((rec, idx) => (
            <div key={idx} className="bg-[#F7F3EB] border border-[#E8DEC8] p-3.5 rounded-xl space-y-1">
              <span className="text-xs font-medium text-[#2B1E16] block">{rec}</span>
              <span className="text-[10px] text-[#7A6B5D] font-mono block">Intermediate</span>
            </div>
          ))}
        </div>

        <Link
          to="/interview/setup"
          className="btn-primary text-xs inline-flex items-center gap-2"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Practice These Topics</span>
        </Link>
      </div>
    </div>
  );
};
