'use client';

import { Settings as SettingsIcon, Bell, Wallet, Shield, Users, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { api } from '@/services/api';
import { getFormationsForSize } from '@/lib/formations';

export default function SettingsPage() {
    const { language, setLanguage, t, isClient } = useLanguage();
    const [clubName, setClubName] = useState('');
    const [team, setTeam] = useState<any>(null); // Quick type
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const loadTeam = async () => {
            const user = await api.getCurrentUser();
            if (user.teamId) {
                const t = await api.getTeam(user.teamId);
                setTeam(t);
                if (t) setClubName(t.name);
            }
        };
        loadTeam();
    }, []);

    const handleSave = async () => {
        if (!team) return;
        setIsSaving(true);
        try {
            await api.updateTeam(team.id, { name: clubName });
            window.dispatchEvent(new Event('team-update'));
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isClient) {
        return <div className="p-10 text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="space-y-6 max-w-[1000px] mx-auto animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-wts-green text-[9px] font-bold tracking-[0.3em] uppercase block mb-1.5 font-mono">
                        {t('settings.subtitle')}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold italic uppercase tracking-tighter text-white">
                        {t('settings.title')}
                    </h2>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving || isSaved}
                    className={`px-6 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${isSaved
                            ? 'bg-gray-600/20 border border-gray-600/30 text-gray-400 cursor-default'
                            : 'bg-wts-green/10 border border-wts-green/20 text-wts-green hover:bg-wts-green/20 disabled:opacity-50'
                        }`}
                >
                    {isSaving ? 'SAVING...' : isSaved ? 'CHANGES SAVED' : t('common.save')}
                </button>
            </div>

            {/* General / Localization */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-5">
                    <div className="p-1.5 bg-white/5 rounded-md">
                        <Globe className="text-gray-400 w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[10px] uppercase tracking-[0.15em] text-white">
                        {t('settings.language')}
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-2">
                            {t('settings.select_language')}
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-wts-green/50"
                        >
                            <option value="en">English (UK)</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="pt">Português</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Team Configuration */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-5">
                    <div className="p-1.5 bg-white/5 rounded-md">
                        <Users className="text-gray-400 w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[10px] uppercase tracking-[0.15em] text-white">
                        {t('settings.team_config')}
                    </h3>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-2">
                                {t('settings.team_name')}
                            </label>
                            <input
                                type="text"
                                value={clubName}
                                onChange={(e) => setClubName(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-wts-green/50"
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-2">
                                {t('settings.team_format')}
                            </label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-wts-green/50"
                                onChange={(e) => {
                                    if (typeof window !== 'undefined') {
                                        localStorage.setItem('wts-team-size', e.target.value);
                                        window.dispatchEvent(new Event('storage'));
                                    }
                                }}
                                defaultValue={typeof window !== 'undefined' ? localStorage.getItem('wts-team-size') || '11' : '11'}
                            >
                                <option value="11">11-a-side</option>
                                <option value="7">7-a-side</option>
                                <option value="6">6-a-side</option>
                                <option value="5">5-a-side</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-2">
                            {t('settings.default_formation')}
                        </label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-wts-green/50">
                            {Object.keys(getFormationsForSize(11)).map(fmt => (
                                <option key={fmt} value={fmt}>{fmt}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-5">
                    <div className="p-1.5 bg-white/5 rounded-md">
                        <Bell className="text-gray-400 w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[10px] uppercase tracking-[0.15em] text-white">
                        {t('settings.notification_rules')}
                    </h3>
                </div>
                <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-[10px] font-bold text-white">{t('settings.fixture_reminders')}</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-[10px] font-bold text-white">{t('settings.availability_notifs')}</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-[10px] font-bold text-white">{t('settings.payment_reminders')}</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </label>
                </div>
            </div>

            {/* Payment Setup */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-5">
                    <div className="p-1.5 bg-white/5 rounded-md">
                        <Wallet className="text-gray-400 w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[10px] uppercase tracking-[0.15em] text-white">
                        {t('settings.payment_setup')}
                    </h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-2">
                            {t('settings.per_match_fee')} (£)
                        </label>
                        <input
                            type="number"
                            defaultValue="5"
                            step="0.50"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-wts-green/50"
                        />
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-2">
                            {t('settings.currency')}
                        </label>
                        <select
                            defaultValue={typeof window !== 'undefined' ? Intl.NumberFormat().resolvedOptions().currency || 'GBP' : 'GBP'}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-wts-green/50"
                        >
                            <option value="GBP">GBP (£)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="AUD">AUD ($)</option>
                            <option value="CAD">CAD ($)</option>
                            <option value="JPY">JPY (¥)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest block mb-2">
                            {t('settings.payment_method')}
                        </label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-wts-green/50">
                            <option>Cash</option>
                            <option>Bank Transfer</option>
                            <option>PayPal</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Subscription */}
            <div className="bg-black/40 border border-wts-green/20 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-5">
                    <div className="p-1.5 bg-wts-green/10 rounded-md">
                        <Shield className="text-wts-green w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-[10px] uppercase tracking-[0.15em] text-white">
                        {t('settings.subscription')}
                    </h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-white">{t('settings.current_plan')}</p>
                            <p className="text-[9px] text-gray-500 font-mono">{t('settings.active_since')} Dec 2024</p>
                        </div>
                        <div className="px-3 py-1.5 bg-wts-green/10 border border-wts-green/20 rounded">
                            <span className="text-[9px] font-bold text-wts-green uppercase tracking-widest">
                                Premium Pro
                            </span>
                        </div>
                    </div>
                    <button className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors">
                        {t('settings.manage_subscription')}
                    </button>
                </div>
            </div>


        </div>
    );
}
