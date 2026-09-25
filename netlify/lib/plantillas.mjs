// Generador de ideas SIN IA (gratis e ilimitado).
// Combina bancos de estrategias, temas, formatos, ganchos y llamados a la acción escritos con la voz de Distrito.
// Para agregar ideas propias, suma elementos a cualquiera de los bancos de abajo.

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const PUBLICOS = [
  "PyMEs que empiezan a importar desde Asia",
  "empresas manufactureras con programa IMMEX",
  "exportadores agroalimentarios",
  "tiendas de e-commerce que importan mercancía",
  "empresas automotrices y de autopartes",
  "distribuidores que importan de EE. UU. bajo T-MEC",
  "importadores de maquinaria y equipo industrial",
  "empresas de nearshoring que llegan a México",
  "comercializadoras de productos electrónicos",
  "empresas textiles y de calzado",
];

// ---------------------------------------------------------------------------
// Estrategias: cada función recibe { p: público, t: tema } y devuelve la idea.
// ---------------------------------------------------------------------------
const VENTAS = [
  ({ p, t }) => ({
    titulo: `Diagnóstico aduanal sin costo para ${p}`,
    descripcion: `Revisamos gratis sus últimos pedimentos${t ? ` con foco en ${t}` : ""} y les mostramos, con números, dónde pueden ahorrar o evitar multas. Es una forma cercana de demostrar lo que sabemos hacer antes de pedir su confianza.`,
    diferenciador: "Entramos aportando valor medible desde el primer contacto, no con una cotización más.",
    pasos: ["Definir el alcance: 5 pedimentos y 1 hora de revisión", "Crear un reporte de hallazgos con la imagen de Distrito", `Armar una lista de 30 prospectos: ${p}`, "Contactarlos por LinkedIn y correo con la oferta", "Presentar resultados en persona y cerrar con propuesta"],
    metricas: ["Diagnósticos realizados: 8 al mes", "Diagnósticos que se vuelven clientes: 30%"],
  }),
  ({ p }) => ({
    titulo: `Iguala mensual con 3 niveles para ${p}`,
    descripcion: "Una tarifa fija mensual que incluye cierto número de operaciones, asesoría y reportes. Le damos al cliente certidumbre en su presupuesto y a Distrito un ingreso estable.",
    diferenciador: "Cambiamos la plática de “¿cuánto cuesta cada pedimento?” a “¿cuánto vale tener un aliado fijo?”.",
    pasos: ["Analizar el volumen promedio de operaciones del segmento", "Diseñar 3 niveles: Esencial, Profesional e Integral", "Preparar una hoja comparativa clara", "Ofrecerlo primero a clientes actuales con buen historial"],
    metricas: ["Clientes en iguala: 10 en 6 meses", "Ingreso recurrente mensual: +20%"],
  }),
  () => ({
    titulo: "Red de aliados que nos recomiendan: forwarders y transportistas",
    descripcion: "Quienes mueven la carga ya conocen a los importadores. Creamos alianzas en las que ellos nos recomiendan y nosotros a ellos, con beneficios claros para ambos.",
    diferenciador: "Llegamos al cliente con la recomendación de alguien en quien ya confía.",
    pasos: ["Listar 15 aliados potenciales", "Definir el beneficio por cliente referido", "Presentarnos en persona con un desayuno", "Revisar resultados cada mes con cada aliado"],
    metricas: ["Aliados activos: 8", "Clientes referidos: 3 al trimestre"],
  }),
  ({ p }) => ({
    titulo: "Reactivación de clientes que dejaron de operar",
    descripcion: `Identificamos a los clientes que no han operado en 6 meses (sobre todo ${p}), les llamamos para entender qué pasó y les ofrecemos una razón concreta para volver.`,
    diferenciador: "Escuchamos antes de vender: cada motivo de salida se vuelve una mejora.",
    pasos: ["Extraer la lista de clientes sin operaciones recientes", "Llamar a cada uno (no correo masivo)", "Ofrecer una propuesta de regreso con vigencia", "Registrar los motivos y compartirlos con el equipo"],
    metricas: ["Clientes reactivados: 5 al trimestre", "Motivos de salida documentados: 100%"],
  }),
  ({ p, t }) => ({
    titulo: `Webinar: ${t || "lo que cambió en comercio exterior este año"} explicado para ${p}`,
    descripcion: "Un webinar gratuito de 45 minutos con casos reales y espacio para preguntas. Nos posiciona como expertos y nos deja una lista de prospectos interesados.",
    diferenciador: "Enseñamos con generosidad; el cliente llega sabiendo que sabemos.",
    pasos: ["Elegir fecha y plataforma", "Preparar presentación con 3 casos prácticos", "Invitar por LinkedIn, correo y aliados", "Enviar la grabación y una propuesta a quienes asistan"],
    metricas: ["Registrados: 60", "Asistentes que piden cotización: 10%"],
  }),
  () => ({
    titulo: "Encuesta NPS y venta cruzada",
    descripcion: "Preguntamos a los clientes qué tan probable es que nos recomienden y aprovechamos la conversación para ofrecer servicios que quizá no conocen (IMMEX, certificaciones, clasificación).",
    diferenciador: "Pocas agencias preguntan; nosotros medimos y actuamos.",
    pasos: ["Crear encuesta de 3 preguntas", "Enviarla a todos los clientes activos", "Pedir referencias a quienes califiquen 9 o 10", "Llamar en 48 h a quienes califiquen 6 o menos"],
    metricas: ["NPS: +50", "Servicios adicionales vendidos: 4 al trimestre"],
  }),
  ({ p }) => ({
    titulo: `Paquete “Primer embarque” para ${p}`,
    descripcion: "Un servicio de acompañamiento para quien importa por primera vez: padrón de importadores, clasificación, cálculo de impuestos y despacho, todo explicado paso a paso.",
    diferenciador: "Convertimos el miedo a importar en una experiencia guiada y humana.",
    pasos: ["Definir qué incluye y el precio", "Crear una guía visual del proceso", "Promoverlo en redes y con cámaras empresariales", "Asignar un ejecutivo “padrino” por cliente"],
    metricas: ["Paquetes vendidos: 5 al mes", "Clientes que siguen operando a 6 meses: 70%"],
  }),
  ({ p, t }) => ({
    titulo: `Visitas de valor a ${p}`,
    descripcion: `Una ruta mensual de visitas presenciales a prospectos clave con un mini análisis de su operación${t ? ` sobre ${t}` : ""}. La cercanía física sigue cerrando más negocios que cualquier correo.`,
    diferenciador: "Nos conocen en persona: somos gente, no un número de teléfono.",
    pasos: ["Elegir 12 prospectos por zona", "Preparar un análisis de 1 página por empresa", "Agendar 3 visitas por semana", "Enviar resumen y propuesta al día siguiente"],
    metricas: ["Visitas al mes: 12", "Propuestas enviadas tras visita: 80%", "Cierres: 3 al mes"],
  }),
  () => ({
    titulo: "Programa “Cliente que recomienda”",
    descripcion: "Un agradecimiento concreto (descuento, capacitación gratuita o un detalle) para cada cliente que nos recomienda a otra empresa que se vuelve cliente.",
    diferenciador: "Convertimos a nuestros clientes contentos en nuestra mejor fuerza de ventas.",
    pasos: ["Definir la recompensa", "Crear tarjetas y un correo para anunciarlo", "Mencionarlo en cada reporte mensual", "Agradecer públicamente (con permiso) en LinkedIn"],
    metricas: ["Referidos recibidos: 4 al trimestre", "Tasa de cierre de referidos: 50%"],
  }),
  ({ p }) => ({
    titulo: `Calculadora de costos de importación para ${p}`,
    descripcion: "Una hoja o página sencilla donde el prospecto estima impuestos y gastos de importar su mercancía. Al final, deja sus datos para recibir una cotización exacta.",
    diferenciador: "Damos claridad de costos antes de que nos la pidan.",
    pasos: ["Definir los datos mínimos (valor, fracción, origen)", "Construir la calculadora", "Publicarla en el sitio y redes", "Dar seguimiento en menos de 24 h a cada solicitud"],
    metricas: ["Usos al mes: 100", "Prospectos generados: 15 al mes"],
  }),
  ({ t }) => ({
    titulo: `Desayuno ejecutivo${t ? `: ${t}` : " de comercio exterior"}`,
    descripcion: "Un desayuno trimestral para 15 a 20 directivos (clientes y prospectos) con una charla breve de un experto y tiempo para convivir.",
    diferenciador: "Creamos comunidad; los prospectos conviven con clientes satisfechos.",
    pasos: ["Elegir sede y tema", "Invitar mitad clientes, mitad prospectos", "Preparar charla de 20 minutos", "Dar seguimiento personal a cada prospecto"],
    metricas: ["Asistentes: 18", "Prospectos que agendan reunión: 40%"],
  }),
  () => ({
    titulo: "Seguimiento de cotizaciones en 72 horas",
    descripcion: "Un proceso sencillo para que ninguna cotización se quede sin respuesta: llamada a las 72 horas, segunda llamada a los 7 días y cierre a los 15.",
    diferenciador: "La constancia amable gana clientes que otras agencias dejan ir.",
    pasos: ["Registrar todas las cotizaciones en una hoja o CRM", "Asignar responsable y fechas de seguimiento", "Preparar guiones cortos para cada llamada", "Revisar el embudo cada lunes"],
    metricas: ["Cotizaciones con seguimiento: 100%", "Tasa de cierre de cotizaciones: 35%"],
  }),
];

