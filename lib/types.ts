export interface Gasto {
  id: string;
  usuario_id: string;
  monto: number;
  tarjeta: 'bogota' | 'rappi';
  categoria: Categoria;
  comercio: string;
  fecha: string;
  cuotas?: number;
  cuotas_restantes?: number;
  created_at: string;
}

export type Categoria =
  | 'gastos-fijos'
  | 'ropa-y-compras'
  | 'fines-semana'
  | 'entre-semana'
  | 'pañales-y-leche'
  | 'otros-gastos';

export interface Presupuesto {
  id: string;
  usuario_id: string;
  tarjeta: 'bogota' | 'rappi';
  categoria: Categoria;
  monto_maximo: number;
  created_at: string;
  updated_at: string;
}

export interface Alerta {
  id: string;
  usuario_id: string;
  tarjeta: 'bogota' | 'rappi';
  categoria: Categoria;
  porcentaje_usado: number;
  nivel: 'verde' | 'amarillo' | 'naranja' | 'rojo';
  created_at: string;
}

export interface DashboardData {
  presupuestoTotal: number;
  gastado: number;
  disponible: number;
  porcentajeUsado: number;
  gastosPorTarjeta: {
    bogota: number;
    rappi: number;
  };
  gastosPorCategoria: Record<Categoria, number>;
  alertas: Alerta[];
}
