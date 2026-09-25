// Contexto de marca + conexión con Gemini (Google AI Studio), compartidos por el generador y el asistente.

export const EMPRESA = `Distrito Aduanal es una agencia aduanal en México. Servicios: despacho aduanero de importación y exportación,
clasificación arancelaria, asesoría en comercio exterior (IMMEX, certificación IVA/IEPS, OEA, T-MEC, PROSEC),
cumplimiento de NOMs, logística y coordinación con transportistas y forwarders. Clientes: importadores y exportadores,
desde PyMEs que empiezan a importar hasta empresas manufactureras. Redes sociales: Facebook, Instagram y LinkedIn.`;

export const VOZ = `Eres parte del equipo de marketing y ventas de Distrito Aduanal, especialista en comercio exterior en México.
Escribe con la voz de Distrito: humana, cercana y cálida, pero formal y profesional. Habla en primera persona del plural
("en Distrito te acompañamos", "nuestro equipo"), tutea al cliente, pon a las personas al centro (el equipo, los clientes,
sus historias) y evita tecnicismos innecesarios o frases de robot. Usa hashtags de marca como #SomosDistrito y #DistritoAduanal
cuando se trate de redes sociales. Español de México.`;

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

// ---------------------------------------------------------------------------
// Gemini
// ---------------------------------------------------------------------------
// El sitio le pregunta a Google qué modelos puede usar esta clave y elige los mejores "flash"
// (rápidos y con nivel gratuito). Así no dependemos de nombres de modelo que cambian con el tiempo.
// Para forzar uno en particular, agrega la variable GEMINI_MODEL en Netlify (ej. gemini-2.5-flash).
const API = "https://generativelanguage.googleapis.com/v1beta/models";
const RESPALDO = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.5-flash-lite"];
const headers = () => ({ "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY });

export const iaActiva = () => Boolean(process.env.GEMINI_API_KEY);

const errorPublico = (msg) => Object.assign(new Error(msg), { publico: msg });

// Mensaje corto de error de Google (sin datos sensibles) para mostrarlo en el sitio.
async function detalleError(res) {
  const txt = await res.text().catch(() => "");
  let msg = txt;
  try {
    msg = JSON.parse(txt).error?.message || txt;
  } catch {}
  return `${res.status} ${String(msg).slice(0, 180)}`;
}

let modelosCache = null;
export async function modelosDisponibles() {
  if (modelosCache) return modelosCache;
  const fijo = process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : [];
  try {
    const res = await fetch(`${API}?pageSize=1000`, { headers: headers() });
    if (!res.ok) throw new Error(await detalleError(res));
    const { models = [] } = await res.json();
    const nombres = models
      .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent"))
      .map((m) => m.name.replace(/^models\//, ""));
    const version = (n) => parseFloat((/gemini-(\d+(?:\.\d+)?)/.exec(n) || [])[1] || 0);
    // Preferimos modelos estables "gemini-X-flash", luego "flash-lite"; los más nuevos primero.
    const estables = nombres
      .filter((n) => /^gemini-\d+(\.\d+)?-flash(-lite)?$/.test(n))
      .sort((a, b) => a.endsWith("-lite") - b.endsWith("-lite") || version(b) - version(a));
    const otros = nombres.filter((n) => /flash/.test(n) && !/tts|live|image|audio|embed|robotics/.test(n) && !estables.includes(n));
    const elegidos = [...fijo, ...estables.slice(0, 3), ...otros.slice(0, 1)];
    modelosCache = elegidos.length ? [...new Set(elegidos)] : [...fijo, ...RESPALDO];
  } catch (err) {
    console.error("No se pudo consultar la lista de modelos:", err.message);
    return [...new Set([...fijo, ...RESPALDO])]; // sin caché: se reintenta en la próxima llamada
  }
  return modelosCache;
}

// Pide a Gemini; si falla por límite (429), modelo no disponible (404) o saturación (5xx), prueba el siguiente modelo.
async function pedir(accion, cuerpo) {
  let ultimo = "";
  let codigo = 0;
  for (const modelo of await modelosDisponibles()) {
    const res = await fetch(`${API}/${modelo}:${accion}`, { method: "POST", headers: headers(), body: JSON.stringify(cuerpo) });
    if (res.ok) return res;
    codigo = res.status;
    ultimo = await detalleError(res);
    console.error(`Gemini (${modelo}) respondió con error:`, ultimo);
    if (![404, 429, 500, 502, 503, 504].includes(res.status)) break;
  }
  if (codigo === 429) throw errorPublico("La IA alcanzó su límite gratuito por ahora. Espera un minuto e intenta de nuevo.");
  if (codigo === 400 || codigo === 401 || codigo === 403)
    throw errorPublico(`Google rechazó la clave de la IA (${ultimo}). Revisa GEMINI_API_KEY en Netlify.`);
  throw errorPublico(`La IA no respondió en este momento (${ultimo || "sin respuesta"}). Intenta de nuevo en unos segundos.`);
}

// Revisión rápida para diagnosticar la conexión (no expone la clave).
export async function diagnostico() {
  modelosCache = null;
  const modelos = await modelosDisponibles();
  const res = await fetch(`${API}/${modelos[0]}:generateContent`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Responde solo: ok" }] }] }),
  });
  return { modelos, prueba: res.ok ? "ok" : await detalleError(res) };
}

const textoDe = (data) =>
  (data?.candidates?.[0]?.content?.parts || [])
    .filter((p) => p.text && !p.thought)
    .map((p) => p.text)
    .join("");

// mensajes: [{ role: "user" | "assistant", content, imagenes?: [{ mimeType, data (base64) }] }]
const contenidos = (mensajes) =>
  mensajes.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [...(m.imagenes || []).map((img) => ({ inlineData: img })), { text: m.content }],
  }));

