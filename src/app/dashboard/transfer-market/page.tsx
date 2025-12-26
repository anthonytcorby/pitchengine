'use client';

import { useState } from 'react';
import { Search, MapPin, MessageSquare, Filter, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { formatName } from '@/lib/utils';

interface FreeAgent {
    id: string;
    name: string;
    nationalityCode: string; // ISO code for flag
    location: string;
    position: string;
    foot: 'Left' | 'Right' | 'Both';
    availability: string;
    avatar?: string;
}

const FREE_AGENTS: FreeAgent[] = [
    { id: 'fa1', name: 'Marcus Silva', nationalityCode: 'br', location: 'London, UK', position: 'CAM', foot: 'Left', availability: 'Weeknights' },
    { id: 'fa2', name: 'John Smith', nationalityCode: 'gb-eng', location: 'Manchester, UK', position: 'GK', foot: 'Right', availability: 'Weekends' },
    { id: 'fa3', name: 'Alessandro Conti', nationalityCode: 'it', location: 'London, UK', position: 'CDM', foot: 'Right', availability: 'Anytime' },
    { id: 'fa4', name: 'David Okafor', nationalityCode: 'ng', location: 'Birmingham, UK', position: 'ST', foot: 'Right', availability: 'Tue/Thu' },
    { id: 'fa5', name: 'Sven Jensen', nationalityCode: 'dk', location: 'London, UK', position: 'CB', foot: 'Left', availability: 'Weekends' },
    { id: 'fa6', name: 'Liam O\'Connor', nationalityCode: 'ie', location: 'Liverpool, UK', position: 'LB', foot: 'Left', availability: 'Mon/Wed' },
    { id: 'fa7', name: 'Hiroki Tanaka', nationalityCode: 'jp', location: 'London, UK', position: 'RW', foot: 'Both', availability: 'Weeknights' },
    { id: 'fa8', name: 'Carlos Rodriguez', nationalityCode: 'es', location: 'Leeds, UK', position: 'CM', foot: 'Right', availability: 'Flexible' },
];

export default function TransferMarketPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [positionFilter, setPositionFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState<{ key: keyof FreeAgent; direction: 'asc' | 'desc' } | null>(null);

    let displayedAgents = [...FREE_AGENTS].filter(agent =>
        (positionFilter === 'All' || agent.position === positionFilter) &&
        (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortConfig) {
        displayedAgents.sort((a, b) => {
            const valA = a[sortConfig.key] ?? '';
            const valB = b[sortConfig.key] ?? '';

            if (valA < valB) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (valA > valB) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    const requestSort = (key: keyof FreeAgent) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: keyof FreeAgent) => {
        if (!sortConfig || sortConfig.key !== key) return <ArrowUpDown size={12} className="inline ml-1 text-gray-600 opacity-50" />;
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={12} className="inline ml-1 text-wts-green" />
            : <ArrowDown size={12} className="inline ml-1 text-wts-green" />;
    };

    const handleMessage = (name: string) => {
        alert(`Message interface for ${name} coming soon!`);
    };

    return (
        <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
            {/* Header */}
            <div>
                <span className="text-wts-green text-[9px] font-bold tracking-[0.3em] uppercase block mb-1.5 font-mono">
                    RECRUITMENT
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold italic uppercase tracking-tighter text-white">
                    TRANSFER MARKET
                </h2>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 bg-black/40 border border-white/5 p-4 rounded-xl backdrop-blur-md">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-wts-green/50 placeholder:text-gray-600"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="relative min-w-[150px]">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <select
                            value={positionFilter}
                            onChange={(e) => setPositionFilter(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-8 py-3 text-xs font-bold uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-wts-green/50 cursor-pointer"
                        >
                            <option value="All">All Positions</option>
                            <option value="GK">Goal Keeper</option>
                            <option value="CB">Defender</option>
                            <option value="CM">Midfielder</option>
                            <option value="ST">Forward</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Free Agents List */}
            <div className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th onClick={() => requestSort('name')} className="p-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono cursor-pointer hover:text-white transition-colors select-none group">
                                    Player {getSortIcon('name')}
                                </th>
                                <th onClick={() => requestSort('nationalityCode')} className="p-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono cursor-pointer hover:text-white transition-colors select-none group">
                                    Nationality {getSortIcon('nationalityCode')}
                                </th>
                                <th onClick={() => requestSort('location')} className="p-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono cursor-pointer hover:text-white transition-colors select-none group">
                                    Location {getSortIcon('location')}
                                </th>
                                <th onClick={() => requestSort('position')} className="p-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono cursor-pointer hover:text-white transition-colors select-none group">
                                    Position {getSortIcon('position')}
                                </th>
                                <th onClick={() => requestSort('foot')} className="p-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono cursor-pointer hover:text-white transition-colors select-none group">
                                    Foot {getSortIcon('foot')}
                                </th>
                                <th className="p-4 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {displayedAgents.map((agent) => (
                                <tr key={agent.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                {formatName(agent.name).charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-white">{formatName(agent.name)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={`https://flagcdn.com/24x18/${agent.nationalityCode === 'gb-eng' ? 'gb-eng' : agent.nationalityCode}.png`}
                                                srcSet={`https://flagcdn.com/48x36/${agent.nationalityCode === 'gb-eng' ? 'gb-eng' : agent.nationalityCode}.png 2x`}
                                                width="24"
                                                height="18"
                                                alt={agent.nationalityCode}
                                                className="rounded-sm"
                                            />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <MapPin size={12} />
                                            <span className="text-xs font-medium">{agent.location}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${agent.position === 'GK' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                            agent.position === 'ST' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                            }`}>
                                            {agent.position}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs text-gray-400 capitalize">{agent.foot}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleMessage(agent.name)}
                                            className="inline-flex items-center space-x-2 px-3 py-1.5 bg-wts-green text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors"
                                        >
                                            <MessageSquare size={12} />
                                            <span>Message</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayedAgents.length === 0 && (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No players found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
