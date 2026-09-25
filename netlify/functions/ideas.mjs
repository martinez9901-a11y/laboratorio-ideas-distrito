// Tablero compartido: ideas publicadas, votos (me gusta / no me gusta) y comentarios.
// Todo se guarda en Netlify Blobs (almacenamiento persistente del sitio).
import { getStore } from "@netlify/blobs";

const ID = /^[a-z0-9-]{1,80}$/i;
const TIPOS = ["ventas", "redes", "visibilidad", "mejora"];
// Seguimiento: nueva → en planeación → planeada → ejecutada
const ESTADOS = ["nueva", "planeacion", "planeada", "ejecutada"];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const clean = (v, max) => String(v ?? "").trim().slice(0, max);
const SEMILLAS = [
  { id: "s-diagnostico", tipo: "ventas", titulo: "Diagnóstico aduanal sin costo para nuevos clientes", descripcion: "Revisamos gratis los últimos pedimentos de un prospecto y le mostramos, con números, dónde puede ahorrar o evitar multas. Es una forma cercana de demostrar lo que sabemos hacer antes de pedirle que confíe en nosotros.", pasos: ["Definir el alcance (5 pedimentos, 1 hora)", "Crear una plantilla de reporte con la imagen de Distrito", "Elegir 30 prospectos y contactarlos", "Dar seguimiento con propuesta a la semana"] },
  { id: "s-referidos", tipo: "ventas", titulo: "Red de aliados: forwarders y transportistas que nos recomiendan", descripcion: "Quienes mueven la carga ya conocen a los importadores. Creamos alianzas en las que ellos nos recomiendan y nosotros a ellos, con beneficios claros para ambos.", pasos: ["Listar 15 aliados potenciales", "Definir beneficio por cliente referido", "Presentarnos en persona", "Revisar resultados cada mes"] },
  { id: "s-tip", tipo: "redes", red: "LinkedIn", titulo: "Tip aduanal de la semana", descripcion: "Formato: post con imagen de marca.\nGancho: “Un error en la fracción arancelaria puede costarte más que el flete”.\nCopy: Cada martes, alguien de nuestro equipo comparte un consejo que aprendió en la operación diaria. Hoy te lo cuenta Ana, de clasificación. #SomosDistrito #ComercioExterior", pasos: ["Elegir el tip con el equipo operativo", "Tomar foto de quien lo comparte", "Publicar martes 10:00"] },
  { id: "s-equipo", tipo: "redes", red: "Instagram", titulo: "Las personas detrás de cada despacho", descripcion: "Formato: carrusel con foto y 3 datos de un integrante del equipo.\nCopy: Detrás de cada contenedor liberado hay alguien que se desveló revisando documentos. Te presentamos a quienes hacen posible Distrito. #SomosDistrito", pasos: ["Sesión de fotos del equipo", "Entrevista corta a cada persona", "Publicar una cada quincena"] },
  { id: "s-google", tipo: "visibilidad", titulo: "Ficha de Google y reseñas de clientes", descripcion: "Que cuando alguien busque “agencia aduanal” en nuestra ciudad, aparezca Distrito con fotos reales y opiniones de clientes contentos.", pasos: ["Completar la ficha de Google Business", "Subir fotos del equipo y oficinas", "Pedir reseña a 20 clientes", "Responder cada reseña con calidez"] },
  { id: "s-camaras", tipo: "visibilidad", titulo: "Voz experta en cámaras y foros de comercio exterior", descripcion: "Participar como ponentes en COMCE, CANACINTRA y foros de logística para que Distrito sea reconocido como referente del sector.", pasos: ["Calendario anual de eventos", "Proponer 2 temas de ponencia", "Llevar material con QR a nuestro sitio"] },
  { id: "s-satisfaccion", tipo: "mejora", titulo: "Medir la satisfacción después de cada despacho", descripcion: "Una encuesta de una sola pregunta al cerrar cada operación. Nos ayuda a detectar a tiempo si algo no salió bien y a demostrar con datos que nuestro servicio es mejor.", diferenciador: "Pocas agencias miden la experiencia de sus clientes; nosotros podremos presumir un indicador real.", pasos: ["Crear la encuesta (1 a 5 estrellas + comentario)", "Enviarla al cerrar cada operación", "Revisar resultados cada semana", "Llamar a quien califique 3 o menos"], metricas: ["Satisfacción promedio: 4.5 / 5", "Tasa de respuesta: 40%", "NPS: +50"] },
].map((i) => ({ red: "", autor: "Equipo Distrito", origen: "semilla", fecha: "2026-09-25T00:00:00.000Z", ...i }));

const fotoIds = (v, max) => (Array.isArray(v) ? v : []).filter((f) => ID.test(String(f))).slice(0, max);
// Ficha de estrategia (objetivo, público, mensaje, canales, tiempo, presupuesto, riesgos).
const FICHA = ["objetivo", "publico", "mensaje", "tiempo", "presupuesto", "riesgos"];
function leerFicha(f) {
  if (!f || typeof f !== "object") return undefined;
  const out = {};
  for (const k of FICHA) if (f[k]) out[k] = clean(f[k], 400);
  const canales = (Array.isArray(f.canales) ? f.canales : []).slice(0, 8).map((c) => clean(c, 80)).filter(Boolean);
  if (canales.length) out.canales = canales;
  return Object.keys(out).length ? out : undefined;
}

