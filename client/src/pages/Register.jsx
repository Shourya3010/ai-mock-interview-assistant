import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await register({ name, email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#FBF8F3]">
      <div className="w-full max-w-sm bg-white border border-[#E8DEC8] rounded-2xl p-8 space-y-6 shadow-sm">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-[#B87D4B] text-white font-bold text-lg flex items-center justify-center mx-auto font-geist shadow-sm">
            AI
          </div>
          <h1 className="text-xl font-bold text-[#2B1E16] font-geist pt-2">Create your account</h1>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#C95D56]/10 border border-[#C95D56]/30 flex items-center gap-2 text-[#C95D56] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#7A6B5D] mb-1.5">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Shourya Singh"
              className="w-full bg-[#FBF8F3] border border-[#E8DEC8] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16] focus:outline-none focus:border-[#B87D4B] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#7A6B5D] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#FBF8F3] border border-[#E8DEC8] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16] focus:outline-none focus:border-[#B87D4B] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#7A6B5D] mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FBF8F3] border border-[#E8DEC8] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16] focus:outline-none focus:border-[#B87D4B] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#7A6B5D] mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#FBF8F3] border border-[#E8DEC8] rounded-xl px-3.5 py-2 text-sm text-[#2B1E16] focus:outline-none focus:border-[#B87D4B] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary text-xs py-2.5 mt-2"
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#7A6B5D] pt-2">
          Already have an account?{' '}
          <Link to="/login" className="text-[#B87D4B] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
