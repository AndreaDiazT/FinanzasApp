'use client';

import { Alerta } from '@/lib/types';
import { nombreCategoria } from '@/lib/mock-data';

interface AlertCardProps {
  alert: Alerta;
}

export function AlertCard({ alert }: AlertCardProps) {
  const nivelColors = {
    verde: 'bg-green-100 text-green-800 border-green-300',
    amarillo: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    naranja: 'bg-orange-100 text-orange-800 border-orange-300',
    rojo: 'bg-red-100 text-red-800 border-red-300',
  };

  const nivelIcons = {
    verde: '✅',
    amarillo: '⚠️',
    naranja: '🔶',
    rojo: '🔴',
  };

  const tarjetaNames = {
    bogota: 'Bogotá',
    rappi: 'Rappi',
  };

  return (
    <div className={`rounded-lg border p-3 ${nivelColors[alert.nivel]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <span className="text-lg flex-shrink-0">{nivelIcons[alert.nivel]}</span>
          <div>
            <p className="font-semibold text-sm">
              {nombreCategoria(alert.categoria)}
            </p>
            <p className="text-xs opacity-75">
              {tarjetaNames[alert.tarjeta]} • {alert.porcentaje_usado}% usado
            </p>
          </div>
        </div>
        <span className="text-xs font-bold opacity-75 flex-shrink-0">
          {alert.porcentaje_usado}%
        </span>
      </div>
    </div>
  );
}
