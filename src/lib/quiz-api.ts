import {
  supabaseQuiz,
  calcularPuntos,
  type EstadoSesion,
  type QuizSesion,
  type QuizPregunta,
  type QuizParticipante,
  type QuizRespuesta,
} from "@/lib/supabase-quiz";

/** Preguntas repartidas en toda la presentación, no solo en el examen final. */
export const PREGUNTAS_SEMILLA: Omit<
  QuizPregunta,
  "id" | "sesion_id"
>[] = [
  {
    capitulo: "cap-2",
    orden: 1,
    texto: "¿Cuál de estas partes de la unidad suele ser el error más caro y peligroso si se descuida?",
    opciones: [
      "La quinta rueda (el enganche entre tracto y caja)",
      "El color de la cabina",
      "El logo en la puerta",
    ],
    correcta: 0,
    explicacion: "Un mal enganche o falta de mantenimiento en la quinta rueda es de los errores más caros y peligrosos del oficio.",
  },
  {
    capitulo: "cap-2",
    orden: 2,
    texto: "¿Qué consumible se come la utilidad si no lo controlas por kilómetro recorrido?",
    opciones: [
      "Ejes y llantas",
      "El seguro del celular",
      "El GPS del tablero",
    ],
    correcta: 0,
    explicacion: "Llantas y frenos son el gasto que más se subestima. Sin control por km, se comen el margen sin que lo notes.",
  },
  {
    capitulo: "cap-3",
    orden: 1,
    texto: "¿Cuál es el primer error al fundar la empresa?",
    opciones: [
      "Mezclar la caja del negocio con el gasto personal",
      "Tardarte en elegir el logo",
      "Contratar contador desde el día uno",
    ],
    correcta: 0,
    explicacion: "Mezclar cajas es la causa número uno de que un negocio rentable en papel se sienta en quiebra en la realidad.",
  },
  {
    capitulo: "cap-4",
    orden: 1,
    texto: "Tu costo real por km incluye diésel, casetas y sueldo del operador. ¿Qué más casi siempre se olvida?",
    opciones: [
      "El desgaste y reemplazo de llantas, frenos y suspensión",
      "El uniforme del operador",
      "El seguro del celular",
    ],
    correcta: 0,
    explicacion: "El desgaste mecánico se paga después, en una sola exhibición grande — por eso hay que provisionarlo por km desde el principio.",
  },
  {
    capitulo: "cap-6",
    orden: 1,
    texto: "¿Cuál es la señal más clara de que ya puedes comprar tu segunda unidad?",
    opciones: [
      "Que el banco me aprobó el crédito",
      "Que rechazo carga por falta de capacidad y tengo fondo de reserva",
      "Que ya tengo un año en el negocio",
    ],
    correcta: 1,
    explicacion: "La capacidad de crédito no es la señal; la demanda desatendida más liquidez sí lo es.",
  },
  {
    capitulo: "cap-7",
    orden: 1,
    texto: "Tu operador estrella pide aumento y ya paga arriba del mercado. ¿Qué revisas primero?",
    opciones: [
      "Si puedo reemplazarlo rápido",
      "Cuánto me cuesta realmente la rotación y qué más valora además del sueldo",
      "Le doy el aumento sin preguntar",
    ],
    correcta: 1,
    explicacion: "Reemplazar un operador cuesta reclutamiento, curva de aprendizaje, daños y clientes molestos. Casi siempre es más caro que retener.",
  },
  {
    capitulo: "cap-10",
    orden: 1,
    texto: "¿Qué protege mejor tu operación ante un accidente en carretera?",
    opciones: [
      "Confiar en que no va a pasar",
      "Seguro de responsabilidad civil vigente y protocolo claro para el operador",
      "Solo el seguro de la unidad",
    ],
    correcta: 1,
    explicacion: "El daño a terceros y a la carga suele costar más que la unidad misma; sin cobertura de responsabilidad civil, un solo incidente puede acabar con la empresa.",
  },
  {
    capitulo: "cap-11",
    orden: 1,
    texto: "¿Qué pasa si sales a carretera con la carta porte mal emitida?",
    opciones: [
      "Nada, es solo un tema contable",
      "Multa, posible detención de la unidad y de la carga",
      "Solo te la piden si te detienen en aduana",
    ],
    correcta: 1,
    explicacion: "El complemento carta porte es obligatorio para el traslado. Mal emitido, es riesgo fiscal y operativo al mismo tiempo.",
  },
  {
    capitulo: "cap-15",
    orden: 1,
    texto: "¿Cuál de estos errores quiebra más flotas nuevas?",
    opciones: [
      "Crecer con crédito sin carga contratada de antemano",
      "Tener muy pocas unidades",
      "Cobrar tarifas demasiado altas",
    ],
    correcta: 0,
    explicacion: "La mensualidad del crédito llega aunque el cliente pague a 90 días. Crecer sin carga asegurada es la trampa más común.",
  },
  {
    capitulo: "cap-16",
    orden: 1,
    texto: "Un cliente te ofrece un flete a $24 por km y tu costo real es $26. ¿Qué haces?",
    opciones: [
      "Lo tomo, algo es algo",
      "Lo rechazo o renegocio",
      "Lo tomo si consigo carga de retorno que suba el promedio del viaje",
    ],
    correcta: 2,
    explicacion: "El promedio del viaje redondo manda. Solo, ese flete pierde; con retorno bien pagado puede convenir.",
  },
  {
    capitulo: "cap-17",
    orden: 1,
    texto: "¿Dónde vive realmente el margen del autotransporte?",
    opciones: [
      "En cobrar la tarifa más alta del mercado",
      "En el control de costos, la reducción de vacío y la cobranza puntual",
      "En tener las unidades más nuevas",
    ],
    correcta: 1,
    explicacion: "La tarifa la pone el mercado; el costo y la cobranza los pones tú. Ahí está el negocio.",
  },
];

