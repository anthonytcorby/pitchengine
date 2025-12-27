import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Prevent hydration mismatch by only reading after mount
        try {
            const item = window.localStorage.getItem(key);
            if (item) {
                setStoredValue(JSON.parse(item));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoaded(true);
        }
    }, [key]);

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            setStoredValue(current => {
                const valueToStore = value instanceof Function ? value(current) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                return valueToStore;
            });
        } catch (error) {
            console.error(error);
        }
    }, [key]);

    return [storedValue, setValue, isLoaded] as const;
}
