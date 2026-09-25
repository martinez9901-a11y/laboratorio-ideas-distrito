// Contexto y voz de marca compartidos por el generador y el asistente de IA.
export const MODELO = "claude-opus-5";

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
