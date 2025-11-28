import React, { useState, useMemo } from 'react';
import { CalculatorInput, TerminationCause } from './types';
import InputForm from './components/InputForm';
import Results from './components/Results';
import { generateCalculation } from './utils/calculations';

function App() {
  const [input, setInput] = useState<CalculatorInput>({
    companyName: '',
    workerName: '',
    startDate: '2020-01-01',
    endDate: new Date().toISOString().split('T')[0],
    pendingWorkedDays: 0,
    pendingOvertimeHours: 0,
    dailySalary: 300,
    integratedDailySalary: 350,
    baseAguinaldoDays: 15,
    vacationPremiumPercentage: 25,
    cause: TerminationCause.Renuncia,
    monthsOfLostWages: 0
  });

  const result = useMemo(() => generateCalculation(input), [input]);

  const handleExportCSV = () => {
    // Generate CSV Content
    const rows = [
      ["CALCULADORA DE FINIQUITO Y LIQUIDACIÓN LFT 2015", ""],
      ["Empresa", input.companyName],
      ["Trabajador", input.workerName],
      ["Fecha Ingreso", input.startDate],
      ["Fecha Baja", input.endDate],
      ["Antigüedad", `${result.antiquity.years} años, ${result.antiquity.daysPartial} días`],
      ["Sueldo Diario", input.dailySalary],
      ["SDI", input.integratedDailySalary],
      ["Causa", input.cause],
      ["", ""],
      ["ESCENARIO PRINCIPAL", result.scenarioA.name],
      ["Concepto", "Monto", "Detalle"]
    ];

    // Add Finiquito Details
    result.scenarioA.breakdown.finiquito.forEach(item => {
        rows.push([item.concept, item.amount.toFixed(2), item.description]);
    });
    // Add Liquidacion Details
    result.scenarioA.breakdown.liquidacion.forEach(item => {
        rows.push([item.concept, item.amount.toFixed(2), item.description]);
    });

    rows.push(["TOTAL A PAGAR", result.scenarioA.total.toFixed(2), ""]);

    // If Scenario B exists
    if (result.scenarioB) {
        rows.push(["", "", ""]);
        rows.push(["ESCENARIO MÁXIMO (JUICIO)", result.scenarioB.name]);
        result.scenarioB.breakdown.finiquito.forEach(item => {
            rows.push([item.concept, item.amount.toFixed(2), item.description]);
        });
        result.scenarioB.breakdown.liquidacion.forEach(item => {
            rows.push([item.concept, item.amount.toFixed(2), item.description]);
        });
        rows.push(["TOTAL MÁXIMO", result.scenarioB.total.toFixed(2), ""]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");
        
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `calculo_finiquito_${input.workerName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-12">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight">Calculadora Laboral México</h1>
            <p className="mt-2 text-blue-200">Herramienta profesional de cálculo de prestaciones y liquidaciones (LFT 2015)</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Section - Left Col on Desktop */}
            <div className="lg:col-span-5 xl:col-span-4">
                <div className="sticky top-6">
                    <InputForm values={input} onChange={setInput} />
                </div>
            </div>

            {/* Results Section - Right Col on Desktop */}
            <div className="lg:col-span-7 xl:col-span-8">
                <Results result={result} onExport={handleExportCSV} />
            </div>

        </div>
      </main>
    </div>
  );
}

export default App;