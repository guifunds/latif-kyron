/* Latif Home: catálogo, capítulos da apresentação e contato. */
/* ===== Contato ===== */
const CONTATO = { whatsapp: "5571999455157", exibicao: "(71) 99945-5157" };

/* ===== Produtos ===== */
const CARGA = [
 {id:"kyd30",group:"emp",img:"kyd30",tag:"Destaque",name:"Empilhadeira Diesel KYD25 · KYD30 · KYD35",ref:"Kyron · Combustão",sum:"2,5 a 3,5 t, mastro de 3,5 ou 4,8 m, motor Xinchai de 40 kW.",price:"A partir de R$ 100.000",hero:true,
  specs:[["Capacidade","2.500 / 3.000 / 3.500 kg"],["Elevação","3.500 / 4.800 mm"],["Centro de carga","500 mm"],["Motor","Xinchai 490BPG200 · 40 kW / 2.650 rpm"],["Torque máximo","160 N·m"],["Velocidade","15 km/h"],["Raio de giro","2.520 mm"],["Peso operacional","4.500 / 4.800 kg"]],
  prices:[["KYD30 3,5 m","R$ 100.000"],["KYD30 4,8 m","R$ 115.000"]]},
 {id:"kye30",group:"emp",img:"kye30",tag:"Lítio",name:"Empilhadeira Elétrica KYE30 · KYE35",ref:"Kyron · Lítio",sum:"3 a 3,5 t, mastro triplex full free de 4,8 m, recarga em até 2 h.",price:"A partir de R$ 150.000",
  specs:[["Capacidade","3.000 / 3.500 kg"],["Elevação","4.800 mm (triplex full free)"],["Bateria","Lítio 80 V · 280 / 404 Ah"],["Autonomia","cerca de 6 a 8,5 h"],["Recarga","1,5 a 2 h · carregador 80 V / 200 A"],["Garfo","1.220 mm"],["Inclusos","Deslocador lateral, painel LCD, alarme, LED"],["Dimensões (C×L×A)","2550 × 1250 × 2200 mm"],["Peso","3.300 kg"]],
  prices:[["KYE30 · 3,0 t","R$ 150.000"],["KYE35 · 3,5 t","R$ 180.000"]]},
 {id:"kyr30",group:"emp",img:"kyr30",tag:"12 metros",name:"Empilhadeira Retrátil KYR30",ref:"Kyron · Lítio",sum:"3 t a 12 m de altura, para corredores estreitos e porta-paletes altos.",price:"R$ 295.000",
  specs:[["Capacidade","3.000 kg"],["Elevação","12.000 mm (triplex full free)"],["Bateria","Lítio 48 V / 400 Ah"],["Carregador","Rápido 48 V / 200 A · cerca de 2 h"],["Autonomia","5,5 a 6 h"],["Direção e tração","EPS eletrônica · motor AC 5 kW"],["Garfos","1.070 mm"],["Inclusos","Deslocador lateral, câmera e display LCD"]],
  prices:[["KYR30","R$ 295.000"]]},
 {id:"kyp20",group:"emp",img:"kyp20",tag:"Lítio",name:"Empilhadeira Patolada KYP20",ref:"Kyron · Lítio / Triplex",sum:"2 t a 5,5 m, operação a pé com pedal e braço de comando.",price:"R$ 60.000",
  specs:[["Capacidade","2.000 kg"],["Elevação","5.500 mm (triplex)"],["Centro de carga","500 mm"],["Bateria","Lítio 48 V · 100 / 210 Ah"],["Carregador","30 A · 110–220 V"],["Uso / recarga","cerca de 6 h / 3,5 h"],["Garfo","1.150 mm · largura externa 685 mm"],["Rodagem","Pneus maciços em PU"]],
  prices:[["KYP20","R$ 60.000"]]},
 {id:"kyt30",group:"pal",img:"kyt30",tag:"Novo preço",name:"Transpaleteira Elétrica KYT30",ref:"Kyron · Lítio",sum:"3 t com plataforma para o operador, tração de 1,5 kW.",price:"A partir de R$ 49.990",
  specs:[["Capacidade","3.000 kg"],["Bateria","Lítio 24 V · 100 ou 210 Ah"],["Autonomia","5 a 7 h"],["Carregador","20 A / 50 A · recarga 4,5 / 3,5 h"],["Motores","Tração 1,5 kW · elevação 2,2 kW"],["Garfos","1.220 mm · largura 680 / 550 mm"],["Plataforma","Pedal para operador e braço de proteção"]],
  prices:[["KYT30 · 100 Ah","R$ 49.990"],["KYT30 · 210 Ah","R$ 59.990"]]},
 {id:"kype20",group:"pal",img:"kype20",tag:"Lítio",name:"Paleteira Elétrica KYPE20",ref:"Kyron · Lítio",sum:"2 t com elevação e descida elétricas, 6 h de autonomia.",price:"R$ 9.000",
  specs:[["Capacidade","2.000 kg"],["Bateria","Lítio 48 V / 32 Ah"],["Carregador","10 A · 110–220 V"],["Autonomia / recarga","6 h / 3,5 h"],["Velocidade","5 km/h"],["Largura do garfo","680 mm"],["Comprimento da alça","1.160 mm"],["Dimensões (A×C×L)","1260 × 1750 × 685 mm"]],
  prices:[["KYPE20","R$ 9.000"]]},
 {id:"kypm",group:"pal",img:"kypm",tag:"Manual",name:"Paleteira Manual KYPM20 · KYPM30",ref:"Kyron · Burrinha",sum:"2 ou 3 t, garfos 1150×550 ou 1220×685 mm.",price:"R$ 1.500",
  specs:[["Capacidade","2.000 ou 3.000 kg"],["Garfos","1150 × 550 mm ou 1220 × 685 mm"],["Elevação","mín. 80 mm · máx. 200 mm (120 mm de curso)"],["Roda direcional","180 × 50 mm"],["Rodas do garfo","80 × 93 mm"],["Peso","78 a 92 kg"],["Cor","Amarela"]],
  prices:[["KYPM20 · 2 t","R$ 1.500"],["KYPM30 · 3 t","R$ 1.500"]]},
 {id:"fd30",group:"emp",img:"fd30",tag:"Diesel",name:"Empilhadeira Diesel FD30",ref:"Dúnia Move",sum:"3 t com mastro de 3,0, 3,5 ou 4,8 m e motor Isuzu-Xinchai.",price:"Sob consulta",
  specs:[["Capacidade","3.000 kg"],["Elevação","3.000 / 3.500 / 4.800 mm"],["Centro de carga","500 mm"],["Garfos","1220 × 125 × 45 mm"],["Motor","Isuzu-Xinchai C240 / C490 · 35,4 a 40 kW"],["Velocidade","20 km/h com carga"],["Raio de giro","3.000 mm"],["Pneus","28×9-15 dianteiro · 6.50-10 traseiro"],["Peso operacional","4.250 kg"]],
  prices:[]}
];
const ALL = CARGA;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const ORDER = { emp: ["kyd30","kye30","kyr30","kyp20","fd30"], pal: ["kyt30","kype20","kypm"] };
function card(p){
  return `
    <button class="card${p.hero ? " feature" : ""}" data-id="${p.id}" aria-label="Ver ficha de ${esc(p.name)}">
      <div class="ph"><img src="assets/img/${p.img}.webp" alt="${esc(p.name)}" loading="lazy"></div>
      ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}
      <h3>${esc(p.name)}</h3>
      <span class="ref">${esc(p.ref)}</span>
      <p class="sum">${esc(p.sum)}</p>
      <div class="foot"><span class="pr">${esc(p.price)}</span><span class="more">Ficha ›</span></div>
    </button>`;
}
function renderGrid(){
  document.querySelectorAll(".grid[data-group]").forEach(g => {
    g.innerHTML = ORDER[g.dataset.group].map(id => card(CARGA.find(p => p.id === id))).join("");
  });
}

