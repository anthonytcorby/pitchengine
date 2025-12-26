'use client';

import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Check, PlayCircle, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useEffect } from 'react';

export function Hero() {
    const containerRef = useRef<HTMLElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;

            cardRefs.current.forEach((card) => {
                if (!card) return;

                const rect = card.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;

                const dx = clientX - cardCenterX;
                const dy = clientY - cardCenterY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const threshold = 300; // Interaction radius (px)
                const maxDisplacement = 40; // Max pixels to move away

                if (dist < threshold) {
                    const force = Math.pow((1 - dist / threshold), 2) * maxDisplacement;
                    const angle = Math.atan2(dy, dx);

                    // Move AWAY from mouse (negative cos/sin)
                    const moveX = -Math.cos(angle) * force;
                    const moveY = -Math.sin(angle) * force;

                    card.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                    card.style.transform = 'translate(0, 0)';
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !cardRefs.current.includes(el)) {
            cardRefs.current.push(el);
        }
    };

    return (
        <section ref={containerRef} className="relative min-h-[100svh] lg:h-[100svh] h-auto pt-32 pb-20 flex items-center overflow-hidden bg-black safe-top">
            {/* Main Background Image - Optimized with Next.js Image */}
            <div className="absolute inset-0 z-0 gpu-accelerated">
                <Image
                    src="/hero-bg-new.png"
                    alt="Stadium Atmosphere"
                    fill
                    priority
                    quality={90}
                    className="object-cover opacity-100"
                />
            </div>

            {/* Gradient Overlay for Text Contrast */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

            {/* Background Elements (Tactical 4-4-2 SVG) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <svg className="w-full h-full opacity-[0.03]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Definitions for gradients/markers */}
                    <defs>
                        <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                            <path d="M0,0 L4,2 L0,4" fill="currentColor" className="text-white" />
                        </marker>
                    </defs>

                    {/* Dotted Connections (Passing Lanes) */}
                    <g className="stroke-white stroke-[0.2] [stroke-dasharray:1,1]">
                        {/* GK to CBs */}
                        <line x1="50" y1="90" x2="40" y2="75" />
                        <line x1="50" y1="90" x2="60" y2="75" />

                        {/* Back Line */}
                        <line x1="20" y1="70" x2="40" y2="75" />
                        <line x1="40" y1="75" x2="60" y2="75" />
                        <line x1="60" y1="75" x2="80" y2="70" />

                        {/* Midfield Triangle */}
                        <line x1="40" y1="50" x2="60" y2="50" />
                        <line x1="40" y1="75" x2="40" y2="50" />
                        <line x1="60" y1="75" x2="60" y2="50" />

                        {/* Wings */}
                        <line x1="20" y1="70" x2="20" y2="45" />
                        <line x1="80" y1="70" x2="80" y2="45" />

                        {/* Attack */}
                        <line x1="40" y1="50" x2="40" y2="25" />
                        <line x1="60" y1="50" x2="60" y2="25" />
                        <line x1="40" y1="25" x2="60" y2="25" />
                        <line x1="20" y1="45" x2="40" y2="25" />
                        <line x1="80" y1="45" x2="60" y2="25" />
                    </g>

                    {/* Nodes (Players) */}
                    <g className="fill-white">
                        {/* GK */}
                        <circle cx="50" cy="90" r="1" className="fill-wts-green" />

                        {/* Defenders */}
                        <circle cx="20" cy="70" r="0.8" />
                        <circle cx="40" cy="75" r="0.8" />
                        <circle cx="60" cy="75" r="0.8" />
                        <circle cx="80" cy="70" r="0.8" />

                        {/* Midfielders */}
                        <circle cx="20" cy="45" r="0.8" />
                        <circle cx="40" cy="50" r="0.8" />
                        <circle cx="60" cy="50" r="0.8" />
                        <circle cx="80" cy="45" r="0.8" />

                        {/* Strikers */}
                        <circle cx="40" cy="25" r="0.8" className="fill-wts-green" />
                        <circle cx="60" cy="25" r="0.8" className="fill-wts-green" />
                    </g>
                </svg>
            </div>

            <Container className="relative z-10 grid lg:grid-cols-2 gap-4 lg:gap-8 items-center py-0 mt-20">

                {/* Left Column: Content */}
                <div className="space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center space-x-2 border-l-2 border-wts-green pl-3 py-1 bg-white/5 backdrop-blur-sm pr-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-wts-green animate-pulse" />
                        <span className="text-[10px] font-bold tracking-widest text-gray-300 uppercase font-outfit">FIVE-A-SIDE, SIX-A-SIDE, SEVEN-A-SIDE AND SUNDAY LEAGUE OPTIMIZED</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold italic uppercase tracking-tighter leading-[0.9]">
                        <span className="block animate-shimmer bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-[length:200%_100%] bg-clip-text text-transparent">SORT THE</span>
                        <span className="block animate-shimmer bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-[length:200%_100%] bg-clip-text text-transparent">SQUAD.</span>
                        <span className="block animate-shimmer bg-[linear-gradient(110deg,#00FF41,45%,#ffffff,55%,#00FF41)] bg-[length:200%_100%] bg-clip-text text-transparent">BE THE</span>
                        <span className="block animate-shimmer bg-[linear-gradient(110deg,#00FF41,45%,#ffffff,55%,#00FF41)] bg-[length:200%_100%] bg-clip-text text-transparent">GAFFER.</span>
                    </h1>

                    {/* Description */}
                    <p className="text-gray-400 text-lg md:text-xl max-w-lg font-light leading-relaxed">
                        The tactical board for real life. Manage five-a-side and Sunday league availability, chase match fees, and organise match day without the headache.
                    </p>

                    {/* Stats/Social Proof */}
                    <div className="flex items-center space-x-6 pt-2">
                        <div className="flex items-center space-x-2">
                            <div className="flex -space-x-2">
                                {[
                                    { bg: 'bg-red-600', text: 'FC', textCol: 'text-white' },
                                    { bg: 'bg-sky-500', text: 'AFC', textCol: 'text-white' },
                                    { bg: 'bg-yellow-400', text: 'UTD', textCol: 'text-black' }
                                ].map((badge, i) => (
                                    <div key={i} className={`w-7 h-7 rounded-full border border-black flex items-center justify-center ${badge.bg}`}>
                                        <span className={`text-[8px] font-bold ${badge.textCol} tracking-tighter leding-none`}>{badge.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-gray-400">
                                <span className="text-wts-green font-bold">2,400+</span> TEAMS
                            </div>
                        </div>
                        <div className="h-4 w-px bg-white/20" />
                        <div className="flex items-center space-x-2 text-xs text-white">
                            <ShieldCheck size={14} className="text-wts-green" />
                            <span>PROUD PROMOTER OF GRASS ROOTS FOOTBALL</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                        <Link href="/login?mode=create" className="contents">
                            <Button size="lg" className="skew-x-[-10deg] px-10">
                                <span className="skew-x-[10deg]">CREATE TEAM</span>
                            </Button>
                        </Link>
                        <Button variant="outline" size="lg" className="skew-x-[-10deg] px-8 group">
                            <div className="skew-x-[10deg] flex items-center space-x-2">
                                <PlayCircle size={18} className="group-hover:text-wts-green transition-colors" />
                                <span>HOW IT WORKS</span>
                            </div>
                        </Button>
                    </div>
                </div>

                {/* Right Column: Phone Mockup */}
                <div className="w-full flex justify-center lg:justify-start lg:ml-12 mt-4 lg:mt-0">
                    <div className="relative group">
                        {/* Glow effect behind phone */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-wts-green/20 blur-[60px] md:blur-[100px] rounded-full" />

                        {/* TACTICS REVEAL: 5-A-SIDE (Top-Left) */}
                        {/* Default State: Visible (opacity-100), Positioned OUT (translate/rotate matching the previous 'hover' state) */}
                        <div className="absolute top-1/2 left-1/2 z-0 hidden md:block" style={{ transform: 'translate(-400px, -320px) rotate(-15deg)' }}>
                            <div className="transition-transform duration-200 ease-out" ref={addToRefs}>
                                <div className="w-[220px] h-[300px] animate-float-magical">
                                    <div className="w-full h-full bg-black/80 backdrop-blur-sm border border-wts-green/30 rounded-xl p-3 transform scale-90 shadow-2xl">
                                        <svg className="w-full h-full" viewBox="0 0 100 140">
                                            <rect x="5" y="5" width="90" height="130" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                            <circle cx="50" cy="70" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                            <line x1="5" y1="70" x2="95" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                            <g className="fill-blue-500">
                                                <circle cx="50" cy="125" r="4" className="fill-yellow-400" />
                                                <circle cx="30" cy="90" r="4" /> <circle cx="70" cy="90" r="4" />
                                                <circle cx="50" cy="60" r="4" />
                                                <circle cx="50" cy="30" r="4" />
                                            </g>
                                            <path d="M30,90 Q30,60 40,50" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
                                            <path d="M70,90 Q70,60 60,50" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
                                        </svg>
                                        <div className="absolute bottom-2 left-0 right-0 text-center text-[8px] font-bold text-blue-400 font-mono tracking-widest">5-A-SIDE DIAMOND</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TACTICS REVEAL: 4-4-2 (Left) */}
                        <div className="absolute top-1/2 left-1/2 z-0 hidden md:block" style={{ transform: 'translate(-450px, -20px) rotate(-12deg)' }}>
                            <div className="transition-transform duration-200 ease-out" ref={addToRefs}>
                                <div className="w-[300px] h-[400px] animate-float-figure8">
                                    <div className="w-full h-full bg-black/80 backdrop-blur-sm border border-wts-green/30 rounded-xl p-4 transform scale-90">
                                        <svg className="w-full h-full" viewBox="0 0 100 140">
                                            <rect x="0" y="0" width="100" height="140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                            <circle cx="50" cy="70" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                            <line x1="0" y1="70" x2="100" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                            <g className="fill-wts-green">
                                                <circle cx="50" cy="130" r="3" />
                                                <circle cx="20" cy="100" r="3" /> <circle cx="40" cy="110" r="3" /> <circle cx="60" cy="110" r="3" /> <circle cx="80" cy="100" r="3" />
                                                <circle cx="20" cy="70" r="3" /> <circle cx="40" cy="75" r="3" /> <circle cx="60" cy="75" r="3" /> <circle cx="80" cy="70" r="3" />
                                                <circle cx="40" cy="40" r="3" /> <circle cx="60" cy="40" r="3" />
                                            </g>
                                            <line x1="50" y1="130" x2="40" y2="110" stroke="#00ff41" strokeWidth="0.5" strokeDasharray="2,2" />
                                            <line x1="50" y1="130" x2="60" y2="110" stroke="#00ff41" strokeWidth="0.5" strokeDasharray="2,2" />
                                        </svg>
                                        <div className="absolute top-2 left-2 text-[10px] font-bold text-wts-green font-mono">4-4-2 KLOPP</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TACTICS REVEAL: 4-3-3 (Right) */}
                        <div className="absolute top-1/2 left-1/2 z-0 hidden md:block" style={{ transform: 'translate(160px, -280px) rotate(12deg)' }}>
                            <div className="transition-transform duration-200 ease-out" ref={addToRefs}>
                                <div className="w-[300px] h-[400px] animate-float-magical-delayed">
                                    <div className="w-full h-full bg-black/80 backdrop-blur-sm border border-wts-green/30 rounded-xl p-4 transform scale-90">
                                        <svg className="w-full h-full" viewBox="0 0 100 140">
                                            <rect x="0" y="0" width="100" height="140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                            <circle cx="50" cy="70" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                            <line x1="0" y1="70" x2="100" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                                            <g className="fill-white">
                                                <circle cx="50" cy="130" r="3" />
                                                <circle cx="15" cy="100" r="3" /> <circle cx="38" cy="110" r="3" /> <circle cx="62" cy="110" r="3" /> <circle cx="85" cy="100" r="3" />
                                                <circle cx="50" cy="80" r="3" /> <circle cx="30" cy="65" r="3" /> <circle cx="70" cy="65" r="3" />
                                                <circle cx="50" cy="35" r="3" /> <circle cx="20" cy="45" r="3" /> <circle cx="80" cy="45" r="3" />
                                            </g>
                                            <path d="M20,45 Q20,25 35,25" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" markerEnd="url(#arrowhead)" />
                                            <path d="M80,45 Q80,25 65,25" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" markerEnd="url(#arrowhead)" />
                                        </svg>
                                        <div className="absolute top-2 right-2 text-[10px] font-bold text-gray-400 font-mono">4-3-3 PEP</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TACTICS REVEAL: 5-A-SIDE (Top-Right) */}
                        <div className="absolute top-1/2 left-1/2 z-0 hidden md:block" style={{ transform: 'translate(400px, -20px) rotate(15deg)' }}>
                            <div className="transition-transform duration-200 ease-out" ref={addToRefs}>
                                <div className="w-[220px] h-[300px] animate-float-magical">
                                    <div className="w-full h-full bg-black/80 backdrop-blur-sm border border-wts-green/30 rounded-xl p-3 transform scale-90 shadow-2xl">
                                        <svg className="w-full h-full" viewBox="0 0 100 140">
                                            <rect x="5" y="5" width="90" height="130" rx="5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                            <circle cx="50" cy="70" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                            <line x1="5" y1="70" x2="95" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                                            <g className="fill-purple-500">
                                                <circle cx="50" cy="125" r="4" className="fill-yellow-400" />
                                                <circle cx="30" cy="90" r="4" /> <circle cx="70" cy="90" r="4" />
                                                <circle cx="30" cy="40" r="4" /> <circle cx="70" cy="40" r="4" />
                                            </g>
                                            <line x1="30" y1="90" x2="30" y2="40" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
                                            <line x1="70" y1="90" x2="70" y2="40" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
                                            <line x1="30" y1="90" x2="70" y2="90" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
                                            <line x1="30" y1="40" x2="70" y2="40" stroke="white" strokeWidth="0.5" strokeDasharray="3,3" />
                                        </svg>
                                        <div className="absolute bottom-2 left-0 right-0 text-center text-[8px] font-bold text-purple-400 font-mono tracking-widest">5-A-SIDE BOX</div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        {/* PHONE MOCKUP (Static, Straight, Content Visible) */}
                        <div className="relative z-10 w-[200px] h-[420px] sm:w-[240px] sm:h-[500px] md:w-[380px] md:h-[780px] bg-black rounded-[2rem] md:rounded-[3rem] border-[6px] md:border-[8px] border-gray-800 shadow-2xl overflow-hidden box-glow">
                            {/* Phone Notch/Status Bar */}
                            <div className="absolute top-0 left-0 right-0 h-8 flex justify-between px-6 items-center z-20 bg-black/50 backdrop-blur-md">
                                <span className="text-[10px] text-white">19:30</span>
                                <div className="flex space-x-1">
                                    <div className="w-3 h-3 rounded-full bg-white/20" />
                                    <div className="w-3 h-3 rounded-full bg-white/20" />
                                </div>
                            </div>

                            {/* App UI Mockup */}
                            <div className="p-4 pt-12 h-full bg-[#111] flex flex-col items-center justify-center relative overflow-hidden">
                                {/* Pattern */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:20px_20px]" />

                                {/* Logo + Title Container (Static, Top) */}
                                <div className="relative z-10 flex flex-col items-center space-y-4 mb-4 md:mb-8">

                                    <span className="relative z-10 font-outfit font-bold text-2xl md:text-3xl tracking-widest text-white text-center leading-none uppercase">
                                        PITCH ENGINE
                                    </span>
                                </div>

                                {/* Features List (Static, Visible) */}
                                <div className="w-full px-4 md:px-8 mt-8">
                                    <div className="space-y-2 md:space-y-3">
                                        {['Squad Selection', 'Team Availability', 'Matchday Line-ups', 'Results Tracking', 'Fee Collection', 'Automated Match Reminders', 'Man of the Match Voting'].map((feature, i) => (
                                            <div key={i} className="flex items-center space-x-3 text-white">
                                                <div className="w-1.5 h-1.5 rounded-full bg-wts-green" />
                                                <span className="text-xs md:text-base font-bold uppercase tracking-wider font-display text-gray-200">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* App Store Buttons */}
                <div className="absolute bottom-2 right-32 z-30 hidden md:flex flex-col items-center space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">Available Now</p>
                    <div className="flex flex-col space-y-2">
                        {/* App Store */}
                        <Link href="/dashboard" className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg hover:border-wts-green/50 transition-colors w-40">
                            <svg viewBox="0 0 384 512" className="w-5 h-5 fill-white">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.2-41.2.6-78.9 23.9-100.1 60.1-43.5 74.3-11.1 184.6 30.6 244.6 20.3 29.4 45.4 62.4 77.2 61.2 31.2-1.2 43.1-20.1 80.8-20.1 37.8 0 48.7 20.1 80.8 19.5 32.7-.6 54.3-30 74.4-59.5 23.2-33.9 32.7-66.8 33-68.5-.7-.3-63.5-24.3-64.1-96.2zM281.8 102.6c15.1-18.3 25.1-43.7 22.3-69.1-22 1-48.4 14.8-64.1 33.1-14.1 16.3-26.4 42.4-23.1 67 24.3 1.9 49-11.8 64.9-31z" />
                            </svg>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[8px] uppercase tracking-tighter text-gray-400">Download on the</span>
                                <span className="text-sm font-bold tracking-tight">App Store</span>
                            </div>
                        </Link>
                        {/* Play Store */}
                        <Link href="/dashboard" className="flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg hover:border-wts-green/50 transition-colors w-40">
                            <svg viewBox="0 0 512 512" className="w-5 h-5 fill-white">
                                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                            </svg>
                            <div className="flex flex-col items-start leading-none">
                                <span className="text-[8px] uppercase tracking-tighter text-gray-400">Get it on</span>
                                <span className="text-sm font-bold tracking-tight">Google Play</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </Container>

            {/* Ticker Bottom (part of Hero visually or separate) */}
            <div className="absolute bottom-0 w-full left-0 z-20 border-t border-wts-green/20 bg-black/80 backdrop-blur-md">
                <StatsTicker />
            </div>
        </section>
    );
}

function StatsTicker() {
    const content = [
        { label: "FEED COLLECTED", value: "£492,039" },
        { label: "WHATSAPP CHAOS AVOIDED", value: "2M+" },
        { label: "ACTIVE TEAMS", value: "12,402" },
        { label: "MATCHES ORGANIZED", value: "88,291" },
    ];

    return (
        <div className="w-full py-4 flex justify-center items-center overflow-visible">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 px-4">
                {content.map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 text-xs md:text-sm font-bold tracking-widest uppercase mb-2 md:mb-0">
                        <Check className="text-wts-green w-4 h-4" />
                        <span className="text-gray-400">{item.label}:</span>
                        <span className="text-white">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
