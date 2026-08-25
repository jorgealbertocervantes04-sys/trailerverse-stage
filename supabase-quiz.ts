import { createClient } from "@supabase/supabase-js";

// Mismo proyecto Supabase que usa udat-evaluaciones (app_ev).
// La anon key es pública por diseño (RLS controla los permisos reales).
const SUPABASE_URL = "https://esqnsnyhvveaoerbxnjs.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcW5zbnlodnZlYW9lcmJ4bmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NjU2OTksImV4cCI6MjA5OTU0MTY5OX0.VihpU2DP_LacJgX99zKhvMJLJkGdHFljVoHMk6I9hXM";

export const supabaseQuiz = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type EstadoSesion = "esperando" | "pregunta" | "resultados" | "leaderboard" | "cerrada";

export interface QuizSesion {
  id: number;
  codigo: string;
  estado: EstadoSesion;
  pregunta_actual_id: number | null;
  pregunta_abierta_en: string | null;
  created_at: string;
}

export interface QuizPregunta {
  id: number;
  sesion_id: number;
  capitulo: string;
  orden: number;
  texto: string;
  opciones: string[];
  correcta: number;
  explicacion: string | null;
}

export interface QuizParticipante {
  id: number;
  sesion_id: number;
  nombre: string;
  puntos: number;
  created_at: string;
}

export interface QuizRespuesta {
  id: number;
  pregunta_id: number;
  participante_id: number;
  opcion_elegida: number;
  ms_respuesta: number;
  puntos_obtenidos: number;
  created_at: string;
}

const LS_PARTICIPANTE = "trailerverse_quiz_participante_id";
const LS_SESION = "trailerverse_quiz_sesion_codigo";

export function guardarParticipanteLocal(sesionCodigo: string, participanteId: number) {
  localStorage.setItem(LS_SESION, sesionCodigo);
  localStorage.setItem(LS_PARTICIPANTE, String(participanteId));
}

export function leerParticipanteLocal(sesionCodigo: string): number | null {
  if (localStorage.getItem(LS_SESION) !== sesionCodigo) return null;
  const v = localStorage.getItem(LS_PARTICIPANTE);
  return v ? Number(v) : null;
}

export function olvidarParticipanteLocal() {
  localStorage.removeItem(LS_PARTICIPANTE);
  localStorage.removeItem(LS_SESION);
}

/** Calcula puntos: base por acertar + bono por velocidad (máx 15s de ventana). */
export function calcularPuntos(correcta: boolean, msRespuesta: number): number {
  if (!correcta) return 0;
  const VENTANA_MS = 15000;
  const base = 700;
  const bonoMax = 300;
  const fraccionRestante = Math.max(0, 1 - msRespuesta / VENTANA_MS);
  return Math.round(base + bonoMax * fraccionRestante);
}
