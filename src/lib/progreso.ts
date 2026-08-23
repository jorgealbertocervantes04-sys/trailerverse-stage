import { useCallback, useEffect, useState } from "react";

export type Ruta = {
  carga: string | null;
  crecimiento: string | null;
};

export type Progreso = {
  estacion: number;
  estacionId: string | null;
  km: number;
  ruta: Ruta;
  actualizado: number;
};

const KEY = "ruta-trailer-progreso-v1";

export const progresoVacio: Progreso = {
  estacion: 0,
  estacionId: null,
  km: 0,
  ruta: { carga: null, crecimiento: null },
  actualizado: 0,
};

export function leerProgreso(): Progreso | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Progreso>;
    if (typeof p.estacion !== "number") return null;
    return { ...progresoVacio, ...p, ruta: { ...progresoVacio.ruta, ...(p.ruta ?? {}) } };
  } catch {
    return null;
  }
}

export function guardarProgreso(p: Progreso) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...p, actualizado: Date.now() }));
  } catch {
    /* almacenamiento no disponible */
  }
}

export function borrarProgreso() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

/** Carga el progreso guardado una sola vez, tras la hidratación. */
export function useProgresoGuardado() {
  const [guardado, setGuardado] = useState<Progreso | null>(null);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    setGuardado(leerProgreso());
    setListo(true);
  }, []);

  const limpiar = useCallback(() => {
    borrarProgreso();
    setGuardado(null);
  }, []);

  return { guardado, listo, limpiar };
}
