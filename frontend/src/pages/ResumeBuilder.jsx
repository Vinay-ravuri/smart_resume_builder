import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as api from '../services/api';

const STEPS = [
  { id: 1, label: 'Personal Info', icon: '👤', desc: 'Basic contact details' },
  { id: 2, label: 'Summary', icon: '📋', desc: 'Professional overview' },
  { id: 3, label: 'Experience', icon: '💼', desc: 'Work history' },
  { id: 4, label: 'Education', icon: '🎓', desc: 'Academic background' },
  { id: 5, label: 'Skills', icon: '🛠', desc: 'Technical & soft skills' },
  { id: 6, label: 'Projects', icon: '🚀', desc: 'Portfolio & work' },
  { id: 7, label: 'Achievements', icon: '🏆', desc: 'Awards & recognition' },
  { id: 8, label: 'Certifications', icon: '📜', desc: 'Licenses & certs' },
  { id: 9, label: 'Template', icon: '🎨', desc: 'Choose your design' },
];

const TEMPLATES = [
  { id: 'modern', name: 'Modern', color: 'from-blue-600 to-indigo-700', tag: '🔥 Popular', desc: 'Clean and contemporary' },
  { id: 'minimal', name: 'Minimal', color: 'from-gray-500 to-gray-700', tag: '🎯 ATS', desc: 'Simple and elegant' },
  { id: 'professional', name: 'Professional', color: 'from-emerald-600 to-teal-700', tag: '🏢 Corporate', desc: 'Traditional and formal' },
  { id: 'creative', name: 'Creative', color: 'from-purple-600 to-pink-600', tag: '✨ Bold', desc: 'Stand out and impress' },
  { id: 'tech', name: 'Tech', color: 'from-cyan-500 to-blue-600', tag: '💻 Dev', desc: 'Perfect for developers' },
  { id: 'executive', name: 'Executive', color: 'from-slate-600 to-slate-800', tag: '👔 Senior', desc: 'Leadership roles' },
  { id: 'startup', name: 'Startup', color: 'from-lime-500 to-green-600', tag: '🚀 Fresh', desc: 'Modern startup culture' },
  { id: 'designer', name: 'Designer', color: 'from-orange-500 to-red-500', tag: '🎨 Visual', desc: 'Creative professionals' },
  { id: 'academic', name: 'Academic', color: 'from-violet-600 to-purple-700', tag: '🎓 Scholar', desc: 'Research & academia' },
  { id: 'compact', name: 'Compact', color: 'from-teal-500 to-cyan-600', tag: '📄 Dense', desc: 'More info, less space' },
  { id: 'bold', name: 'Bold', color: 'from-red-600 to-orange-600', tag: '💪 Impact', desc: 'Make a statement' },
  { id: 'elegant', name: 'Elegant', color: 'from-rose-500 to-pink-600', tag: '💎 Premium', desc: 'Refined and polished' },
];

