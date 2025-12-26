import { getFirestore } from 'firebase/firestore';
import { app, auth } from './auth';

// --- INTERNAL TEST MODE ---
export const INTERNAL_TEST_MODE = false;

// Export initialized instances
export { auth };
export const db = getFirestore(app);
