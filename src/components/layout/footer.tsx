import { Container } from '@/components/ui/container';
import { Globe, Twitter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
    return (
        <footer className="bg-black/40 border-t border-white/5 py-12 backdrop-blur-sm">
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/pitchengine-logo-v2.png"
                                alt="Pitch Engine Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="font-outfit font-bold text-lg text-white tracking-widest uppercase">PITCH ENGINE</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center space-x-8 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                        <Link href="/login" className="hover:text-white transition-colors">LOG IN</Link>
                        <Link href="/#features" className="hover:text-white transition-colors">PRODUCT</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">TERMS</Link>
                        <Link href="/pricing" className="hover:text-white transition-colors">PRICING</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">CONTACT</Link>
                    </div>

                    {/* Social */}
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                            <Globe size={14} />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                            <Twitter size={14} />
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center text-[10px] text-gray-800 font-mono">
                    © 2025 PITCH ENGINE SPORTS LTD. ALL RIGHTS RESERVED. BUILT FOR THE LOVE OF THE GAME.
                </div>
            </Container>
        </footer>
    );
}
