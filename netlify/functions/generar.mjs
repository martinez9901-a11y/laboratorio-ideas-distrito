// Generador de ideas (lluvia de ideas).
// Con GEMINI_API_KEY configurada en Netlify usa la IA de Gemini (nivel gratuito);
// sin ella, o si la IA falla, usa el banco de plantillas de ../lib/plantillas.mjs.
import { EMPRESA, VOZ, json, jsonConEspera, geminiJSON, iaActiva } from "../lib/distrito.mjs";
import { generarSinIA } from "../lib/plantillas.mjs";

const TIPO_TXT = {
  ventas: "estrategias de venta para conseguir y retener clientes",
  redes: "ideas de publicaciones para redes sociales",
  visibilidad: "acciones para dar visibilidad y posicionar la marca de la empresa",
  mejora: "acciones para ser mejores que la competencia (servicio, tiempos, experiencia del cliente, tecnología) y demostrarlo con métricas",
};

// Esquema de respuesta en el formato de Gemini.
const TEXTO = { type: "STRING" };
const LISTA = { type: "ARRAY", items: { type: "STRING" } };
const ESQUEMA = {
  type: "OBJECT",
  required: ["ideas"],
  properties: {
    ideas: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        required: ["titulo", "descripcion", "pasos", "red", "diferenciador", "metricas"],
        propertyOrdering: ["titulo", "red", "descripcion", "diferenciador", "pasos", "metricas"],
        properties: { titulo: TEXTO, red: TEXTO, descripcion: TEXTO, diferenciador: TEXTO, pasos: LISTA, metricas: LISTA },
      },
    },
  },
};

async function conIA({ tipo, red, tema, publico, cantidad }) {
  const detalleRed =
    tipo === "redes"
      ? `Red social: ${red || "Facebook, Instagram y LinkedIn (reparte las ideas entre las tres)"}.
Para cada idea: "descripcion" incluye el formato (carrusel, reel, post, artículo, video corto), el gancho inicial y un borrador del texto (copy) listo para publicar con hashtags. "pasos" = cómo producirla. "red" = la red social.`
      : `"pasos" = 3 a 5 primeros pasos concretos para ejecutarla. "red" = cadena vacía salvo que la idea sea para una red social específica.`;

  const { ideas } = await geminiJSON({
    sistema: `${VOZ}\n\n${EMPRESA}`,
    esquema: ESQUEMA,
    mensajes: [
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
  if (!Array.isArray(ideas) || !ideas.length) throw new Error("Respuesta vacía de la IA");
  return ideas.slice(0, cantidad);
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

  if (iaActiva()) {
    return jsonConEspera(
      conIA(params)
        .then((ideas) => ({ fuente: "ia", ideas }))
        .catch((err) => {
          console.error("Error con Gemini, uso plantillas:", err);
          return { fuente: "plantillas", ideas: generarSinIA(params) };
        }),
    );
  }
  return json({ fuente: "plantillas", ideas: generarSinIA(params) });
};

export const config = { path: "/api/generar" };
