'use client';

import { Megaphone, Pin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function TeamAnnouncementsWidget() {
    const { t } = useLanguage();
    const announcement = {
        title: 'New Kit Order',
        content: 'Please submit your sizes for the new away kit by Friday. Order form is in the chat.',
        date: 'Today'
    };

    return (
        <div className="bg-wts-green/10 border border-wts-green/20 rounded-2xl p-6 relative overflow-hidden">
            {/* Decoration */}
            <Megaphone className="absolute -right-4 -bottom-4 text-wts-green/10 w-32 h-32 -rotate-12" />

            <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                    <Pin size={14} className="text-wts-green fill-wts-green" />
                    <span className="text-[9px] font-bold text-wts-green uppercase tracking-[0.2em]">{t('dashboard.widgets.announcement')}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                    {announcement.title}
                </h3>
                <p className="text-sm text-gray-300 font-medium leading-relaxed mb-4">
                    {announcement.content}
                </p>

                <button className="text-[10px] font-bold text-white uppercase tracking-widest underline decoration-wts-green underline-offset-4 hover:text-wts-green transition-colors">
                    {t('dashboard.widgets.read_more')}
                </button>
            </div>
        </div>
    );
}
