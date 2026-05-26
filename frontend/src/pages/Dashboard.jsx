import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resumes');
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.getResumes();
      setResumes(data);
    } catch { toast.error('Failed to load resumes'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await api.deleteResume(id);
      setResumes(resumes.filter(r => r._id !== id));
      toast.success('Resume deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    toast.success('Logged out');
  };

  const templateBadge = {
    modern: 'bg-indigo-900/50 text-indigo-300 border-indigo-700',
    minimal: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    professional: 'bg-amber-900/50 text-amber-300 border-amber-700',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-30">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2 text-xl font-black">
            <span>📝</span>
            Smart<span className="text-indigo-400">Resume</span>AI
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { id: 'resumes', icon: '📄', label: 'My Resumes' },
            { id: 'create', icon: '✏️', label: 'Create Resume', link: '/builder' },
            { id: 'ai', icon: '🤖', label: 'AI Career Tools', link: '/ai-tools' },
            { id: 'ats', icon: '🎯', label: 'ATS Checker', link: '/ai-tools' },
            { id: 'templates', icon: '🎨', label: 'Templates', link: '/builder' },
          ].map(item => (
            item.link ? (
              <Link
                key={item.id}
                to={item.link}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition text-sm font-medium"
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-sm font-medium ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            )
          ))}
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition text-xs">
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800 px-8 py-4 flex items-center justify-between z-20">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage your resumes and career tools</p>
          </div>
          <Link
            to="/builder"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl font-semibold transition text-sm"
          >
            + New Resume
          </Link>
        </div>

        <div className="px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Resumes', value: resumes.length, icon: '📄', color: 'text-indigo-400' },
              { label: 'Last Updated', value: resumes[0] ? new Date(resumes[0].updatedAt).toLocaleDateString() : '—', icon: '🕐', color: 'text-blue-400' },
              { label: 'Templates Used', value: [...new Set(resumes.map(r => r.template))].length, icon: '🎨', color: 'text-purple-400' },
              { label: 'AI Tools', value: '5', icon: '🤖', color: 'text-green-400' },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: '✏️', title: 'Create Resume', desc: 'Build a new resume with AI', link: '/builder', color: 'bg-indigo-600 hover:bg-indigo-500' },
              { icon: '🤖', title: 'AI Career Tools', desc: 'ATS, Cover Letter & More', link: '/ai-tools', color: 'bg-purple-700 hover:bg-purple-600' },
              { icon: '🎯', title: 'ATS Checker', desc: 'Check your resume score', link: '/ai-tools', color: 'bg-emerald-700 hover:bg-emerald-600' },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.link}
                className={`${action.color} rounded-2xl p-5 transition flex items-center gap-4`}
              >
                <span className="text-3xl">{action.icon}</span>
                <div>
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-sm opacity-80">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Resumes Grid */}
          <div>
            <h2 className="text-xl font-bold mb-5">My Resumes</h2>
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
                <p className="text-gray-400 mb-6">Create your first AI-powered resume</p>
                <Link to="/builder" className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-semibold transition">
                  Create Resume →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resumes.map((resume) => (
                  <div key={resume._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-indigo-700/50 transition group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg group-hover:text-indigo-400 transition">
                          {resume.title || 'Untitled Resume'}
                        </h3>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${templateBadge[resume.template] || templateBadge.modern}`}>
                        {resume.template}
                      </span>
                    </div>
                    <div className="text-gray-400 text-sm mb-5 space-y-1">
                      {resume.personalInfo?.fullName && <p>👤 {resume.personalInfo.fullName}</p>}
                      {resume.experience?.length > 0 && <p>💼 {resume.experience.length} experience{resume.experience.length > 1 ? 's' : ''}</p>}
                      {resume.skills?.length > 0 && <p>🛠 {resume.skills.length} skills</p>}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/builder/${resume._id}`} className="flex-1 text-center text-sm bg-gray-800 hover:bg-gray-700 py-2 rounded-lg transition font-medium">
                        ✏️ Edit
                      </Link>
                      <Link to={`/preview/${resume._id}`} className="flex-1 text-center text-sm bg-indigo-900/50 hover:bg-indigo-800/50 text-indigo-300 py-2 rounded-lg transition font-medium border border-indigo-800">
                        👁 Preview
                      </Link>
                      <button onClick={() => handleDelete(resume._id)} className="px-3 py-2 text-sm bg-red-900/30 hover:bg-red-900/60 text-red-400 rounded-lg transition border border-red-900/50">
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}