'use client';

import { useState, useEffect } from 'react';
import {
    MessageSquare, Pin, Search, Filter, Check, CheckCheck,
    Bell, Calendar, Shield, Info, Plus, ChevronRight, User, MoreHorizontal, X, Send, Trash2
} from 'lucide-react';
import { useMessages, Message, MessageType, MessageStatus } from '@/hooks/use-messages';



export default function CommsPage() {
    const { messages, addMessage, deleteMessage, markAsRead } = useMessages();
    const [activeFilter, setActiveFilter] = useState<MessageType | 'all'>('all');
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!selectedMessageId && messages.length > 0) {
            setSelectedMessageId(messages[0].id);
        }
    }, [messages, selectedMessageId]);

    // Compose State
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [newMessage, setNewMessage] = useState({
        type: 'announcement' as MessageType,
        recipient: 'everyone',
        subject: '',
        content: '',
        isPinned: false,
        opponent: '',
        venue: '',
        kickoff: '',
        matchFee: ''
    });

    const filteredMessages = messages.filter(msg => {
        const matchesFilter = activeFilter === 'all' || msg.type === activeFilter;
        const matchesSearch = msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const selectedMessage = messages.find(m => m.id === selectedMessageId);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        const newMsg: Message = {
            id: Date.now().toString(),
            type: newMessage.type,
            status: 'read',
            sender: { name: 'Anthony Corby', role: 'Manager' },
            subject: newMessage.type === 'fixture'
                ? `MATCHDAY: vs ${newMessage.opponent}`
                : (newMessage.subject || 'No Subject'),
            preview: newMessage.type === 'fixture'
                ? `Kickoff ${newMessage.kickoff} • ${newMessage.venue}`
                : (newMessage.content.substring(0, 50) + '...'),
            content: newMessage.content,
            timestamp: 'Just now',
            isPinned: newMessage.isPinned,
            readCount: 0,
            total: 15,
            meta: newMessage.type === 'fixture' ? {
                location: newMessage.venue,
                matchFee: parseFloat(newMessage.matchFee) || 0
            } : undefined
        };

        addMessage(newMsg);
        setSelectedMessageId(newMsg.id);
        setIsComposeOpen(false);
        setNewMessage({
            type: 'announcement', recipient: 'everyone', subject: '', content: '', isPinned: false,
            opponent: '', venue: '', kickoff: '', matchFee: ''
        });
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 max-w-[1600px] mx-auto relative">
            {/* Compose Modal */}
            {isComposeOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div>
                                <h3 className="text-xl font-display font-bold italic text-white uppercase tracking-tighter">New Message</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Broadcast to Squad</p>
                            </div>
                            <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSend} className="p-8 space-y-6">
                            {/* Type & Recipient Row */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message Type</label>
                                    <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setNewMessage({ ...newMessage, type: 'announcement' })}
                                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${newMessage.type === 'announcement' ? 'bg-wts-green text-black' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewMessage({ ...newMessage, type: 'fixture' })}
                                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${newMessage.type === 'fixture' ? 'bg-wts-green text-black' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            Fixture
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewMessage({ ...newMessage, type: 'dm' })}
                                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all ${newMessage.type === 'dm' ? 'bg-wts-green text-black' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            DM
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">To</label>
                                    <select
                                        value={newMessage.recipient}
                                        onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-wts-green/50 appearance-none"
                                    >
                                        <option value="everyone">Everyone (Squad)</option>
                                        <option value="defenders">Defenders</option>
                                        <option value="midfielders">Midfielders</option>
                                        <option value="forwards">Forwards</option>
                                        {/* Mock players */}
                                        <option value="p1">Anthony Corby</option>
                                        <option value="p2">Marcus Richards</option>
                                    </select>
                                </div>
                            </div>

                            {/* Subject */}
                            {/* Fixture Details or Subject */}
                            {newMessage.type === 'fixture' ? (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Opponent</label>
                                        <input
                                            type="text"
                                            value={newMessage.opponent}
                                            onChange={(e) => setNewMessage({ ...newMessage, opponent: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-wts-green/50 font-medium"
                                            placeholder="e.g. Red Star FC"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Venue</label>
                                        <input
                                            type="text"
                                            value={newMessage.venue}
                                            onChange={(e) => setNewMessage({ ...newMessage, venue: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-wts-green/50 font-medium"
                                            placeholder="e.g. Hackney Marshes"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kickoff</label>
                                        <input
                                            type="time"
                                            value={newMessage.kickoff}
                                            onChange={(e) => setNewMessage({ ...newMessage, kickoff: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-wts-green/50 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Match Fee (£)</label>
                                        <input
                                            type="number"
                                            value={newMessage.matchFee}
                                            onChange={(e) => setNewMessage({ ...newMessage, matchFee: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-wts-green/50 font-medium"
                                            placeholder="5.00"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                                    <input
                                        type="text"
                                        value={newMessage.subject}
                                        onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-wts-green/50 font-medium"
                                        placeholder="e.g. Training Schedule Change"
                                        autoFocus
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message</label>
                                <textarea
                                    value={newMessage.content}
                                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                                    className="w-full h-40 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-wts-green/50 resize-none leading-relaxed"
                                    placeholder="Write your update here..."
                                />
                            </div>

                            {/* Options */}
                            <div className="flex items-center space-x-6 pt-2">
                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newMessage.isPinned ? 'bg-wts-green border-wts-green' : 'border-white/20 group-hover:border-white/40'}`}>
                                        {newMessage.isPinned && <Check size={14} className="text-black" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={newMessage.isPinned}
                                        onChange={(e) => setNewMessage({ ...newMessage, isPinned: e.target.checked })}
                                        className="hidden"
                                    />
                                    <span className={`text-xs font-bold uppercase tracking-widest ${newMessage.isPinned ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>Pin to Top</span>
                                </label>

                                <label className="flex items-center space-x-2 cursor-pointer group">
                                    <div className="w-5 h-5 rounded border border-white/20 group-hover:border-white/40 flex items-center justify-center">
                                        {/* Mock Unchecked */}
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-300">Send Email Notification</span>
                                </label>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-6 border-t border-white/10 flex items-center justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsComposeOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-wts-green hover:bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-wts-green/20 transition-all flex items-center space-x-2"
                                >
                                    <span>Post Message</span>
                                    <Send size={14} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sidebar - Message List */}
            <div className="w-[480px] flex flex-col bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">

                {/* Sidebar Header */}
                <div className="p-4 border-b border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold italic text-white uppercase tracking-tighter">Inbox</h2>
                        <button
                            onClick={() => setIsComposeOpen(true)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors"
                        >
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-wts-green/50"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex p-1 bg-white/5 rounded-lg">
                        {['all', 'announcement', 'fixture', 'dm'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter as any)}
                                className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${activeFilter === filter
                                    ? 'bg-wts-green text-black shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {filter === 'dm' ? 'DMs' : filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => setSelectedMessageId(msg.id)}
                            className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${selectedMessageId === msg.id ? 'bg-white/5 border-l-2 border-l-wts-green' : 'border-l-2 border-l-transparent'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center space-x-2">
                                    {msg.type === 'announcement' && <Bell size={12} className="text-wts-green" />}
                                    {msg.type === 'fixture' && <Calendar size={12} className="text-blue-400" />}
                                    {msg.type === 'system' && <Shield size={12} className="text-red-400" />}
                                    {msg.type === 'dm' && <User size={12} className="text-yellow-400" />}
                                    <span className={`text-xs font-bold ${msg.status === 'unread' ? 'text-white' : 'text-gray-400'}`}>
                                        {msg.sender.name}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {msg.isPinned && <Pin size={10} className="text-gray-500 rotate-45" />}
                                    <span className="text-[10px] text-gray-600 font-mono uppercase">{msg.timestamp}</span>
                                </div>
                            </div>
                            <h4 className={`text-sm mb-1 ${msg.status === 'unread' ? 'text-white font-bold' : 'text-gray-300 font-medium'}`}>
                                {msg.subject}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-1">{msg.preview}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Panel */}
            <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col">
                {selectedMessage ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-start bg-gradient-to-r from-white/5 to-transparent">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${selectedMessage.type === 'announcement' ? 'bg-wts-green/10 text-wts-green border-wts-green/20' :
                                        selectedMessage.type === 'fixture' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            selectedMessage.type === 'system' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {selectedMessage.type.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">{selectedMessage.timestamp}</span>
                                </div>
                                <h1 className="text-2xl font-display font-bold italic text-white uppercase tracking-tighter mb-2">
                                    {selectedMessage.subject}
                                </h1>
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400">
                                        {selectedMessage.sender.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-gray-300">{selectedMessage.sender.name}</span>
                                    <span className="text-xs text-gray-600">•</span>
                                    <span className="text-xs text-gray-500 uppercase tracking-widest">{selectedMessage.sender.role}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Delete message?')) {
                                            deleteMessage(selectedMessage.id);
                                            setSelectedMessageId(null);
                                        }
                                    }}
                                    className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete Message"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="flex-1 p-8 overflow-y-auto">
                            {selectedMessage.type === 'fixture' ? (
                                <div className="space-y-6">
                                    {/* Fixture Card */}
                                    <div className="bg-gradient-to-br from-blue-900/20 to-black border border-blue-500/20 rounded-xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Calendar size={120} />
                                        </div>
                                        <div className="relative z-10 space-y-6">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 block">Opponent</label>
                                                    <p className="text-xl font-bold text-white">
                                                        {selectedMessage.subject.replace('MATCHDAY: vs ', '')}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 block">Venue</label>
                                                    <p className="text-xl font-bold text-white">
                                                        {selectedMessage.meta?.location || 'TBC'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 block">Kickoff</label>
                                                    <p className="text-xl font-bold text-white">
                                                        {selectedMessage.preview.split('•')[0].replace('Kickoff ', '').trim()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 block">Match Fee</label>
                                                    <p className="text-xl font-bold text-white">
                                                        £{selectedMessage.meta?.matchFee?.toFixed(2) || '0.00'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-blue-500/20">
                                                <button className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-black font-bold uppercase tracking-widest rounded-lg transition-colors">
                                                    Acknowledge Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                                        <Info size={16} className="text-blue-400 mt-1" />
                                        <p className="text-sm text-gray-300 leading-relaxed">
                                            Please arrive 45 minutes before kickoff for warm-up. Black shorts and socks required.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 leading-relaxed text-base">
                                        {selectedMessage.content}
                                    </p>

                                    {selectedMessage.type === 'announcement' && selectedMessage.readCount && (
                                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center space-x-2">
                                                <CheckCheck size={14} className="text-wts-green" />
                                                <span>Read by {selectedMessage.readCount} of {selectedMessage.total} recipients</span>
                                            </div>
                                            <button className="text-gray-400 hover:text-white uppercase tracking-widest font-bold">
                                                View Receipt Log
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Filtered Footer Action (No reply for fixture/system) */}
                        {selectedMessage.type === 'dm' && (
                            <div className="p-4 border-t border-white/5 bg-white/5">
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Type a reply..."
                                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/30"
                                    />
                                    <button className="px-6 py-2 bg-white text-black font-bold uppercase tracking-widest rounded-lg text-xs hover:bg-gray-200 transition-colors">
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare size={48} className="mb-4 opacity-20" />
                        <p className="uppercase tracking-widest text-xs font-bold">Select a message</p>
                    </div>
                )}
            </div>
        </div>
    );
}
