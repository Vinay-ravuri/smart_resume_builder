import { Link } from 'react-router-dom';

const features = [
  { icon: '🤖', title: 'AI-Powered Content', desc: 'Generate professional summaries, job descriptions, and project highlights instantly using OpenAI.' },
  { icon: '🎨', title: 'Beautiful Templates', desc: 'Choose from Modern, Minimal, and Professional templates that stand out to recruiters.' },
  { icon: '📄', title: 'PDF Export', desc: 'Download your resume as a polished, print-ready PDF in one click.' },
  { icon: '☁️', title: 'Cloud Dashboard', desc: 'Save, edit, and manage multiple resume versions from your personal dashboard.' },
  { icon: '⚡', title: 'Real-time Preview', desc: 'See your resume update live as you type — no page reloads needed.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected with JWT authentication and encrypted passwords.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <span className="text-xl font-bold text-white">SmartResume<span className="text-indigo-400">AI</span></span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition">Login</Link>
          <Link to="/register" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-28 px-6 max-w-4xl mx-auto">
        <div className="inline-block bg-indigo-900/40 text-indigo-300 text-sm px-4 py-1.5 rounded-full mb-6 border border-indigo-700">
          ✨ Powered by OpenAI GPT
        </div>
        <h1 className="text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white via-gray-200 to-indigo-400 bg-clip-text text-transparent">
          Build Your Perfect<br />Resume with AI
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Stop staring at a blank page. Let AI write your professional summary, work experience, and project descriptions — tailored to your career.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg font-semibold transition shadow-lg shadow-indigo-900/40">
            Create My Resume →
          </Link>
          <Link to="/login" className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-lg font-semibold transition border border-gray-700">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-gray-400 text-center mb-14">A complete resume building toolkit powered by AI</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6 hover:border-indigo-600 transition group">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-indigo-400 transition">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Land Your Dream Job?</h2>
        <p className="text-gray-400 mb-8 text-lg">Join thousands of professionals who built resumes with SmartResumeAI.</p>
        <Link to="/register" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg font-semibold transition shadow-lg">
          Start for Free →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        © 2026 SmartResumeAI. Built with React, Node.js & OpenAI.
      </footer>
    </div>
  );
}
