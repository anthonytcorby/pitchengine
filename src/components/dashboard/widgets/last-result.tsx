'use client';

import { Trophy, Star } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';

export function LastResultWidget() {
    const { t } = useLanguage();
    const result = {
        opponent: 'Code Rangers',
        scoreHome: 2,
        scoreAway: 2,
        outcome: 'DRAW', // WIN, LOSS, DRAW
        scorers: ['M. Johnson (24\')', 'D. Vieri (88\')'],
        motm: 'D. Vieri'
    };

    const outcomeColor = result.outcome === 'WIN' ? 'text-wts-green' : result.outcome === 'LOSS' ? 'text-red-500' : 'text-gray-400';

    return (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 group hover:border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">{t('dashboard.widgets.last_result')}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 ${outcomeColor}`}>{result.outcome}</span>
            </div>

            <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-4 mb-2">
                    <span className="text-xl font-display font-bold italic text-white">US</span>
                    <div className="px-4 py-1.5 bg-white/10 rounded-lg border border-white/5">
                        <span className="text-2xl font-black text-white tracking-widest">{result.scoreHome}-{result.scoreAway}</span>
                    </div>
                    <span className="text-xl font-display font-bold italic text-gray-500 truncate max-w-[80px]">OPP</span>
                </div>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{t('dashboard.widgets.vs')} {result.opponent}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex items-start space-x-2">
                    <div className="pt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-wts-green" /></div>
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{t('dashboard.widgets.scorers')}</p>
                        <p className="text-xs font-bold text-white leading-relaxed">
                            {result.scorers.join(', ')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">{t('dashboard.widgets.motm')}</span>
                    </div>
                    <span className="text-xs font-bold text-white">{result.motm}</span>
                </div>
            </div>

            <Link href="/dashboard/fixtures" className="absolute inset-0 z-20" aria-label="View Fixtures" />
        </div>
    );
}
