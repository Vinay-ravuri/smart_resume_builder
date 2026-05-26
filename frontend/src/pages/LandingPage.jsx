import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function NetflixLoader() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div style={{ animation: 'netflix-intro 2.5s ease forwards' }} className="text-center">
        <div className="text-7xl font-black tracking-tight">
          <span className="text-white">Smart</span>
          <span className="text-indigo-500">Resume</span>
          <span className="text-white">AI</span>
        </div>
        <div className="h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-4 mx-auto w-32"></div>
      </div>
    </div>
  );
}

// Resume watermark SVG component
function ResumeWatermark({ style, rotate = 0 }) {
  return (
    <div style={{ ...style, transform: `rotate(${rotate}deg)`, opacity: 0.06 }} className="absolute pointer-events-none">
      <div className="w-48 h-64 bg-white rounded-lg p-4 shadow-2xl">
        <div className="space-y-2">
          <div className="h-3 bg-indigo-400 rounded w-3/4"></div>
          <div className="h-2 bg-gray-300 rounded w-1/2"></div>
          <div className="border-t border-gray-200 pt-2 mt-2 space-y-1.5">
            <div className="h-1.5 bg-gray-300 rounded w-full"></div>
            <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
            <div className="h-1.5 bg-gray-300 rounded w-4/6"></div>
          </div>
          <div className="border-t border-gray-200 pt-2 space-y-1.5">
            <div className="h-2 bg-indigo-300 rounded w-2/3"></div>
            <div className="h-1.5 bg-gray-300 rounded w-full"></div>
            <div className="h-1.5 bg-gray-300 rounded w-5/6"></div>
            <div className="h-1.5 bg-gray-300 rounded w-3/4"></div>
          </div>
          <div className="border-t border-gray-200 pt-2 space-y-1">
            <div className="h-1.5 bg-gray-300 rounded w-full"></div>
            <div className="h-1.5 bg-gray-300 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  { icon: '🤖', title: 'AI Content Writer', desc: 'Generate summaries, experience bullets and project descriptions instantly.' },
  { icon: '🎯', title: 'ATS Score Checker', desc: 'Ensure your resume passes automated screening systems.' },
  { icon: '✉️', title: 'Cover Letter AI', desc: 'Tailored cover letters for every job application in seconds.' },
  { icon: '🔍', title: 'Job Match Analyzer', desc: 'See your match percentage before applying to any job.' },
  { icon: '📈', title: 'Skill Gap Finder', desc: 'Discover missing skills with a personalized learning path.' },
  { icon: '🎤', title: 'Interview Prep', desc: 'Practice with AI-generated questions based on your resume.' },
  { icon: '🎨', title: '30+ Templates', desc: 'Professional designs for every industry and career level.' },
  { icon: '📄', title: 'One-Click PDF', desc: 'Export polished, print-ready PDFs instantly.' },
];

const stats = [
  { value: '50K+', label: 'Resumes Created' },
  { value: '30+', label: 'Templates' },
  { value: '95%', label: 'Success Rate' },
  { value: '4.9★', label: 'Rating' },
];

const templates = [
  { name: 'Executive Pro', color: 'from-blue-600 to-indigo-700', tag: '🔥 Popular', accent: '#6366f1' },
  { name: 'Creative Bold', color: 'from-purple-600 to-pink-600', tag: '✨ New', accent: '#a855f7' },
  { name: 'Minimal Clean', color: 'from-gray-500 to-gray-700', tag: '🎯 ATS', accent: '#6b7280' },
  { name: 'Tech Modern', color: 'from-cyan-500 to-blue-600', tag: '💻 Dev', accent: '#06b6d4' },
  { name: 'Corporate Elite', color: 'from-emerald-500 to-teal-600', tag: '🏢 Corp', accent: '#10b981' },
  { name: 'Designer Plus', color: 'from-orange-500 to-red-500', tag: '🎨 Creative', accent: '#f97316' },
  { name: 'Academic Pro', color: 'from-violet-600 to-purple-700', tag: '🎓 Academic', accent: '#7c3aed' },
  { name: 'Startup Fresh', color: 'from-lime-500 to-green-600', tag: '🚀 Startup', accent: '#84cc16' },
];

export default function LandingPage() {
  const [showLoader, setShowLoader] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setShowLoader(false);
      setTimeout(() => setLoaded(true), 100);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  if (showLoader) return <NetflixLoader />;

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-black">S</div>
            <span className="text-lg font-black">Smart<span className="text-indigo-400">Resume</span>AI</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-1">
            {[['#features', 'Features'], ['#templates', 'Templates'], ['#aitools', 'AI Tools'], ['#stats', 'Stats']].map(([href, label]) => (
              <a key={href} href={href} className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition">
                {label}
              </a>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition rounded-lg hover:bg-white/5">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold rounded-lg transition shadow-lg shadow-indigo-900/30">
              Get Started Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-gray-950 to-purple-950/50"></div>

        {/* Resume watermarks scattered */}
        <ResumeWatermark style={{ top: '8%', left: '2%' }} rotate={-15} />
        <ResumeWatermark style={{ top: '15%', right: '3%' }} rotate={12} />
        <ResumeWatermark style={{ top: '45%', left: '1%' }} rotate={-8} />
        <ResumeWatermark style={{ top: '55%', right: '2%' }} rotate={15} />
        <ResumeWatermark style={{ bottom: '10%', left: '8%' }} rotate={10} />
        <ResumeWatermark style={{ bottom: '5%', right: '8%' }} rotate={-12} />
        <ResumeWatermark style={{ top: '30%', left: '12%' }} rotate={-5} />
        <ResumeWatermark style={{ top: '35%', right: '12%' }} rotate={8} />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>

        {/* Hero Content */}
        <div className={`relative z-10 text-center max-w-5xl mx-auto px-6 ${loaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-sm px-5 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></span>
            Powered by OpenAI GPT — Trusted by 50,000+ professionals
          </div>

          {/* Headline */}
          <h1 className="text-7xl md:text-8xl font-black leading-none mb-6 tracking-tight">
            <span className="block text-white">Build Resumes</span>
            <span className="block shimmer-text">That Get You</span>
            <span className="block text-indigo-400">Hired Faster</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI writes your resume content, optimizes for ATS, generates cover letters —
            all in under 2 minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 flex-wrap mb-16">
            <Link to="/register" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg font-bold transition shadow-2xl shadow-indigo-900/50 animate-pulse-glow">
              🚀 Build My Resume — Free
            </Link>
            <Link to="/login" className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-lg font-semibold transition backdrop-blur-sm">
              Sign In →
            </Link>
          </div>

          {/* Stats */}
          <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-3xl font-black text-indigo-400">{s.value}</div>
                <div className="text-gray-400 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Everything Included</p>
            <h2 className="text-5xl font-black mb-4">
              Tools That Actually
              <span className="text-indigo-400"> Get You Hired</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From AI writing to interview prep — the complete career toolkit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div key={i} className="group bg-gray-900/60 border border-gray-800 hover:border-indigo-600/50 rounded-2xl p-6 transition cursor-pointer hover:bg-gray-900">
                <div className="w-12 h-12 bg-indigo-950 border border-indigo-800/50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:border-indigo-600 transition">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold mb-2 group-hover:text-indigo-400 transition">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section id="templates" className="py-28 px-6 bg-gray-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Template Library</p>
            <h2 className="text-5xl font-black mb-4">
              <span className="text-indigo-400">30+</span> Professional Templates
            </h2>
            <p className="text-gray-400 text-lg">ATS-optimized designs for every industry</p>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
            {templates.map((t, i) => (
              <div key={i} className="group cursor-pointer">
                <div className={`bg-gradient-to-br ${t.color} rounded-xl aspect-[3/4] p-3 relative overflow-hidden group-hover:scale-105 group-hover:shadow-xl transition-all duration-300`}
                  style={{ boxShadow: `0 0 0 0 ${t.accent}` }}
                >
                  <span className="absolute top-1.5 right-1.5 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium">{t.tag}</span>
                  <div className="space-y-1 mt-3">
                    <div className="h-1.5 bg-white/50 rounded w-3/4"></div>
                    <div className="h-1 bg-white/25 rounded w-full"></div>
                    <div className="h-1 bg-white/25 rounded w-5/6"></div>
                    <div className="mt-1.5 h-1 bg-white/35 rounded w-2/3"></div>
                    <div className="h-0.5 bg-white/15 rounded w-full"></div>
                    <div className="h-0.5 bg-white/15 rounded w-4/5"></div>
                    <div className="h-0.5 bg-white/15 rounded w-3/5"></div>
                    <div className="mt-1 h-1 bg-white/30 rounded w-1/2"></div>
                    <div className="h-0.5 bg-white/15 rounded w-full"></div>
                    <div className="h-0.5 bg-white/15 rounded w-5/6"></div>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-500 mt-1.5 group-hover:text-gray-300 transition truncate">{t.name}</p>
              </div>
            ))}
          </div>

          {/* More templates row */}
          <div className="flex justify-center gap-3 flex-wrap mb-8">
            {['Minimalist', 'Bold Pro', 'Two Column', 'Infographic', 'Classic', 'Modern Plus', 'Clean Edge', 'Sharp'].map((name, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-indigo-600 transition cursor-pointer">
                {name}
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 border border-indigo-700/50 text-indigo-300 hover:bg-indigo-950 rounded-xl text-sm font-semibold transition">
              Browse All 30+ Templates →
            </Link>
          </div>
        </div>
      </section>

      {/* ── AI TOOLS ── */}
      <section id="aitools" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-3">AI Career Suite</p>
              <h2 className="text-5xl font-black mb-6 leading-tight">
                More Than Just a
                <span className="text-indigo-400"> Resume Builder</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Our complete AI career suite helps you at every step —
                from writing your resume to landing the interview.
              </p>
              <div className="space-y-3">
                {[
                  { icon: '🎯', text: 'ATS Score Checker — Beat automated filters' },
                  { icon: '✉️', text: 'Cover Letter Generator — Personalized every time' },
                  { icon: '🔍', text: 'Job Match Analyzer — Know your chances upfront' },
                  { icon: '📈', text: 'Skill Gap Analyzer — Clear learning roadmap' },
                  { icon: '🎤', text: 'Interview Prep — AI-powered mock questions' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-gray-300 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-block mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition text-sm">
                Try All AI Tools Free →
              </Link>
            </div>

            {/* AI Preview Cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🎯', title: 'ATS Score', value: '94/100', sub: 'Excellent Match', color: 'text-green-400', border: 'border-green-800/50', bg: 'bg-green-950/30' },
                { icon: '✉️', title: 'Cover Letter', value: 'Ready!', sub: '287 words generated', color: 'text-blue-400', border: 'border-blue-800/50', bg: 'bg-blue-950/30' },
                { icon: '🔍', title: 'Job Match', value: '87%', sub: 'Strong candidate', color: 'text-purple-400', border: 'border-purple-800/50', bg: 'bg-purple-950/30' },
                { icon: '📈', title: 'Skills Gap', value: '3 Skills', sub: 'To learn in 2 months', color: 'text-orange-400', border: 'border-orange-800/50', bg: 'bg-orange-950/30' },
              ].map((card, i) => (
                <div key={i} className={`border ${card.border} ${card.bg} rounded-2xl p-5 animate-float`} style={{ animationDelay: `${i * 0.3}s` }}>
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <div className="text-xs text-gray-400 mb-1">{card.title}</div>
                  <div className={`text-2xl font-black ${card.color}`}>{card.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{card.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28 px-6 bg-gray-900/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Simple Process</p>
            <h2 className="text-5xl font-black">Ready in <span className="text-indigo-400">3 Steps</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '📝', title: 'Enter Your Details', desc: 'Fill in your experience, skills and education using our guided step-by-step wizard.' },
              { step: '02', icon: '🤖', title: 'AI Generates Content', desc: 'Our AI writes professional summaries, bullets and descriptions tailored to your career.' },
              { step: '03', icon: '📄', title: 'Download & Apply', desc: 'Choose your template, preview your resume and download as a polished PDF.' },
            ].map((s, i) => (
              <div key={i} className="text-center relative">
                {i < 2 && <div className="hidden md:block absolute top-8 left-2/3 w-full h-px bg-gradient-to-r from-indigo-600/50 to-transparent"></div>}
                <div className="w-16 h-16 bg-indigo-950 border-2 border-indigo-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {s.icon}
                </div>
                <div className="text-xs text-indigo-400 font-bold mb-2 uppercase tracking-widest">Step {s.step}</div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/50 to-purple-950/50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl"></div>
        <ResumeWatermark style={{ top: '10%', left: '5%' }} rotate={-10} />
        <ResumeWatermark style={{ top: '10%', right: '5%' }} rotate={10} />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-6xl font-black mb-6 leading-tight">
            Your Dream Job
            <span className="text-indigo-400"> Starts Here</span>
          </h2>
          <p className="text-gray-400 text-xl mb-10">
            Join 50,000+ professionals who landed jobs with SmartResumeAI
          </p>
          <Link to="/register" className="inline-block px-14 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xl font-black transition shadow-2xl shadow-indigo-900/50 animate-pulse-glow">
            🚀 Start Building Free
          </Link>
          <p className="text-gray-500 text-sm mt-4">No credit card required · Free forever</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-800/50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-xs font-black">S</div>
            <span className="text-lg font-black">Smart<span className="text-indigo-400">Resume</span>AI</span>
          </div>
          <div className="flex gap-8 text-gray-500 text-sm">
            {['Features', 'Templates', 'AI Tools', 'Pricing'].map(item => (
              <a key={item} href="#" className="hover:text-white transition">{item}</a>
            ))}
          </div>
          <p className="text-gray-600 text-sm">© 2026 SmartResumeAI · Built with React & OpenAI</p>
        </div>
      </footer>
    </div>
  );
}