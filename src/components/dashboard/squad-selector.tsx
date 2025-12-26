'use client';

import { X, Search, User } from 'lucide-react';
import { useState } from 'react';

interface SquadMember {
    id: number;
    name: string;
    number: number;
    role: string;
    status: 'available' | 'injured' | 'suspended';
    condition: number;
}

interface SquadSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (player: SquadMember) => void;
    currentPosition: string;
}

const MOCK_SQUAD: SquadMember[] = [
    { id: 1, name: 'Jake Smith', number: 1, role: 'GK', status: 'available', condition: 100 },
    { id: 2, name: 'Ryan Williams', number: 2, role: 'RB', status: 'available', condition: 94 },
    { id: 3, name: 'Luke Anderson', number: 3, role: 'LB', status: 'available', condition: 92 },
    { id: 4, name: 'Marcus Richards', number: 4, role: 'CB', status: 'available', condition: 88 },
    { id: 5, name: 'Anthony Corby', number: 5, role: 'CB', status: 'available', condition: 95 },
    { id: 6, name: 'Ben Clarke', number: 6, role: 'CM', status: 'available', condition: 91 },
    { id: 7, name: 'Kevin Martinez', number: 7, role: 'LM', status: 'available', condition: 89 },
    { id: 8, name: 'Paul Foster', number: 8, role: 'CM', status: 'available', condition: 93 },
    { id: 9, name: 'James Thompson', number: 9, role: 'ST', status: 'available', condition: 96 },
    { id: 10, name: 'Tom Harris', number: 10, role: 'ST', status: 'available', condition: 85 },
    { id: 11, name: 'Daniel Vieri', number: 11, role: 'LW', status: 'available', condition: 87 },
    { id: 12, name: 'Sam Roberts', number: 12, role: 'RM', status: 'available', condition: 82 },
    { id: 13, name: 'Chris Evans', number: 13, role: 'CB', status: 'injured', condition: 45 },
    { id: 14, name: 'Mike Brown', number: 14, role: 'CDM', status: 'available', condition: 98 },
    { id: 15, name: 'Alex Turner', number: 15, role: 'CAM', status: 'suspended', condition: 100 },
];

export function SquadSelector({ isOpen, onClose, onSelect, currentPosition }: SquadSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const filteredSquad = MOCK_SQUAD.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.number.toString().includes(searchQuery)
    );

    return (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-md bg-[#0A0A0A] border-l border-white/10 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-display font-bold italic text-2xl uppercase">Select Player</h3>
                        <p className="text-gray-500 text-sm font-mono uppercase tracking-widest mt-1">
                            For Position: <span className="text-wts-green">{currentPosition}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, number or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3.5 pl-11 pr-4 text-base text-white focus:outline-none focus:border-wts-green/50 placeholder:text-gray-600"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Player List */}
                <div className="flex-1 overflow-y-auto hidden-scrollbar p-2">
                    <div className="space-y-1">
                        {filteredSquad.map((player) => (
                            <button
                                key={player.id}
                                onClick={() => onSelect(player)}
                                disabled={player.status !== 'available'}
                                className={`w-full flex items-center p-3 rounded-lg border border-transparent transition-all group ${player.status !== 'available'
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-white/5 hover:border-white/10 cursor-pointer'
                                    }`}
                            >
                                {/* Kit Number */}
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-base mr-4 border-2 ${player.role === 'GK'
                                    ? 'bg-yellow-400 text-black border-yellow-500'
                                    : 'bg-wts-green text-black border-wts-green'
                                    }`}>
                                    {player.number}
                                </div>

                                {/* Details */}
                                <div className="flex-1 text-left">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white font-bold text-base tracking-wide group-hover:text-wts-green transition-colors">
                                            {player.name}
                                        </span>
                                        <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded ${player.status === 'available' ? 'text-gray-400 bg-white/5' :
                                            player.status === 'injured' ? 'text-red-500 bg-red-500/10' :
                                                'text-yellow-500 bg-yellow-500/10'
                                            }`}>
                                            {player.role}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4 mt-1.5">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${player.condition > 90 ? 'bg-wts-green' : 'bg-yellow-500'}`}
                                                    style={{ width: `${player.condition}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-mono">{player.condition}% FIT</span>
                                        </div>
                                        {player.status !== 'available' && (
                                            <span className="text-[10px] font-bold text-red-500 uppercase">
                                                {player.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
