import { Construction } from 'lucide-react';

interface ComingSoonProps {
    title: string;
    description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-wts-green/10 rounded-full flex items-center justify-center mb-6 border border-wts-green/20 shadow-[0_0_30px_-5px_theme(colors.wts.green)]">
                <Construction className="w-10 h-10 text-wts-green" />
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold italic uppercase tracking-tighter text-white mb-4">
                {title}
            </h2>

            <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed mb-8">
                {description}
            </p>

            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg">
                <span className="text-[10px] font-bold text-wts-green uppercase tracking-[0.2em]">
                    Coming Soon
                </span>
            </div>
        </div>
    );
}
