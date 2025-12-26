'use client';

import { useState, useEffect, useCallback } from 'react';
import { DICTIONARIES, Language } from '@/lib/i18n/dictionaries';

const LANGUAGE_KEY = 'wts-language';
const EVENT_KEY = 'language-change';

export function useLanguage() {
    // Initialize with safe default, effect will sync with localStorage
    const [language, setLanguageState] = useState<Language>('en');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Initial load
        const stored = window.localStorage.getItem(LANGUAGE_KEY);
        if (stored) {
            try {
                // Handle potential double quotes from JSON.stringify if used previously
                const parsed = JSON.parse(stored);
                if (['en', 'fr', 'es', 'pt'].includes(parsed)) {
                    setLanguageState(parsed as Language);
                } else if (['en', 'fr', 'es', 'pt'].includes(stored)) {
                    // handling raw string case just in case
                    setLanguageState(stored as Language);
                }
            } catch (e) {
                // If parse fails, it might be a raw string
                if (['en', 'fr', 'es', 'pt'].includes(stored)) {
                    setLanguageState(stored as Language);
                }
            }
        }

        // Listener for changes from other components
        const handleLanguageChange = (e: Event) => {
            const customEvent = e as CustomEvent<Language>;
            setLanguageState(customEvent.detail);
        };

        window.addEventListener(EVENT_KEY, handleLanguageChange);
        return () => window.removeEventListener(EVENT_KEY, handleLanguageChange);
    }, []);

    const setLanguage = useCallback((newLang: Language) => {
        // 1. Update Local Storage
        window.localStorage.setItem(LANGUAGE_KEY, JSON.stringify(newLang));

        // 2. Dispatch Event for other components
        window.dispatchEvent(new CustomEvent(EVENT_KEY, { detail: newLang }));
    }, []);

    // Translation function
    const t = (keyStr: string) => {
        const keys = keyStr.split('.');
        let current: any = DICTIONARIES[language];
        let fallback: any = DICTIONARIES['en'];

        for (const k of keys) {
            if (current && current[k] !== undefined) {
                current = current[k];
            } else {
                current = undefined;
            }

            if (fallback && fallback[k] !== undefined) {
                fallback = fallback[k];
            } else {
                fallback = undefined;
            }
        }

        return current || fallback || keyStr;
    };

    return {
        language,
        setLanguage,
        t,
        isClient
    };
}
