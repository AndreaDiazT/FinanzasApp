'use client';

import { nombreCategoria } from '@/lib/mock-data';
import { Categoria } from '@/lib/types';

interface CategoryChartProps {
  gastosPorCategoria: Record<Categoria, number>;
}

export function CategoryChart({ gastosPorCategoria }: CategoryChartProps) {
  const total = Object.values(gastosPorCategoria).reduce((a, b) => a + b, 0);

  // Sort by highest amount first
  const sorted = Object.entries(gastosPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .filter(([, amount]) => amount > 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-base font-semibold text-gray-900">📊 Gastos por Categoría</h3>
      <div className="space-y-3">
        {sorted.map(([categoria, amount]) => {
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          return (
            <div key={categoria}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">
                  {nombreCategoria(categoria as Categoria)}
                </span>
                <span className="text-xs font-semibold text-gray-900">
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {percentage.toFixed(1)}% del total
              </p>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <p className="text-center text-xs text-gray-500">
            Sin gastos registrados
          </p>
        )}
      </div>
    </div>
  );
}
