import { useMemo } from "react";

type Tone = "cab" | "cabDark" | "box" | "boxLight" | "wheel" | "chassis" | "chrome" | "glass";

type BoxProps = {
  w: number;
  h: number;
  d: number;
  x?: number;
  y?: number;
  z?: number;
  tone?: Tone;
  glow?: boolean;
  ribbed?: boolean;
  opacity?: number;
};

const tones: Record<Tone, string> = {
  cab: "bg-steel-1",
  cabDark: "bg-steel-2",
  box: "bg-steel-0",
  boxLight: "bg-steel-1",
  wheel: "bg-steel-2",
  chassis: "bg-steel-2",
  chrome: "bg-steel-1",
  glass: "bg-steel-2",
};

function Box({
  w,
  h,
  d,
  x = 0,
  y = 0,
  z = 0,
  tone = "box",
  glow = false,
  ribbed = false,
  opacity = 1,
}: BoxProps) {
  const faces = useMemo(
    () => [
      { t: `translateZ(${d / 2}px)`, w, h, shade: "brightness-110", rib: ribbed },
      { t: `rotateY(180deg) translateZ(${d / 2}px)`, w, h, shade: "brightness-[0.7]", rib: ribbed },
      { t: `rotateY(90deg) translateZ(${w / 2}px)`, w: d, h, shade: "brightness-95", rib: false },
      { t: `rotateY(-90deg) translateZ(${w / 2}px)`, w: d, h, shade: "brightness-[0.55]", rib: false },
      { t: `rotateX(90deg) translateZ(${h / 2}px)`, w, h: d, shade: "brightness-125", rib: false },
      { t: `rotateX(-90deg) translateZ(${h / 2}px)`, w, h: d, shade: "brightness-[0.45]", rib: false },
    ],
    [w, h, d, ribbed],
  );

  return (
    <div
      className="preserve-3d absolute left-1/2 top-1/2"
      style={{ transform: `translate3d(${x - w / 2}px, ${y - h / 2}px, ${z}px)`, opacity }}
    >
      {faces.map((f, i) => (
        <div
          key={i}
          className={`absolute border border-border/50 ${tones[tone]} ${f.shade} ${
            f.rib ? "panel-ribs" : ""
          }`}
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

/** Rueda con llanta + rin visible en ambas caras */
function Wheel({ x, y, z, glow }: { x: number; y: number; z: number; glow?: boolean }) {
  const r = 30;
  const width = 26;
  const sides = 14;
  return (
    <div
      className="preserve-3d absolute left-1/2 top-1/2"
      style={{ transform: `translate3d(${x}px, ${y}px, ${z}px)` }}
    >
      {/* banda de rodamiento */}
      {Array.from({ length: sides }).map((_, i) => {
        const a = (360 / sides) * i;
        const seg = (2 * Math.PI * r) / sides + 2;
        return (
          <div
            key={i}
            className="absolute bg-steel-2 brightness-[0.8]"
            style={{
              width: width,
              height: seg,
              left: -width / 2,
              top: -seg / 2,
              transform: `rotateX(${a}deg) translateZ(${r}px)`,
              boxShadow: glow ? "var(--glow-amber)" : undefined,
            }}
          />
        );
      })}
      {/* rines */}
      {[width / 2 + 0.5, -width / 2 - 0.5].map((zz, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-border/70"
          style={{
            width: r * 2,
            height: r * 2,
            left: -r,
            top: -r,
            transform: `translateZ(${zz}px)`,
            background:
              "radial-gradient(circle at 40% 35%, oklch(0.62 0.02 65), oklch(0.3 0.012 60) 62%, oklch(0.22 0.01 60))",
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
  { id: "cabina", label: "Cabina", x: -240, y: -130, z: 70 },
  { id: "caja", label: "Caja seca", x: 150, y: -170, z: 78 },
  { id: "quinta", label: "Quinta rueda", x: -95, y: -5, z: 70 },
  { id: "ejes", label: "Ejes traseros", x: 300, y: 75, z: 70 },
];

export function Trailer3D({ rotY, rotX, scale = 1, active }: Props) {
  const cabOn = active === "cabina";
  const boxOn = active === "caja";

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
        {/* sombra proyectada */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: 900,
            height: 260,
            transform: "translate(-50%, -50%) rotateX(90deg) translateZ(-118px)",
            background: "radial-gradient(ellipse at center, oklch(0 0 0 / 0.65), transparent 70%)",
          }}
        />

        {/* ---------- REMOLQUE ---------- */}
        {/* caja principal con costillas */}
        <Box w={430} h={215} d={152} x={150} y={-150} tone="box" glow={boxOn} ribbed />
        {/* techo translúcido */}
        <Box w={432} h={8} d={154} x={150} y={-259} tone="boxLight" />
        {/* faldón aerodinámico */}
        <Box w={330} h={54} d={130} x={130} y={-14} tone="chassis" />
        {/* chasis del remolque */}
        <Box w={440} h={18} d={124} x={150} y={-38} tone="chassis" />
        {/* puertas traseras */}
        <Box w={10} h={205} d={148} x={366} y={-150} tone="chassis" />
        {/* parachoques trasero */}
        <Box w={14} h={12} d={150} x={368} y={-4} tone="chrome" />
        {/* soportes de aterrizaje */}
        <Box w={12} h={70} d={12} x={-10} y={-2} tone="chassis" />
        <Box w={12} h={70} d={12} x={-10} y={-2} z={-60} tone="chassis" />

        {/* ---------- TRACTOR ---------- */}
        {/* dormitorio */}
        <Box w={110} h={175} d={150} x={-190} y={-140} tone="cab" glow={cabOn} />
        {/* cabina */}
        <Box w={95} h={165} d={148} x={-288} y={-135} tone="cab" glow={cabOn} />
        {/* parabrisas */}
        <div
          className="absolute left-1/2 top-1/2 border border-border/70"
          style={{
            width: 96,
            height: 66,
            transform: "translate3d(-336px, -240px, 0) rotateY(0deg) skewX(0deg)",
            background: "linear-gradient(160deg, oklch(0.72 0.05 220 / 0.8), oklch(0.3 0.03 230 / 0.9))",
          }}
        />
        {/* cofre / motor */}
        <Box w={92} h={92} d={140} x={-372} y={-72} tone="cab" glow={cabOn} />
        {/* parrilla cromada */}
        <div
          className="absolute left-1/2 top-1/2 grille"
          style={{
            width: 86,
            height: 74,
            transform: "translate3d(-455px, -108px, 0) rotateY(-90deg)",
          }}
        />
        {/* defensa delantera */}
        <Box w={16} h={26} d={148} x={-424} y={-22} tone="chrome" />
        {/* tanques de diésel */}
        <Box w={90} h={44} d={30} x={-235} y={-30} z={72} tone="chrome" />
        <Box w={90} h={44} d={30} x={-235} y={-30} z={-72} tone="chrome" />
        {/* escapes verticales */}
        <Box w={14} h={210} d={14} x={-146} y={-160} z={68} tone="chrome" />
        <Box w={14} h={210} d={14} x={-146} y={-160} z={-68} tone="chrome" />
        {/* deflector de techo */}
        <Box w={100} h={38} d={140} x={-215} y={-243} tone="cabDark" glow={cabOn} />
        {/* quinta rueda */}
        <Box w={92} h={22} d={116} x={-120} y={-42} tone="chassis" glow={active === "quinta"} />
        {/* chasis tractor */}
        <Box w={230} h={16} d={100} x={-250} y={-30} tone="chassis" />

        {/* ---------- RUEDAS ---------- */}
        {[
          { x: -350, z: 76 },
          { x: -350, z: -76 },
          { x: -175, z: 76 },
          { x: -175, z: -76 },
          { x: -128, z: 76 },
          { x: -128, z: -76 },
          { x: 268, z: 76 },
          { x: 268, z: -76 },
          { x: 322, z: 76 },
          { x: 322, z: -76 },
        ].map((wct, i) => (
          <Wheel key={i} x={wct.x} y={22} z={wct.z} glow={active === "ejes" && wct.x > 0} />
        ))}

        {/* faros */}
        {[-56, 56].map((zz) => (
          <div
            key={zz}
            className="absolute left-1/2 top-1/2 rounded-sm"
            style={{
              width: 34,
              height: 16,
              background: "var(--gradient-amber)",
              boxShadow: "var(--glow-amber)",
              transform: `translate3d(-448px, -60px, ${zz}px) rotateY(-90deg)`,
            }}
          />
        ))}
        {/* luces de gálibo */}
        {[-330, -300, -270, -240].map((xx) => (
          <div
            key={xx}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 7,
              height: 7,
              background: "oklch(0.86 0.15 80)",
              boxShadow: "0 0 12px oklch(0.86 0.15 80 / 0.9)",
              transform: `translate3d(${xx}px, -222px, 74px)`,
            }}
          />
        ))}
        {/* calaveras traseras */}
        {[-50, 50].map((zz) => (
          <div
            key={zz}
            className="absolute left-1/2 top-1/2 rounded-sm"
            style={{
              width: 12,
              height: 26,
              background: "oklch(0.58 0.2 25)",
              boxShadow: "0 0 16px oklch(0.58 0.2 25 / 0.8)",
              transform: `translate3d(${374}px, -60px, ${zz}px) rotateY(90deg)`,
            }}
          />
        ))}

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
