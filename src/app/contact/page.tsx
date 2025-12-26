'use client';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-black selection:bg-wts-green selection:text-black">
            <Navbar />

            <div className="relative pt-32 pb-20">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <span className="text-wts-green text-xs font-bold tracking-[0.3em] uppercase block mb-4 font-mono">
                                GET IN TOUCH
                            </span>
                            <h1 className="text-4xl md:text-6xl font-display font-bold italic uppercase tracking-tighter text-white">
                                CONTACT SUPPORT
                            </h1>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors text-center">
                                <div className="w-12 h-12 bg-wts-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-wts-green">
                                    <Mail size={24} />
                                </div>
                                <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-2">Email Us</h3>
                                <div className="flex items-center justify-center space-x-3">
                                    <Mail className="text-wts-green" size={20} />
                                    <p className="text-gray-400 text-sm">support@pitchengine.com</p>
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors text-center">
                                <div className="w-12 h-12 bg-wts-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-wts-green">
                                    <MessageSquare size={24} />
                                </div>
                                <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-2">Live Chat</h3>
                                <p className="text-gray-400 text-sm">Available Mon-Fri, 9am-5pm</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors text-center">
                                <div className="w-12 h-12 bg-wts-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-wts-green">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="font-bold text-white uppercase tracking-widest text-sm mb-2">Office</h3>
                                <p className="text-gray-400 text-sm">London, United Kingdom</p>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12">
                            <h2 className="text-2xl font-display font-bold italic text-white mb-6">SEND A MESSAGE</h2>
                            <form className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</label>
                                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-wts-green/50 transition-colors" placeholder="Your name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email</label>
                                        <input type="email" className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-wts-green/50 transition-colors" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message</label>
                                    <textarea rows={5} className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-wts-green/50 transition-colors" placeholder="How can we help?" />
                                </div>
                                <Button className="w-full md:w-auto px-8 py-6 text-sm font-bold tracking-widest uppercase">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </Container>
            </div>

            <Footer />
        </main>
    );
}
