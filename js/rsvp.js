/* =====================================================
   RSVP.JS – Confirmación de asistencia, el juego del
   "No puedo" y la carta de Cony
   ===================================================== */

/* -----------------------------------------------------------------
   CÓMO FUNCIONA:
   - "¡Voy!" confirma directo y muestra la carta (el sobre se abre al tocarlo).
   - "No puedo" arranca el juego: aparece un cuadro con los pasos de PREGUNTAS_SEGURO
     (config.js). En cada paso el botón "Mejor sí voy" crece y el de "No puedo" se achica.
     En el último paso hay que escribir el motivo y enviar.
   - terminar() manda la respuesta (Va / No va + motivo) al Google Form (js/google.js);
     Cony la ve como una fila nueva en su hoja de Google Sheets.
   [EDITABLE]
     - Los textos de cada paso: config.js (PREGUNTAS_SEGURO). La carta: config.js (CARTA).
     - Cuánto crece / se achica cada botón: los números 0.15 y 0.2 en mostrarSeguro().
     - El mensaje que ve quien dice que no va: dentro de terminar().
   ----------------------------------------------------------------- */


var vuelta = 0;   /* en qué paso del "No puedo" está (0 = todavía no tocó, 1, 2...) */

/* Deja la confirmación como nueva (se usa cuando otra persona elige su perfil) */
function reiniciarConfirmacion(){
  vuelta = 0;
  $("#form").hidden = false;
  $("#done").hidden = true;
  $("#ask").hidden = true;
  $("#why").value = "";
}

/* Muestra el cuadro del juego según el paso (vuelta) */
function mostrarSeguro(){
  var paso = PREGUNTAS_SEGURO[vuelta - 1];     /* [título, texto, ¿pide motivo?] */
  var esUltimo = (vuelta === PREGUNTAS_SEGURO.length);
  $("#at").textContent = paso[0];
  $("#ap").textContent = paso[1];
  $("#why").hidden = !paso[2];                 /* cuadro del motivo solo si el paso lo pide */
  $("#whyErr").textContent = "";
  $("#an").textContent = esUltimo ? "Enviar: no voy" : "No puedo";
  /* "Mejor sí voy" crece y el otro botón se achica en cada paso (cambiá 0.15 y 0.2 si querés) */
  $("#ay").style.transform = "scale(" + (1 + 0.15 * vuelta) + ")";
  $("#an").style.transform = "scale(" + (1 - 0.2 * vuelta) + ")";
  $("#ask").hidden = false;
  $("#ask").scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ¡Voy! -> confirma directo */
$("#yes").onclick = function(){ terminar("yes"); };

/* No puedo -> empieza el juego */
$("#no").onclick = function(){ vuelta = 1; mostrarSeguro(); };

/* "Mejor sí voy" (dentro del cuadro) -> confirma que va */
$("#ay").onclick = function(){ $("#ask").hidden = true; terminar("yes"); };

/* "No puedo" (dentro del cuadro) -> siguiente paso; en el último se envía el motivo */
$("#an").onclick = function(){
  if (vuelta < PREGUNTAS_SEGURO.length){ vuelta++; mostrarSeguro(); return; }
  /* Último paso: el motivo es obligatorio */
  var motivo = $("#why").value.trim();
  if (!motivo){ $("#whyErr").textContent = "Escribile a Cony el motivo 💬"; $("#why").focus(); return; }
  $("#ask").hidden = true;
  terminar("no", motivo);
};

/* Cierra el formulario, muestra el resultado y guarda la respuesta.
   respuesta = "yes" (va) o "no" (no va) · motivo = texto (solo si no va) */
function terminar(respuesta, motivo){
  $("#form").hidden = true;
  $("#done").hidden = false;
  var aviso = '<p class="note" id="sv"></p>';   /* lugar para avisar si falló el guardado */

  if (respuesta === "yes"){
    /* Sobre cerrado; al tocarlo se abre la carta */
    $("#done").innerHTML =
      '<p class="big">🎉👑🎉</p><h2>¡Lugar guardado!</h2>' +
      '<p class="sub">Tenés una carta esperándote 💌</p>' +
      '<button class="env" id="env" aria-label="Abrir carta">💌</button><div id="lt"></div>' + aviso;
    $("#env").onclick = function(){
      this.hidden = true;
      var parrafos = CARTA.map(function(p){ return "<p>" + p + "</p>"; }).join("");
      $("#lt").innerHTML = '<div class="letter">' + parrafos + '<div class="sig">' + FIRMA + '</div></div>';
    };
  } else {
    $("#done").innerHTML =
      '<p class="big">📨</p><h2>¡Listo!</h2>' +
      '<p class="sub">Ya le avisamos a Cony, ' + esc(quien) + '.</p>' + aviso;
  }

  /* Mandar la respuesta a tu hoja de Google (fila de tipo RSVP) */
  enviarAGoogle({ tipo: "RSVP", nombre: quien, respuesta: respuesta === "yes" ? "Va" : "No va", motivo: motivo || "" })
    .catch(function(){ $("#sv").textContent = "No pude registrar tu respuesta 🥲 avisale a Cony por otro medio."; });
}
