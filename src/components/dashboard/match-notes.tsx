'use client';

import { FileText, Plus, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function MatchNotes() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }, 1000);
    };

    return (
        <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-white/5 rounded-md">
                        <FileText className="text-gray-400 w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm uppercase tracking-[0.15em] text-white">
                        MATCH NOTES
                    </h3>
                </div>
                <div className={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                    <Plus size={16} />
                </div>
            </button>

            {isExpanded && (
                <div className="p-4 pt-0 space-y-3">
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Opposition Club
                        </p>
                        <input
                            type="text"
                            placeholder="e.g. Tech United"
                            className="w-full bg-white/5 border border-white/10 rounded-md p-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-wts-green/50 font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Opposition Notes
                        </p>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-md p-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-wts-green/50 resize-none font-mono"
                            rows={3}
                            placeholder="Tactical observations, key players, recent form..."
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Set-Piece Reminders
                        </p>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-md p-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-wts-green/50 resize-none font-mono"
                            rows={2}
                            placeholder="Corners, free kicks, throw-ins..."
                        />
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            Internal Staff Notes
                        </p>
                        <textarea
                            className="w-full bg-white/5 border border-white/10 rounded-md p-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-wts-green/50 resize-none font-mono"
                            rows={2}
                            placeholder="Internal team notes..."
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving || isSaved}
                        className={`w-full py-3 px-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${isSaved
                                ? 'bg-wts-green text-black border border-wts-green'
                                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            {isSaving ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : isSaved ? (
                                <Check size={14} />
                            ) : null}
                            <span>{isSaving ? 'Saving...' : isSaved ? 'Saved Successfully' : 'Save Notes'}</span>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}
