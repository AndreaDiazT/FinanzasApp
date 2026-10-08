'use client';

import { useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { AlertCard } from '@/components/AlertCard';
import { CategoryChart } from '@/components/CategoryChart';
import { ExpenseForm } from '@/components/ExpenseForm';
import { TrafficLight } from '@/components/TrafficLight';
import { CardStatus } from '@/components/CardStatus';
import { gastosSimulados, calcularDashboard, presupuestos } from '@/lib/mock-data';
import { Gasto } from '@/lib/types';

export default function Home() {
  const [gastos, setGastos] = useState<Gasto[]>(gastosSimulados);

  const dashboard = useMemo(() => {
    return calcularDashboard(gastos);
  }, [gastos]);

  const handleAddExpense = (expense: Omit<Gasto, 'id' | 'created_at'>) => {
    const newExpense: Gasto = {
      ...expense,
      id: `${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setGastos([newExpense, ...gastos]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getVariant = (porcentaje: number): 'default' | 'success' | 'warning' | 'danger' => {
    if (porcentaje >= 100) return 'danger';
    if (porcentaje >= 90) return 'warning';
    if (porcentaje >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Section */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <MetricCard
            title="Presupuesto Total"
            value={formatCurrency(dashboard.presupuestoTotal)}
            icon="📊"
            variant="default"
          />
          <MetricCard
            title="Gastado"
            value={formatCurrency(dashboard.gastado)}
            subtitle={`${dashboard.porcentajeUsado}% del total`}
            icon="💸"
            variant={getVariant(dashboard.porcentajeUsado)}
          />
          <MetricCard
            title="Disponible"
            value={formatCurrency(dashboard.disponible)}
            subtitle={`${100 - dashboard.porcentajeUsado}% libre`}
            icon="✅"
            variant="success"
          />
        </div>

        {/* Card Status Section */}
        <div className="mb-6">
          <h2 className="mb-3 text-base font-semibold text-gray-900">💳 Estado por Tarjeta</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <CardStatus
              tarjeta="bogota"
              consumo={dashboard.gastosPorTarjeta.bogota}
              presupuesto={
                Object.values(presupuestos.bogota).reduce((a, b) => a + b, 0)
              }
              diaCorte={15}
            />
            <CardStatus
              tarjeta="rappi"
              consumo={dashboard.gastosPorTarjeta.rappi}
              presupuesto={
                Object.values(presupuestos.rappi).reduce((a, b) => a + b, 0)
              }
              diaCorte={29}
            />
          </div>
        </div>

        {/* Traffic Light Status */}
        <div className="mb-6">
          <TrafficLight porcentajeUsado={dashboard.porcentajeUsado} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>

          {/* Right Column - Charts and Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Chart */}
            <CategoryChart gastosPorCategoria={dashboard.gastosPorCategoria} />

            {/* Alerts Section */}
            {dashboard.alertas.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <h3 className="mb-3 text-base font-semibold text-gray-900">
                  ⚠️ Alertas por Categoría
                </h3>
                <div className="space-y-2">
                  {dashboard.alertas.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
          <h3 className="mb-3 text-base font-semibold text-gray-900">📋 Últimos Gastos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Fecha
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Comercio
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Categoría
                  </th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">
                    Tarjeta
                  </th>
                  <th className="text-right py-2 px-3 font-medium text-gray-600">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {gastos.slice(0, 10).map((gasto) => (
                  <tr
                    key={gasto.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-2 px-3">
                      {new Date(gasto.fecha).toLocaleDateString('es-CO')}
                    </td>
                    <td className="py-2 px-3 font-medium text-gray-900">
                      {gasto.comercio}
                    </td>
                    <td className="py-2 px-3 text-gray-600">
                      {gasto.categoria.replace(/-/g, ' ')}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                          gasto.tarjeta === 'bogota'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {gasto.tarjeta === 'bogota' ? 'Bogotá' : 'Rappi'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-semibold text-gray-900">
                      {formatCurrency(gasto.monto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
