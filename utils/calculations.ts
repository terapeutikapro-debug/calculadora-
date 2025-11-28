import { Antiquity, CalculatorInput, CalculationResult, PaymentConcept, ScenarioResult, TerminationCause } from '../types';
import { SENIORITY_PREMIUM_CAP, getLegalVacationDays2015 } from '../constants';

// Helper: Calculate time difference
export const calculateAntiquity = (start: string, end: string): Antiquity => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Approximate calculation
    const years = Math.floor(totalDays / 365);
    const daysPartial = totalDays % 365;

    return { years, daysPartial, totalDays };
};

// Helper: Round currency
const money = (val: number) => Math.round((val + Number.EPSILON) * 100) / 100;

export const generateCalculation = (input: CalculatorInput): CalculationResult => {
    const antiquity = calculateAntiquity(input.startDate, input.endDate);
    
    // 1. Calculate Base Finiquito Parts (Always applicable partially)
    const finiquitoItems: PaymentConcept[] = [];

    // A. Aguinaldo (Proportional)
    // Formula: (Days in year / 365) * Base Days * Daily Salary
    const aguinaldoDaysProportional = (antiquity.daysPartial / 365) * input.baseAguinaldoDays;
    const aguinaldoAmount = money(aguinaldoDaysProportional * input.dailySalary);
    finiquitoItems.push({
        concept: 'Aguinaldo Proporcional',
        amount: aguinaldoAmount,
        description: `${money(aguinaldoDaysProportional)} días proporcionales (${antiquity.daysPartial} días trabajados año actual)`
    });

    // B. Vacaciones (Proportional)
    const vacationDaysLegal = getLegalVacationDays2015(antiquity.years);
    const vacationDaysProportional = (antiquity.daysPartial / 365) * vacationDaysLegal;
    const vacationAmount = money(vacationDaysProportional * input.dailySalary);
    finiquitoItems.push({
        concept: 'Vacaciones Proporcionales',
        amount: vacationAmount,
        description: `${money(vacationDaysProportional)} días pendientes (Base: ${vacationDaysLegal} días/año)`
    });

    // C. Prima Vacacional
    const vacationPremiumAmount = money(vacationAmount * (input.vacationPremiumPercentage / 100));
    finiquitoItems.push({
        concept: 'Prima Vacacional',
        amount: vacationPremiumAmount,
        description: `${input.vacationPremiumPercentage}% sobre vacaciones`
    });

    // D. Worked Days Pending
    if (input.pendingWorkedDays > 0) {
        finiquitoItems.push({
            concept: 'Días Trabajados Pendientes',
            amount: money(input.pendingWorkedDays * input.dailySalary),
            description: `${input.pendingWorkedDays} días`
        });
    }

    // E. Overtime (Simple Calculation for demo, normally varies double/triple)
    // Assuming double hours for simplicity in this calculator or base rate
    if (input.pendingOvertimeHours > 0) {
         // Standard: First 9 hours double, rest triple. Simple estimation: Double.
         const hourlyRate = input.dailySalary / 8;
         const otAmount = money(input.pendingOvertimeHours * hourlyRate * 2);
         finiquitoItems.push({
            concept: 'Horas Extra (Est. Dobles)',
            amount: otAmount,
            description: `${input.pendingOvertimeHours} horas`
         });
    }

    // 2. Prima de Antigüedad Logic
    // Cap salary at 2x SMG
    const salaryForSeniority = Math.min(input.dailySalary, SENIORITY_PREMIUM_CAP);
    let includeSeniorityPremium = false;
    let seniorityPremiumReason = "";

    if (input.cause === TerminationCause.Renuncia) {
        if (antiquity.years >= 15) {
            includeSeniorityPremium = true;
            seniorityPremiumReason = "Renuncia con 15+ años de antigüedad";
        } else {
            seniorityPremiumReason = "No aplica (Renuncia < 15 años)";
        }
    } else {
        // Justified or Unjustified Dismissal always gets it
        includeSeniorityPremium = true;
        seniorityPremiumReason = "Aplica por Despido";
    }

    if (includeSeniorityPremium) {
        // 12 days per year of service
        // Also proportional for partial year? LFT says "importe de doce días de salario por cada año de servicios".
        // Courts often grant proportional part. We will calculate proportional.
        const totalSeniorityDays = (antiquity.totalDays / 365) * 12;
        const seniorityAmount = money(totalSeniorityDays * salaryForSeniority);
        finiquitoItems.push({
            concept: 'Prima de Antigüedad',
            amount: seniorityAmount,
            description: `${money(totalSeniorityDays)} días (Topado a 2xSMG: $${money(salaryForSeniority)}/día) - ${seniorityPremiumReason}`
        });
    }

    // 3. Liquidación Logic
    const liquidacionItemsA: PaymentConcept[] = [];
    const liquidacionItemsB: PaymentConcept[] = []; // For Scenario B (Litigation max)

    if (input.cause === TerminationCause.DespidoInjustificado) {
        // A. Indemnización Constitucional (90 days SDI)
        const constitutional = money(90 * input.integratedDailySalary);
        liquidacionItemsA.push({
            concept: 'Indemnización Constitucional',
            amount: constitutional,
            description: '3 Meses de Salario Diario Integrado'
        });

        // B. Salarios Vencidos (If specified)
        if (input.monthsOfLostWages > 0) {
            const lostWages = money(input.monthsOfLostWages * 30 * input.integratedDailySalary);
            liquidacionItemsA.push({
                concept: 'Salarios Vencidos',
                amount: lostWages,
                description: `${input.monthsOfLostWages} meses estimados`
            });
        }
        
        // Populate Scenario B (Max Litigation includes 20 days/year)
        // Copy A items first
        liquidacionItemsB.push(...liquidacionItemsA);
        
        // Add 20 days per year indemnity (SDI)
        const days20PerYear = (antiquity.totalDays / 365) * 20;
        const amount20Days = money(days20PerYear * input.integratedDailySalary);
        
        liquidacionItemsB.push({
            concept: 'Indemnización 20 días/año',
            amount: amount20Days,
            description: `Negativa de reinstalación (${money(days20PerYear)} días)`
        });
    }

    // Build Result Objects
    const sum = (items: PaymentConcept[]) => items.reduce((acc, curr) => acc + curr.amount, 0);

    const scenarioA: ScenarioResult = {
        name: input.cause === TerminationCause.DespidoInjustificado ? "Escenario A (Conciliación/Mínimo)" : "Liquidación / Finiquito",
        breakdown: {
            finiquito: finiquitoItems,
            liquidacion: liquidacionItemsA
        },
        subtotalFiniquito: sum(finiquitoItems),
        subtotalLiquidacion: sum(liquidacionItemsA),
        total: sum(finiquitoItems) + sum(liquidacionItemsA)
    };

    let scenarioB: ScenarioResult | undefined;

    if (input.cause === TerminationCause.DespidoInjustificado) {
        scenarioB = {
            name: "Escenario B (Juicio/Máximo)",
            breakdown: {
                finiquito: finiquitoItems, // Same finiquito
                liquidacion: liquidacionItemsB // Enhanced liquidation
            },
            subtotalFiniquito: sum(finiquitoItems),
            subtotalLiquidacion: sum(liquidacionItemsB),
            total: sum(finiquitoItems) + sum(liquidacionItemsB)
        };
    }

    return {
        input,
        antiquity,
        scenarioA,
        scenarioB
    };
};