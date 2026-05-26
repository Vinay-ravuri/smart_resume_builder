import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const TOOLS = [
  { id: 'ats', icon: '🎯', title: 'ATS Score Checker', desc: 'Check how well your resume matches a job description' },
  { id: 'cover', icon: '✉️', title: 'Cover Letter Generator', desc: 'Generate a professional cover letter instantly' },
  { id: 'match', icon: '🔍', title: 'Job Match Analyzer', desc: 'See how well you match a job description' },
  { id: 'skill', icon: '📈', title: 'Skill Gap Analyzer', desc: 'Find missing skills for your target role' },
  { id: 'interview', icon: '🎤', title: 'Interview Prep', desc: 'Get personalized interview questions' },
];

export default function AITools() {
  const [activeTool, setActiveTool] = useState('ats');
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Form states
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tone, setTone] = useState('professional');
  const [targetRole, setTargetRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('junior');
  const [difficulty, setDifficulty] = useState('medium');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await api.getResumes();
      setResumes(data);
      if (data.length > 0) setSelectedResume(data[0]._id);
    } catch {
      toast.error('Failed to load resumes');
    }
  };

  const getSelectedResume = () => resumes.find(r => r._id === selectedResume);

  const handleRun = async () => {
    if (!selectedResume) return toast.error('Please select a resume first');
    const resume = getSelectedResume();
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (activeTool === 'ats') {
        if (!jobDescription) return toast.error('Please enter job description');
        const { data } = await api.checkATS({ resume, jobDescription });
        res = data;
      } else if (activeTool === 'cover') {
        if (!jobDescription || !companyName) return toast.error('Please fill all fields');
        const { data } = await api.generateCoverLetter({ resume, jobDescription, companyName, tone });
        res = data;
      } else if (activeTool === 'match') {
        if (!jobDescription) return toast.error('Please enter job description');
        const { data } = await api.matchJob({ resume, jobDescription });
        res = data;
      } else if (activeTool === 'skill') {
        if (!targetRole) return toast.error('Please enter target role');
        const { data } = await api.analyzeSkillGap({
          currentSkills: resume.skills,
          targetRole,
          experienceLevel
        });
        res = data;
      } else if (activeTool === 'interview') {
        const { data } = await api.generateInterviewQuestions({ resume, jobDescription, difficulty });
        res = data;
      }
      setResult(res);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI service failed. Add OpenAI API key.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition placeholder-gray-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span>📝</span>SmartResume<span className="text-indigo-400">AI</span>
        </Link>
        <div className="flex gap-4">
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition text-sm">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">🤖 AI Career Tools</h1>
          <p className="text-gray-400">Powered by OpenAI — Supercharge your job search</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left — Tool Selector */}
          <div className="col-span-3">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
              {TOOLS.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => { setActiveTool(tool.id); setResult(null); }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition ${activeTool === tool.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{tool.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{tool.title}</p>
                      <p className="text-xs opacity-70 mt-0.5">{tool.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle — Input */}
          <div className="col-span-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
              <h2 className="font-semibold text-lg">
                {TOOLS.find(t => t.id === activeTool)?.icon}{' '}
                {TOOLS.find(t => t.id === activeTool)?.title}
              </h2>

              {/* Resume Selector */}
              <div>
                <label className={labelClass}>Select Resume</label>
                <select
                  value={selectedResume}
                  onChange={e => setSelectedResume(e.target.value)}
                  className={inputClass}
                >
                  {resumes.length === 0 && <option>No resumes found</option>}
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.title || 'Untitled Resume'}</option>
                  ))}
                </select>
              </div>

              {/* ATS Score */}
              {activeTool === 'ats' && (
                <div>
                  <label className={labelClass}>Job Description</label>
                  <textarea rows={6} className={inputClass} placeholder="Paste the job description here..." value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
                </div>
              )}

              {/* Cover Letter */}
              {activeTool === 'cover' && (
                <>
                  <div>
                    <label className={labelClass}>Company Name</label>
                    <input className={inputClass} placeholder="e.g. Google" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Job Description</label>
                    <textarea rows={4} className={inputClass} placeholder="Paste job description..." value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Tone</label>
                    <select className={inputClass} value={tone} onChange={e => setTone(e.target.value)}>
                      <option value="professional">Professional</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="formal">Formal</option>
                      <option value="friendly">Friendly</option>
                    </select>
                  </div>
                </>
              )}

              {/* Job Match */}
              {activeTool === 'match' && (
                <div>
                  <label className={labelClass}>Job Description</label>
                  <textarea rows={6} className={inputClass} placeholder="Paste job description..." value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
                </div>
              )}

              {/* Skill Gap */}
              {activeTool === 'skill' && (
                <>
                  <div>
                    <label className={labelClass}>Target Role</label>
                    <input className={inputClass} placeholder="e.g. Full Stack Developer" value={targetRole} onChange={e => setTargetRole(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Experience Level</label>
                    <select className={inputClass} value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)}>
                      <option value="junior">Junior (0-2 years)</option>
                      <option value="mid">Mid (2-5 years)</option>
                      <option value="senior">Senior (5+ years)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Interview */}
              {activeTool === 'interview' && (
                <>
                  <div>
                    <label className={labelClass}>Job Description (optional)</label>
                    <textarea rows={4} className={inputClass} placeholder="Paste job description for better questions..." value={jobDescription} onChange={e => setJobDescription(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Difficulty</label>
                    <select className={inputClass} value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </>
              )}

              <button
                onClick={handleRun}
                disabled={loading || resumes.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Analyzing...
                  </>
                ) : `🚀 Run ${TOOLS.find(t => t.id === activeTool)?.title}`}
              </button>
            </div>
          </div>

          {/* Right — Results */}
          <div className="col-span-5">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 min-h-96">
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                  <span className="text-6xl mb-4">🤖</span>
                  <p className="text-center">Select a tool and click Run to see AI analysis</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-64">
                  <svg className="animate-spin h-12 w-12 text-indigo-500 mb-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <p className="text-gray-400">AI is analyzing your resume...</p>
                </div>
              )}

              {/* ATS Result */}
              {result && activeTool === 'ats' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">ATS Analysis Result</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${result.score >= 80 ? 'bg-green-900/50 text-green-400' : result.score >= 60 ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'}`}>
                      {result.rating}
                    </span>
                  </div>

                  {/* Score Circle */}
                  <div className="flex items-center gap-6 bg-gray-800 rounded-xl p-4">
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${result.score >= 80 ? 'text-green-400' : result.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {result.score}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">ATS Score</div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      {Object.entries(result.sections || {}).map(([key, val]) => (
                        <div key={key} className="bg-gray-700 rounded-lg p-2">
                          <div className="text-xs text-gray-400 capitalize">{key}</div>
                          <div className="text-sm font-bold text-white">{val}/100</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <p className="text-sm font-medium text-green-400 mb-2">✅ Matched Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedKeywords?.map((k, i) => (
                        <span key={i} className="bg-green-900/30 text-green-300 text-xs px-2 py-1 rounded-full border border-green-800">{k}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-red-400 mb-2">❌ Missing Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords?.map((k, i) => (
                        <span key={i} className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded-full border border-red-800">{k}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-indigo-400 mb-2">💡 Improvements</p>
                    <ul className="space-y-1">
                      {result.improvements?.map((imp, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-indigo-400 mt-0.5">→</span>{imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Cover Letter Result */}
              {result && activeTool === 'cover' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Cover Letter</h3>
                    <button
                      onClick={() => { navigator.clipboard.writeText(result.content); toast.success('Copied!'); }}
                      className="text-xs bg-indigo-900/50 border border-indigo-700 text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-800/50 transition"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {result.content}
                  </div>
                </div>
              )}

              {/* Job Match Result */}
              {result && activeTool === 'match' && (
                <div className="space-y-5">
                  <h3 className="font-bold text-lg">Job Match Analysis</h3>
                  <div className="bg-gray-800 rounded-xl p-4 text-center">
                    <div className={`text-5xl font-bold mb-1 ${result.matchPercentage >= 70 ? 'text-green-400' : result.matchPercentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {result.matchPercentage}%
                    </div>
                    <p className="text-gray-400 text-sm">Match Score</p>
                    <p className="text-gray-300 text-sm mt-2">{result.recommendation}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-green-400 mb-2">✅ Matched Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {result.matchedSkills?.map((s, i) => (
                        <span key={i} className="bg-green-900/30 text-green-300 text-xs px-2 py-1 rounded-full border border-green-800">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-red-400 mb-2">❌ Missing Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingSkills?.map((s, i) => (
                        <span key={i} className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded-full border border-red-800">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-indigo-400 mb-2">💡 Tailoring Tips</p>
                    <ul className="space-y-1">
                      {result.tailoringTips?.map((tip, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-indigo-400">→</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Skill Gap Result */}
              {result && activeTool === 'skill' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Skill Gap Analysis</h3>
                    <span className="text-indigo-400 font-bold">{result.currentSkillsRating}/100</span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-red-400 mb-2">🚨 Critical Missing Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {result.missingCriticalSkills?.map((s, i) => (
                        <span key={i} className="bg-red-900/30 text-red-300 text-xs px-2 py-1 rounded-full border border-red-800">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-indigo-400 mb-2">📚 Learning Path</p>
                    <div className="space-y-2">
                      {result.learningPath?.map((item, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-3 flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-white">{item.skill}</p>
                            <p className="text-xs text-gray-400">{item.resource}</p>
                          </div>
                          <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">{item.timeToLearn}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-indigo-900/20 border border-indigo-800 rounded-xl p-3">
                    <p className="text-sm text-indigo-300">⏱ Estimated time to be job-ready: <span className="font-bold">{result.estimatedTimeToReady}</span></p>
                  </div>
                </div>
              )}

              {/* Interview Result */}
              {result && activeTool === 'interview' && (
                <div className="space-y-5 max-h-[600px] overflow-y-auto">
                  <h3 className="font-bold text-lg">Interview Questions</h3>

                  <div>
                    <p className="text-sm font-medium text-blue-400 mb-3">💻 Technical Questions</p>
                    <div className="space-y-3">
                      {result.technical?.map((q, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-white">{q.question}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${q.difficulty === 'hard' ? 'bg-red-900/50 text-red-300' : q.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-green-900/50 text-green-300'}`}>
                              {q.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">💡 {q.hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-purple-400 mb-3">🧠 Behavioral Questions</p>
                    <div className="space-y-3">
                      {result.behavioral?.map((q, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-4">
                          <p className="text-sm font-medium text-white mb-2">{q.question}</p>
                          <p className="text-xs text-gray-400">💡 {q.hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-green-400 mb-3">🎯 Role Specific Questions</p>
                    <div className="space-y-3">
                      {result.roleSpecific?.map((q, i) => (
                        <div key={i} className="bg-gray-800 rounded-xl p-4">
                          <p className="text-sm font-medium text-white mb-2">{q.question}</p>
                          <p className="text-xs text-gray-400">💡 {q.hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}