'use client';

type StatusColor = 'verde' | 'amarillo' | 'naranja' | 'rojo';

interface TrafficLightProps {
  porcentajeUsado: number;
}

interface StatusInfo {
  color: StatusColor;
  label: string;
  subtext: string;
}

export function TrafficLight({ porcentajeUsado }: TrafficLightProps) {
  const getStatus = (porcentaje: number): StatusInfo => {
    if (porcentaje >= 100) return { color: 'rojo', label: '¡ALERTA!', subtext: 'Has excedido tu presupuesto' };
    if (porcentaje >= 90) return { color: 'naranja', label: '¡CUIDADO!', subtext: 'Casi llegas al límite' };
    if (porcentaje >= 75) return { color: 'amarillo', label: 'PRECAUCIÓN', subtext: 'Vas por 3/4 del presupuesto' };
    return { color: 'verde', label: 'TODO OK', subtext: 'Gastos bajo control' };
  };

  const status = getStatus(porcentajeUsado);

  const colorClasses: Record<StatusColor, string> = {
    verde: 'bg-green-500 shadow-green-500/50',
    amarillo: 'bg-yellow-500 shadow-yellow-500/50',
    naranja: 'bg-orange-500 shadow-orange-500/50',
    rojo: 'bg-red-500 shadow-red-500/50',
  };

  const bgClasses: Record<StatusColor, string> = {
    verde: 'from-green-50 to-green-100 border-green-200',
    amarillo: 'from-yellow-50 to-yellow-100 border-yellow-200',
    naranja: 'from-orange-50 to-orange-100 border-orange-200',
    rojo: 'from-red-50 to-red-100 border-red-200',
  };

  const textClasses: Record<StatusColor, string> = {
    verde: 'text-green-900',
    amarillo: 'text-yellow-900',
    naranja: 'text-orange-900',
    rojo: 'text-red-900',
  };

  return (
    <div className={`rounded-lg border p-4 ${bgClasses[status.color]}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Status Label and Icon */}
        <div className="flex items-center gap-2">
          <span className="text-lg flex-shrink-0">
            {status.color === 'verde' && '✅'}
            {status.color === 'amarillo' && '⚠️'}
            {status.color === 'naranja' && '🔶'}
            {status.color === 'rojo' && '🚨'}
          </span>
          <div>
            <p className={`text-sm font-bold ${textClasses[status.color]}`}>
              {status.label}
            </p>
            <p className={`text-xs ${textClasses[status.color]} opacity-75`}>
              {porcentajeUsado}% del presupuesto
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 min-w-0">
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full ${colorClasses[status.color]}`}
              style={{ width: `${Math.min(porcentajeUsado, 100)}%` }}
            />
          </div>
        </div>

        {/* Percentage Badge */}
        <div className="text-right flex-shrink-0">
          <p className={`text-lg font-bold ${textClasses[status.color]}`}>
            {porcentajeUsado}%
          </p>
        </div>
      </div>
    </div>
  );
}
