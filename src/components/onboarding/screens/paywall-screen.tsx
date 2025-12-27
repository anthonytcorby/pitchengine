import { OnboardingData } from '@/hooks/use-onboarding';
import { useLanguage } from '@/hooks/use-language';
import { ShieldCheck, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaywallScreenProps {
    data: OnboardingData;
    onUpdate: (data: Partial<OnboardingData>) => void;
    onNext: () => void;
}

export const PaywallScreen = ({ data, onUpdate, onNext }: PaywallScreenProps) => {
    const { t } = useLanguage();
    const router = useRouter();

    const handleStartTrial = () => {
        // Simulate trial creation
        const trialStartsAt = Date.now();
        const trialEndsAt = trialStartsAt + (7 * 24 * 60 * 60 * 1000); // 7 days

        onUpdate({
            trialStatus: 'active',
            trialEndsAt: trialEndsAt
        });

        // Proceed to next step
        onNext();
    };

    const handleExit = () => {
        router.push('/');
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="mb-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 mx-auto bg-wts-green/10 rounded-full flex items-center justify-center mb-6 border border-wts-green/20">
                    <ShieldCheck className="w-10 h-10 text-wts-green" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold italic uppercase tracking-tighter text-white mb-4 leading-[0.9]">
                    {t('onboarding.paywall_title')}
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    {t('onboarding.paywall_body')}
                </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                <div className="flex items-end justify-center mb-2">
                    <span className="text-3xl font-bold text-white tracking-tight">{t('onboarding.paywall_pricing')}</span>
                </div>
                <div className="text-center text-sm text-gray-400 font-medium uppercase tracking-widest mb-6">
                    {t('onboarding.paywall_cancel')}
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-wts-green shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Management Dashboard</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-wts-green shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Unlimited Players</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-wts-green shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">Automated Payments</span>
                    </div>
                </div>

                <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                        {t('onboarding.paywall_surcharge')}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleStartTrial}
                    className="w-full py-4 bg-wts-green hover:bg-white text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(0,255,65,0.2)] hover:shadow-[0_0_30px_rgba(0,255,65,0.4)]"
                >
                    {t('onboarding.paywall_cta_primary')}
                </button>

                <button
                    onClick={handleExit}
                    className="w-full py-3 text-gray-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
                >
                    {t('onboarding.paywall_cta_secondary')}
                </button>
            </div>
        </div>
    );
};
