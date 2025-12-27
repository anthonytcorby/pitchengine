'use client';

import { useState } from 'react';
import { ArrowRight, ChevronLeft, Check, Trophy, Users, Calendar, Wallet, Plus, X, Lock, Play, Clock, MapPin, PoundSterling, Shirt, Search, Link as LinkIcon, Briefcase } from 'lucide-react';
import { OnboardingData, OnboardingRole } from '@/hooks/use-onboarding';
import { useLanguage } from '@/hooks/use-language';
import { formatName } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TacticsBoard } from '@/components/dashboard/tactics-board';
import { api } from '@/services/api';
import { CreateClubScreen } from './screens/create-club-screen';
import { ManagerNameScreen } from './screens/manager-name-screen';
import { MatchDefaultsScreen } from './screens/match-defaults-screen';
import { PaywallScreen } from './screens/paywall-screen';
import { LanguageSelectionScreen } from './screens/language-selection-screen';
import { TacticsPreviewScreen } from './screens/tactics-preview-screen';
import { CountryAutocomplete } from '@/components/ui/country-autocomplete';

interface OnboardingStepsProps {
    currentStep: number;
    role: OnboardingRole;
    data: OnboardingData;
    onSetRole: (role: OnboardingRole) => void;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
    onFinish: () => void;
    onSetStep: (step: number) => void;
}

