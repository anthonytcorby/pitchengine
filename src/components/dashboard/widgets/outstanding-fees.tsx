'use client';

import { Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { formatName } from '@/lib/utils';

interface OwedPlayer {
    name: string;
    amount: number;
}

export function OutstandingFeesWidget() {
    const { t } = useLanguage();
    const [owingPlayers, setOwingPlayers] = useState<OwedPlayer[]>([]);
    const [totalOwed, setTotalOwed] = useState(0);
    const [othersCount, setOthersCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const squad = await api.getSquad('team-wts');

                // Deterministic mock match with the Fees Page logic
                // Indices 2, 5, 8 have debts in our Fees Page mock
                const debtors: OwedPlayer[] = [];

                squad.forEach((p, i) => {
                    if (i === 2) debtors.push({ name: formatName(p.name), amount: 25.00 });
                    if (i === 5) debtors.push({ name: formatName(p.name), amount: 50.00 });
                    if (i === 8) debtors.push({ name: formatName(p.name), amount: 50.00 });
                });

                // If squad is too small, fallback
                if (debtors.length === 0 && squad.length > 0) {
                    // Just pick last player as fallback debtor
                    debtors.push({ name: formatName(squad[squad.length - 1].name), amount: 10.00 });
                }

                setTotalOwed(debtors.reduce((acc, curr) => acc + curr.amount, 0));
                setOwingPlayers(debtors.slice(0, 3));
                setOthersCount(Math.max(0, debtors.length - 3));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="bg-black/40 border border-white/5 rounded-2xl p-6 h-[200px] animate-pulse" />;

    return (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between group hover:border-red-500/30 transition-all duration-300 relative overflow-hidden">
            {/* Subtle Red Glow for urgency */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold text-red-400 uppercase tracking-[0.2em]">{t('dashboard.widgets.outstanding_fees')}</span>
                    <Wallet size={14} className="text-red-400 opacity-80" />
                </div>

                <div className="mb-6">
                    <span className="text-4xl font-display font-bold italic text-white">£{totalOwed.toFixed(2)}</span>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{t('dashboard.widgets.total_to_collect')}</p>
                </div>

                <div className="space-y-2">
                    {owingPlayers.map((p, i) => (
                        <div key={i} className="flex items-center justify-between text-xs border-b border-white/5 pb-1.5 last:border-0">
                            <span className="font-bold text-gray-400">{p.name}</span>
                            <span className="font-mono font-bold text-red-400">£{p.amount.toFixed(2)}</span>
                        </div>
                    ))}
                    {othersCount > 0 && (
                        <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest pt-1 text-center">
                            + {othersCount} others
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <Link href="/dashboard/fees" className="flex items-center justify-between text-[10px] font-bold text-white uppercase tracking-widest hover:text-red-400 transition-colors group/link">
                    <span>{t('dashboard.widgets.chase_payments')}</span>
                    <ArrowRight size={12} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
            </div>
            <Link href="/dashboard/fees" className="absolute inset-0 z-20" aria-label="View Fees" />
        </div>
    );
}
