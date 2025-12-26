import { useLocalStorage } from './use-local-storage';

export type TeamSize = 5 | 6 | 7 | 11;
export type OnboardingRole = 'MANAGER' | 'PLAYER' | null;

export interface OnboardingData {
    // Manager Data
    clubName: string;
    teamSize: TeamSize;
    location: string;
    players: { name: string; position: string; captain?: boolean }[];
    defaultFee: number;
    kickoffTime: string;
    venue: string;
    league: string;
    fixtureId?: string;

    // Player Data
    playerName: string;
    playerPosition: string;
    playerAvailability: string;
}

export interface OnboardingState {
    step: number;
    role: OnboardingRole;
    completed: boolean;
    data: OnboardingData;
}

const INITIAL_STATE: OnboardingState = {
    step: 0, // 0 = Role Selection
    role: null,
    completed: false,
    data: {
        clubName: '',
        teamSize: 11,
        location: '',
        players: [],
        defaultFee: 5,
        kickoffTime: '19:00',
        venue: '',
        league: '',
        // Player
        playerName: '',
        playerPosition: 'MID',
        playerAvailability: 'Available'
    }
};

export function useOnboarding() {
    const [state, setState] = useLocalStorage<OnboardingState>('wts-onboarding-progress', INITIAL_STATE);

    const setRole = (role: OnboardingRole) => {
        setState((prev) => ({
            ...prev,
            role
        }));
    };

    const updateData = (updates: Partial<OnboardingData>) => {
        setState((prev) => ({
            ...prev,
            data: { ...prev.data, ...updates }
        }));
    };

    const nextStep = () => {
        setState((prev) => ({
            ...prev,
            step: prev.step + 1
        }));
    };

    const prevStep = () => {
        setState((prev) => ({
            ...prev,
            step: Math.max(0, prev.step - 1)
        }));
    };

    const setStep = (step: number) => {
        setState((prev) => ({
            ...prev,
            step
        }));
    };

    const completeOnboarding = () => {
        setState((prev) => ({
            ...prev,
            completed: true
        }));
    };

    const resetOnboarding = () => {
        setState(INITIAL_STATE);
    };

    return {
        state,
        setRole,
        updateData,
        nextStep,
        prevStep,
        setStep,
        completeOnboarding,
        resetOnboarding
    };
}
