import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    OAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    UserCredential
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBo9U0eOwfvZeXCYH8C0AUD-Bchxdo8YL4",
    authDomain: "pitchengine-web.firebaseapp.com",
    projectId: "pitchengine-web",
    storageBucket: "pitchengine-web.firebasestorage.app",
    messagingSenderId: "540067058354",
    appId: "1:540067058354:web:211237d2fc87d66fb12fab"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { app }; // Export app to be used by DB

// --- Google Sign In ---

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error: any) {
        console.error("Google Auth Error:", {
            code: error.code,
            message: error.message,
            fullError: error
        });
        throw error;
    }
};

// --- Apple Sign In ---

export const signInWithApple = async () => {
    const provider = new OAuthProvider("apple.com");

    // Detect Safari
    const isSafari = typeof navigator !== 'undefined' &&
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    try {
        if (isSafari) {
            // Safari often blocks popups or has issues with them for Apple Sign In, use redirect
            await signInWithRedirect(auth, provider);
            // Redirect happens, function doesn't return immediately in current page context usually
        } else {
            const result = await signInWithPopup(auth, provider);
            return result.user;
        }
    } catch (error: any) {
        console.error("Apple Auth Error:", {
            code: error.code,
            message: error.message,
            fullError: error
        });
        throw error;
    }
};
