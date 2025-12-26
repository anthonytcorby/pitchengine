'use client';

import { forwardRef } from 'react';
import { Player } from '@/types/schema';
import { Trophy, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';

interface MatchdayGraphicProps {
    startingXI: any[];
    subs: any[];
    formationCoords: { x: number; y: number }[];
    matchDetails: any;
    teamName: string;
}

export const MatchdayGraphic = forwardRef<HTMLDivElement, MatchdayGraphicProps>(({ startingXI, subs, formationCoords, matchDetails, teamName }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[1920px] h-[1080px] bg-zinc-900 relative overflow-hidden text-white font-sans flex flex-col"
            style={{
                backgroundImage: 'url(/matchday-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // Ensure it's hidden from normal view but renderable
                position: 'fixed',
                left: '-9999px'
                // top: 0, zIndex: -1 // For debugging, change left to 0
            }}
        >
            {/* Dark Overlay with Black Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/80" />
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-black via-black/90 to-transparent z-0" />
            <div className="absolute inset-0 border-[40px] border-black pointer-events-none z-50" />

            {/* Header */}
            <div className="relative z-10 w-full p-12 pb-6 flex items-start justify-between border-b border-white/10">
                {/* Team / Logo */}
                <div className="flex items-center space-x-5">
                    <div className="w-20 h-20 bg-wts-green rounded-full flex items-center justify-center text-black shadow-2xl shadow-wts-green/20">
                        <Trophy size={40} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-bold italic uppercase tracking-tighter text-white leading-none mb-1">
                            {teamName || 'PITCH ENGINE'}
                        </h1>
                        <p className="text-xl font-bold text-wts-green uppercase tracking-widest flex items-center space-x-2">
                            <span>Starting XI</span>
                            <span className="w-1 h-1 bg-white rounded-full" />
                            <span>Match Day</span>
                        </p>
                    </div>
                </div>

                {/* Match Details (No Icons) */}
                <div className="text-right">
                    <h2 className="text-5xl font-display font-bold italic text-white uppercase tracking-tighter mb-2">
                        <span className="text-gray-500 text-3xl mr-3 align-middle">VS</span>
                        {matchDetails.opponent}
                    </h2>
                    <div className="flex items-center justify-end space-x-3 text-lg font-bold text-gray-300 uppercase tracking-widest">
                        <span>{matchDetails.date}</span>
                        <span className="text-wts-green">•</span>
                        <span>{matchDetails.venue}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="relative z-10 flex-1 px-16 py-8 grid grid-cols-12 gap-8 h-full">

                {/* Col 1: Starting XI (3 cols) */}
                <div className="col-span-3 flex flex-col justify-center border-r border-white/10 pr-8">
                    <h3 className="text-wts-green font-bold uppercase tracking-widest mb-6 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-wts-green rounded-full" />
                        <span>Starting XI</span>
                    </h3>
                    <div className="space-y-3">
                        {startingXI.map((player) => (
                            <div key={player.id} className="flex items-center space-x-4 border-b border-white/5 pb-2 last:border-0">
                                <span className="w-8 text-xl font-mono font-bold text-gray-400 text-right">{player.number || '-'}</span>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold uppercase tracking-tight text-white leading-none">{player.name}</span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{player.position}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Col 2: Substitutes (3 cols) */}
                <div className="col-span-3 flex flex-col justify-center border-r border-white/10 pr-8 pl-4">
                    <h3 className="text-gray-500 font-bold uppercase tracking-widest mb-6 flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
                        <span>Substitutes</span>
                    </h3>
                    <div className="space-y-4">
                        {subs.map((player) => (
                            <div key={player.id} className="flex items-center space-x-4">
                                <span className="w-8 text-lg font-mono font-bold text-gray-600 text-right">{player.number || 'S'}</span>
                                <span className="text-lg font-bold uppercase tracking-tight text-gray-300">{player.name}</span>
                            </div>
                        ))}
                        {subs.length === 0 && (
                            <p className="text-gray-600 italic">No substitutes selected</p>
                        )}
                    </div>
                </div>

                {/* Col 3: Pitch Visual (6 cols) */}
                <div className="col-span-6 flex items-center justify-center relative pl-4">
                    <div className="w-full aspect-[4/3] relative border-[3px] border-white/10 rounded-xl bg-green-900/20 backdrop-blur-sm shadow-2xl overflow-hidden">
                        {/* Horizontal Pitch Markings */}
                        <div className="absolute inset-x-8 inset-y-4 border-2 border-white/20 opacity-40" />
                        <div className="absolute top-4 bottom-4 left-1/2 w-0.5 bg-white/20 -translate-x-1/2 opacity-40" />
                        <div className="absolute top-1/2 left-1/2 w-40 h-40 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-40" />
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 w-24 h-56 border-r-2 border-y-2 border-white/20 opacity-40" />
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-24 h-56 border-l-2 border-y-2 border-white/20 opacity-40" />

                        {/* Players on Pitch */}
                        {startingXI.map((player) => {
                            const coords = formationCoords[player.index] || { x: 50, y: 50 };
                            const hostX = 100 - coords.y;
                            const hostY = coords.x;

                            return (
                                <div
                                    key={player.id}
                                    className="absolute w-20 h-20 -ml-10 -mt-10 flex flex-col items-center justify-center z-10"
                                    style={{ left: `${hostX}%`, top: `${hostY}%` }}
                                >
                                    <div className={`w-12 h-12 rounded-full border-2 border-black shadow-xl flex items-center justify-center ${player.position === 'GK' ? 'bg-yellow-400 text-black' : 'bg-wts-green text-black'}`}>
                                        <span className="font-display font-bold text-lg tracking-tight">{player.number || '#'}</span>
                                    </div>
                                    <div className="mt-1 px-2 py-0.5 bg-black/80 rounded border border-white/10 backdrop-blur-md">
                                        <span className="text-xs font-bold text-white uppercase tracking-widest block leading-none whitespace-nowrap">
                                            {player.name.split(' ').pop()}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-16 right-16 z-20 flex items-center space-x-3 opacity-60">
                <div className="h-0.5 w-12 bg-wts-green" />
                <span className="text-lg font-bold uppercase tracking-[0.4em] text-white">POWERED BY PITCH ENGINE</span>
            </div>
        </div>
    );
});

MatchdayGraphic.displayName = 'MatchdayGraphic';
