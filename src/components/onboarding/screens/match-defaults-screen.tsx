'use client';

import { OnboardingData } from '@/hooks/use-onboarding';
import { useLanguage } from '@/hooks/use-language';
import { PoundSterling, Clock, MapPin, Trophy } from 'lucide-react';
import { LeagueAutocomplete } from '@/components/ui/league-autocomplete';

interface MatchDefaultsScreenProps {
    data: OnboardingData;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
}

export function MatchDefaultsScreen({ data, onUpdate, onNext }: MatchDefaultsScreenProps) {
    const { t } = useLanguage();

    return (
        <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-display font-bold italic uppercase tracking-tighter text-white mb-2">
                    {t('onboarding.match_defaults_title')}
                </h2>
                <p className="text-gray-500 text-sm">{t('onboarding.match_defaults_subtitle')}</p>
            </div>

            <div className="space-y-6 mb-10">
                {/* League Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Trophy size={12} /> {t('onboarding.league_label')}
                    </label>
                    <LeagueAutocomplete
                        value={data.league}
                        onChange={(val) => onUpdate({ league: val })}
                        placeholder="e.g. Premier League"
                        className="w-full bg-black/50 border border-white/10 focus:border-wts-green rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors font-bold uppercase tracking-wide"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <PoundSterling size={12} /> {t('onboarding.default_fee_label')}
                    </label>
                    <input
                        type="number"
                        value={data.defaultFee}
                        onChange={(e) => onUpdate({ defaultFee: parseFloat(e.target.value) })}
                        className="w-full bg-black/50 border border-white/10 focus:border-wts-green rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors font-bold font-mono tracking-wide"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={12} /> {t('onboarding.kickoff_label')}
                    </label>
                    <input
                        type="time"
                        value={data.kickoffTime}
                        onChange={(e) => onUpdate({ kickoffTime: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 focus:border-wts-green rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors font-bold font-mono tracking-wide"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={12} /> {t('onboarding.venue_label')}
                    </label>
                    <input
                        type="text"
                        value={data.venue}
                        onChange={(e) => onUpdate({ venue: e.target.value })}
                        placeholder="e.g. Powerleague Shoreditch"
                        className="w-full bg-black/50 border border-white/10 focus:border-wts-green rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors font-bold uppercase tracking-wide"
                    />
                </div>
            </div>

            <button
                onClick={onNext}
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl transition-all"
            >
                {t('onboarding.continue_btn')}
            </button>
        </div>
    );
}
