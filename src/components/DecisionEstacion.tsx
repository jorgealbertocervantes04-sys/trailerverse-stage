export type Opcion = {
  id: string;
  label: string;
  resumen: string;
  desvio: string;
};

type Props = {
  pregunta: string;
  intro: string;
  opciones: Opcion[];
  valor: string | null;
  onElegir: (id: string) => void;
};

export function DecisionEstacion({ pregunta, intro, opciones, valor, onElegir }: Props) {
  return (
    <div className="mt-10 rounded-xl border border-primary/40 bg-card/70 p-6 backdrop-blur-md md:p-8">
      <p className="text-[11px] uppercase tracking-[0.35em] text-primary">Desvío en la ruta</p>
      <h3 className="mt-3 text-2xl font-bold uppercase md:text-3xl">{pregunta}</h3>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{intro}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {opciones.map((o) => {
          const on = valor === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onElegir(o.id)}
              aria-pressed={on}
              className={`rounded-lg border p-5 text-left transition-all ${
                on
                  ? "border-primary bg-primary/15 shadow-[var(--glow-amber)]"
                  : "border-border bg-background/40 hover:border-primary/60"
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent">{o.desvio}</span>
              <p className="mt-2 text-lg font-semibold uppercase">{o.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{o.resumen}</p>
              <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-primary">
                {on ? "Ruta tomada ✓" : "Tomar esta ruta →"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type RamaProps = {
  titulo: string;
  descripcion: string;
  puntos: { t: string; d: string }[];
};

export function RamaCapitulo({ titulo, descripcion, puntos }: RamaProps) {
  return (
    <div className="mt-10 animate-fade-in rounded-xl border border-border bg-background/50 p-6 backdrop-blur-md md:p-8">
      <p className="text-[11px] uppercase tracking-[0.35em] text-primary">Tu capítulo</p>
      <h3 className="mt-3 text-2xl font-bold uppercase md:text-4xl">{titulo}</h3>
      <p className="mt-4 max-w-2xl text-muted-foreground">{descripcion}</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {puntos.map((p) => (
          <article key={p.t} className="rounded-lg border border-border bg-card/70 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-wide">{p.t}</h4>
            <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
