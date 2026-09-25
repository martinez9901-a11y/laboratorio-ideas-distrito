# Laboratorio de Ideas · Distrito Aduanal

Sitio para el equipo de Distrito Aduanal, organizado en 4 pestañas:
- **Inicio**: métricas (ideas, votos, calificación promedio, Top 5 y participación por categoría) y accesos rápidos.
- **Generador** de ideas de Ventas, Redes sociales (Facebook, Instagram, LinkedIn), Visibilidad y "Ser mejores"; cada idea trae pasos, métricas y lo que nos diferencia.
- **Asistente IA** (Gemini): chat de lluvia de ideas dentro del sitio, que conoce a Distrito y las ideas del tablero.
- **Tablero** compartido: estrellas, "me gusta / no me gusta", comentarios con respuestas, fotos y "Opinión IA".

Todo (ideas, votos, estrellas, comentarios y fotos) se guarda en **Netlify Blobs**, sin configurar una base de datos.

## Estructura
```
public/                    → la página (index.html, logo)
netlify/functions/
  ideas.mjs                → tablero: ideas, votos, estrellas, comentarios
  generar.mjs              → generador de ideas (con IA o con plantillas)
  asistente.mjs            → asistente IA (chat y opinión sobre ideas)
  fotos.mjs                → subir y mostrar fotos
netlify/lib/
  distrito.mjs             → contexto y voz de marca + conexión con Gemini
  plantillas.mjs           → banco de ideas sin IA (aquí se agregan ideas propias)
netlify.toml, package.json
```

## Publicar en Netlify
> Importante: **no** uses "arrastrar y soltar" (Netlify Drop), porque así no se publican las funciones y no se guardarían los comentarios.

1. Sube el **contenido** de esta carpeta a un repositorio de GitHub (que `netlify.toml` quede en la raíz).
2. En app.netlify.com → **Add new site → Import an existing project → GitHub** → elige el repositorio.
3. Netlify detecta `netlify.toml` solo. Clic en **Deploy**.

## Activar la IA (gratis, con Gemini)
1. Entra a **aistudio.google.com** con una cuenta de Google → **Get API key → Create API key**. No pide tarjeta.
2. En Netlify → tu sitio → **Site configuration → Environment variables → Add a variable**:
   - Key: `GEMINI_API_KEY`
   - Value: la clave que copiaste
3. **Deploys → Trigger deploy → Deploy site** para que tome la clave.
4. En la pestaña *Asistente IA* debe aparecer "En línea".

Sin la clave, el sitio funciona igual: el generador usa sus plantillas y el chat aparece como "Sin activar".

**Sobre el nivel gratuito de Gemini:**
- Tiene límites de uso por minuto y por día. Si se alcanzan, el sitio avisa "espera un minuto" y el generador usa las plantillas.
- Si el modelo principal (`gemini-3.5-flash`) no está disponible, el sitio prueba solo con otros modelos gratuitos.
  Para cambiar el modelo principal, agrega en Netlify la variable `GEMINI_MODEL` (ej. `gemini-3.8-flash`).
- En el nivel gratuito, **Google puede usar lo que se escribe para mejorar sus productos**. No escribas datos
  confidenciales de clientes en el chat.

**Para ajustar cómo "habla" la IA** (tono, servicios, hashtags), edita `EMPRESA` y `VOZ` en `netlify/lib/distrito.mjs`.

## Ver los datos guardados
Netlify → tu sitio → **Blobs**: almacén `tablero-ideas` (ideas, votos, estrellas, comentarios) y `fotos`.
