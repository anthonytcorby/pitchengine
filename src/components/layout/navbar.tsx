'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useLanguage();

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    const navItems = [
        { label: t('landing.nav.features'), href: '/#features' },
        { label: t('landing.nav.pricing'), href: '/pricing' },
        { label: t('landing.nav.about'), href: '/about' },
        { label: t('landing.nav.contact'), href: '/contact' }
    ];

    return (
        <>
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-wts-dark/80 backdrop-blur-md safe-top">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group z-50 relative">

                        <span className="font-outfit font-bold text-lg tracking-widest text-white group-hover:text-wts-green transition-colors uppercase">
                            PITCH ENGINE
                        </span>
                    </Link>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/login"
                            className="text-xs font-bold tracking-widest text-gray-400 hover:text-white transition-colors uppercase font-outfit"
                        >
                            {t('common.login')}
                        </Link>
                        <Link href="/onboarding?mode=create">
                            <Button variant="secondary" size="sm" className="skew-x-[-10deg]">
                                <span className="skew-x-[10deg]">{t('landing.nav.start_club').toUpperCase()}</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden relative z-50 p-2 text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-300 md:hidden flex flex-col items-center justify-center space-y-8 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <nav className="flex flex-col items-center space-y-6 text-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-3xl font-display font-bold italic text-white hover:text-wts-green transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label.toUpperCase()}
                        </Link>
                    ))}
                    <div className="w-12 h-px bg-white/10 my-4" />
                    <Link
                        href="/login"
                        className="text-sm font-bold tracking-widest text-gray-400 uppercase font-outfit"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        {t('common.login').toUpperCase()}
                    </Link>
                    <Link href="/onboarding?mode=create" className="w-full">
                        <Button
                            size="lg"
                            className="w-full skew-x-[-10deg] mt-4"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span className="skew-x-[10deg]">{t('landing.nav.start_free_club').toUpperCase()}</span>
                        </Button>
                    </Link>
                </nav>
            </div>
        </>
    );
}
