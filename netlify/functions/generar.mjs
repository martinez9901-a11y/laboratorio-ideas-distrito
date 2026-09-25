// Generador de ideas (lluvia de ideas).
// Por defecto es gratis: usa el banco de plantillas de ../lib/plantillas.mjs.
// Solo si algún día se configura ANTHROPIC_API_KEY en Netlify (de pago), usa la IA de Claude.
import Anthropic from "@anthropic-ai/sdk";
import { EMPRESA, VOZ, MODELO, json, jsonConEspera } from "../lib/distrito.mjs";
import { generarSinIA } from "../lib/plantillas.mjs";

const TIPO_TXT = {
  ventas: "estrategias de venta para conseguir y retener clientes",
  redes: "ideas de publicaciones para redes sociales",
  visibilidad: "acciones para dar visibilidad y posicionar la marca de la empresa",
  mejora: "acciones para ser mejores que la competencia (servicio, tiempos, experiencia del cliente, tecnología) y demostrarlo con métricas",
};

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["ideas"],
  properties: {
    ideas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["titulo", "descripcion", "pasos", "red", "diferenciador", "metricas"],
        properties: {
          titulo: { type: "string" },
          descripcion: { type: "string" },
          pasos: { type: "array", items: { type: "string" } },
          red: { type: "string" },
          diferenciador: { type: "string" },
          metricas: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

async function conClaude({ tipo, red, tema, publico, cantidad }) {
  const client = new Anthropic();
  const detalleRed =
    tipo === "redes"
      ? `Red social: ${red || "Facebook, Instagram y LinkedIn (reparte las ideas entre las tres)"}.
Para cada idea: "descripcion" incluye el formato (carrusel, reel, post, artículo, video corto), el gancho inicial y un borrador del texto (copy) listo para publicar con hashtags. "pasos" = cómo producirla. "red" = la red social.`
      : `"pasos" = 3 a 5 primeros pasos concretos para ejecutarla. "red" = cadena vacía salvo que la idea sea para una red social específica.`;

  const response = await client.messages.create({
    model: MODELO,
    max_tokens: 16000,
    output_config: { effort: "medium", format: { type: "json_schema", schema: SCHEMA } },
    system: `${VOZ}\n\n${EMPRESA}`,
    messages: [
      {
        role: "user",
        content: `Genera ${cantidad} ${TIPO_TXT[tipo]} para Distrito Aduanal.
${tema ? `Tema u objetivo: ${tema}.` : ""}
${publico ? `Público objetivo: ${publico}.` : ""}
${detalleRed}
Que sean ideas variadas, originales y realistas; evita lo que ya hace cualquier agencia aduanal.
"metricas" = 2 o 3 KPIs concretos para medir el éxito, cada uno con una meta sugerida (ej. "Prospectos generados: 15 al mes").
"diferenciador" = una frase que explique por qué esta idea pone a Distrito por encima de la competencia.`,
      },
    ],
  });

  if (response.stop_reason === "refusal") throw new Error("La solicitud fue rechazada");
  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  return JSON.parse(text).ideas;
}

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }
  const params = {
    tipo: ["ventas", "redes", "visibilidad", "mejora"].includes(body.tipo) ? body.tipo : "ventas",
    red: ["Facebook", "Instagram", "LinkedIn"].includes(body.red) ? body.red : "",
    tema: String(body.tema ?? "").slice(0, 200),
    publico: String(body.publico ?? "").slice(0, 200),
    cantidad: Math.min(Math.max(parseInt(body.cantidad) || 4, 1), 6),
  };

  if (process.env.ANTHROPIC_API_KEY) {
    return jsonConEspera(
      conClaude(params)
        .then((ideas) => ({ fuente: "ia", ideas }))
        .catch((err) => {
          console.error("Error con Claude, uso plantillas:", err);
          return { fuente: "plantillas", ideas: generarSinIA(params) };
        }),
    );
  }
  return json({ fuente: "plantillas", ideas: generarSinIA(params) });
};

export const config = { path: "/api/generar" };
