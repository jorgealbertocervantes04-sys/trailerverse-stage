import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Trailer3D } from "@/components/Trailer3D";
import { FleetSimulator } from "@/components/FleetSimulator";
import { FaqNovato } from "@/components/FaqNovato";
import heroImg from "@/assets/trailer-hero.jpg";
import cabImg from "@/assets/trailer-cab.jpg";
import fleetImg from "@/assets/trailer-fleet.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "De un trailer a una flota — Historia 3D del transporte" },
      {
        name: "description",
        content:
          "Presentación 3D interactiva: la historia de quien entra al autotransporte, qué trailer comprar, cómo fundar la empresa, los problemas ocultos y lo que conlleva estar al mando de una flota.",
      },

      { property: "og:title", content: "De un trailer a una flota" },
      {
        property: "og:description",
        content:
          "Recorrido inmersivo por el camino de un transportista: unidad, permisos, costos, riesgos y crecimiento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const chapters = [
  { id: "cap-0", label: "El sueño" },
  { id: "cap-1", label: "La unidad" },
  { id: "cap-2", label: "Anatomía" },
  { id: "cap-3", label: "La empresa" },
  { id: "cap-4", label: "El costo real" },
  { id: "cap-5", label: "Lo que nadie cuenta" },
  { id: "cap-6", label: "La flota" },
  { id: "cap-7", label: "El mando" },
  { id: "cap-8", label: "Tu flota" },
  { id: "cap-9", label: "Preguntas" },
  { id: "cap-10", label: "Riesgo" },
  { id: "cap-11", label: "Carta porte" },
  { id: "cap-12", label: "Unidad y tarifa" },
  { id: "cap-13", label: "Checklist" },
  { id: "cap-14", label: "Glosario" },
  { id: "cap-15", label: "Errores" },
  { id: "cap-16", label: "Examen" },
  { id: "cap-17", label: "90 días" },
];

const fiscal = [
  {
    k: "Obligatorio",
    t: "Complemento carta porte",
    d: "Ampara la mercancía en tránsito: origen, destino, mercancía, unidad y operador. Sin él o mal emitido, hay multa y la carga puede quedar detenida.",
  },
  {
    k: "Obligatorio",
    t: "CFDI de ingreso por flete",
    d: "Cada servicio se factura. Si operas con clientes formales, tu capacidad de facturar correctamente es requisito para que te contraten.",
  },
  {
    k: "Régimen",
    t: "Persona física vs. moral",
    d: "Física con actividad empresarial es más simple al inicio; moral da imagen, separa patrimonio y abre licitaciones y clientes grandes.",
  },
  {
    k: "Deducciones",
    t: "Lo que sí puedes deducir",
    d: "Diésel con comprobante fiscal, casetas con factura IAVE, refacciones, seguros, sueldos, depreciación de la unidad y financiamiento.",
  },
  {
    k: "Control",
    t: "Contabilidad semanal, no anual",
    d: "El transporte gasta diario y cobra a 60 días. Sin registro semanal por unidad, no sabes cuál gana y cuál te está comiendo.",
  },
  {
    k: "Vencimientos",
    t: "Calendario de documentos",
    d: "Permiso SICT, placas, verificación físico-mecánica, pólizas y licencia federal. Un vencido detiene la unidad aunque todo lo demás esté perfecto.",
  },
];

const casos = [
  {
    t: "Compró primero, buscó carga después",
    d: "Enganchó una unidad nueva confiando en promesas verbales de un cliente. La carga nunca se formalizó y la mensualidad sí llegó cada mes.",
    l: "Primero asegura carga, luego compra fierro.",
  },
  {
    t: "Confundió facturación con utilidad",
    d: "Facturaba fuerte y se sentía rico, pero nunca separó el costo por unidad. Dos de sus tres camiones perdían dinero cada viaje.",
    l: "Mide utilidad por unidad y por ruta, no el total.",
  },
  {
    t: "Concentró todo en un solo cliente",
    d: "El 80% de sus viajes venían de una sola empresa. Cuando cambiaron de proveedor, su flota quedó parada en dos semanas.",
    l: "Ningún cliente debe pasar del 30% de tu facturación.",
  },
  {
    t: "Ahorró en mantenimiento",
    d: "Estiró servicios y llantas para 'aguantar el mes'. Terminó pagando una reparación mayor y perdiendo al cliente por entregas tarde.",
    l: "El mantenimiento preventivo siempre es más barato que el correctivo.",
  },
];

