import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInterview } from '../services/interview.api';
import { ROLES, INTERVIEW_TYPES, DIFFICULTY_LEVELS, TOPICS, DURATIONS } from '../utils/constants';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';

export const InterviewSetup = () => {
  const [role, setRole] = useState('Full Stack Developer');
  const [interviewType, setInterviewType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [selectedTopics, setSelectedTopics] = useState(['JavaScript', 'React', 'Node.js']);
  const [duration, setDuration] = useState(15);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      if (selectedTopics.length === 1) return;
      setSelectedTopics(prev => prev.filter(t => t !== topic));
    } else {
      setSelectedTopics(prev => [...prev, topic]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic for your interview.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const data = await createInterview({
        role,
        interviewType,
        difficulty,
        topics: selectedTopics,
        duration
      });
      navigate(`/interview/${data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start interview.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-[#2B1E16] font-geist">
          Set up your interview
        </h1>
        <p className="text-xs text-[#7A6B5D] mt-1">
          Choose how you want to practice.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#C95D56]/10 border border-[#C95D56]/30 flex items-center gap-2 text-[#C95D56] text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div className="panel-card p-5 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5D] font-mono block">
            Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`p-3 rounded-xl text-left text-xs font-medium border transition-all ${
                  role === r
                    ? 'bg-[#F7F3EB] border-[#B87D4B] text-[#B87D4B] font-semibold'
                    : 'bg-white border-[#E8DEC8] text-[#7A6B5D] hover:text-[#2B1E16]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Round Type & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="panel-card p-5 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5D] font-mono block">
              Interview Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INTERVIEW_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setInterviewType(t)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                    interviewType === t
                      ? 'bg-[#F7F3EB] border-[#B87D4B] text-[#B87D4B] font-semibold'
                      : 'bg-white border-[#E8DEC8] text-[#7A6B5D] hover:text-[#2B1E16]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="panel-card p-5 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5D] font-mono block">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_LEVELS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                    difficulty === d
                      ? 'bg-[#F7F3EB] border-[#B87D4B] text-[#B87D4B] font-semibold'
                      : 'bg-white border-[#E8DEC8] text-[#7A6B5D] hover:text-[#2B1E16]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="panel-card p-5 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5D] font-mono block">
            Topics
          </label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => toggleTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#F7F3EB] border-[#B87D4B] text-[#B87D4B]'
                      : 'bg-white border-[#E8DEC8] text-[#7A6B5D] hover:text-[#2B1E16]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-[#B87D4B]" />}
                  <span>{topic}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div className="panel-card p-5 space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#7A6B5D] font-mono block">
            Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DURATIONS.map((dur) => (
              <button
                key={dur.value}
                type="button"
                onClick={() => setDuration(dur.value)}
                className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                  duration === dur.value
                    ? 'bg-[#F7F3EB] border-[#B87D4B] text-[#B87D4B] font-semibold'
                    : 'bg-white border-[#E8DEC8] text-[#7A6B5D] hover:text-[#2B1E16]'
                }`}
              >
                {dur.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary text-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary text-xs flex items-center gap-2"
          >
            <span>{submitting ? 'Starting...' : 'Start Interview'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
