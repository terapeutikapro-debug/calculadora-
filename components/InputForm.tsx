import React from 'react';
import { CalculatorInput, TerminationCause } from '../types';
import { Calculator, Calendar, User, Building2, DollarSign, Briefcase } from 'lucide-react';

interface Props {
    values: CalculatorInput;
    onChange: (newValues: CalculatorInput) => void;
}

const InputForm: React.FC<Props> = ({ values, onChange }) => {
    
    const handleChange = (field: keyof CalculatorInput, value: any) => {
        onChange({ ...values, [field]: value });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-8">
            <div className="border-b pb-4 mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Datos de Identificación
                </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
                    <div className="relative">
                         <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={values.companyName}
                            onChange={(e) => handleChange('companyName', e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Trabajador</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={values.workerName}
                            onChange={(e) => handleChange('workerName', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="border-b pb-4 mb-4 pt-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Fechas y Antigüedad
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                    <input 
                        type="date" 
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={values.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Baja</label>
                    <input 
                        type="date" 
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={values.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                    />
                </div>
            </div>

            <div className="border-b pb-4 mb-4 pt-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    Salario y Pendientes
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salario Diario (Cuota Diaria)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                        <input 
                            type="number" 
                            min="0"
                            className="pl-8 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={values.dailySalary}
                            onChange={(e) => handleChange('dailySalary', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salario Diario Integrado (SDI)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                        <input 
                            type="number" 
                            min="0"
                            className="pl-8 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={values.integratedDailySalary}
                            onChange={(e) => handleChange('integratedDailySalary', parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Base para cálculo de indemnizaciones.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Días Trabajados Pendientes</label>
                    <input 
                        type="number" 
                        min="0"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={values.pendingWorkedDays}
                        onChange={(e) => handleChange('pendingWorkedDays', parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horas Extra Pendientes</label>
                    <input 
                        type="number" 
                        min="0"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={values.pendingOvertimeHours}
                        onChange={(e) => handleChange('pendingOvertimeHours', parseFloat(e.target.value) || 0)}
                    />
                </div>
            </div>

            <div className="border-b pb-4 mb-4 pt-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    Configuración de Prestaciones
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Días Aguinaldo (Base)</label>
                    <input 
                        type="number" 
                        min="15"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={values.baseAguinaldoDays}
                        onChange={(e) => handleChange('baseAguinaldoDays', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Mínimo de ley: 15 días.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prima Vacacional (%)</label>
                    <input 
                        type="number" 
                        min="25"
                        className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={values.vacationPremiumPercentage}
                        onChange={(e) => handleChange('vacationPremiumPercentage', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Mínimo de ley: 25%.</p>
                </div>
            </div>

            <div className="border-b pb-4 mb-4 pt-2">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Causa de Baja
                </h2>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de Terminación</label>
                <select 
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={values.cause}
                    onChange={(e) => handleChange('cause', e.target.value as TerminationCause)}
                >
                    <option value={TerminationCause.Renuncia}>Renuncia Voluntaria</option>
                    <option value={TerminationCause.DespidoJustificado}>Despido Justificado</option>
                    <option value={TerminationCause.DespidoInjustificado}>Despido Injustificado</option>
                </select>
            </div>

            {values.cause === TerminationCause.DespidoInjustificado && (
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <label className="block text-sm font-medium text-yellow-800 mb-1">Meses de Salarios Vencidos (Estimado Juicio)</label>
                    <input 
                        type="number" 
                        min="0"
                        max="12"
                        className="w-full rounded-md border border-yellow-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        value={values.monthsOfLostWages}
                        onChange={(e) => handleChange('monthsOfLostWages', parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-yellow-600 mt-1">Use 0 si el pago es inmediato. Máximo legal 12 meses para cálculo principal.</p>
                </div>
            )}

        </div>
    );
};

export default InputForm;