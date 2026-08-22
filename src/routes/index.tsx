import { createFileRoute } from "@tanstack/react-router";
import { HistoriaPage } from "./-historia";

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
  component: HistoriaPage,
});
