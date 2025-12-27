import { User, Team, Player, Fixture, Availability, Fee, Tactic, AuditLog, Notification } from '../types/schema';
import { TEAMSHEET, MATCH_DATA } from '../lib/mock-data';
import { auth, INTERNAL_TEST_MODE } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { createUserProfile, getUserTeams, createTeam, getTeamMatches, setAvailability } from '@/lib/db';

// --- SERVICE ---

class ApiService {

    // --- AUTH ---

    async getCurrentUser(): Promise<User> {
        if (INTERNAL_TEST_MODE) {
            return Promise.resolve({
                id: "internal-test",
                email: "internal@test.local",
                role: "MANAGER",
                subscriptionTier: "PRO",
                // teamId removed to simulate new user without team
            });
        }

        return new Promise((resolve, reject) => {
            if (!auth) {
                reject("Auth not initialized");
                return;
            }
            const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
                unsubscribe();
                if (user) {
                    const mappedUser: User = {
                        id: user.uid,
                        email: user.email || '',
                        role: 'MANAGER',
                        subscriptionTier: 'FREE',
                        teamId: 'team-wts'
                    };

                    try {
                        await createUserProfile(mappedUser);
                    } catch (e) {
                        console.warn("Failed to create user profile", e);
                    }

                    resolve(mappedUser);
                } else {
                    reject('No user logged in');
                }
            }, reject);
        });
    }

    // --- DATA ---

    async getTeam(teamId: string): Promise<Team | null> {
        // In a real app we'd fetch specific team. 
        // For this step, let's try to get teams for the user and return the first one matches ID, or all.
        // But `getTeam` takes an ID. 
        // Let's use the helper `getUserTeams` if we knew the user ID, but we don't have it in context easily without fetching user again.
        // So strict helper usage might be tricky without modifying method signatures.
        // We'll stick to mock for getTeam temporarily OR assume we can fetch all and filter.
        // Actually, db.ts is missing `getTeamById`. I will skip replacing this specific one to avoid over-engineering beyond the prompt's requested helpers.
        return {
            id: teamId,
            name: 'PITCH ENGINE',
            managerId: 'user-1',
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
            defaultFee: 5,
            feeGenerationMode: 'creation'
        };
    }

    async updateTeam(teamId: string, data: Partial<Team>): Promise<Team> {
        return {
            id: teamId,
            name: 'PITCH ENGINE',
            managerId: 'user-1',
            primaryColor: '#000000',
            secondaryColor: '#ffffff',
            defaultFee: 5,
            feeGenerationMode: 'creation',
            ...data
        };
    }

    async getSquad(teamId: string): Promise<Player[]> {
        if (typeof window === 'undefined') return [];

        try {
            // Read from Onboarding storage as the "source of truth" for this prototype
            // NEW: Try reading from permanent squad data first (post-onboarding)
            const permanentStored = localStorage.getItem('wts-squad-data');
            let onboardingPlayers = [];
            let managerName = '';
            let managerNationality = 'gb-eng';

            if (permanentStored) {
                // If we have permanent data, use it directly. This is the source of truth after onboarding.
                onboardingPlayers = JSON.parse(permanentStored);
                // In permanent storage, manager is already in the list (usually index 0)
            } else {
                // Fallback to onboarding progress (during onboarding)
                const stored = localStorage.getItem('wts-onboarding-progress-v2'); // Use v2 key from recent fix
                if (stored) {
                    const parsed = JSON.parse(stored);
                    onboardingPlayers = parsed.data?.players || [];
                    managerName = parsed.data?.playerName;
                    managerNationality = parsed.data?.playerNationality;
                }
            }

            if (onboardingPlayers.length > 0) {
                // Map to Schema Player
                return onboardingPlayers.map((p: any, index: number) => ({
                    id: `p-${index}`, // Simple ID generation
                    teamId: teamId,
                    name: p.name,
                    number: index + 1, // Assign shirt numbers 1..N
                    role: (p.position || 'MID') as any, // Cast to Role
                    position: (p.position || 'MID') as any,
                    // Use stored nationality if available (mostly for 'Me' player), otherwise default. 
                    nationality: (p.name === managerName && managerName) ? (managerNationality || 'gb-eng') : (p.nationality || 'gb-eng'),
                    status: (p.name === managerName && managerName) ? 'active' : 'linkless',
                    preferredFoot: 'Right',
                    captain: !!p.captain,
                    reliability: 100, // New team = 100%
                    attendance: 100,
                    preferred: false,
                    reliabilityHistory: [],
                    stats: { appearances: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, motm: 0 }
                }));
            }
        } catch (e) {
            console.error("Failed to read squad from storage", e);
        }

        return [];
    }

    async getFixtures(teamId: string): Promise<Fixture[]> {
        // Use Firestore helper
        try {
            return await getTeamMatches(teamId);
        } catch (e) {
            console.warn("Firestore fetch failed, falling back to mock (empty)", e);
            return []; // Wiped mock data
        }
    }

    // --- WRITE ---

    async createPlayer(player: Omit<Player, 'id' | 'teamId'>): Promise<Player> {
        return { ...player, id: 'new-player', teamId: 'team-wts' } as Player;
    }

    async updatePlayer(player: Player): Promise<Player> {
        return player;
    }

    async deletePlayer(playerId: string): Promise<void> {
        return;
    }

    async createFixture(fixture: any): Promise<Fixture> {
        // Could use `addDoc` to matches collection here, but prompt didn't strictly ask for `createFixture` helper.
        return { ...fixture, id: 'new-fixture' };
    }

    async getAvailability(fixtureId?: string, playerId?: string): Promise<any[]> {
        return [];
    }

    async updateAvailability(availabilityId: string, status: 'in' | 'out' | 'pending'): Promise<any> {
        // Use the helper if we had matchId and userId. availabilityId wraps it.
        // setAvailability(matchId, userId, status)
        // Since we don't have matchId/userId here easily, we'd need to fetch the availability doc first.
        return { id: availabilityId, status };
    }

    // ... Keep rest mocked ...
    async updateFixtureStatus(fixtureId: string, status: string): Promise<Fixture> {
        return { id: fixtureId, status } as any;
    }

    async startMatchday(fixtureId: string): Promise<Fixture> {
        return { id: fixtureId } as any;
    }

    async getFees(playerId?: string, fixtureId?: string): Promise<any[]> {
        return [];
    }

    async payFee(feeId: string, method: string, reason?: string): Promise<any> {
        return { id: feeId, paid: true };
    }

    async updateFee(feeId: string, data: Partial<any>): Promise<any> {
        return { id: feeId, ...data };
    }

    async getTactics(fixtureId?: string): Promise<any> {
        return null;
    }

    async getTacticsSuggestions(fixtureId: string): Promise<any[]> {
        return [];
    }

    async saveTactics(tactic: any): Promise<any> {
        return tactic;
    }

    async getStats(fixtureId?: string): Promise<any[]> {
        return [];
    }

    async saveStats(stats: any | any[]): Promise<any> {
        return stats;
    }

    async completeFixture(fixtureId: string, result: { resultHome: number, resultAway: number }): Promise<Fixture> {
        return { id: fixtureId, status: 'completed', ...result } as any;
    }

    async getAuditLogs(): Promise<AuditLog[]> {
        return [];
    }

    async getNotifications(userId?: string): Promise<Notification[]> {
        return [];
    }
}

export const api = new ApiService();

