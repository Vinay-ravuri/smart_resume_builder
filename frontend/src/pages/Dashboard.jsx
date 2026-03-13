import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.getResumes();
      setResumes(data);
    } catch (err) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await api.deleteResume(id);
      setResumes(resumes.filter(r => r._id !== id));
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    toast.success('Logged out');
  };

  const templateBadgeColor = {
    modern: 'bg-indigo-900/50 text-indigo-300 border-indigo-700',
    minimal: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    professional: 'bg-amber-900/50 text-amber-300 border-amber-700',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span>📝</span>
          SmartResume<span className="text-indigo-400">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">👋 {user?.name}</span>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition px-3 py-1.5 border border-gray-700 rounded-lg">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">My Resumes</h1>
            <p className="text-gray-400 mt-1">Manage and build your professional resumes</p>
          </div>
          <Link
            to="/builder"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl font-semibold transition shadow-lg"
          >
            <span className="text-lg">+</span> New Resume
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Resumes', value: resumes.length, icon: '📄' },
            { label: 'Last Updated', value: resumes[0] ? new Date(resumes[0].updatedAt).toLocaleDateString() : '—', icon: '🕐' },
            { label: 'Templates Used', value: [...new Set(resumes.map(r => r.template))].length, icon: '🎨' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Resume List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-800 rounded-2xl">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
            <p className="text-gray-400 mb-6">Create your first AI-powered resume in minutes</p>
            <Link to="/builder" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold transition">
              Create Resume →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-indigo-400 transition">
                      {resume.title || 'Untitled Resume'}
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${templateBadgeColor[resume.template] || templateBadgeColor.modern}`}>
                    {resume.template}
                  </span>
                </div>

                <div className="text-gray-400 text-sm mb-5 space-y-1">
                  {resume.personalInfo?.fullName && <p>👤 {resume.personalInfo.fullName}</p>}
                  {resume.experience?.length > 0 && <p>💼 {resume.experience.length} experience{resume.experience.length > 1 ? 's' : ''}</p>}
                  {resume.skills?.length > 0 && <p>🛠 {resume.skills.length} skills</p>}
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/builder/${resume._id}`}
                    className="flex-1 text-center text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition font-medium"
                  >
                    ✏️ Edit
                  </Link>
                  <Link
                    to={`/preview/${resume._id}`}
                    className="flex-1 text-center text-sm bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-300 py-2 rounded-lg transition font-medium border border-indigo-800"
                  >
                    👁 Preview
                  </Link>
                  <button
                    onClick={() => handleDelete(resume._id)}
                    className="px-3 py-2 text-sm bg-red-900/30 hover:bg-red-900/60 text-red-400 rounded-lg transition border border-red-900/50"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
