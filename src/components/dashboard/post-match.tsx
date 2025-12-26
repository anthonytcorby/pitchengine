'use client';

import { Trophy, Star, Users, DollarSign, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function PostMatch() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [result, setResult] = useState({ home: '', away: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-yellow-500/10 rounded-md">
                        <Trophy className="text-yellow-500 w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-[0.15em] text-white">
                        POST-MATCH
                    </h3>
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    Available after match
                </span>
            </button>

            {isExpanded && (
                <div className="p-4 pt-0 space-y-4">
                    {/* Result Entry */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Match Result
                        </p>
                        <div className="flex items-center space-x-3">
                            <input
                                type="number"
                                placeholder="0"
                                className="w-16 bg-white/5 border border-white/10 rounded-md p-2 text-center text-base font-bold text-white focus:outline-none focus:border-wts-green/50"
                                value={result.home}
                                onChange={(e) => setResult({ ...result, home: e.target.value })}
                            />
                            <span className="text-xs font-bold text-gray-500">-</span>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-16 bg-white/5 border border-white/10 rounded-md p-2 text-center text-base font-bold text-white focus:outline-none focus:border-wts-green/50"
                                value={result.away}
                                onChange={(e) => setResult({ ...result, away: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/5 rounded-md p-3 space-y-1">
                            <Star size={16} className="text-yellow-400" />
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                Team Rating
                            </p>
                            <input
                                type="number"
                                step="0.1"
                                max="5"
                                placeholder="4.5"
                                className="w-full bg-black/20 border border-white/10 rounded p-1.5 text-sm font-bold text-white focus:outline-none focus:border-wts-green/50"
                            />
                        </div>
                        <div className="bg-white/5 rounded-md p-3 space-y-1">
                            <Users size={16} className="text-wts-green" />
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                Attendance
                            </p>
                            <input
                                type="number"
                                placeholder="14"
                                className="w-full bg-black/20 border border-white/10 rounded p-1.5 text-sm font-bold text-white focus:outline-none focus:border-wts-green/50"
                            />
                        </div>
                    </div>

                    {/* Fee Reconciliation */}
                    <div className="bg-white/5 rounded-md p-3 space-y-2">
                        <div className="flex items-center space-x-2">
                            <DollarSign size={16} className="text-wts-green" />
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                Fee Reconciliation
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Collected</span>
                            <span className="text-xs font-bold text-wts-green">£125.00</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Outstanding</span>
                            <span className="text-xs font-bold text-red-500">£25.00</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || isSubmitted}
                        className={`w-full py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isSubmitted
                                ? 'bg-wts-green text-black border border-wts-green opacity-100 cursor-default'
                                : 'bg-wts-green/10 border border-wts-green/20 text-wts-green hover:bg-wts-green/20'
                            }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            {isSubmitting ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : isSubmitted ? (
                                <Check size={14} />
                            ) : null}
                            <span>{isSubmitting ? 'Submitting...' : isSubmitted ? 'Report Submitted' : 'Submit Match Report'}</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
