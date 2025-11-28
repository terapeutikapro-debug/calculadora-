import React from 'react';
import { CalculationResult, ScenarioResult, PaymentConcept } from '../types';
import { Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
    result: CalculationResult;
    onExport: () => void;
}

const Currency = ({ value, className = "" }: { value: number, className?: string }) => (
    <span className={`font-mono ${className}`}>
        ${value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
);

const ConceptTable = ({ items }: { items: PaymentConcept[] }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalle</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {items.map((item, idx) => (
                    <tr key={idx}>
                        <td className="px-4 py-2 font-medium text-gray-900">{item.concept}</td>
                        <td className="px-4 py-2 text-gray-500 text-xs">{item.description}</td>
                        <td className="px-4 py-2 text-right text-gray-900"><Currency value={item.amount} /></td>
                    </tr>
                ))}
                {items.length === 0 && (
                    <tr>
                        <td colSpan={3} className="px-4 py-2 text-center text-gray-500 italic">No aplica</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

const ScenarioCard = ({ scenario, isPrimary }: { scenario: ScenarioResult, isPrimary: boolean }) => (
    <div className={`rounded-xl shadow-lg border overflow-hidden mb-6 ${isPrimary ? 'bg-white border-blue-200' : 'bg-white border-yellow-200'}`}>
        <div className={`px-6 py-4 border-b ${isPrimary ? 'bg-blue-50' : 'bg-yellow-50'} flex justify-between items-center`}>
            <h3 className={`font-bold text-lg ${isPrimary ? 'text-blue-900' : 'text-yellow-900'}`}>{scenario.name}</h3>
            <div className="text-xl font-bold">
                <span className="text-sm font-normal text-gray-600 mr-2">Total:</span>
                <Currency value={scenario.total} className={isPrimary ? 'text-blue-700' : 'text-yellow-700'} />
            </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    FINIQUITO (Derechos Adquiridos)
                </h4>
                <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                    <ConceptTable items={scenario.breakdown.finiquito} />
                    <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-semibold text-sm">Subtotal Finiquito</span>
                        <Currency value={scenario.subtotalFiniquito} className="font-bold" />
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    LIQUIDACIÓN / INDEMNIZACIONES
                </h4>
                <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                    <ConceptTable items={scenario.breakdown.liquidacion} />
                    <div className="px-4 py-2 bg-gray-100 border-t border-gray-200 flex justify-between items-center">
                        <span className="font-semibold text-sm">Subtotal Liquidación</span>
                        <Currency value={scenario.subtotalLiquidacion} className="font-bold" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Results: React.FC<Props> = ({ result, onExport }) => {
    
    // Prepare data for chart
    const chartData = [
        {
            name: result.scenarioA.name,
            Finiquito: result.scenarioA.subtotalFiniquito,
            Liquidación: result.scenarioA.subtotalLiquidacion,
        }
    ];

    if (result.scenarioB) {
        chartData.push({
            name: "Escenario B (Máximo)",
            Finiquito: result.scenarioB.subtotalFiniquito,
            Liquidación: result.scenarioB.subtotalLiquidacion,
        });
    }

    return (
        <div className="space-y-6">
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Resultado del Cálculo</h2>
                        <p className="text-gray-500 mt-1">Base LFT 2015 - {result.antiquity.years} años y {result.antiquity.daysPartial} días de antigüedad.</p>
                    </div>
                    <button 
                        onClick={onExport}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Descargar CSV
                    </button>
                </div>

                {/* Chart */}
                <div className="h-64 w-full mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="Finiquito" stackId="a" fill="#4ade80" />
                            <Bar dataKey="Liquidación" stackId="a" fill="#f87171" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <ScenarioCard scenario={result.scenarioA} isPrimary={true} />

            {result.scenarioB && (
                <ScenarioCard scenario={result.scenarioB} isPrimary={false} />
            )}
            
            <div className="text-center text-xs text-gray-400 mt-8">
                Nota Legal: Este cálculo es una simulación informativa basada en la LFT 2015. 
                Los montos definitivos deben ser validados por un especialista en derecho laboral o contador.
            </div>
        </div>
    );
};

export default Results;