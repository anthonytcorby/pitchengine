'use client';

import { useState, useEffect } from 'react';
import { Users, Star, Clock, Shield, ArrowUpDown, ArrowUp, ArrowDown, X, Plus, Mail, Eye, Check } from 'lucide-react';
import { PlayerModal } from '@/components/dashboard/player-modal';
import Image from 'next/image';
import { api } from '@/services/api';
import { Player, Role, Team } from '@/types/schema';
import { formatName } from '@/lib/utils';

type SortKey = 'number' | 'name' | 'nationality' | 'role' | 'attendance' | 'reliability' | 'preferredFoot' | 'captain' | 'stats.appearances' | 'stats.goals' | 'stats.assists' | 'stats.yellowCards' | 'stats.redCards' | 'stats.motm';
type SortDirection = 'asc' | 'desc';

type ColumnId = 'number' | 'name' | 'nationality' | 'role' | 'attendance' | 'reliability' | 'preferredFoot' | 'appearances' | 'goals' | 'assists' | 'yellowCards' | 'redCards' | 'motm';

interface ColumnDef {
    id: ColumnId;
    label: string;
    sortKey: SortKey;
    defaultVisible: boolean;
}

const ALL_COLUMNS: ColumnDef[] = [
    { id: 'number', label: '#', sortKey: 'number', defaultVisible: true },
    { id: 'nationality', label: 'NAT', sortKey: 'nationality', defaultVisible: true },
    { id: 'name', label: 'PLAYER', sortKey: 'name', defaultVisible: true },
    { id: 'role', label: 'ROLE', sortKey: 'role', defaultVisible: true },
    { id: 'preferredFoot', label: 'FOOT', sortKey: 'preferredFoot', defaultVisible: true },
    { id: 'attendance', label: 'ATTENDANCE', sortKey: 'attendance', defaultVisible: true },
    { id: 'reliability', label: 'RELIABILITY', sortKey: 'reliability', defaultVisible: true },
    // New Stats Columns
    { id: 'appearances', label: 'APPS', sortKey: 'stats.appearances', defaultVisible: true },
    { id: 'goals', label: 'GOALS', sortKey: 'stats.goals', defaultVisible: true },
    { id: 'assists', label: 'ASSISTS', sortKey: 'stats.assists', defaultVisible: true },
    { id: 'yellowCards', label: 'YC', sortKey: 'stats.yellowCards', defaultVisible: true },
    { id: 'redCards', label: 'RC', sortKey: 'stats.redCards', defaultVisible: true },
    { id: 'motm', label: 'MOTM', sortKey: 'stats.motm', defaultVisible: true },
];