const plan90 = [
  {
    t: "Días 1–30 · Fundamentos",
    pasos: [
      "Definir régimen fiscal y darte de alta",
      "Cotizar y arrancar trámite de permiso SICT",
      "Calcular tu costo por km con datos reales",
      "Hablar con 10 transportistas y 5 brokers",
    ],
  },
  {
    t: "Días 31–60 · La unidad",
    pasos: [
      "Elegir configuración según la carga objetivo",
      "Revisión mecánica independiente antes de pagar",
      "Contratar seguro de RC y de carga",
      "Abrir cuenta bancaria exclusiva de la empresa",
    ],
  },
  {
    t: "Días 61–90 · Operación",
    pasos: [
      "Cerrar tu primer cliente o contrato con broker",
      "Montar control semanal de ingresos y gastos por unidad",
      "Definir política de mantenimiento y de cobranza",
      "Fondear la reserva para reparación mayor",
    ],
  },
];



const parts = [
  {
    id: "cabina",
    label: "Cabina",
    text: "Aquí vive el operador. Una cabina dormitorio en buen estado retiene chóferes; una mala cabina te los ahuyenta y sin operador el trailer no factura.",
  },
  {
    id: "quinta",
    label: "Quinta rueda",
    text: "El punto donde tracto y caja se vuelven uno. Un mal enganche o falta de mantenimiento aquí es de los errores más caros y peligrosos del oficio.",
  },
  {
    id: "caja",
    label: "Caja / remolque",
    text: "Define a qué mercado entras. Caja seca es el camino más barato de aprender; refrigerada o tanque pagan más pero exigen inversión, certificaciones y clientes distintos.",
  },
  {
    id: "ejes",
    label: "Ejes y llantas",
    text: "El consumible que más se subestima. Llantas y frenos se comen la utilidad si no llevas control por kilómetro recorrido.",
  },
];

const decision = [
  {
    n: "01",
    t: "¿Nueva o usada?",
    d: "Nueva: garantía, financiamiento y menos paros, pero mensualidad alta desde el día uno. Usada: entrada baja, taller frecuente. La regla del novato: la unidad más barata suele ser la más cara.",
  },
  {
    n: "02",
    t: "Revisa antes de firmar",
    d: "Motor y transmisión, historial de servicio, kilometraje real, corrosión de chasis, papeles y verificación de que no tenga reporte de robo ni adeudos.",
  },
  {
    n: "03",
    t: "Elige el tipo por el cliente",
    d: "Primero consigue a quién le vas a mover carga; después compra la caja que ese cliente necesita. Comprar la unidad y luego buscar flete es cómo quiebra la mayoría.",
  },
  {
    n: "04",
    t: "Reserva de arranque",
    d: "Aparta capital de trabajo para diésel, casetas, mantenimiento y sueldos de varios meses. Los clientes pagan a crédito; tú pagas de contado.",
  },
];

const empresa = [
  { t: "Figura fiscal", d: "Darte de alta como empresa o persona física con actividad empresarial, contabilidad y facturación en regla." },
  { t: "Permiso de carga", d: "Autorización oficial para transporte de carga y placas de servicio federal o local, según a dónde vayas a mover." },
  { t: "Seguros", d: "Seguro de la unidad y, sobre todo, seguro de la mercancía y responsabilidad civil. Sin esto un solo siniestro te borra." },
  { t: "Operadores", d: "Licencia vigente del tipo correcto, exámenes médicos, contrato y capacitación. El operador es tu socio operativo." },
  { t: "Control de gastos", d: "Bitácora por viaje: diésel, casetas, viáticos, llantas, servicios. Sin costo por kilómetro no sabes si ganas o pierdes." },
  { t: "Cartera de clientes", d: "Contratos, cartas porte y condiciones de pago claras. Diversifica: depender de un solo cliente es una trampa." },
];

const costos = [
  { k: "Diésel", d: "El gasto número uno del viaje; el rendimiento por litro define tu margen." },
  { k: "Casetas", d: "Rutas con peaje encarecen el viaje; hay que cotizarlas antes de aceptar el flete." },
  { k: "Mantenimiento", d: "Preventivo programado y un fondo para la falla que sí va a llegar." },
  { k: "Nómina", d: "Sueldo, viáticos y bonos del operador, se pague o no el flete a tiempo." },
];

