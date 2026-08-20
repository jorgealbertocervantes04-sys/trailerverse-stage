import { useState } from "react";

type Unidad = {
  id: string;
  nombre: string;
  perfil: string;
  precio: string;
  rendimiento: string;
  refacciones: string;
  reventa: string;
  taller: string;
  pros: string[];
  contras: string[];
};

const unidades: Unidad[] = [
  {
    id: "usada",
    nombre: "Tractocamión usado 2012–2015",
    perfil: "Entrada al oficio con capital limitado",
    precio: "$550,000 – $850,000",
    rendimiento: "1.9 – 2.2 km/L",
    refacciones: "Abundantes y económicas",
    reventa: "Baja, pero se deprecia poco más",
    taller: "Alta frecuencia de visitas",
    pros: ["Entras sin deuda grande", "Refacción en cualquier ciudad", "Aprendes sin presión bancaria"],
    contras: ["Fallas imprevistas", "Más días parado", "Clientes grandes piden unidad más nueva"],
  },
  {
    id: "seminueva",
    nombre: "Seminuevo 2018–2020",
    perfil: "El punto dulce para la mayoría",
    precio: "$1,100,000 – $1,600,000",
    rendimiento: "2.3 – 2.6 km/L",
    refacciones: "Disponibles, precio medio",
    reventa: "Buena",
    taller: "Mantenimiento programado",
    pros: ["Equilibrio costo-confiabilidad", "Aceptado por clientes formales", "Menos días parado"],
    contras: ["Requiere enganche fuerte", "Garantía ya vencida", "Electrónica más costosa de reparar"],
  },
  {
    id: "nueva",
    nombre: "Unidad nueva a crédito",
    perfil: "Solo con contratos firmados",
    precio: "$2,300,000 – $3,000,000",
    rendimiento: "2.7 – 3.1 km/L",
    refacciones: "Concesionario, caras",
    reventa: "Alta los primeros años",
    taller: "Garantía y servicio de agencia",
    pros: ["Muy pocas fallas", "Mejor rendimiento de diésel", "Atrae y retiene operadores"],
    contras: ["Mensualidad que no perdona", "Depreciación fuerte año 1", "Sin carga fija, te ahoga"],
  },
];

export function ComparadorUnidades() {
  const [sel, setSel] = useState<string[]>(["usada", "seminueva"]);

  const toggle = (id: string) =>
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id].slice(-3)));

  const filas: [string, keyof Unidad][] = [
    ["Precio típico", "precio"],
    ["Rendimiento", "rendimiento"],
    ["Refacciones", "refacciones"],
    ["Valor de reventa", "reventa"],
    ["Taller", "taller"],
  ];

  const activos = unidades.filter((u) => sel.includes(u.id));

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-3">
        {unidades.map((u) => {
          const on = sel.includes(u.id);
          return (
            <button
              key={u.id}
              onClick={() => toggle(u.id)}
              aria-pressed={on}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                on
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card/70 text-muted-foreground hover:border-primary/50"
              }`}
            >
              {u.nombre.split(" ").slice(0, 2).join(" ")}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {activos.map((u) => (
          <article
            key={u.id}
            className="rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md"
            style={{ boxShadow: "var(--shadow-deep)" }}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-primary">{u.perfil}</span>
            <h3 className="mt-2 text-lg font-semibold uppercase">{u.nombre}</h3>
            <dl className="mt-5 space-y-2 text-sm">
              {filas.map(([l, k]) => (
                <div key={l} className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5">
                  <dt className="text-muted-foreground">{l}</dt>
                  <dd className="text-right font-medium">{u[k] as string}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-5 space-y-1.5 text-xs">
              {u.pros.map((p) => (
                <li key={p} className="text-primary">+ {p}</li>
              ))}
              {u.contras.map((c) => (
                <li key={c} className="text-muted-foreground">− {c}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      {activos.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">Selecciona al menos una unidad para comparar.</p>
      )}
    </div>
  );
}
