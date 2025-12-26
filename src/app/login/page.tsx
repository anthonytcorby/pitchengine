'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Mail, ArrowLeft } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { signInWithGoogle, signInWithApple } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    const handleAppleLogin = async () => {
        try {
            await signInWithApple();
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <main className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black selection:bg-wts-green/30">
            {/* Background Image - Blurred and Darkened */}
            <div className="absolute inset-0 z-0 opacity-40 blur-sm scale-105">
                <Image
                    src="/hero-bg-new.png"
                    alt="Stadium Atmosphere"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* Darker Overlay */}
            <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px]" />

            {/* Stadium Glow Effect behind the card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-wts-green/10 blur-[100px] rounded-full z-10 animate-pulse" />

            <Container className="relative z-20 w-full max-w-lg px-4 py-12">
                <div className="animate-fade-in-up">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-gray-500 hover:text-white transition-colors duration-200 mb-8 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
                        <span className="text-xs font-bold tracking-widest uppercase font-outfit">Back to Home</span>
                    </Link>

                    {/* Login Card */}
                    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-12 shadow-2xl relative overflow-hidden group">
                        {/* Thin glowing top border */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wts-green/50 to-transparent" />

                        {/* Logo */}
                        <div className="flex flex-col items-center space-y-5 mb-12">
                            <div className="relative w-24 h-24">
                                <Image
                                    src="/pitchengine-logo-v2.png"
                                    alt="Pitch Engine Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h1 className="font-outfit font-bold text-3xl tracking-widest text-white text-center uppercase">
                                PITCH ENGINE
                            </h1>
                            <p className="text-gray-400 text-sm tracking-widest uppercase font-outfit font-bold">Sign in to your club</p>
                        </div>

                        {/* Social Login Buttons */}
                        {/* Apple Login */}
                        <button
                            onClick={handleAppleLogin}
                            className="w-full flex items-center justify-center space-x-3 bg-white text-black py-4 rounded-xl font-bold text-base tracking-tight hover:bg-gray-200 transition-colors duration-200"
                        >
                            <svg viewBox="0 0 384 512" className="w-6 h-6 fill-current">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.2-41.2.6-78.9 23.9-100.1 60.1-43.5 74.3-11.1 184.6 30.6 244.6 20.3 29.4 45.4 62.4 77.2 61.2 31.2-1.2 43.1-20.1 80.8-20.1 37.8 0 48.7 20.1 80.8 19.5 32.7-.6 54.3-30 74.4-59.5 23.2-33.9 32.7-66.8 33-68.5-.7-.3-63.5-24.3-64.1-96.2zM281.8 102.6c15.1-18.3 25.1-43.7 22.3-69.1-22 1-48.4 14.8-64.1 33.1-14.1 16.3-26.4 42.4-23.1 67 24.3 1.9 49-11.8 64.9-31z" />
                            </svg>
                            <span>Continue with Apple</span>
                        </button>

                        {/* Google Login */}
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center space-x-3 bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold text-base tracking-tight hover:bg-white/10 transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        <div className="relative mb-8 text-center">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <span className="relative z-10 px-4 bg-[#080808] text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase">OR EMAIL</span>
                        </div>

                        {/* Email Form */}
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <div className="relative group/input">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-wts-green transition-colors duration-200">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-5 pl-14 pr-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-wts-green/50 focus:ring-1 focus:ring-wts-green/50 transition-all duration-200 font-outfit text-base"
                                    />
                                </div>
                            </div>

                            <Button className="w-full py-7 text-lg skew-x-[-10deg] shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                                <span className="skew-x-[10deg]">SEND MAGIC LINK</span>
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-xs text-gray-500 font-outfit">
                            Don't have a club yet?{' '}
                            <Link href="/" className="text-wts-green font-bold hover:underline">
                                Start for free
                            </Link>
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 flex justify-center space-x-6">
                        <Link href="/privacy" className="text-[10px] font-bold tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors duration-200 uppercase font-outfit">Privacy</Link>
                        <Link href="/terms" className="text-[10px] font-bold tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors duration-200 uppercase font-outfit">Terms</Link>
                        <Link href="/contact" className="text-[10px] font-bold tracking-[0.2em] text-gray-600 hover:text-gray-400 transition-colors duration-200 uppercase font-outfit">Support</Link>
                    </div>
                </div>
            </Container>
        </main>
    );
}
