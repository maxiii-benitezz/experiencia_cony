/* =====================================================
   MUSICA.JS – Reproductor de la barra de abajo
   ===================================================== */

/* -----------------------------------------------------------------
   CÓMO FUNCIONA:
   - En index.html hay 3 etiquetas <audio> (a1, a2, a3), una por canción.
   - En config.js, PISTAS dice qué canción corresponde a cada pantalla.
   - navegacion.js guarda en "pistaActual" la canción de la pantalla actual y
     llama a reproducirActual() cuando hay que cambiarla.
   - Los navegadores NO dejan sonar música sin un toque de la persona; por eso
     el botón INGRESA de la portada es el que la arranca.
   [EDITABLE] Nada acá. Para cambiar canciones: reemplazá los mp3 de la carpeta audio/
   (mismos nombres) o cambiá las rutas en index.html y los textos en config.js (PISTAS).
   ----------------------------------------------------------------- */


var silenciado = false;     /* ¿está en mute? */
var audioActivo = null;     /* el <audio> que está sonando ahora */
var audios = ["a1","a2","a3"].map(function(id){ return $("#" + id); });

/* Cambia el botón (▶ / ⏸) y activa/desactiva las barritas animadas */
function actualizarBoton(sonando){
  $("#pp").innerHTML = sonando ? ICONO_PAUSA : ICONO_PLAY;
  $("#player").classList.toggle("playing", sonando);
}

/* Reproduce la canción de la sección actual (pistaActual, definida en navegacion.js)
   y frena las otras */
function reproducirActual(){
  var audio = $("#" + pistaActual[0]);
  audios.forEach(function(a){ if (a !== audio) a.pause(); });
  audioActivo = audio;
  audio.muted = silenciado;
  $("#np").textContent = "🎵 " + pistaActual[1];
  var p = audio.play();
  /* Si el navegador bloquea el audio o falta el mp3, el botón queda en ▶ sin romper nada */
  if (p && p.then) p.then(function(){ actualizarBoton(true); }).catch(function(){ actualizarBoton(false); });
}

/* Botón ▶ / ⏸ */
$("#pp").onclick = function(){
  var audio = audioActivo || $("#" + pistaActual[0]);
  if (audio.paused) reproducirActual();
  else { audio.pause(); actualizarBoton(false); }
};

/* Botón 🔊 / 🔇 */
$("#nx").onclick = function(){
  silenciado = !silenciado;
  audios.forEach(function(a){ a.muted = silenciado; });
  this.textContent = silenciado ? "🔇" : "🔊";
};
