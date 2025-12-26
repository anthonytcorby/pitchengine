
export const FORMATIONS = {
    "4-2-3-1 Gegenpress": [
        { x: 50, y: 90, role: 'GK' },
        { x: 15, y: 70, role: 'LB' },
        { x: 38, y: 75, role: 'CB' },
        { x: 62, y: 75, role: 'CB' },
        { x: 85, y: 70, role: 'RB' },
        { x: 38, y: 55, role: 'CDM' },
        { x: 62, y: 55, role: 'CDM' },
        { x: 15, y: 35, role: 'AML' },
        { x: 50, y: 35, role: 'CAM' },
        { x: 85, y: 35, role: 'AMR' },
        { x: 50, y: 15, role: 'ST' },
    ],
    // ... existing formations kept for backward compatibility if needed, 
    // but ideally we migrate to FORMATIONS_BY_SIZE[11]
};

export const FORMATIONS_BY_SIZE: Record<number, Record<string, { x: number; y: number; role: string }[]>> = {
    11: {
        "4-4-2 Standard": [
            { x: 50, y: 90, role: 'GK' },
            { x: 15, y: 70, role: 'LB' }, { x: 38, y: 75, role: 'CB' }, { x: 62, y: 75, role: 'CB' }, { x: 85, y: 70, role: 'RB' },
            { x: 15, y: 45, role: 'LM' }, { x: 38, y: 50, role: 'CM' }, { x: 62, y: 50, role: 'CM' }, { x: 85, y: 45, role: 'RM' },
            { x: 40, y: 20, role: 'ST' }, { x: 60, y: 20, role: 'ST' },
        ],
        "4-4-2 Diamond (Narrow)": [
            { x: 50, y: 90, role: 'GK' },
            { x: 15, y: 70, role: 'LB' }, { x: 38, y: 75, role: 'CB' }, { x: 62, y: 75, role: 'CB' }, { x: 85, y: 70, role: 'RB' },
            { x: 50, y: 60, role: 'CDM' },
            { x: 35, y: 45, role: 'CM' }, { x: 65, y: 45, role: 'CM' },
            { x: 50, y: 30, role: 'CAM' },
            { x: 40, y: 15, role: 'ST' }, { x: 60, y: 15, role: 'ST' },
        ],
        "4-3-3 DM Wide": [
            { x: 50, y: 90, role: 'GK' },
            { x: 15, y: 70, role: 'LB' }, { x: 38, y: 75, role: 'CB' }, { x: 62, y: 75, role: 'CB' }, { x: 85, y: 70, role: 'RB' },
            { x: 50, y: 60, role: 'CDM' },
            { x: 35, y: 45, role: 'CM' }, { x: 65, y: 45, role: 'CM' },
            { x: 15, y: 25, role: 'LW' }, { x: 85, y: 25, role: 'RW' },
            { x: 50, y: 15, role: 'ST' },
        ],
        "4-2-3-1 Genpen": [
            { x: 50, y: 90, role: 'GK' },
            { x: 15, y: 70, role: 'LB' }, { x: 38, y: 75, role: 'CB' }, { x: 62, y: 75, role: 'CB' }, { x: 85, y: 70, role: 'RB' },
            { x: 38, y: 55, role: 'CDM' }, { x: 62, y: 55, role: 'CDM' },
            { x: 15, y: 35, role: 'AML' }, { x: 50, y: 35, role: 'CAM' }, { x: 85, y: 35, role: 'AMR' },
            { x: 50, y: 15, role: 'ST' },
        ],
        "3-5-2 Wingbacks": [
            { x: 50, y: 90, role: 'GK' },
            { x: 25, y: 75, role: 'CB' }, { x: 50, y: 75, role: 'CB' }, { x: 75, y: 75, role: 'CB' },
            { x: 10, y: 50, role: 'LWB' }, { x: 90, y: 50, role: 'RWB' },
            { x: 40, y: 55, role: 'CM' }, { x: 60, y: 55, role: 'CM' },
            { x: 50, y: 40, role: 'CAM' },
            { x: 35, y: 20, role: 'ST' }, { x: 65, y: 20, role: 'ST' },
        ],
        "3-4-3 Conte": [
            { x: 50, y: 90, role: 'GK' },
            { x: 25, y: 75, role: 'CB' }, { x: 50, y: 75, role: 'CB' }, { x: 75, y: 75, role: 'CB' },
            { x: 10, y: 50, role: 'LM' }, { x: 90, y: 50, role: 'RM' },
            { x: 40, y: 55, role: 'CM' }, { x: 60, y: 55, role: 'CM' },
            { x: 20, y: 25, role: 'LW' }, { x: 80, y: 25, role: 'RW' },
            { x: 50, y: 15, role: 'ST' },
        ],
        "5-3-2 Defensive": [
            { x: 50, y: 90, role: 'GK' },
            { x: 15, y: 65, role: 'LWB' }, { x: 30, y: 75, role: 'CB' }, { x: 50, y: 75, role: 'CB' }, { x: 70, y: 75, role: 'CB' }, { x: 85, y: 65, role: 'RWB' },
            { x: 35, y: 50, role: 'CM' }, { x: 50, y: 55, role: 'CDM' }, { x: 65, y: 50, role: 'CM' },
            { x: 40, y: 25, role: 'ST' }, { x: 60, y: 25, role: 'ST' },
        ],
        "5-2-1-2 Counter": [
            { x: 50, y: 90, role: 'GK' },
            { x: 10, y: 60, role: 'LWB' }, { x: 30, y: 75, role: 'CB' }, { x: 50, y: 75, role: 'CB' }, { x: 70, y: 75, role: 'CB' }, { x: 90, y: 60, role: 'RWB' },
            { x: 40, y: 50, role: 'CM' }, { x: 60, y: 50, role: 'CM' },
            { x: 50, y: 35, role: 'CAM' },
            { x: 40, y: 15, role: 'ST' }, { x: 60, y: 15, role: 'ST' },
        ],
    },
    7: {
        "2-3-1": [
            { x: 50, y: 90, role: 'GK' },
            { x: 30, y: 75, role: 'CB' },
            { x: 70, y: 75, role: 'CB' },
            { x: 50, y: 50, role: 'CM' },
            { x: 20, y: 45, role: 'LM' },
            { x: 80, y: 45, role: 'RM' },
            { x: 50, y: 20, role: 'ST' },
        ],
        "2-2-2": [
            { x: 50, y: 90, role: 'GK' },
            { x: 30, y: 75, role: 'CB' },
            { x: 70, y: 75, role: 'CB' },
            { x: 35, y: 50, role: 'CM' },
            { x: 65, y: 50, role: 'CM' },
            { x: 35, y: 20, role: 'ST' },
            { x: 65, y: 20, role: 'ST' },
        ]
    },
    6: {
        "2-1-2": [
            { x: 50, y: 90, role: 'GK' },
            { x: 30, y: 75, role: 'CB' },
            { x: 70, y: 75, role: 'CB' },
            { x: 50, y: 50, role: 'CM' },
            { x: 35, y: 20, role: 'ST' },
            { x: 65, y: 20, role: 'ST' },
        ],
        "2-2-1": [
            { x: 50, y: 90, role: 'GK' },
            { x: 30, y: 75, role: 'CB' },
            { x: 70, y: 75, role: 'CB' },
            { x: 30, y: 50, role: 'CM' },
            { x: 70, y: 50, role: 'CM' },
            { x: 50, y: 20, role: 'ST' },
        ]
    },
    5: {
        "1-2-1 (Diamond)": [
            { x: 50, y: 90, role: 'GK' },
            { x: 50, y: 75, role: 'CB' },
            { x: 20, y: 50, role: 'LM' },
            { x: 80, y: 50, role: 'RM' },
            { x: 50, y: 25, role: 'ST' },
        ],
        "2-2 (Square)": [
            { x: 50, y: 90, role: 'GK' },
            { x: 30, y: 75, role: 'CB' },
            { x: 70, y: 75, role: 'CB' },
            { x: 30, y: 35, role: 'ST' },
            { x: 70, y: 35, role: 'ST' },
        ]
    }
};

export function getFormationsForSize(size: number) {
    return FORMATIONS_BY_SIZE[size] || FORMATIONS_BY_SIZE[11];
}
