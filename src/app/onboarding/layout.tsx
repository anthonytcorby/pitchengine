import React from 'react';
import Image from 'next/image';

export const metadata = {
    title: 'Welcome to Pitch Engine',
    description: 'Set up your club.',
};

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#050D05] text-white overflow-hidden relative font-sans selection:bg-wts-green/30">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/dashboard-bg.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-40 brightness-50"
                    priority
                    quality={90}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050D05] via-[#050D05]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050D05]/80 via-transparent to-[#050D05]/80" />
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 p-8 flex items-center justify-between pointer-events-none">
                <div className="flex items-center space-x-3 pointer-events-auto">
                    <span className="font-outfit font-bold text-xl tracking-widest text-white uppercase">
                        PITCH ENGINE
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
                {children}
            </main>
        </div>
    );
}