// Respuesta completa en JSON validada contra `esquema` (formato de esquema de Gemini).
export async function geminiJSON({ sistema, mensajes, esquema }) {
  const res = await pedir("generateContent", {
    systemInstruction: { parts: [{ text: sistema }] },
    contents: contenidos(mensajes),
    generationConfig: { responseMimeType: "application/json", responseSchema: esquema },
  });
  const data = await res.json();
  const texto = textoDe(data);
  if (!texto) throw errorPublico("La IA no pudo responder a esta solicitud.");
  return JSON.parse(texto);
}

// Respuesta de texto en vivo: llama escribir(fragmento) conforme llega y devuelve el texto completo.
export async function geminiStream({ sistema, mensajes, escribir }) {
  const res = await pedir("streamGenerateContent?alt=sse", {
    systemInstruction: { parts: [{ text: sistema }] },
    contents: contenidos(mensajes),
  });
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buffer = "";
  let total = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    let corte;
    while ((corte = buffer.indexOf("\n")) >= 0) {
      const linea = buffer.slice(0, corte).trim();
      buffer = buffer.slice(corte + 1);
      if (!linea.startsWith("data:")) continue;
      try {
        const trozo = textoDe(JSON.parse(linea.slice(5)));
        if (trozo) {
          total += trozo;
          escribir(trozo);
        }
      } catch {
        // línea incompleta o sin texto: se ignora
      }
    }
  }
  if (!total.trim()) throw errorPublico("La IA no pudo responder a esta solicitud.");
  return total.trim();
}

// ---------------------------------------------------------------------------
// Respuestas largas en Netlify
// ---------------------------------------------------------------------------
// Netlify corta las funciones normales en pocos segundos, pero las respuestas en streaming
// pueden durar hasta 60 s. Estas dos ayudas permiten esperar a la IA sin que se corte.
const encoder = new TextEncoder();
export const ERROR_MARK = "\u0000ERROR:";

// Transmite texto en vivo. `producir(escribir)` llama a escribir(texto) con cada fragmento.
// Si falla a la mitad, envía ERROR_MARK + mensaje para que la página lo muestre.
export function streamTexto(producir) {
  const body = new ReadableStream({
    async start(controller) {
      try {
        await producir((t) => controller.enqueue(encoder.encode(t)));
      } catch (err) {
        console.error("Error en streaming:", err);
        controller.enqueue(encoder.encode(`${ERROR_MARK}${err.publico || "La IA no respondió en este momento. Intenta de nuevo."}`));
      }
      controller.close();
    },
  });
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
}

// Responde un JSON que tarda en calcularse: manda espacios cada 3 s para mantener viva la conexión
// y al final el JSON (los espacios iniciales no afectan a JSON.parse).
export function jsonConEspera(promesa) {
  const body = new ReadableStream({
    async start(controller) {
      const latido = setInterval(() => controller.enqueue(encoder.encode(" ")), 3000);
      let data;
      try {
        data = await promesa;
      } catch (err) {
        console.error("Error:", err);
        data = { error: err.publico || "Ocurrió un error, intenta de nuevo" };
      }
      clearInterval(latido);
      controller.enqueue(encoder.encode(JSON.stringify(data)));
      controller.close();
    },
  });
  return new Response(body, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}
