import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
            <h2 className="text-4xl font-display font-bold italic text-white uppercase mb-4">
                404 - Page Not Found
            </h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                The tactical board you are looking for has been erased.
            </p>
            <Link
                href="/"
                className="bg-wts-green text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center space-x-2"
            >
                <Home size={18} />
                <span>Return to Pitch</span>
            </Link>
        </div>
    );
}
