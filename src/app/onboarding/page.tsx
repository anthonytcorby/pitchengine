'use client';

import { useOnboarding } from '@/hooks/use-onboarding';
import { OnboardingSteps } from '@/components/onboarding/onboarding-steps';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function OnboardingContent() {
    const { state, setRole, updateData, nextStep, prevStep, setStep, completeOnboarding, resetOnboarding } = useOnboarding();
    const router = useRouter();

    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');

    // Reset onboarding if mode=create
    useEffect(() => {
        if (mode === 'create') {
            resetOnboarding();
        }
    }, [mode, resetOnboarding]);

    // Check completion (only if NOT in create mode or after reset)
    useEffect(() => {
        // If we are in create mode, we shouldn't redirect even if state says completed 
        // (though resetOnboarding should handle this, the React state update might lag slightly)
        if (state.completed && mode !== 'create') {
            router.push('/dashboard');
        }
    }, [state.completed, router, mode]);

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
