'use client';

import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface LanguageSelectionScreenProps {
    onNext: () => void;
}

export function LanguageSelectionScreen({ onNext }: LanguageSelectionScreenProps) {
    const { setLanguage } = useLanguage();

    const languages = [
        { code: 'en', label: 'English (UK)', flag: 'gb' },
        { code: 'fr', label: 'Français', flag: 'fr' },
        { code: 'es', label: 'Español', flag: 'es' },
        { code: 'pt', label: 'Português', flag: 'pt' }
    ];

    const handleSelect = (langCode: any) => {
        setLanguage(langCode);
        onNext();
    };

    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold italic uppercase tracking-tighter text-white mb-4">
                    Select Language
                </h1>
                <p className="text-gray-500 text-lg">
                    Which language do you prefer?
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleSelect(lang.code)}
                        className="group relative flex items-center p-6 bg-black/40 hover:bg-black/60 border border-white/10 hover:border-wts-green/50 rounded-2xl transition-all text-left"
                    >
                        {/* Flag Method matching Player Modal: remote generic flag CDN used elsewhere in app */}
                        <div className="relative w-12 h-8 rounded shadow-lg overflow-hidden mr-6 grayscale group-hover:grayscale-0 transition-all">
                            <Image
                                src={`https://flagcdn.com/w80/${lang.flag}.png`}
                                alt={lang.label}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>

                        <div className="flex-1">
                            <span className="text-xl font-display font-bold italic uppercase tracking-tighter text-white group-hover:text-wts-green transition-colors">
                                {lang.label}
                            </span>
                        </div>

                        <ArrowRight className="text-gray-600 group-hover:text-wts-green transform group-hover:translate-x-1 transition-all" />
                    </button>
                ))}
            </div>
        </div>
    );
}
