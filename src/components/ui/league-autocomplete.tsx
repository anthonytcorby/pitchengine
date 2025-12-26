'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { UK_LEAGUES } from '@/data/leagues';
import { Trophy } from 'lucide-react';

interface LeagueAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function LeagueAutocomplete({ value, onChange, placeholder, className }: LeagueAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Filter
    const filteredLeagues = useMemo(() => {
        if (!inputValue || inputValue.length < 1) return UK_LEAGUES;
        const lower = inputValue.toLowerCase();
        return UK_LEAGUES.filter(league => league.toLowerCase().includes(lower));
    }, [inputValue]);

    // Outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setInputValue(newVal);
        onChange(newVal);
        setIsOpen(true);
    };

    const handleSelect = (league: string) => {
        setInputValue(league);
        onChange(league);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className={className}
            />

            {isOpen && filteredLeagues.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar">
                    {filteredLeagues.map((league) => (
                        <button
                            key={league}
                            onClick={() => handleSelect(league)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2 border-b border-white/5 last:border-0"
                        >
                            <Trophy size={14} className="text-wts-green" />
                            <span className="font-bold uppercase tracking-wide">{league}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
