'use client';

import { MapPin, Calendar, CheckCircle2, X } from 'lucide-react';

interface ConfirmSquadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    matchDetails: {
        opponent: string;
        competition: string;
        venue: string;
        date: string;
        time: string;
    };
}

export function ConfirmSquadModal({ isOpen, onClose, onConfirm, matchDetails }: ConfirmSquadModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-300">
                {/* Header Gradient */}
                <div className="h-2 bg-gradient-to-r from-wts-green via-white to-wts-green opacity-50" />

                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-display font-bold italic text-white uppercase tracking-tighter mb-2">
                                Confirm Match Selection
                            </h2>
                            <p className="text-gray-400 text-sm">
                                Please review the details for the upcoming fixture.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Match Card */}
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-wts-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                            <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tighter">
                                VS {matchDetails.opponent}
                            </h3>

                            <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-widest text-wts-green">
                                <span className="flex items-center space-x-2">
                                    <Calendar size={14} />
                                    <span>{matchDetails.date} • {matchDetails.time}</span>
                                </span>
                            </div>

                            <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <MapPin size={14} />
                                <span>{matchDetails.venue}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-bold uppercase tracking-widest text-xs text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className="px-6 py-4 bg-wts-green hover:bg-wts-green/90 text-black rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-wts-green/20 flex items-center justify-center space-x-2"
                        >
                            <CheckCircle2 size={16} />
                            <span>Confirm Squad</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
