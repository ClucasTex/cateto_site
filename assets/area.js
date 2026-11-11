// Funções partilhadas pela área de clientes e pela gestão
(function () {
  function $(s) { return document.querySelector(s); }
  function msg(el, t, kind) { el.textContent = t; el.className = "msg" + (kind ? " " + kind : ""); }
  function dia(d) { if (!d) return ""; var x = new Date(d); return x.toLocaleDateString("pt-PT"); }
  function tam(n) {
    if (!n && n !== 0) return "";
    if (n < 1024) return n + " B";
    if (n < 1048576) return (n / 1024).toFixed(0) + " KB";
    return (n / 1048576).toFixed(1).replace(".", ",") + " MB";
  }
  function ext(n) { var m = /\.([a-z0-9]{1,5})$/i.exec(n || ""); return m ? m[1].toUpperCase() : "FIC"; }
  function btn(label, cls) {
    var b = document.createElement("button"); b.type = "button";
    b.className = "btn " + (cls || ""); b.textContent = label; return b;
  }
  function item(ic, nome, sub, icCls) {
    var li = document.createElement("li");
    var i = document.createElement("span"); i.className = "ic " + (icCls || ""); i.textContent = ic;
    var n = document.createElement("div"); n.className = "nm";
    var b = document.createElement("b"); b.textContent = nome;
    var s = document.createElement("small"); s.textContent = sub || "";
    n.append(b, s);
    var a = document.createElement("div"); a.className = "act";
    li.append(i, n, a); return li;
  }
  window.AREA = { $: $, msg: msg, dia: dia, tam: tam, ext: ext, btn: btn, item: item, db: window.CATETO && window.CATETO.db() };
})();
