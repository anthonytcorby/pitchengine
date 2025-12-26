import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatName(name: string): string {
    if (!name || typeof name !== 'string') return '';
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper to get unique short names for the squad
export function getPlayerDisplayNames(players: any[]): Record<string, string> {
    const nameMap: Record<string, string> = {};
    const usedNames = new Map<string, number>();

    // First pass: Count occurrences of last names
    players.forEach(p => {
        const lastName = formatName(p.name).split(' ').pop() || '';
        usedNames.set(lastName, (usedNames.get(lastName) || 0) + 1);
    });

    // Second pass: Assign names
    players.forEach(p => {
        const formatted = formatName(p.name);
        const parts = formatted.split(' ');
        const lastName = parts.pop() || '';
        const firstName = parts[0] || '';

        // If duplicate last name, use F. Lastname
        if ((usedNames.get(lastName) || 0) > 1) {
            nameMap[p.id] = `${firstName.charAt(0)}. ${lastName}`;
        } else {
            nameMap[p.id] = lastName || firstName;
        }
    });

    return nameMap;
}
