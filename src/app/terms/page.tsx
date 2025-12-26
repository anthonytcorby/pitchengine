'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-black selection:bg-wts-green selection:text-black">
            <Navbar />

            <div className="relative pt-32 pb-20">
                <Container>
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div>
                            <span className="text-wts-green text-xs font-bold tracking-[0.3em] uppercase block mb-4 font-mono">
                                LEGAL
                            </span>
                            <h1 className="text-4xl md:text-5xl font-display font-bold italic uppercase tracking-tighter text-white mb-8">
                                TERMS OF SERVICE
                            </h1>
                            <p className="text-sm font-mono text-gray-500 mb-8">
                                LAST UPDATED: DECEMBER 2024
                            </p>
                        </div>

                        <div className="prose prose-invert prose-green max-w-none text-gray-400 font-outfit">
                            <h3>1. Acceptance of Terms</h3>
                            <p>
                                By accessing and using PITCHENGINE, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>

                            <h3>2. Club Management Services</h3>
                            <p>
                                We provide digital tools for sports team management. We are not responsible for the actual organization of events, safety of players, or financial transactions that occur offline.
                            </p>

                            <h3>3. User Accounts</h3>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility.
                            </p>

                            <h3>4. Payments & Subscriptions</h3>
                            <p>
                                Premium features are billed on a subscription basis. You may cancel your subscription at any time, but we do not offer refunds for partial months.
                            </p>

                            <h3>5. Data Usage</h3>
                            <p>
                                We use your data solely to provide and improve our services. We do not sell your personal data to third parties. See our Privacy Policy for more details.
                            </p>

                            <h3>6. Changes to Terms</h3>
                            <p>
                                We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.
                            </p>
                        </div>
                    </div>
                </Container>
            </div>

            <Footer />
        </main>
    );
}
