'use client';

import React, { useState, useRef } from 'react';
import { MousePointer2, Settings2, RotateCcw, Trash2, Wand2, Lock, Unlock } from 'lucide-react';
import { getPlayerDisplayNames } from '@/lib/utils';
import { setDragGhost } from '@/lib/drag-utils';
import Image from 'next/image';
import { Player } from '@/types/schema';

interface TacticsBoardProps {
    formation: { x: number; y: number; role: string }[];
    lineup: Record<number, string>; // Maps formation index to player ID
    squad: Player[];
    onDrop: (playerId: string, index: number) => void;
    onNodeClick: (playerId: string, currentRole: string) => void;
    onReset?: () => void;
    onClear?: () => void;
    onAutoPick?: () => void;
    isLocked: boolean;
    onToggleLock: () => void;
    onNodeMove: (index: number, x: number, y: number) => void;
    readonly?: boolean;
    teamSize?: number;
    possessionMode?: 'in' | 'out';
    onTogglePossession?: (mode: 'in' | 'out') => void;
}

export function TacticsBoard({
    formation,
    lineup,
    squad,
    onDrop,
    onNodeClick,
    onReset,
    onClear,
    onAutoPick,
    isLocked,
    onToggleLock,
    onNodeMove,
    readonly,
    teamSize = 11,
    possessionMode = 'in',
    onTogglePossession
}: TacticsBoardProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const displayNames = React.useMemo(() => getPlayerDisplayNames(squad), [squad]);

    const handleDragOver = (e: React.DragEvent) => {
        if (readonly) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        if (readonly) return;
        e.preventDefault();
        const playerId = e.dataTransfer.getData('playerId');
        if (playerId) {
            onDrop(playerId, index);
        }
    };

    // Local drag state for smooth updates without parent re-renders
    const [dragState, setDragState] = useState<{ index: number; x: number; y: number } | null>(null);

    const handlePointerDown = (e: React.PointerEvent, index: number) => {
        if (isLocked || readonly) return;
        e.preventDefault();
        e.stopPropagation();

        // Capture pointer to track outside div
        (e.target as Element).setPointerCapture(e.pointerId);

        // Initialize drag state with current pos or just index
        // We will update x/y in move
        setDragState({ index, x: formation[index].x, y: formation[index].y });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragState || !containerRef.current) return;
        e.preventDefault();
        e.stopPropagation();

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Clamp
        const clampedX = Math.max(0, Math.min(100, x));
        const clampedY = Math.max(0, Math.min(100, y));

        setDragState({ ...dragState, x: clampedX, y: clampedY });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!dragState) return;
        e.preventDefault();
        e.stopPropagation();

        // Commit final position
        onNodeMove(dragState.index, dragState.x, dragState.y);
        setDragState(null);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    // RENDER LOGIC FOR PITCH
    const renderPitchMarkings = () => {
        if (teamSize === 11) {
            return (
                <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none stroke-white/20 fill-none" viewBox="0 0 68 105" preserveAspectRatio="none">
                    {/* Pitch Boundary */}
                    <rect x="2" y="2" width="64" height="101" rx="2" strokeWidth="0.5" />

                    {/* Halfway Line & Circle */}
                    <line x1="2" y1="52.5" x2="66" y2="52.5" strokeWidth="0.5" />
                    <circle cx="34" cy="52.5" r="9.15" strokeWidth="0.5" />
                    <circle cx="34" cy="52.5" r="0.5" fill="currentColor" />

                    {/* Penalty Areas (Top) */}
                    <rect x="13.8" y="2" width="40.4" height="16.5" strokeWidth="0.5" />
                    <rect x="24.8" y="2" width="18.4" height="5.5" strokeWidth="0.5" />
                    <path d="M27.5,18.5 Q34,25 40.5,18.5" strokeWidth="0.5" />
                    <circle cx="34" cy="11" r="0.5" fill="currentColor" />

                    {/* Penalty Areas (Bottom) */}
                    <rect x="13.8" y="86.5" width="40.4" height="16.5" strokeWidth="0.5" />
                    <rect x="24.8" y="97.5" width="18.4" height="5.5" strokeWidth="0.5" />
                    <path d="M27.5,86.5 Q34,80 40.5,86.5" strokeWidth="0.5" />
                    <circle cx="34" cy="94" r="0.5" fill="currentColor" />

                    {/* Corner Arcs */}
                    <path d="M2,3 Q3,3 3,2" strokeWidth="0.5" />
                    <path d="M66,3 Q65,3 65,2" strokeWidth="0.5" />
                    <path d="M66,102 Q65,102 65,103" strokeWidth="0.5" />
                </svg>
            );
        } else {
            // Small Sided (5/6/7) - Simpler semi-circle style areas
            return (
                <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none stroke-white/20 fill-none" viewBox="0 0 68 105" preserveAspectRatio="none">
                    {/* Pitch Boundary */}
                    <rect x="2" y="2" width="64" height="101" rx="2" strokeWidth="0.5" />

                    {/* Halfway Line & Circle */}
                    <line x1="2" y1="52.5" x2="66" y2="52.5" strokeWidth="0.5" />
                    <circle cx="34" cy="52.5" r="6" strokeWidth="0.5" />
                    <circle cx="34" cy="52.5" r="0.5" fill="currentColor" />

                    {/* Penalty Areas (Top) - Box Style for general purpose */}
                    <rect x="14" y="2" width="40" height="20" rx="4" strokeWidth="0.5" />
                    <circle cx="34" cy="12" r="0.5" fill="currentColor" />

                    {/* Penalty Areas (Bottom) */}
                    <rect x="14" y="83" width="40" height="20" rx="4" strokeWidth="0.5" />
                    <circle cx="34" cy="93" r="0.5" fill="currentColor" />

                    {/* Corner Arcs */}
                    <path d="M2,6 Q6,6 6,2" strokeWidth="0.5" />
                    <path d="M62,2 Q62,6 66,6" strokeWidth="0.5" />
                    <path d="M2,99 Q6,99 6,103" strokeWidth="0.5" />
                    <path d="M62,103 Q62,99 66,99" strokeWidth="0.5" />
                </svg>
            );
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header / Controls */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2 bg-black/40 rounded-lg p-1 border border-white/10">
                    <button
                        onClick={() => onTogglePossession?.('in')}
                        className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${possessionMode === 'in'
                            ? 'bg-wts-green text-black shadow-lg'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        In Possession
                    </button>
                    <button
                        onClick={() => onTogglePossession?.('out')}
                        className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${possessionMode === 'out'
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Out of Poss
                    </button>
                </div>
                {!readonly && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onAutoPick}
                            className="p-2.5 hover:bg-white/5 rounded-lg text-wts-green hover:text-wts-green/80 transition-all flex items-center space-x-2"
                        >
                            <Wand2 size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">Auto Pick</span>
                        </button>
                        <button
                            onClick={onClear}
                            className="p-2.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all flex items-center space-x-2"
                        >
                            <Trash2 size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Clear Team</span>
                        </button>
                    </div>
                )}
            </div>

            {/* The Pitch Container */}
            <div className="flex-1 flex items-center justify-center min-h-0 relative">
                <div
                    ref={containerRef}
                    className="relative h-full aspect-[68/105] bg-[#0A120A] rounded-2xl border border-white/5 overflow-hidden shadow-2xl touch-none select-none group/pitch"
                >
                    {/* Global Pitch Texture */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:32px_32px]" />

                    {/* SVG Pitch Markings */}
                    {renderPitchMarkings()}

                    {/* Padlock Control */}
                    {!readonly && (
                        <div className="absolute bottom-4 right-2 z-40">
                            <button
                                onClick={onToggleLock}
                                className={`p-2 rounded-full shadow-lg transition-all ${isLocked ? 'bg-black/80 text-gray-400 hover:text-white' : 'bg-wts-green text-black hover:bg-white'}`}
                            >
                                {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                            </button>
                        </div>
                    )}

                    {/* Formation Nodes */}
                    {/* Formation Nodes */}
                    {formation && formation.map((pos, index) => {
                        const playerId = lineup[index];
                        const player = playerId ? squad.find(p => p.id === playerId) : null;

                        // Use local drag state if this node is being dragged
                        const isDragging = dragState?.index === index;
                        const x = isDragging ? dragState.x : pos.x;
                        const y = isDragging ? dragState.y : pos.y;

                        return (
                            <FormationNode
                                key={index}
                                index={index}
                                pos={pos}
                                player={player}
                                lineup={lineup}
                                squad={squad}
                                isLocked={isLocked}
                                dragState={dragState}
                                handlePointerDown={handlePointerDown}
                                handlePointerMove={handlePointerMove}
                                handlePointerUp={handlePointerUp}
                                onDrop={onDrop}
                                displayNames={displayNames}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function FormationNode({
    index,
    pos,
    player,
    lineup,
    squad,
    isLocked,
    dragState,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    onDrop,
    displayNames
}: {
    index: number;
    pos: { x: number; y: number; role: string };
    player: Player | null | undefined;
    lineup: Record<number, string>;
    squad: Player[];
    isLocked: boolean;
    dragState: { index: number; x: number; y: number } | null;
    handlePointerDown: (e: React.PointerEvent, index: number) => void;
    handlePointerMove: (e: React.PointerEvent) => void;
    handlePointerUp: (e: React.PointerEvent) => void;
    onDrop: (playerId: string, index: number) => void;
    displayNames: Record<string, string>;
}) {
    const [isOver, setIsOver] = useState(false);

    // Use local drag state if this node is being dragged
    const isDragging = dragState?.index === index;
    const x = isDragging ? dragState.x : pos.x;
    const y = isDragging ? dragState.y : pos.y;

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOver(false);
        const playerId = e.dataTransfer.getData('playerId');
        if (playerId) {
            onDrop(playerId, index);
        }
    };

    return (
        <div
            className={`absolute w-16 h-16 -ml-8 -mt-8 flex items-center justify-center transition-all duration-300 z-20 group/node cursor-pointer 
                ${!isLocked ? 'cursor-move ring-2 ring-wts-green rounded-full bg-wts-green/10' : ''}
                ${isOver && isLocked ? 'bg-wts-green/20 ring-2 ring-wts-green scale-110' : ''}
            `}
            style={{
                left: `${x}%`,
                top: `${y}%`,
                transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            draggable={isLocked && !!player}
            onPointerDown={(e) => handlePointerDown(e, index)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onDragStart={(e) => {
                if (isLocked) {
                    if (player) {
                        e.dataTransfer.setData('playerId', player.id);
                        e.dataTransfer.setData('fromIndex', index.toString());
                        setDragGhost(e, player.number, player.position);
                        e.stopPropagation();
                    } else {
                        e.preventDefault();
                    }
                }
            }}
            onDragOver={isLocked ? handleDragOver : undefined}
            onDragLeave={isLocked ? handleDragLeave : undefined}
            onDrop={isLocked ? handleDrop : undefined}
        >
            <div className="relative w-10 h-10 flex items-center justify-center pointer-events-none">
                {player ? (
                    <>
                        <div className={`absolute inset-0 rounded-full blur-[8px] opacity-40 ${player.position === 'GK' ? 'bg-yellow-400' : 'bg-wts-green'}`} />
                        <div className={`relative w-9 h-9 rounded-full border-2 border-black flex items-center justify-center shadow-lg transition-transform ${player.position === 'GK' ? 'bg-yellow-400 text-black' : 'bg-wts-green text-black'}`}>
                            <span className="text-sm font-black">{player.number}</span>
                        </div>
                        <div className="absolute -bottom-8 whitespace-nowrap px-2 py-1 bg-black/90 backdrop-blur-xl rounded border border-white/10 shadow-2xl flex flex-col items-center z-[100] scale-90 transition-transform origin-top">
                            <div className="flex items-center space-x-1 mb-0.5">
                                {player.nationality && (
                                    <div className="relative w-3 h-2 rounded-[1px] overflow-hidden opacity-80">
                                        <Image
                                            src={`https://flagcdn.com/w20/${player.nationality}.png`}
                                            alt={player.nationality}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                )}
                                <span className="text-[10px] font-black text-white leading-none max-w-[80px] truncate">
                                    {displayNames[player.id]}
                                </span>
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">{pos.role}</span>
                        </div>
                    </>
                ) : (
                    <div className="relative w-8 h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-black hover:border-wts-green/50 hover:bg-wts-green/10 transition-colors shadow-sm pointer-events-auto">
                        <span className="text-[8px] font-bold text-gray-500 uppercase">{pos.role}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
