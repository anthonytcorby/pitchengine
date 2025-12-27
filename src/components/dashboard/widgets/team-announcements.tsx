'use client';

import { Megaphone, Pin, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useMessages } from '@/hooks/use-messages';
import { useState } from 'react';
import Link from 'next/link';

export function TeamAnnouncementsWidget() {
    const { t } = useLanguage();
    const { messages, addMessage, deleteMessage } = useMessages();
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState('');

    // Filter to announcements or pinned items for the dashboard, or just show recent
    const recentMessages = messages.slice(0, 3);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        const newMsg = {
            id: Date.now().toString(),
            type: 'announcement' as const,
            status: 'read' as const,
            sender: { name: 'Manager', role: 'You' },
            subject: 'Quick Update',
            preview: newItem,
            content: newItem,
            timestamp: 'Just now',
            isPinned: false
        };
        addMessage(newMsg);
        setNewItem('');
        setIsAdding(false);
    };

    return (
        <div className="bg-wts-green/10 border border-wts-green/20 rounded-2xl p-6 relative overflow-hidden min-h-[300px] flex flex-col">
            {/* Decoration */}
            <Megaphone className="absolute -right-4 -bottom-4 text-wts-green/5 w-32 h-32 -rotate-12 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                        <Pin size={14} className="text-wts-green fill-wts-green" />
                        <span className="text-[9px] font-bold text-wts-green uppercase tracking-[0.2em]">{t('dashboard.widgets.announcement')}</span>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="p-2 hover:bg-white/10 rounded-full text-wts-green transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {/* Add Input */}
                {isAdding && (
                    <form onSubmit={handleAdd} className="mb-6 animate-in slide-in-from-top-2">
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                placeholder="Post an update..."
                                className="flex-1 bg-black/40 border border-wts-green/30 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-wts-green"
                            />
                            <button type="submit" className="px-4 py-2 bg-wts-green text-black font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-white transition-colors">
                                Post
                            </button>
                        </div>
                    </form>
                )}

                {/* Message List */}
                <div className="space-y-4 flex-1">
                    {recentMessages.map((msg) => (
                        <div key={msg.id} className="group relative bg-black/20 hover:bg-black/30 border border-white/5 rounded-xl p-4 transition-all">
                            {/* Hover Delete */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Delete this message?')) deleteMessage(msg.id);
                                }}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                                title="Delete Notice"
                            >
                                <Trash2 size={14} />
                            </button>

                            <h3 className="text-sm font-bold text-white mb-1 pr-6">
                                {msg.subject === 'Quick Update' ? msg.preview : msg.subject}
                            </h3>
                            <p className="text-xs text-gray-300 font-medium leading-relaxed line-clamp-2">
                                {msg.content}
                            </p>
                            <span className="text-[9px] text-gray-500 mt-2 block uppercase tracking-widest">{msg.timestamp} • {msg.sender.name}</span>
                        </div>
                    ))}
                    {recentMessages.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-xs italic">
                            No active announcements.
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                    <Link href="/dashboard/comms" className="text-[10px] font-bold text-white uppercase tracking-widest underline decoration-wts-green underline-offset-4 hover:text-wts-green transition-colors">
                        View All Messages
                    </Link>
                </div>
            </div>
        </div>
    );
}
