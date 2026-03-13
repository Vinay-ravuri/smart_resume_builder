import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as api from '../services/api';

// ─── MODERN TEMPLATE ─────────────────────────────────────────────────────────
function ModernTemplate({ resume }) {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-gray-800 min-h-[1100px] font-sans" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="bg-gray-900 text-white px-10 py-8">
        <h1 className="text-4xl font-bold tracking-wide">{p.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 mt-3 text-gray-300 text-sm">
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>🔗 {p.linkedin}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>

      <div className="px-10 py-8 space-y-7">
        {resume.summary && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Summary</h2>
            <p className="text-gray-700 leading-relaxed text-sm">{resume.summary}</p>
          </section>
        )}

        {resume.experience?.length > 0 && resume.experience[0].company && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Experience</h2>
            {resume.experience.map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-base">{exp.position}</h3>
                    <p className="text-gray-600 text-sm">{exp.company}{exp.location ? ` — ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-gray-500 text-sm whitespace-nowrap">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                {exp.description && <p className="text-gray-700 text-sm mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {resume.education?.length > 0 && resume.education[0].institution && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Education</h2>
            {resume.education.map((edu, i) => (
              <div key={i} className="flex justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p className="text-gray-600 text-sm">{edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</p>
                </div>
                <span className="text-gray-500 text-sm">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {resume.skills?.filter(Boolean).length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.filter(Boolean).map((skill, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">{skill}</span>
              ))}
            </div>
          </section>
        )}

        {resume.projects?.length > 0 && resume.projects[0].name && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Projects</h2>
            {resume.projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-bold text-sm">{proj.name} {proj.link && <span className="font-normal text-blue-600 text-xs">({proj.link})</span>}</h3>
                {proj.technologies?.length > 0 && <p className="text-gray-500 text-xs mb-1">Tech: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</p>}
                {proj.description && <p className="text-gray-700 text-sm">{proj.description}</p>}
              </div>
            ))}
          </section>
        )}

        {resume.certifications?.length > 0 && resume.certifications[0].name && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Certifications</h2>
            {resume.certifications.map((cert, i) => (
              <div key={i} className="flex justify-between mb-2 text-sm">
                <span className="font-medium">{cert.name} — <span className="text-gray-500">{cert.issuer}</span></span>
                <span className="text-gray-500">{cert.date}</span>
              </div>
            ))}
          </section>
        )}

        {resume.achievements?.filter(Boolean).length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 border-b-2 border-gray-900 pb-1 mb-3">Achievements</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {resume.achievements.filter(Boolean).map((ach, i) => <li key={i}>{ach}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── MINIMAL TEMPLATE ────────────────────────────────────────────────────────
function MinimalTemplate({ resume }) {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white text-gray-800 min-h-[1100px] px-12 py-10" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-light tracking-widest uppercase text-gray-900 mb-3">{p.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-5 text-gray-500 text-sm">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-6 text-sm">
        {resume.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">About</h2>
            <p className="text-gray-600 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {resume.experience?.filter(e => e.company).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Experience</h2>
            {resume.experience.filter(e => e.company).map((exp, i) => (
              <div key={i} className="mb-4 pl-4 border-l border-gray-200">
                <div className="flex justify-between">
                  <strong>{exp.position}</strong>
                  <span className="text-gray-400">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                <p className="text-gray-500">{exp.company}</p>
                {exp.description && <p className="text-gray-600 mt-1 leading-relaxed whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {resume.education?.filter(e => e.institution).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Education</h2>
            {resume.education.filter(e => e.institution).map((edu, i) => (
              <div key={i} className="flex justify-between mb-2">
                <div>
                  <strong>{edu.institution}</strong>
                  <p className="text-gray-500">{edu.degree} {edu.field && `· ${edu.field}`}</p>
                </div>
                <span className="text-gray-400">{edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

        {resume.skills?.filter(Boolean).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Skills</h2>
            <p className="text-gray-600">{resume.skills.filter(Boolean).join(' · ')}</p>
          </div>
        )}

        {resume.projects?.filter(p => p.name).length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Projects</h2>
            {resume.projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-3">
                <strong>{proj.name}</strong>
                {proj.technologies && <span className="text-gray-400 text-xs ml-2">({Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies})</span>}
                {proj.description && <p className="text-gray-600 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFESSIONAL TEMPLATE ───────────────────────────────────────────────────
function ProfessionalTemplate({ resume }) {
  const p = resume.personalInfo || {};
  return (
    <div className="bg-white min-h-[1100px] flex text-sm" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Sidebar */}
      <div className="bg-slate-800 text-white w-64 flex-shrink-0 px-6 py-8">
        <h1 className="text-xl font-bold leading-tight mb-1">{p.fullName || 'Your Name'}</h1>
        <div className="text-slate-300 text-xs space-y-1.5 mt-4 border-t border-slate-600 pt-4">
          {p.email && <p>✉ {p.email}</p>}
          {p.phone && <p>📞 {p.phone}</p>}
          {p.location && <p>📍 {p.location}</p>}
          {p.linkedin && <p>🔗 {p.linkedin}</p>}
          {p.website && <p>🌐 {p.website}</p>}
        </div>

        {resume.skills?.filter(Boolean).length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-bold">Skills</h2>
            <div className="space-y-1.5">
              {resume.skills.filter(Boolean).map((skill, i) => (
                <div key={i} className="text-slate-200 text-xs flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></span>
                  {skill}
                </div>
              ))}
            </div>
          </div>
        )}

        {resume.certifications?.filter(c => c.name).length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-3 font-bold">Certs</h2>
            {resume.certifications.filter(c => c.name).map((cert, i) => (
              <div key={i} className="text-slate-200 text-xs mb-2">
                <p className="font-medium">{cert.name}</p>
                <p className="text-slate-400">{cert.issuer} · {cert.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 px-8 py-8 space-y-6">
        {resume.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {resume.experience?.filter(e => e.company).length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Work Experience</h2>
            {resume.experience.filter(e => e.company).map((exp, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{exp.position}</h3>
                    <p className="text-gray-500">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                  </div>
                  <span className="text-gray-400 text-xs whitespace-nowrap bg-gray-100 px-2 py-1 rounded">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                {exp.description && <p className="text-gray-700 mt-2 leading-relaxed whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </section>
        )}

        {resume.projects?.filter(p => p.name).length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Projects</h2>
            {resume.projects.filter(p => p.name).map((proj, i) => (
              <div key={i} className="mb-3">
                <h3 className="font-bold">{proj.name}</h3>
                {proj.technologies && <p className="text-gray-400 text-xs">Tech: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}</p>}
                {proj.description && <p className="text-gray-700 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </section>
        )}

        {resume.education?.filter(e => e.institution).length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Education</h2>
            {resume.education.filter(e => e.institution).map((edu, i) => (
              <div key={i} className="flex justify-between mb-2">
                <div>
                  <h3 className="font-bold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <p className="text-gray-500">{edu.institution}</p>
                </div>
                <span className="text-gray-400 text-xs">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {resume.achievements?.filter(Boolean).length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">Achievements</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {resume.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── MAIN PREVIEW PAGE ───────────────────────────────────────────────────────
export default function ResumePreview() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [template, setTemplate] = useState('modern');
  const previewRef = useRef();

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      const { data } = await api.getResumeById(id);
      setResume(data);
      setTemplate(data.template || 'modern');
    } catch {
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const el = previewRef.current;
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`${resume?.personalInfo?.fullName || 'resume'}.pdf`);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('PDF download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => window.print();

  const templates = { modern: ModernTemplate, minimal: MinimalTemplate, professional: ProfessionalTemplate };
  const TemplateComponent = templates[template] || ModernTemplate;

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <svg className="animate-spin h-10 w-10 text-indigo-500" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-950 z-10 print:hidden">
        <div className="flex items-center gap-4">
          <Link to={`/builder/${id}`} className="text-gray-400 hover:text-white transition">← Edit</Link>
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition text-sm">Dashboard</Link>
        </div>
        <div className="flex items-center gap-3">
          {/* Template switcher */}
          <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
            {['modern', 'minimal', 'professional'].map(t => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition ${template === t ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button onClick={handlePrint} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition">
            🖨 Print
          </button>
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition flex items-center gap-2"
          >
            {downloading ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> : '⬇'}
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="py-10 px-6 flex justify-center bg-gray-900 min-h-screen print:bg-white print:p-0">
        <div ref={previewRef} className="w-[794px] shadow-2xl print:shadow-none print:w-full">
          {resume && <TemplateComponent resume={resume} />}
        </div>
      </div>
    </div>
  );
}
