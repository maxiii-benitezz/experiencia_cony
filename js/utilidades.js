/* =====================================================
   UTILIDADES.JS – Funciones chiquitas que usan los demás archivos
   ===================================================== */

/* -----------------------------------------------------------------
   CÓMO FUNCIONA: acá hay herramientas chicas que usan los otros archivos
   ($, slug, esc, mostrarNombre y los íconos ▶ ⏸ ✔ dibujados en SVG).
   [NO TOCAR] salvo que sepas lo que hacés: si cambiás algo acá, se puede
   romper otra parte. Lo único "editable" son los dibujos SVG de los íconos.
   ----------------------------------------------------------------- */


/* $("#id") = atajo para buscar un elemento de la página */
function $(selector){ return document.querySelector(selector); }

/* Convierte un nombre en un código simple: "Rochi" -> "rochi".
   Se usa como identificador al guardar datos (así cada persona tiene un solo registro). */
function slug(nombre){ return nombre.toLowerCase().replace(/[^a-z0-9]/g, ""); }

/* Escapa texto antes de mostrarlo como HTML (evita que alguien meta código raro en su mensaje) */
function esc(texto){
  var d = document.createElement("span");
  d.textContent = (texto == null ? "" : texto);
  return d.innerHTML;
}

/* Perfil elegido (se recuerda mientras la pestaña esté abierta) */
var quien = "";
try { quien = sessionStorage.getItem("cony_who") || ""; } catch (e) {}

/* Escribe el nombre elegido en todos los lugares con class="who" */
function mostrarNombre(){
  document.querySelectorAll(".who").forEach(function(el){ el.textContent = quien; });
}

/* ---------- ICONOS DIBUJADOS (▶ ⏸ ✔) ----------
   Estos símbolos también cambian de forma según el celular, así que se dibujan con SVG.
   Toman el color del texto donde se usan (currentColor). */
var ICONO_PLAY  = '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>';
var ICONO_PAUSA = '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="2.5" width="3.2" height="11" rx=".6" fill="currentColor"/><rect x="9.3" y="2.5" width="3.2" height="11" rx=".6" fill="currentColor"/></svg>';
var ICONO_CHECK = '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
