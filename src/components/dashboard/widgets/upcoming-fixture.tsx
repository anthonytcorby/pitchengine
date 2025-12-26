'use client';

import { Calendar, MapPin, Clock, CloudSun, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { api } from '@/services/api'; // Added import
import { useState, useEffect } from 'react'; // Added import

export function UpcomingFixtureWidget() {
    const { t } = useLanguage();
    const [teamName, setTeamName] = useState('GAFFR');

    useEffect(() => {
        const loadTeam = async () => {
            try {
                const user = await api.getCurrentUser();
                if (user?.teamId) {
                    const team = await api.getTeam(user.teamId);
                    if (team) setTeamName(team.name);
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadTeam();
    }, []);

    // Mock Data - In real app, fetch "next" upcoming fixture
    const fixture = {
        opponent: 'Tech United',
        date: '2025-12-31',
        time: '19:30',
        venue: 'Pitch 4, PL Central',
        weather: '8°C',
        status: 'Confirmed'
    };

    return (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-wts-green/20 transition-all duration-300 font-outfit">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-wts-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold text-wts-green uppercase tracking-[0.2em]">{t('dashboard.widgets.next_match')}</span>
                    <div className="flex items-center space-x-3 bg-white/10 border border-white/20 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md">
                        <CloudSun size={28} className="text-white" />
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-bold text-white">{fixture.weather}</span>
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">{t('dashboard.widgets.forecast')}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-3xl font-bold text-white leading-none mb-1 uppercase tracking-tight">
                            <span className="text-white">{teamName}</span>
                            <span className="text-wts-green mx-2">VS</span>
                            <span className="text-white">{fixture.opponent}</span>
                        </h3>
                        <div className="flex items-center space-x-3 text-gray-400 text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center"><Calendar size={12} className="mr-1.5" /> {new Date(fixture.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span className="flex items-center"><Clock size={12} className="mr-1.5" /> 19:30</span>
                        </div>
                    </div>

                    <div className="flex items-center text-gray-500 text-xs font-medium">
                        <MapPin size={12} className="mr-2 text-wts-green" />
                        {fixture.venue}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {/* Availability Avatars Preview */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full bg-neutral-800 border border-black flex items-center justify-center text-[8px] font-bold text-white">
                                {['JD', 'MS', 'AL'][i - 1]}
                            </div>
                        ))}
                        <div className="w-6 h-6 rounded-full bg-wts-green flex items-center justify-center text-[7px] font-bold text-black pl-0.5">
                            +8
                        </div>
                    </div>

                    <Link href="/dashboard/matchday" className="flex items-center space-x-2 text-[10px] font-bold text-white uppercase tracking-widest hover:text-wts-green transition-colors group/link">
                        <span>{t('dashboard.widgets.match_hub')}</span>
                        <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
