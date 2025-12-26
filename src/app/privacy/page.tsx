'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';

export default function PrivacyPage() {
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
                                PRIVACY POLICY
                            </h1>
                            <p className="text-sm font-mono text-gray-500 mb-8">
                                LAST UPDATED: DECEMBER 2024
                            </p>
                        </div>

                        <div className="prose prose-invert prose-green max-w-none text-gray-400 font-outfit">
                            <h3>1. Information We Collect</h3>
                            <p>
                                We collect information you provide directly to us, such as when you create an account, create a team, or communicate with us. This may include your name, email address, and team details.
                            </p>

                            <h3>2. How We Use Your Information</h3>
                            <p>
                                We use the information we collect to provide, maintain, and improve our services, including to process transactions, send you technical notices, and respond to your comments.
                            </p>

                            <h3>3. Team Data</h3>
                            <p>
                                Data related to your team (player names, stats, tactics) is private to your team and is not shared with other users unless explicitly enabled by you.
                            </p>

                            <h3>4. Cookies</h3>
                            <p>
                                We use cookies to store session information and verify your identity when you are logged in.
                            </p>

                            <h3>5. Security</h3>
                            <p>
                                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                            </p>

                            <h3>6. Contact Us</h3>
                            <p className="mt-8 text-sm text-gray-500">
                                If you have any questions about this Privacy Policy, please contact us at privacy@pitchengine.com.
                            </p>
                        </div>
                    </div>
                </Container>
            </div>

            <Footer />
        </main>
    );
}
