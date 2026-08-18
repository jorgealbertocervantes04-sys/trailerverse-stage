import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Trailer3D } from "@/components/Trailer3D";
import heroImg from "@/assets/trailer-hero.jpg";
import cabImg from "@/assets/trailer-cab.jpg";
import fleetImg from "@/assets/trailer-fleet.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trailers 3D — Presentación inmersiva de tractocamiones" },
      {
        name: "description",
        content:
          "Recorrido 3D interactivo por el mundo de los trailers: anatomía, tipos de caja, logística y cifras clave del autotransporte.",
      },
      { property: "og:title", content: "Trailers 3D — Presentación inmersiva" },
      {
        property: "og:description",
        content:
          "Explora un tractocamión en 3D, arrástralo, descubre sus partes y las cifras del transporte de carga.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const parts = [
  {
    id: "cabina",
    label: "Cabina",
    text: "El puesto de mando. Cabinas dormitorio permiten viajes de largo itinerario con descanso reglamentario a bordo.",
  },
  {
    id: "quinta",
    label: "Quinta rueda",
    text: "El acoplamiento que une tracto y remolque. Soporta el peso vertical y permite el giro en curvas cerradas.",
  },
  {
    id: "caja",
    label: "Caja seca",
    text: "53 pies de volumen útil. Puede ser seca, refrigerada, plataforma, tolva o tanque según la carga.",
  },
  {
    id: "ejes",
    label: "Ejes traseros",
    text: "Distribuyen la carga sobre el pavimento. Su configuración define el peso bruto vehicular permitido.",
  },
];

const chapters = [
  { id: "intro", label: "Inicio" },
  { id: "anatomia", label: "Anatomía" },
  { id: "tipos", label: "Tipos" },
  { id: "cifras", label: "Cifras" },
  { id: "noche", label: "Ruta" },
];

const tipos = [
  { n: "01", t: "Caja seca", d: "Carga general paletizada, la más común en carretera." },
  { n: "02", t: "Refrigerada", d: "Cadena de frío entre -25 °C y 15 °C para perecederos." },
  { n: "03", t: "Plataforma", d: "Maquinaria, acero y carga sobredimensionada." },
  { n: "04", t: "Tanque", d: "Líquidos y gases con compartimentos y baffles." },
  { n: "05", t: "Tolva", d: "Granos y áridos con descarga por gravedad." },
  { n: "06", t: "Full / doble", d: "Dos remolques acoplados para máxima eficiencia." },
];

const cifras = [
  { k: "53", u: "pies", d: "Longitud estándar de caja" },
  { k: "36", u: "ton", d: "Peso bruto típico articulado" },
  { k: "80%", u: "", d: "De la carga terrestre se mueve en trailer" },
  { k: "18", u: "ruedas", d: "Configuración clásica T3-S2" },
];

