import { User, Team, Player, Fixture, Availability, Fee, Tactic, AuditLog, Notification } from '../types/schema';
import { TEAMSHEET, MATCH_DATA } from '../lib/mock-data'; // Need to update imports if paths differ, checked file structure seems okay.
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// --- SERVICE ---

class ApiService {

    // --- AUTH ---

    async getCurrentUser(): Promise<User> {
        return new Promise((resolve, reject) => {
            const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
                unsubscribe();
                if (user) {
                    resolve({
                        id: user.uid,
                        email: user.email || '',
                        name: user.displayName || 'Manager',
                        teamId: 'team-wts', // Default for mock
                        role: 'MANAGER',
                        createdAt: user.metadata.creationTime || new Date().toISOString()
                    });
                } else {
                    // For "public" access or redirect, we might return a guest user or reject.
                    // The app expects a user object often. 
                    // Let's resolve null/guest or handle it.  
                    // Existing app logic seems to expect a user object or throws error. 
                    // But if not logged in, we might want to return null? 
                    // The signature says Promise<User>. 
                    // Let's return a "Guest" user if not logged in, or handle auth redirects at page level.
                    // However, to satisfy "Auth state resolves correctly", we should respect Firebase state.
                    // If no user, maybe we reject?
                    reject('No user logged in');
                }
            }, reject);
        });
    }

    // --- DATA (MOCKED) ---

    async getTeam(teamId: string): Promise<Team | null> {
        return {
            id: teamId,
            name: 'PITCH ENGINE',
            managerId: 'user-1',
            createdAt: new Date().toISOString()
        };
    }

    async updateTeam(teamId: string, data: Partial<Team>): Promise<Team> {
        // Mock update
        return {
            id: teamId,
            name: data.name || 'PITCH ENGINE',
            managerId: 'user-1',
            createdAt: new Date().toISOString()
        };
    }

    async getSquad(teamId: string): Promise<Player[]> {
        return TEAMSHEET as any; // Cast if type mismatch
    }

    async getFixtures(teamId: string): Promise<Fixture[]> {
        return [{
            id: 'fix-1',
            teamId: teamId,
            opponent: MATCH_DATA.opponent,
            date: '2025-12-31',
            time: MATCH_DATA.time,
            venue: MATCH_DATA.venue,
            type: 'LEAGUE',
            status: 'upcoming',
            resultHome: null,
            resultAway: null
        }] as any;
    }

    // --- WRITE (MOCKED) ---

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
        return { ...fixture, id: 'new-fixture' };
    }

    async getAvailability(fixtureId?: string, playerId?: string): Promise<any[]> {
        return [];
    }

    async updateAvailability(availabilityId: string, status: 'in' | 'out' | 'pending'): Promise<any> {
        return { id: availabilityId, status };
    }

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

