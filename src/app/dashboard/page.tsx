'use client';

import { UpcomingFixtureWidget } from '@/components/dashboard/widgets/upcoming-fixture';
import { SquadAvailabilityWidget } from '@/components/dashboard/widgets/squad-availability';
import { OutstandingFeesWidget } from '@/components/dashboard/widgets/outstanding-fees';
import { UnreadMessagesWidget } from '@/components/dashboard/widgets/unread-messages';
import { LastResultWidget } from '@/components/dashboard/widgets/last-result';
import { TeamAnnouncementsWidget } from '@/components/dashboard/widgets/team-announcements';

import { useLanguage } from '@/hooks/use-language';

export default function DashboardPage() {
    const { t } = useLanguage();

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
            {/* Page Header */}
            <div>
                <span className="text-wts-green text-[9px] font-bold tracking-[0.3em] uppercase block mb-1.5 font-mono">
                    {t('dashboard.matchday_ops')}
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold italic uppercase tracking-tighter text-white">
                    {t('dashboard.title')}
                </h2>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Row 1: Key Focus */}
                <div className="lg:col-span-2">
                    <UpcomingFixtureWidget />
                </div>
                <div className="lg:col-span-1">
                    <SquadAvailabilityWidget />
                </div>

                {/* Row 2: Secondary Info */}
                <div className="lg:col-span-1">
                    <LastResultWidget />
                </div>
                <div className="lg:col-span-1">
                    <OutstandingFeesWidget />
                </div>
                <div className="lg:col-span-1">
                    <UnreadMessagesWidget />
                </div>

                {/* Row 3: Announcements (Full Width) */}
                <div className="lg:col-span-3">
                    <TeamAnnouncementsWidget />
                </div>
            </div>
        </div>
    );
}
