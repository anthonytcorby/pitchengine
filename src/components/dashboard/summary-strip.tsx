'use client';

import { Users, Wallet, Calendar, Trophy, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { ReactNode } from 'react';

interface SummaryMetric {
    label: string;
    primary: ReactNode;
    secondary: string;
    alert?: boolean;
    trend?: 'up' | 'down' | 'neutral';
}

export function SummaryStrip() {
    const metrics: SummaryMetric[] = [
        {
            label: 'AVAILABILITY',
            primary: '12 / 14',
            secondary: '2 pending response',
            alert: true,
        },
        {
            label: 'FINANCES',
            primary: '£125.00',
            secondary: '£25.00 outstanding',
        },
        {
            label: 'NEXT FIXTURE',
            primary: 'Tuesday 19:30',
            secondary: 'vs Tech United',
        },
        {
            label: 'FORM',
            primary: (
                <div className="flex items-center space-x-1">
                    <FormBadge result="W" />
                    <FormBadge result="W" />
                    <FormBadge result="L" />
                    <FormBadge result="D" />
                    <FormBadge result="W" />
                </div>
            ),
            secondary: 'Last 5 matches',
            trend: 'up',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
            ))}
        </div>
    );
}

function FormBadge({ result }: { result: 'W' | 'D' | 'L' }) {
    const colors = {
        W: 'bg-wts-green text-black border-wts-green',
        D: 'bg-gray-500 text-white border-gray-400',
        L: 'bg-red-500 text-white border-red-500',
    };

    return (
        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black border ${colors[result]}`}>
            {result}
        </div>
    );
}

interface MetricCardProps extends SummaryMetric { }

function MetricCard({ label, primary, secondary, alert, trend }: MetricCardProps) {
    return (
        <div className="bg-black/40 border border-white/5 rounded-lg p-4 hover:border-white/10 transition-colors relative">
            {alert && (
                <div className="absolute top-3 right-3">
                    <AlertCircle size={12} className="text-red-500" />
                </div>
            )}
            <div className="space-y-2">
                <p className="text-xs font-bold tracking-[0.2em] text-gray-600 uppercase font-mono">
                    {label}
                </p>
                <div className="flex items-center space-x-2 h-9">
                    <div className="text-3xl font-display font-bold italic tracking-tighter text-white">
                        {primary}
                    </div>
                    {trend && (
                        <div className="flex-shrink-0">
                            {trend === 'up' && <TrendingUp size={16} className="text-wts-green" />}
                            {trend === 'down' && <TrendingDown size={16} className="text-red-500" />}
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 font-mono tracking-wide">
                    {secondary}
                </p>
            </div>
        </div>
    );
}