const dolores = [
  {
    t: "Te pagan a 30, 60 o 90 días",
    d: "Facturas y esperas; mientras tanto el diésel y la nómina no esperan. La falta de flujo mata más empresas que la falta de trabajo.",
  },
  {
    t: "Tiempos muertos en carga y descarga",
    d: "Horas o días esperando andén. El trailer parado sigue costando y casi nadie cobra esa estadía.",
  },
  {
    t: "Inseguridad en carretera",
    d: "Robo de mercancía y de unidades en tramos conocidos. Obliga a rastreo, rutas planeadas y horarios definidos.",
  },
  {
    t: "Rotación de operadores",
    d: "Conseguir y conservar buenos chóferes es más difícil que conseguir carga. Un mal operador destruye unidad, cliente y reputación.",
  },
  {
    t: "El flete de regreso",
    d: "Ir cargado y volver vacío es perder la mitad del viaje. Aprender a cerrar el círculo es lo que vuelve rentable la operación.",
  },
  {
    t: "El desgaste personal",
    d: "Llamadas a las 3 a.m., fallas en medio de la nada, presión de clientes. Nadie te cuenta lo que cuesta anímicamente el primer año.",
  },
];

const flota = [
  { f: "Año 1", t: "Un trailer, tú al frente", d: "Aprendes rutas, costos y clientes con las manos en la operación." },
  { f: "Año 2-3", t: "Segunda y tercera unidad", d: "Reinviertes utilidad, formalizas procesos y contratas operadores." },
  { f: "Año 4+", t: "Flota y estructura", d: "Taller, control de despacho, contratos anuales y márgenes previsibles." },
];

const mando = [
  {
    f: "Despacho",
    t: "El corazón del día a día",
    d: "Decidir qué unidad va a qué carga, por qué ruta, a qué hora y con qué operador. Un mal despacho deja trailers parados, clientes enojados y dinero en la mesa.",
  },
  {
    f: "Clientes",
    t: "Cobrar es parte del servicio",
    d: "Negociar contratos, cobrar a tiempo, decir que no a fletes que no pagan lo suficiente. El dueño es el primer vendedor y el último cobrador.",
  },
  {
    f: "Operadores",
    t: "Gente, no solo licencias",
    d: "Contratar, capacitar, escuchar, retener y, a veces, despedir. Un buen operador vale más que una unidad nueva; un mal clima laboral se nota en los siniestros.",
  },
  {
    f: "Taller",
    t: "Mantenimiento como política",
    d: "Decidir cuándo se repara, cuándo se prefiere prevenir y cuánto gastar. El dueño que no controla el taller pierde el control de la flota.",
  },
  {
    f: "Finanzas",
    t: "Ver el dinero a 90 días",
    d: "Flujo de caja, utilidad real, reservas para llantas, multas y temporadas muertas. La empresa quebrada suele tener facturas, no ventas.",
  },
  {
    f: "Cumplimiento",
    t: "La norma no negocia",
    d: "Permisos vigentes, verificaciones, seguros, documentación de carga y seguridad. Un solo trámite vencido puede parar toda la operación.",
  },
];

