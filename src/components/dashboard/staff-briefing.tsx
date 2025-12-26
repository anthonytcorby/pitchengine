'use client';

import { Calendar, Bell, Lock, Users2, Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { Player } from '@/types/schema';

interface StaffBriefingProps {
    squad?: Player[];
}

export function StaffBriefing({ squad = [] }: StaffBriefingProps) {
    const [notified, setNotified] = useState(false);
    const [locked, setLocked] = useState(false);

    const handleNotify = () => {
        setNotified(true);
        setTimeout(() => setNotified(false), 3000);
    };

    const handleLock = () => {
        setLocked(true);
    };

    return (
        <div className="space-y-4">
            {/* Next Fixture Panel */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-5">
                <div className="flex items-center space-x-2 mb-5">
                    <div className="p-1.5 bg-wts-green/10 rounded-md">
                        <Calendar className="text-wts-green w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-[0.15em] text-white">
                        NEXT FIXTURE
                    </h3>
                </div>

                {/* Fixture Pairing */}
                <div className="flex items-center justify-between mb-5">
                    <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xs font-bold italic mb-1.5">
                            PE
                        </div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">
                            PITCHENGINE
                        </p>
                    </div>
                    <span className="text-xs font-bold text-wts-green italic">VS</span>
                    <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xs font-bold italic mb-1.5">
                            TU
                        </div>
                        <p className="text-sm font-bold text-white uppercase tracking-widest">
                            TECH UNITED
                        </p>
                    </div>
                </div>

                {/* Fixture Details */}
                <div className="space-y-2 pt-4 border-t border-white/5 mb-5">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Competition
                        </span>
                        <span className="text-xs font-bold text-white">Tuesday League</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Kick Off
                        </span>
                        <span className="text-xs font-bold text-white">19:30 Tuesday</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Pitch
                        </span>
                        <span className="text-xs font-bold text-white">Pitch 4, PL Central</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Status
                        </span>
                        <span className="text-xs font-bold text-wts-green">MATCH ON</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <button
                        onClick={handleNotify}
                        disabled={notified}
                        className="w-full py-3 px-4 bg-wts-green/10 border border-wts-green/20 rounded-lg text-xs font-bold uppercase tracking-widest text-wts-green hover:bg-wts-green/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            {notified ? <Check size={14} /> : <Bell size={14} />}
                            <span>{notified ? 'Notification Sent' : 'Notify Squad'}</span>
                        </div>
                    </button>
                    <button
                        onClick={handleLock}
                        disabled={locked}
                        className={`w-full py-3 px-4 border rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${locked
                            ? 'bg-wts-green border-wts-green text-black'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            {locked ? <Check size={14} /> : <Lock size={14} />}
                            <span>{locked ? 'Squad Locked' : 'Lock Matchday Squad'}</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Squad Status List */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-white/5 rounded-md">
                            <Users2 className="text-gray-400 w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-sm uppercase tracking-[0.15em] text-white">
                            SQUAD STATUS
                        </h3>
                    </div>
                    <Link href="/dashboard/squad" className="text-[9px] font-bold text-wts-green uppercase tracking-widest hover:underline">
                        Manage
                    </Link>
                </div>

                <div className="space-y-2">
                    {squad.slice(0, 8).map((player) => (
                        <div
                            key={player.id}
                            className="flex items-center justify-between bg-white/5 rounded-md p-2.5 border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${player.attendance >= 90
                                        ? 'bg-wts-green'
                                        : player.attendance >= 50
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                        }`}
                                />
                                <span className="text-sm font-bold text-white flex items-center space-x-1.5">
                                    <span>{player.name}</span>
                                    {player.captain && (
                                        <span className="text-[9px] text-wts-green">(C)</span>
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                    {player.role}
                                </span>
                                {player.reliability >= 90 && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-wts-green" title="High reliability" />
                                )}
                            </div>
                        </div>
                    ))}
                    {squad.length === 0 && (
                        <div className="p-4 text-center text-xs text-gray-500 font-mono">
                            NO SQUAD DATA
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
