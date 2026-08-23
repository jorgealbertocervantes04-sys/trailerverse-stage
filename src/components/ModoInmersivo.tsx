import { useEffect, useState } from "react";

type Props = {
  estacion: number;
  total: number;
  etiqueta: string;
  km: number;
  ruta: string[];
};

export function ModoInmersivo({ estacion, total, etiqueta, km, ruta }: Props) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("modo-juego", on);
    return () => document.documentElement.classList.remove("modo-juego");
  }, [on]);

  const toggle = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setOn((v) => !v);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="fixed left-4 top-4 z-50 rounded-full border border-primary/50 bg-card/85 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-primary backdrop-blur-md transition-colors hover:bg-primary hover:text-primary-foreground md:left-auto md:right-56"
      >
        {on ? "Salir del modo viaje" : "Modo viaje ⛶"}
      </button>

      {on && (
        <>
          {/* viñeta de cabina */}
          <div
            className="pointer-events-none fixed inset-0 z-40"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 45%, oklch(0 0 0 / 0.65) 100%)",
            }}
          />
          {/* HUD tipo tablero */}
          <div className="pointer-events-none fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6 rounded-full border border-primary/40 bg-card/85 px-6 py-3 backdrop-blur-md md:bottom-6">
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Estación</p>
              <p className="font-display text-xl leading-none text-primary">
                {String(estacion).padStart(2, "0")}/{String(total - 1).padStart(2, "0")}
              </p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Tramo</p>
              <p className="text-xs uppercase tracking-[0.2em]">{etiqueta}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Odómetro</p>
              <p className="font-display text-xl leading-none text-gradient-amber">
                {km.toLocaleString("es-MX")} km
              </p>
            </div>
            {ruta.length > 0 && (
              <>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                    Tu ruta
                  </p>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">
                    {ruta.join(" · ")}
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