function generarCodigo(): string {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < 4; i++) out += letras[Math.floor(Math.random() * letras.length)];
  return out;
}

export async function crearSesionConPreguntas(): Promise<QuizSesion> {
  let codigo = generarCodigo();
  // Reintenta si el código ya existe (muy poco probable, pero es única).
  for (let intento = 0; intento < 5; intento++) {
    const { data, error } = await supabaseQuiz
      .from("quiz_sesiones")
      .insert({ codigo, estado: "esperando" })
      .select()
      .single();
    if (!error && data) {
      const filas = PREGUNTAS_SEMILLA.map((p) => ({ ...p, sesion_id: data.id }));
      await supabaseQuiz.from("quiz_preguntas").insert(filas);
      return data as QuizSesion;
    }
    codigo = generarCodigo();
  }
  throw new Error("No se pudo crear la sesión de quiz.");
}

export async function obtenerSesionPorCodigo(codigo: string): Promise<QuizSesion | null> {
  const { data } = await supabaseQuiz
    .from("quiz_sesiones")
    .select("*")
    .eq("codigo", codigo.toUpperCase())
    .single();
  return (data as QuizSesion) ?? null;
}

export async function obtenerPreguntas(sesionId: number): Promise<QuizPregunta[]> {
  const { data } = await supabaseQuiz
    .from("quiz_preguntas")
    .select("*")
    .eq("sesion_id", sesionId)
    .order("id", { ascending: true });
  return (data as QuizPregunta[]) ?? [];
}

export async function unirseComoParticipante(
  sesionId: number,
  nombre: string,
): Promise<QuizParticipante> {
  const { data, error } = await supabaseQuiz
    .from("quiz_participantes")
    .insert({ sesion_id: sesionId, nombre: nombre.trim().slice(0, 40), puntos: 0 })
    .select()
    .single();
  if (error || !data) throw new Error("No se pudo unir al quiz.");
  return data as QuizParticipante;
}

export async function lanzarPregunta(sesionId: number, preguntaId: number) {
  await supabaseQuiz
    .from("quiz_sesiones")
    .update({
      estado: "pregunta" satisfies EstadoSesion,
      pregunta_actual_id: preguntaId,
      pregunta_abierta_en: new Date().toISOString(),
    })
    .eq("id", sesionId);
}

export async function cerrarPreguntaYMostrarResultados(sesionId: number) {
  await supabaseQuiz
    .from("quiz_sesiones")
    .update({ estado: "resultados" satisfies EstadoSesion })
    .eq("id", sesionId);
}

