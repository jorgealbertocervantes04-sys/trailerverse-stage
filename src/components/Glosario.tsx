import { useMemo, useState } from "react";

const terminos = [
  { t: "Quinta rueda", d: "El acoplamiento del tractor donde se engancha el remolque. Si falla, no hay viaje." },
  { t: "Dolly", d: "Convertidor que permite enganchar un segundo remolque para formar un full." },
  { t: "Full (doble remolque)", d: "Dos cajas jaladas por un tractor. Más carga por viaje, más permisos y más riesgo." },
  { t: "Deadhead / km en vacío", d: "Kilómetros recorridos sin carga. Cuestan igual pero no se cobran." },
  { t: "Flete de retorno", d: "Carga que consigues para el viaje de regreso. Es donde vive buena parte de la utilidad." },
  { t: "Broker", d: "Intermediario que consigue la carga y te la subcontrata quedándose una comisión." },
  { t: "Carta porte", d: "Complemento fiscal obligatorio que ampara la mercancía en tránsito. Sin ella, multa y carga detenida." },
  { t: "Tercerizado", d: "Operar bajo el permiso y los clientes de otra empresa transportista." },
  { t: "Caja seca", d: "Remolque cerrado para carga general que no requiere temperatura." },
  { t: "Termo / refrigerado", d: "Caja con equipo de frío. Paga más, pero consume diésel extra y exige mantenimiento del termo." },
  { t: "Plataforma", d: "Remolque abierto para carga de gran volumen o maquinaria; requiere amarre y lonas." },
  { t: "Tolva", d: "Remolque para granel: cemento, granos, arena." },
  { t: "Tara y peso bruto", d: "Peso vacío de la unidad y peso total cargado. Exceder el bruto autorizado es multa e inseguridad." },
  { t: "Bitácora de horas", d: "Registro de tiempos de conducción y descanso del operador. Es control de fatiga y respaldo legal." },
  { t: "Factor de ocupación", d: "Porcentaje del tiempo que la unidad está generando ingreso, no parada." },
  { t: "Días cartera", d: "Cuántos días tarda tu cliente en pagarte la factura. Define si necesitas capital de trabajo." },
];

export function Glosario() {
  const [q, setQ] = useState("");
  const lista = useMemo(
    () =>
      terminos.filter(
        (x) =>
          x.t.toLowerCase().includes(q.toLowerCase()) || x.d.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div className="mt-10">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busca un término del oficio…"
        className="w-full max-w-md rounded-lg border border-border bg-card/70 px-4 py-3 text-sm backdrop-blur-md outline-none placeholder:text-muted-foreground focus:border-primary"
      />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((x) => (
          <div key={x.t} className="rounded-lg border border-border bg-card/70 p-5 backdrop-blur-md">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{x.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{x.d}</p>
          </div>
        ))}
      </div>
      {lista.length === 0 && (
        <p className="mt-8 text-sm text-muted-foreground">Sin resultados para “{q}”.</p>
      )}
    </div>
  );
}
