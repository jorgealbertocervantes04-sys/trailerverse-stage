import { useMemo, useState } from "react";

const mxn = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 });

type Campo = { k: keyof Datos; l: string; min: number; max: number; step: number; sufijo: string };

type Datos = {
  kmMes: number;
  diesel: number;
  rendimiento: number;
  operador: number;
  fijos: number;
  vacio: number;
  margen: number;
};

const campos: Campo[] = [
  { k: "kmMes", l: "Km al mes", min: 3000, max: 25000, step: 500, sufijo: " km" },
  { k: "diesel", l: "Precio del diésel", min: 18, max: 40, step: 0.5, sufijo: " $/L" },
  { k: "rendimiento", l: "Rendimiento", min: 1.4, max: 3.6, step: 0.1, sufijo: " km/L" },
  { k: "operador", l: "Operador al mes", min: 0, max: 40000, step: 1000, sufijo: " $" },
  { k: "fijos", l: "Fijos al mes (seguros, permisos, admin)", min: 3000, max: 60000, step: 1000, sufijo: " $" },
  { k: "vacio", l: "Km en vacío", min: 0, max: 45, step: 1, sufijo: " %" },
  { k: "margen", l: "Margen deseado", min: 5, max: 45, step: 1, sufijo: " %" },
];

export function CalculadoraTarifa() {
  const [d, setD] = useState<Datos>({
    kmMes: 12000,
    diesel: 26,
    rendimiento: 2.4,
    operador: 17500,
    fijos: 14000,
    vacio: 18,
    margen: 20,
  });

  const r = useMemo(() => {
    const diesel = (d.kmMes / d.rendimiento) * d.diesel;
    const variables = d.kmMes * (2.2 + 0.85 + 1.6); // mantenimiento + llantas + casetas por km
    const costoMes = diesel + variables + d.operador + d.fijos;
    const kmFacturables = d.kmMes * (1 - d.vacio / 100);
    const costoPorKmFacturable = costoMes / Math.max(kmFacturables, 1);
    const tarifaMinima = costoPorKmFacturable / (1 - d.margen / 100);
    const utilidadMes = tarifaMinima * kmFacturables - costoMes;
    return { costoMes, kmFacturables, costoPorKmFacturable, tarifaMinima, utilidadMes, diesel };
  }, [d]);

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md">
        <h3 className="text-lg font-semibold uppercase">Tus números</h3>
        <div className="mt-6 space-y-5">
          {campos.map((c) => (
            <label key={c.k} className="block">
              <span className="flex items-baseline justify-between text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {c.l}
                <span className="text-primary">
                  {d[c.k].toLocaleString("es-MX")}
                  {c.sufijo}
                </span>
              </span>
              <input
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={d[c.k]}
                onChange={(e) => setD((p) => ({ ...p, [c.k]: Number(e.target.value) }))}
                className="mt-2 w-full"
                style={{ accentColor: "var(--primary)" }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div
          className="rounded-lg border border-primary/60 bg-primary/10 p-6 backdrop-blur-md"
          style={{ boxShadow: "var(--shadow-deep)" }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Tarifa mínima por km facturado
          </p>
          <p className="mt-2 font-display text-4xl text-gradient-amber">{mxn(r.tarifaMinima)}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Cobrar menos de esto significa financiar tú el flete de tu cliente.
          </p>
        </div>
        {[
          ["Costo total al mes", mxn(r.costoMes)],
          ["Solo diésel al mes", mxn(r.diesel)],
          ["Km facturables al mes", Math.round(r.kmFacturables).toLocaleString("es-MX")],
          ["Costo real por km facturado", mxn(r.costoPorKmFacturable)],
          ["Utilidad estimada al mes", mxn(r.utilidadMes)],
        ].map(([l, v]) => (
          <div
            key={l}
            className="flex items-baseline justify-between rounded-lg border border-border bg-card/70 px-5 py-4 text-sm backdrop-blur-md"
          >
            <span className="text-muted-foreground">{l}</span>
            <span className="font-semibold">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