const dlg = $("#dlg");
document.getElementById("catalogo").addEventListener("click", e => {
  const c = e.target.closest(".card"); if (!c) return;
  const p = ALL.find(x => x.id === c.dataset.id);
  $("#dlg-body").innerHTML = `
    <div class="ph"><img src="assets/img/${p.img}.webp" alt="${esc(p.name)}"></div>
    <div>
      <span class="ref">${esc(p.ref)}</span>
      <h3>${esc(p.name)}</h3>
      <ul>${p.specs.map(([k,v]) => `<li><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join("")}</ul>
      ${p.prices && p.prices.length ? `<ul>${p.prices.map(([k,v]) => `<li><span>${esc(k)}</span><span><b>${esc(v)}</b></span></li>`).join("")}</ul>` : `<p class="pr">${esc(p.price)}</p>`}
      <div class="actions">
        <a class="btn btn-cta" href="#contato" data-produto="${esc(p.name)}">Pedir orçamento</a>
        ${p.hero ? `<a class="btn btn-ghost" href="#topo">Ver em 3D</a>` : ""}
      </div>
    </div>`;
  dlg.showModal();
});
$("#dlg-x").onclick = () => dlg.close();
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); if (e.target.closest("a")) dlg.close(); });

/* Formulário → mensagem de WhatsApp */
const sel = $("#f-produto");
sel.innerHTML = `<optgroup label="Empilhadeiras">${ORDER.emp.map(id=>`<option>${esc(CARGA.find(p=>p.id===id).name)}</option>`).join("")}</optgroup><optgroup label="Transpaleteiras e paleteiras">${ORDER.pal.map(id=>`<option>${esc(CARGA.find(p=>p.id===id).name)}</option>`).join("")}</optgroup>`;
document.addEventListener("click", e => {
  const a = e.target.closest("[data-produto]"); if (!a) return;
  const opt = [...sel.options].find(o => a.dataset.produto.startsWith(o.value.split(" ·")[0]) || o.value === a.dataset.produto);
  if (opt) sel.value = opt.value;
  update();
});
function message(){
  const n = $("#f-nome").value.trim(), em = $("#f-empresa").value.trim(), m = $("#f-msg").value.trim();
  return `Olá, Latif Home! ${n ? "Sou " + n + (em ? ", da " + em : "") + ". " : ""}Tenho interesse em: ${sel.value}.${m ? "\n" + m : ""}`;
}
function update(){
  const msg = message();
  $("#out").textContent = msg;
  const link = $("#wa-link");
  if (CONTATO.whatsapp) {
    link.href = `https://wa.me/${CONTATO.whatsapp}?text=${encodeURIComponent(msg)}`;
  } else {
    link.removeAttribute("target");
    link.href = "#contato";
    link.setAttribute("aria-disabled", "true");
    link.style.opacity = .5;
    link.title = "Número de WhatsApp ainda não configurado";
  }
}
["#f-nome","#f-empresa","#f-msg","#f-produto"].forEach(s => $(s).addEventListener("input", update));
$("#copy-btn").onclick = async () => {
  const b = $("#copy-btn");
  try { await navigator.clipboard.writeText(message()); b.textContent = "Copiada"; }
  catch { const r = document.createRange(); r.selectNodeContents($("#out")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Selecionada"; }
  setTimeout(() => b.textContent = "Copiar mensagem", 1800);
};
$("#form").addEventListener("submit", e => e.preventDefault());
renderGrid(); update();

/* ===== Capítulos do palco ===== */
window.CHAPTERS = [
 {nav:"Visão geral", eyebrow:"Kyron KYD30 · Diesel", title:"Força para 3 toneladas.", body:"Empilhadeira a diesel com mastro de até 4,8 m e motor Xinchai de 40 kW. Pronta entrega.", buy:true, h:1,
  cam:{p:[3.6,1.75,6.3],t:[-0.35,1.12,0]}, lift:0, hood:0},
 {nav:"Mastro", eyebrow:"Mastro duplex ou triplex", title:"Até 4,8 m de elevação.", body:"Escolha entre 3,5 m e 4,8 m. Três estágios de trilhos e cilindro central cromado levam a carga até o alto da prateleira.",
  cam:{p:[8.2,2.5,8.4],t:[0.15,2.25,0]}, lift:1, hood:0, pin:{obj:"stage3",off:[0.12,1.3,0.22],label:"Mastro triplex · 4,8 m"}},
 {nav:"Garfos", eyebrow:"Garfos e porta-garfos", title:"1220 × 122 × 50 mm.", body:"Centro de carga de 500 mm e grade de proteção integrada ao carro porta-garfos.",
  cam:{p:[4.6,1.6,3.8],t:[1.1,0.45,0]}, lift:0.08, hood:0, pin:{obj:"carriage",off:[1.9,0.08,0.31],label:"Garfo de 1.220 mm"}},
 {nav:"Motor", eyebrow:"Motor Xinchai 490BPG200", title:"40 kW a 2.650 rpm.", body:"Torque máximo de 160 N·m. O capô bascula junto com o banco e libera o acesso ao motor para manutenção.",
  cam:{p:[0.7,4.6,5.6],t:[-0.5,0.95,0]}, lift:0, hood:1, pin:{obj:"engine",off:[0,0.32,0.1],label:"Xinchai · 40 kW"}},
 {nav:"Cabine", eyebrow:"Posto do operador", title:"Aço sobre a cabeça.", body:"Protetor do operador em aço, banco com encosto e coluna de direção inclinada. Faróis de trabalho no teto.",
  cam:{p:[-4.6,3.9,4.6],t:[-0.25,1.45,0]}, lift:0, hood:0, pin:{obj:"roof",off:[0,0.05,0],label:"Protetor do operador"}},
 {nav:"Rodagem", eyebrow:"Direção e rodagem", title:"Gira em 2.520 mm.", body:"Raio de giro compacto para corredores apertados e deslocamento de até 15 km/h.",
  cam:{p:[2.9,0.8,3.9],t:[0.15,0.5,0.3]}, lift:0, hood:0, pin:{obj:"wheelFL",off:[0,0.1,0.13],label:"Tração dianteira"}},
 {nav:"Contrapeso", eyebrow:"Contrapeso traseiro", title:"4.500 kg de estabilidade.", body:"O peso operacional equilibra a carga no garfo. Lanternas traseiras e pino de reboque no para-choque.",
  cam:{p:[-6.6,2.3,-4.4],t:[-0.9,0.95,0]}, lift:0, hood:0, pin:{obj:"cw",off:[-1.72,1.12,-0.5],label:"Contrapeso traseiro"}},
 {nav:"Valores", eyebrow:"Pronta entrega", title:"A sua KYD30.", body:"Mastro 3,5 m por R$ 100.000. Mastro 4,8 m por R$ 115.000. Entrada de 20% e o restante em até 18x sem juros no cartão.", buy:true,
  cam:{p:[1.4,1.6,8.0],t:[-0.55,1.25,0]}, lift:0.25, hood:0}
];
(function(){
  const copy = $("#copy"), rail = $("#rail");
  document.getElementById("show").style.setProperty("--chapters", CHAPTERS.length + 1);
  CHAPTERS.forEach((c, i) => {
    const d = document.createElement("div");
    d.className = "chap"; d.dataset.i = i;
    const H = i === 0 ? "h1" : "h2";
    d.innerHTML = `<p class="eyebrow">${c.eyebrow}</p><${H}>${c.title}</${H}><p>${c.body}</p>` +
      (c.buy ? `<div class="buy"><span class="price">${i===0 ? "A partir de <b>R$ 100.000</b>" : "Em até <b>18x sem juros</b>"}</span><a class="btn btn-cta" href="#contato" data-produto="Empilhadeira Diesel KYD30">Pedir orçamento</a>${i===0?`<a href="#ficha">Ficha técnica ›</a>`:""}</div>` : "");
    copy.appendChild(d);
    if (c.pin) { const p = document.createElement("div"); p.className = "pin"; p.dataset.i = i; p.innerHTML = `<i></i><span>${c.pin.label}</span>`; copy.appendChild(p); }
    const li = document.createElement("li");
    li.innerHTML = `<button type="button" data-i="${i}">${c.nav}</button>`;
    rail.appendChild(li);
  });
  const show = $("#show");
  rail.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    const span = show.offsetHeight - innerHeight;
    scrollTo({ top: show.offsetTop + span * (+b.dataset.i) / (CHAPTERS.length - 1), behavior: "smooth" });
  });
  // Progresso da rolagem (0 .. N-1), compartilhado com o 3D
  window.getProgress = () => {
    const span = show.offsetHeight - innerHeight;
    const y = Math.min(Math.max(scrollY - show.offsetTop, 0), span);
    return span > 0 ? y / span * (CHAPTERS.length - 1) : 0;
  };
  const chaps = [...copy.querySelectorAll(".chap")], btns = [...rail.querySelectorAll("button")], hint = $("#hint");
  function onScroll(){
    const p = getProgress();
    chaps.forEach((el, i) => {
      const d = Math.abs(p - i);
      const o = Math.max(0, Math.min(1, 1 - (d - 0.18) / 0.3));
      el.style.opacity = o;
      el.style.transform = `translateY(${(p - i) * -40}px)`;
      el.classList.toggle("on", o > 0.5);
    });
    const cur = Math.round(p);
    btns.forEach((b, i) => b.classList.toggle("on", i === cur));
    hint.style.opacity = Math.max(0, 1 - p * 4);
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
})();