export async function mostrarLeaderboard(sesionId: number) {
  await supabaseQuiz
    .from("quiz_sesiones")
    .update({ estado: "leaderboard" satisfies EstadoSesion })
    .eq("id", sesionId);
}

export async function volverAEsperando(sesionId: number) {
  await supabaseQuiz
    .from("quiz_sesiones")
    .update({ estado: "esperando" satisfies EstadoSesion, pregunta_actual_id: null })
    .eq("id", sesionId);
}

export async function enviarRespuesta(
  pregunta: QuizPregunta,
  participanteId: number,
  opcionElegida: number,
  msRespuesta: number,
) {
  const correcta = opcionElegida === pregunta.correcta;
  const puntos = calcularPuntos(correcta, msRespuesta);
  const { error } = await supabaseQuiz.from("quiz_respuestas").insert({
    pregunta_id: pregunta.id,
    participante_id: participanteId,
    opcion_elegida: opcionElegida,
    ms_respuesta: msRespuesta,
    puntos_obtenidos: puntos,
  });
  if (error) throw error;
  if (puntos > 0) {
    const { data: p } = await supabaseQuiz
      .from("quiz_participantes")
      .select("puntos")
      .eq("id", participanteId)
      .single();
    const actuales = (p as { puntos: number } | null)?.puntos ?? 0;
    await supabaseQuiz
      .from("quiz_participantes")
      .update({ puntos: actuales + puntos })
      .eq("id", participanteId);
  }
  return { correcta, puntos };
}

export async function obtenerLeaderboard(sesionId: number): Promise<QuizParticipante[]> {
  const { data } = await supabaseQuiz
    .from("quiz_participantes")
    .select("*")
    .eq("sesion_id", sesionId)
    .order("puntos", { ascending: false })
    .limit(10);
  return (data as QuizParticipante[]) ?? [];
}

export async function contarRespuestas(preguntaId: number): Promise<number[]> {
  const { data } = await supabaseQuiz
    .from("quiz_respuestas")
    .select("opcion_elegida")
    .eq("pregunta_id", preguntaId);
  const filas = (data as { opcion_elegida: number }[]) ?? [];
  const conteo: number[] = [];
  for (const f of filas) conteo[f.opcion_elegida] = (conteo[f.opcion_elegida] ?? 0) + 1;
  return conteo;
}

export async function contarParticipantes(sesionId: number): Promise<number> {
  const { count } = await supabaseQuiz
    .from("quiz_participantes")
    .select("*", { count: "exact", head: true })
    .eq("sesion_id", sesionId);
  return count ?? 0;
}

/** Suscribe a cambios de estado de la sesión (pregunta activa, fase, etc). */
export function suscribirSesion(sesionId: number, onCambio: (s: QuizSesion) => void) {
  const canal = supabaseQuiz
    .channel(`sesion-${sesionId}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "quiz_sesiones", filter: `id=eq.${sesionId}` },
      (payload) => onCambio(payload.new as QuizSesion),
    )
    .subscribe();
  return () => {
    supabaseQuiz.removeChannel(canal);
  };
}

/** Suscribe a nuevas respuestas de una pregunta (para el contador en vivo del anfitrión / pantalla). */
export function suscribirRespuestas(preguntaId: number, onNueva: (r: QuizRespuesta) => void) {
  const canal = supabaseQuiz
    .channel(`respuestas-${preguntaId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "quiz_respuestas",
        filter: `pregunta_id=eq.${preguntaId}`,
      },
      (payload) => onNueva(payload.new as QuizRespuesta),
    )
    .subscribe();
  return () => {
    supabaseQuiz.removeChannel(canal);
  };
}

/** Suscribe a nuevos participantes uniéndose (para el contador "X conectados" del anfitrión). */
export function suscribirParticipantes(sesionId: number, onNuevo: (p: QuizParticipante) => void) {
  const canal = supabaseQuiz
    .channel(`participantes-${sesionId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "quiz_participantes",
        filter: `sesion_id=eq.${sesionId}`,
      },
      (payload) => onNuevo(payload.new as QuizParticipante),
    )
    .subscribe();
  return () => {
    supabaseQuiz.removeChannel(canal);
  };
}