const VISIBILIDAD = [
  () => ({
    titulo: "Voz experta en cámaras y foros de comercio exterior",
    descripcion: "Participamos como ponentes en COMCE, CANACINTRA, CANACO y foros de logística para que Distrito sea reconocido como referente del sector.",
    diferenciador: "Pasamos de ser una agencia más a ser quien explica los temas del sector.",
    pasos: ["Hacer calendario anual de eventos", "Proponer 2 temas de ponencia", "Llevar material con QR a nuestro sitio", "Dar seguimiento a los contactos en 72 h"],
    metricas: ["Ponencias al año: 4", "Contactos nuevos por evento: 20"],
  }),
  ({ p, t }) => ({
    titulo: `Guía descargable: ${t || "cómo importar sin multas"}`,
    descripcion: `Un PDF práctico dirigido a ${p}, descargable desde el sitio a cambio del correo. Nos da autoridad y una base de prospectos.`,
    diferenciador: "Compartimos conocimiento útil que la competencia se guarda.",
    pasos: ["Redactar una guía de 8 a 10 páginas", "Diseñarla con la imagen de Distrito", "Publicarla en el sitio y redes", "Enviar 3 correos de seguimiento a quien la descargue"],
    metricas: ["Descargas al mes: 50", "Descargas que piden cotización: 10%"],
  }),
  () => ({
    titulo: "Ficha de Google y reseñas de clientes",
    descripcion: "Que cuando alguien busque “agencia aduanal” en nuestra ciudad, aparezca Distrito con fotos reales del equipo y opiniones de clientes contentos.",
    diferenciador: "Somos la agencia con cara y con reseñas reales.",
    pasos: ["Completar la ficha de Google Business", "Subir fotos del equipo y oficinas", "Pedir reseña a 20 clientes con enlace directo", "Responder cada reseña con calidez"],
    metricas: ["Reseñas en Google: 30", "Calificación: 4.8", "Llamadas desde Google: +40%"],
  }),
  () => ({
    titulo: "Voceros de Distrito en medios y podcasts",
    descripcion: "Posicionamos a un directivo como la persona que opina sobre aranceles, T-MEC y nearshoring en periódicos locales, medios especializados y podcasts de negocios.",
    diferenciador: "Le ponemos rostro y voz a la marca.",
    pasos: ["Elegir 1 o 2 voceros y prepararlos", "Definir 3 temas de opinión actuales", "Contactar periodistas y podcasts", "Compartir cada aparición en redes"],
    metricas: ["Apariciones en medios: 1 al mes", "Búsquedas de la marca en Google: +30%"],
  }),
  ({ p }) => ({
    titulo: "Casos de éxito con nombre y rostro",
    descripcion: `Publicamos historias reales (con permiso) de cómo ayudamos a ${p} a ahorrar, crecer o resolver un problema difícil.`,
    diferenciador: "Mostramos resultados, no solo promesas.",
    pasos: ["Seleccionar 3 casos con resultados medibles", "Pedir autorización y una foto del cliente", "Redactar: reto, solución y resultado", "Publicar en web, LinkedIn y propuestas"],
    metricas: ["Casos publicados: 1 al mes", "Visitas a los casos: 300 al mes"],
  }),
  () => ({
    titulo: "Alianza con universidades",
    descripcion: "Pláticas, talleres y prácticas profesionales con carreras de comercio internacional y logística. La marca llega a futuros profesionales y a las empresas que los contratan.",
    diferenciador: "Formamos a la siguiente generación del comercio exterior.",
    pasos: ["Contactar 3 universidades de la región", "Proponer una plática o taller", "Crear un programa de prácticas", "Documentar y difundir la colaboración"],
    metricas: ["Pláticas al semestre: 2", "Practicantes al año: 4"],
  }),
  ({ t }) => ({
    titulo: `Newsletter mensual “Distrito Informa”${t ? `: ${t}` : ""}`,
    descripcion: "Un correo mensual breve con cambios regulatorios, un tip práctico, un caso de éxito y una foto del equipo. Nos mantiene presentes sin ser insistentes.",
    diferenciador: "Estamos en la bandeja de entrada del cliente con algo útil cada mes.",
    pasos: ["Elegir herramienta (Mailchimp, Brevo)", "Diseñar plantilla con la marca", "Definir secciones fijas", "Enviar el primer martes de cada mes"],
    metricas: ["Suscriptores: 500", "Tasa de apertura: 35%", "Clics: 5%"],
  }),
  () => ({
    titulo: "Sitio web optimizado para búsquedas",
    descripcion: "Páginas específicas por servicio y por ciudad (“agencia aduanal en …”), preguntas frecuentes y un botón de WhatsApp visible para que nos encuentren y nos escriban.",
    diferenciador: "Aparecemos cuando el cliente nos busca, justo en ese momento.",
    pasos: ["Revisar palabras que busca el cliente", "Crear una página por servicio", "Agregar preguntas frecuentes", "Medir visitas y contactos cada mes"],
    metricas: ["Visitas orgánicas: +50% en 6 meses", "Contactos desde el sitio: 20 al mes"],
  }),
  () => ({
    titulo: "Presencia en ferias con stand memorable",
    descripcion: "Un stand sencillo pero distinto en ferias de logística e industria: dinámica de “adivina la fracción arancelaria”, café y regalos útiles con la marca.",
    diferenciador: "Somos el stand del que la gente se acuerda.",
    pasos: ["Elegir 2 ferias clave del año", "Diseñar stand y dinámica", "Preparar regalos útiles (no plumas)", "Registrar contactos con un formulario en tablet"],
    metricas: ["Contactos por feria: 80", "Reuniones agendadas: 10"],
  }),
  () => ({
    titulo: "Responsabilidad social con el sello Distrito",
    descripcion: "Una causa que el equipo elija (educación, medio ambiente, comunidad) con acciones concretas que podamos contar con orgullo.",
    diferenciador: "La gente elige trabajar con empresas que también ayudan.",
    pasos: ["Votar la causa con el equipo", "Definir 2 acciones al año", "Invitar a clientes a participar", "Documentar con fotos y video"],
    metricas: ["Participación del equipo: 70%", "Alcance de publicaciones de la causa: 3,000"],
  }),
];

