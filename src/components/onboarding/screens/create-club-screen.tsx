'use client';

import { OnboardingData } from '@/hooks/use-onboarding';
import { CityAutocomplete } from '@/components/ui/city-autocomplete';

interface CreateClubScreenProps {
    data: OnboardingData;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
}

export function CreateClubScreen({ data, onUpdate, onNext }: CreateClubScreenProps) {
    const teamSizes = [5, 6, 7, 11];
    const canContinue = data.clubName.length > 2 && data.location.length > 0;

    return (
        <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-display font-bold italic uppercase tracking-tighter text-white mb-2">
                    Create Your Club
                </h2>
                <p className="text-gray-500 text-sm">Vital details for your dashboard.</p>
            </div>

            <div className="space-y-6 mb-10">
                {/* Club Name */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Club Name</label>
                    <input
                        type="text"
                        value={data.clubName}
                        onChange={(e) => onUpdate({ clubName: e.target.value })}
                        placeholder="e.g. AFC Work The Space"
                        className="w-full bg-black/50 border border-white/10 focus:border-wts-green rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors font-bold uppercase tracking-wide"
                        autoFocus
                    />
                </div>

                {/* Team Format */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Team Format</label>
                    <div className="grid grid-cols-4 gap-2">
                        {teamSizes.map(size => (
                            <button
                                key={size}
                                onClick={() => onUpdate({ teamSize: size as any })}
                                className={`py-3 rounded-lg border font-bold font-mono transition-all ${data.teamSize === size
                                    ? 'bg-wts-green text-black border-wts-green'
                                    : 'bg-black/30 text-gray-400 border-white/10 hover:border-white/30'
                                    }`}
                            >
                                {size}-a-side
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location (Renamed from Home Area) with Autocomplete */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
                    <CityAutocomplete
                        value={data.location}
                        onChange={(val) => onUpdate({ location: val })}
                        placeholder="e.g. London, United Kingdom"
                        className="w-full bg-black/50 border border-white/10 focus:border-wts-green rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors font-bold uppercase tracking-wide"
                    />
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={!canContinue}
                className="w-full py-4 bg-wts-green disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
            >
                Create Club
            </button>
        </div>
    );
}
