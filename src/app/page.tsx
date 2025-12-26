import { Navbar } from '@/components/layout/navbar';
import { Hero } from '@/components/sections/hero';
import { FeatureGrid } from '@/components/sections/feature-grid';
import { Timeline } from '@/components/sections/timeline';
import { FinalCTA } from '@/components/sections/final-cta';
import { Footer } from '@/components/layout/footer';

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-x-hidden selection:bg-wts-green selection:text-black">

            {/* Global Texture */}
            <div className="fixed inset-0 opacity-10 pointer-events-none -z-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-0">
                <Navbar />
                <Hero />
                <FeatureGrid />
                <Timeline />
                <FinalCTA />
                <Footer />
            </div>
        </main>
    );
}
