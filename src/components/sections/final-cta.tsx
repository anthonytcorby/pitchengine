import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Gamepad2, Trello } from 'lucide-react';

export function FinalCTA() {
    return (
        <section className="relative py-32 overflow-hidden flex items-center justify-center section-visibility">
            {/* Background glow center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-wts-green/5 blur-[120px] rounded-full point-events-none" />

            <Container className="relative z-10 text-center opacity-0 animate-fade-in-up">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#0A120A] border border-wts-green flex items-center justify-center shadow-[0_0_30px_rgba(0,255,65,0.2)]">
                        <Gamepad2 className="text-wts-green w-8 h-8" />
                    </div>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold italic uppercase leading-[0.9] mb-6">
                    <span className="text-white block">TAKE YOUR TEAM</span>
                    <span className="text-gray-600 block">TO THE NEXT</span>
                    <span className="text-gray-600 block">LEVEL.</span>
                </h2>

                <p className="text-gray-400 max-w-lg mx-auto mb-10 text-sm">
                    Join thousands of amateur managers reclaiming their spare time.<br />
                    It's free to start your club.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" className="w-full sm:w-auto skew-x-[-10deg] px-12">
                        <span className="skew-x-[10deg]">CREATE FREE CLUB</span>
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto skew-x-[-10deg] px-12 border-gray-700 text-gray-300 hover:text-white hover:border-white">
                        <span className="skew-x-[10deg]">VIEW DEMO</span>
                    </Button>
                </div>

                <p className="mt-12 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                    WEB APPLICATION OPTIMIZED FOR DESKTOP & MOBILE. IOS APP AVAILABLE MARCH.
                </p>
            </Container>
        </section>
    );
}
