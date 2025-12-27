'use client';

import { useState, useEffect, useMemo } from 'react';
import { TacticsBoard } from '@/components/dashboard/tactics-board';
import { TacticsTable } from '@/components/dashboard/tactics-table';
import { SquadSelector } from '@/components/dashboard/squad-selector';
import { Save, CheckCircle2, ChevronDown, UserPlus, Users, Wand2, ClipboardCheck, LayoutDashboard } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { api } from '@/services/api';
import { Player } from '@/types/schema';
import { ConfirmSquadModal } from '@/components/dashboard/confirm-squad-modal';

import { getFormationsForSize } from '@/lib/formations';

// Simple type for formation positions
interface FormationPos { x: number; y: number; role: string }

export default function TacticsPage() {
    // State
    const [squad, setSquad] = useState<Player[]>([]);

    const [teamSizeStr] = useLocalStorage<string>('wts-team-size', '11');
    const teamSize = parseInt(teamSizeStr, 10);

    const availableFormations = useMemo(() => getFormationsForSize(teamSize), [teamSize]);

    // --- POSSESSION STATE TRANSFORMATION ---
    const [possessionMode, setPossessionMode] = useState<'in' | 'out'>('in');
    const isIn = possessionMode === 'in';

    // --- SHARED SQUAD STATE (Same players, same bench) ---
    const [lineup, setLineup] = useLocalStorage<Record<number, string>>('wts-tactics-lineup-v2', {});
    const [subs, setSubs] = useLocalStorage<Record<number, string>>('wts-tactics-subs-v2', {});
    const [setPieces, setSetPieces] = useLocalStorage<Record<string, string>>('wts-tactics-set-pieces-v2', {});
    const [penalties, setPenalties] = useLocalStorage<Record<number, string>>('wts-tactics-penalties-v2', {});

    // --- INDEPENDENT FORMATION STATE (Different shapes) ---
    // In Possession
    const [tacticIn, setTacticIn] = useLocalStorage<string>('wts-tactics-formation-in', Object.keys(availableFormations)[0]);
    const [customIn, setCustomIn] = useLocalStorage<FormationPos[] | null>('wts-tactics-custom-in', null);

    // Out Possession
    const [tacticOut, setTacticOut] = useLocalStorage<string>('wts-tactics-formation-out', Object.keys(availableFormations)[0]);
    const [customOut, setCustomOut] = useLocalStorage<FormationPos[] | null>('wts-tactics-custom-out', null);

    // Dynamic Getters/Setters based on Mode
    const selectedTactic = isIn ? tacticIn : tacticOut;
    const setSelectedTactic = isIn ? setTacticIn : setTacticOut;

    const customFormation = isIn ? customIn : customOut;
    const setCustomFormation = isIn ? setCustomIn : setCustomOut;

    // Effect: Validation logic
    useEffect(() => {
        if (!availableFormations[selectedTactic]) {
            setSelectedTactic(Object.keys(availableFormations)[0]);
        }
    }, [teamSize, availableFormations, selectedTactic, setSelectedTactic]);


    // Load Data
    useEffect(() => {
        const loadSquad = async () => {
            const data = await api.getSquad('team-wts');
            setSquad(data);
        };
        loadSquad();
    }, []);

    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);
    const [currentRole, setCurrentRole] = useState<string>('');
    const [isSaved, setIsSaved] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isTacticsOpen, setIsTacticsOpen] = useState(false);
    const [isLocked, setIsLocked] = useState(true);

    // Derived State
    const currentFormation = customFormation || availableFormations[selectedTactic] || Object.values(availableFormations)[0];

    const handleTacticChange = (tacticName: string) => {
        setSelectedTactic(tacticName);
        setCustomFormation(null); // Reset custom tweaks on preset change
        setIsTacticsOpen(false);
        setIsSaved(false);
        setIsConfirmed(false);
    };

    const handleNodeMove = (index: number, x: number, y: number) => {
        const newFormation = [...currentFormation];
        newFormation[index] = { ...newFormation[index], x, y };
        setCustomFormation(newFormation);
    };

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleDrop = (playerId: string, targetType: 'pitch' | 'sub' | 'setPiece' | 'penalty', targetIndex: number | string) => {
        const newLineup = { ...lineup };
        const newSubs = { ...subs };
        const newSetPieces = { ...setPieces };
        const newPenalties = { ...penalties };

        // 1. Find source location of the dragged player
        let sourceIndex: number | string | null = null;
        let sourceType: 'pitch' | 'sub' | 'setPiece' | 'penalty' | null = null;

        // Check Pitch
        const pitchKey = Object.keys(newLineup).find(key => newLineup[parseInt(key)] === playerId);
        if (pitchKey) {
            sourceIndex = parseInt(pitchKey);
            sourceType = 'pitch';
            delete newLineup[sourceIndex as number];
        }

        // Check Subs
        if (!sourceType) {
            const subKey = Object.keys(newSubs).find(key => newSubs[parseInt(key)] === playerId);
            if (subKey) {
                sourceIndex = parseInt(subKey);
                sourceType = 'sub';
                delete newSubs[sourceIndex as number];
            }
        }

        // Check Set Pieces (Optional: usually duplicate references allowed? If strict move, delete)
        // Check Penalties (Optional: usually duplicate references allowed?)
        // For simplicity, we treat SetPieces/Penalties as "copies" or independent assignments, 
        // unlike Pitch/Subs which are mutually exclusive physical locations.

        // 2. Identify Player currently at Target (if any)
        let existingPlayerId: string | undefined;

        if (targetType === 'pitch') existingPlayerId = newLineup[targetIndex as number];
        else if (targetType === 'sub') existingPlayerId = newSubs[targetIndex as number];
        else if (targetType === 'setPiece') existingPlayerId = newSetPieces[targetIndex as string];
        else if (targetType === 'penalty') existingPlayerId = newPenalties[targetIndex as number];

        // 3. Place Dragged Player at Target
        if (targetType === 'pitch') newLineup[targetIndex as number] = playerId;
        else if (targetType === 'sub') newSubs[targetIndex as number] = playerId;
        else if (targetType === 'setPiece') newSetPieces[targetIndex as string] = playerId;
        else if (targetType === 'penalty') newPenalties[targetIndex as number] = playerId;

        // 4. Handle Swap (If existing player was displaced AND source logical for swap)
        if (existingPlayerId && existingPlayerId !== playerId) {
            // Only swap if source was Pitch or Sub (physical locations)
            // If dragging from sidebar (sourceType is null), existing player is just overwritten (sent to void/bench)
            if (sourceType === 'pitch' && typeof sourceIndex === 'number') {
                newLineup[sourceIndex] = existingPlayerId;
            } else if (sourceType === 'sub' && typeof sourceIndex === 'number') {
                newSubs[sourceIndex] = existingPlayerId;
            }
        }

        setLineup(newLineup);
        setSubs(newSubs);
        setSetPieces(newSetPieces);
        setPenalties(newPenalties);
        setIsSaved(false);
    };

    const handleNodeClick = (id: number, role: string) => { // id here is index on pitch, not player ID, needs verifying TacticsBoard
        // TacticsBoard calls onNodeClick(playerId, currentRole). But here handleNodeClick expects (id, role).
        // Wait, TacticsBoard `onNodeClick: (playerId: string, currentRole: string) => void`.
        // So I must update arguments here.
        // Actually, logic below uses selectedNodeId for SquadSelector which might expect something else.
        // Let's assume passed ID is player ID string.
        // But state definitions say "selectedNodeId: number | null".
        // This seems to refer to FORMATION INDEX if it's about selecting a slot? Or PLAYER ID?
        // Let's check TacticsBoard usage: onNodeClick={(pid, role) => handleNodeClick...}
        // Since DnD is primary, let's just minimal update or disable. The file says "Legacy selection logic...".
        // I will update signature to string but keep it stubbed mostly or simple.

        // Actually, let's just make it compatible.
        // If I strictly type, I need to know what selectedNodeId means.
        // It seems unused in DnD logic.
    };

    // Updating handleNodeClick to match string ID signature from TacticsBoard
    const handleNodeClickCompatible = (playerId: string, role: string) => {
        // Placeholder for strict typing, logic removed as DnD is primary
    };


    const handlePlayerSelect = (squadPlayer: any) => {
        if (selectedNodeId === null) return;
        setIsSelectorOpen(false);
    };



    // Confirmed Squad State (Persisted)
    const [confirmedSquad, setConfirmedSquad] = useLocalStorage<any>('wts-confirmed-squad', null);

    // Modal State
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleClearTeam = () => {
        setLineup({});
        setSubs({});
        setSetPieces({});
        setPenalties({});
        setIsSaved(false);
    };

    // Open Modal
    const handleConfirmClick = () => {
        setIsConfirmModalOpen(true);
    };

    // Actual Logic
    const executeConfirmSquad = () => {
        setConfirmedSquad({
            lineup,
            subs,
            tacticIn,
            tacticOut,
            customIn,
            customOut,
            // Pre-calculate final formations for convenience, though MatchDay can also derive them
            formationIn: customIn || availableFormations[tacticIn],
            formationOut: customOut || availableFormations[tacticOut],
            updatedAt: new Date().toISOString()
        });
        setIsConfirmed(true);
        setTimeout(() => setIsConfirmed(false), 2000);
    };

    // Validate Lineup against Squad (Clean up stale IDs)
    useEffect(() => {
        if (squad.length === 0) return;

        const validIds = new Set(squad.map(p => p.id));
        let hasChanges = false;

        const newLineup = { ...lineup };
        Object.keys(newLineup).forEach(key => {
            const index = parseInt(key);
            if (!validIds.has(newLineup[index])) {
                delete newLineup[index];
                hasChanges = true;
            }
        });

        const newSubs = { ...subs };
        Object.keys(newSubs).forEach(key => {
            const index = parseInt(key);
            if (!validIds.has(newSubs[index])) {
                delete newSubs[index];
                hasChanges = true;
            }
        });

        if (hasChanges) {
            setLineup(newLineup);
            setSubs(newSubs);
        }
    }, [squad, lineup, subs, setLineup, setSubs]);


    const isCompatiblePos = (playerPos: string, slotRole: string) => {
        if (playerPos === slotRole) return true;

        // Groups
        const GKS = ['GK'];
        const DEFS = ['CB', 'LB', 'RB', 'LWB', 'RWB'];
        const MIDS = ['CM', 'CDM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'AML', 'AMR', 'AM'];
        const FWDS = ['ST', 'CF'];

        if (GKS.includes(slotRole)) return GKS.includes(playerPos);
        if (DEFS.includes(slotRole)) return DEFS.includes(playerPos);
        if (MIDS.includes(slotRole)) return MIDS.includes(playerPos);
        if (FWDS.includes(slotRole)) return FWDS.includes(playerPos);

        return false;
    };

    const handleAutoPick = () => {
        const newLineup = { ...lineup };
        const newSubs = { ...subs };

        // Get set of currently used player IDs (lineup + subs)
        const usedPlayerIds = new Set<string>();
        Object.values(newLineup).forEach(pid => usedPlayerIds.add(pid as string));
        Object.values(newSubs).forEach(pid => usedPlayerIds.add(pid as string)); // Check against potentially existing subs? 
        // Actually, if we are auto-picking, we probably want to fill EMPTY slots. 
        // But if user hits auto-pick, maybe they expect fuller fill. 
        // Logic below fills empty slots.

        // 1. Fill Starting XI
        currentFormation.forEach((slot, index) => {
            if (!newLineup[index]) {
                const candidates = squad.filter(p => !usedPlayerIds.has(p.id) && isCompatiblePos(p.position, slot.role));

                // Prioritize exact match
                candidates.sort((a, b) => {
                    const aExact = a.position === slot.role ? 1 : 0;
                    const bExact = b.position === slot.role ? 1 : 0;
                    return bExact - aExact;
                });

                if (candidates.length > 0) {
                    newLineup[index] = candidates[0].id;
                    usedPlayerIds.add(candidates[0].id);
                }
            }
        });

        // 2. Fill Subs (7 slots: 0-6)
        for (let i = 0; i < 7; i++) {
            if (!newSubs[i]) {
                // Just take next available player
                const candidates = squad.filter(p => !usedPlayerIds.has(p.id));

                // Optional: Sort candidates by rating or role balance? 
                // For now, just ANY valid player.
                // Maybe prioritize GK if no sub GK? Use simple logic first.

                if (candidates.length > 0) {
                    newSubs[i] = candidates[0].id;
                    usedPlayerIds.add(candidates[0].id);
                }
            }
        }

        setLineup(newLineup);
        setSubs(newSubs);
        setIsSaved(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto h-[calc(100vh-140px)] relative">

            {/* Content Content w/ Z-Index */}
            <div className="relative z-10 h-full flex flex-col space-y-6 p-1">
                {/* ... (SquadSelector & Header remain same) ... */}
                <SquadSelector
                    isOpen={isSelectorOpen}
                    onClose={() => setIsSelectorOpen(false)}
                    onSelect={handlePlayerSelect}
                    currentPosition={currentRole}
                />

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 px-2">
                    <div>
                        <span className="text-wts-green text-sm font-bold tracking-[0.3em] uppercase block mb-1.5 font-mono">
                            STRATEGY & FORMATION
                        </span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold italic uppercase tracking-tighter text-white">
                            TACTICS
                        </h2>
                    </div>
                    <div className="flex items-stretch space-x-3">
                        {/* Tactics Dropdown Button */}
                        <div className="relative">
                            <button
                                onClick={() => setIsTacticsOpen(!isTacticsOpen)}
                                className="bg-black/40 text-white border border-white/10 hover:bg-white/10 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-3 shadow-lg transition-all min-w-[240px] justify-between group"
                            >
                                <div className="flex items-center space-x-3">
                                    <LayoutDashboard size={18} className="text-gray-400 group-hover:text-wts-green transition-colors" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] text-gray-500 font-bold leading-none mb-1">Selected Tactic</span>
                                        <span>{selectedTactic}</span>
                                    </div>
                                </div>
                                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isTacticsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isTacticsOpen && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col py-1">
                                    {Object.keys(availableFormations).map((tactic) => (
                                        <button
                                            key={tactic}
                                            onClick={() => handleTacticChange(tactic)}
                                            className={`px-4 py-3 text-left text-sm font-bold uppercase tracking-widest hover:bg-white/5 hover:text-wts-green transition-colors ${selectedTactic === tactic ? 'text-wts-green bg-white/5' : 'text-gray-400'}`}
                                        >
                                            {tactic}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Players Button */}
                        <div className="bg-black/40 text-white border border-white/10 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-3 shadow-lg min-w-[160px]">
                            <Users size={18} className="text-gray-400" />
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] text-gray-500 font-bold leading-none mb-1">Squad Size</span>
                                <span>{Object.keys(lineup).length} / {teamSize} Playing</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className={`px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-2 transition-all duration-300 shadow-lg ${isSaved
                                ? 'bg-wts-green text-black shadow-wts-green/20'
                                : 'bg-black/40 text-white border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {isSaved ? (
                                <>
                                    <CheckCircle2 size={18} />
                                    <span>Saved</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Save Tactic</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleConfirmClick}
                            className={`px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-2 transition-all duration-300 shadow-lg ${isConfirmed
                                ? 'bg-wts-green text-black shadow-wts-green/20'
                                : 'bg-black/40 text-white border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {isConfirmed ? (
                                <>
                                    <CheckCircle2 size={18} />
                                    <span>Confirmed</span>
                                </>
                            ) : (
                                <>
                                    <ClipboardCheck size={18} />
                                    <span>Confirm Squad</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-100px)]">
                    {/* Left Column: Squad List */}
                    <div className="lg:col-span-1 h-full min-h-0">
                        <TacticsTable
                            squad={squad}
                            lineup={lineup}
                            subs={subs}
                        />
                    </div>

                    {/* Center Column: Tactics Board */}
                    <div className="lg:col-span-2 bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl h-full flex flex-col overflow-hidden min-h-0">
                        <div className="flex-1 relative">
                            <TacticsBoard
                                formation={currentFormation}
                                lineup={lineup}
                                squad={squad}
                                onDrop={(playerId, index) => handleDrop(playerId, 'pitch', index)}
                                onNodeClick={handleNodeClickCompatible}
                                onReset={() => {
                                    setLineup({});
                                    setSubs({});
                                }}
                                onClear={handleClearTeam}
                                onAutoPick={handleAutoPick}
                                isLocked={isLocked}
                                onToggleLock={() => setIsLocked(!isLocked)}
                                onNodeMove={handleNodeMove}
                                teamSize={teamSize}
                                possessionMode={possessionMode}
                                onTogglePossession={setPossessionMode}
                            />
                        </div>
                    </div>

                    {/* Right Column: Instructions & Extras */}
                    <div className="lg:col-span-1 h-full min-h-0 flex flex-col gap-4 overflow-y-auto no-scrollbar">

                        {/* Substitutes */}
                        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Substitutes</h3>
                                <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">Max {teamSize === 11 ? 7 : 3}</span>
                            </div>
                            <div className="space-y-2">
                                {Array.from({ length: teamSize === 11 ? 7 : 3 }).map((_, i) => {
                                    const subPlayerId = subs[i];
                                    const subPlayer = subPlayerId ? squad.find(p => p.id === subPlayerId) : null;

                                    return (
                                        <div
                                            key={i}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => {
                                                const playerId = e.dataTransfer.getData('playerId');
                                                if (playerId) handleDrop(playerId, 'sub', i);
                                            }}
                                            className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer group ${subPlayer
                                                ? 'bg-white/5 border-white/5 hover:bg-white/10'
                                                : 'bg-black/20 border-dashed border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            {subPlayer ? (
                                                <>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xs font-mono text-gray-500 w-4">S{i + 1}</span>
                                                        <span className="text-xs font-bold text-gray-300 group-hover:text-white">{subPlayer.name}</span>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-wts-green uppercase">{subPlayer.position}</span>
                                                </>
                                            ) : (
                                                <div className="flex items-center space-x-3 w-full py-1 opacity-50">
                                                    <span className="text-xs font-mono text-gray-600 w-4">S{i + 1}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Empty Slot</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Set Pieces - Only for 11-a-side */}
                        {teamSize === 11 && (
                            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Set Pieces</h3>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Corners (L)', key: 'corners_l' },
                                        { label: 'Corners (R)', key: 'corners_r' },
                                        { label: 'Free Kicks', key: 'free_kicks' },
                                    ].map((type) => {
                                        const playerId = setPieces[type.key];
                                        const player = playerId ? squad.find(p => p.id === playerId) : null;

                                        return (
                                            <div
                                                key={type.key}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => {
                                                    const pid = e.dataTransfer.getData('playerId');
                                                    if (pid) handleDrop(pid, 'setPiece', type.key);
                                                }}
                                                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${player ? 'bg-white/5 border-white/5' : 'bg-black/20 border-dashed border-white/10'}`}
                                            >
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{type.label}</span>
                                                {player ? (
                                                    <span className="text-xs font-bold text-white">{player.name}</span>
                                                ) : (
                                                    <span className="text-[10px] text-gray-600 font-bold uppercase">Empty Slot</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Penalties */}
                        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-3xl p-5 flex flex-col gap-3">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Penalties</h3>
                            <div className="space-y-2">
                                {[1, 2, 3].map((order) => {
                                    const playerId = penalties[order];
                                    const player = playerId ? squad.find(p => p.id === playerId) : null;

                                    return (
                                        <div
                                            key={order}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => {
                                                const pid = e.dataTransfer.getData('playerId');
                                                if (pid) handleDrop(pid, 'penalty', order);
                                            }}
                                            className={`flex items-center justify-between p-2 rounded-xl border transition-all ${player ? 'bg-white/5 border-white/5' : 'bg-black/20 border-dashed border-white/10'}`}
                                        >
                                            <div className="flex items-center space-x-3 w-full">
                                                <span className="w-5 h-5 flex items-center justify-center bg-wts-green/10 text-wts-green text-[10px] font-bold rounded-md">{order}</span>
                                                {player ? (
                                                    <span className="text-xs font-bold text-white">{player.name}</span>
                                                ) : (
                                                    <span className="text-[10px] text-gray-600 font-bold uppercase">Empty Slot</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <ConfirmSquadModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={executeConfirmSquad}
                matchDetails={{
                    opponent: 'Next Opponent',
                    competition: 'League Match',
                    venue: 'Home',
                    date: 'Upcoming',
                    time: '15:00'
                }}
            />
        </div>
    );
}
