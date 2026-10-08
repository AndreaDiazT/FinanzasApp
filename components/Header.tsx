'use client';

import { useEffect, useState } from 'react';

export function Header() {
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString('es-CO', {
        month: 'short',
        day: 'numeric',
      })
    );
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mi Finanzas</h1>
              <p className="text-xs text-gray-500">Control de gastos en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Hoy</p>
              <p className="font-semibold text-gray-900">{date}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
