/* =====================================================
   GOOGLE.JS – Enviar datos a tu Google Form y leer el ranking de tu Google Sheet

   CÓMO FUNCIONA:
   - enviarAGoogle(datos): manda una fila al formulario (como si alguien lo completara,
     pero sin que nadie vea el formulario). Esa fila aparece en tu hoja de Google Sheets.
   - leerRanking(): lee la pestaña "Ranking" de la hoja, publicada como CSV, y devuelve
     la lista de {nombre, nota}.
   Los links y códigos están en js/config.js (FORM_ENVIO, FORM_CAMPOS, CSV_RANKING).
   [NO TOCAR] salvo que cambies la forma de guardar los datos.
   ===================================================== */

/* Envía una fila al formulario.
   datos = { tipo, nombre, nota, respuesta, motivo } (los que no se usen pueden faltar) */
function enviarAGoogle(datos){
  var cuerpo = new URLSearchParams();
  Object.keys(FORM_CAMPOS).forEach(function(clave){
    cuerpo.append(FORM_CAMPOS[clave], datos[clave] == null ? "" : String(datos[clave]));
  });
  /* mode "no-cors": Google no devuelve una respuesta que podamos leer, pero el envío se hace.
     Solo se entera de un error si falla la conexión a internet. */
  return fetch(FORM_ENVIO, { method: "POST", mode: "no-cors", body: cuerpo, keepalive: true });
}

/* Convierte el texto CSV en una lista de filas (cada fila es una lista de celdas).
   Entiende las celdas entre comillas, como "Perez, Ana". */
function leerCSV(texto){
  var filas = [], fila = [], celda = "", comillas = false;
  for (var i = 0; i < texto.length; i++){
    var ch = texto[i];
    if (comillas){
      if (ch === '"' && texto[i+1] === '"'){ celda += '"'; i++; }
      else if (ch === '"') comillas = false;
      else celda += ch;
    } else if (ch === '"') comillas = true;
    else if (ch === ","){ fila.push(celda); celda = ""; }
    else if (ch === "\n" || ch === "\r"){
      if (ch === "\r" && texto[i+1] === "\n") i++;
      fila.push(celda); celda = ""; filas.push(fila); fila = [];
    } else celda += ch;
  }
  if (celda !== "" || fila.length) { fila.push(celda); filas.push(fila); }
  return filas;
}

/* Lee el ranking publicado. Devuelve (en una promesa) una lista [{nombre, nota}, ...]. */
function leerRanking(){
  /* el "t=" evita que el navegador use una copia vieja guardada */
  var url = CSV_RANKING + (CSV_RANKING.indexOf("?") > -1 ? "&" : "?") + "t=" + Date.now();
  return fetch(url).then(function(r){
    if (!r.ok) throw new Error("No se pudo leer el ranking");
    return r.text();
  }).then(function(texto){
    return leerCSV(texto).slice(1)                         /* saltea la fila de títulos */
      .map(function(f){ return { nombre: (f[0] || "").trim(), nota: parseFloat(String(f[1] || "").replace(",", ".")) }; })
      .filter(function(f){ return f.nombre && !isNaN(f.nota); });   /* descarta filas vacías o con error */
  });
}
