import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  obtenerSesionPorCodigo,
  obtenerPreguntas,
  unirseComoParticipante,
  enviarRespuesta,
  suscribirSesion,
} from "@/lib/quiz-api";
import {
  guardarParticipanteLocal,
  leerParticipanteLocal,
  type QuizSesion,
  type QuizPregunta,
} from "@/lib/supabase-quiz";

export const Route = createFileRoute("/quiz/$codigo")({
  head: () => ({ meta: [{ title: "Quiz en vivo · Trailerverse" }] }),
  component: QuizParticipantePage,
});

function QuizParticipantePage() {
  const { codigo } = Route.useParams();
  const codigoUpper = codigo.toUpperCase();

  const [sesion, setSesion] = useState<QuizSesion | null | "cargando" | "no-encontrada">(
    "cargando",
  );
  const [preguntas, setPreguntas] = useState<QuizPregunta[]>([]);
  const [participanteId, setParticipanteId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [uniendo, setUniendo] = useState(false);
  const [respuestaEnviada, setRespuestaEnviada] = useState<{
    correcta: boolean;
    puntos: number;
  } | null>(null);
  const [preguntaAbiertaDesde, setPreguntaAbiertaDesde] = useState<number | null>(null);

  useEffect(() => {
    obtenerSesionPorCodigo(codigoUpper).then(async (s) => {
      if (!s) {
        setSesion("no-encontrada");
        return;
      }
      setSesion(s);
      setPreguntas(await obtenerPreguntas(s.id));
      const yaUnido = leerParticipanteLocal(codigoUpper);
      if (yaUnido) setParticipanteId(yaUnido);
    });
  }, [codigoUpper]);

  useEffect(() => {
    if (!sesion || sesion === "cargando" || sesion === "no-encontrada") return;
    const unsub = suscribirSesion(sesion.id, (s) => {
      setSesion(s);
      setRespuestaEnviada(null);
      if (s.pregunta_abierta_en) setPreguntaAbiertaDesde(new Date(s.pregunta_abierta_en).getTime());
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof sesion === "object" && sesion ? sesion.id : null]);

  async function handleUnirse(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !sesion || sesion === "cargando" || sesion === "no-encontrada") return;
    setUniendo(true);
    try {
      const p = await unirseComoParticipante(sesion.id, nombre);
      guardarParticipanteLocal(codigoUpper, p.id);
      setParticipanteId(p.id);
    } finally {
      setUniendo(false);
    }
  }

  async function handleResponder(pregunta: QuizPregunta, opcion: number) {
    if (!participanteId || respuestaEnviada) return;
    const ms = preguntaAbiertaDesde ? Date.now() - preguntaAbiertaDesde : 8000;
    try {
      const res = await enviarRespuesta(pregunta, participanteId, opcion, ms);
      setRespuestaEnviada(res);
    } catch {
      // ya había respondido esta pregunta — no pasa nada, solo ignoramos
      setRespuestaEnviada({ correcta: false, puntos: 0 });
    }
  }

  if (sesion === "cargando") {
    return <CentroMensaje>Conectando…</CentroMensaje>;
  }

  if (sesion === "no-encontrada") {
    return (
      <CentroMensaje>
        No encontramos el código <strong>{codigoUpper}</strong>. Pídele al presentador que
        confirme el código en la pantalla grande.
      </CentroMensaje>
    );
  }

  if (!participanteId) {
    return (
      <CentroMensaje>
        <p className="text-xs uppercase tracking-[0.4em] text-primary">Código {codigoUpper}</p>
        <h1 className="mt-3 font-display text-3xl">¿Cómo te llamas?</h1>
        <form onSubmit={handleUnirse} className="mt-6 flex w-full max-w-xs flex-col gap-3">
          <input
            autoFocus
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            maxLength={40}
            className="rounded-lg border border-border bg-card px-4 py-3 text-center text-lg outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={uniendo || !nombre.trim()}
            className="rounded-lg bg-primary px-6 py-3 font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
          >
            {uniendo ? "Entrando…" : "Entrar al quiz"}
          </button>
        </form>
      </CentroMensaje>
    );
  }

  const preguntaActiva = preguntas.find((p) => p.id === sesion.pregunta_actual_id) ?? null;

  if (sesion.estado === "esperando" || !preguntaActiva) {
    return (
      <CentroMensaje>
        <p className="text-xs uppercase tracking-[0.4em] text-primary">¡Listo!</p>
        <h1 className="mt-3 font-display text-3xl">Espera la siguiente pregunta</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Mantén el celular a la mano — la pregunta aparecerá aquí automáticamente.
        </p>
      </CentroMensaje>
    );
  }

  if (sesion.estado === "leaderboard") {
    return (
      <CentroMensaje>
        <p className="text-xs uppercase tracking-[0.4em] text-primary">Tabla de posiciones</p>
        <h1 className="mt-3 font-display text-3xl">Mira la pantalla grande</h1>
      </CentroMensaje>
    );
  }

  if (sesion.estado === "resultados") {
    return (
      <CentroMensaje>
        {respuestaEnviada ? (
          <>
            <p className="text-xs uppercase tracking-[0.4em] text-primary">
              {respuestaEnviada.correcta ? "¡Correcto!" : "No era esa"}
            </p>
            <h1 className="mt-3 font-display text-4xl">
              {respuestaEnviada.correcta ? `+${respuestaEnviada.puntos} pts` : "0 pts"}
            </h1>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No alcanzaste a responder a tiempo.</p>
        )}
        {preguntaActiva.explicacion && (
          <p className="mt-6 max-w-xs text-sm text-muted-foreground">
            {preguntaActiva.explicacion}
          </p>
        )}
      </CentroMensaje>
    );
  }

  // estado === "pregunta"
  if (respuestaEnviada) {
    return (
      <CentroMensaje>
        <p className="text-xs uppercase tracking-[0.4em] text-primary">Respuesta enviada</p>
        <h1 className="mt-3 font-display text-3xl">Espera a los demás…</h1>
      </CentroMensaje>
    );
  }

  const colores = [
    "bg-red-500/90 hover:bg-red-500",
    "bg-blue-500/90 hover:bg-blue-500",
    "bg-amber-500/90 hover:bg-amber-500",
    "bg-emerald-500/90 hover:bg-emerald-500",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background px-4 py-6">
      <p className="text-center text-sm font-medium">{preguntaActiva.texto}</p>
      <div className="mt-6 flex flex-1 flex-col gap-3">
        {(preguntaActiva.opciones as string[]).map((o, i) => (
          <button
            key={o}
            onClick={() => handleResponder(preguntaActiva, i)}
            className={`flex-1 rounded-xl px-4 py-6 text-left text-base font-semibold text-white shadow-lg transition-transform active:scale-95 ${colores[i % colores.length]}`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function CentroMensaje({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      {children}
    </div>
  );
}