export default function SquadPage() {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
        key: 'number',
        direction: 'asc',
    });

    const [players, setPlayers] = useState<Player[]>([]);
    const [team, setTeam] = useState<Team | null>(null);
    const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

    // Default columns logic: If localStorage not used yet, default to all.
    // For now, simpler to just use state, maybe persisted later.
    const [visibleColumns, setVisibleColumns] = useState<Set<ColumnId>>(new Set(ALL_COLUMNS.filter(c => c.defaultVisible).map(c => c.id)));

    // Form State
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerNumber, setNewPlayerNumber] = useState('');
    const [newPlayerRole, setNewPlayerRole] = useState<Role>('CM');

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            // Hardcoded teamId for now as per Mock/Simple implementation
            try {
                const [squad, teamData] = await Promise.all([
                    api.getSquad('team-wts'),
                    api.getTeam('team-wts')
                ]);
                setPlayers(squad);
                setTeam(teamData);
            } catch (e) {
                console.error("Failed to load squad page data", e);
            }
        };
        loadData();
    }, []);

    const toggleColumn = (colId: ColumnId) => {
        const newSet = new Set(visibleColumns);
        if (newSet.has(colId)) {
            newSet.delete(colId);
        } else {
            newSet.add(colId);
        }
        setVisibleColumns(newSet);
    };

    const handleUpdatePlayer = async (updatedPlayer: Player) => {
        // Enforce Single Captain
        if (updatedPlayer.captain) {
            const previousCaptain = players.find(p => p.captain && p.id !== updatedPlayer.id);
            if (previousCaptain) {
                const downgraded = { ...previousCaptain, captain: false };
                await api.updatePlayer(downgraded); // Update in backend
                // Local state update usually happens via refetch or manual mapping, 
                // but we'll handle `players` state update in one go below if possible.
                // Actually, let's just update the local array first to avoid race conditions visually.
            }
        }

        // Enforce Single Vice Captain
        if (updatedPlayer.viceCaptain) {
            const previousVC = players.find(p => p.viceCaptain && p.id !== updatedPlayer.id);
            if (previousVC) {
                const downgradedVC = { ...previousVC, viceCaptain: false };
                await api.updatePlayer(downgradedVC);
            }
        }

        const saved = await api.updatePlayer(updatedPlayer);

        // Refresh local state fully to be safe, or manually map
        setPlayers(current => current.map(p => {
            if (p.id === saved.id) return saved;
            // Unset others if needed
            if (saved.captain && p.captain && p.id !== saved.id) return { ...p, captain: false };
            if (saved.viceCaptain && p.viceCaptain && p.id !== saved.id) return { ...p, viceCaptain: false };
            return p;
        }));
        setEditingPlayer(null);
    };

    const handleReleasePlayer = async (playerId: string) => {
        await api.deletePlayer(playerId);
        setPlayers(players.filter(p => p.id !== playerId));
        setEditingPlayer(null);
    };

    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault();

        const newPlayerPayload: Omit<Player, 'id' | 'teamId'> = {
            name: formatName(newPlayerName),
            number: parseInt(newPlayerNumber) || 0,
            role: newPlayerRole,
            position: newPlayerRole,
            captain: false,
            attendance: 100, // Default for new player
            reliability: 100, // Default 5.0 (100/20) for new players
            preferred: false,
            nationality: 'gb-eng', // Default
            preferredFoot: 'Right',
            reliabilityHistory: [],
            stats: { appearances: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, motm: 0 }
        };

        const created = await api.createPlayer(newPlayerPayload);
        setPlayers([...players, created]);

        setIsAddModalOpen(false);
        setNewPlayerName('');
        setNewPlayerNumber('');
        setNewPlayerRole('CM');
    };

    const sortedPlayers = [...players].sort((a, b) => {
        // Handle nested keys like 'stats.goals'
        const getValue = (obj: any, path: string) => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };

        const aValue = getValue(a, sortConfig.key);
        const bValue = getValue(b, sortConfig.key);

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: SortKey) => {
        setSortConfig((current) => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const SortIcon = ({ column }: { column: SortKey }) => {
        if (sortConfig.key !== column) return <ArrowUpDown size={12} className="text-gray-600 opacity-50 group-hover:opacity-100" />;
        return sortConfig.direction === 'asc'
            ? <ArrowUp size={12} className="text-wts-green" />
            : <ArrowDown size={12} className="text-wts-green" />;
    };

    // Invite Handler (passed to PlayerModal)
    const handleInvitePlayer = (email: string, message: string) => {
        // Simulate sending invite
        alert(`Invite sent to ${email}!\n\nMessage: ${message}`);
    };

    // Helper to get reliability color (1-5 scale logic, but currently logic is 0-100)
    // 100 = 5.0
    const getReliabilityColor = (score: number) => {
        if (score >= 90) return 'text-wts-green';
        if (score >= 70) return 'text-yellow-500';
        if (score >= 50) return 'text-orange-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto relative">

            {/* Edit Player Modal (Unified) */}
            <PlayerModal
                isOpen={!!editingPlayer}
                onClose={() => setEditingPlayer(null)}
                player={editingPlayer}
                teamName={team?.name}
                onSave={handleUpdatePlayer}
                onRelease={handleReleasePlayer}
                onInvite={handleInvitePlayer}
            />

            {/* Add Player Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-display font-bold italic text-white uppercase">Add New Player</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddPlayer} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Player Name</label>
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={(e) => setNewPlayerName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50"
                                    placeholder="e.g. Harry Kane"
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kit Number</label>
                                    <input
                                        type="number"
                                        value={newPlayerNumber}
                                        onChange={(e) => setNewPlayerNumber(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50"
                                        placeholder="9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Position</label>
                                    <select
                                        value={newPlayerRole}
                                        onChange={(e) => setNewPlayerRole(e.target.value as Role)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50"
                                    >
                                        {['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST'].map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button type="submit" className="w-full bg-wts-green text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-white transition-colors">
                                    Create Player
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <span className="text-wts-green text-sm font-bold tracking-[0.3em] uppercase block mb-1.5 font-mono">
                        SQUAD MANAGEMENT
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold italic uppercase tracking-tighter text-white">
                        PLAYER ROSTER
                    </h2>
                </div>
                <div className="flex items-center space-x-3">
                    {/* View Options Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                            className="bg-black/40 text-white border border-white/10 hover:bg-white/10 px-4 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-2 shadow-lg transition-all"
                        >
                            <Eye size={18} />
                            <span className="hidden sm:inline">View</span>
                        </button>

                        {isViewMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-2 border-b border-white/5 mb-1">
                                    Visible Columns
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {ALL_COLUMNS.map(col => (
                                        <button
                                            key={col.id}
                                            onClick={() => toggleColumn(col.id)}
                                            className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/5 rounded flex items-center justify-between group"
                                        >
                                            <span>{col.label}</span>
                                            {visibleColumns.has(col.id) && (
                                                <Check size={14} className="text-wts-green" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Overlay to close */}
                        {isViewMenuOpen && (
                            <div
                                className="fixed inset-0 z-40 bg-transparent"
                                onClick={() => setIsViewMenuOpen(false)}
                            />
                        )}
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-black/40 text-white border border-white/10 hover:bg-white/10 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-3 shadow-lg transition-all"
                    >
                        <Plus size={18} className="text-wts-green" />
                        <span className="hidden sm:inline">Add Player</span>
                    </button>
                </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden overflow-x-auto">
                {/* Table Header */}
                <div className="w-full min-w-[1000px]">
                    <div className="grid grid-flow-col auto-cols-[minmax(0,_1fr)] gap-4 p-4 border-b border-white/5 bg-white/5">
                        {ALL_COLUMNS.map(col => {
                            if (!visibleColumns.has(col.id)) return null;

                            // Special styling for Name column (wider usually, but grid-flow-col helps spread)
                            const isName = col.id === 'name';
                            const sortable = true;

                            return (
                                <button
                                    key={col.id}
                                    onClick={() => handleSort(col.sortKey)}
                                    className={`flex items-center space-x-1 group text-left ${isName ? 'justify-start min-w-[200px]' : 'justify-center'}`}
                                >
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-white transition-colors">
                                        {col.label}
                                    </span>
                                    <SortIcon column={col.sortKey} />
                                </button>
                            );
                        })}
                        {/* Edit Action Column always visible at end */}
                        <div className="w-10 justify-end flex"></div>
                    </div>

                    {/* Table Rows */}
                    <div>
                        {sortedPlayers.map((player) => (
                            <div
                                key={player.id}
                                className={`grid grid-flow-col auto-cols-[minmax(0,_1fr)] gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer ${player.status === 'linkless' ? 'opacity-70 hover:opacity-100 bg-white/[0.02]' : ''}`}
                                onClick={() => setEditingPlayer(player)}
                            >
                                {ALL_COLUMNS.map(col => {
                                    if (!visibleColumns.has(col.id)) return null;

                                    if (col.id === 'number') {
                                        return (
                                            <div key={col.id} className="flex items-center justify-center">
                                                <span className="font-mono text-sm font-bold text-gray-400 group-hover:text-white/80">{player.number}</span>
                                            </div>
                                        );
                                    }
                                    if (col.id === 'nationality') {
                                        return (
                                            <div key={col.id} className="flex items-center justify-center">
                                                <img
                                                    src={`https://flagcdn.com/24x18/${player.nationality || 'gb-eng'}.png`}
                                                    width="20" height="15"
                                                    alt={player.nationality}
                                                    className="rounded-sm opacity-80 group-hover:opacity-100"
                                                />
                                            </div>
                                        );
                                    }
                                    if (col.id === 'name') {
                                        return (
                                            <div key={col.id} className="flex items-center space-x-4 min-w-[200px]">
                                                <span className="text-sm font-bold text-white truncate">{formatName(player.name)}</span>
                                                {player.isAdmin && (
                                                    <span title="Club Secretary">
                                                        <Shield size={12} className="text-red-500" />
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    }
                                    if (col.id === 'role') {
                                        return (
                                            <div key={col.id} className="flex items-center justify-center">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${player.position === 'GK' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    player.position === 'ST' || player.position === 'LW' || player.position === 'RW' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                    }`}>
                                                    {player.position}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (col.id === 'preferredFoot') {
                                        return (
                                            <div key={col.id} className="flex items-center justify-center">
                                                <span className="text-xs text-gray-400 capitalize">{player.preferredFoot}</span>
                                            </div>
                                        );
                                    }
                                    if (col.id === 'attendance') {
                                        const attendancePercentage = player.attendance ?? 0;
                                        const hue = Math.round((attendancePercentage / 100) * 120);
                                        return (
                                            <div key={col.id} className="flex items-center justify-center w-full px-4">
                                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${attendancePercentage}%`,
                                                            backgroundColor: `hsl(${hue}, 80%, 50%)`,
                                                            boxShadow: `0 0 10px hsl(${hue}, 80%, 50%, 0.4)`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    }
                                    if (col.id === 'reliability') {
                                        return (
                                            <div key={col.id} className="flex items-center justify-center space-x-1">
                                                <Star className={`w-3 h-3 ${getReliabilityColor(player.reliability)}`} fill="currentColor" />
                                                <span className={`text-sm font-bold ${getReliabilityColor(player.reliability)}`}>
                                                    {(player.reliability / 20).toFixed(1)}
                                                </span>
                                            </div>
                                        );
                                    }
                                    // Stats Columns
                                    if (col.id === 'appearances' || col.id === 'goals' || col.id === 'assists' || col.id === 'yellowCards' || col.id === 'redCards' || col.id === 'motm') {
                                        const val = player.stats ? player.stats[col.id as keyof typeof player.stats] : 0;
                                        // Highlight non-zero values for better readability
                                        const styles =
                                            col.id === 'yellowCards' && val > 0 ? 'text-yellow-500' :
                                                col.id === 'redCards' && val > 0 ? 'text-red-500' :
                                                    col.id === 'motm' && val > 0 ? 'text-wts-green' :
                                                        val > 0 ? 'text-white' : 'text-gray-600';

                                        return (
                                            <div key={col.id} className="flex items-center justify-center">
                                                <span className={`text-sm font-bold ${styles}`}>{val}</span>
                                            </div>
                                        );
                                    }

                                    return <div key={col.id}></div>;
                                })}

                                {/* Edit Action Column (always present at end) */}
                                <div className="flex items-center justify-end w-10">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {player.status === 'linkless' ? (
                                            <Mail size={14} className="text-wts-green" />
                                        ) : (
                                            <Users size={14} className="text-gray-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
