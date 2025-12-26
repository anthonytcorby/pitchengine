'use client';

import { MessageSquare, Bell } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';

export function UnreadMessagesWidget() {
    const { t } = useLanguage();
    const unreadCount = 3;
    const latestMessage = {
        author: 'Alex (Vice Captain)',
        text: 'Lads, are we doing drinks after the game on Tuesday?',
        time: '2h ago'
    };

    return (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 group hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">

            <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em]">{t('dashboard.widgets.team_comms')}</span>
                {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-blue-500 text-black text-[9px] font-bold rounded-full">
                        {unreadCount} {t('dashboard.widgets.new_msg')}
                    </span>
                )}
            </div>

            <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border-l-2 border-blue-500 relative">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-wts-green uppercase tracking-wider">{latestMessage.author}</span>
                        <span className="text-[9px] text-gray-500">{latestMessage.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 font-medium leading-relaxed line-clamp-2">
                        "{latestMessage.text}"
                    </p>
                </div>

                <div className="flex justify-end">
                    <Link href="/dashboard/comms" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                        {t('dashboard.widgets.view_messages')}
                    </Link>
                </div>
            </div>

            <Link href="/dashboard/comms" className="absolute inset-0 z-20" aria-label="Go to Comms" />
        </div>
    );
}
