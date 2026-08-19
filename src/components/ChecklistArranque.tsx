import { useState } from "react";

const items = [
  { g: "Dinero", t: "Tengo el enganche sin tocar el gasto de mi casa" },
  { g: "Dinero", t: "Tengo colchón para 3 meses de operación (diésel, casetas, sueldos)" },
  { g: "Dinero", t: "Tengo reserva separada para una reparación mayor" },
  { g: "Unidad", t: "Sé qué configuración necesita la carga que quiero mover" },
  { g: "Unidad", t: "Voy a llevar la unidad a revisión mecánica independiente antes de pagar" },
  { g: "Unidad", t: "Revisé factura original, adeudos, reporte de robo y número de serie" },
  { g: "Legal", t: "Definí si opero como persona física o moral" },
  { g: "Legal", t: "Tengo o inicié el trámite de permiso SICT y placas federales" },
  { g: "Legal", t: "Contraté seguro de responsabilidad civil y de carga" },
  { g: "Legal", t: "Puedo emitir factura con complemento carta porte" },
  { g: "Operación", t: "Tengo al menos un cliente o broker con carga real, no promesas" },
  { g: "Operación", t: "Calculé mi costo por km y sé mi tarifa mínima" },
  { g: "Operación", t: "Sé cuántos días tarda en pagarme mi cliente" },
  { g: "Operación", t: "Tengo un plan si el operador renuncia en el mes uno" },
];

export function ChecklistArranque() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const n = Object.values(done).filter(Boolean).length;
  const pct = Math.round((n / items.length) * 100);
  const veredicto =
    pct === 100
      ? "Estás listo. Compra con la cabeza fría."
      : pct >= 70
        ? "Vas bien, pero los pendientes son justo los que quiebran negocios."
        : pct >= 40
          ? "Todavía no. Estás comprando un trailer, no montando una empresa."
          : "Alto. Hoy comprar sería apostar, no invertir.";

  const grupos = [...new Set(items.map((i) => i.g))];

  return (
    <div className="mt-12">
      <div className="rounded-lg border border-primary/50 bg-primary/5 p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Preparación · {n} de {items.length}
          </p>
          <p className="font-display text-3xl text-gradient-amber">{pct}%</p>
        </div>
        <div className="mt-3 h-1.5 w-full rounded-full bg-muted/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-4 text-sm">{veredicto}</p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {grupos.map((g) => (
          <div key={g} className="rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{g}</h3>
            <ul className="mt-4 space-y-3">
              {items.map((it, i) =>
                it.g !== g ? null : (
                  <li key={it.t}>
                    <button
                      onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                      aria-pressed={!!done[i]}
                      className="flex w-full items-start gap-3 text-left text-sm"
                    >
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border text-xs ${
                          done[i]
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        }`}
                      >
                        {done[i] ? "✓" : ""}
                      </span>
                      <span className={done[i] ? "text-muted-foreground line-through" : ""}>
                        {it.t}
                      </span>
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
