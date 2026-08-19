import { useState } from "react";

const faqs = [
  {
    q: "¿Conviene más comprar un trailer nuevo o usado para empezar?",
    a: "Usado bien inspeccionado, si tu capital es limitado: entras con menos deuda y aprendes el oficio sin una mensualidad ahogándote. Nuevo tiene sentido cuando ya tienes carga asegurada y contratos que aguanten el financiamiento. El error clásico es comprar nuevo con la esperanza de conseguir clientes después.",
  },
  {
    q: "¿Cuánto dinero necesito realmente para arrancar?",
    a: "Además del enganche de la unidad, calcula un colchón de 3 a 6 meses de operación: diésel, casetas, sueldo del operador, seguros y mantenimiento. Muchos quiebran no por falta de fletes, sino porque el cliente paga a 60 días y ellos gastan cada semana.",
  },
  {
    q: "¿Puedo operar como persona física o necesito una empresa?",
    a: "Puedes empezar como persona física con actividad empresarial, pero muchos clientes grandes solo contratan personas morales con permiso SCT vigente, póliza de responsabilidad civil y capacidad de facturar. Formalizarte abre las cargas mejor pagadas.",
  },
  {
    q: "¿Qué permisos son obligatorios?",
    a: "Permiso SCT/SICT de autotransporte federal de carga, placas federales, licencia federal del operador, verificación físico-mecánica, seguro de responsabilidad civil por daños a terceros y a la carga. Si mueves materiales peligrosos, permisos y capacitación adicionales.",
  },
  {
    q: "¿Cómo consigo mis primeros clientes o fletes?",
    a: "Al principio casi todos empiezan subcontratados por otro transportista o vía bolsas de carga y brokers: pagan menos, pero te dan volumen y experiencia. El cliente directo llega cuando ya tienes historial de entregas puntuales y puedes documentarlo.",
  },
  {
    q: "¿Cuánto debo cobrar por kilómetro?",
    a: "Primero calcula tu costo real por km (diésel, mantenimiento, llantas, casetas, operador, seguros, administración y depreciación). Sobre ese número agregas tu margen. Cobrar 'lo que cobra el mercado' sin conocer tu costo es la forma más rápida de trabajar gratis.",
  },
  {
    q: "¿Y los kilómetros en vacío?",
    a: "Regresar sin carga es normal, pero cada punto porcentual de vacío te come utilidad porque el diésel y el desgaste sí se pagan. Reducirlo con carga de retorno es una de las palancas de rentabilidad más grandes del negocio.",
  },
  {
    q: "¿Cómo encuentro y conservo buenos operadores?",
    a: "La rotación es el dolor silencioso del sector. Se retiene con pago puntual, unidad en buen estado, trato digno y reglas claras, no solo con sueldo alto. Un operador estable cuida la unidad, la carga y a tu cliente.",
  },
  {
    q: "¿Qué pasa si el cliente no me paga?",
    a: "Sin carta porte, evidencia de entrega firmada y contrato, tu cobranza es una conversación. Con documentación, es un adeudo exigible. Antes de dar crédito, investiga al cliente y define límites de exposición por cliente.",
  },
  {
    q: "¿Cuándo es momento de comprar la segunda unidad?",
    a: "Cuando la primera genera utilidad estable, tienes carga que rechazar por falta de capacidad y un fondo de reserva para reparaciones mayores. Crecer con la unidad uno todavía inestable solo multiplica el problema.",
  },
  {
    q: "¿Cuáles son los gastos que nadie te advierte?",
    a: "Reparaciones mayores de motor y transmisión, llantas al mismo tiempo, tiempos muertos de carga y descarga, corralones, robos y extorsión en carretera, actualizaciones fiscales y multas por documentación vencida.",
  },
  {
    q: "¿Es realmente un negocio rentable?",
    a: "Sí, pero con márgenes que viven en el control de costos, no en la tarifa. Quien lleva números diarios, mantiene sus unidades y cobra a tiempo, construye una empresa sólida. Quien lo lleva 'de memoria' trabaja mucho y termina descapitalizado.",
  },
];

export function FaqNovato() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-12 grid gap-3 lg:grid-cols-2">
      {faqs.map((f, i) => {
        const on = open === i;
        return (
          <div
            key={f.q}
            className={`h-fit rounded-lg border backdrop-blur-md transition-colors ${
              on ? "border-primary/60 bg-primary/5" : "border-border bg-card/70"
            }`}
          >
            <button
              onClick={() => setOpen(on ? null : i)}
              aria-expanded={on}
              className="flex w-full items-start justify-between gap-4 p-5 text-left"
            >
              <span className="text-sm font-semibold uppercase tracking-wide">{f.q}</span>
              <span className="mt-0.5 shrink-0 font-display text-xl text-primary">
                {on ? "−" : "+"}
              </span>
            </button>
            {on && <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
