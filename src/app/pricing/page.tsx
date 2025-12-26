'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Check, Shield } from 'lucide-react';

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-black selection:bg-wts-green selection:text-black">
            <Navbar />

            <div className="relative pt-32 pb-20">
                {/* Background Texture */}
                <div className="fixed inset-0 opacity-10 pointer-events-none -z-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>

                <Container>
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-wts-green text-xs font-bold tracking-[0.3em] uppercase block font-mono">
                            JOIN THE CLUB
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-bold italic uppercase tracking-tighter text-white">
                            CHOOSE YOUR SQUAD STATUS
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto font-outfit">
                            From Sunday League to Professional Management. Select the tools you need to take your team to the next level.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-colors relative">
                            <div className="mb-8">
                                <h3 className="text-2xl font-display font-bold italic text-white mb-2">FREE AGENT</h3>
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-4xl font-bold text-white">£0</span>
                                    <span className="text-gray-500 font-mono text-sm">/ forever</span>
                                </div>
                                <p className="text-gray-400 text-sm mt-4 font-outfit">Essential tools for organizing casual kickabouts.</p>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {['Squad List Management', 'Basic Match Scheduling', 'Match Results Tracking', '1 Team Admin'].map((feature) => (
                                    <li key={feature} className="flex items-center space-x-3 text-sm text-gray-300">
                                        <div className="p-1 bg-white/10 rounded-full">
                                            <Check size={12} className="text-white" />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button variant="outline" className="w-full py-6 text-sm font-bold tracking-widest uppercase">
                                Start Free
                            </Button>
                        </div>

                        {/* Premium Tier */}
                        <div className="bg-black border border-wts-green rounded-2xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-wts-green text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center space-x-1">
                                    <Shield size={12} fill="currentColor" />
                                    <span>Recommended</span>
                                </div>
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-wts-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="mb-8 relative z-10">
                                <h3 className="text-2xl font-display font-bold italic text-wts-green mb-2">PREMIUM PRO</h3>
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-4xl font-bold text-white">£5</span>
                                    <span className="text-gray-500 font-mono text-sm">/ month</span>
                                </div>
                                <p className="text-gray-400 text-sm mt-4 font-outfit">Full tactical suite and financial management for serious clubs.</p>
                            </div>

                            <ul className="space-y-4 mb-8 relative z-10">
                                {[
                                    'Everything in Free',
                                    'Interactive Tactics Board',
                                    'Financial Tracking & Fees',
                                    'Player Availability System',
                                    'Advanced Stats & Analysis',
                                    'Unlimited Team Admins'
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center space-x-3 text-sm text-white">
                                        <div className="p-1 bg-wts-green rounded-full">
                                            <Check size={12} className="text-black" />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button className="w-full py-6 text-sm font-bold tracking-widest uppercase bg-wts-green text-black hover:bg-white hover:text-black relative z-10">
                                Upgrade Now
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            <Footer />
        </main>
    );
}
