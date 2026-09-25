// Fotos de ideas y comentarios, guardadas en Netlify Blobs.
// POST { data: "data:image/jpeg;base64,..." } -> { id }   ·   GET /api/fotos?id=... -> imagen
import { getStore } from "@netlify/blobs";

const TIPOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 4 * 1024 * 1024;

export default async (req) => {
  const store = getStore({ name: "fotos", consistency: "strong" });

  if (req.method === "GET") {
    const id = new URL(req.url).searchParams.get("id") || "";
    if (!/^f-[a-z0-9-]{1,60}$/i.test(id)) return new Response("No encontrada", { status: 404 });
    const res = await store.getWithMetadata(id, { type: "arrayBuffer" });
    if (!res) return new Response("No encontrada", { status: 404 });
    return new Response(res.data, {
      headers: { "content-type": res.metadata.contentType || "image/jpeg", "cache-control": "public, max-age=31536000, immutable" },
    });
  }

  if (req.method !== "POST") return new Response("Método no permitido", { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }
  const m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(String(body.data || ""));
  if (!m || !TIPOS.includes(m[1])) return Response.json({ error: "Formato de imagen no válido" }, { status: 400 });
  const bytes = Buffer.from(m[2], "base64");
  if (bytes.length > MAX_BYTES) return Response.json({ error: "La foto pesa demasiado (máx. 4 MB)" }, { status: 413 });

  const id = `f-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  await store.set(id, bytes, { metadata: { contentType: m[1] } });
  return Response.json({ id });
};

export const config = { path: "/api/fotos" };
