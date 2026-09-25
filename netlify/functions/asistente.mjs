// Asistente de IA (Gemini) para el equipo, todo dentro del sitio:
//  - modo "chat":    lluvia de ideas conversacional (conoce las ideas del tablero)
//  - modo "opinion": analiza una idea del tablero y deja su opinión como comentario guardado
// Requiere GEMINI_API_KEY (Google AI Studio, nivel gratuito) en las variables de entorno de Netlify.
import { getStore } from "@netlify/blobs";
import { EMPRESA, VOZ, json, streamTexto, geminiStream, iaActiva } from "../lib/distrito.mjs";

const ID = /^[a-z0-9-]{1,80}$/i;
const CAT = { ventas: "Ventas", redes: "Redes sociales", visibilidad: "Visibilidad", mejora: "Ser mejores" };

const FORMATO = `Formato de respuesta: texto plano con **negritas**, listas con "- " o "1. " y párrafos cortos.
Sin encabezados con #, sin tablas. Sé concreto y accionable; cuando propongas ideas incluye cómo medirlas (métricas con meta).`;

async function resumenTablero(store) {
  const { blobs } = await store.list({ prefix: "ideas/" });
  const ideas = (await Promise.all(blobs.slice(0, 60).map((b) => store.get(b.key, { type: "json" })))).filter(Boolean);
  return ideas.map((i) => `- [${CAT[i.tipo] || i.tipo}${i.red ? ` · ${i.red}` : ""}] ${i.titulo}`).join("\n");
}

export default async (req) => {
  if (req.method === "GET") return json({ activa: iaActiva() });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);
  if (!iaActiva())
    return json({ error: "La IA aún no está activada. Pide que agreguen GEMINI_API_KEY en la configuración de Netlify." }, 503);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }
  const store = getStore({ name: "tablero-ideas", consistency: "strong" });

  try {
    if (body.modo === "chat") {
      // Historial: alterna user/assistant, empieza y termina con user.
      const mensajes = (Array.isArray(body.mensajes) ? body.mensajes : [])
        .slice(-20)
        .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content ?? "").slice(0, 4000) }))
        .filter((m) => m.content.trim());
      while (mensajes.length && mensajes[0].role !== "user") mensajes.shift();
      const limpio = mensajes.filter((m, i) => i === 0 || m.role !== mensajes[i - 1].role);
      if (!limpio.length || limpio.at(-1).role !== "user") return json({ error: "Escribe un mensaje" }, 400);

      const tablero = await resumenTablero(store);
      const system = `${VOZ}

Tu papel: asistente de lluvia de ideas del equipo de Distrito. Ayudas a generar y aterrizar estrategias de venta,
contenido para Facebook, Instagram y LinkedIn, acciones de visibilidad de marca y formas de ser mejores que la competencia.
Propón ideas originales y realistas para una agencia aduanal mexicana, haz preguntas cuando falte contexto importante
y, si te piden textos para redes, entrégalos listos para publicar.

${EMPRESA}

Ideas que el equipo ya tiene en su tablero (no las repitas; puedes construir sobre ellas):
${tablero || "(el tablero está vacío)"}

${FORMATO}`;
      const nombre = String(body.nombre ?? "").slice(0, 60);
      if (nombre) limpio[limpio.length - 1].content = `(${nombre} del equipo escribe:) ${limpio.at(-1).content}`;
      return streamTexto((escribir) => geminiStream({ sistema: system, mensajes: limpio, escribir }));
    }

    if (body.modo === "opinion") {
      if (!ID.test(body.ideaId || "")) return json({ error: "Idea no válida" }, 400);
      const idea = await store.get(`ideas/${body.ideaId}`, { type: "json" });
      if (!idea) return json({ error: "La idea ya no existe" }, 404);

      const { blobs } = await store.list({ prefix: `comments/${idea.id}/` });
      const comentarios = (await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })))).filter((c) => c && !c.ia);

      return streamTexto(async (escribir) => {
        const texto = await geminiStream({
          sistema: `${VOZ}\n\nEres el asistente de IA del equipo y das retroalimentación honesta y constructiva sobre sus ideas.\n\n${EMPRESA}\n\n${FORMATO}`,
          escribir,
          mensajes: [
            {
              role: "user",
              content: `Analiza esta idea del tablero del equipo y da tu opinión en máximo 180 palabras con este orden:
**Lo mejor:** (1 frase) · **Para hacerla más fuerte:** (2 o 3 mejoras concretas) · **Cuidado con:** (1 riesgo) · **Cómo medirla:** (2 métricas con meta).

Categoría: ${CAT[idea.tipo] || idea.tipo}${idea.red ? ` (${idea.red})` : ""}
Título: ${idea.titulo}
Descripción: ${idea.descripcion || "(sin descripción)"}
${idea.pasos?.length ? `Pasos: ${idea.pasos.join("; ")}` : ""}
${idea.metricas?.length ? `Métricas propuestas: ${idea.metricas.join("; ")}` : ""}
${comentarios.length ? `Comentarios del equipo:\n${comentarios.slice(-10).map((c) => `- ${c.autor}: ${c.texto}`).join("\n")}` : ""}`,
            },
          ],
        });

        const c = {
          id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          ideaId: idea.id,
          respondeA: null,
          autor: "Asistente IA",
          ia: true,
          texto,
          fotos: [],
          fecha: new Date().toISOString(),
        };
        await store.setJSON(`comments/${idea.id}/${c.id}`, c);
      });
    }

    return json({ error: "Modo desconocido" }, 400);
  } catch (err) {
    console.error("Error del asistente:", err);
    return json({ error: "La IA no respondió en este momento. Intenta de nuevo en unos segundos." }, 502);
  }
};

export const config = { path: "/api/asistente" };
