'use client';

import { useState, useEffect, useRef } from 'react';
import { Tv, Calendar, MapPin, ChevronRight, Share2, Info, Bell, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getFormationsForSize } from '@/lib/formations';
import { useLocalStorage } from '@/hooks/use-local-storage';

import { api } from '@/services/api';
import { Player } from '@/types/schema';
import { MatchdayGraphic } from '@/components/dashboard/matchday-graphic';
import { SharePreviewModal } from '@/components/dashboard/share-preview-modal';
import { TacticsBoard } from '@/components/dashboard/tactics-board';
import html2canvas from 'html2canvas';

const MATCH_DATA = {
    opponent: 'Tech United',
    competition: 'Premier Division',
    venue: 'The Code Arena',
    date: 'Tuesday 24 Oct',
    time: '19:45',
    weather: 'Rainy, 12°C',
    kit: 'Home (Green)',
    referee: 'M. Dean'
};

export default function MatchdayPage() {
    const [hasMatch, setHasMatch] = useState(true);
    const [squad, setSquad] = useState<Player[]>([]);

    // UI State for toggle
    const [possessionMode, setPossessionMode] = useState<'in' | 'out'>('in');

    // Confirmed Data Source
    const [confirmedSquad] = useLocalStorage<any>('wts-confirmed-squad', null);
    const [teamSizeStr] = useLocalStorage<string>('wts-team-size', '11');
    const teamSize = parseInt(teamSizeStr, 10);

    // Derived Data from Confirmed Squad
    // If no confirmed squad, default to empty
    const lineup = confirmedSquad?.lineup || {};
    const subsMap = confirmedSquad?.subs || {};

    // Determine active formation based on mode
    // formationIn/Out were pre-calculated in TacticsPage, but we can also re-derive if needed.
    // Let's use the pre-calculated ones if available, otherwise fallback.
    const currentFormation = possessionMode === 'in'
        ? (confirmedSquad?.formationIn || confirmedSquad?.formation) // Fallback to legacy single formation if old save
        : (confirmedSquad?.formationOut || confirmedSquad?.formation);

    // Sharing State
    const [isSharing, setIsSharing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const graphicRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await api.getSquad('team-wts');
            setSquad(data);
        };
        loadData();
    }, []);

    // Derived Lists
    const isSquadSizeMismatch = Object.keys(lineup).length > teamSize;

    const startingXI = (!isSquadSizeMismatch)
        ? Object.entries(lineup).map(([index, playerId]) => {
            const player = squad.find(p => p.id === playerId);
            return player ? { ...player, index: parseInt(index) } : null;
        }).filter(Boolean)
        : [];

    const subs = (!isSquadSizeMismatch)
        ? Object.values(subsMap).map(playerId => {
            // subsMap values are strings (playerIds)
            return squad.find(p => p.id === playerId as string)
        }).filter(Boolean)
        : [];

    const formationCoords = (!isSquadSizeMismatch && currentFormation) ? currentFormation : [];
    const lineupMap = (!isSquadSizeMismatch) ? lineup : {};

    // 1. Generate Image and Open Preview
    const handleGeneratePreview = async () => {
        if (!graphicRef.current) return;
        setIsSharing(true);

        try {
            const canvas = await html2canvas(graphicRef.current, {
                useCORS: true,
                scale: 1,
                width: 1920,
                height: 1080,
                backgroundColor: '#111'
            } as any);

            const dataUrl = canvas.toDataURL('image/png');
            setPreviewUrl(dataUrl);
            setIsPreviewOpen(true);

        } catch (err) {
            console.error('Generation failed:', err);
            alert('Failed to generate preview.');
        } finally {
            setIsSharing(false);
        }
    };

    // 2. Actual Share (triggered from Modal)
    const handleConfirmShare = async () => {
        if (!previewUrl) return;

        try {
            const blob = await (await fetch(previewUrl)).blob();
            const file = new File([blob], `lineup-${MATCH_DATA.opponent}.png`, { type: 'image/png' });

            if (navigator.share) {
                await navigator.share({
                    title: 'Match Day Squad',
                    text: `Here is our starting XI vs ${MATCH_DATA.opponent}! #PitchEngine`,
                    files: [file]
                });
            } else {
                alert('Sharing not supported on this device. Downloading instead.');
                handleDownload();
            }
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    // 3. Download (triggered from Modal)
    const handleDownload = () => {
        if (!previewUrl) return;
        const link = document.createElement('a');
        link.download = `lineup-${MATCH_DATA.opponent}.png`;
        link.href = previewUrl;
        link.click();
    };


    return (
        <div className="space-y-6 max-w-[1400px] mx-auto min-h-[calc(100vh-140px)] relative">

            {/* Hidden Graphic Generator -- Uses current state */}
            <MatchdayGraphic
                ref={graphicRef}
                startingXI={startingXI}
                subs={subs}
                formationCoords={formationCoords}
                matchDetails={MATCH_DATA}
                teamName="PITCH ENGINE"
            />

            {/* Preview Modal */}
            <SharePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                imageUrl={previewUrl}
                onShare={handleConfirmShare}
                onDownload={handleDownload}
            />

            {/* Dev Toggle */}
            <div className="absolute top-0 right-0 z-50">
                <button
                    onClick={() => setHasMatch(!hasMatch)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-mono text-gray-400 uppercase border border-white/5"
                >
                    Toggle: {hasMatch ? 'Squad Announced' : 'No Game'}
                </button>
            </div>

            {!hasMatch ? (
                // NO GAME STATE
                <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="p-8 bg-black/40 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl">
                        <Tv size={64} className="text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-display font-bold italic text-white uppercase tracking-tighter mb-3">
                            NO UPCOMING MATCH
                        </h2>
                        <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                            There are no fixtures scheduled for the next 48 hours. Enjoy the rest day, gaffer.
                        </p>
                    </div>
                    <div className="pt-4">
                        <button className="px-8 py-4 bg-wts-green/10 hover:bg-wts-green/20 border border-wts-green/20 rounded-xl text-xs font-bold uppercase tracking-widest text-wts-green transition-all flex items-center space-x-2">
                            <span>View Fixture List</span>
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            ) : (
                // MATCHDAY DASHBOARD STATE
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

                    {/* Header / Hero */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                        <div>
                            <span className="text-wts-green text-sm font-bold tracking-[0.3em] uppercase block mb-1.5 font-mono flex items-center gap-3">
                                <span>NEXT FIXTURE</span>
                                <span className="w-1 h-1 rounded-full bg-wts-green/50"></span>
                                <span>{MATCH_DATA.date}</span>
                            </span>
                            <div className="flex flex-col">
                                <h1 className="text-4xl md:text-5xl font-display font-bold italic text-white uppercase tracking-tighter leading-none mb-2">
                                    MATCH DAY LIVE
                                </h1>
                                <div className="flex items-center space-x-5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center space-x-2">
                                        <MapPin size={14} className="text-wts-green" />
                                        <span>{MATCH_DATA.venue}</span>
                                    </span>
                                    <span className="flex items-center space-x-2">
                                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                                        <span>VS {MATCH_DATA.opponent}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleGeneratePreview}
                                disabled={isSharing}
                                className="bg-black/40 text-white border border-white/10 hover:bg-white/10 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-3 shadow-lg transition-all disabled:opacity-50"
                            >
                                {isSharing ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
                                <span className="hidden sm:inline">{isSharing ? 'Generating...' : 'Share'}</span>
                            </button>

                            <button className="bg-black/40 text-white border border-white/10 hover:bg-white/10 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-3 shadow-lg transition-all">
                                <Bell size={18} />
                                <span className="hidden sm:inline">Notify</span>
                            </button>

                            <button className="bg-wts-green text-black px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center space-x-3 shadow-lg shadow-wts-green/10 hover:bg-white transition-all">
                                <Tv size={18} />
                                <span>Match Centre</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Squad List (4 cols) */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Starting XI List */}
                            <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="text-xl font-display font-bold italic text-white uppercase tracking-tighter">Starting XI</h3>
                                    <span className="text-xs font-bold text-wts-green uppercase tracking-widest">Confirmed {teamSize}</span>
                                </div>
                                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                                    {startingXI.map((player: any) => (
                                        <div key={player.id} className="flex items-center p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                            <div className="w-8 font-mono text-sm text-gray-500 font-bold group-hover:text-wts-green transition-colors">{player.number || 0}</div>
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-white uppercase tracking-wide">{player.name}</span>
                                            </div>
                                            <div className="text-xs font-bold text-gray-500 uppercase">{player.position}</div>
                                        </div>
                                    ))}
                                    {startingXI.length === 0 && (
                                        <div className="p-8 text-center text-gray-500 text-xs uppercase tracking-widest">
                                            {confirmedSquad ? "No starting XI confirmed" : "Draft not yet confirmed"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Subs List */}
                            <div>
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h3 className="text-xl font-display font-bold italic text-white uppercase tracking-tighter">Substitutes</h3>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{subs.length} Selected (Max {teamSize === 11 ? 7 : 3})</span>
                                </div>
                                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">
                                    {subs.map((player: any) => (
                                        <div key={player.id} className="flex items-center p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                                            <div className="w-8 font-mono text-sm text-gray-500 font-bold group-hover:text-wts-green transition-colors">{player.number}</div>
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-white uppercase tracking-wide">{player.name}</span>
                                            </div>
                                            <div className="text-xs font-bold text-gray-500 uppercase">{player.position}</div>
                                        </div>
                                    ))}
                                    {subs.length === 0 && (
                                        <div className="p-8 text-center text-gray-500 text-xs uppercase tracking-widest">
                                            No substitutes confirmed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Pitch Visual (8 cols) - Uses Shared TacticsBoard now for Consistency */}
                        <div className="lg:col-span-8">
                            <div className="relative h-full bg-[#0A120A] rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm min-h-[600px] flex flex-col p-4">
                                <TacticsBoard
                                    formation={formationCoords}
                                    lineup={lineupMap}
                                    squad={squad}
                                    teamSize={teamSize}
                                    readonly={false} // Allow interactions? User asked for read-only before. But now they want toggle. 
                                    // Actually, keep safe interactions but locked.
                                    // TacticsBoard logic: if locked, you can't move nodes. 
                                    // Let's keep it mostly read-only visual but enable the toggle via props.
                                    // Passing 'readonly={true}' disables DnD and interactions. 
                                    // Does readonly disable the toggle? 
                                    // Check TacticsBoard: 'onTogglePossession' is rendered in Header which is rendered even if readonly?
                                    // View file shows: Header is rendered. 
                                    // But handleDragOver returns if readonly.
                                    // So readonly is safe.
                                    readonly={true}
                                    onDrop={() => { }}
                                    onNodeClick={() => { }}
                                    onReset={() => { }}
                                    onClear={() => { }}
                                    onAutoPick={() => { }}
                                    isLocked={true}
                                    onToggleLock={() => { }}
                                    onNodeMove={() => { }}
                                    possessionMode={possessionMode}
                                    onTogglePossession={setPossessionMode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
