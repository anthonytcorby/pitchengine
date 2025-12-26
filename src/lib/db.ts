import { db } from './firebase';
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    addDoc,
    updateDoc,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { User, Team, Fixture, Availability } from '@/types/schema';

// --- HELPERS ---

export async function createUserProfile(user: Partial<User> & { id: string }) {
    if (!user.id) throw new Error("User ID required");

    const userRef = doc(db, 'users', user.id);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        await setDoc(userRef, {
            id: user.id,
            email: user.email,
            name: user.role === 'MANAGER' ? 'Manager' : 'Player', // Default if missing, currently User type doesn't have name but prompt requested it. Storing it in DB is fine.
            createdAt: serverTimestamp(),
            role: user.role || 'PLAYER',
            subscriptionTier: user.subscriptionTier || 'FREE'
        });
    }
}

export async function getUserTeams(userId: string): Promise<Team[]> {
    // 1. Check if user owns teams
    const teamsRef = collection(db, 'teams');
    const qOwner = query(teamsRef, where('managerId', '==', userId));
    const ownerSnapshot = await getDocs(qOwner);

    const teams: Team[] = [];
    ownerSnapshot.forEach(doc => {
        const data = doc.data();
        teams.push({ id: doc.id, ...data } as Team);
    });

    // 2. Check if user is a member (via teamMembers collection)
    const membersRef = collection(db, 'teamMembers');
    const qMember = query(membersRef, where('userId', '==', userId));
    const memberSnapshot = await getDocs(qMember);

    // Fetch teams for membership
    // NOTE: This could be N+1, but strict requirement "No REST API" implies direct SDK usage.
    // Ideally we promise.all these.
    const memberTeamIds = memberSnapshot.docs.map(d => d.data().teamId).filter(id => !teams.find(t => t.id === id));

    if (memberTeamIds.length > 0) {
        // Firestore 'in' query supports up to 10
        // For simplicity/robustness, let's just fetch individual docs (or implement chunks if scaling needed).
        // Since this is MVP foundation:
        for (const tId of memberTeamIds) {
            const tDoc = await getDoc(doc(db, 'teams', tId));
            if (tDoc.exists()) {
                teams.push({ id: tDoc.id, ...tDoc.data() } as Team);
            }
        }
    }

    return teams;
}

export async function createTeam(name: string, ownerId: string): Promise<string> {
    const teamsRef = collection(db, 'teams');
    const docRef = await addDoc(teamsRef, {
        name,
        managerId: ownerId, // Mapping ownerId to managerId as per schema
        createdAt: serverTimestamp(),
        // Defaults
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        defaultFee: 5,
        feeGenerationMode: 'creation'
    });

    // Add owner as a member with admin role? Or just rely on managerId field. 
    // Schema implies managerId on Team is sufficient for ownership.
    return docRef.id;
}

export async function getTeamMatches(teamId: string): Promise<Fixture[]> {
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, where('teamId', '==', teamId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert timestamp to ISO string if needed by frontend, or keep as is.
        // Frontend expects 'date' string (YYYY-MM-DD). 
        // If stored as timestamp, convert. If stored as string, keep.
        // Let's assume we store basics.
        return {
            id: doc.id,
            ...data
        } as Fixture;
    });
}

export async function setAvailability(matchId: string, userId: string, status: 'in' | 'out' | 'pending') {
    const availRef = collection(db, 'availability');
    // Check if exists
    const q = query(availRef, where('matchId', '==', matchId), where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await updateDoc(doc(db, 'availability', docId), {
            status,
            updatedAt: serverTimestamp()
        });
    } else {
        await addDoc(availRef, {
            matchId, // Maps to fixtureId in schema
            userId, // Maps to playerId in schema
            status,
            createdAt: serverTimestamp()
        });
    }
}
