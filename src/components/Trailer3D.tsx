import { useMemo } from "react";

type BoxProps = {
  w: number;
  h: number;
  d: number;
  x?: number;
  y?: number;
  z?: number;
  tone?: "cab" | "box" | "wheel" | "chassis";
  glow?: boolean;
  label?: string;
};

const tones: Record<NonNullable<BoxProps["tone"]>, string> = {
  cab: "bg-steel-1",
  box: "bg-steel-0",
  wheel: "bg-steel-2",
  chassis: "bg-steel-2",
};

function Box({ w, h, d, x = 0, y = 0, z = 0, tone = "box", glow = false }: BoxProps) {
  const faces = useMemo(
    () => [
      { t: `translateZ(${d / 2}px)`, w, h, shade: "brightness-110" },
      { t: `rotateY(180deg) translateZ(${d / 2}px)`, w, h, shade: "brightness-75" },
      { t: `rotateY(90deg) translateZ(${w / 2}px)`, w: d, h, shade: "brightness-95" },
      { t: `rotateY(-90deg) translateZ(${w / 2}px)`, w: d, h, shade: "brightness-[0.6]" },
      { t: `rotateX(90deg) translateZ(${h / 2}px)`, w, h: d, shade: "brightness-125" },
      { t: `rotateX(-90deg) translateZ(${h / 2}px)`, w, h: d, shade: "brightness-50" },
    ],
    [w, h, d],
  );

  return (
    <div
      className="preserve-3d absolute left-1/2 top-1/2"
      style={{ transform: `translate3d(${x - w / 2}px, ${y - h / 2}px, ${z}px)` }}
    >
      {faces.map((f, i) => (
        <div
          key={i}
          className={`absolute border border-border/60 ${tones[tone]} ${f.shade}`}
          style={{
            width: f.w,
            height: f.h,
            transform: `translate(-50%, -50%) ${f.t}`,
            left: w / 2,
            top: h / 2,
            boxShadow: glow ? "var(--glow-amber)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

type Props = {
  rotY: number;
  rotX: number;
  scale?: number;
  active: string | null;
};

const hotspots = [
  { id: "cabina", label: "Cabina", x: -240, y: -70, z: 60 },
  { id: "caja", label: "Caja seca", x: 130, y: -110, z: 60 },
  { id: "quinta", label: "Quinta rueda", x: -110, y: 45, z: 60 },
  { id: "ejes", label: "Ejes traseros", x: 250, y: 80, z: 60 },
];

export function Trailer3D({ rotY, rotX, scale = 1, active }: Props) {
  return (
    <div className="stage-3d pointer-events-none relative h-full w-full select-none">
      <div
        className="preserve-3d absolute inset-0"
        style={{
          transform: `scale(${scale}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transition: "transform 120ms linear",
        }}
      >
        {/* piso */}
        <div
          className="grid-floor absolute left-1/2 top-1/2 opacity-40"
          style={{
            width: 1600,
            height: 1600,
            transform: "translate(-50%, -50%) rotateX(90deg) translateZ(-120px)",
            maskImage: "radial-gradient(circle at center, black, transparent 70%)",
          }}
        />

        {/* caja / remolque */}
        <Box w={420} h={210} d={150} x={150} y={-120} tone="box" glow={active === "caja"} />
        {/* chasis remolque */}
        <Box w={430} h={16} d={120} x={150} y={0} tone="chassis" />
        {/* cabina */}
        <Box w={150} h={170} d={148} x={-230} y={-100} tone="cab" glow={active === "cabina"} />
        {/* cofre */}
        <Box w={70} h={80} d={140} x={-340} y={-40} tone="cab" glow={active === "cabina"} />
        {/* quinta rueda */}
        <Box w={80} h={26} d={110} x={-120} y={0} tone="chassis" glow={active === "quinta"} />

        {/* ruedas */}
        {[
          { x: -320, z: 78 },
          { x: -320, z: -78 },
          { x: -170, z: 78 },
          { x: -170, z: -78 },
          { x: 280, z: 78 },
          { x: 280, z: -78 },
          { x: 340, z: 78 },
          { x: 340, z: -78 },
        ].map((wct, i) => (
          <Box
            key={i}
            w={54}
            h={54}
            d={26}
            x={wct.x}
            y={45}
            z={wct.z}
            tone="wheel"
            glow={active === "ejes" && wct.x > 0}
          />
        ))}

        {/* faros */}
        <div
          className="absolute left-1/2 top-1/2 rounded-sm"
          style={{
            width: 40,
            height: 14,
            background: "var(--gradient-amber)",
            boxShadow: "var(--glow-amber)",
            transform: "translate3d(-395px, -20px, 70px)",
          }}
        />

        {/* hotspots */}
        {hotspots.map((h) => (
          <div
            key={h.id}
            className={`absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest backdrop-blur-sm ${
              active === h.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card/70 text-muted-foreground"
            }`}
            style={{ transform: `translate3d(${h.x}px, ${h.y}px, ${h.z}px) rotateY(${-rotY}deg)` }}
          >
            {h.label}
          </div>
        ))}
      </div>
    </div>
  );
}
