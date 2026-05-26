import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const { data } = await api.login(form);
      loginUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float delay-300"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fadeInUp">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-white">
            <span>📝</span>
            Smart<span className="text-indigo-400">Resume</span>AI
          </Link>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl animate-fadeInUp delay-100">
          <h1 className="text-2xl font-bold text-white mb-6">Welcome Back 👋</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-800/80 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition placeholder-gray-500"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 animate-pulse-glow"
            >
              {loading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Signing in...</> : '🚀 Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}