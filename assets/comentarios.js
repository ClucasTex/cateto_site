// Comentários de clientes (texto original do site cateto.pt) + comentários novos aprovados no Supabase
(function () {
  var BASE = [
    ["Jorge Fonseca", "2026-09-10", "en", "Quick,efficient, very friendly good communicator,flexible English and Portuguese"],
    ["Sibylle Winter", "2025-09-24", "pt", "Gostámos muito do profissionalismo do Sr. Teixeira. Trabalhou de forma rápida, fiável e correta. As perguntas foram sempre respondidas. O Sr. Teixeira foi muito simpático, respondeu rapidamente ao nosso pedido e recomendamos vivamente que trabalhemos com ele."],
    ["Michelle Monahan-Little", "2023-09-27", "en", "Thank you very much for your service to us. Our architect told me he was very pleased with your work and I found you were extremely efficient. You were happy to answer our questions. We are very grateful. I will recommend you to anyone I meet who is seeking a topographical survey."],
    ["António Martins", "2023-09-13", "en", "Carlos Teixeira offered an effective and competent job with a swift turnaround time. No fuss, no delays and at a very competitive price too. Specialised professionals like him are hard to find, especially if you are from out of town and just arrived in the area. I can highly recommend his work."],
    ["Johanna Batista", "2022-07-11", "en", "Thank you very much Carlos for your services. They have been of great help. You are a great and efficient professional and I will highly recommend you."],
    ["Marina R. Ramos", "2022-04-12", "pt", "O Atelier Cateto fez um trabalho muito profissional, de levantamento de uma propriedade antiga. Gostámos muito e recomendamos!"],
    ["Anne Morizet", "2019-12-01", "fr", "Je recommande pour le sérieux du travail, la réactivité et la gentillesse. Merci Sr Carlos!"],
    ["Lunelli", "2017-05-26", "fr", "Nous sommes extrêmement satisfaits des services de M.Teixeira. Agréable, très efficace, et surtout rapide et fiable dans ses retours, nous ne pouvons que le recommander. Un grand merci pour son professionnalisme et sa gentillesse !"],
    ["Francis Hurst", "2016-07-16", "en", "We were very impressed with the work carried out by CATETO in price, quality and timeliness. Carlos also provided additional detail about the land and worked very professionally with our neighbours. We can highly recommend his services."],
    ["Barry Evans", "2015-12-20", "en", "Carlos was recommended to us and we were completely satisfied with the work he undertook for us. The levels and shape of the land were difficult to work with but he produced a very good document. Thank you."],
    ["David Perkins", "2015-12-18", "en", "Carlos helped my wife and myself in a boundary dispute with a neighbour. He was friendly and co-operative and he went about his work efficiently and in a very professional manner. We have no hesitation in recommending him."],
    ["Tommy Segerlind", "2015-12-16", "en", "We are very satisfied with the work CATETO did with our plots. The dokumentation was excellent. We really recommend him!"],
    ["Francis McDonnell", "2015-12-16", "en", "Whenever I have used Carlos, I have been completely satisfied with his work, attention to detail and promptness of reply, I will be speaking to him again during 2016. Sorry I could not make it this year."],
    ["Ib Axelgaard, Silkeborg, Denmark", "2015-12-15", "en", "Carlos Teixeira has been an tremendous help to me during my quest to find a landslot in the contryside borght many years ago. He has also ensured prober documentation to the municipality, thus pushed a project closer til reality. I can recommend Carlos's work to anyone 😊 Did I forget to mention, that all communications was in english - very convient if you don't speak Portuguese. I will certainly use him in the future."],
    ["Nigel Anteney-Hoare", "2015-12-15", "en", "We used the services of Cateto to resolve the land areas for two pieces of land held in corporate names both for registration purposes and also for our information. We were totally satisfied with the service we received, especially as one plot was a very large area, in difficult terrain. We have no hesitation in recommending CATETO."],
    ["Trond Stokke", "2015-12-15", "en", "I am very satisfied with your services. I am impressed over your dedication you showed to your work, being eager to to deliver a good result, especially when you take in consideration the rather rough topography at our property."],
    ["Manuel L. Esquível", "2015-12-14", "en", "In both times I was pleased with the work of Topographer Carlos Teixeira. He has provided me with good and reliable results in accordance with the predefined objectives. I thus recommend the work of Topographer Carlos Teixeira."]
  ];
  var LG = { en: "EN", pt: "PT", fr: "FR" };
  var SHOW = 9;
  var list = document.getElementById("rv-list"), more = document.getElementById("rv-more");
  if (!list) return;

  function data(d) { var p = d.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function el(nome, dia, lg, texto, i) {
    var a = document.createElement("article"); a.className = "rv";
    if (lg) a.lang = lg;
    var p = document.createElement("p"); p.textContent = texto;
    var f = document.createElement("footer");
    var b = document.createElement("b"); b.textContent = nome;
    var s = document.createElement("span"); s.textContent = data(dia);
    f.appendChild(b); f.appendChild(s);
    if (LG[lg]) { var t = document.createElement("span"); t.className = "lg"; t.textContent = LG[lg]; f.appendChild(t); }
    a.appendChild(p); a.appendChild(f);
    if (i >= SHOW) a.hidden = true;
    return a;
  }
  function render(rows) {
    rows.sort(function (a, b) { return a[1] < b[1] ? 1 : -1; });
    list.innerHTML = "";
    rows.forEach(function (r, i) { list.appendChild(el(r[0], r[1], r[2], r[3], i)); });
    more.textContent = "Ver todos os " + (rows.length + 1) + " comentários";
    more.hidden = rows.length <= SHOW;
  }
  render(BASE.slice());
  more.addEventListener("click", function () {
    list.querySelectorAll(".rv[hidden]").forEach(function (x) { x.hidden = false; });
    more.hidden = true;
  });

  var db = window.CATETO && window.CATETO.db();
  if (db) {
    db.from("comentarios").select("nome,texto,criado").eq("aprovado", true).then(function (r) {
      if (r.error || !r.data || !r.data.length) return;
      render(BASE.concat(r.data.map(function (c) { return [c.nome, c.criado.slice(0, 10), "", c.texto]; })));
    });
  }

  // formulário de comentário
  var form = document.getElementById("cform"), out = document.getElementById("c-out");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = form.nome.value.trim(), texto = form.texto.value.trim(), email = form.email.value.trim();
    out.className = "form-msg err";
    if (!nome) { out.textContent = "Escreva o seu nome."; form.nome.focus(); return; }
    if (texto.length < 10) { out.textContent = "Escreva o comentário (pelo menos 10 caracteres)."; form.texto.focus(); return; }
    if (!db) { out.textContent = "O envio de comentários ainda não está ligado. Envie-nos o comentário para ct@cateto.pt."; return; }
    out.className = "form-msg"; out.textContent = "A enviar…";
    db.from("comentarios").insert({ nome: nome, texto: texto, email: email || null }).then(function (r) {
      if (r.error) { out.className = "form-msg err"; out.textContent = "O comentário não foi enviado. Tente de novo ou escreva para ct@cateto.pt."; return; }
      form.reset();
      out.textContent = "Obrigado. O comentário vai ser publicado depois de lido.";
    });
  });

})();
