'use client';

import { OnboardingData } from '@/hooks/use-onboarding';
import { useLanguage } from '@/hooks/use-language';
import { User, ArrowRight } from 'lucide-react';
import { CountryAutocomplete } from '@/components/ui/country-autocomplete';

interface ManagerNameScreenProps {
    data: OnboardingData;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
}

export function ManagerNameScreen({ data, onUpdate, onNext }: ManagerNameScreenProps) {
    const { t } = useLanguage();
    const canContinue = data.playerName.length > 2;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && canContinue) {
            onNext();
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-display font-bold italic uppercase tracking-tighter text-white mb-2">
                    {t('onboarding.manager_name_title')}
                </h2>
                <p className="text-gray-500 text-sm">{t('onboarding.manager_name_subtitle')}</p>
            </div>

            <div className="space-y-6 mb-10">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('onboarding.manager_name_label')}</label>
                    <div className="relative group/input">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-wts-green transition-colors duration-200">
                            <User size={20} />
                        </div>
                        <input
                            type="text"
                            value={data.playerName}
                            onChange={(e) => onUpdate({ playerName: e.target.value })}
                            onKeyDown={handleKeyDown}
                            placeholder={t('onboarding.manager_name_placeholder')}
                            className="w-full bg-black/50 border border-white/10 focus:border-wts-green rounded-xl py-4 pl-14 pr-5 text-white placeholder-gray-700 outline-none transition-all duration-200 font-bold text-lg"
                            autoFocus
                        />
                    </div>
                </div>

                <CountryAutocomplete
                    label="Nationality"
                    value={data.playerNationality || 'gb-eng'}
                    onChange={(val) => onUpdate({ playerNationality: val })}
                    placeholder="Select nationality..."
                />
            </div>

            <button
                onClick={onNext}
                disabled={!canContinue}
                className="w-full py-4 bg-wts-green disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] flex items-center justify-center space-x-2 group"
            >
                <span>{t('onboarding.manager_name_continue_btn')}</span>
                {!(!canContinue) && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
        </div>
    );
}