const MEJORA = [
  () => ({
    titulo: "Tiempo de respuesta garantizado",
    descripcion: "Nos comprometemos a responder toda solicitud de cotización o duda operativa en menos de 2 horas hábiles, con una persona asignada por cliente.",
    diferenciador: "La rapidez y el trato personal son lo que el cliente más recuerda.",
    pasos: ["Medir el tiempo de respuesta actual", "Asignar un ejecutivo por cliente", "Configurar alertas de correos sin responder", "Comunicar la promesa en propuestas y redes"],
    metricas: ["Tiempo promedio de respuesta: menos de 2 h", "Solicitudes respondidas a tiempo: 95%"],
  }),
  () => ({
    titulo: "Reporte mensual de valor para cada cliente",
    descripcion: "Enviamos a cada cliente un resumen mensual: operaciones despachadas, tiempos de liberación, ahorros logrados y alertas regulatorias.",
    diferenciador: "Casi ninguna agencia lo hace; hace visible todo nuestro trabajo.",
    pasos: ["Diseñar la plantilla del reporte", "Definir de dónde salen los datos", "Enviarlo en los primeros 5 días del mes", "Pedir retroalimentación trimestral"],
    metricas: ["Clientes que reciben reporte: 100%", "Retención anual de clientes: 90%"],
  }),
  () => ({
    titulo: "Satisfacción medida después de cada despacho",
    descripcion: "Una encuesta de una sola pregunta al cerrar cada operación para detectar a tiempo si algo no salió bien.",
    diferenciador: "Tendremos un indicador real de servicio que la competencia no puede mostrar.",
    pasos: ["Crear encuesta de 1 a 5 estrellas + comentario", "Enviarla al cerrar cada operación", "Revisar resultados cada semana", "Llamar a quien califique 3 o menos"],
    metricas: ["Satisfacción promedio: 4.5 / 5", "Tasa de respuesta: 40%"],
  }),
  () => ({
    titulo: "Cero errores: indicador de pedimentos rectificados",
    descripcion: "Medimos y bajamos el porcentaje de pedimentos que requieren rectificación. Es una prueba objetiva de calidad.",
    diferenciador: "Podemos demostrar con datos que nos equivocamos menos.",
    pasos: ["Calcular el % actual de rectificaciones", "Identificar las 3 causas más comunes", "Crear una lista de verificación previa al pago", "Compartir el indicador con el equipo cada mes"],
    metricas: ["Pedimentos rectificados: menos de 1%", "Multas a clientes por errores: 0"],
  }),
  () => ({
    titulo: "Estatus de operaciones por WhatsApp",
    descripcion: "El cliente recibe avisos automáticos o semiautomáticos en cada etapa: documentos recibidos, pedimento pagado, modulado y liberado.",
    diferenciador: "El cliente sabe cómo va su mercancía sin tener que llamar.",
    pasos: ["Mapear los estatus clave", "Crear mensajes plantilla con WhatsApp Business", "Probar con 5 clientes piloto", "Extender a todos los clientes"],
    metricas: ["Llamadas de “¿cómo va?”: −50%", "Clientes con avisos activos: 70%"],
  }),
  () => ({
    titulo: "Estudio de la competencia cada trimestre",
    descripcion: "Revisamos qué ofrecen, cuánto cobran y qué comunican otras agencias de la región para encontrar huecos que nadie cubre.",
    diferenciador: "Decidimos con información, no por intuición.",
    pasos: ["Elegir 5 competidores directos", "Revisar sitios, redes y reseñas", "Hacer una tabla comparativa", "Definir 2 mejoras por trimestre"],
    metricas: ["Mejoras implementadas: 2 por trimestre", "Propuestas ganadas contra competencia: 40%"],
  }),
  () => ({
    titulo: "Capacitación continua del equipo",
    descripcion: "Una hora a la semana de aprendizaje: cambios en la ley, casos difíciles resueltos, atención al cliente. Un equipo que sabe más, sirve mejor.",
    diferenciador: "Nuestra gente es nuestra ventaja; la hacemos crecer.",
    pasos: ["Definir calendario de temas", "Rotar quién expone cada semana", "Grabar sesiones para consulta", "Evaluar con un mini examen trimestral"],
    metricas: ["Horas de capacitación por persona: 4 al mes", "Participación: 90%"],
  }),
  () => ({
    titulo: "Bienvenida memorable para clientes nuevos",
    descripcion: "Un proceso de arranque con llamada de bienvenida, kit de documentos claro, presentación del equipo que lo atenderá y revisión a los 30 días.",
    diferenciador: "Desde el primer día el cliente siente que eligió bien.",
    pasos: ["Diseñar el kit de bienvenida", "Crear lista de verificación de arranque", "Agendar revisión a los 30 días", "Medir satisfacción del arranque"],
    metricas: ["Clientes con bienvenida completa: 100%", "Satisfacción a 30 días: 4.7 / 5"],
  }),
  () => ({
    titulo: "Tablero interno de indicadores",
    descripcion: "Un tablero sencillo que el equipo revisa cada lunes: tiempos de despacho, errores, satisfacción, cotizaciones y cierres.",
    diferenciador: "Lo que se mide, mejora; y lo medimos juntos.",
    pasos: ["Elegir 6 indicadores clave", "Construir el tablero (Excel, Sheets o Looker Studio)", "Asignar responsable por indicador", "Revisarlo en 15 minutos cada lunes"],
    metricas: ["Indicadores actualizados cada semana: 100%", "Indicadores en meta: 80%"],
  }),
  () => ({
    titulo: "Garantía de servicio por escrito",
    descripcion: "Una promesa clara y pública: tiempos de respuesta, revisión doble de documentos y acompañamiento en revisiones de la autoridad.",
    diferenciador: "Nos comprometemos por escrito a lo que otros solo prometen de palabra.",
    pasos: ["Definir 3 compromisos que sí podemos cumplir", "Redactarlos de forma sencilla", "Incluirlos en propuestas y en el sitio", "Medir su cumplimiento cada mes"],
    metricas: ["Cumplimiento de la garantía: 98%", "Propuestas ganadas: +15%"],
  }),
];

