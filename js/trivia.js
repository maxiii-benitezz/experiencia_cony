/* =====================================================
   TRIVIA.JS – Preguntas, nota del 1 al 10 y ranking
   ===================================================== */

/* -----------------------------------------------------------------
   CÓMO FUNCIONA:
   1) iniciarTrivia() arranca en la pregunta 0.
   2) dibujarPregunta() muestra la pregunta y sus botones; al tocar uno suma un acierto
      (si coincide con RESPUESTAS_CORRECTAS de config.js) y pasa a la siguiente.
   3) Al terminar, calcularNota() convierte los aciertos en una nota del 1 al 10 y se
      muestra un mensaje según la nota.
   4) guardarNota() manda la nota al Google Form (js/google.js) y muestra el ranking
      de todos, leído de tu hoja de Google (se actualiza cada unos minutos).
   [EDITABLE]
     - Los mensajes finales ("Sos más CONY que yo!...") y los números de corte (9 y 6)
       están en dibujarPregunta().
     - Las preguntas y respuestas correctas están en config.js.
   ----------------------------------------------------------------- */


var preguntaActual = 0;   /* número de pregunta (0 = primera) */
var aciertos = 0;         /* cuántas lleva bien */
var triviaIniciada = false;   /* true una vez que empezó (para no reiniciarla al volver desde el menú) */

function iniciarTrivia(){
  triviaIniciada = true;
  preguntaActual = 0;
  aciertos = 0;
  dibujarPregunta();
}

/* Nota final del 1 al 10 según los aciertos (mínimo 1) */
function calcularNota(){
  return Math.max(1, Math.round(aciertos / PREGUNTAS.length * 10));
}

/* Dibuja la pregunta actual, o el resultado si ya terminó */
function dibujarPregunta(){
  var cont = $("#quiz");
  $("#qn").textContent = Math.min(preguntaActual + 1, PREGUNTAS.length) + "/" + PREGUNTAS.length;
  $("#pb").style.width = (preguntaActual / PREGUNTAS.length * 100) + "%";

  /* ---- Ya respondió todo: mostrar resultado ---- */
  if (preguntaActual >= PREGUNTAS.length){
    var nota = calcularNota();
    /* Mensaje según la nota: cambiá los textos o los números si querés */
    var mensaje = nota >= 9 ? "¡Sos más CONY que yo! 👑"
                : nota >= 6 ? "¡Muy bien, nos conocemos! 💕"
                :             "Hay que ponerse al día… ¡la fiesta te va a enseñar! 🪄";
    cont.innerHTML =
      '<p class="big">🏆✨</p><h2>' + nota + ' / 10</h2><p class="sub">' + mensaje + '</p>' +
      '<h2 style="font-size:1.2rem">Ranking 🌟</h2><ul class="rank" id="rk"><li>Cargando…</li></ul>' +
      '<p class="note" id="rn"></p>' +
      '<button class="btn" id="volverMenu">← Volver al menú</button>';
    /* Al volver, la Trivia queda marcada como vista y se desbloquea "Confirmar" */
    $("#volverMenu").onclick = function(){ completar("s4"); };
    guardarNota(nota);
    return;
  }

  /* ---- Mostrar una pregunta con sus 3 botones ---- */
  cont.innerHTML = '<p class="q">' + (preguntaActual + 1) + '. ' + PREGUNTAS[preguntaActual][0] + '</p>';
  PREGUNTAS[preguntaActual][1].forEach(function(texto, i){
    var b = document.createElement("button");
    b.className = "opt";
    b.textContent = "abc"[i] + ") " + texto;
    b.onclick = function(){
      var correcta = RESPUESTAS_CORRECTAS[preguntaActual];
      if (correcta === null || correcta === i) aciertos++;   /* null = cualquier respuesta suma */
      preguntaActual++;
      dibujarPregunta();
    };
    cont.appendChild(b);
  });
}

/* Manda la nota a Google y muestra el ranking de todos */
function guardarNota(nota){
  var aviso = $("#rn");
  /* 1) Guardar la nota en tu hoja de Google (fila de tipo TRIVIA) */
  enviarAGoogle({ tipo: "TRIVIA", nombre: quien, nota: nota })
    .catch(function(){ aviso.textContent = "No pude guardar tu puntaje 🥲"; });
  /* 2) Leer el ranking publicado y mostrarlo */
  leerRanking()
    .then(function(filas){
      dibujarRanking(filas, nota);
      aviso.textContent = "El ranking se actualiza cada unos minutos ✨";
    })
    .catch(function(){
      dibujarRanking([], nota);
      aviso.textContent = "No pude cargar el ranking de los demás 🥲";
    });
}

/* Arma la lista del ranking: junta lo que viene de la hoja con tu nota recién hecha
   (la hoja tarda unos minutos en actualizarse, así que tu nota se suma a mano) */
function dibujarRanking(filas, nota){
  var mejor = {}, yo = slug(quien);
  filas.forEach(function(f){                       /* se queda con la mejor nota de cada persona */
    var k = slug(f.nombre);
    if (!(k in mejor) || f.nota > mejor[k].nota) mejor[k] = f;
  });
  if (!(yo in mejor) || nota > mejor[yo].nota) mejor[yo] = { nombre: quien, nota: nota };
  var lista = Object.keys(mejor).map(function(k){ return mejor[k]; })
    .sort(function(a, b){ return b.nota - a.nota || a.nombre.localeCompare(b.nombre); });
  $("#rk").innerHTML = lista.map(function(f){
    return '<li class="' + (slug(f.nombre) === yo ? "me" : "") + '"><span>' + esc(f.nombre) + '</span><b>' + f.nota + '/10</b></li>';
  }).join("");
}
