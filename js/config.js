/* =====================================================
   CONFIG.JS – TODO LO QUE PODÉS EDITAR SIN TOCAR CÓDIGO
   Acá están los nombres, la trivia, las canciones y la carta.
   ===================================================== */

/* -----------------------------------------------------------------
   [EDITABLE] ESTE ES EL ARCHIVO MÁS FÁCIL DE MODIFICAR
   -----------------------------------------------------------------
   QUÉ HAY ACÁ (y qué cambia si lo tocás):
     NOMBRES ................ los perfiles de la primera pantalla
     EMOJIS ................. el emoji de cada perfil
     SECCIONES .............. los botones del menú (nombre, emoji y orden)
     PISTAS ................. qué canción suena en cada pantalla
     PREGUNTAS .............. las preguntas y opciones de la trivia
     RESPUESTAS_CORRECTAS ... cuál opción suma punto (para la nota del 1 al 10)
     PREGUNTAS_SEGURO ....... los pasos del juego del "No puedo"
     CARTA / FIRMA .......... la carta que se abre al confirmar
     FORM_ENVIO / FORM_CAMPOS / CSV_RANKING ... la conexión con tu Google Form y tu hoja (al final)

   CÓMO FUNCIONA: este archivo solo guarda DATOS (listas y textos). Los otros
   archivos de js/ los leen y arman la página. Por eso es el primero que se carga
   (mirá el orden de los <script> al final de index.html).

   REGLAS PARA NO ROMPER NADA:
     - Los textos van siempre entre comillas:  "así"
     - Entre un elemento de una lista y el siguiente va una coma, menos después del último.
     - No borres las llaves { } ni los corchetes [ ].
     - Si algo deja de funcionar, abrí la consola del navegador (F12 en la compu)
       y fijate el mensaje en rojo: te dice en qué archivo y línea quedó el error.

   EJEMPLO – agregar una pregunta a la trivia:
     1) En PREGUNTAS, agregá (con una coma después de la anterior):
          ["Mi comida favorita es:", ["Pizza", "Sushi", "Empanadas"]]
     2) En RESPUESTAS_CORRECTAS, agregá un número al final (0 = a, 1 = b, 2 = c, null = cualquiera suma).
     La cantidad de preguntas y la nota sobre 10 se ajustan solas.
   ----------------------------------------------------------------- */


/* ---------- PERFILES ----------
   Cada nombre es un botón en la primera pantalla.
   Para agregar a alguien: sumá su nombre entre comillas, con coma. */
var NOMBRES = ["Kechu","July","Juan","Maximo","Pily","Vicky","Luci","Celi","Roman","Dari","Benja","Mate","Rochi","Pila","Luli","Delfi","Sofi","Cate"];

/* Emoji de cada perfil (aparece en su botón). Si agregás un nombre nuevo arriba,
   agregale acá su emoji (si no, se usa 💖). */
var EMOJIS = {
  Kechu:"🥂", July:"💗", Juan:"🩶", Maximo:"❤️‍🩹", Pily:"🎸", Vicky:"💜",
  Luci:"💋", Celi:"🌼", Roman:"💙", Dari:"💛", Benja:"🤍", Mate:"🏉",
  Rochi:"👑", Pila:"❣️", Luli:"🌸", Delfi:"🧡", Sofi:"🩵", Cate:"🎬"
};

/* ---------- SECCIONES DEL MENÚ ----------
   Se muestran en este orden y se puede entrar a cualquiera.
   id = pantalla en index.html · icono · nombre que se muestra */
var SECCIONES = [
  { id:"s2", icono:"🗓️", nombre:"Evento" },
  { id:"sd", icono:"👗", nombre:"Dress Code" },
  { id:"s3", icono:"💌", nombre:"Regalos" },
  { id:"s4", icono:"🪄", nombre:"Trivia" },
  { id:"s5", icono:"🥂", nombre:"Confirmar" }
];

/* ---------- MÚSICA ----------
   Para cada pantalla: [id del <audio> en index.html, texto que se muestra].
   null = no cambia la música (sigue la que estaba sonando). */
var PISTAS = {
  s0: ["a1", "Welcome to New York – Taylor Swift"],
  s1: ["a1", "Welcome to New York – Taylor Swift"],
  sm: null,
  s2: ["a1", "Welcome to New York – Taylor Swift"],
  sd: ["a1", "Welcome to New York – Taylor Swift"],
  s3: ["a2", "Comprame un brishito – Lali"],
  s4: ["a1", "Welcome to New York – Taylor Swift"],
  s5: ["a3", "Daylight – Taylor Swift"]
};

/* ---------- TRIVIA ----------
   Cada pregunta: [ "texto", [opción a, opción b, opción c] ] */
