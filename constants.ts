// Salario Mínimo General 2024 (Used for capping Seniority Premium)
// Although the logic is based on 2015 tables, the monetary cap usually uses current SMG.
export const SMG_2024 = 248.93; 

// Cap for Prima de Antigüedad is 2x SMG
export const SENIORITY_PREMIUM_CAP = SMG_2024 * 2;

// LFT 2015 Vacation Table
// Year 1: 6, Year 2: 8, Year 3: 10, Year 4: 12
// Year 5-9: 14, Year 10-14: 16, etc.
export const getLegalVacationDays2015 = (yearsCompleted: number): number => {
    if (yearsCompleted < 1) return 6; // Proportional base
    if (yearsCompleted === 1) return 6;
    if (yearsCompleted === 2) return 8;
    if (yearsCompleted === 3) return 10;
    if (yearsCompleted === 4) return 12;
    
    // After 4 years, increases by 2 every 5 years
    const fiveYearBlocks = Math.floor((yearsCompleted - 5) / 5);
    return 14 + (fiveYearBlocks * 2);
};