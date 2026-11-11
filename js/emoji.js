/* =====================================================
   EMOJI.JS – Que todos los emojis se vean IGUALES en cualquier dispositivo

   Los emojis "de texto" cambian según el celular o la compu (iPhone, Android, Windows...).
   Este archivo los reemplaza, antes de que se vean, por imágenes PNG de la carpeta
   img/emoji/ (el mismo dibujo para todos).

   - Sigue escribiendo los emojis normalmente en index.html y en js/config.js:
     el script los convierte solo (también los de textos que arma el código, como
     el menú, la trivia o el ranking).
   - Cada imagen se llama como el código del emoji: 👑 -> img/emoji/1f451.png
   - Si agregás un emoji NUEVO, hace falta su imagen. Para bajarlas todas de una vez:
         python3 herramientas/descargar_emojis.py
   ===================================================== */

/* -----------------------------------------------------------------
   CÓMO FUNCIONA: recorre todos los textos de la página, busca emojis y cada uno lo
   cambia por una <img> de la carpeta img/emoji/. Además queda "vigilando" la página:
   si otro archivo escribe texto nuevo con emojis, también lo convierte.
   [EDITABLE] Nada acá. Para cambiar el dibujo de un emoji: reemplazá su PNG en
   img/emoji/ (mismo nombre). Para uno nuevo: mirá herramientas/descargar_emojis.py.
   ----------------------------------------------------------------- */

(function(){
  /* Qué es un emoji: un pictograma + variantes (FE0F), tonos de piel y uniones (ZWJ), o una bandera */
  var RE = /(?:\p{Regional_Indicator}{2})|(?:\p{Extended_Pictographic}[\uFE0F\u{1F3FB}-\u{1F3FF}]?(?:\u200D\p{Extended_Pictographic}[\uFE0F\u{1F3FB}-\u{1F3FF}]?)*)/gu;
  var CARPETA = "img/emoji/";                 /* dónde están las imágenes */
  var OMITIR = { SCRIPT:1, STYLE:1, TEXTAREA:1, INPUT:1, NOSCRIPT:1, TITLE:1 };  /* lugares donde no se reemplaza */

  /* Nombre de archivo de un emoji: códigos en hexadecimal unidos con guiones, sin FE0F.
     Ej: ❤️‍🩹 -> "2764-200d-1fa79" */
  function nombre(texto){
    var codigos = [];
    for (var ch of texto){ var n = ch.codePointAt(0); if (n !== 0xFE0F) codigos.push(n.toString(16)); }
    return codigos.join("-");
  }

  /* De dónde sale la imagen: en la versión de un solo archivo viene incrustada (EMOJI_DATA),
     en la versión con carpetas se lee de img/emoji/ */
  function fuente(n){
    return (typeof EMOJI_DATA !== "undefined" && EMOJI_DATA[n]) || (CARPETA + n + ".png");
  }

  /* Crea la <img> de un emoji. El "alt" guarda el emoji original (sirve para copiar/pegar,
     para lectores de pantalla y como último recurso si una imagen no carga) */
  function crearImagen(emoji){
    var img = document.createElement("img");
    img.className = "emoji";
    img.alt = emoji;
    img.draggable = false;
    img.src = fuente(nombre(emoji));
    return img;
  }

  /* Reemplaza los emojis de un nodo de texto por imágenes */
  function convertirTexto(nodo){
    var t = nodo.nodeValue, ultimo = 0, m, frag = null;
    RE.lastIndex = 0;
    while ((m = RE.exec(t))){
      frag = frag || document.createDocumentFragment();
      if (m.index > ultimo) frag.appendChild(document.createTextNode(t.slice(ultimo, m.index)));
      frag.appendChild(crearImagen(m[0]));
      ultimo = m.index + m[0].length;
    }
    if (!frag) return;                                   /* no había emojis */
    if (ultimo < t.length) frag.appendChild(document.createTextNode(t.slice(ultimo)));
    nodo.parentNode.replaceChild(frag, nodo);
  }

  /* Recorre toda la página y convierte los emojis que encuentre */
  function convertirTodo(){
    var nodos = [], w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    while (w.nextNode()){
      var p = w.currentNode.parentNode;
      if (p && !OMITIR[p.nodeName]) nodos.push(w.currentNode);
    }
    nodos.forEach(convertirTexto);
  }

  /* Vigila la página: cada vez que el código escribe texto nuevo (menú, trivia, ranking...),
     lo convierte enseguida, antes de que se dibuje en pantalla */
  var pendiente = false;
  new MutationObserver(function(){
    if (pendiente) return;
    pendiente = true;
    Promise.resolve().then(function(){ pendiente = false; convertirTodo(); });
  }).observe(document.body, { childList:true, subtree:true, characterData:true });

  convertirTodo();   /* primera pasada con lo que ya está en la página */
})();
