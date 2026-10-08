'use client';

import { useEffect, useState } from 'react';
import { Gasto, Categoria } from '@/lib/types';
import { presupuestos } from '@/lib/mock-data';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Gasto, 'id' | 'created_at'>) => void;
  isLoading?: boolean;
}

export function ExpenseForm({ onSubmit, isLoading = false }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    monto: '',
    tarjeta: 'bogota' as 'bogota' | 'rappi',
    categoria: 'ropa-y-compras' as Categoria,
    comercio: '',
    fecha: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fecha: new Date().toISOString().split('T')[0],
    }));
  }, []);

  const categories = formData.tarjeta === 'bogota'
    ? Object.keys(presupuestos.bogota) as Categoria[]
    : Object.keys(presupuestos.rappi) as Categoria[];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.monto || !formData.comercio) {
      alert('Por favor completa todos los campos');
      return;
    }

    onSubmit({
      usuario_id: 'user-1', // This will come from auth later
      monto: parseFloat(formData.monto),
      tarjeta: formData.tarjeta,
      categoria: formData.categoria,
      comercio: formData.comercio,
      fecha: formData.fecha,
    });

    // Reset form
    setFormData({
      monto: '',
      tarjeta: 'bogota',
      categoria: 'ropa-y-compras',
      comercio: '',
      fecha: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-base font-semibold text-gray-900">Registrar Gasto</h3>

      <div className="space-y-3">
        {/* Amount and Tarjeta in grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Monto
            </label>
            <input
              type="number"
              value={formData.monto}
              onChange={(e) =>
                setFormData({ ...formData, monto: e.target.value })
              }
              placeholder="0"
              step="1000"
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tarjeta
            </label>
            <select
              value={formData.tarjeta}
              onChange={(e) => {
                const newTarjeta = e.target.value as 'bogota' | 'rappi';
                setFormData({
                  ...formData,
                  tarjeta: newTarjeta,
                  categoria: newTarjeta === 'bogota' ? 'ropa-y-compras' : 'pañales-y-leche',
                });
              }}
              className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
            >
              <option value="bogota">Bogotá</option>
              <option value="rappi">Rappi</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value as Categoria })
            }
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/-/g, ' ').charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Commerce */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Comercio
          </label>
          <input
            type="text"
            value={formData.comercio}
            onChange={(e) =>
              setFormData({ ...formData, comercio: e.target.value })
            }
            placeholder="ej: D1, Starbucks, Zara"
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Fecha
          </label>
          <input
            type="date"
            value={formData.fecha}
            onChange={(e) =>
              setFormData({ ...formData, fecha: e.target.value })
            }
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Guardando...' : 'Registrar Gasto'}
        </button>
      </div>
    </form>
  );
}
