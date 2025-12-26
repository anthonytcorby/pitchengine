'use client';

import { useOnboarding } from '@/hooks/use-onboarding';
import { OnboardingSteps } from '@/components/onboarding/onboarding-steps';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function OnboardingPage() {
    const { state, setRole, updateData, nextStep, prevStep, setStep, completeOnboarding } = useOnboarding();
    const router = useRouter();

    // Check completion
    useEffect(() => {
        if (state.completed) {
            router.push('/dashboard');
        }
    }, [state.completed, router]);

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
