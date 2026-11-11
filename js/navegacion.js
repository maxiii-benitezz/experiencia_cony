/* =====================================================
   NAVEGACION.JS – Perfiles, menú principal y cambio de pantallas
   ===================================================== */

/* -----------------------------------------------------------------
   CÓMO FUNCIONA LA NAVEGACIÓN (lo más importante para entender la página):
   - Cada pantalla es un <section class="screen" id="..."> en index.html.
   - Solo se ve la que tiene la clase "on". La función ir("id") le saca "on" a todas
     y se la pone a la que corresponde.
   - Pantallas: s0 portada · s1 elegir perfil · sm menú · s2 evento · sd dress code
     s3 regalos · s4 trivia · s5 confirmar.
   - Botones con data-volver="sX" marcan esa sección como vista (✔) y vuelven al menú.
   - Los botones de perfil y del menú se crean acá con datos de config.js
     (NOMBRES, EMOJIS, SECCIONES).
   [EDITABLE] Casi nada: lo que se muestra se cambia en config.js e index.html.
   Si querés que el menú bloquee secciones hasta ver la anterior, mirá dibujarMenu().
   ----------------------------------------------------------------- */


var pantallaActual = "s0";        /* pantalla que se está viendo (empieza en la portada) */
var pistaActual = PISTAS.s0;      /* canción que corresponde a la sección actual */
var completadas = {};             /* secciones ya vistas, ej: { s2: true } (se marcan con ✔ en el menú) */

$("#np").textContent = "🎵 " + pistaActual[1];

/* Muestra una pantalla por su id ("s0", "s1", "sm", "s2"...).
   Si "forzarMusica" es true, arranca la música (pasa en el botón Comenzar). */
function ir(id, forzarMusica){
  document.querySelectorAll(".screen").forEach(function(s){ s.classList.remove("on"); });
  $("#" + id).classList.add("on");
  pantallaActual = id;
  window.scrollTo(0, 0);

  /* Música: si la pantalla tiene canción asignada (en PISTAS) la pone.
     Si es null (el menú), deja sonar lo que estaba. */
  var pista = PISTAS[id];
  if (pista){
    pistaActual = pista;
    $("#np").textContent = "🎵 " + pista[1];
    var estabaSonando = audioActivo && !audioActivo.paused;
    if (estabaSonando || forzarMusica){
      var audioNuevo = $("#" + pista[0]);
      if (audioNuevo !== audioActivo || audioNuevo.paused) reproducirActual();
    }
  }

  /* Al entrar al menú, se redibuja (por si se desbloqueó algo) */
  if (id === "sm") dibujarMenu();

  /* Al entrar a la trivia por primera vez, empieza de cero.
     Si ya la había hecho y vuelve desde el menú, la ve como la dejó (no se puede repetir). */
  if (id === "s4" && !triviaIniciada) iniciarTrivia();
}

/* Marca una sección como vista (✔) y vuelve al menú */
function completar(id){
  completadas[id] = true;
  ir("sm");
}

/* ---------- MENÚ PRINCIPAL ---------- */
function dibujarMenu(){
  var cont = $("#menuLista");
  cont.innerHTML = "";
  SECCIONES.forEach(function(sec, i){
    /* Todas las secciones están habilitadas. Las que ya se vieron muestran ✔ */
    var hecha = completadas[sec.id];
    var b = document.createElement("button");
    b.className = "mitem" + (hecha ? " hecho" : "");
    b.innerHTML = '<span class="mi">' + sec.icono + '</span><span class="mn">' + sec.nombre +
                  '</span><span class="st">' + (hecha ? ICONO_CHECK : ICONO_PLAY) + '</span>';
    b.onclick = function(){ ir(sec.id); };
    cont.appendChild(b);
  });
}

/* Botón "Comenzar" de la portada: arranca la música y pasa a elegir perfil.
   El "true" fuerza el play, y como viene de un toque de la persona, Chrome y Safari lo permiten. */
$("#comenzar").onclick = function(){ ir("s1", true); };

/* Botones con data-go="sX": llevan a esa pantalla */
document.querySelectorAll("[data-go]").forEach(function(b){
  b.onclick = function(){ ir(b.dataset.go); };
});

/* Botones con data-volver="sX": marcan esa sección como vista y vuelven al menú */
document.querySelectorAll("[data-volver]").forEach(function(b){
  b.onclick = function(){ completar(b.dataset.volver); };
});

/* ---------- Crear los botones de perfil ---------- */
var grilla = $("#grid");
NOMBRES.forEach(function(nombre){
  var b = document.createElement("button");
  b.className = "profile";
  b.innerHTML = '<span class="av">' + (EMOJIS[nombre] || "💖") + '</span>' + nombre;
  b.onclick = function(){
    /* Si elige a otra persona distinta, se reinicia todo el recorrido */
    if (nombre !== quien){
      completadas = {};
      triviaIniciada = false;
      reiniciarConfirmacion();
    }
    quien = nombre;                                           /* guarda el nombre */
    try { sessionStorage.setItem("cony_who", nombre); } catch (e) {}
    mostrarNombre();
    ir("sm");                                                 /* pasa al menú principal */
  };
  grilla.appendChild(b);
});

mostrarNombre();
