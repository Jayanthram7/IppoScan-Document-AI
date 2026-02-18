import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-white/20 overflow-hidden">
      {/* Background Gradient Effect - subtle spot light */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900/20 via-[#0A0A0A] to-[#0A0A0A] pointer-events-none" />

      {/* Perspective Grid Effect */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[600px] pointer-events-none"
        style={{
          background: `
            linear-gradient(transparent 0%, #0A0A0A 100%),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(100px) scale(2.5)',
          transformOrigin: 'bottom center',
          opacity: 1,
          maskImage: 'linear-gradient(to top, black 0%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 60%)'
        }}
      />

      {/* Blue/Green Blur Effects - Placed after gradient to sit on top */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/30 opacity-60 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/20 opacity-50 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

      {/* Floating Navbar */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-8 px-2 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
          <div className="flex items-center gap-2 pl-4">
            <Link href="/" className="flex items-center space-x-2">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                {/* Up-Right Arrow */}
                <path d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z" fill="white" />
                {/* Down-Left Arrow */}
                <path d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z" fill="white" />
              </svg>
              <span className="font-semibold text-base tracking-wide">IppoScan</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-5 text-sm text-gray-400 font-medium">
            <Link href="#" className="flex items-center gap-1 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
              </svg>
              Features
            </Link>
            <Link href="https://github.com/Jayanthram7/Docusense-AI" className="flex items-center gap-1 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Docs
            </Link>
            <Link href="https://github.com/Jayanthram7/Docusense-AI" className="flex items-center gap-1 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </Link>
          </div>

          <div className="flex items-center gap-4 pr-1">
            <Link href="/login" className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:flex">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* GitHub Project Button - Right End */}
      <Link
        href="https://github.com/Jayanthram7/Docusense-AI"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 hidden lg:flex items-center gap-3 px-4 py-3 bg-white text-black rounded-full shadow-lg hover:bg-gray-100 transition-all hover:scale-105 font-medium text-base"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
        <span>View on GitHub</span>
        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </Link>

      {/* Hero Section */}
      <main className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-32 pb-12 text-center">
        {/* Beta Badge */}
        <div className="mb-8 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-green-400 bg-green-400/10 border border-green-400/20 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Now in Development
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <span className="block text-white mb-2">Ippo - Ship Faster.</span>
          <span className="block text-gray-500">Process smarter.</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-xl mx-auto text-lg text-gray-400 mb-10 leading-relaxed opacity-0 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          The modern platform for teams who ship fast. Built for scale, designed for speed. Everything you need to build, deploy, and grow.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mb-16 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all hover:scale-105"
          >
            Get Started
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="#"
            className="px-8 py-3.5 text-white font-medium bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all"
          >
            View Demo
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col items-center gap-4 opacity-0 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#0A0A0A]">
                <img
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Trusted by <span className="text-white font-medium">100+</span> teams worldwide
          </p>
        </div>
      </main>
    </div>
  );
}
