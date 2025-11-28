export enum TerminationCause {
    Renuncia = 'RENUNCIA',
    DespidoJustificado = 'DESPIDO_JUSTIFICADO',
    DespidoInjustificado = 'DESPIDO_INJUSTIFICADO',
}

export interface CalculatorInput {
    // Identity
    companyName: string;
    workerName: string;

    // Dates
    startDate: string;
    endDate: string;

    // Worked Days (Pending payment)
    pendingWorkedDays: number;
    pendingOvertimeHours: number;

    // Salary
    dailySalary: number; // Sueldo Diario
    integratedDailySalary: number; // SDI

    // Configuration (Customizable benefits)
    baseAguinaldoDays: number;
    vacationPremiumPercentage: number; // 0.25 default
    
    // Termination
    cause: TerminationCause;
    
    // For Unjustified Dismissal Scenarios
    monthsOfLostWages: number; // Salarios vencidos estimates
}

export interface Antiquity {
    years: number;
    daysPartial: number;
    totalDays: number;
}

export interface PaymentConcept {
    concept: string;
    amount: number;
    description: string;
}

export interface ScenarioResult {
    name: string;
    breakdown: {
        finiquito: PaymentConcept[];
        liquidacion: PaymentConcept[];
    };
    subtotalFiniquito: number;
    subtotalLiquidacion: number;
    total: number;
}

export interface CalculationResult {
    input: CalculatorInput;
    antiquity: Antiquity;
    scenarioA: ScenarioResult; // The calculated scenario based on input
    scenarioB?: ScenarioResult; // Only for Despido Injustificado (Litigation max)
}