import { Container } from '@/components/ui/container';

import { CalendarCheck, MapPin, Wallet, BarChart3, CheckSquare } from 'lucide-react';

export function FeatureGrid() {
    return (
        <section className="py-24 relative section-visibility">
            <Container>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-0.5 w-6 bg-wts-green" />
                            <span className="text-wts-green font-bold text-xs tracking-widest uppercase">THE DUGOUT</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold italic uppercase leading-[0.9]">
                            NO MORE ADMIN<br />
                            <span className="text-gray-600">NIGHTMARES.</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
                        Tools built for the real world of amateur football. Stop using spreadsheets and start running your club like a pro.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Card 1: Availability (Wide) */}
                    <div className="md:col-span-2 bg-[#0A120A] rounded-2xl p-6 md:p-8 border border-white/5 relative group overflow-hidden hover:border-wts-green/30 transition-colors opacity-0 animate-fade-in-up">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-wts-green/5 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50" />
                        <div className="relative z-10 space-y-6">
                            <div className="w-10 h-10 rounded bg-wts-green flex items-center justify-center text-black">
                                <CalendarCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-display font-bold italic uppercase mb-2">AUTOMATED AVAILABILITY</h3>
                                <p className="text-gray-400 text-sm max-w-md">
                                    Forget the "Who's in?" WhatsApp spam. Players get a ping, tap Yes or No, and your squad list builds itself automatically.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Match Fees (Tall) */}
                    <div className="md:col-span-1 md:row-span-2 bg-[#0A120A] rounded-2xl p-6 md:p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between opacity-0 animate-fade-in-up delay-100">
                        <div className="space-y-6 relative z-10">
                            <div className="w-10 h-10 rounded bg-[#1a2e1a] text-wts-green flex items-center justify-center border border-wts-green/20">
                                <Wallet size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-display font-bold italic uppercase mb-2">MATCH FEES & SUBS</h3>
                                <p className="text-gray-400 text-sm">
                                    Track who's paid and who's dodging. Send payment links instantly.
                                </p>
                            </div>
                        </div>

                        {/* Mock List */}
                        <div className="mt-8 space-y-3">
                            <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
                                <span className="text-gray-500">PAID THIS WEEK</span>
                                <span className="text-red-500 font-bold">£35.00</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 rounded-full bg-gray-700 text-[8px] flex items-center justify-center text-white">BK</div>
                                    <span className="text-xs font-bold text-white uppercase">BIG KEV 7</span>
                                </div>
                                <span className="text-red-500 text-xs text-right">£5.00</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                                <div className="flex items-center space-x-2">
                                    <div className="w-5 h-5 rounded-full bg-gray-700 text-[8px] flex items-center justify-center text-white">IS</div>
                                    <span className="text-xs font-bold text-white uppercase">ICE STEVE</span>
                                </div>
                                <span className="text-red-500 text-xs text-right">£10.00</span>
                            </div>
                            <div className="inline-flex items-center justify-center italic tracking-wide w-full mt-2 text-xs h-8 bg-wts-green text-black uppercase font-bold px-6 cursor-default">CHASE PAYMENTS</div>
                        </div>
                    </div>

                    {/* Card 3: Pitch */}
                    <div className="bg-[#0A120A] rounded-2xl p-8 border border-white/5 relative hover:border-wts-green/30 transition-colors opacity-0 animate-fade-in-up delay-200">
                        <div className="space-y-4">
                            <div className="w-8 h-8 rounded bg-[#1a2e1a] text-wts-green flex items-center justify-center border border-wts-green/20">
                                <MapPin size={16} />
                            </div>
                            <h3 className="text-xl font-display font-bold italic uppercase">PITCH & KICK-OFF</h3>
                            <p className="text-gray-400 text-xs">
                                Cross-pitch locations, kick-off times, and kit colors. Deep Google Maps integration.
                            </p>
                        </div>
                    </div>

                    {/* Card 4: Stats */}
                    <div className="bg-[#0A120A] rounded-2xl p-8 border border-white/5 relative hover:border-wts-green/30 transition-colors opacity-0 animate-fade-in-up delay-300">
                        <div className="space-y-4">
                            <div className="w-8 h-8 rounded bg-[#1a2e1a] text-wts-green flex items-center justify-center border border-wts-green/20">
                                <BarChart3 size={16} />
                            </div>
                            <h3 className="text-xl font-display font-bold italic uppercase">SEASON STATS</h3>
                            <p className="text-gray-400 text-xs">
                                Who's your top scorer? Who's got the most assists? Track stats over the season.
                            </p>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
}