const evolucion = [
  { etapa: "Día 1", rol: "Operador y dueño", desc: "Tú manejas, cargas gasolina, negocias el flete y duermes en la cabina." },
  { etapa: "Mes 6", rol: "Coordinador", desc: "Contratas primer operador. Empiezas a despertarte por llamadas de rutas y fallas." },
  { etapa: "Año 1", rol: "Empresario", desc: "Formalizas, facturas, controlas costos y decides si reinviertes o cobras utilidad." },
  { etapa: "Año 3", rol: "Gerente", desc: "Tienes despachador, taller y clientes recurrentes. Tu trabajo es pensar, no conducir." },
  { etapa: "Año 5+", rol: "Director", desc: "Estrategia, financiamiento, expansión y cultura. La empresa ya puede crecer sin ti al volante." },
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

  const scale = 0.8 + Math.sin(progress * Math.PI) * 0.3;

  return (
    <main className="relative">
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
          <Trailer3D rotY={rotY + progress * 320} rotX={rotX} scale={scale} active={active} />
        </div>
      </div>

      <nav className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {chapters.map((c, i) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            <span className="h-px w-6 bg-border transition-all group-hover:w-10 group-hover:bg-primary" />
            <span className="text-primary/60">{String(i).padStart(2, "0")}</span> {c.label}
          </a>
        ))}
      </nav>

      <div className="fixed left-0 top-0 z-40 h-0.5 w-full bg-border/40">
        <div
          className="h-full"
          style={{ width: `${progress * 100}%`, background: "var(--gradient-amber)" }}
        />
      </div>

      <div className="relative z-20">
        {/* CAP 0 */}
        <section
          id="cap-0"
          className="flex min-h-screen flex-col justify-center px-6 md:px-20 lg:px-32"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-primary">Capítulo 00 · El sueño</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-[0.9] md:text-8xl">
            De <span className="text-gradient-amber">un trailer</span>
            <br />a una flota
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Daniel tiene ahorros, licencia y una idea fija: vivir del transporte. Lo que todavía no
            sabe es que comprar el trailer es la parte fácil. Esta es su historia — y el mapa que le
            hubiera gustado tener.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur">
              Arrastra el modelo ⇆
            </span>
            <span className="rounded-full border border-border bg-card/60 px-4 py-2 backdrop-blur">
              Baja para avanzar ↓
            </span>
          </div>
        </section>

        {/* CAP 1 */}
        <section id="cap-1" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 01 · Qué trailer comprar
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold uppercase md:text-6xl">
            La primera decisión que define todo
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Daniel entra a la agencia listo para firmar. El vendedor le habla de caballos de fuerza;
            nadie le habla de flujo de efectivo. Antes de elegir unidad, hay cuatro preguntas.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {decision.map((d) => (
              <article
                key={d.n}
                className="rounded-lg border border-border bg-card/80 p-6 backdrop-blur-md transition-transform hover:-translate-y-1"
                style={{ boxShadow: "var(--shadow-deep)" }}
              >
                <span className="font-display text-4xl text-primary/50">{d.n}</span>
                <h3 className="mt-2 text-xl font-semibold uppercase">{d.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CAP 2 */}
        <section
          id="cap-2"
          className="flex min-h-screen items-center justify-end px-6 py-32 md:px-20 lg:px-32"
        >
          <div
            className="w-full max-w-md rounded-lg border border-border bg-card/85 p-8 backdrop-blur-md"
            style={{ boxShadow: "var(--shadow-deep)" }}
          >
            <p className="text-xs uppercase tracking-[0.4em] text-primary">
              Capítulo 02 · Conocer la máquina
            </p>
            <h2 className="mt-3 text-3xl font-bold uppercase">Anatomía del negocio</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Cada pieza es también una línea de gasto. Toca una para verla en el modelo.
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

        {/* CAP 3 */}
        <section id="cap-3" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 03 · Fundar la empresa
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-bold uppercase md:text-6xl">
            Un trailer no es una empresa
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            El primer flete llega por un conocido. El cliente pide factura, seguro de mercancía y
            documentación de la carga. Daniel descubre que sin estructura no hay negocio, solo un
            camión.
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {empresa.map((e, i) => (
              <article
                key={e.t}
                className="rounded-lg border border-border bg-card/80 p-6 backdrop-blur-md"
                style={{ boxShadow: "var(--shadow-deep)" }}
              >
                <span className="text-[11px] uppercase tracking-[0.3em] text-primary">
                  Requisito {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold uppercase">{e.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.d}</p>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-xs text-muted-foreground">
            Los trámites y nombres exactos cambian según el país y el estado donde operes; valida
            cada requisito con la autoridad de transporte y con tu contador antes de arrancar.
          </p>
        </section>

        {/* CAP 4 */}
        <section id="cap-4" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-primary">
                Capítulo 04 · El costo real
              </p>
              <h2 className="mt-3 text-4xl font-bold uppercase md:text-6xl">
                El flete no es la ganancia
              </h2>
              <p className="mt-6 text-muted-foreground">
                Daniel cobra su primer viaje y se siente rico. Tres semanas después entiende la
                lección central del oficio: lo que importa no es cuánto cobras, sino tu{" "}
                <span className="text-primary">costo por kilómetro</span>. Si no lo conoces, estás
                trabajando gratis sin saberlo.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2">
                {costos.map((c) => (
                  <div key={c.k} className="border-l-2 border-primary pl-4">
                    <p className="font-display text-2xl uppercase text-gradient-amber">{c.k}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 rounded-md border border-primary/40 bg-primary/10 p-4 text-sm">
                Fórmula que Daniel pega en la cabina:{" "}
                <strong>utilidad = flete − (diésel + casetas + mantenimiento + nómina + fijos)</strong>
                . Todo lo demás es opinión.
              </p>
            </div>
            <img
              src={cabImg}
              alt="Detalle del frente de un tractocamión iluminado de noche"
              loading="lazy"
              width={1200}
              height={1200}
              className="rounded-lg border border-border object-cover"
              style={{ boxShadow: "var(--shadow-deep)" }}
            />
          </div>
        </section>

        {/* CAP 5 */}
        <section id="cap-5" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-accent">
            Capítulo 05 · Lo que nadie cuenta
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Los problemas de los que nadie habla
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dolores.map((d) => (
              <article
                key={d.t}
                className="rounded-lg border border-accent/40 bg-card/80 p-6 backdrop-blur-md"
                style={{ boxShadow: "var(--shadow-deep)" }}
              >
                <h3 className="text-lg font-semibold uppercase">{d.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CAP 6 */}
        <section id="cap-6" className="relative min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 06 · La flota
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            El negocio empieza en la unidad dos
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {flota.map((f) => (
              <article
                key={f.f}
                className="rounded-lg border border-border bg-card/80 p-6 backdrop-blur-md"
                style={{ boxShadow: "var(--shadow-deep)" }}
              >
                <span className="text-[11px] uppercase tracking-[0.3em] text-primary">{f.f}</span>
                <h3 className="mt-2 text-xl font-semibold uppercase">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </article>
            ))}
          </div>

          <div className="mt-16 grid items-center gap-6 lg:grid-cols-2">
            <img
              src={heroImg}
              alt="Tractocamión con remolque circulando en carretera al atardecer"
              width={1600}
              height={912}
              className="rounded-lg border border-border object-cover"
              style={{ boxShadow: "var(--shadow-deep)" }}
            />
            <img
              src={fleetImg}
              alt="Vista aérea nocturna de una terminal logística con remolques estacionados"
              loading="lazy"
              width={1600}
              height={912}
              className="rounded-lg border border-border object-cover"
              style={{ boxShadow: "var(--shadow-deep)" }}
            />
          </div>
        </section>

        {/* CAP 7 */}
        <section id="cap-7" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 07 · El mando
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Estar al cargo no es conducir más unidades
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Daniel ya tiene flota. Ahora su trabajo real empieza: tomar decisiones que multipliquen
            lo que otros hacen. Esto es lo que conlleva ser el dueño de una empresa de trailers, de
            principio a fin.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mando.map((m) => (
              <article
                key={m.f}
                className="rounded-lg border border-border bg-card/80 p-6 backdrop-blur-md"
                style={{ boxShadow: "var(--shadow-deep)" }}
              >
                <span className="text-[11px] uppercase tracking-[0.3em] text-primary">{m.f}</span>
                <h3 className="mt-2 text-lg font-semibold uppercase">{m.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
              </article>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold uppercase md:text-3xl">
              De operador a director: la transformación
            </h3>
            <div className="mt-8 grid gap-4 md:grid-cols-5">
              {evolucion.map((e, i) => (
                <div
                  key={e.etapa}
                  className="relative rounded-lg border border-border bg-card/60 p-5 backdrop-blur-sm"
                >
                  <span className="font-display text-3xl text-primary/40">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{e.etapa}</p>
                  <p className="mt-1 text-sm font-semibold uppercase">{e.rol}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{e.desc}</p>
                  {i < evolucion.length - 1 && (
                    <div className="hidden md:block absolute -right-2 top-1/2 h-px w-4 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="mx-auto mt-20 max-w-3xl text-center text-2xl font-light md:text-4xl">
            Cinco años después, Daniel ya no maneja:{" "}
            <span className="text-gradient-amber">dirige</span>. La diferencia no fue tener más
            trailers, fue aprender a estar al cargo de un negocio antes de querer crecerlo.
          </p>
        </section>

        {/* CAP 8 */}
        <section id="cap-8" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 08 · Tu flota
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Elige tu flota y mira los números reales
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Antes de firmar nada, haz lo que Daniel no hizo el primer año: correr el presupuesto.
            Elige un escenario, mueve el precio del diésel y el rendimiento, y observa cómo cambian
            la utilidad, el margen y los años que tardas en recuperar la inversión.
          </p>
          <FleetSimulator />
        </section>

        {/* CAP 9 */}
        <section id="cap-9" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 09 · Preguntas frecuentes
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Las dudas que todo novato tiene
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Respuestas directas, sin adornos, a lo que realmente se pregunta quien está por comprar
            su primer trailer o por formalizar su empresa.
          </p>
          <FaqNovato />
        </section>

        {/* CAP 10 */}
        <section id="cap-10" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 10 · Riesgo y seguridad
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Lo que puede tumbarte en un solo día
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Toca cada tarjeta para pasar del riesgo a la forma concreta de mitigarlo. Daniel aprendió
            esta lista de la peor manera: viviéndola.
          </p>
          <RiesgosInteractivos />
        </section>

        {/* CAP 11 */}
        <section id="cap-11" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 11 · Carta porte y fisco
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            El papeleo también mueve carga
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            En el transporte, un documento mal emitido detiene una unidad igual que una llanta
            ponchada. Esto es lo mínimo que debes dominar.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fiscal.map((f) => (
              <article
                key={f.t}
                className="rounded-lg border border-border bg-card/80 p-6 backdrop-blur-md"
                style={{ boxShadow: "var(--shadow-deep)" }}
              >
                <span className="text-[11px] uppercase tracking-[0.3em] text-primary">{f.k}</span>
                <h3 className="mt-2 text-lg font-semibold uppercase">{f.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CAP 12 */}
        <section id="cap-12" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 12 · Qué unidad y a cuánto cobrar
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Compara unidades y calcula tu tarifa mínima
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Primero elige con qué fierro entras. Después mete tus propios números y descubre por
            debajo de qué tarifa estás trabajando gratis.
          </p>
          <ComparadorUnidades />
          <div className="mt-20">
            <h3 className="text-2xl font-bold uppercase md:text-3xl">
              Calculadora de tarifa mínima
            </h3>
            <CalculadoraTarifa />
          </div>
        </section>

        {/* CAP 13 */}
        <section id="cap-13" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 13 · ¿Estás listo?
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Checklist antes de firmar la compra
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Marca lo que ya tienes resuelto. El porcentaje te dirá si estás por invertir o por
            apostar.
          </p>
          <ChecklistArranque />
        </section>

        {/* CAP 14 */}
        <section id="cap-14" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 14 · Glosario del oficio
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Habla como transportista
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            En una negociación, no entender una palabra te cuesta dinero. Busca cualquier término.
          </p>
          <Glosario />
        </section>

        {/* CAP 15 */}
        <section id="cap-15" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 15 · Errores que quiebran
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Cuatro formas de perderlo todo
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {casos.map((c) => (
              <article
                key={c.t}
                className="rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md"
              >
                <span className="text-[11px] uppercase tracking-[0.3em] text-accent">{c.t}</span>
                <p className="mt-3 text-sm text-muted-foreground">{c.d}</p>
                <p className="mt-4 border-t border-border/60 pt-3 text-sm">
                  <span className="text-primary">Lección: </span>
                  {c.l}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* CAP 16 */}
        <section id="cap-16" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 16 · Examen final
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            ¿Ya piensas como dueño?
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Cinco decisiones reales. Responde y descubre si el curso ya te cambió la cabeza.
          </p>
          <QuizFinal />
        </section>

        {/* CAP 17 */}
        <section id="cap-17" className="min-h-screen px-6 py-32 md:px-20 lg:px-32">
          <p className="text-xs uppercase tracking-[0.4em] text-primary">
            Capítulo 17 · Tus primeros 90 días
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-bold uppercase md:text-6xl">
            Armemos la empresa
          </h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            El plan concreto para pasar de leer a operar. Un bloque de 30 días a la vez.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {plan90.map((p, i) => (
              <div
                key={p.t}
                className="rounded-lg border border-border bg-card/70 p-6 backdrop-blur-md"
                style={{ boxShadow: "var(--shadow-deep)" }}
              >
                <span className="font-display text-4xl text-primary/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold uppercase">{p.t}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {p.pasos.map((s) => (
                    <li key={s} className="border-b border-border/50 pb-2">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-20 max-w-3xl text-center text-2xl font-light md:text-4xl">
            El trailer no hace la empresa.{" "}
            <span className="text-gradient-amber">La disciplina de números sí.</span>
          </p>

          <footer className="mt-24 border-t border-border pt-8 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Historia 3D interactiva · Del primer trailer al mando de la flota
          </footer>
        </section>


      </div>
    </main>
  );
}