const emptyExp = { company: '', position: '', location: '', startDate: '', endDate: '', description: '', current: false };
const emptyEdu = { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' };
const emptyProj = { name: '', description: '', technologies: '', link: '' };
const emptyCert = { name: '', issuer: '', date: '', link: '' };

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const [form, setForm] = useState({
    title: 'My Resume', template: 'modern',
    personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '' },
    summary: '', education: [{ ...emptyEdu }], experience: [{ ...emptyExp }],
    skills: [''], projects: [{ ...emptyProj }], achievements: [''], certifications: [{ ...emptyCert }],
  });

  useEffect(() => { if (id) loadResume(); }, [id]);

  const loadResume = async () => {
    try {
      const { data } = await api.getResumeById(id);
      setForm({ ...data, skills: data.skills?.length ? data.skills : [''], achievements: data.achievements?.length ? data.achievements : [''] });
      setSelectedTemplate(data.template || 'modern');
    } catch { toast.error('Failed to load resume'); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form, template: selectedTemplate,
        projects: form.projects.map(p => ({ ...p, technologies: typeof p.technologies === 'string' ? p.technologies.split(',').map(t => t.trim()) : p.technologies })),
        skills: form.skills.filter(Boolean),
        achievements: form.achievements.filter(Boolean),
      };
      if (id) { await api.updateResume(id, payload); toast.success('Resume updated! ✅'); }
      else { const { data } = await api.createResume(payload); toast.success('Resume saved! ✅'); navigate(`/builder/${data._id}`); }
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const generateAI = async (type, extraData = {}) => {
    setAiLoading(type);
    try {
      const data = { name: form.personalInfo.fullName, role: form.experience[0]?.position || '', skills: form.skills.filter(Boolean), experience: form.experience.length, ...extraData };
      const { data: res } = await api.generateAI({ type, data });
      if (type === 'summary') setForm(f => ({ ...f, summary: res.content }));
      toast.success('AI content generated! 🤖');
      return res.content;
    } catch { toast.error('AI failed. Add OpenAI key first.'); }
    finally { setAiLoading(''); }
  };

  const up = (field, val) => setForm(f => ({ ...f, personalInfo: { ...f.personalInfo, [field]: val } }));
  const upArr = (key, i, field, val) => setForm(f => ({ ...f, [key]: f[key].map((item, idx) => idx === i ? { ...item, [field]: val } : item) }));
  const addArr = (key, tpl) => setForm(f => ({ ...f, [key]: [...f[key], { ...tpl }] }));
  const removeArr = (key, i) => setForm(f => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));
  const upSimple = (key, i, val) => setForm(f => ({ ...f, [key]: f[key].map((item, idx) => idx === i ? val : item) }));

  const inp = "w-full bg-gray-800/80 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition placeholder-gray-500 text-sm";
  const lbl = "block text-sm font-medium text-gray-300 mb-1.5";

  const AIButton = ({ onClick, type }) => (
    <button onClick={onClick} disabled={!!aiLoading} className="flex items-center gap-1.5 px-4 py-2 bg-indigo-950 border border-indigo-700 text-indigo-300 rounded-lg hover:bg-indigo-900 transition text-xs font-medium disabled:opacity-50">
      {aiLoading === type ? <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> : '🤖'}
      {aiLoading === type ? 'Generating...' : 'AI Write'}
    </button>
  );

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* ── LEFT SIDEBAR ── */}
      <div className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col fixed left-0 top-0 bottom-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-4">
            ← Back to Dashboard
          </Link>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full bg-transparent border-b border-gray-700 text-white font-bold text-lg px-0 py-1 focus:outline-none focus:border-indigo-500"
            placeholder="Resume Title"
          />
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {STEPS.map(step => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-left ${currentStep === step.id ? 'bg-indigo-600 text-white' : currentStep > step.id ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${currentStep === step.id ? 'bg-indigo-500' : currentStep > step.id ? 'bg-green-900 text-green-400' : 'bg-gray-800'}`}>
                {currentStep > step.id ? '✓' : step.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{step.label}</p>
                <p className="text-xs opacity-60">{step.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Save Button */}
        <div className="px-4 py-4 border-t border-gray-800">
          <button onClick={handleSave} disabled={saving} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm">
            {saving ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Saving...</> : '💾 Save Resume'}
          </button>
          {id && (
            <Link to={`/preview/${id}`} className="w-full mt-2 block text-center bg-gray-800 hover:bg-gray-700 py-2.5 rounded-xl text-sm transition">
              👁 Preview Resume
            </Link>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="ml-72 flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800 px-8 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold">{STEPS[currentStep - 1].icon} {STEPS[currentStep - 1].label}</h2>
            <p className="text-gray-400 text-sm">{STEPS[currentStep - 1].desc}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            Step {currentStep} of {STEPS.length}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-8 py-8">

          {/* STEP 1 — PERSONAL */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-2xl p-4 text-sm text-indigo-300">
                💡 This information appears at the top of your resume. Make sure it's accurate and professional.
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['fullName','Full Name','e.g. John Doe'],['email','Email Address','e.g. john@email.com'],['phone','Phone Number','e.g. +1 234 567 8900'],['location','Location','e.g. New York, NY'],['linkedin','LinkedIn Profile','linkedin.com/in/johndoe'],['website','Portfolio Website','johndoe.com']].map(([field, label, ph]) => (
                  <div key={field}>
                    <label className={lbl}>{label}</label>
                    <input className={inp} placeholder={ph} value={form.personalInfo[field] || ''} onChange={e => up(field, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2 — SUMMARY */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeInUp">
              <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-2xl p-4 text-sm text-indigo-300">
                💡 A strong summary is 3-4 sentences that highlight your key skills and value. Use AI to generate a professional one!
              </div>
              <div className="flex items-center justify-between">
                <label className={lbl}>Professional Summary</label>
                <AIButton onClick={() => generateAI('summary')} type="summary" />
              </div>
              <textarea rows={8} className={inp} placeholder="Write your professional summary here, or click 'AI Write' to generate one automatically..." value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Recommended: 50-150 words</span>
                <span>{form.summary.split(' ').filter(Boolean).length} words</span>
              </div>
            </div>
          )}

          {/* STEP 3 — EXPERIENCE */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-2xl p-4 text-sm text-indigo-300">
                💡 List your most recent experience first. Use AI to generate powerful bullet points for each role.
              </div>
              {form.experience.map((exp, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-indigo-400">Experience #{i + 1}</h3>
                    {form.experience.length > 1 && <button onClick={() => removeArr('experience', i)} className="text-red-400 hover:text-red-300 text-sm transition">✕ Remove</button>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[['position','Job Title','e.g. Software Engineer'],['company','Company','e.g. Google'],['location','Location','e.g. Remote'],['startDate','Start Date','e.g. Jan 2022'],['endDate','End Date','e.g. Present']].map(([field, label, ph]) => (
                      <div key={field}>
                        <label className={lbl}>{label}</label>
                        <input className={inp} placeholder={ph} value={exp[field] || ''} onChange={e => upArr('experience', i, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={lbl}>Responsibilities & Achievements</label>
                      <AIButton onClick={async () => { const c = await generateAI('experience', { position: exp.position, company: exp.company, responsibilities: exp.description }); if (c) upArr('experience', i, 'description', c); }} type={`exp${i}`} />
                    </div>
                    <textarea rows={5} className={inp} placeholder="Describe your key responsibilities and achievements..." value={exp.description || ''} onChange={e => upArr('experience', i, 'description', e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={() => addArr('experience', emptyExp)} className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-indigo-600 rounded-2xl text-gray-400 hover:text-indigo-400 transition text-sm font-medium">
                + Add Another Experience
              </button>
            </div>
          )}

          {/* STEP 4 — EDUCATION */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-2xl p-4 text-sm text-indigo-300">
                💡 Include your highest degree first. Add GPA only if it's above 3.5.
              </div>
              {form.education.map((edu, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-indigo-400">Education #{i + 1}</h3>
                    {form.education.length > 1 && <button onClick={() => removeArr('education', i)} className="text-red-400 text-sm">✕ Remove</button>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[['institution','University/School','e.g. MIT'],['degree','Degree','e.g. Bachelor of Science'],['field','Field of Study','e.g. Computer Science'],['gpa','GPA (Optional)','e.g. 3.8'],['startDate','Start Year','e.g. 2018'],['endDate','End Year','e.g. 2022']].map(([field, label, ph]) => (
                      <div key={field}>
                        <label className={lbl}>{label}</label>
                        <input className={inp} placeholder={ph} value={edu[field] || ''} onChange={e => upArr('education', i, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => addArr('education', emptyEdu)} className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-indigo-600 rounded-2xl text-gray-400 hover:text-indigo-400 transition text-sm font-medium">
                + Add Another Education
              </button>
            </div>
          )}

          {/* STEP 5 — SKILLS */}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fadeInUp">
              <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-2xl p-4 text-sm text-indigo-300">
                💡 Add 8-15 skills. Include both technical skills and tools. Separate each skill in its own field.
              </div>
              <div className="grid grid-cols-2 gap-3">
                {form.skills.map((skill, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input className={inp} placeholder={`Skill ${i + 1} (e.g. React.js)`} value={skill} onChange={e => upSimple('skills', i, e.target.value)} />
                    {form.skills.length > 1 && <button onClick={() => removeArr('skills', i)} className="text-red-400 hover:text-red-300 px-2 flex-shrink-0">✕</button>}
                  </div>
                ))}
              </div>
              <button onClick={() => setForm(f => ({ ...f, skills: [...f.skills, ''] }))} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition font-medium">
                + Add Skill
              </button>
            </div>
          )}

          {/* STEP 6 — PROJECTS */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-2xl p-4 text-sm text-indigo-300">
                💡 Include 2-4 strong projects. Use AI to write compelling descriptions that highlight your impact.
              </div>
              {form.projects.map((proj, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-indigo-400">Project #{i + 1}</h3>
                    {form.projects.length > 1 && <button onClick={() => removeArr('projects', i)} className="text-red-400 text-sm">✕ Remove</button>}
                  </div>
                  {[['name','Project Name','e.g. E-Commerce Platform'],['technologies','Technologies Used','e.g. React, Node.js, MongoDB'],['link','Project Link (optional)','e.g. github.com/you/project']].map(([field, label, ph]) => (
                    <div key={field}>
                      <label className={lbl}>{label}</label>
                      <input className={inp} placeholder={ph} value={proj[field] || ''} onChange={e => upArr('projects', i, field, e.target.value)} />
                    </div>
                  ))}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={lbl}>Project Description</label>
                      <AIButton onClick={async () => { const c = await generateAI('project', { name: proj.name, technologies: proj.technologies, description: proj.description }); if (c) upArr('projects', i, 'description', c); }} type={`proj${i}`} />
                    </div>
                    <textarea rows={4} className={inp} placeholder="Describe what this project does and your role in building it..." value={proj.description || ''} onChange={e => upArr('projects', i, 'description', e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={() => addArr('projects', emptyProj)} className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-indigo-600 rounded-2xl text-gray-400 hover:text-indigo-400 transition text-sm font-medium">
                + Add Another Project
              </button>
            </div>
          )}

          {/* STEP 7 — ACHIEVEMENTS */}
          {currentStep === 7 && (
            <div className="space-y-5 animate-fadeInUp">
              <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-2xl p-4 text-sm text-indigo-300">
                💡 Add notable achievements, awards, or recognitions. Quantify when possible (e.g. "Won 1st place out of 500 participants").
              </div>
              <div className="space-y-3">
                {form.achievements.map((ach, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-sm text-gray-400 flex-shrink-0">{i + 1}</div>
                    <input className={inp} placeholder="e.g. Won 1st place in National Hackathon 2023 (500+ participants)" value={ach} onChange={e => upSimple('achievements', i, e.target.value)} />
                    {form.achievements.length > 1 && <button onClick={() => removeArr('achievements', i)} className="text-red-400 hover:text-red-300 flex-shrink-0">✕</button>}
                  </div>
                ))}
              </div>
              <button onClick={() => setForm(f => ({ ...f, achievements: [...f.achievements, ''] }))} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm transition font-medium">
                + Add Achievement
              </button>
            </div>
          )}

          {/* STEP 8 — CERTIFICATIONS */}
          {currentStep === 8 && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-2xl p-4 text-sm text-indigo-300">
                💡 Add professional certifications like AWS, Google, Microsoft, or any industry-recognized credentials.
              </div>
              {form.certifications.map((cert, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-indigo-400">Certification #{i + 1}</h3>
                    {form.certifications.length > 1 && <button onClick={() => removeArr('certifications', i)} className="text-red-400 text-sm">✕ Remove</button>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[['name','Certificate Name','e.g. AWS Solutions Architect'],['issuer','Issuing Organization','e.g. Amazon Web Services'],['date','Issue Date','e.g. Dec 2023'],['link','Credential Link','e.g. credential.url']].map(([field, label, ph]) => (
                      <div key={field}>
                        <label className={lbl}>{label}</label>
                        <input className={inp} placeholder={ph} value={cert[field] || ''} onChange={e => upArr('certifications', i, field, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => addArr('certifications', emptyCert)} className="w-full py-4 border-2 border-dashed border-gray-700 hover:border-indigo-600 rounded-2xl text-gray-400 hover:text-indigo-400 transition text-sm font-medium">
                + Add Certification
              </button>
            </div>
          )}

          {/* STEP 9 — TEMPLATE */}
          {currentStep === 9 && (
            <div className="space-y-6 animate-fadeInUp">
              <div className="bg-indigo-950/30 border border-indigo-800/30 rounded-2xl p-4 text-sm text-indigo-300">
                💡 Choose a template that matches your industry. ATS-friendly templates work best for large companies.
              </div>
              <div className="grid grid-cols-3 gap-4">
                {TEMPLATES.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${selectedTemplate === t.id ? 'border-indigo-500 shadow-lg shadow-indigo-900/30 scale-105' : 'border-gray-800 hover:border-gray-600'}`}
                  >
                    <div className={`bg-gradient-to-br ${t.color} aspect-[3/4] p-4 relative`}>
                      <span className="absolute top-2 right-2 bg-black/40 text-white text-[9px] px-2 py-0.5 rounded-full">{t.tag}</span>
                      {selectedTemplate === t.id && (
                        <div className="absolute top-2 left-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 text-xs font-bold">✓</span>
                        </div>
                      )}
                      <div className="space-y-1.5 mt-4">
                        <div className="h-2 bg-white/50 rounded w-3/4"></div>
                        <div className="h-1.5 bg-white/25 rounded w-full"></div>
                        <div className="h-1.5 bg-white/25 rounded w-5/6"></div>
                        <div className="mt-2 h-1.5 bg-white/35 rounded w-1/2"></div>
                        <div className="h-1 bg-white/15 rounded w-full"></div>
                        <div className="h-1 bg-white/15 rounded w-4/5"></div>
                        <div className="mt-1.5 h-1.5 bg-white/30 rounded w-2/3"></div>
                        <div className="h-1 bg-white/15 rounded w-full"></div>
                        <div className="h-1 bg-white/15 rounded w-3/4"></div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-900">
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-800">
            <button
              onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
            >
              ← Previous
            </button>

            <div className="flex gap-1">
              {STEPS.map(s => (
                <button key={s.id} onClick={() => setCurrentStep(s.id)} className={`w-2 h-2 rounded-full transition-all ${currentStep === s.id ? 'bg-indigo-500 w-6' : currentStep > s.id ? 'bg-green-500' : 'bg-gray-700'}`}></button>
              ))}
            </div>

            {currentStep < STEPS.length ? (
              <button
                onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition flex items-center gap-2"
              >
                Next → 
              </button>
            ) : (
              <button onClick={handleSave} disabled={saving} className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-bold transition flex items-center gap-2">
                {saving ? 'Saving...' : '🎉 Finish & Save'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}