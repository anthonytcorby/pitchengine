'use client';

import { Users, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Player } from '@/types/schema';
import { useLanguage } from '@/hooks/use-language';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

// Mock data integration or props later
export function SquadAvailabilityWidget() {
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        in: 0,
        maybe: 0,
        out: 0,
        total: 0
    });

    useEffect(() => {
        const load = async () => {
            const squad = await api.getSquad('team-wts');
            setStats({
                in: 0, // No availability data yet
                maybe: 0,
                out: 0,
                total: squad.length
            });
        };
        load();
    }, []);

    const percentage = stats.total > 0 ? Math.round((stats.in / stats.total) * 100) : 0;

    return (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 relative group hover:border-wts-green/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">{t('dashboard.widgets.squad_status')}</span>
                <Users size={14} className="text-wts-green opacity-50" />
            </div>

            <div className="flex items-end justify-between mb-4">
                <div>
                    <span className="text-4xl font-display font-bold italic text-white">{stats.in}<span className="text-gray-600 text-2xl">/{stats.total}</span></span>
                    <p className="text-[10px] font-bold text-wts-green uppercase tracking-widest mt-1">{t('dashboard.widgets.confirmed_available')}</p>
                </div>

                {/* Visual Circle/Donut could go here, text for now */}
            </div>

            {/* Visual Bar representation */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                <div className="h-full bg-wts-green" style={{ width: `${(stats.in / stats.total) * 100}%` }} />
                <div className="h-full bg-yellow-500" style={{ width: `${(stats.maybe / stats.total) * 100}%` }} />
                <div className="h-full bg-red-500" style={{ width: `${(stats.out / stats.total) * 100}%` }} />
            </div>

            <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1"><div className="w-1.5 h-1.5 rounded-full bg-wts-green" /><span>In ({stats.in})</span></div>
                <div className="flex items-center space-x-1"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /><span>Maybe ({stats.maybe})</span></div>
                <div className="flex items-center space-x-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500" /><span>Out ({stats.out})</span></div>
            </div>

            <Link href="/dashboard/squad" className="absolute inset-0 z-20" aria-label="View Squad Status" />
        </div>
    );
}
