# Laboratorio de Ideas · Distrito Aduanal

Sitio para el equipo de Distrito Aduanal:
- **Generador** de ideas de Ventas, Redes sociales (Facebook, Instagram, LinkedIn), Visibilidad y "Ser mejores" que la competencia; cada idea trae pasos, métricas (KPIs) y lo que nos diferencia.
- **Tablero** compartido: calificar con estrellas, "me gusta / no me gusta", comentarios con respuestas y fotos.
- **Asistente IA gratuito**: abre claude.ai (cuenta gratuita de cada persona) con todo el contexto de Distrito y del tablero ya escrito. La respuesta se pega de vuelta y se convierte en ideas del tablero.
- **Opinión de la IA** y **Desarrollar con Claude**: abren Claude con la idea lista para analizarla o desarrollarla.
- **Panel de métricas**: ideas, votos, calificación promedio, Top 5 y participación por categoría.

Todo (ideas, votos, estrellas, comentarios y fotos) se guarda en **Netlify Blobs**, sin configurar una base de datos.

## Estructura
```
public/                  → la página (index.html, logo)
netlify/functions/
  ideas.mjs              → tablero: ideas, votos, estrellas, comentarios
  generar.mjs            → generador de ideas (gratis, sin IA)
  asistente.mjs          → asistente IA (chat y opinión sobre ideas)
  fotos.mjs              → subir y mostrar fotos
netlify/lib/plantillas.mjs → banco de ideas del generador gratuito (aquí se agregan ideas propias)
netlify/lib/distrito.mjs → contexto y voz de marca (solo para la IA de pago opcional)
netlify.toml, package.json
```

## Publicar en Netlify
> Importante: **no** uses "arrastrar y soltar" (Netlify Drop), porque así no se publican las funciones y no se guardarían los comentarios.

### Opción A — desde GitHub (recomendada)
1. Sube esta carpeta a un repositorio de GitHub.
2. En app.netlify.com → **Add new site → Import an existing project** → elige el repositorio.
3. Netlify detecta `netlify.toml` solo. Clic en **Deploy**.

### Opción B — con la terminal
```
npm install
npx netlify-cli deploy --prod
```

## Costo: $0
Todo el sitio funciona gratis en el plan gratuito de Netlify:
- El **generador** usa un banco de plantillas propio (cientos de combinaciones). Para agregar ideas, edita `netlify/lib/plantillas.mjs`.
- El **asistente** abre claude.ai con la instrucción ya escrita; cada persona usa su propia cuenta gratuita de Claude
  (el plan gratuito tiene un límite de mensajes al día). Si Claude se abre sin el texto, basta con pegar (Ctrl+V / ⌘+V).
- Para pasar ideas de Claude al tablero: copiar su respuesta → pegarla en el paso 2 → "Pasar al tablero".

### Opcional (de pago): IA integrada en el sitio
El código para tener el chat y las opiniones de IA dentro del sitio ya está incluido pero **apagado**.
Solo se enciende si se agrega la variable `ANTHROPIC_API_KEY` en Netlify (Site configuration → Environment variables)
con una clave de console.anthropic.com. Eso sí tiene costo por uso. Sin esa variable, no se cobra nada.

## Ver los datos guardados
Netlify → tu sitio → **Blobs**: almacén `tablero-ideas` (ideas, votos, estrellas, comentarios) y `fotos`.
