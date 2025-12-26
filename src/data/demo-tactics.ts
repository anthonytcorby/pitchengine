export const DEMO_TACTICS = {
    11: {
        in: [
            { x: 50, y: 85, role: 'GK' },
            { x: 90, y: 55, role: 'RB' }, // Pushed up
            { x: 65, y: 70, role: 'CB' }, // Split
            { x: 35, y: 70, role: 'CB' },
            { x: 10, y: 55, role: 'LB' }, // Pushed up
            { x: 50, y: 60, role: 'CDM' }, // Pivot
            { x: 70, y: 40, role: 'CM' },
            { x: 30, y: 40, role: 'CM' },
            { x: 85, y: 20, role: 'RW' }, // High & Wide
            { x: 15, y: 20, role: 'LW' },
            { x: 50, y: 15, role: 'ST' },
        ],
        out: [
            { x: 50, y: 92, role: 'GK' },
            { x: 80, y: 75, role: 'RB' }, // Tucked in
            { x: 60, y: 80, role: 'CB' }, // Compact
            { x: 40, y: 80, role: 'CB' },
            { x: 20, y: 75, role: 'LB' },
            { x: 50, y: 65, role: 'CDM' },
            { x: 70, y: 60, role: 'CM' }, // Compact Midfield
            { x: 30, y: 60, role: 'CM' },
            { x: 80, y: 45, role: 'RW' }, // Tracked back
            { x: 20, y: 45, role: 'LW' },
            { x: 50, y: 35, role: 'ST' }, // Dropped deep
        ]
    },
    7: {
        in: [
            { x: 50, y: 85, role: 'GK' },
            { x: 20, y: 65, role: 'CB' }, // Split wide
            { x: 80, y: 65, role: 'CB' },
            { x: 50, y: 50, role: 'CM' },
            { x: 15, y: 35, role: 'LM' }, // High
            { x: 85, y: 35, role: 'RM' },
            { x: 50, y: 20, role: 'ST' },
        ],
        out: [
            { x: 50, y: 92, role: 'GK' },
            { x: 35, y: 75, role: 'CB' }, // Narrow
            { x: 65, y: 75, role: 'CB' },
            { x: 50, y: 60, role: 'CM' }, // Screen
            { x: 25, y: 50, role: 'LM' }, // Tucked
            { x: 75, y: 50, role: 'RM' },
            { x: 50, y: 35, role: 'ST' },
        ]
    },
    5: {
        in: [
            { x: 50, y: 85, role: 'GK' },
            { x: 20, y: 60, role: 'DEF' }, // Wide
            { x: 80, y: 60, role: 'DEF' },
            { x: 50, y: 40, role: 'MID' },
            { x: 50, y: 20, role: 'ST' },
        ],
        out: [
            { x: 50, y: 90, role: 'GK' },
            { x: 35, y: 75, role: 'DEF' }, // Narrow box
            { x: 65, y: 75, role: 'DEF' },
            { x: 50, y: 55, role: 'MID' },
            { x: 50, y: 35, role: 'ST' },
        ]
    },
    // Fallbacks for 6-a-side (reuse 5 or 7 logic roughly, or define explicit)
    6: {
        in: [
            { x: 50, y: 85, role: 'GK' },
            { x: 30, y: 70, role: 'CB' },
            { x: 70, y: 70, role: 'CB' },
            { x: 50, y: 50, role: 'CM' },
            { x: 35, y: 25, role: 'ST' },
            { x: 65, y: 25, role: 'ST' },
        ],
        out: [
            { x: 50, y: 90, role: 'GK' },
            { x: 40, y: 75, role: 'CB' },
            { x: 60, y: 75, role: 'CB' },
            { x: 50, y: 60, role: 'CM' },
            { x: 40, y: 40, role: 'ST' },
            { x: 60, y: 40, role: 'ST' },
        ]
    }
};
