'use client';

import { useOnboarding } from '@/hooks/use-onboarding';
import { OnboardingSteps } from '@/components/onboarding/onboarding-steps';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense, useState } from 'react';

function OnboardingContent() {
    const { state, setRole, updateData, nextStep, prevStep, setStep, completeOnboarding, resetOnboarding, isLoaded } = useOnboarding();
    const router = useRouter();

    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');

    const [isReadyForRedirect, setIsReadyForRedirect] = useState(mode !== 'create');

    // Reset onboarding if mode=create
    useEffect(() => {
        if (mode === 'create' && isLoaded) { // Only reset if we know we loaded
            resetOnboarding();
            // Allow state to update before enabling redirect
            // checking state.step === 0 might be safer but this should work with the render cycle
            setIsReadyForRedirect(true);
        } else if (mode !== 'create') {
            setIsReadyForRedirect(true);
        }
    }, [mode, resetOnboarding, isLoaded]);

    // Check completion
    useEffect(() => {
        // Only redirect if loaded, completed, AND we assume the reset has been handled (isReady)
        if (isLoaded && state.completed && isReadyForRedirect) {
            router.push('/dashboard');
        }
    }, [state.completed, router, isReadyForRedirect, isLoaded]);

    if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center text-wts-green font-mono text-xs">LOADING...</div>;

    return (
        <OnboardingSteps
            currentStep={state.step}
            role={state.role}
            data={state.data}
            onSetRole={setRole}
            onUpdate={updateData}
            onNext={nextStep}
            onBack={prevStep}
            onFinish={completeOnboarding}
            onSetStep={setStep}
        />
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <OnboardingContent />
        </Suspense>
    );
}
