'use client';

import { X, Share2, Download, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface SharePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null;
    onShare: () => void;
    onDownload: () => void;
}

export function SharePreviewModal({ isOpen, onClose, imageUrl, onShare, onDownload }: SharePreviewModalProps) {
    if (!isOpen || !imageUrl) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-5xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <h2 className="text-xl font-display font-bold italic text-white uppercase tracking-tighter">
                        Share Squad
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Image Preview Area */}
                <div className="flex-1 p-6 md:p-10 bg-[url('/grid-bg.png')] bg-center bg-cover relative flex items-center justify-center min-h-[400px] bg-black/50">
                    <div className="relative shadow-2xl rounded-xl overflow-hidden border border-white/20">
                        {/* We use a simple img tag for the data URL to avoid Next/Image config issues with blob/data URLs if strict */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt="Squad Preview"
                            className="max-w-full max-h-[60vh] w-auto h-auto object-contain"
                        />
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-white/10 bg-black/40 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm font-medium">
                        Preview generated successfully
                    </p>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        <button
                            onClick={onDownload}
                            className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold uppercase tracking-widest text-xs text-white flex items-center justify-center space-x-2 transition-all"
                        >
                            <Download size={16} />
                            <span>Download Image</span>
                        </button>
                        <button
                            onClick={onShare}
                            className="flex-1 md:flex-none px-8 py-3 bg-wts-green hover:bg-wts-green/90 text-black rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-wts-green/20"
                        >
                            <Share2 size={16} />
                            <span>Share Now</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
