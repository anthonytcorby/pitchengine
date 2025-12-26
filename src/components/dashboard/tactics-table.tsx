import React from 'react';
import { Users } from 'lucide-react';
import Image from 'next/image';
import { setDragGhost } from '@/lib/drag-utils';
import { Player } from '@/types/schema';

interface TacticsTableProps {
    squad: Player[];
    lineup: Record<number, string>;
    subs: Record<number, string>;
}

export function TacticsTable({ squad, lineup, subs }: TacticsTableProps) {
    const isPicked = (playerId: string) => {
        return Object.values(lineup).includes(playerId) || Object.values(subs).includes(playerId);
    };

    return (
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl h-full flex flex-col overflow-hidden">
            <div className="flex items-center space-x-3 mb-6">
                <div className="p-2.5 bg-wts-green/10 rounded-lg">
                    <Users size={20} className="text-wts-green" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Squad</h3>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="py-4 pl-3 text-xs font-bold text-gray-500 uppercase tracking-widest w-14">No.</th>
                            <th className="py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Player</th>
                            <th className="py-4 pr-3 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Pos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {squad.map((player) => {
                            const picked = isPicked(player.id);
                            return (
                                <tr
                                    key={player.id}
                                    draggable={true}
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('playerId', player.id);
                                        setDragGhost(e, player.number, player.position);
                                    }}
                                    className={`border-b border-white/5 last:border-0 transition-all cursor-grab active:cursor-grabbing group hover:bg-white/5 border-l-4 border-l-transparent ${picked
                                        ? 'border-l-wts-green bg-white/5'
                                        : 'hover:border-l-wts-green'
                                        }`}
                                >
                                    <td className="py-4 pl-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${player.position === 'GK'
                                            ? 'bg-yellow-400 text-black'
                                            : picked
                                                ? 'bg-wts-green text-black'
                                                : 'bg-white/5 text-gray-500 border border-white/10'
                                            }`}>
                                            {player.number}
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center space-x-3">
                                            {player.nationality && (
                                                <div className={`relative w-5 h-3.5 rounded-sm overflow-hidden shadow-sm transition-opacity ${picked ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                                                    <Image
                                                        src={`https://flagcdn.com/w40/${player.nationality}.png`}
                                                        alt={player.nationality}
                                                        fill
                                                        className="object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            )}
                                            <span className={`text-sm font-bold transition-colors ${picked ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                                                {player.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-3 text-right">
                                        <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-md border ${picked
                                            ? 'text-wts-green bg-wts-green/10 border-wts-green/20'
                                            : 'text-gray-600 bg-white/5 border-white/5 group-hover:text-gray-400'
                                            }`}>
                                            {player.position}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
