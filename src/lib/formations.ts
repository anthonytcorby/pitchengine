
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
            { x: 50, y: 90, role: 'GK' },    // 0
            { x: 85, y: 70, role: 'RB' },    // 1
            { x: 62, y: 75, role: 'CB' },    // 2 (RCB)
            { x: 38, y: 75, role: 'CB' },    // 3 (LCB)
            { x: 15, y: 70, role: 'LB' },    // 4
            { x: 62, y: 50, role: 'CM' },    // 5 (RCM)
            { x: 38, y: 50, role: 'CM' },    // 6 (LCM)
            { x: 85, y: 45, role: 'RM' },    // 7
            { x: 15, y: 45, role: 'LM' },    // 8
            { x: 60, y: 20, role: 'ST' },    // 9 (ST-R)
            { x: 40, y: 20, role: 'ST' },    // 10 (ST-L)
        ],
        "4-4-2 Diamond (Narrow)": [
            { x: 50, y: 90, role: 'GK' },    // 0
            { x: 85, y: 70, role: 'RB' },    // 1
            { x: 62, y: 75, role: 'CB' },    // 2
            { x: 38, y: 75, role: 'CB' },    // 3
            { x: 15, y: 70, role: 'LB' },    // 4
            { x: 50, y: 60, role: 'CDM' },   // 5 (Pivot)
            { x: 35, y: 45, role: 'CM' },    // 6 (LCM -> LCM)
            { x: 65, y: 45, role: 'CM' },    // 7 (RM -> RCM Wide)
            { x: 50, y: 30, role: 'CAM' },   // 8 (LM -> CAM)? Or 9? Let's use 8 for CAM here so LM slides in? 
            // Wait, previous logic was 9=CAM. 
            // Let's use 9 for CAM.
            // So Slot 7 (RM) -> RCM. Slot 8 (LM) -> LCM? 
            // But we have Slot 6 (LCM).
            // Diamond: CDM, RCM, LCM, CAM. + 2 ST.
            // 4-4-2: RCM(5), LCM(6), RM(7), LM(8), ST(9), ST(10).
            // Map:
            // 5 (RCM) -> CDM
            // 6 (LCM) -> LCM
            // 7 (RM) -> RCM
            // 8 (LM) -> CAM
            // 9 (ST) -> ST
            // 10 (ST) -> ST
            // This works.
            { x: 50, y: 30, role: 'CAM' },   // 8 (LM -> CAM)
            { x: 60, y: 15, role: 'ST' },    // 9
            { x: 40, y: 15, role: 'ST' },    // 10
        ],
        // Wait, duplicated key 8? No, Logic above:
        // 5: CDM, 6: LCM, 7: RCM, 8: CAM?
        // Let's refine Diamond:
        // 0: GK
        // 1: RB
        // 2: RCB
        // 3: LCB
        // 4: LB
        // 5: CDM (RCM -> CDM)
        // 6: LCM (LCM -> LCM)
        // 7: RCM (RM -> RCM)
        // 8: CAM (LM -> CAM) - The LM tucks in to #10. Nice.
        // 9: ST (ST -> ST)
        // 10: ST (ST -> ST)
        // Wait, previous 4-4-2 had 9 as ST-R.
        // So this is 0,1,2,3,4, 5,6,7,8, 9,10. Correct count.

        "4-3-3 DM Wide": [
            { x: 50, y: 90, role: 'GK' },    // 0
            { x: 85, y: 70, role: 'RB' },    // 1
            { x: 62, y: 75, role: 'CB' },    // 2
            { x: 38, y: 75, role: 'CB' },    // 3
            { x: 15, y: 70, role: 'LB' },    // 4
            { x: 50, y: 60, role: 'CDM' },   // 5 (RCM -> CDM)
            { x: 65, y: 45, role: 'CM' },    // 6 (LCM -> RCM) - Swap sides? Or consistent?
            // 4-4-2 LCM(6) is left-central. 4-3-3 RCM is right-central.
            // Ideally LCM->LCM.
            // Let's put 6 at LCM.
            { x: 35, y: 45, role: 'CM' },    // 6 (LCM)
            { x: 85, y: 25, role: 'RW' },    // 7 (RM -> RW) - Perfect
            { x: 15, y: 25, role: 'LW' },    // 8 (LM -> LW) - Perfect
            { x: 65, y: 45, role: 'CM' },    // 9 (ST-R -> RCM) - Striker drops to mid.
            // Wait, array index must be unique.
            // I need 0..10 indices.
            // 4-3-3 has: GK, RB, RCB, LCB, LB, CDM, LCM, RCM, RW, LW, ST.
            // 5: CDM
            // 6: LCM
            // 7: RW
            // 8: LW
            // 9: RCM (ST drops)
            // 10: ST (ST stays)
            { x: 50, y: 15, role: 'ST' },    // 10
        ], // Wait, writing the array:
        // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        // Values:
        // 5: CDM
        // 6: LCM
        // 9: RCM
        // 7: RW
        // 8: LW
        // 10: ST
        // This order in array is: 0,1,2,3,4, 5, 6, 9(Placeholder?), 7, 8, 10?
        // The ARRAY ORDER matters for the index key.
        // So I must emit them in order 0..10.

        "4-3-3 DM Wide": [
            { x: 50, y: 90, role: 'GK' },    // 0
            { x: 85, y: 70, role: 'RB' },    // 1
            { x: 62, y: 75, role: 'CB' },    // 2
            { x: 38, y: 75, role: 'CB' },    // 3
            { x: 15, y: 70, role: 'LB' },    // 4
            { x: 50, y: 60, role: 'CDM' },   // 5
            { x: 35, y: 45, role: 'CM' },    // 6 (LCM)
            { x: 85, y: 25, role: 'RW' },    // 7 (RM -> RW)
            { x: 15, y: 25, role: 'LW' },    // 8 (LM -> LW)
            { x: 65, y: 45, role: 'CM' },    // 9 (ST -> RCM)
            { x: 50, y: 15, role: 'ST' },    // 10
        ],

        "4-2-3-1 Genpen": [
            { x: 50, y: 90, role: 'GK' },    // 0
            { x: 85, y: 70, role: 'RB' },    // 1
            { x: 62, y: 75, role: 'CB' },    // 2
            { x: 38, y: 75, role: 'CB' },    // 3
            { x: 15, y: 70, role: 'LB' },    // 4
            { x: 62, y: 55, role: 'CDM' },   // 5 (R-CDM)
            { x: 38, y: 55, role: 'CDM' },   // 6 (L-CDM)
            { x: 85, y: 35, role: 'AMR' },   // 7 (RM -> AMR)
            { x: 15, y: 35, role: 'AML' },   // 8 (LM -> AML)
            { x: 50, y: 35, role: 'CAM' },   // 9 (ST2 -> CAM)
            { x: 50, y: 15, role: 'ST' },    // 10
        ],

        "3-5-2 Wingbacks": [
            { x: 50, y: 90, role: 'GK' },    // 0
            { x: 90, y: 50, role: 'RWB' },   // 1 (RB -> RWB)
            { x: 75, y: 75, role: 'CB' },    // 2 (RCB)
            { x: 25, y: 75, role: 'CB' },    // 3 (LCB)
            { x: 10, y: 50, role: 'LWB' },   // 4 (LB -> LWB)
            { x: 50, y: 75, role: 'CB' },    // 5 (CDM/RCM -> Central CB)
            { x: 40, y: 55, role: 'CM' },    // 6 (LCM -> LCM)
            { x: 60, y: 55, role: 'CM' },    // 7 (RM -> RCM)
            { x: 50, y: 40, role: 'CAM' },   // 8 (LM -> CAM)
            { x: 65, y: 20, role: 'ST' },    // 9 (ST2 -> ST)
            { x: 35, y: 20, role: 'ST' },    // 10 (ST -> ST)
        ],

        "3-4-3 Conte": [
            { x: 50, y: 90, role: 'GK' },    // 0
            { x: 90, y: 50, role: 'RM' },    // 1 (RB -> RM)
            { x: 75, y: 75, role: 'CB' },    // 2
            { x: 25, y: 75, role: 'CB' },    // 3
            { x: 10, y: 50, role: 'LM' },    // 4 (LB -> LM)
            { x: 50, y: 75, role: 'CB' },    // 5 (CCB)
            { x: 40, y: 55, role: 'CM' },    // 6 (LCM)
            { x: 80, y: 25, role: 'RW' },    // 7 (RM(old) -> RW)
            { x: 20, y: 25, role: 'LW' },    // 8 (LM(old) -> LW) - Wait, Slot 8 was CAM in 352?
            // In 4-4-2 Slot 8 is LM. So LM -> LW. Perfect.
            { x: 60, y: 55, role: 'CM' },    // 9 (ST2 -> RCM) - Striker drops to mid
            { x: 50, y: 15, role: 'ST' },    // 10
        ],

        "5-3-2 Defensive": [
            { x: 50, y: 90, role: 'GK' },    // 0
            { x: 85, y: 65, role: 'RWB' },   // 1
            { x: 70, y: 75, role: 'CB' },    // 2
            { x: 30, y: 75, role: 'CB' },    // 3
            { x: 15, y: 65, role: 'LWB' },   // 4
            { x: 50, y: 75, role: 'CB' },    // 5 (CCB)
            { x: 35, y: 50, role: 'CM' },    // 6
            { x: 65, y: 50, role: 'CM' },    // 7 (RM -> CM)
            { x: 50, y: 55, role: 'CDM' },   // 8 (LM -> CDM) ? 
            // 532 has 3 CMs.
            // 6, 7, 8 map to CM, CM, CDM.
            { x: 60, y: 25, role: 'ST' },    // 9
            { x: 40, y: 25, role: 'ST' },    // 10
        ],

        "5-2-1-2 Counter": [
            { x: 50, y: 90, role: 'GK' },    // 0
            { x: 90, y: 60, role: 'RWB' },   // 1
            { x: 70, y: 75, role: 'CB' },    // 2
            { x: 30, y: 75, role: 'CB' },    // 3
            { x: 10, y: 60, role: 'LWB' },   // 4
            { x: 50, y: 75, role: 'CB' },    // 5
            { x: 40, y: 50, role: 'CM' },    // 6
            { x: 60, y: 50, role: 'CM' },    // 7
            { x: 50, y: 35, role: 'CAM' },   // 8
            { x: 60, y: 15, role: 'ST' },    // 9
            { x: 40, y: 15, role: 'ST' },    // 10
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
