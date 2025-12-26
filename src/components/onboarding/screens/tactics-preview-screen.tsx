'use client';

import { useState } from 'react';
import { OnboardingData } from '@/hooks/use-onboarding';
import { useLanguage } from '@/hooks/use-language';
import { TacticsBoard } from '@/components/dashboard/tactics-board';
import { Lock, Users, Trophy } from 'lucide-react';
import { DEMO_TACTICS } from '@/data/demo-tactics';

interface TacticsPreviewScreenProps {
    data: OnboardingData;
    onNext: () => void;
}

export function TacticsPreviewScreen({ data, onNext }: TacticsPreviewScreenProps) {
    const { t } = useLanguage();
    const [possessionMode, setPossessionMode] = useState<'in' | 'out'>('in');

    // Mock squad for preview
    const mockSquad = data.players.length > 0 ? data.players.map((p, i) => ({
        id: `p-${i}`,
        name: p.name,
        number: i + 1,
        position: 'MID',
        role: 'MID'
    } as any)) : Array(data.teamSize).fill(0).map((_, i) => ({
        id: `p-${i}`,
        name: `Player ${i + 1}`,
        number: i + 1,
        position: 'MID',
        role: 'MID'
    } as any));

    const dummyLineup = mockSquad.slice(0, data.teamSize).reduce((acc: any, p: any, idx) => {
        acc[idx] = p.id;
        return acc;
    }, {});

    // Get demo formation based on size and possession mode
    // Fallback to 5-a-side if size not found (though existing sizes are 5,6,7,11)
    const demoSet = DEMO_TACTICS[data.teamSize as keyof typeof DEMO_TACTICS] || DEMO_TACTICS[5];
    const currentFormation = demoSet[possessionMode];

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-center animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex-1 space-y-8 order-2 md:order-1">
                <div>
                    <h2 className="text-3xl font-display font-bold italic uppercase tracking-tighter text-white mb-4">
                        {t('onboarding.tactics_title')}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {t('onboarding.tactics_desc')}
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Lock size={14} /></div>
                            <span>Lock formation shape</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Users size={14} /></div>
                            <span>Auto-pick from available squad</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10"><Trophy size={14} /></div>
                            <span>Share visualized lineups</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onNext}
                    className="w-full md:w-auto px-8 py-4 bg-wts-green text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                >
                    {t('onboarding.save_continue_btn')}
                </button>
            </div>

            {/* Visual Board */}
            <div className="flex-1 w-full order-1 md:order-2 h-[400px] md:h-[500px] bg-black/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                <TacticsBoard
                    squad={mockSquad}
                    lineup={dummyLineup}
                    teamSize={data.teamSize}
                    formation={currentFormation as any}
                    readonly={true} // It's a preview, but we are demoing movement via the toggle
                    isLocked={true}
                    onDrop={() => { }}
                    onNodeClick={() => { }}
                    onNodeMove={() => { }}
                    possessionMode={possessionMode}
                    onTogglePossession={setPossessionMode}
                    onToggleLock={() => { }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