function Index() {
  const [rotY, setRotY] = useState(-28);
  const [rotX, setRotX] = useState(12);
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const dragging = useRef<{ x: number; y: number; ry: number; rx: number } | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      setRotY(dragging.current.ry + (e.clientX - dragging.current.x) * 0.35);
      setRotX(
        Math.max(-25, Math.min(45, dragging.current.rx - (e.clientY - dragging.current.y) * 0.2)),
      );
    };
    const up = () => (dragging.current = null);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  const scale = 0.85 + Math.sin(progress * Math.PI) * 0.3;

  return (
    <main className="relative">
      {/* Escena 3D fija */}
      <div
        className="fixed inset-0 z-0 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) =>
          (dragging.current = { x: e.clientX, y: e.clientY, ry: rotY, rx: rotX })
        }
      >
        <div
          className="absolute inset-0"
          style={{ transform: `translate(${8 + progress * 4}%, ${-progress * 60}px)` }}
        >
          <Trailer3D rotY={rotY + progress * 220} rotX={rotX} scale={scale} active={active} />
        </div>
      </div>

      {/* Nav capítulos */}
      <nav className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {chapters.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            <span className="h-px w-6 bg-border transition-all group-hover:w-10 group-hover:bg-primary" />
            {c.label}
          </a>
        ))}
      </nav>

      <div className="fixed left-0 top-0 z-40 h-0.5 w-full bg-border/40">
        <div
          className="h-full"
          style={{ width: `${progress * 100}%`, background: "var(--gradient-amber)" }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-20">
        <section
          id="intro"
          className="flex min-h-screen flex-col justify-center px-6 md:px-20 lg:px-32"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Autotransporte de carga
          </p>
          <h1 className="mt-4 max-w-4xl text-6xl font-black uppercase leading-[0.9] md:text-8xl">
            <span className="text-gradient-amber">Trailers</span>
            <br />
            en movimiento
          </h1>
          <p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">
            Una presentación inmersiva sobre las máquinas que sostienen la economía. Arrastra para
            girar el modelo, desplázate para recorrer la historia.
          </p>
          <div className="mt-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur">
              Arrastra ⇆
            </span>
            <span className="rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur">
              Scroll ↓
            </span>
          </div>
        </section>

        <section
          id="anatomia"
          className="flex min-h-screen items-center justify-end px-6 md:px-20 lg:px-32"
        >
          <div className="w-full max-w-md rounded-lg border border-border bg-card/80 p-8 backdrop-blur-md shadow-[var(--shadow-deep)]">
            <h2 className="text-3xl font-bold uppercase">Anatomía</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Toca una pieza para resaltarla en el modelo.
            </p>
            <div className="mt-6 space-y-2">
              {parts.map((p) => (
                <button
                  key={p.id}
                  onMouseEnter={() => setActive(p.id)}
                  onFocus={() => setActive(p.id)}
                  onClick={() => setActive(active === p.id ? null : p.id)}
                  className={`w-full rounded-md border p-4 text-left transition-colors ${
                    active === p.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/60"
                  }`}
                >
                  <span className="text-sm font-semibold uppercase tracking-wide">{p.label}</span>
                  {active === p.id && (
                    <span className="mt-2 block text-sm text-muted-foreground">{p.text}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="tipos" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <h2 className="text-4xl font-bold uppercase md:text-6xl">Tipos de remolque</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tipos.map((t) => (
              <article
                key={t.n}
                className="group rounded-lg border border-border bg-card/75 p-6 backdrop-blur-md transition-transform hover:-translate-y-1"
                style={{ boxShadow: "var(--shadow-deep)" }}
              >
                <span className="font-display text-4xl text-primary/40 group-hover:text-primary">
                  {t.n}
                </span>
                <h3 className="mt-3 text-xl font-semibold uppercase">{t.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="cifras" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold uppercase md:text-6xl">Cifras de ruta</h2>
              <div className="mt-10 grid grid-cols-2 gap-6">
                {cifras.map((c) => (
                  <div key={c.d} className="border-l-2 border-primary pl-4">
                    <p className="font-display text-5xl leading-none text-gradient-amber">
                      {c.k}
                      <span className="ml-1 text-lg">{c.u}</span>
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <img
              src={cabImg}
              alt="Detalle del frente de un tractocamión iluminado de noche"
              loading="lazy"
              width={1200}
              height={1200}
              className="rounded-lg border border-border object-cover shadow-[var(--shadow-deep)]"
            />
          </div>
        </section>

        <section id="noche" className="relative min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <img
              src={heroImg}
              alt="Tractocamión con remolque circulando en carretera al atardecer"
              width={1600}
              height={912}
              className="rounded-lg border border-border object-cover shadow-[var(--shadow-deep)]"
            />
            <img
              src={fleetImg}
              alt="Vista aérea nocturna de una terminal logística con remolques estacionados"
              loading="lazy"
              width={1600}
              height={912}
              className="rounded-lg border border-border object-cover shadow-[var(--shadow-deep)]"
            />
          </div>
          <p className="mx-auto mt-20 max-w-2xl text-center text-2xl font-light md:text-4xl">
            Mientras la ciudad duerme, <span className="text-gradient-amber">miles de trailers</span>{" "}
            mantienen los anaqueles llenos.
          </p>
          <footer className="mt-24 border-t border-border pt-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Presentación 3D interactiva · Trailers
          </footer>
        </section>
      </div>
    </main>
  );
}
