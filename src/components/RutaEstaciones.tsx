type Estacion = { id: string; label: string };

type Props = {
  estaciones: Estacion[];
  activo: number;
  progress: number;
};

const KM_TOTAL = 2400;

function Camion({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-hidden="true">
      <rect x="1" y="5" width="24" height="13" rx="1.5" fill="currentColor" opacity="0.85" />
      <path d="M27 8h8l6 6v4H27z" fill="currentColor" />
      <circle cx="9" cy="20" r="3" fill="currentColor" />
      <circle cx="33" cy="20" r="3" fill="currentColor" />
    </svg>
  );
}

export function RutaEstaciones({ estaciones, activo, progress }: Props) {
  const total = estaciones.length;
  const km = Math.round(progress * KM_TOTAL);
  const actual = estaciones[activo] ?? estaciones[0]!;
  const siguiente = estaciones[Math.min(activo + 1, total - 1)]!;
  const pct = total > 1 ? (activo / (total - 1)) * 100 : 0;

  return (
    <>
      {/* barra de avance del viaje */}
      <div className="fixed left-0 top-0 z-40 h-0.5 w-full bg-border/40">
        <div
          className="h-full transition-[width] duration-200"
          style={{ width: `${progress * 100}%`, background: "var(--gradient-amber)" }}
        />
      </div>

      {/* odómetro */}
      <div className="fixed right-4 top-4 z-40 hidden rounded-lg border border-border bg-card/80 px-4 py-3 text-right backdrop-blur-md md:block">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Odómetro</p>
        <p className="font-display text-2xl leading-none text-gradient-amber">
          {km.toLocaleString("es-MX")} km
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Estación {String(activo).padStart(2, "0")} / {String(total - 1).padStart(2, "0")}
        </p>
      </div>

      {/* carretera vertical con estaciones (desktop) */}
      <nav
        aria-label="Estaciones del recorrido"
        className="fixed left-5 top-1/2 z-30 hidden max-h-[82vh] -translate-y-1/2 md:block"
      >
        <div className="relative flex flex-col gap-3 py-2">
          {/* asfalto */}
          <span className="absolute left-[9px] top-0 h-full w-[18px] -translate-x-1/2 rounded-full bg-muted/30" />
          {/* raya central */}
          <span
            className="absolute left-[9px] top-0 h-full w-[2px] -translate-x-1/2"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, oklch(0.86 0.12 85 / 0.55) 0 10px, transparent 10px 22px)",
            }}
          />
          {/* tramo recorrido */}
          <span
            className="absolute left-[9px] top-0 w-[4px] -translate-x-1/2 rounded-full transition-[height] duration-500"
            style={{ height: `${pct}%`, background: "var(--gradient-amber)" }}
          />
          {/* camión que avanza */}
          <span
            className="absolute left-[9px] z-10 -translate-x-1/2 text-primary transition-[top] duration-500 ease-out"
            style={{ top: `calc(${pct}% - 10px)` }}
          >
            <Camion className="h-5 w-9 drop-shadow-[0_0_10px_oklch(0.78_0.17_68/0.7)]" />
          </span>

          {estaciones.map((e, i) => {
            const pasada = i < activo;
            const on = i === activo;
            return (
              <a
                key={e.id}
                href={`#${e.id}`}
                aria-current={on ? "true" : undefined}
                className="group relative flex items-center gap-3 pl-[26px] text-[11px] uppercase tracking-[0.2em]"
              >
                <span
                  className={`absolute left-[9px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border transition-all ${
                    on
                      ? "scale-150 border-primary bg-primary"
                      : pasada
                        ? "border-primary/60 bg-primary/50"
                        : "border-border bg-background"
                  }`}
                />
                <span
                  className={`whitespace-nowrap rounded-full px-2 py-0.5 transition-all ${
                    on
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {String(i).padStart(2, "0")} · {e.label}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* carretera horizontal (móvil) */}
      <nav
        aria-label="Estaciones del recorrido"
        className="fixed bottom-0 left-0 z-30 w-full border-t border-border bg-background/90 backdrop-blur-md md:hidden"
      >
        <div className="flex items-baseline justify-between px-4 pt-2 text-[10px] uppercase tracking-[0.25em]">
          <span className="text-primary">
            {String(activo).padStart(2, "0")} · {actual.label}
          </span>
          <span className="text-muted-foreground">{km.toLocaleString("es-MX")} km</span>
        </div>
        <div className="relative mx-4 mb-1 mt-2 h-[18px] rounded-full bg-muted/30">
          <span
            className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, oklch(0.86 0.12 85 / 0.5) 0 8px, transparent 8px 18px)",
            }}
          />
          <span
            className="absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full transition-[width] duration-500"
            style={{ width: `${pct}%`, background: "var(--gradient-amber)" }}
          />
          <span
            className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-primary transition-[left] duration-500"
            style={{ left: `${pct}%` }}
          >
            <Camion className="h-4 w-7" />
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1">
          {estaciones.map((e, i) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] ${
                i === activo
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {String(i).padStart(2, "0")} {e.label}
            </a>
          ))}
        </div>
      </nav>

      {/* siguiente estación */}
      {activo < total - 1 && (
        <a
          href={`#${siguiente.id}`}
          className="fixed bottom-6 right-4 z-40 hidden items-center gap-3 rounded-full border border-primary/50 bg-card/85 py-3 pl-5 pr-4 text-[11px] uppercase tracking-[0.25em] text-primary backdrop-blur-md transition-colors hover:bg-primary hover:text-primary-foreground md:flex"
        >
          Siguiente estación · {siguiente.label}
          <span aria-hidden="true">↓</span>
        </a>
      )}
    </>
  );
}
