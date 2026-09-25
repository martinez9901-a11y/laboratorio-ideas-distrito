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
const CAMPOS_FICHA = ["objetivo", "publico", "mensaje", "canales", "tiempo", "presupuesto", "riesgos"];
const ESQUEMA = {
  type: "OBJECT",
  required: ["ideas"],
  properties: {
    ideas: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        required: ["titulo", "red", "descripcion", "diferenciador", ...CAMPOS_FICHA, "pasos", "metricas"],
        propertyOrdering: ["titulo", "red", "descripcion", "diferenciador", ...CAMPOS_FICHA, "pasos", "metricas"],
        properties: {
          titulo: TEXTO,
          red: TEXTO,
          descripcion: TEXTO,
          diferenciador: TEXTO,
          objetivo: TEXTO,
          publico: TEXTO,
          mensaje: TEXTO,
          canales: LISTA,
          tiempo: TEXTO,
          presupuesto: TEXTO,
          riesgos: TEXTO,
          pasos: LISTA,
          metricas: LISTA,
        },
      },
    },
  },
};

const ETIQUETAS = {
  descripcion: "Lo que queremos (descrito por el equipo)",
  objetivo: "Objetivo principal",
  publico: "Cliente ideal / público",
  servicio: "Servicio a promover",
  plazo: "Plazo",
  presupuesto: "Presupuesto disponible",
  tono: "Tono",
  evitar: "Qué evitar o qué ya probamos",
  metrica: "Métrica que más nos importa",
};

async function conIA(p) {
  const detalleRed =
    p.tipo === "redes"
      ? `Red social: ${p.red || "Facebook, Instagram y LinkedIn (reparte las ideas entre las tres)"}.
En "descripcion" incluye el formato (carrusel, reel, post, artículo, video corto), el gancho inicial y el texto (copy) listo para publicar con hashtags. "red" = la red social.`
      : `"red" = cadena vacía salvo que la idea sea para una red social específica.`;

  const brief = Object.entries(ETIQUETAS)
    .filter(([k]) => p[k])
    .map(([k, etiqueta]) => `- ${etiqueta}: ${p[k]}`)
    .join("\n");

  const { ideas } = await geminiJSON({
    sistema: `${VOZ}\n\n${EMPRESA}`,
    esquema: ESQUEMA,
    mensajes: [
      {
        role: "user",
        imagenes: p.imagenes,
        content: `Genera ${p.cantidad} ${TIPO_TXT[p.tipo]} para Distrito Aduanal.

${brief ? `BRIEF DEL EQUIPO (respétalo al pie de la letra; es lo más importante):\n${brief}\n` : "No hay brief: propón ideas variadas.\n"}
${p.imagenes.length ? `Adjuntamos ${p.imagenes.length} imagen(es) de referencia: analízalas y úsalas como contexto (estilo, producto, competencia, evento, etc.).\n` : ""}
${detalleRed}

Cada idea debe ser un plan sólido y aterrizado, no una generalidad. Campos:
- "titulo": nombre corto y atractivo.
- "descripcion": en qué consiste, en 2 a 4 frases concretas.
- "diferenciador": por qué nos pone por encima de la competencia (1 frase).
- "objetivo": qué resultado de negocio buscamos.
- "publico": a quién va dirigida exactamente.
- "mensaje": el mensaje clave que queremos que recuerden (1 frase).
- "canales": dónde se ejecuta (lista corta).
- "tiempo": duración o calendario sugerido.
- "presupuesto": estimado aproximado en pesos mexicanos o "Sin costo".
- "riesgos": el principal riesgo y cómo evitarlo (1 frase).
- "pasos": 3 a 5 pasos concretos, en orden, con responsable o fecha cuando aplique.
- "metricas": 2 o 3 KPIs, cada uno con meta (ej. "Prospectos generados: 15 al mes").
Que sean originales y realistas para una agencia aduanal; evita lo que ya hace cualquier competidor.`,
      },
    ],
  });
  if (!Array.isArray(ideas) || !ideas.length) throw new Error("Respuesta vacía de la IA");
  return ideas.slice(0, p.cantidad);
}

const texto = (v, max) => String(v ?? "").trim().slice(0, max);

// Imágenes de referencia: data URL de imagen, máximo 3 y ~1.5 MB cada una.
function leerImagenes(lista) {
  return (Array.isArray(lista) ? lista : [])
    .slice(0, 3)
    .map((d) => /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(d)))
    .filter((m) => m && m[2].length < 2_000_000)
    .map((m) => ({ mimeType: m[1], data: m[2] }));
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
    cantidad: Math.min(Math.max(parseInt(body.cantidad) || 3, 1), 6),
    descripcion: texto(body.descripcion, 1500),
    objetivo: texto(body.objetivo, 300),
    publico: texto(body.publico, 300),
    servicio: texto(body.servicio, 120),
    plazo: texto(body.plazo, 80),
    presupuesto: texto(body.presupuesto, 80),
    tono: texto(body.tono, 80),
    evitar: texto(body.evitar, 400),
    metrica: texto(body.metrica, 200),
    imagenes: leerImagenes(body.imagenes),
  };
  // Para las plantillas (sin IA): el tema corto se usa en los títulos.
  const sinIA = () => generarSinIA({ ...params, tema: params.descripcion.length <= 50 ? params.descripcion : params.servicio });

  if (iaActiva()) {
    return jsonConEspera(
      conIA(params)
        .then((ideas) => ({ fuente: "ia", ideas }))
        .catch((err) => {
          console.error("Error con Gemini, uso plantillas:", err);
          return { fuente: "plantillas", aviso: err.publico || "", ideas: sinIA() };
        }),
    );
  }
  return json({ fuente: "plantillas", ideas: sinIA() });
};

export const config = { path: "/api/generar" };