var PREGUNTAS = [
  ["Mi cantante favorito es:", ["Taylor Swift","One Direction","Dillom"]],
  ["Mi serie favorita es:", ["Sex and the City","Envidiosa","Rebelde Way"]],
  ["Mi frase favorita de la canción MADISON:", [
    "Pedazos de loro un par se regalan pero yo los decoro",
    "Saludo por el carro y me siento Perón, estoy buscando a mi Evita",
    "Nos reciben con luces, botellas y bengalas, se nos pegan par de nenas malas"]],
  ["Mi frase favorita de Wanda Nara:", [
    "De mi familia me encargo yo, de las putitas… la vida misma.",
    "Otra familia que te cargaste por zorra!",
    "Te habla la mafilia rey (Otra poesía - elegante)"]],
  ["Dentro de la farándula argentina, ¿cuál es mi momento favorito?", [
    "No metas a tu abuela muerta en esto Silvina Escupidero! (Moria Casán contra Silvina Escudero)",
    "Mamá cortaste toda la luz! (Ricky Fort y su mamá)",
    "¡Yo soy Ariana Grande! (El vivo de Anto Pane y Kiara Acosta)"]],
  ["Mi manera favorita de demostrarte amor es…", ["Una carta","Un regalo","Compañía"]],
  ["¿Qué es aquello que mueve mi corazón?", [
    "El amor; en cada faceta, la música, la educación.",
    "La antropología, la escritura y la fe",
    "Todas las anteriores"]]
];

/* ---------- RESPUESTAS CORRECTAS ----------
   Una por pregunta, en el mismo orden: 0 = a, 1 = b, 2 = c.
   null = "cualquier respuesta suma" (completalas con los números reales).
   La nota final se calcula del 1 al 10 según cuántas acierten. */
var RESPUESTAS_CORRECTAS = [0,2, 1, 0, 0, 0,2 ];

/* ---------- JUEGO DEL "NO PUEDO" ----------
   Después de tocar "No puedo" aparecen estos pasos, uno tras otro.
   Cada paso: [título, texto de abajo, ¿pide escribir el motivo?]
   El último paso es el definitivo. */
var PREGUNTAS_SEGURO = [
  ["¿Conocés a Cony? 😤", "Se te va a enojar…", false],
  ["No sé si Cony te va a entender…", "Pero tené cuidado: avisale el porqué no podés ir.", true]
];

/* ---------- CARTA DE CONY ----------
   Cada línea es un párrafo. Se muestra al confirmar que va. */
var CARTA = [
  "Siempre sentí que gran parte de lo que soy se debe a quienes me rodean, aquellos gestos, chistes o costumbres que mi corazón les roba inocentemente. Con el tiempo y mis reflexiones lo afirmo cada vez más.",
  "Hoy cada persona que formó parte de mi vida, construye parte de mi historia y vive en mí.",
  "Todos ustedes en determinada medida y de manera única habitan dentro mío. Por eso me pone muy feliz tu confirmación y no puedo esperar a verte en mi día!",
  "Te espero, Cony."
];
var FIRMA = "Cony 💕";   /* firma al final de la carta */

/* ---------- GOOGLE FORMS + GOOGLE SHEETS ----------
   [EDITABLE] Acá se conecta la invitación con tu formulario y tu hoja de Google.
   Si algún día cambiás de formulario u hoja, solo cambiás estos datos. */

/* Dirección a la que se ENVÍAN las respuestas (es el link del formulario, terminado en /formResponse) */
var FORM_ENVIO = "https://docs.google.com/forms/d/e/1FAIpQLSfCWoh2bfe0LkgJvHwlTWc7Xo_zC8rOIxDo5igXDe7rA-CyGQ/formResponse";

/* Código interno de Google de cada pregunta del formulario (salen del "enlace prellenado") */
var FORM_CAMPOS = {
  tipo:      "entry.229586864",     /* pregunta "Tipo"      -> TRIVIA o RSVP */
  nombre:    "entry.1331584796",    /* pregunta "Nombre"    -> el perfil elegido */
  nota:      "entry.1771266676",    /* pregunta "Nota"      -> nota de la trivia (1 a 10) */
  respuesta: "entry.1127123999",    /* pregunta "Respuesta" -> "Va" o "No va" */
  motivo:    "entry.279752560"      /* pregunta "Motivo"    -> por qué no puede ir */
};

/* Dirección de donde se LEE el ranking (pestaña "Ranking" publicada como CSV) */
var CSV_RANKING = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqCPSv_PUnmsQtTuuc2e8ZgzJigHVbkFsj9iSG06ICXS268aeh-soyLUZSZiU9YCFbyuXSKSo6mOi-/pub?gid=1049501201&single=true&output=csv";
