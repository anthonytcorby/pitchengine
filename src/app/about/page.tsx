'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black selection:bg-wts-green selection:text-black">
            <Navbar />

            <div className="relative pt-32 pb-20">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <span className="text-wts-green text-xs font-bold tracking-[0.3em] uppercase block mb-4 font-mono">
                                    OUR MISSION
                                </span>
                                <h1 className="text-4xl md:text-6xl font-display font-bold italic uppercase tracking-tighter text-white leading-[0.9]">
                                    BUILT FOR THE <br />
                                    <span className="text-gray-500">LOVE OF THE GAME</span>
                                </h1>
                            </div>

                            <div className="space-y-6 text-gray-400 font-outfit text-lg leading-relaxed">
                                <p>
                                    PITCH ENGINE was born on a muddy Sunday morning. We know the struggle of chasing match fees, organizing lifts, and debating formations in WhatsApp groups.
                                    <br /><br />
                                    We built PITCH ENGINE to handle the admin so you can focus on the football. From automated team sheets to fee tracking, we're giving grassroots managers the tools the pros use.
                                </p>
                                <p>
                                    Whether you're a Sunday League manager, a 5-a-side organizer, or a semi-pro coach, we give you the tactical and organizational edge to focus on what really matters—the 90 minutes.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-[4/5] relative rounded-2xl overflow-hidden border border-white/10">
                                <div className="absolute inset-0 bg-wts-green/10 mix-blend-overlay z-10" />
                                <Image
                                    src="/hero-bg-new.png"
                                    alt="Football Pitch"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20" />

                                <div className="absolute bottom-8 left-8 z-30">
                                    <p className="text-4xl font-display font-bold italic text-white tracking-tighter">Est. 2024</p>
                                    <p className="text-wts-green font-mono text-sm tracking-widest uppercase">London, UK</p>
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-wts-green/20 blur-2xl rounded-full" />
                        </div>
                    </div>
                </Container>
            </div>

            <Footer />
        </main>
    );
}
