import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  obtenerPreguntas,
  obtenerLeaderboard,
  contarRespuestas,
  contarParticipantes,
  suscribirSesion,
} from "@/lib/quiz-api";
import type { QuizSesion, QuizPregunta, QuizParticipante } from "@/lib/supabase-quiz";

/**
 * Se monta una sola vez en la presentación principal. Mientras no haya
 * sesión activa en localStorage, no renderiza nada (cero impacto visual
 * ni de red en una proyección normal sin quiz).
 */
export function QuizLiveOverlay() {
  const [sesion, setSesion] = useState<QuizSesion | null>(null);
  const [preguntas, setPreguntas] = useState<QuizPregunta[]>([]);
  const [conteo, setConteo] = useState<number[]>([]);
  const [totalParticipantes, setTotalParticipantes] = useState(0);
  const [leaderboard, setLeaderboard] = useState<QuizParticipante[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [minimizado, setMinimizado] = useState(false);

  useEffect(() => {
    const codigo = localStorage.getItem("trailerverse_quiz_sesion_activa_codigo");
    const sesionId = localStorage.getItem("trailerverse_quiz_sesion_activa_id");
    if (!codigo || !sesionId) return;

    const idNum = Number(sesionId);
    obtenerPreguntas(idNum).then(setPreguntas);

    const joinUrl = `${window.location.origin}/quiz/${codigo}`;
    QRCode.toDataURL(joinUrl, { margin: 1, width: 320, color: { dark: "#1a1300", light: "#ffffff" } }).then(
      setQrDataUrl,
    );

    const unsub = suscribirSesion(idNum, (s) => setSesion(s));

    // Estado inicial
    import("@/lib/supabase-quiz").then(({ supabaseQuiz }) => {
      supabaseQuiz
        .from("quiz_sesiones")
        .select("*")
        .eq("id", idNum)
        .single()
        .then(({ data }) => data && setSesion(data as QuizSesion));
    });

    const interval = setInterval(() => {
      contarParticipantes(idNum).then(setTotalParticipantes);
    }, 4000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const preguntaActiva = useMemo(
    () => preguntas.find((p) => p.id === sesion?.pregunta_actual_id) ?? null,
    [preguntas, sesion],
  );

  useEffect(() => {
    if (!sesion || !preguntaActiva) return;
    if (sesion.estado === "resultados") {
      contarRespuestas(preguntaActiva.id).then(setConteo);
    }
    if (sesion.estado === "leaderboard" && sesion.id) {
      obtenerLeaderboard(sesion.id).then(setLeaderboard);
    }
  }, [sesion, preguntaActiva]);

  if (!sesion || sesion.estado === "cerrada") return null;

  if (minimizado) {
    return (
      <button
        onClick={() => setMinimizado(false)}
        className="fixed bottom-4 right-4 z-[100] rounded-full border border-primary/60 bg-background/90 px-4 py-2 text-xs uppercase tracking-widest text-primary shadow-lg backdrop-blur-md"
      >
        Quiz en vivo · reabrir
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/97 backdrop-blur-xl">
      <button
        onClick={() => setMinimizado(true)}
        className="absolute right-6 top-6 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        Minimizar ✕
      </button>

      {sesion.estado === "esperando" && (
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Quiz en vivo</p>
          <h2 className="mt-3 font-display text-4xl md:text-6xl">Escanea para entrar</h2>
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="Código QR para unirse al quiz"
              className="mx-auto mt-8 rounded-lg border border-border bg-white p-4"
              width={280}
              height={280}
            />
          )}
          <p className="mt-6 font-display text-3xl tracking-[0.3em] text-gradient-amber">
            {sesion.codigo}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            trailerverse-stage.vercel.app/quiz/{sesion.codigo}
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            {totalParticipantes} conectados
          </p>
        </div>
      )}

      {sesion.estado === "pregunta" && preguntaActiva && (
        <div className="w-full max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            {preguntaActiva.capitulo}
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold md:text-5xl">
            {preguntaActiva.texto}
          </h2>
          <div className="mx-auto mt-10 grid max-w-2xl gap-3">
            {(preguntaActiva.opciones as string[]).map((o, i) => (
              <div
                key={o}
                className="rounded-lg border border-border bg-card/70 px-6 py-4 text-left text-lg"
              >
                <span className="mr-3 font-display text-primary">
                  {String.fromCharCode(65 + i)}
                </span>
                {o}
              </div>
            ))}
          </div>
          <p className="mt-8 animate-pulse text-sm uppercase tracking-widest text-muted-foreground">
            Respondiendo desde el celular…
          </p>
        </div>
      )}

      {sesion.estado === "resultados" && preguntaActiva && (
        <div className="w-full max-w-3xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Resultados</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold md:text-4xl">
            {preguntaActiva.texto}
          </h2>
          <div className="mx-auto mt-8 max-w-xl space-y-3 text-left">
            {(preguntaActiva.opciones as string[]).map((o, i) => {
              const total = conteo.reduce((a, b) => a + (b ?? 0), 0) || 1;
              const val = conteo[i] ?? 0;
              const pct = Math.round((val / total) * 100);
              const esCorrecta = i === preguntaActiva.correcta;
              return (
                <div key={o}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className={esCorrecta ? "text-primary" : "text-muted-foreground"}>
                      {String.fromCharCode(65 + i)} · {o} {esCorrecta && "✓"}
                    </span>
                    <span>{val}</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-card">
                    <div
                      className={`h-full rounded-full ${esCorrecta ? "bg-primary" : "bg-muted-foreground/40"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {preguntaActiva.explicacion && (
            <p className="mx-auto mt-8 max-w-xl text-sm text-muted-foreground">
              {preguntaActiva.explicacion}
            </p>
          )}
        </div>
      )}

      {sesion.estado === "leaderboard" && (
        <div className="w-full max-w-2xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Tabla de posiciones</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Top del quiz</h2>
          <div className="mx-auto mt-10 space-y-2">
            {leaderboard.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card/70 px-6 py-3"
              >
                <span className="flex items-center gap-4">
                  <span className="font-display text-xl text-primary/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg">{p.nombre}</span>
                </span>
                <span className="font-display text-xl text-gradient-amber">{p.puntos} pts</span>
              </div>
            ))}
            {leaderboard.length === 0 && (
              <p className="text-sm text-muted-foreground">Aún no hay puntos registrados.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
