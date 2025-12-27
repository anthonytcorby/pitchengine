'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { COUNTRIES } from '@/data/countries';
import Image from 'next/image';

interface CountryAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

export function CountryAutocomplete({ value, onChange, placeholder = 'Select nationality...', label }: CountryAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedCountry = COUNTRIES.find(c => c.code === value);

    return (
        <div className="space-y-2 relative" ref={wrapperRef}>
            {label && <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>}

            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-wts-green/50 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center space-x-3">
                    {selectedCountry ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`https://flagcdn.com/24x18/${selectedCountry.code}.png`}
                                alt={selectedCountry.name}
                                className="w-5 h-auto rounded-sm"
                            />
                            <span className="font-medium text-sm">{selectedCountry.name}</span>
                        </>
                    ) : (
                        <span className="text-gray-500">{placeholder}</span>
                    )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-lg shadow-2xl max-h-[300px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-white/5">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                className="w-full bg-white/5 text-white pl-8 pr-4 py-2 rounded text-sm focus:outline-none focus:bg-white/10"
                                placeholder="Search countries..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                        {filteredCountries.map((country) => (
                            <button
                                key={country.code}
                                onClick={() => {
                                    onChange(country.code);
                                    setOpen(false);
                                    setSearch('');
                                }}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded text-sm text-left ${value === country.code ? 'bg-wts-green/10 text-wts-green' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={`https://flagcdn.com/24x18/${country.code}.png`}
                                    alt={country.name}
                                    className="w-5 h-auto rounded-sm shrink-0"
                                />
                                <span className="flex-1 truncate">{country.name}</span>
                                {value === country.code && (
                                    <Check className="h-4 w-4" />
                                )}
                            </button>
                        ))}
                        {filteredCountries.length === 0 && (
                            <div className="p-4 text-center text-xs text-gray-500 uppercase tracking-widest">
                                No countries found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
