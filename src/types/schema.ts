export type Role = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'CF' | 'ST';

export type FixtureType = 'LEAGUE' | 'CUP' | 'FRIENDLY';
export type FixtureStatus = 'upcoming' | 'completed' | 'cancelled';

export type AvailabilityStatus = 'in' | 'out' | 'maybe' | 'pending';
export type FeeStatus = 'paid' | 'unpaid' | 'void' | 'pending'; // 'pending' for Stripe auth

// --- Entities ---

export interface User {
    id: string;
    email: string;
    role: 'MANAGER' | 'PLAYER';
    subscriptionTier: 'FREE' | 'PRO';
    teamId?: string; // Links manager/player to a team
}

export interface Team {
    id: string;
    managerId: string;
    name: string;
    primaryColor: string; // Hex code
    secondaryColor: string;
    defaultFee: number;
    feeGenerationMode: 'creation' | 'matchday-start'; // "Option A" vs "Option B"
    teamSize?: 5 | 6 | 7 | 11;
}

export interface Player {
    id: string; // UUID preferred for backend, but we might simulate numeric if needed. Stick to string for future proofing.
    teamId: string;
    name: string;
    number: number;
    role: Role;
    position: Role; // Often same as role, but kept distinct per docs
    nationality: string; // ISO-3166 code
    preferredFoot: 'Left' | 'Right' | 'Both';
    captain: boolean;
    reliability: number; // 0-100
    attendance: number; // 0-100 (Derived usually, but kept as field per docs)
    preferred: boolean; // "Pref" badge
    status?: 'active' | 'invited' | 'linkless';
    email?: string;
    reliabilityHistory: ReliabilityEvent[]; // Decay model history
    viceCaptain?: boolean;
    isAdmin?: boolean;
    stats?: PlayerStats;
}

export interface PlayerStats {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    motm: number;
}

export interface ReliabilityEvent {
    id: string;
    timestamp: string;
    type: 'played' | 'unused' | 'out_early' | 'out_late' | 'out_last_minute' | 'no_response';
    scoreChange: number; // The score impact used for calculation
}

export interface Fixture {
    id: string;
    teamId: string;
    opponent: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    venue: string;
    type: FixtureType;
    status: FixtureStatus;
    resultHome: number | null;
    resultAway: number | null;
    location: string;
    matchdayStartedAt?: string; // ISO, distinct from date/time. Triggers "Active" state.
}

export interface Availability {
    id: string;
    fixtureId: string;
    playerId: string;
    status: AvailabilityStatus;
}

export interface Fee {
    id: string;
    playerId: string;
    fixtureId?: string; // Optional if fee is generic, but usually per-match
    amount: number;
    status: FeeStatus;
    date: string; // YYYY-MM-DD
    paymentMethod?: 'CASH' | 'BANK' | 'STRIPE';
    stripePaymentIntentId?: string;
    reason?: string; // For manual overrides or specific notes
}

// --- App State Interfaces ---

export interface Tactic {
    id: string;
    teamId: string;
    fixtureId?: string; // If null, this is the Team Default tactic
    formation: string; // e.g., '4-4-2'
    lineup: Record<string, string>; // Map of Slot ID (or Index) -> Player ID
}

export interface Formation {
    id: string; // '4-4-2'
    name: string;
    positions: { x: number; y: number; role: Role }[];
}

export interface MatchStat {
    id: string;
    fixtureId: string;
    playerId: string;
    rating: number; // 0-10
    goals: number;
    assists: number;
    cleanSheet: boolean;
    motm: boolean;
}

export interface AuditLog {
    id: string;
    timestamp: string; // ISO
    actorId: string; // 'manager', 'admin', or userId
    action: string; // e.g., 'tactic.update', 'fee.void'
    targetId?: string;
    reason?: string;
    metadata?: any;
}

export interface Notification {
    id: string;
    userId: string; // Target
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: string;
    read: boolean;
}
