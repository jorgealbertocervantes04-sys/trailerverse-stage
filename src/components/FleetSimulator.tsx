import { useMemo, useState } from "react";

type Escenario = {
  id: string;
  nombre: string;
  desc: string;
  unidades: number;
  inversion: number; // inversión inicial por unidad (enganche o compra)
  kmMes: number; // km recorridos por unidad al mes
  tarifa: number; // MXN por km facturado al cliente
  vacio: number; // % de km en vacío (no facturados)
};

const escenarios: Escenario[] = [
  {
    id: "solo",
    nombre: "Hombre-camión",
    desc: "1 unidad usada, tú manejas. Mínima inversión, máximo desgaste personal.",
    unidades: 1,
    inversion: 650000,
    kmMes: 12000,
    tarifa: 32,
    vacio: 0.22,
  },
  {
    id: "micro",
    nombre: "Micro flota",
    desc: "3 unidades seminuevas con operadores. Empiezas a dirigir en vez de manejar.",
    unidades: 3,
    inversion: 900000,
    kmMes: 13000,
    tarifa: 33,
    vacio: 0.18,
  },
  {
    id: "consolidada",
    nombre: "Flota consolidada",
    desc: "8 unidades, taller propio y despacho. Economía de escala real.",
    unidades: 8,
    inversion: 1200000,
    kmMes: 14000,
    tarifa: 34,
    vacio: 0.14,
  },
  {
    id: "premium",
    nombre: "Flota nueva a crédito",
    desc: "5 unidades nuevas financiadas. Menos fallas, más mensualidad.",
    unidades: 5,
    inversion: 2400000,
    kmMes: 15000,
    tarifa: 36,
    vacio: 0.12,
  },
];

