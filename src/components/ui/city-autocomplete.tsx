'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { CITIES } from '@/data/cities';
import { MapPin } from 'lucide-react';

interface CityAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function CityAutocomplete({ value, onChange, placeholder, className }: CityAutocompleteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);

    // Sync input value if external value changes (e.g. initial load)
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Filter cities based on input
    const filteredCities = useMemo(() => {
        if (!inputValue || inputValue.length < 2) return [];
        const lower = inputValue.toLowerCase();
        return CITIES.filter(city => city.toLowerCase().includes(lower)).slice(0, 5); // Limit to 5 results
    }, [inputValue]);

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // Ensure the parent gets the current input value properly committed even if not selected from list
                // (Already handled by onChange in input, but just closing cleanup)
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

    const handleSelect = (city: string) => {
        setInputValue(city);
        onChange(city);
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

            {isOpen && filteredCities.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[200px] overflow-y-auto custom-scrollbar">
                    {filteredCities.map((city) => (
                        <button
                            key={city}
                            onClick={() => handleSelect(city)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2 border-b border-white/5 last:border-0"
                        >
                            <MapPin size={14} className="text-wts-green" />
                            <span className="font-bold uppercase tracking-wide">{city}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
