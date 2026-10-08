'use client';

import { useEffect, useState } from 'react';

interface CardStatusProps {
  tarjeta: 'bogota' | 'rappi';
  consumo: number;
  presupuesto: number;
  diaCorte: number;
}

export function CardStatus({ tarjeta, consumo, presupuesto, diaCorte }: CardStatusProps) {
  const [diasFaltantes, setDiasFaltantes] = useState(0);
  const [proximaFecha, setProximaFecha] = useState('');

  useEffect(() => {
    const calcularDiasFaltantes = () => {
      const hoy = new Date();
      const mesActual = hoy.getMonth();
      const anyoActual = hoy.getFullYear();

      let fechaCorte = new Date(anyoActual, mesActual, diaCorte);

      if (fechaCorte < hoy) {
        fechaCorte = new Date(anyoActual, mesActual + 1, diaCorte);
      }

      const diferencia = fechaCorte.getTime() - hoy.getTime();
      const dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

      setDiasFaltantes(Math.max(0, dias));
      setProximaFecha(
        fechaCorte.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })
      );
    };

    calcularDiasFaltantes();
  }, [diaCorte]);

  const getCardName = () => tarjeta === 'bogota' ? 'Banco de Bogota' : 'Rappi';
  const getCardIcon = () => tarjeta === 'bogota' ? '🏦' : '🛵';

  const porcentajeUsado = (consumo / presupuesto) * 100;

  const getColorIndicator = () => {
    if (porcentajeUsado >= 100) return 'bg-red-500';
    if (porcentajeUsado >= 90) return 'bg-orange-500';
    if (porcentajeUsado >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (porcentajeUsado >= 100) return 'Limite alcanzado';
    if (porcentajeUsado >= 90) return 'Casi al limite';
    if (porcentajeUsado >= 75) return 'Preocupante';
    return 'Bajo control';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{getCardIcon()}</span>
          <div>
            <p className="font-semibold text-xs text-gray-900">{getCardName()}</p>
            <p className="text-xs text-gray-500">Tarjeta</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">
            {porcentajeUsado.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className={`h-full ${getColorIndicator()} transition-all`}
            style={{ width: `${Math.min(porcentajeUsado, 100)}%` }}
          />
        </div>
      </div>

      {/* Status and Amounts */}
      <div className="mb-2 space-y-0.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Consumo</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(consumo)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Presupuesto</span>
          <span className="font-semibold text-gray-900">
            {formatCurrency(presupuesto)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Disponible</span>
          <span className={`font-semibold ${porcentajeUsado >= 100 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(Math.max(0, presupuesto - consumo))}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${
        porcentajeUsado >= 100 ? 'bg-red-100 text-red-700' :
        porcentajeUsado >= 90 ? 'bg-orange-100 text-orange-700' :
        porcentajeUsado >= 75 ? 'bg-yellow-100 text-yellow-700' :
        'bg-green-100 text-green-700'
      }`}>
        {getStatusText()}
      </div>

      {/* Cutoff Date */}
      <div className="border-t border-gray-200 pt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Corte en</span>
          <div className="text-right">
            <p className="font-bold text-gray-900">{diasFaltantes}</p>
            <p className="text-gray-500">
              {diasFaltantes === 1 ? 'día' : 'días'}
            </p>
          </div>
        </div>
        {proximaFecha && (
          <p className="text-xs text-gray-500 mt-1">
            Próxima: {proximaFecha}
          </p>
        )}
      </div>
    </div>
  );
}