// ---------------------------------------------------------------------------
// Redes sociales: tema × red × formato × gancho × llamado a la acción
// ---------------------------------------------------------------------------
const FORMATOS = {
  Facebook: ["post con imagen", "video corto", "álbum de fotos", "encuesta", "transmisión en vivo corta"],
  Instagram: ["carrusel de 5 a 7 láminas", "reel de 30 segundos", "historias con sticker de encuesta", "post con foto del equipo", "reel tipo “un día en…”"],
  LinkedIn: ["post de texto con imagen", "documento PDF (carrusel)", "artículo", "video corto nativo", "encuesta"],
};

const HORARIOS = {
  Facebook: "martes o jueves entre 12:00 y 14:00",
  Instagram: "miércoles o viernes entre 18:00 y 20:00",
  LinkedIn: "martes a jueves entre 8:00 y 10:00",
};

const METRICAS_RED = {
  Facebook: ["Alcance por publicación: 1,500 personas", "Interacciones: 50", "Mensajes recibidos: 5 al mes"],
  Instagram: ["Alcance: 2,000 cuentas", "Guardados y compartidos: 40", "Seguidores nuevos: +100 al mes"],
  LinkedIn: ["Impresiones: 3,000", "Tasa de interacción: 4%", "Solicitudes de contacto o cotización: 3 al mes"],
};

