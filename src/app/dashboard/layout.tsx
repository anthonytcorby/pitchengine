'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trophy, Home, Users, Calendar, Wallet, Settings, Menu, Bell, ClipboardList, Table, Tv, MessageSquare, Globe, UserPlus, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { User, Team } from '@/types/schema';
import { useLanguage } from '@/hooks/use-language';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // --- Data State ---
    const [user, setUser] = useState<User | null>(null);
    const [team, setTeam] = useState<Team | null>(null);

    const pathname = usePathname();
    const loadData = async () => {
        try {
            const currentUser = await api.getCurrentUser();
            setUser(currentUser);
            if (currentUser.teamId) {
                const currentTeam = await api.getTeam(currentUser.teamId);
                setTeam(currentTeam);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            router.push('/auth'); // Redirect to login/auth if not logged in
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
    // ...
}, [router]);

// ...

if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#050D05]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wts-green"></div>
        </div>
    );
}

if (!user) return null; // Should have redirected by now

return (
    <div className="flex h-screen bg-[#050D05] selection:bg-wts-green/30 overflow-hidden relative">
        {/* Background Image - Now Global */}
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
                src={
                    pathname === '/dashboard/tactics' ? "/tactics-bg.png" :
                        pathname === '/dashboard/matchday' ? "/matchday-bg.png" :
                            pathname === '/dashboard/fees' ? "/fees-bg.png" :
                                pathname === '/dashboard/comms' ? "/comms-bg.png" :
                                    pathname === '/dashboard/squad' ? "/squad-bg.png" :
                                        "/dashboard-bg.png"
                }
                alt="Dashboard Background"
                fill
                className={`object-cover ${pathname === '/dashboard/tactics' ? 'opacity-90' :
                    pathname === '/dashboard/matchday' ? 'opacity-60' :
                        pathname === '/dashboard/fees' ? 'opacity-50' :
                            pathname === '/dashboard/comms' ? 'opacity-80' :
                                pathname === '/dashboard/squad' ? 'opacity-50' :
                                    'opacity-50'
                    }`}
                priority
                quality={90}
            />
            <div className={`absolute inset-0 ${pathname === '/dashboard/tactics' ? 'bg-gradient-to-b from-black/40 via-black/10 to-black/40' :
                pathname === '/dashboard/matchday' ? 'bg-gradient-to-b from-black/20 via-black/10 to-black/60' :
                    'bg-gradient-to-b from-black/20 via-black/10 to-black/60'
                }`} />
        </div>

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/60 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex flex-col h-full safe-top">
                {/* Sidebar Logo */}
                <div className="p-6">
                    <Link href="/" className="flex items-center space-x-3 group">

                        <span className="font-outfit font-bold text-xl tracking-widest text-white group-hover:text-wts-green transition-colors uppercase">
                            PITCH ENGINE
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-2 py-4 flex flex-col">
                    {menuGroups.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            {group.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all group mb-1 ${isActive
                                            ? 'bg-wts-green text-black'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                            {groupIndex < menuGroups.length - 1 && (
                                <div className="w-8 h-0.5 bg-wts-green/30 rounded-full mx-4 my-3" />
                            )}
                        </div>
                    ))}

                    {/* Settings at Bottom */}
                    <div className="mt-auto pt-2">
                        <div className="w-8 h-0.5 bg-wts-green/30 rounded-full mx-4 mb-3" />
                        <Link
                            href="/dashboard/settings"
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-bold tracking-widest uppercase transition-all group ${pathname === '/dashboard/settings'
                                ? 'bg-wts-green text-black'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <Settings size={20} />
                            <span>{t('nav.settings')}</span>
                        </Link>
                    </div>
                </nav>

                {/* Bottom Profile */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                        <div className="w-9 h-9 rounded-full bg-wts-green flex items-center justify-center text-black font-bold text-sm">
                            {getInitials(user.email)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                                {user.role === 'MANAGER' ? t('dashboard.roles.manager') : t('dashboard.roles.player')}
                            </p>
                            <p className="text-xs font-bold text-white truncate">
                                {team?.name || 'No Team'}
                            </p>
                            {user.subscriptionTier === 'PRO' && (
                                <div className="mt-1 inline-block px-2 py-0.5 bg-wts-green/10 border border-wts-green/20 rounded text-[7px] font-bold text-wts-green uppercase tracking-widest">
                                    Premium Pro
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden h-full z-10">

            {/* Dashboard Header */}
            <header className="h-16 border-b border-white/5 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 z-40 safe-top relative">
                <div className="flex items-center space-x-4">
                    <button className="lg:hidden text-gray-400 p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu size={20} />
                    </button>
                    <h1 className="text-sm font-bold tracking-widest uppercase text-white font-outfit">{t('dashboard.squad_dashboard')}</h1>
                </div>

                <div className="flex items-center space-x-3 relative">
                    {team && (
                        <span className="hidden md:inline-block text-sm font-bold text-white uppercase tracking-widest mr-4">
                            {team.name}
                        </span>
                    )}
                    <button
                        className="relative p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    >
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-wts-green rounded-full" />
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationsOpen && (
                        <div className="absolute top-12 right-0 w-[400px] bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('dashboard.notifications.title')}</h3>
                                <button className="text-xs text-wts-green hover:underline">{t('dashboard.notifications.mark_read')}</button>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto">
                                {[
                                    { title: 'Match Confirmed', desc: 'vs Tech United scheduled for Tuesday 19:30', time: '2m ago', unread: true },
                                    { title: 'Fee Payment', desc: 'Ryan Williams paid £5.00', time: '1h ago', unread: true },
                                    { title: 'Squad Update', desc: 'Daniel Vieri set status: Available', time: '3h ago', unread: false },
                                ].map((notif, i) => (
                                    <div key={i} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${notif.unread ? 'bg-white/[0.02]' : ''}`}>
                                        <div className="flex items-start justify-between mb-1">
                                            <span className={`text-sm font-bold ${notif.unread ? 'text-white' : 'text-gray-400'}`}>{notif.title}</span>
                                            <span className="text-xs text-gray-600">{notif.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">{notif.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 text-center border-t border-white/5">
                                <button className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors">
                                    {t('dashboard.notifications.view_all')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar scroll-smooth relative z-10">
                {children}
            </div>
        </main>
    </div>
);
}
