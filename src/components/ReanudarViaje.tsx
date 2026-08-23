type Props = {
  etiqueta: string;
  estacion: number;
  km: number;
  onReanudar: () => void;
  onReiniciar: () => void;
};

export function ReanudarViaje({ etiqueta, estacion, km, onReanudar, onReiniciar }: Props) {
  return (
    <div className="fixed inset-x-4 bottom-28 z-50 mx-auto max-w-md rounded-xl border border-primary/50 bg-card/95 p-5 backdrop-blur-md md:bottom-24 md:left-auto md:right-6 md:mx-0">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Viaje en curso guardado
      </p>
      <p className="mt-2 text-sm">
        Te quedaste en la estación{" "}
        <span className="text-primary">
          {String(estacion).padStart(2, "0")} · {etiqueta}
        </span>{" "}
        con {km.toLocaleString("es-MX")} km recorridos.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onReanudar}
          className="flex-1 rounded-full bg-primary px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-primary-foreground"
        >
          Retomar viaje
        </button>
        <button
          type="button"
          onClick={onReiniciar}
          className="rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
        >
          Empezar de cero
        </button>
      </div>
    </div>
  );
}
