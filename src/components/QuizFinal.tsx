import { useState } from "react";

const preguntas = [
  {
    q: "Un cliente te ofrece un flete a $24 por km y tu costo real es $26. ¿Qué haces?",
    o: [
      "Lo tomo, algo es algo",
      "Lo rechazo o renegocio",
      "Lo tomo si consigo carga de retorno que suba el promedio del viaje",
    ],
    ok: 2,
    e: "El promedio del viaje redondo manda. Solo, ese flete pierde; con retorno bien pagado puede convenir. Lo que nunca funciona es tomarlo 'porque algo es algo'.",
  },
  {
    q: "¿Cuál es la señal más clara de que ya puedes comprar tu segunda unidad?",
    o: [
      "Que el banco me aprobó el crédito",
      "Que rechazo carga por falta de capacidad y tengo fondo de reserva",
      "Que ya tengo un año en el negocio",
    ],
    ok: 1,
    e: "La capacidad de crédito no es la señal; la demanda desatendida más liquidez sí lo es.",
  },
  {
    q: "Tu operador estrella pide aumento y ya paga arriba del mercado. ¿Qué revisas primero?",
    o: [
      "Si puedo reemplazarlo rápido",
      "Cuánto me cuesta realmente la rotación y qué más valora además del sueldo",
      "Le doy el aumento sin preguntar",
    ],
    ok: 1,
    e: "Reemplazar un operador cuesta reclutamiento, curva de aprendizaje, daños y clientes molestos. Casi siempre es más caro que retener.",
  },
  {
    q: "¿Qué pasa si sales a carretera con la carta porte mal emitida?",
    o: [
      "Nada, es solo un tema contable",
      "Multa, posible detención de la unidad y de la carga",
      "Solo te la piden si te detienen en aduana",
    ],
    ok: 1,
    e: "El complemento carta porte es obligatorio para el traslado. Mal emitido, es riesgo fiscal y operativo al mismo tiempo.",
  },
  {
    q: "¿Dónde vive realmente el margen del autotransporte?",
    o: [
      "En cobrar la tarifa más alta del mercado",
      "En el control de costos, la reducción de vacío y la cobranza puntual",
      "En tener las unidades más nuevas",
    ],
    ok: 1,
    e: "La tarifa la pone el mercado; el costo y la cobranza los pones tú. Ahí está el negocio.",
  },
];

export function QuizFinal() {
  const [resp, setResp] = useState<Record<number, number>>({});
  const contestadas = Object.keys(resp).length;
  const aciertos = preguntas.filter((p, i) => resp[i] === p.ok).length;

  return (
    <div className="mt-12">
      <div className="space-y-4">
        {preguntas.map((p, i) => (
          <div key={p.q} className="rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md">
            <p className="text-sm font-semibold uppercase tracking-wide">
              {String(i + 1).padStart(2, "0")} · {p.q}
            </p>
            <div className="mt-4 grid gap-2">
              {p.o.map((o, j) => {
                const elegida = resp[i] === j;
                const correcta = j === p.ok;
                const mostrada = resp[i] !== undefined;
                return (
                  <button
                    key={o}
                    onClick={() => setResp((r) => ({ ...r, [i]: j }))}
                    className={`rounded border px-4 py-3 text-left text-sm transition-colors ${
                      mostrada && correcta
                        ? "border-primary bg-primary/15"
                        : elegida
                          ? "border-destructive/70 bg-destructive/10"
                          : "border-border hover:border-primary/50"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {resp[i] !== undefined && (
              <p className="mt-4 text-sm text-muted-foreground">{p.e}</p>
            )}
          </div>
        ))}
      </div>

      {contestadas === preguntas.length && (
        <div
          className="mt-8 rounded-lg border border-primary/60 bg-primary/10 p-8 text-center backdrop-blur-md"
          style={{ boxShadow: "var(--shadow-deep)" }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Resultado</p>
          <p className="mt-2 font-display text-4xl text-gradient-amber">
            {aciertos} / {preguntas.length}
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
            {aciertos >= 4
              ? "Piensas como empresario, no como chofer con camión. Ese es el cambio que sostiene una flota."
              : "Vuelve a los capítulos de costo real y de lo que nadie cuenta: ahí están las respuestas que hoy te faltan."}
          </p>
        </div>
      )}
    </div>
  );
}
