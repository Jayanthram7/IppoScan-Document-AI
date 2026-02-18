"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IppoScanLogo } from '@/components/IppoScanLogo';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (email === 'jayanthramnithin@gmail.com' && password === '181104') {
            router.push('/dashboard');
        } else {
            setError('Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4 relative overflow-hidden">
            {/* Perspective Grid Effect - Green for Login */}
            <div
                className="fixed bottom-0 left-0 right-0 h-[600px] pointer-events-none z-0"
                style={{
                    background: `
                        linear-gradient(transparent 0%, #F9FAFB 100%),
                        linear-gradient(90deg, rgba(16, 185, 129, 0.6) 1px, transparent 1px),
                        linear-gradient(rgba(16, 185, 129, 0.6) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(1000px) rotateX(60deg) translateY(100px) scale(2.5)',
                    transformOrigin: 'bottom center',
                    opacity: 0.7,
                    maskImage: 'linear-gradient(to top, black 0%, transparent 60%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 60%)'
                }}
            />

            {/* Floating Navbar - Custom for Login Page */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit">
                <div className="flex items-center gap-8 px-2 py-2 bg-white/80 backdrop-blur-md border border-black/10 rounded-full shadow-2xl">
                    <div className="flex items-center gap-2 pl-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border border-gray-100">
                                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    {/* Up-Right Arrow */}
                                    <path d="M 10 80 L 30 60 L 75 60 L 90 45 L 75 30 L 60 45 L 30 45 L 10 65 Z" fill="#10b981" />
                                    {/* Down-Left Arrow */}
                                    <path d="M 90 20 L 70 40 L 25 40 L 10 55 L 25 70 L 40 55 L 70 55 L 90 35 Z" fill="#10b981" />
                                </svg>
                            </div>
                            <span className="font-semibold text-base tracking-wide text-black">IppoScan</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-5 text-sm text-gray-600 font-medium">
                        <Link href="#" className="flex items-center gap-1 hover:text-black transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" />
                            </svg>
                            Features
                        </Link>
                        <Link href="https://github.com/Jayanthram7/Docusense-AI" className="flex items-center gap-1 hover:text-black transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Docs
                        </Link>
                        <Link href="https://github.com/Jayanthram7/Docusense-AI" className="flex items-center gap-1 hover:text-black transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            GitHub
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 pr-1">
                        <Link href="/" className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-black transition-colors hidden sm:flex">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Home
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-800 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="flex flex-col items-center justify-center w-full mt-24 relative z-10">
                {/* Card Container */}
                <div className="flex w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] border border-gray-100 opacity-0 animate-fadeInUp">
                    {/* Left Column - Login Form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 bg-white">
                        <div className="w-full max-w-md space-y-8">
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
                                <p className="mt-2 text-sm text-gray-600">
                                    Login to your IppoScan account
                                </p>
                            </div>

                            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                                placeholder="m@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                            </label>
                                            <div className="text-sm">
                                                <Link href="#" className="font-medium text-gray-900 hover:text-gray-700">
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm font-medium text-center">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full justify-center rounded-lg bg-black px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>
                            </form>

                            <div className="relative mt-8">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-white px-6 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-3 gap-3">
                                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.64 3.94-1.64 2.08 0 3.53 1 4.54 2.61-4.22 2.34-3.53 9.68 1.51 11.75-.49 1.4-1.18 2.78-2.62 4.18-.46.52-.96 1.08-1.45 1.53zM12.04 5.07c0 3.23-2.65 5.25-5.18 4.96-.06-3.17 2.82-5.74 5.18-4.96z" />
                                    </svg>
                                </button>
                                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                </button>
                                <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.52-3.88 3.77-3.88 1.08 0 2.15.19 2.15.19v2.47h-1.21c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-6 text-center text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link href="#" className="font-semibold text-gray-900 hover:underline">
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Presentation */}
                    <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-gray-100 p-8 relative overflow-hidden">

                        {/* Decorative Circle/Grid similar to placeholder but customized */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                            <div className="w-[600px] h-[600px] border border-gray-400 rounded-full" />
                            <div className="absolute w-[400px] h-[400px] border border-gray-400 rounded-full" />
                            <div className="absolute w-[800px] h-px bg-gray-400 rotate-45" />
                            <div className="absolute w-[800px] h-px bg-gray-400 -rotate-45" />
                        </div>

                        <div className="z-10 flex flex-col items-center space-y-6 max-w-lg text-center">
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-500 border border-gray-100">
                                <IppoScanLogo className="w-14 h-14" color="#10b981" />
                            </div>

                            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">IppoScan</h2>

                            <p className="text-lg text-gray-600 font-medium">
                                Ship Faster. Process Smarter.
                            </p>

                            <div className="pt-8 flex gap-4">
                                <Link
                                    href="#"
                                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"
                                    title="Contact Support"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </Link>
                                <Link
                                    href="#"
                                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"
                                    title="Sales"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </Link>
                                <Link
                                    href="https://github.com/Jayanthram7/Docusense-AI"
                                    target="_blank"
                                    className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-all transform hover:-translate-y-1"
                                    title="Github"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer disclaimer at bottom */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    By clicking continue, you agree to our <Link href="#" className="underline hover:text-gray-900">Terms of Service</Link> and <Link href="#" className="underline hover:text-gray-900">Privacy Policy</Link>.
                </div>
            </div>
        </div>
    );
}