const mxn = (n: number) =>
  n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export function FleetSimulator() {
  const [sel, setSel] = useState("micro");
  const [diesel, setDiesel] = useState(26); // MXN/litro
  const [rendimiento, setRendimiento] = useState(2.4); // km/litro

  const esc = escenarios.find((e) => e.id === sel) ?? escenarios[0]!;

  const r = useMemo(() => {
    const kmAnioUnidad = esc.kmMes * 12;
    const kmFacturados = kmAnioUnidad * (1 - esc.vacio);
    const ingresoUnidad = kmFacturados * esc.tarifa;

    const combustible = (kmAnioUnidad / rendimiento) * diesel;
    const operador = esc.id === "solo" ? 0 : 210000; // sueldo + prestaciones
    const mantenimiento = kmAnioUnidad * 2.2;
    const llantas = kmAnioUnidad * 0.85;
    const casetas = kmAnioUnidad * 1.6;
    const seguros = 78000;
    const permisos = 26000;
    const admin = esc.unidades >= 5 ? 95000 : 55000;
    const financiamiento = esc.id === "premium" ? 620000 : esc.id === "consolidada" ? 180000 : 0;

    const costos = [
      { l: "Diésel", v: combustible },
      { l: "Operador", v: operador },
      { l: "Mantenimiento", v: mantenimiento },
      { l: "Llantas", v: llantas },
      { l: "Casetas", v: casetas },
      { l: "Seguros", v: seguros },
      { l: "Permisos SCT y verificaciones", v: permisos },
      { l: "Administración y despacho", v: admin },
      { l: "Financiamiento", v: financiamiento },
    ].filter((c) => c.v > 0);

    const costoUnidad = costos.reduce((a, c) => a + c.v, 0);
    const utilidadUnidad = ingresoUnidad - costoUnidad;

    const ingresoTotal = ingresoUnidad * esc.unidades;
    const costoTotal = costoUnidad * esc.unidades;
    const utilidadTotal = utilidadUnidad * esc.unidades;
    const inversionTotal = esc.inversion * esc.unidades;

    return {
      costos,
      kmAnioUnidad,
      ingresoUnidad,
      costoUnidad,
      utilidadUnidad,
      ingresoTotal,
      costoTotal,
      utilidadTotal,
      inversionTotal,
      margen: (utilidadTotal / ingresoTotal) * 100,
      costoPorKm: costoUnidad / kmAnioUnidad,
      retorno: utilidadTotal > 0 ? inversionTotal / utilidadTotal : Infinity,
    };
  }, [esc, diesel, rendimiento]);

  const maxCosto = Math.max(...r.costos.map((c) => c.v));

  return (
    <div className="mt-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {escenarios.map((e) => {
          const on = e.id === sel;
          return (
            <button
              key={e.id}
              onClick={() => setSel(e.id)}
              aria-pressed={on}
              className={`rounded-lg border p-5 text-left transition-colors backdrop-blur-md ${
                on
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/70 hover:border-primary/50"
              }`}
            >
              <span className="text-[11px] uppercase tracking-[0.3em] text-primary">
                {e.unidades} {e.unidades === 1 ? "unidad" : "unidades"}
              </span>
              <h3 className="mt-2 text-lg font-semibold uppercase">{e.nombre}</h3>
              <p className="mt-2 text-xs text-muted-foreground">{e.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Precio del diésel · {mxn(diesel)}/L
          </span>
          <input
            type="range"
            min={18}
            max={38}
            step={0.5}
            value={diesel}
            onChange={(ev) => setDiesel(Number(ev.target.value))}
            className="mt-3 w-full accent-[hsl(var(--primary))]"
            style={{ accentColor: "var(--primary)" }}
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Rendimiento · {rendimiento.toFixed(1)} km/L
          </span>
          <input
            type="range"
            min={1.6}
            max={3.4}
            step={0.1}
            value={rendimiento}
            onChange={(ev) => setRendimiento(Number(ev.target.value))}
            className="mt-3 w-full"
            style={{ accentColor: "var(--primary)" }}
          />
        </label>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { l: "Ingreso anual", v: mxn(r.ingresoTotal) },
          { l: "Costo anual", v: mxn(r.costoTotal) },
          {
            l: "Utilidad anual",
            v: mxn(r.utilidadTotal),
            hi: true,
          },
          { l: "Margen", v: `${r.margen.toFixed(1)}%` },
        ].map((k) => (
          <div
            key={k.l}
            className={`rounded-lg border p-6 backdrop-blur-md ${
              k.hi ? "border-primary/60 bg-primary/10" : "border-border bg-card/70"
            }`}
            style={{ boxShadow: "var(--shadow-deep)" }}
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{k.l}</p>
            <p
              className={`mt-2 font-display text-2xl md:text-3xl ${
                k.hi ? "text-gradient-amber" : ""
              }`}
            >
              {k.v}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md">
          <h3 className="text-lg font-semibold uppercase">Desglose de costos por unidad / año</h3>
          <ul className="mt-6 space-y-3">
            {r.costos.map((c) => (
              <li key={c.l}>
                <div className="flex items-baseline justify-between text-sm">
                  <span>{c.l}</span>
                  <span className="text-muted-foreground">{mxn(c.v)}</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${(c.v / maxCosto) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md">
          <h3 className="text-lg font-semibold uppercase">La verdad detrás del número</h3>
          <dl className="mt-6 space-y-4 text-sm">
            {[
              ["Inversión inicial total", mxn(r.inversionTotal)],
              ["Km al año por unidad", r.kmAnioUnidad.toLocaleString("es-MX")],
              ["Km en vacío (no se cobran)", `${Math.round(esc.vacio * 100)}%`],
              ["Costo real por km", mxn(r.costoPorKm)],
              ["Tarifa cobrada por km", mxn(esc.tarifa)],
              ["Utilidad por unidad", mxn(r.utilidadUnidad)],
              [
                "Recuperación de la inversión",
                r.retorno === Infinity ? "No se recupera" : `${r.retorno.toFixed(1)} años`,
              ],
            ].map(([l, v]) => (
              <div key={l} className="flex items-baseline justify-between border-b border-border/60 pb-2">
                <dt className="text-muted-foreground">{l}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-muted-foreground">
            Mueve el diésel a {mxn(34)} y verás cómo se evapora la utilidad: en este oficio el
            margen no vive en la tarifa, vive en el control de costos y en los días que tardan en
            pagarte.
          </p>
        </div>
      </div>
    </div>
  );
}