const CTAS = [
  "¿Tienes dudas? Escríbenos, con gusto te orientamos.",
  "Guarda esta publicación para cuando la necesites.",
  "Compártela con alguien que importa o exporta.",
  "Cuéntanos en comentarios qué opinas.",
  "Agenda una llamada con nuestro equipo; el enlace está en el perfil.",
  "Síguenos para más tips de comercio exterior cada semana.",
];

const HASHTAGS = {
  Facebook: "#SomosDistrito #ComercioExterior #Importaciones",
  Instagram: "#SomosDistrito #DistritoAduanal #ComercioExterior #Logística #Importar #Emprendedores",
  LinkedIn: "#SomosDistrito #ComercioExterior #Aduanas #Logística",
};

const TEMAS_REDES = [
  { titulo: (t) => `Tip aduanal de la semana${t ? `: ${t}` : ""}`, ganchos: ["Un error en la fracción arancelaria puede costarte más que el flete.", "Este detalle en tu factura puede detener tu mercancía."], copy: (t) => `Cada semana alguien de nuestro equipo comparte un consejo que aprendió en la operación diaria. Hoy: ${t || "revisa la clasificación arancelaria antes de embarcar"}.`, pasos: ["Elegir el tip con el equipo operativo", "Tomar foto de quien lo comparte", "Diseñar con la plantilla de la marca"] },
  { titulo: () => "Las personas detrás de cada despacho", ganchos: ["Detrás de cada contenedor liberado hay alguien que se desveló revisando documentos.", "Te presentamos a quien cuida tu mercancía."], copy: () => "Conoce a [Nombre], [puesto], con [X] años en comercio exterior. Lo que más disfruta de su trabajo: [dato]. Así es la gente que hace posible Distrito.", pasos: ["Sesión de fotos profesional", "Entrevista corta de 3 preguntas", "Publicar una persona cada quincena"] },
  { titulo: () => "Mitos y realidades del comercio exterior", ganchos: ["Mito: importar es solo para grandes empresas.", "Mito: el agente aduanal solo llena formularios."], copy: () => "Realidad: cada vez más PyMEs importan con éxito. La clave es contar con asesoría desde el primer embarque.", pasos: ["Reunir 5 mitos que escuchamos de clientes", "Validar respuestas con un agente aduanal", "Publicar como serie semanal"] },
  { titulo: () => "Un día en la aduana: detrás de cámaras", ganchos: ["Así se ve despachar un contenedor.", "Lo que pasa desde que tu mercancía llega hasta que sale liberada."], copy: () => "Te mostramos cómo trabajamos para que tu operación fluya. Detrás de cada despacho hay un equipo experto cuidando cada detalle.", pasos: ["Grabar clips cortos (sin datos de clientes)", "Editar con música y subtítulos", "Fijar en el perfil"] },
  { titulo: (t) => `Actualización regulatoria en 60 segundos${t ? `: ${t}` : ""}`, ganchos: ["Esto cambió en comercio exterior y te afecta.", "Salió en el DOF: esto debes saber."], copy: (t) => `Resumimos en un minuto ${t ? `lo nuevo sobre ${t}` : "la nueva disposición"} y qué debe hacer tu empresa.`, pasos: ["Monitorear DOF y RGCE cada semana", "Resumir el cambio en 3 puntos", "Publicar en menos de 48 h"] },
  { titulo: () => "Caso de éxito: el reto, la solución, el resultado", ganchos: ["Nuestro cliente tenía su mercancía detenida. Esto hicimos.", "Cómo ayudamos a una empresa a ahorrar en aranceles."], copy: () => "[Cliente] enfrentaba [reto]. Juntos [solución]. Resultado: [dato medible]. Historias así nos recuerdan por qué hacemos lo que hacemos.", pasos: ["Elegir caso con resultado medible", "Pedir autorización al cliente", "Diseñar con 3 bloques: reto, solución, resultado"] },
  { titulo: () => "Checklist antes de importar", ganchos: ["5 cosas que debes revisar antes de comprar a un proveedor extranjero.", "¿Vas a importar por primera vez? Guarda esto."], copy: () => "1) Padrón de importadores 2) Fracción arancelaria 3) Regulaciones y NOMs 4) Incoterm 5) Documentos del proveedor. En Distrito te acompañamos en cada paso.", pasos: ["Diseñar la lista con íconos", "Ofrecer versión descargable", "Promover entre PyMEs"] },
  { titulo: () => "Glosario aduanal: una palabra a la vez", ganchos: ["¿Sabes qué es un pedimento?", "Incoterms explicados sin rodeos."], copy: () => "Explicamos un término del comercio exterior de forma sencilla, con un ejemplo real. Porque entender el proceso te da tranquilidad.", pasos: ["Hacer lista de 20 términos", "Una lámina por término con ejemplo", "Publicar como serie"] },
  { titulo: () => "Pregunta de la semana", ganchos: ["¿Cuál es tu mayor reto al importar?", "Si pudieras cambiar una cosa del proceso aduanal, ¿cuál sería?"], copy: () => "Queremos conocerte mejor para compartir contenido que de verdad te sirva. ¡Cuéntanos!", pasos: ["Publicar la pregunta o encuesta", "Responder cada comentario", "Crear contenido con la respuesta ganadora"] },
  { titulo: () => "Testimonio en video de un cliente", ganchos: ["Esto dice [cliente] de trabajar con nosotros.", "La mejor carta de presentación: nuestros clientes."], copy: () => "Nada nos hace más felices que escuchar cómo le ayudamos a crecer. Gracias, [cliente], por tu confianza.", pasos: ["Pedir a 3 clientes un video de 30 segundos", "Dar 2 preguntas guía", "Editar con subtítulos y logo"] },
  { titulo: () => "Dato curioso del comercio exterior", ganchos: ["¿Sabías que México es de los países con más tratados comerciales del mundo?", "El producto más raro que hemos despachado…"], copy: () => "Un dato para empezar la semana con curiosidad. ¿Lo sabías?", pasos: ["Investigar 10 datos confiables", "Diseñar con fondo azul y verde de marca", "Publicar los lunes"] },
  { titulo: () => "Celebramos logros del equipo", ganchos: ["Hoy celebramos a [Nombre]: 10 años en Distrito.", "¡Nueva certificación para nuestro equipo!"], copy: () => "Los logros de nuestra gente son los logros de Distrito. ¡Gracias por tu compromiso!", pasos: ["Llevar calendario de aniversarios y logros", "Tomar foto el día del festejo", "Etiquetar a la persona (con permiso)"] },
  { titulo: (t) => `Pregúntale al experto${t ? `: ${t}` : ""}`, ganchos: ["Respondemos tus dudas de comercio exterior.", "Tu pregunta, respondida por un agente aduanal."], copy: (t) => `Recibimos tus preguntas${t ? ` sobre ${t}` : ""} y un experto de nuestro equipo las responde. Déjala en comentarios o por mensaje.`, pasos: ["Abrir caja de preguntas", "Grabar respuestas cortas", "Publicar una respuesta por semana"] },
  { titulo: () => "Antes y después: un proceso mejorado", ganchos: ["Antes tardaba 5 días. Ahora 2.", "Así cambió la operación de nuestro cliente."], copy: () => "Mostramos cómo un ajuste en el proceso redujo tiempos y costos. Mejorar cada día es parte de nuestra forma de trabajar.", pasos: ["Elegir una mejora medible", "Diseñar comparativo antes/después", "Contar la historia en 3 láminas"] },
];

