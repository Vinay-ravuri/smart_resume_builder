import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const TABS = ['Personal', 'Summary', 'Education', 'Experience', 'Skills', 'Projects', 'Achievements', 'Certifications'];

const emptyExperience = { company: '', position: '', location: '', startDate: '', endDate: '', description: '', current: false };
const emptyEducation = { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' };
const emptyProject = { name: '', description: '', technologies: '', link: '' };
const emptyCert = { name: '', issuer: '', date: '', link: '' };

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Personal');
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState('');

  const [form, setForm] = useState({
    title: 'My Resume',
    template: 'modern',
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '',
    education: [{ ...emptyEducation }],
    experience: [{ ...emptyExperience }],
    skills: [''],
    projects: [{ ...emptyProject }],
    achievements: [''],
    certifications: [{ ...emptyCert }],
  });

  useEffect(() => {
    if (id) loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      const { data } = await api.getResumeById(id);
      setForm({
        ...data,
        skills: data.skills?.length ? data.skills : [''],
        achievements: data.achievements?.length ? data.achievements : [''],
      });
    } catch {
      toast.error('Failed to load resume');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        projects: form.projects.map(p => ({ ...p, technologies: typeof p.technologies === 'string' ? p.technologies.split(',').map(t => t.trim()) : p.technologies })),
        skills: form.skills.filter(s => s.trim()),
        achievements: form.achievements.filter(a => a.trim()),
      };
      if (id) {
        await api.updateResume(id, payload);
        toast.success('Resume updated!');
      } else {
        const { data } = await api.createResume(payload);
        toast.success('Resume saved!');
        navigate(`/builder/${data._id}`);
      }
    } catch {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const generateAI = async (type, extraData = {}) => {
    setAiLoading(type);
    try {
      const data = {
        name: form.personalInfo.fullName,
        role: form.experience[0]?.position || '',
        skills: form.skills.filter(Boolean),
        experience: form.experience.length,
        ...extraData,
      };
      const { data: res } = await api.generateAI({ type, data });
      if (type === 'summary') setForm(f => ({ ...f, summary: res.content }));
      toast.success('AI content generated!');
      return res.content;
    } catch {
      toast.error('AI generation failed. Check your API key.');
    } finally {
      setAiLoading('');
    }
  };

  const updatePersonal = (field, val) =>
    setForm(f => ({ ...f, personalInfo: { ...f.personalInfo, [field]: val } }));

  const updateArrayField = (key, index, field, val) =>
    setForm(f => ({ ...f, [key]: f[key].map((item, i) => i === index ? { ...item, [field]: val } : item) }));

  const addArrayItem = (key, template) =>
    setForm(f => ({ ...f, [key]: [...f[key], { ...template }] }));

  const removeArrayItem = (key, index) =>
    setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== index) }));

  const updateSimpleArray = (key, index, val) =>
    setForm(f => ({ ...f, [key]: f[key].map((item, i) => i === index ? val : item) }));

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition placeholder-gray-500 text-sm";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-950 z-10">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition">← Back</Link>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="bg-transparent border-b border-gray-700 text-white font-semibold px-2 py-1 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={form.template}
            onChange={e => setForm(f => ({ ...f, template: e.target.value }))}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            <option value="modern">🎨 Modern</option>
            <option value="minimal">✨ Minimal</option>
            <option value="professional">💼 Professional</option>
          </select>
          {id && (
            <Link to={`/preview/${id}`} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition">
              👁 Preview
            </Link>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >
            {saving ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> : '💾'}
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-gray-900 p-1 rounded-xl overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition flex-shrink-0 ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PERSONAL */}
        {activeTab === 'Personal' && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {[['fullName', 'Full Name', 'John Doe'], ['email', 'Email', 'john@example.com'], ['phone', 'Phone', '+1 234 567 8900'], ['location', 'Location', 'New York, NY'], ['linkedin', 'LinkedIn URL', 'linkedin.com/in/johndoe'], ['website', 'Portfolio/Website', 'johndoe.com']].map(([field, label, placeholder]) => (
                <div key={field}>
                  <label className={labelClass}>{label}</label>
                  <input className={inputClass} placeholder={placeholder} value={form.personalInfo[field] || ''} onChange={e => updatePersonal(field, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {activeTab === 'Summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Professional Summary</h2>
              <button
                onClick={() => generateAI('summary')}
                disabled={aiLoading === 'summary'}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-900/50 hover:bg-indigo-800/60 border border-indigo-700 rounded-lg text-sm text-indigo-300 transition"
              >
                {aiLoading === 'summary' ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> : '🤖'}
                {aiLoading === 'summary' ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea
              rows={6}
              className={inputClass}
              placeholder="Write a 3-4 sentence professional summary, or click 'AI Generate' to create one automatically..."
              value={form.summary}
              onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
            />
            <p className="text-gray-500 text-xs">💡 Fill in Personal Info and Experience first for better AI results</p>
          </div>
        )}

        {/* EDUCATION */}
        {activeTab === 'Education' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Education</h2>
            {form.education.map((edu, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-400">Education #{i + 1}</span>
                  {form.education.length > 1 && (
                    <button onClick={() => removeArrayItem('education', i)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[['institution', 'Institution', 'MIT'], ['degree', 'Degree', 'Bachelor of Science'], ['field', 'Field of Study', 'Computer Science'], ['gpa', 'GPA (optional)', '3.8'], ['startDate', 'Start Date', '2018'], ['endDate', 'End Date', '2022']].map(([field, label, ph]) => (
                    <div key={field}>
                      <label className={labelClass}>{label}</label>
                      <input className={inputClass} placeholder={ph} value={edu[field] || ''} onChange={e => updateArrayField('education', i, field, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('education', emptyEducation)} className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition text-sm">
              + Add Education
            </button>
          </div>
        )}

        {/* EXPERIENCE */}
        {activeTab === 'Experience' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Work Experience</h2>
            {form.experience.map((exp, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-400">Experience #{i + 1}</span>
                  {form.experience.length > 1 && (
                    <button onClick={() => removeArrayItem('experience', i)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[['position', 'Job Title', 'Software Engineer'], ['company', 'Company', 'Google'], ['location', 'Location', 'Remote'], ['startDate', 'Start Date', 'Jan 2022'], ['endDate', 'End Date', 'Present']].map(([field, label, ph]) => (
                    <div key={field}>
                      <label className={labelClass}>{label}</label>
                      <input className={inputClass} placeholder={ph} value={exp[field] || ''} onChange={e => updateArrayField('experience', i, field, e.target.value)} />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelClass}>Description / Responsibilities</label>
                    <button
                      onClick={async () => {
                        const content = await generateAI('experience', { position: exp.position, company: exp.company, responsibilities: exp.description });
                        if (content) updateArrayField('experience', i, 'description', content);
                      }}
                      disabled={!!aiLoading}
                      className="text-xs flex items-center gap-1 px-3 py-1.5 bg-indigo-900/40 border border-indigo-700 text-indigo-300 rounded-lg hover:bg-indigo-800/50 transition"
                    >
                      🤖 AI Generate
                    </button>
                  </div>
                  <textarea rows={4} className={inputClass} placeholder="Describe your responsibilities and achievements..." value={exp.description || ''} onChange={e => updateArrayField('experience', i, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('experience', emptyExperience)} className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition text-sm">
              + Add Experience
            </button>
          </div>
        )}

        {/* SKILLS */}
        {activeTab === 'Skills' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Skills</h2>
            <div className="space-y-2">
              {form.skills.map((skill, i) => (
                <div key={i} className="flex gap-2">
                  <input className={inputClass} placeholder="e.g. React.js, Python, AWS..." value={skill} onChange={e => updateSimpleArray('skills', i, e.target.value)} />
                  {form.skills.length > 1 && (
                    <button onClick={() => removeArrayItem('skills', i)} className="text-red-400 hover:text-red-300 px-3">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setForm(f => ({ ...f, skills: [...f.skills, ''] }))} className="text-sm text-indigo-400 hover:text-indigo-300 transition">
              + Add Skill
            </button>
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === 'Projects' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Projects</h2>
            {form.projects.map((proj, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Project #{i + 1}</span>
                  {form.projects.length > 1 && <button onClick={() => removeArrayItem('projects', i)} className="text-red-400 text-sm">Remove</button>}
                </div>
                {[['name', 'Project Name', 'E-Commerce Platform'], ['technologies', 'Technologies (comma separated)', 'React, Node.js, MongoDB'], ['link', 'Project Link', 'github.com/username/project']].map(([field, label, ph]) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <input className={inputClass} placeholder={ph} value={proj[field] || ''} onChange={e => updateArrayField('projects', i, field, e.target.value)} />
                  </div>
                ))}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={labelClass}>Description</label>
                    <button
                      onClick={async () => {
                        const content = await generateAI('project', { name: proj.name, technologies: proj.technologies, description: proj.description });
                        if (content) updateArrayField('projects', i, 'description', content);
                      }}
                      disabled={!!aiLoading}
                      className="text-xs flex items-center gap-1 px-3 py-1.5 bg-indigo-900/40 border border-indigo-700 text-indigo-300 rounded-lg hover:bg-indigo-800/50 transition"
                    >
                      🤖 AI Generate
                    </button>
                  </div>
                  <textarea rows={3} className={inputClass} placeholder="Describe what this project does..." value={proj.description || ''} onChange={e => updateArrayField('projects', i, 'description', e.target.value)} />
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('projects', emptyProject)} className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white transition text-sm">
              + Add Project
            </button>
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === 'Achievements' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Achievements</h2>
            {form.achievements.map((ach, i) => (
              <div key={i} className="flex gap-2">
                <input className={inputClass} placeholder="e.g. Won 1st place in national hackathon 2023" value={ach} onChange={e => updateSimpleArray('achievements', i, e.target.value)} />
                {form.achievements.length > 1 && <button onClick={() => removeArrayItem('achievements', i)} className="text-red-400 px-3">✕</button>}
              </div>
            ))}
            <button onClick={() => setForm(f => ({ ...f, achievements: [...f.achievements, ''] }))} className="text-sm text-indigo-400 hover:text-indigo-300">
              + Add Achievement
            </button>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {activeTab === 'Certifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Certifications</h2>
            {form.certifications.map((cert, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Cert #{i + 1}</span>
                  {form.certifications.length > 1 && <button onClick={() => removeArrayItem('certifications', i)} className="text-red-400 text-sm">Remove</button>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[['name', 'Certificate Name', 'AWS Solutions Architect'], ['issuer', 'Issuer', 'Amazon Web Services'], ['date', 'Date', 'Dec 2023'], ['link', 'Credential Link', 'credential.url']].map(([field, label, ph]) => (
                    <div key={field}>
                      <label className={labelClass}>{label}</label>
                      <input className={inputClass} placeholder={ph} value={cert[field] || ''} onChange={e => updateArrayField('certifications', i, field, e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => addArrayItem('certifications', emptyCert)} className="w-full py-3 border border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white transition text-sm">
              + Add Certification
            </button>
          </div>
        )}

        {/* Bottom Save */}
        <div className="mt-10 flex justify-between items-center pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm">All changes are saved to your account</p>
          <div className="flex gap-3">
            {id && <Link to={`/preview/${id}`} className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition">Preview Resume</Link>}
            <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition">
              {saving ? 'Saving...' : '💾 Save Resume'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