export function OnboardingSteps({ currentStep, role, data, onSetRole, onUpdate, onNext, onBack, onFinish, onSetStep }: OnboardingStepsProps) {
    const { t } = useLanguage();

    // Animation Variants
    const pageVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    // --- SCREEN 0: LANGUAGE SELECTION ---
    // (Handled by component import)

    // --- SCREEN 1: ROLE SELECTION ---
    const ScreenRoleChoice = () => (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold italic uppercase tracking-tighter text-white mb-4">
                    {t('onboarding.role_title')}
                </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Manager Card */}
                <button
                    onClick={() => {
                        onSetRole('MANAGER');
                        onNext();
                    }}
                    className="group relative p-8 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-wts-green/50 rounded-2xl transition-all text-left flex flex-col h-[300px]"
                >
                    <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-wts-green/10 flex items-center justify-center border border-white/10 group-hover:border-wts-green mb-auto transition-colors">
                        <Briefcase size={28} className="text-gray-400 group-hover:text-wts-green transition-colors" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold italic uppercase tracking-tighter text-white mb-2 group-hover:text-wts-green transition-colors">
                            {t('onboarding.role_manager')}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t('onboarding.role_manager_desc')}
                        </p>
                    </div>
                </button>

                {/* Player Card */}
                <button
                    onClick={() => {
                        onSetRole('PLAYER');
                        onNext();
                    }}
                    className="group relative p-8 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-wts-green/50 rounded-2xl transition-all text-left flex flex-col h-[300px]"
                >
                    <div className="w-14 h-14 rounded-full bg-white/5 group-hover:bg-wts-green/10 flex items-center justify-center border border-white/10 group-hover:border-wts-green mb-auto transition-colors">
                        <Shirt size={28} className="text-gray-400 group-hover:text-wts-green transition-colors" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold italic uppercase tracking-tighter text-white mb-2 group-hover:text-wts-green transition-colors">
                            {t('onboarding.role_player')}
                        </h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t('onboarding.role_player_desc')}
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );

    // ==========================================
    // MANAGER FLOW
    // ==========================================

    // --- SCREEN M1: VALUE HOOK ---
    const ScreenManagerValue = () => (
        <div className="text-center max-w-2xl mx-auto space-y-8">
            <h1 className="text-6xl md:text-7xl font-display font-bold italic uppercase tracking-tighter text-white leading-[0.9]">
                {t('onboarding.manager_value_title')}
            </h1>
            <p className="text-xl text-gray-400 font-sans tracking-wide max-w-lg mx-auto">
                {t('onboarding.manager_value_desc')}
            </p>
            <div className="pt-8 flex flex-col items-center space-y-4">
                <button
                    onClick={onNext}
                    className="group relative px-8 py-4 bg-wts-green text-black font-bold uppercase tracking-widest hover:bg-white transition-all rounded-xl text-sm flex items-center space-x-3"
                >
                    <span>{t('onboarding.create_club_btn')}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );

    // --- SCREEN M2: SCOPE ---
    const ScreenManagerScope = () => {
        const features = [
            { icon: Users, label: t('onboarding.feature_squad') },
            { icon: Trophy, label: t('onboarding.feature_lineups') },
            { icon: Calendar, label: t('onboarding.feature_fixtures') },
            { icon: Wallet, label: t('onboarding.feature_fees') }
        ];

        return (
            <div className="w-full max-w-lg mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-display font-bold italic uppercase tracking-tighter text-white mb-2">
                        {t('onboarding.manager_scope_title')}
                    </h2>
                    <p className="text-gray-500 text-sm">{t('onboarding.manager_scope_desc')}</p>
                </div>

                <div className="grid gap-4 mb-10">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-wts-green/10 flex items-center justify-center text-wts-green mr-4">
                                <f.icon size={20} />
                            </div>
                            <span className="text-white font-bold uppercase tracking-wide text-sm">{f.label}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                    {t('onboarding.continue_btn')}
                </button>
            </div>
        );
    };



    // --- SCREEN M4: ADD PLAYERS ---
    const ScreenAddPlayers = () => {
        const [newName, setNewName] = useState('');

        const handleAdd = () => {
            if (newName.trim()) {
                onUpdate({ players: [...data.players, { name: formatName(newName), position: 'MID' }] });
                setNewName('');
            }
        };

        const handleRemove = (index: number) => {
            const newPlayers = [...data.players];
            newPlayers.splice(index, 1);
            onUpdate({ players: newPlayers });
        };

        return (
            <div className="w-full max-w-lg mx-auto">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-display font-bold italic uppercase tracking-tighter text-white mb-2">
                        {t('onboarding.add_players_title')}
                    </h2>
                    <p className="text-gray-500 text-sm">{t('onboarding.add_players_subtitle')}</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                            placeholder="Player Name"
                            className="flex-1 bg-black/50 border border-white/10 focus:border-wts-green rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors font-bold uppercase tracking-wide"
                            autoFocus
                        />
                        <button
                            onClick={handleAdd}
                            className="px-4 py-3 bg-white/10 border border-white/10 rounded-xl hover:bg-white/20 text-white transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {data.players.length === 0 && (
                            <div className="text-center py-8 text-gray-600 italic text-sm border-2 border-dashed border-white/5 rounded-xl">
                                List is empty. Start adding your squad.
                            </div>
                        )}
                        {data.players.map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg group animate-in slide-in-from-left-2">
                                <span className="font-bold text-sm uppercase">{p.name}</span>
                                <button onClick={() => handleRemove(i)} className="text-gray-600 hover:text-red-500 transition-colors">
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onNext}
                        className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl transition-all"
                    >
                        {t('onboarding.continue_btn')}
                    </button>
                    <button
                        onClick={onNext}
                        className="w-full py-2 text-xs font-bold text-gray-600 hover:text-gray-400 uppercase tracking-widest transition-colors"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        );
    };





    // --- SCREEN M7: FEES CLARITY ---
    const ScreenFeesClarity = () => {
        return (
            <div className="w-full max-w-lg mx-auto">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-display font-bold italic uppercase tracking-tighter text-white mb-2">
                        {t('onboarding.fees_clarity_title')}
                    </h2>
                    <p className="text-gray-500 text-sm">{t('onboarding.fees_clarity_desc')}</p>
                </div>

                {/* Mini Visual Table */}
                <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden mb-10">
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Player</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</span>
                    </div>
                    {[
                        { name: 'Ryan Williams', status: 'paid', amt: data.defaultFee },
                        { name: 'Liam Davies', status: 'unpaid', amt: data.defaultFee },
                        { name: 'Chris Thompson', status: 'paid', amt: data.defaultFee },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0">
                            <span className="text-sm font-bold text-white uppercase">{row.name}</span>
                            {row.status === 'paid' ? (
                                <span className="px-3 py-1 bg-wts-green/10 text-wts-green text-[10px] font-bold uppercase tracking-widest rounded border border-wts-green/20">
                                    Paid
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded border border-red-500/20">
                                    £{row.amt.toFixed(2)}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={onNext}
                    className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                    {t('onboarding.finish_setup_btn')}
                </button>
            </div>
        );
    };

    // --- SCREEN M8: MANAGER CONFIRMATION ---
    const ScreenManagerConfirmation = () => {
        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleComplete = async () => {
            setIsSubmitting(true);
            try {
                // Add Manager as Captain if not already in the list
                // We use a small delay to ensure the visual indicator (button state) is seen
                await new Promise(resolve => setTimeout(resolve, 800));

                const managerPlayer = {
                    name: data.playerName,
                    position: 'MID', // Default, could be 'MGR' if supported
                    captain: true
                };

                // Add manager at the TOP of the list
                const finalPlayers = [managerPlayer, ...data.players];

                // CRITICAL: Save to permanent storage so it survives resetOnboarding
                // We use a separate key 'wts-squad-data' for the roster
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('wts-squad-data', JSON.stringify(finalPlayers));
                }

                onUpdate({ players: finalPlayers });

                // Allow state to propagate
                setTimeout(() => {
                    onFinish();
                }, 100);
            } catch (e) {
                console.error(e);
                setIsSubmitting(false);
            }
        };

        return (
            <div className="text-center max-w-xl mx-auto space-y-10">
                <div className="w-24 h-24 mx-auto rounded-full bg-wts-green/10 flex items-center justify-center border border-wts-green text-wts-green mb-6 animate-in zoom-in duration-500">
                    <Trophy size={40} />
                </div>

                <div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold italic uppercase tracking-tighter text-white mb-4">
                        {t('onboarding.manager_confirmation_title')}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {t('onboarding.manager_confirmation_desc')}
                    </p>
                </div>

                <div className="pt-4 flex flex-col space-y-4">
                    <button
                        onClick={handleComplete}
                        disabled={isSubmitting}
                        className="w-full py-5 bg-wts-green text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)] disabled:opacity-50"
                    >
                        {isSubmitting ? 'Finalizing...' : t('onboarding.add_first_fixture_btn')}
                    </button>
                    <button
                        onClick={handleComplete}
                        className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                    >
                        {t('onboarding.go_to_dashboard_btn')}
                    </button>
                </div>
            </div>
        );
    };

    // ==========================================
    // PLAYER FLOW (NEW)
    // ==========================================

    // --- SCREEN P1: VALUE HOOK ---
    const ScreenPlayerValue = () => (
        <div className="text-center max-w-2xl mx-auto space-y-8">
            <h1 className="text-6xl md:text-7xl font-display font-bold italic uppercase tracking-tighter text-white leading-[0.9]">
                {t('onboarding.player_value_title')}
            </h1>
            <p className="text-xl text-gray-400 font-sans tracking-wide max-w-lg mx-auto">
                {t('onboarding.player_value_desc')}
            </p>
            <div className="pt-8 flex flex-col items-center space-y-4">
                <button
                    onClick={onNext}
                    className="group relative px-8 py-4 bg-wts-green text-black font-bold uppercase tracking-widest hover:bg-white transition-all rounded-xl text-sm flex items-center space-x-3"
                >
                    <span>{t('onboarding.find_team_btn')}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );

    // --- SCREEN P2: JOIN A TEAM ---
    const ScreenPlayerJoin = () => (
        <div className="w-full max-w-lg mx-auto">
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-display font-bold italic uppercase tracking-tighter text-white mb-2">
                    {t('onboarding.join_team_title')}
                </h2>
            </div>

            <div className="space-y-4">
                <button className="flex items-center w-full p-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-wts-green/50 rounded-xl transition-all group">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-wts-green mr-4">
                        <LinkIcon size={20} />
                    </div>
                    <div className="text-left">
                        <span className="block text-white font-bold uppercase tracking-wide">{t('onboarding.join_via_link')}</span>
                        <span className="text-xs text-gray-500">{t('onboarding.join_via_link_desc')}</span>
                    </div>
                </button>

                <button className="flex items-center w-full p-6 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-wts-green/50 rounded-xl transition-all group" onClick={onNext}>
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white mr-4">
                        <Search size={20} />
                    </div>
                    <div className="text-left">
                        <span className="block text-white font-bold uppercase tracking-wide">{t('onboarding.search_team')}</span>
                        <span className="text-xs text-gray-500">{t('onboarding.search_team_desc')}</span>
                    </div>
                </button>
            </div>

            <button
                onClick={onNext}
                className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold uppercase tracking-widest rounded-xl transition-all"
            >
                {t('onboarding.continue_btn')}
            </button>
        </div>
    );

    // --- SCREEN P3: PLAYER PROFILE ---
    const ScreenPlayerProfile = () => (
        <div className="w-full max-w-lg mx-auto">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-display font-bold italic uppercase tracking-tighter text-white mb-2">
                    {t('onboarding.player_profile_title')}
                </h2>
                <p className="text-gray-500 text-sm">{t('onboarding.player_profile_desc')}</p>
            </div>

            <div className="space-y-6 mb-10">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('onboarding.your_name_label')}</label>
                    <input
                        type="text"
                        value={data.playerName}
                        onChange={(e) => onUpdate({ playerName: e.target.value })}
                        placeholder="e.g. John Smith"
                        className="w-full bg-black/50 border border-white/10 focus:border-wts-green rounded-xl px-4 py-3 text-white placeholder-gray-700 outline-none transition-colors font-bold uppercase tracking-wide"
                        autoFocus
                    />
                </div>

                <CountryAutocomplete
                    label="Nationality"
                    value={data.playerNationality || 'gb-eng'}
                    onChange={(val) => onUpdate({ playerNationality: val })}
                    placeholder="Select nationality..."
                />

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('onboarding.preferred_position_label')}</label>
                    <select
                        value={data.playerPosition}
                        onChange={(e) => onUpdate({ playerPosition: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 focus:border-wts-green rounded-xl px-4 py-3 text-white outline-none transition-colors font-bold uppercase tracking-wide"
                    >
                        <option value="GK">Goalkeeper</option>
                        <option value="DEF">Defender</option>
                        <option value="MID">Midfielder</option>
                        <option value="FWD">Forward</option>
                    </select>
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={data.playerName.length < 2}
                className="w-full py-4 bg-wts-green disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-black font-bold uppercase tracking-widest rounded-xl transition-all"
            >
                {t('onboarding.continue_btn')}
            </button>
        </div>
    );

    // --- SCREEN P4: PLAYER CONFIRMATION ---
    const ScreenPlayerConfirmation = () => {
        const handleComplete = () => {
            onFinish();
        };

        return (
            <div className="text-center max-w-xl mx-auto space-y-10">
                <div className="w-24 h-24 mx-auto rounded-full bg-wts-green/10 flex items-center justify-center border border-wts-green text-wts-green mb-6 animate-in zoom-in duration-500">
                    <Check size={40} />
                </div>

                <div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold italic uppercase tracking-tighter text-white mb-4">
                        {t('onboarding.player_confirmation_title')}
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {t('onboarding.player_confirmation_desc')}
                    </p>
                </div>

                <div className="pt-4 flex flex-col space-y-4">
                    <button
                        onClick={handleComplete}
                        className="w-full py-5 bg-wts-green text-black font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,65,0.3)]"
                    >
                        {t('onboarding.go_to_matchday_btn')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4">

            {/* Progress Bar - Only valid if role selected */}
            {role && currentStep > 0 && (
                <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-50">
                    <motion.div
                        className="h-full bg-wts-green shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / (role === 'MANAGER' ? 11 : 5)) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            )}

            {/* Back Button */}
            {currentStep > 0 && currentStep < (role === 'MANAGER' ? 11 : 5) && (
                <button
                    onClick={onBack}
                    className="fixed top-8 left-8 text-gray-500 hover:text-white transition-colors z-40"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            <AnimatePresence mode="wait">
                {/* Step 0: Language Selection */}
                {currentStep === 0 && (
                    <LanguageSelectionScreen onNext={onNext} />
                )}

                {/* Step 1: Role Selection */}
                {currentStep === 1 && (
                    <motion.div key="step-1" initial="initial" animate="animate" exit="exit" variants={pageVariants} className="min-h-[60vh] flex flex-col justify-center py-10">
                        <ScreenRoleChoice />
                    </motion.div>
                )}

                {/* Manager Flow */}
                {role === 'MANAGER' && (
                    <motion.div key={`manager-${currentStep}`} initial="initial" animate="animate" exit="exit" variants={pageVariants} className="min-h-[60vh] flex flex-col justify-center py-10">
                        {currentStep === 2 && <ScreenManagerValue />}
                        {currentStep === 3 && <ScreenManagerScope />}
                        {currentStep === 4 && (
                            <ManagerNameScreen
                                data={data}
                                onUpdate={(updates) => onUpdate({ ...updates, playerName: updates.playerName ? formatName(updates.playerName) : updates.playerName })}
                                onNext={onNext}
                            />
                        )}
                        {currentStep === 5 && (
                            <CreateClubScreen
                                data={data}
                                onUpdate={onUpdate}
                                onNext={onNext}
                            />
                        )}
                        {currentStep === 6 && <ScreenAddPlayers />}
                        {currentStep === 7 && (
                            <MatchDefaultsScreen
                                data={data}
                                onUpdate={onUpdate}
                                onNext={onNext}
                            />
                        )}
                        {currentStep === 8 && (
                            <TacticsPreviewScreen
                                data={data}
                                onNext={onNext}
                            />
                        )}
                        {currentStep === 9 && <ScreenFeesClarity />}
                        {currentStep === 10 && (
                            <PaywallScreen
                                data={data}
                                onUpdate={onUpdate}
                                onNext={onNext}
                            />
                        )}
                        {currentStep === 11 && <ScreenManagerConfirmation />}
                    </motion.div>
                )}

                {role === 'PLAYER' && (
                    <motion.div key={`player-${currentStep}`} initial="initial" animate="animate" exit="exit" variants={pageVariants} className="min-h-[60vh] flex flex-col justify-center py-10">
                        {currentStep === 2 && <ScreenPlayerValue />}
                        {currentStep === 3 && <ScreenPlayerJoin />}
                        {currentStep === 4 && <ScreenPlayerProfile />}
                        {currentStep === 5 && <ScreenPlayerConfirmation />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