const newId = (p) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export default async (req) => {
  const store = getStore({ name: "tablero-ideas", consistency: "strong" });

  if (req.method === "GET") {
    const voter = new URL(req.url).searchParams.get("voter") || "";
    if (!(await store.get("meta/sembrado"))) {
      await Promise.all(SEMILLAS.map((i) => store.setJSON(`ideas/${i.id}`, i)));
      await store.set("meta/sembrado", "1");
    }
    const [ideaList, voteList, commentList, starList, estadoList] = await Promise.all([
      store.list({ prefix: "ideas/" }),
      store.list({ prefix: "votes/" }),
      store.list({ prefix: "comments/" }),
      store.list({ prefix: "stars/" }),
      store.list({ prefix: "estado/" }),
    ]);

    const ideas = (await Promise.all(ideaList.blobs.map((b) => store.get(b.key, { type: "json" })))).filter(Boolean);

    // votes/{ideaId}/{up|down}/{voterId}
    const votes = {};
    const mine = {};
    for (const { key } of voteList.blobs) {
      const [, ideaId, value, voterId] = key.split("/");
      votes[ideaId] ??= { up: 0, down: 0 };
      votes[ideaId][value]++;
      if (voterId === voter) mine[ideaId] = value;
    }

    // stars/{ideaId}/{1-5}/{voterId}
    const stars = {};
    const myStars = {};
    for (const { key } of starList.blobs) {
      const [, ideaId, n, voterId] = key.split("/");
      stars[ideaId] ??= { total: 0, count: 0 };
      stars[ideaId].total += Number(n);
      stars[ideaId].count++;
      if (voterId === voter) myStars[ideaId] = Number(n);
    }

    const comments = {};
    const all = (await Promise.all(commentList.blobs.map((b) => store.get(b.key, { type: "json" })))).filter(Boolean);
    for (const c of all.sort((a, b) => a.fecha.localeCompare(b.fecha))) (comments[c.ideaId] ??= []).push(c);

    // estado/{ideaId} → { estado, responsable, fecha, resultado, por, actualizado }
    const seguimiento = {};
    const estados = await Promise.all(estadoList.blobs.map((b) => store.get(b.key, { type: "json" })));
    estadoList.blobs.forEach((b, k) => {
      if (estados[k]) seguimiento[b.key.slice("estado/".length)] = estados[k];
    });

    return json({ ideas, votes, mine, stars, myStars, comments, seguimiento });
  }

  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }

  if (body.action === "publicar") {
    const idea = {
      id: newId("i"),
      tipo: TIPOS.includes(body.tipo) ? body.tipo : "ventas",
      red: clean(body.red, 30),
      titulo: clean(body.titulo, 160),
      descripcion: clean(body.descripcion, 1500),
      pasos: (Array.isArray(body.pasos) ? body.pasos : []).slice(0, 8).map((p) => clean(p, 300)).filter(Boolean),
      autor: clean(body.autor, 60) || "Anónimo",
      origen: body.origen === "generador" ? "generador" : "manual",
      fotos: fotoIds(body.fotos, 4),
      metricas: (Array.isArray(body.metricas) ? body.metricas : []).slice(0, 6).map((m) => clean(m, 200)).filter(Boolean),
      diferenciador: clean(body.diferenciador, 400),
      ficha: leerFicha(body.ficha),
      fecha: new Date().toISOString(),
    };
    if (!idea.titulo) return json({ error: "Falta el título" }, 400);
    await store.setJSON(`ideas/${idea.id}`, idea);
    return json({ ok: true, idea });
  }

  if (body.action === "votar") {
    const { ideaId, voterId, value } = body;
    if (!ID.test(ideaId || "") || !ID.test(voterId || "")) return json({ error: "Datos inválidos" }, 400);
    await Promise.all([
      store.delete(`votes/${ideaId}/up/${voterId}`),
      store.delete(`votes/${ideaId}/down/${voterId}`),
    ]);
    if (value === "up" || value === "down") await store.set(`votes/${ideaId}/${value}/${voterId}`, "1");
    return json({ ok: true });
  }

  if (body.action === "calificar") {
    const { ideaId, voterId } = body;
    const n = parseInt(body.estrellas);
    if (!ID.test(ideaId || "") || !ID.test(voterId || "") || !(n >= 0 && n <= 5)) return json({ error: "Datos inválidos" }, 400);
    await Promise.all([1, 2, 3, 4, 5].map((k) => store.delete(`stars/${ideaId}/${k}/${voterId}`)));
    if (n > 0) await store.set(`stars/${ideaId}/${n}/${voterId}`, "1");
    return json({ ok: true });
  }

  if (body.action === "estado") {
    if (!ID.test(body.ideaId || "") || !ESTADOS.includes(body.estado)) return json({ error: "Datos inválidos" }, 400);
    const seg = {
      estado: body.estado,
      responsable: clean(body.responsable, 80),
      fecha: /^\d{4}-\d{2}-\d{2}$/.test(body.fecha || "") ? body.fecha : "",
      resultado: clean(body.resultado, 1000),
      por: clean(body.autor, 60) || "Anónimo",
      actualizado: new Date().toISOString(),
    };
    await store.setJSON(`estado/${body.ideaId}`, seg);
    return json({ ok: true, seguimiento: seg });
  }

  if (body.action === "comentar") {
    const texto = clean(body.texto, 1000);
    const fotos = fotoIds(body.fotos, 2);
    if (!ID.test(body.ideaId || "") || (!texto && !fotos.length)) return json({ error: "Comentario vacío" }, 400);
    const c = {
      id: newId("c"),
      ideaId: body.ideaId,
      respondeA: ID.test(body.respondeA || "") ? body.respondeA : null,
      autor: clean(body.autor, 60) || "Anónimo",
      texto,
      fotos,
      fecha: new Date().toISOString(),
    };
    await store.setJSON(`comments/${c.ideaId}/${c.id}`, c);
    return json({ ok: true, comentario: c });
  }

  return json({ error: "Acción desconocida" }, 400);
};

export const config = { path: "/api/ideas" };
