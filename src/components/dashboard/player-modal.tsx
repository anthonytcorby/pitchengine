import { useState, useEffect } from 'react';
import { X, Shield, Trash2, Save, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Player, Role } from '@/types/schema';
import { formatName } from '@/lib/utils';

interface PlayerModalProps {
    isOpen: boolean;
    onClose: () => void;
    player: Player | null;
    teamName?: string;
    onSave: (updatedPlayer: Player) => void;
    onRelease: (playerId: string) => void;
    onInvite?: (email: string, message: string) => void;
}

export function PlayerModal({ isOpen, onClose, player, teamName, onSave, onRelease, onInvite }: PlayerModalProps) {
    const [formData, setFormData] = useState<Player | null>(null);

    // Invite State
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteMessage, setInviteMessage] = useState('');

    useEffect(() => {
        setFormData(player);
        if (player && player.status === 'linkless') {
            const firstName = player.name.split(' ')[0];
            const club = teamName || 'Pitch Engine';
            setInviteMessage(`Hey ${formatName(firstName)} come join ${club} over at Pitch Engine`);
            setInviteEmail('');
        }
    }, [player, teamName]);

    if (!isOpen || !formData) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (onInvite) {
            onInvite(inviteEmail, inviteMessage);
            onClose();
        }
    };

    const isLinkless = formData.status === 'linkless';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl my-8">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0A0A0A] z-10 rounded-t-2xl">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-display font-bold italic text-white uppercase tracking-tighter">Player Profile</h3>
                            {!isLinkless ? (
                                <span className="flex items-center space-x-1 px-2 py-0.5 bg-wts-green/10 text-wts-green rounded text-[9px] font-bold uppercase tracking-widest border border-wts-green/20">
                                    <CheckCircle2 size={10} />
                                    <span>Active</span>
                                </span>
                            ) : (
                                <span className="flex items-center space-x-1 px-2 py-0.5 bg-gray-800 text-gray-400 rounded text-[9px] font-bold uppercase tracking-widest border border-white/10">
                                    <AlertCircle size={10} />
                                    <span>Unlinked</span>
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">ID: {formData.id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* EDIT FORM */}
                    <form id="edit-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50 font-bold"
                                />
                            </div>

                            {/* Number */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Squad Number</label>
                                <input
                                    type="number"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50 font-mono"
                                />
                            </div>

                            {/* Position */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Position</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role, position: e.target.value as Role })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50"
                                >
                                    {['GK', 'LB', 'CB', 'RB', 'LM', 'CM', 'CDM', 'CAM', 'RM', 'LW', 'RW', 'CF', 'ST'].map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Preferred Foot */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preferred Foot</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Left', 'Right', 'Both'].map((foot) => (
                                        <button
                                            key={foot}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, preferredFoot: foot as any })}
                                            className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-colors ${formData.preferredFoot === foot
                                                ? 'bg-wts-green text-black border-wts-green'
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                                }`}
                                        >
                                            {foot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Leadership & Permissions */}
                            <div className="col-span-2 space-y-4 pt-2 border-t border-white/5">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Captaincy */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Captaincy</label>
                                        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, captain: false, viceCaptain: false })}
                                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${!formData.captain && !formData.viceCaptain
                                                    ? 'bg-gray-600 text-white'
                                                    : 'text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                None
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, captain: true, viceCaptain: false })}
                                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${formData.captain
                                                    ? 'bg-wts-green text-black shadow-sm'
                                                    : 'text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                C
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, captain: false, viceCaptain: true })}
                                                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${formData.viceCaptain
                                                    ? 'bg-wts-green text-black shadow-sm'
                                                    : 'text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                VC
                                            </button>
                                        </div>
                                    </div>

                                    {/* Admin */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Club Roles</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isAdmin: !formData.isAdmin })}
                                            className={`w-full py-2.5 px-3 rounded-lg border flex items-center justify-center space-x-2 transition-all ${formData.isAdmin
                                                ? 'bg-red-500/10 border-red-500 text-red-500'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <Shield size={14} className={formData.isAdmin ? 'fill-current' : ''} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                                {formData.isAdmin ? 'Secretary' : 'Make Secretary'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Are you sure you want to release this player? This action cannot be undone.')) {
                                        onRelease(formData.id);
                                        onClose();
                                    }
                                }}
                                className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center space-x-2"
                            >
                                <Trash2 size={16} />
                                <span>Release</span>
                            </button>

                            <button
                                type="submit"
                                form="edit-form"
                                className="flex-1 px-6 py-4 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 hover:border-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
                            >
                                <Save size={16} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>

                    {/* INVITE SECTION (Only for Linkless) */}
                    {isLinkless && (
                        <div className="pt-8 border-t border-white/5 space-y-4 animate-in slide-in-from-bottom-2">
                            <div className="flex items-center space-x-2">
                                <Mail size={16} className="text-wts-green" />
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Invite to Club</h4>
                            </div>
                            <p className="text-xs text-gray-500">
                                This player hasn&apos;t linked their account yet. Send them an invite to join <strong>{teamName || 'the club'}</strong>.
                            </p>

                            <form onSubmit={handleInvite} className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50 placeholder:text-white/20"
                                        placeholder={`${formData.name.toLowerCase().replace(' ', '.')}@example.com`}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message</label>
                                    <textarea
                                        value={inviteMessage}
                                        onChange={(e) => setInviteMessage(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-wts-green/50 min-h-[60px] text-sm"
                                        placeholder="Join us..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-wts-green text-black rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Mail size={14} />
                                    <span>Send Invitation</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
