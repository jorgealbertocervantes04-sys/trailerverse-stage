import { useState } from "react";

const riesgos = [
  {
    t: "Robo de carga en carretera",
    r: "Tramos rojos, falsos retenes y descargas exprés. El robo puede costar más que la unidad misma.",
    m: "Monitoreo GPS con botón de pánico, rutas y horarios variables, prohibir paradas fuera de puntos autorizados, seguro de carga con cobertura real y no solo responsabilidad civil.",
  },
  {
    t: "Extorsión y derecho de piso",
    r: "En ciertas rutas te cobran por pasar. Nadie lo factura, pero sale del mismo bolsillo.",
    m: "Evalúa rentabilidad por ruta, no solo por tarifa. Hay fletes que se rechazan y eso también es administrar.",
  },
  {
    t: "Accidente con terceros",
    r: "Un choque con daños a terceros sin póliza suficiente puede terminar con la empresa en un solo día.",
    m: "Póliza de responsabilidad civil amplia, capacitación del operador, mantenimiento de frenos y llantas documentado, política de cero alcohol y control de fatiga.",
  },
  {
    t: "Unidad detenida en corralón",
    r: "Documentos vencidos, exceso de peso o carta porte mal emitida: la unidad se detiene y el cliente se molesta.",
    m: "Calendario de vencimientos, verificación físico-mecánica al día, báscula antes de salir y revisión del complemento fiscal en cada viaje.",
  },
  {
    t: "Falla mayor de motor o transmisión",
    r: "Una reparación mayor cuesta lo que ganas en varios meses y llega sin avisar.",
    m: "Fondo de reserva por unidad, mantenimiento preventivo por kilometraje y análisis de aceite; no esperar a que truene.",
  },
  {
    t: "Cliente que no paga",
    r: "Entregaste, facturaste y a los 90 días sigues esperando mientras el diésel se paga semanal.",
    m: "Investiga al cliente, define límite de crédito, exige evidencia de entrega firmada y contrato, y no concentres más del 30% de tu facturación en un solo cliente.",
  },
];

export function RiesgosInteractivos() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {riesgos.map((x, i) => {
        const on = open === i;
        return (
          <button
            key={x.t}
            onClick={() => setOpen(on ? null : i)}
            aria-pressed={on}
            className={`rounded-lg border p-6 text-left backdrop-blur-md transition-colors ${
              on ? "border-primary bg-primary/10" : "border-border bg-card/70 hover:border-primary/50"
            }`}
            style={{ boxShadow: "var(--shadow-deep)" }}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-primary">
              {on ? "Cómo se mitiga" : "Riesgo"}
            </span>
            <h3 className="mt-2 text-base font-semibold uppercase">{x.t}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{on ? x.m : x.r}</p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-primary/70">
              {on ? "Ver riesgo ↺" : "Ver mitigación →"}
            </p>
          </button>
        );
      })}
    </div>
  );
}
