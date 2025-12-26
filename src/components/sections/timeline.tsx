import { Container } from '@/components/ui/container';

export function Timeline() {
    const steps = [
        { num: '1', title: 'SELECTION', image: 'bg-gradient-to-t from-black via-gray-900 to-gray-800' },
        { num: '2', title: 'MATCH DAY', image: 'bg-gradient-to-t from-black via-gray-900 to-gray-800' },
        { num: '3', title: 'DEBRIEF', image: 'bg-gradient-to-t from-black via-gray-900 to-gray-800' },
        { num: '4', title: 'CLUB FUND', image: 'bg-gradient-to-t from-black via-gray-900 to-gray-800' },
    ];

    return (
        <section className="py-24 overflow-hidden section-visibility">
            <Container>
                <div className="text-center mb-16">
                    <span className="text-wts-green text-xs font-bold tracking-widest uppercase mb-2 block font-outfit">MATCHDAY EXPERIENCE</span>
                    <h2 className="text-4xl md:text-6xl font-display font-bold italic uppercase text-white">THE COMPLETE SEASON</h2>
                    <p className="text-gray-500 mt-4 text-sm font-mono">From the Thursday night selection headache to the Sunday morning glory.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {steps.map((step, i) => (
                        <div
                            key={step.num}
                            style={{ animationDelay: `${(i + 1) * 100}ms` }}
                            className="group relative h-[250px] md:h-[400px] border border-white/10 rounded-lg overflow-hidden cursor-crosshair opacity-0 animate-fade-in-up"
                        >
                            {/* Background placeholder - would be images in real app */}
                            <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity ${step.image}`}></div>

                            {/* Big Number */}
                            <div className="absolute inset-x-0 bottom-12 flex justify-center items-end pointer-events-none">
                                <span className="text-[8rem] md:text-[12rem] leading-none font-display font-black text-white/5 group-hover:text-white/10 transition-colors select-none">
                                    {step.num}
                                </span>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-6 left-6">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-1.5 h-1.5 bg-wts-green rounded-full shadow-[0_0_5px_currentColor]"></div>
                                    <h3 className="text-xl font-display font-bold italic uppercase text-white tracking-wider">{step.title}</h3>
                                </div>
                            </div>

                            {/* Vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
