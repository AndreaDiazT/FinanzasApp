import { DashboardData, Gasto, Categoria } from './types';

export const presupuestos = {
  bogota: {
    'gastos-fijos': 800410,
    'ropa-y-compras': 500000,
    'fines-semana': 1200000,
    'entre-semana': 400000,
  },
  rappi: {
    'pañales-y-leche': 1100000,
    'otros-gastos': 900000,
  },
};

export const gastosSimulados: Gasto[] = [
  {
    id: '1',
    usuario_id: 'user-1',
    monto: 125000,
    tarjeta: 'bogota',
    categoria: 'ropa-y-compras',
    comercio: 'D1 Selección',
    fecha: '2026-10-06',
    created_at: '2026-10-06T10:00:00Z',
  },
  {
    id: '2',
    usuario_id: 'user-1',
    monto: 87000,
    tarjeta: 'rappi',
    categoria: 'pañales-y-leche',
    comercio: 'Rappi - Domicilio',
    fecha: '2026-10-05T20:30:00Z',
    created_at: '2026-10-05T20:30:00Z',
  },
  {
    id: '3',
    usuario_id: 'user-1',
    monto: 320000,
    tarjeta: 'bogota',
    categoria: 'ropa-y-compras',
    comercio: 'Zara',
    fecha: '2026-10-04',
    created_at: '2026-10-04T15:00:00Z',
  },
  {
    id: '4',
    usuario_id: 'user-1',
    monto: 12000,
    tarjeta: 'bogota',
    categoria: 'entre-semana',
    comercio: 'Café Juan Valdez',
    fecha: '2026-10-03',
    created_at: '2026-10-03T08:00:00Z',
  },
  {
    id: '5',
    usuario_id: 'user-1',
    monto: 450000,
    tarjeta: 'bogota',
    categoria: 'fines-semana',
    comercio: 'Centro Comercial',
    fecha: '2026-10-02',
    created_at: '2026-10-02T18:00:00Z',
  },
  {
    id: '6',
    usuario_id: 'user-1',
    monto: 150000,
    tarjeta: 'rappi',
    categoria: 'pañales-y-leche',
    comercio: 'Farmacia',
    fecha: '2026-10-01',
    created_at: '2026-10-01T12:00:00Z',
  },
];

export const calcularDashboard = (gastos: Gasto[], timestamp?: string): DashboardData => {
  const createdAt = timestamp || '2026-10-06T16:00:00Z';
  const presupuestoTotal =
    Object.values(presupuestos.bogota).reduce((a, b) => a + b, 0) +
    Object.values(presupuestos.rappi).reduce((a, b) => a + b, 0);

  const gastado = gastos.reduce((sum, g) => sum + g.monto, 0);
  const disponible = presupuestoTotal - gastado;

  const gastosPorTarjeta = {
    bogota: gastos.filter(g => g.tarjeta === 'bogota').reduce((sum, g) => sum + g.monto, 0),
    rappi: gastos.filter(g => g.tarjeta === 'rappi').reduce((sum, g) => sum + g.monto, 0),
  };

  const gastosPorCategoria: Record<string, number> = {};
  gastos.forEach(g => {
    gastosPorCategoria[g.categoria] = (gastosPorCategoria[g.categoria] || 0) + g.monto;
  });

  // Calcular alertas
  const alertas: DashboardData['alertas'] = [];
  const categoriasMap = {
    'bogota': ['gastos-fijos', 'ropa-y-compras', 'fines-semana', 'entre-semana'] as const,
    'rappi': ['pañales-y-leche', 'otros-gastos'] as const,
  };

  Object.entries(categoriasMap).forEach(([tarjeta, categorias]) => {
    categorias.forEach((cat) => {
      const presupuesto = tarjeta === 'bogota'
        ? presupuestos.bogota[cat as keyof typeof presupuestos.bogota]
        : presupuestos.rappi[cat as keyof typeof presupuestos.rappi];

      const gasto = gastosPorCategoria[cat as Categoria] || 0;
      const porcentaje = (gasto / presupuesto) * 100;

      let nivel: 'verde' | 'amarillo' | 'naranja' | 'rojo' = 'verde';
      if (porcentaje >= 100) nivel = 'rojo';
      else if (porcentaje >= 90) nivel = 'naranja';
      else if (porcentaje >= 75) nivel = 'amarillo';

      alertas.push({
        id: `alert-${tarjeta}-${cat}`,
        usuario_id: 'user-1',
        tarjeta: tarjeta as 'bogota' | 'rappi',
        categoria: cat as Categoria,
        porcentaje_usado: Math.round(porcentaje),
        nivel,
        created_at: createdAt,
      });
    });
  });

  return {
    presupuestoTotal,
    gastado,
    disponible,
    porcentajeUsado: Math.round((gastado / presupuestoTotal) * 100),
    gastosPorTarjeta,
    gastosPorCategoria,
    alertas: alertas.filter(a => a.porcentaje_usado >= 50),
  };
};

export const nombreCategoria = (cat: string): string => {
  const nombres: Record<string, string> = {
    'gastos-fijos': '🏠 Gastos fijos',
    'ropa-y-compras': '🛍️ Ropa y compras',
    'fines-semana': '🎉 Fines de semana',
    'entre-semana': '☕ Entre semana',
    'pañales-y-leche': '👶 Pañales y leche',
    'otros-gastos': '📦 Otros gastos/domicilios',
  };
  return nombres[cat] || cat;
};
