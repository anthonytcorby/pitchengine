import { Player } from '@/types/schema';

export const TEAMSHEET: Player[] = [
    // Starting XI (Based on initial Squad Page data)
    { id: '1', name: 'Jake Smith', role: 'GK', position: 'GK', number: 1, captain: false, attendance: 85, reliability: 88, preferred: true, preferredFoot: 'Right', nationality: 'gb-eng', teamId: 'team-wts' } as any,
    { id: '2', name: 'Ryan Williams', role: 'RB', position: 'RB', number: 2, captain: false, attendance: 87, reliability: 89, preferred: true, preferredFoot: 'Right', nationality: 'gb-wls', teamId: 'team-wts' } as any,
    { id: '3', name: 'Luke Anderson', role: 'LB', position: 'LB', number: 3, captain: false, attendance: 86, reliability: 88, preferred: true, preferredFoot: 'Left', nationality: 'gb-sct', teamId: 'team-wts' } as any,
    { id: '4', name: 'Marcus Richards', role: 'CB', position: 'CB', number: 4, captain: false, attendance: 92, reliability: 94, preferred: true, preferredFoot: 'Right', nationality: 'jm', teamId: 'team-wts' } as any,
    { id: '5', name: 'Anthony Corby', role: 'CB', position: 'CB', number: 5, captain: true, attendance: 95, reliability: 98, preferred: true, preferredFoot: 'Right', nationality: 'gb-eng', teamId: 'team-wts' } as any,
    { id: '6', name: 'Ben Clarke', role: 'CM', position: 'CM', number: 6, captain: false, attendance: 89, reliability: 91, preferred: true, preferredFoot: 'Right', nationality: 'ie', teamId: 'team-wts' } as any,
    { id: '7', name: 'Kevin Martinez', role: 'LM', position: 'LM', number: 7, captain: false, attendance: 91, reliability: 93, preferred: true, preferredFoot: 'Left', nationality: 'es', teamId: 'team-wts' } as any,
    { id: '8', name: 'Paul Foster', role: 'CM', position: 'CM', number: 8, captain: false, attendance: 90, reliability: 92, preferred: true, preferredFoot: 'Right', nationality: 'gb-eng', teamId: 'team-wts' } as any,
    { id: '9', name: 'James Thompson', role: 'ST', position: 'ST', number: 9, captain: false, attendance: 88, reliability: 90, preferred: true, preferredFoot: 'Left', nationality: 'gb-eng', teamId: 'team-wts' } as any,
    { id: '10', name: 'Tom Harris', role: 'ST', position: 'ST', number: 10, captain: false, attendance: 82, reliability: 85, preferred: false, preferredFoot: 'Right', nationality: 'ca', teamId: 'team-wts' } as any,
    { id: '11', name: 'Daniel Vieri', role: 'LW', position: 'LW', number: 11, captain: false, attendance: 78, reliability: 82, preferred: false, preferredFoot: 'Left', nationality: 'it', teamId: 'team-wts' } as any,

    // Bench / Reserves (Expanded)
    { id: '12', name: 'Sam Roberts', role: 'RM', position: 'RM', number: 14, captain: false, attendance: 74, reliability: 78, preferred: false, preferredFoot: 'Right', nationality: 'gb-eng', teamId: 'team-wts' } as any,
    { id: '13', name: 'Alex Johnson', role: 'GK', position: 'GK', number: 13, captain: false, attendance: 60, reliability: 80, preferred: false, preferredFoot: 'Right', nationality: 'us', teamId: 'team-wts' } as any,
    { id: '14', name: 'Chris Evans', role: 'CB', position: 'CB', number: 15, captain: false, attendance: 82, reliability: 85, preferred: false, preferredFoot: 'Right', nationality: 'gb-wls', teamId: 'team-wts' } as any,
    { id: '15', name: 'David Lee', role: 'CM', position: 'CM', number: 16, captain: false, attendance: 75, reliability: 79, preferred: false, preferredFoot: 'Right', nationality: 'cn', teamId: 'team-wts' } as any,
    { id: '16', name: 'Erik Jensen', role: 'ST', position: 'ST', number: 17, captain: false, attendance: 65, reliability: 75, preferred: false, preferredFoot: 'Left', nationality: 'dk', teamId: 'team-wts' } as any,
    { id: '17', name: 'Fabio Silva', role: 'CAM', position: 'CAM', number: 18, captain: false, attendance: 88, reliability: 86, preferred: true, preferredFoot: 'Right', nationality: 'br', teamId: 'team-wts' } as any,
    { id: '18', name: "Greg O'Shea", role: 'CDM', position: 'CDM', number: 19, captain: false, attendance: 90, reliability: 92, preferred: true, preferredFoot: 'Right', nationality: 'ie', teamId: 'team-wts' } as any,
    { id: '19', name: 'Harry Wilson', role: 'RW', position: 'RW', number: 20, captain: false, attendance: 70, reliability: 76, preferred: false, preferredFoot: 'Left', nationality: 'au', teamId: 'team-wts' } as any,
    { id: '20', name: 'Ian Wright', role: 'LB', position: 'LB', number: 21, captain: false, attendance: 85, reliability: 88, preferred: false, preferredFoot: 'Left', nationality: 'gb-eng', teamId: 'team-wts' } as any,
    { id: '21', name: 'Jack Taylor', role: 'RB', position: 'RB', number: 22, captain: false, attendance: 83, reliability: 87, preferred: false, preferredFoot: 'Right', nationality: 'nz', teamId: 'team-wts' } as any,
    { id: '22', name: 'Karl Malone', role: 'CB', position: 'CB', number: 23, captain: false, attendance: 77, reliability: 81, preferred: false, preferredFoot: 'Right', nationality: 'de', teamId: 'team-wts' } as any
];

// Initial formations map positions (0-10) to these specific IDs for the default 4-4-2
// mapped linearly: GK(1), LB(3), CB(4), CB(5), RB(2), LM(7), CM(8), CM(6), RM(12?), ST(9), ST(10)

export const MATCH_DATA = {
    opponent: 'Tech United',
    competition: 'Premier Division',
    venue: 'The Code Arena',
    date: 'Tuesday 24 Oct',
    time: '19:45',
    weather: 'Rainy, 12°C',
    kit: 'Home (Green)',
    referee: 'M. Dean'
};