function ideaRedes(red, tema, t) {
  const formato = pick(FORMATOS[red]);
  return {
    red,
    titulo: tema.titulo(t),
    descripcion: `Formato: ${formato}.\nGancho: “${pick(tema.ganchos)}”\nCopy: ${tema.copy(t)} ${pick(CTAS)}\n${HASHTAGS[red]}\nMejor horario: ${HORARIOS[red]}.`,
    diferenciador: "Contenido con rostro humano y útil de verdad; no solo publicidad.",
    pasos: [...tema.pasos, `Programar en ${red} para ${HORARIOS[red]}`, "Responder comentarios y mensajes el mismo día"],
    metricas: METRICAS_RED[red],
  };
}

const BANCOS = { ventas: VENTAS, visibilidad: VISIBILIDAD, mejora: MEJORA };

export function generarSinIA({ tipo, red, tema, publico, cantidad }) {
  if (tipo === "redes") {
    const redes = red ? [red] : shuffle(["Facebook", "Instagram", "LinkedIn"]);
    return shuffle(TEMAS_REDES)
      .slice(0, cantidad)
      .map((tm, i) => ideaRedes(redes[i % redes.length], tm, tema));
  }
  const publicos = publico ? [publico] : shuffle(PUBLICOS);
  return shuffle(BANCOS[tipo] || VENTAS)
    .slice(0, cantidad)
    .map((fn, i) => ({ red: "", ...fn({ p: publicos[i % publicos.length], t: tema }) }));
}
