'use client';

import { Table2 } from 'lucide-react';

export default function LeaguesPage() {
    return (
        <div className="space-y-6 max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 px-2">
                <div>
                    <span className="text-wts-green text-xs font-bold tracking-[0.3em] uppercase block mb-1.5 font-mono">
                        COMPETITIONS
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold italic uppercase tracking-tighter text-white">
                        LEAGUES
                    </h2>
                </div>
            </div>

            {/* Placeholder Content */}
            <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Table2 size={40} className="text-wts-green opacity-80" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">League Tables Incoming</h3>
                <p className="text-gray-400 max-w-sm">
                    Track your team's progress, view detailed league standings, and analyze upcoming opponents in this section.
                </p>
            </div>
        </div>
    );
}
