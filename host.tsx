import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabaseQuiz, type QuizSesion, type QuizPregunta, type QuizParticipante } from "@/lib/supabase-quiz";
import {
  crearSesionConPreguntas,
  obtenerPreguntas,
  lanzarPregunta,
  cerrarPreguntaYMostrarResultados,
  mostrarLeaderboard,
  volverAEsperando,
  contarRespuestas,
  contarParticipantes,
  obtenerLeaderboard,
  suscribirSesion,
} from "@/lib/quiz-api";

export const Route = createFileRoute("/host")({
  head: () => ({ meta: [{ title: "Panel del anfitrión · Quiz Trailerverse" }] }),
  component: HostPage,
});

function HostPage() {
  const [sesion, setSesion] = useState<QuizSesion | null>(null);
  const [preguntas, setPreguntas] = useState<QuizPregunta[]>([]);
  const [conteo, setConteo] = useState<number[]>([]);
  const [participantes, setParticipantes] = useState(0);
  const [leaderboard, setLeaderboard] = useState<QuizParticipante[]>([]);
  const [cargando, setCargando] = useState(false);

  // Reanudar sesión activa si ya existe en este navegador
  useEffect(() => {
    const codigo = localStorage.getItem("trailerverse_quiz_sesion_activa_codigo");
    const id = localStorage.getItem("trailerverse_quiz_sesion_activa_id");
    if (codigo && id) {
      supabaseQuiz
        .from("quiz_sesiones")
        .select("*")
        .eq("id", Number(id))
        .single()
        .then(({ data }) => {
          if (data) {
            setSesion(data as QuizSesion);
            obtenerPreguntas((data as QuizSesion).id).then(setPreguntas);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (!sesion) return;
    const unsub = suscribirSesion(sesion.id, setSesion);
    const interval = setInterval(() => contarParticipantes(sesion.id).then(setParticipantes), 3000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [sesion?.id]);

  const preguntaActiva = preguntas.find((p) => p.id === sesion?.pregunta_actual_id) ?? null;

  useEffect(() => {
    if (!sesion || !preguntaActiva) return;
    if (sesion.estado === "resultados") contarRespuestas(preguntaActiva.id).then(setConteo);
    if (sesion.estado === "leaderboard") obtenerLeaderboard(sesion.id).then(setLeaderboard);
  }, [sesion?.estado, preguntaActiva?.id]);

  async function iniciar() {
    setCargando(true);
    try {
      const s = await crearSesionConPreguntas();
      localStorage.setItem("trailerverse_quiz_sesion_activa_codigo", s.codigo);
      localStorage.setItem("trailerverse_quiz_sesion_activa_id", String(s.id));
      setSesion(s);
      setPreguntas(await obtenerPreguntas(s.id));
    } finally {
      setCargando(false);
    }
  }

  function terminarSesionLocal() {
    localStorage.removeItem("trailerverse_quiz_sesion_activa_codigo");
    localStorage.removeItem("trailerverse_quiz_sesion_activa_id");
    setSesion(null);
    setPreguntas([]);
  }

  if (!sesion) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary">Panel del anfitrión</p>
        <h1 className="font-display text-3xl md:text-5xl">Quiz en vivo · Trailerverse</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Abre esto en tu laptop o tablet mientras presentas. La pantalla proyectada (la ruta
          principal <code>/</code>) mostrará el QR, las preguntas y los resultados automáticamente.
        </p>
        <button
          onClick={iniciar}
          disabled={cargando}
          className="rounded-lg bg-primary px-8 py-3 font-semibold uppercase tracking-widest text-primary-foreground disabled:opacity-50"
        >
          {cargando ? "Creando…" : "Crear sesión de quiz"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10 md:px-16">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-primary">Sesión activa</p>
            <h1 className="font-display text-3xl">
              Código: <span className="text-gradient-amber">{sesion.codigo}</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{participantes} conectados</p>
          </div>
          <button
            onClick={terminarSesionLocal}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive"
          >
            Terminar sesión
          </button>
        </div>

        <p className="mt-8 text-xs uppercase tracking-widest text-muted-foreground">
          Estado actual: <span className="text-foreground">{sesion.estado}</span>
        </p>

        {sesion.estado !== "esperando" && preguntaActiva && (
          <div className="mt-4 rounded-lg border border-primary/40 bg-card/70 p-6">
            <p className="text-sm font-semibold">{preguntaActiva.texto}</p>
            {sesion.estado === "resultados" && (
              <div className="mt-4 space-y-2 text-sm">
                {(preguntaActiva.opciones as string[]).map((o, i) => (
                  <p key={o}>
                    {String.fromCharCode(65 + i)}) {o} — {conteo[i] ?? 0} respuestas
                    {i === preguntaActiva.correcta && " ✓ correcta"}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {sesion.estado === "pregunta" && (
                <button
                  onClick={() => cerrarPreguntaYMostrarResultados(sesion.id)}
                  className="rounded bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground"
                >
                  Cerrar y mostrar resultados
                </button>
              )}
              {sesion.estado === "resultados" && (
                <>
                  <button
                    onClick={() => mostrarLeaderboard(sesion.id)}
                    className="rounded border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary"
                  >
                    Mostrar tabla de posiciones
                  </button>
                  <button
                    onClick={() => volverAEsperando(sesion.id)}
                    className="rounded border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground"
                  >
                    Ocultar (pantalla de espera)
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {sesion.estado === "leaderboard" && (
          <div className="mt-4 rounded-lg border border-primary/40 bg-card/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest">Top actual</p>
            <div className="mt-3 space-y-1 text-sm">
              {leaderboard.map((p, i) => (
                <p key={p.id}>
                  {i + 1}. {p.nombre} — {p.puntos} pts
                </p>
              ))}
            </div>
            <button
              onClick={() => volverAEsperando(sesion.id)}
              className="mt-4 rounded border border-border px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground"
            >
              Ocultar (pantalla de espera)
            </button>
          </div>
        )}

        <p className="mt-10 text-xs uppercase tracking-[0.4em] text-primary">
          Preguntas · lánzalas cuando llegues a ese capítulo
        </p>
        <div className="mt-4 space-y-2">
          {preguntas.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
                sesion.pregunta_actual_id === p.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50"
              }`}
            >
              <span>
                <span className="mr-3 text-xs uppercase tracking-widest text-muted-foreground">
                  {p.capitulo}
                </span>
                {String(i + 1).padStart(2, "0")}. {p.texto}
              </span>
              <button
                onClick={() => lanzarPregunta(sesion.id, p.id)}
                className="ml-4 shrink-0 rounded bg-primary px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground"
              >
                Lanzar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
