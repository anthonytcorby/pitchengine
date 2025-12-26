'use client';

import { Wallet, DollarSign, Download, Check, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Player } from '@/types/schema';
import { useLanguage } from '@/hooks/use-language';
import { formatName } from '@/lib/utils';

interface PlayerBalance {
    id: string;
    name: string;
    paid: number;
    owed: number;
    total: number;
    status: 'paid' | 'partial' | 'unpaid';
}

export default function FeesPage() {
    const { t } = useLanguage();
    const [balances, setBalances] = useState<PlayerBalance[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [summary, setSummary] = useState({
        totalCollected: 0,
        totalOutstanding: 0,
        perMatchFee: 5,
        totalPlayers: 0,
    });

    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);
    // Selection state
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    const [isReminding, setIsReminding] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const squad = await api.getSquad('team-wts');

                // Mock Fee Generation based on Squad
                // In a real app, we'd fetch actual transactions
                const generatedBalances: PlayerBalance[] = squad.map((player, index) => {
                    // deterministically mock status based on index for demo variety
                    // 0, 1, 4, ... = paid
                    // 2 = partial
                    // 5 = unpaid
                    let status: 'paid' | 'partial' | 'unpaid' = 'paid';
                    let paid = 50;
                    let owed = 0;

                    if (index === 2) {
                        status = 'partial';
                        paid = 25;
                        owed = 25;
                    } else if (index === 5 || index === 8) {
                        status = 'unpaid';
                        paid = 0;
                        owed = 50;
                    }

                    return {
                        id: player.id,
                        name: formatName(player.name),
                        paid,
                        owed,
                        total: 50, // Assuming 10 games * £5
                        status
                    };
                });

                setBalances(generatedBalances);

                // Calc Summary
                const totalCollected = generatedBalances.reduce((acc, curr) => acc + curr.paid, 0);
                const totalOutstanding = generatedBalances.reduce((acc, curr) => acc + curr.owed, 0);

                setSummary({
                    totalCollected,
                    totalOutstanding,
                    perMatchFee: 5,
                    totalPlayers: squad.length
                });

            } catch (error) {
                console.error("Failed to load fees data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleExport = () => {
        setIsExporting(true);
        // Simulate generating CSV
        setTimeout(() => {
            setIsExporting(false);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
            console.log("Exported CSV");
        }, 1500);
    };

    const toggleSelection = (index: number) => {
        const newSet = new Set(selectedIndices);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setSelectedIndices(newSet);
    };

    const toggleAll = () => {
        if (selectedIndices.size === balances.length) {
            setSelectedIndices(new Set());
        } else {
            setSelectedIndices(new Set(balances.map((_, i) => i)));
        }
    };

    const handleSendReminder = () => {
        if (selectedIndices.size === 0) return;
        setIsReminding(true);

        // Mock API call
        setTimeout(() => {
            alert(`Payment reminders sent to ${selectedIndices.size} players!`);
            setIsReminding(false);
            setSelectedIndices(new Set());
        }, 1000);
    };

    if (isLoading) {
        return <div className="p-10 text-center text-gray-500 font-mono text-xs uppercase tracking-widest">Loading Financial Data...</div>;
    }

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <span className="text-wts-green text-[9px] font-bold tracking-[0.3em] uppercase block mb-1.5 font-mono">
                        {t('settings.payment_setup')}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold italic uppercase tracking-tighter text-white">
                        {t('nav.fees').toUpperCase()}
                    </h2>
                </div>
                <div className="flex items-stretch space-x-3">
                    <button
                        onClick={handleSendReminder}
                        disabled={selectedIndices.size === 0 || isReminding}
                        className={`px-6 py-4 border rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-3 shadow-lg transition-all ${selectedIndices.size > 0 && !isReminding
                            ? 'bg-wts-green border-wts-green text-black hover:bg-white hover:border-white'
                            : 'bg-black/40 text-gray-500 border-white/10 cursor-not-allowed'
                            }`}
                    >
                        <Bell size={18} />
                        <span>{isReminding ? 'Sending...' : t('settings.payment_reminders')}</span>
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className={`px-6 py-4 border rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-3 shadow-lg transition-all ${exportSuccess
                            ? 'bg-wts-green border-wts-green text-black'
                            : 'bg-black/40 text-white border border-white/10 hover:bg-white/10'
                            }`}
                    >
                        {exportSuccess ? <Check size={18} /> : <Download size={18} className={exportSuccess ? "" : "text-gray-400"} />}
                        <span>{isExporting ? 'Generating...' : exportSuccess ? 'Exported' : 'Export CSV'}</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-black/40 border border-white/5 rounded-lg p-4">
                    <p className="text-[9px] font-bold tracking-[0.2em] text-gray-600 uppercase font-mono mb-2">
                        {t('dashboard.widgets.total_to_collect')} (Paid)
                    </p>
                    <p className="text-2xl font-display font-bold italic text-wts-green">
                        £{summary.totalCollected}.00
                    </p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-lg p-4">
                    <p className="text-[9px] font-bold tracking-[0.2em] text-gray-600 uppercase font-mono mb-2">
                        {t('dashboard.widgets.outstanding_fees')}
                    </p>
                    <p className="text-2xl font-display font-bold italic text-red-500">
                        £{summary.totalOutstanding}.00
                    </p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-lg p-4">
                    <p className="text-[9px] font-bold tracking-[0.2em] text-gray-600 uppercase font-mono mb-2">
                        {t('settings.per_match_fee')}
                    </p>
                    <p className="text-2xl font-display font-bold italic text-white">£{summary.perMatchFee}.00</p>
                </div>
                <div className="bg-black/40 border border-white/5 rounded-lg p-4">
                    <p className="text-[9px] font-bold tracking-[0.2em] text-gray-600 uppercase font-mono mb-2">
                        Active Players
                    </p>
                    <p className="text-2xl font-display font-bold italic text-white">{summary.totalPlayers}</p>
                </div>
            </div>

            {/* Player Balances */}
            <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 items-center">
                    <div className="col-span-1 flex justify-center">
                        <input
                            type="checkbox"
                            checked={selectedIndices.size === balances.length && balances.length > 0}
                            onChange={toggleAll}
                            className="w-4 h-4 rounded border-gray-600 bg-black/40 text-wts-green focus:ring-wts-green focus:ring-offset-black"
                        />
                    </div>
                    <div className="col-span-4 text-[8px] font-bold text-gray-600 uppercase tracking-widest">{t('dashboard.roles.player')}</div>
                    <div className="col-span-2 text-[8px] font-bold text-gray-600 uppercase tracking-widest">Paid</div>
                    <div className="col-span-2 text-[8px] font-bold text-gray-600 uppercase tracking-widest">Owed</div>
                    <div className="col-span-2 text-[8px] font-bold text-gray-600 uppercase tracking-widest">Total</div>
                    <div className="col-span-1 text-[8px] font-bold text-gray-600 uppercase tracking-widest">Status</div>
                </div>

                {/* Player Rows */}
                <div className="divide-y divide-white/5">
                    {balances.map((player, i) => (
                        <div
                            key={player.id}
                            className={`grid grid-cols-12 gap-4 p-4 transition-colors items-center cursor-pointer ${selectedIndices.has(i) ? 'bg-white/10' : 'hover:bg-white/5'
                                }`}
                            onClick={() => toggleSelection(i)}
                        >
                            <div className="col-span-1 flex justify-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIndices.has(i)}
                                    onChange={() => { }} // handled by row click
                                    className="w-4 h-4 rounded border-gray-600 bg-black/40 text-wts-green focus:ring-wts-green focus:ring-offset-black"
                                />
                            </div>
                            <div className="col-span-4 flex items-center">
                                <span className="text-sm font-bold text-white">{player.name}</span>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <span className="text-sm font-bold text-wts-green">£{player.paid}.00</span>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <span className={`text-sm font-bold ${player.owed > 0 ? 'text-red-500' : 'text-gray-600'}`}>
                                    £{player.owed}.00
                                </span>
                            </div>
                            <div className="col-span-2 flex items-center">
                                <span className="text-sm font-bold text-white">£{player.total}.00</span>
                            </div>
                            <div className="col-span-1 flex items-center">
                                {player.status === 'paid' && (
                                    <span className="px-2 py-1 bg-wts-green/10 border border-wts-green/20 rounded text-[8px] font-bold text-wts-green uppercase tracking-widest">
                                        Paid
                                    </span>
                                )}
                                {player.status === 'partial' && (
                                    <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-[8px] font-bold text-yellow-500 uppercase tracking-widest">
                                        Partial
                                    </span>
                                )}
                                {player.status === 'unpaid' && (
                                    <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[8px] font-bold text-red-500 uppercase tracking-widest">
                                        Unpaid
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
