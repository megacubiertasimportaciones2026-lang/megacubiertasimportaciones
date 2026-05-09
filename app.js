// ============================================================
// APP.JS v3.0
// ============================================================

document.addEventListener("DOMContentLoaded", init);

function init() {
  try {
    SITE_DATA = getSiteData();
    applyTheme(SITE_DATA.tema);
    applyData();
    renderProductSubmenu();
    renderProducts();
    renderAccesorios();
    renderVentajas();
    renderGaleria("todos");
    renderWhatsappNumbers();
    setupScrollEffects();
  } catch(e) {
    console.error("Error:", e);
    localStorage.removeItem("mc_data");
    localStorage.removeItem("mc_ver");
    location.reload();
  }
}

// ── TEMA ──────────────────────────────────────────────────────
function applyTheme(t) {
  if (!t) return;
  const s = document.documentElement.style;
  const set = (v,c) => { if(c) s.setProperty(v,c); };
  set("--gold",    t.colorPrimario);
  set("--gold-light", adjustColor(t.colorPrimario, 20));
  set("--gold-dark",  adjustColor(t.colorPrimario, -20));
  set("--orange",  t.colorSecundario);
  set("--dark",    t.colorFondo);
  set("--dark2",   t.colorFondo2);
  set("--dark3",   adjustColor(t.colorFondo2, -5));
  set("--white",   t.colorTexto);
  set("--teal",    t.colorAccent);
  if (t.fuente)        { loadFont(t.fuente); document.body.style.fontFamily = `'${t.fuente}',sans-serif`; }
  if (t.fuenteTitulos)   loadFont(t.fuenteTitulos);
}
function adjustColor(hex, pct) {
  if (!hex || hex.length < 7) return hex;
  try {
    let r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
    const f = (n) => Math.min(255,Math.max(0,n+Math.round(pct*2.55))).toString(16).padStart(2,'0');
    return `#${f(r)}${f(g)}${f(b)}`;
  } catch(e) { return hex; }
}
function loadFont(name) {
  const id = "gf-"+name.replace(/\s/g,"-");
  if (document.getElementById(id)) return;
  const l = document.createElement("link");
  l.id=id; l.rel="stylesheet";
  l.href=`https://fonts.googleapis.com/css2?family=${name.replace(/\s/g,"+")}:wght@400;600;700;900&display=swap`;
  document.head.appendChild(l);
}

// ── DATOS GENERALES ───────────────────────────────────────────
function applyData() {
  const d = SITE_DATA;
  // Hero
  el("heroBg") && (el("heroBg").style.backgroundImage = `url('${d.hero.bgImage || "portada.jpg"}')`);
  txt("heroBadge", d.hero.badge);
  html("heroTitle", d.hero.titulo);
  txt("heroDesc",   d.hero.descripcion);
  const st = d.hero.estadisticas || [];
  if(st[0]){ txt("stat1Num",st[0].valor); txt("stat1Label",st[0].etiqueta); }
  if(st[1]){ txt("stat2Num",st[1].valor); txt("stat2Label",st[1].etiqueta); }
  if(st[2]){ txt("stat3Num",st[2].valor); txt("stat3Label",st[2].etiqueta); }
  // Quienes
  if(el("quienesImg")) el("quienesImg").src = d.quienes.imagen || "portada.jpg";
  txt("quienesYears", d.quienes.anos);
  html("benefitsList", (d.quienes.beneficios||[]).map(b=>`<li><i class="fas fa-check-circle"></i> ${b}</li>`).join(""));
  // MV
  txt("misionText", d.misionVision.mision);
  txt("visionText",  d.misionVision.vision);
  // Contacto
  if(el("emailContact")){ el("emailContact").textContent=d.contacto.email; el("emailContact").href=`mailto:${d.contacto.email}`; }
  html("direccionText", d.contacto.direccion);
  txt("horarioLV",  d.contacto.horarioLV);
  txt("horarioSab", d.contacto.horarioSab);
  txt("horarioDom", d.contacto.horarioDom);
  if(el("mapsBtn"))   el("mapsBtn").href    = d.mapa.mapsLink;
  if(el("mapaFrame")) el("mapaFrame").src   = d.mapa.embedUrl;
  // Redes
  href("fbLink",d.redes.facebook); href("igLink",d.redes.instagram);
  href("ttLink",d.redes.tiktok);   href("ytLink",d.redes.youtube);
  href("fbFooter",d.redes.facebook); href("igFooter",d.redes.instagram); href("ttFooter",d.redes.tiktok);
  // Footer
  if(el("footerEmail")){ el("footerEmail").textContent=d.contacto.email; el("footerEmail").href=`mailto:${d.contacto.email}`; }
  txt("footerAddr", d.contacto.direccion.replace(/<br>/g," "));
  // Footer copyright editable
  const fcEl = el("footerCopyright");
  if(fcEl) fcEl.innerHTML = d.contacto.footerCopyright || '&copy; Desde 2019 &mdash; Megacubiertas Importaciones | Ambato, Ecuador';
  // Cotización editable
  txt("cotizacionTitulo", d.cotizacion && d.cotizacion.titulo ? d.cotizacion.titulo : "Solicita tu Cotización");
  txt("cotizacionSubtitulo", d.cotizacion && d.cotizacion.subtitulo ? d.cotizacion.subtitulo : "Respuesta en menos de 2 horas");
  html("footerPhones", (d.contacto.whatsappNumbers||[]).map(w=>`<li><i class="fab fa-whatsapp"></i> +${w.numero} (${w.etiqueta})</li>`).join(""));
}

const el  = (id) => document.getElementById(id);
const txt = (id,v) => { const e=el(id); if(e&&v!==undefined) e.textContent=v; };
const html= (id,v) => { const e=el(id); if(e&&v!==undefined) e.innerHTML=v; };
const href= (id,v) => { const e=el(id); if(e&&v) e.href=v; };

// Placeholder SVG para imágenes faltantes
function placeholder(nombre, color="#C9A84C") {
  const c = encodeURIComponent(nombre.slice(0,20));
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='220'%3E%3Crect width='400' height='220' fill='%231A1A1A'/%3E%3Crect x='1' y='1' width='398' height='218' fill='none' stroke='${encodeURIComponent(color)}' stroke-width='2'/%3E%3Ctext x='50%25' y='45%25' font-family='Arial' font-size='14' fill='${encodeURIComponent(color)}' text-anchor='middle' dominant-baseline='middle'%3E🏠%3C/text%3E%3Ctext x='50%25' y='62%25' font-family='Arial' font-size='12' fill='%23888' text-anchor='middle' dominant-baseline='middle'%3E${c}%3C/text%3E%3C/svg%3E`;
}

// ── PRODUCTOS ─────────────────────────────────────────────────
function getAllProductos() {
  // Returns ALL individual product items from categoriasProducto
  var cats = (SITE_DATA && SITE_DATA.categoriasProducto) ? SITE_DATA.categoriasProducto : [];
  var result = [];
  cats.forEach(function(cat) {
    (cat.items || []).forEach(function(item) {
      result.push(Object.assign({}, item, { _categoria: cat.nombre, _catIcono: cat.icono, _catId: cat.id }));
    });
  });
  return result;
}


function renderProducts(filtro) {
  var grid = el("productsGrid");
  if (!grid) return;

  var cats = (SITE_DATA && SITE_DATA.categoriasProducto) ? SITE_DATA.categoriasProducto : [];
  var f = filtro ? filtro.toLowerCase().trim() : "";
  var html = "";
  var shown = 0;

  cats.forEach(function(cat) {
    if (f && f !== "") {
      var catId     = (cat.id     || "").toLowerCase();
      var catNombre = (cat.nombre || "").toLowerCase();
      if (!catId.includes(f) && !catNombre.includes(f)) return;
    }

    var items = cat.items || [];
    var img   = cat.imagen || "";
    if (!img && items.length > 0 && items[0].imagen) img = items[0].imagen;

    var imgHtml = img
      ? "<img src='" + img + "' alt='" + cat.nombre + "' loading='lazy'/>"
      : "<img src='" + placeholder(cat.nombre) + "' alt='" + cat.nombre + "'/>";

    var catUrl = "categoria-prod.html?cat=" + encodeURIComponent(cat.id) + "&idx=" + cats.indexOf(cat);

    var itemsList = items.slice(0, 4).map(function(item) {
      return "<li><i class='fas fa-check'></i> " + item.nombre + "</li>";
    }).join("");
    if (items.length > 4) {
      itemsList += "<li><i class='fas fa-plus'></i> " + (items.length - 4) + " más...</li>";
    }
    if (items.length === 0) {
      itemsList = "<li style='color:var(--gray);font-style:italic'>Sin productos aún</li>";
    }

    html += "<div class='product-card' data-url='" + catUrl + "' onclick='window.location=this.dataset.url' style='cursor:pointer'>" +
      "<div class='product-img-wrap'>" + imgHtml + "</div>" +
      "<div class='product-info'>" +
        "<h3>" + cat.nombre + "</h3>" +
        "<ul>" + itemsList + "</ul>" +
        "<button class='btn-spec'>Ver productos <i class='fas fa-arrow-right'></i></button>" +
      "</div>" +
    "</div>";
    shown++;
  });

  if (shown === 0) {
    grid.innerHTML = "<p style='color:var(--gray);text-align:center;padding:40px;grid-column:1/-1'>No hay productos en esta categoría.</p>";
    return;
  }
  grid.innerHTML = html;
}


// ── FILTRO DE PRODUCTOS ────────────────────────────────────────
function renderProductSubmenu() {
  var menu = el("productosSubmenu");
  if (!menu) return;

  // Build tabs from categoriasProducto (one tab per category + "Todos")
  var prodCats = (SITE_DATA.categoriasProducto && SITE_DATA.categoriasProducto.length > 0)
    ? SITE_DATA.categoriasProducto : [];

  var html = '<button class="prod-tab active" data-filtro="" onclick="filterProducts(\'\',this)">' +
    '<i class="fas fa-th-large"></i> Todos</button>';

  for (var i = 0; i < prodCats.length; i++) {
    var cat = prodCats[i];
    html += '<button class="prod-tab" data-filtro="' + (cat.id||"") + '" onclick="filterProducts(this.dataset.filtro,this)">' +
      '<i class="' + (cat.icono || "fas fa-circle") + '"></i> ' + cat.nombre +
      '</button>';
  }
  menu.innerHTML = html;
}

function filterProducts(filtro, btn) {
  document.querySelectorAll(".prod-tab").forEach(function(b) { b.classList.remove("active"); });
  if (btn) btn.classList.add("active");
  renderProducts(filtro);
}


// ── ACCESORIOS ────────────────────────────────────────────────
function renderAccesorios() {
  var grid = el("accesoriosGrid");
  if (!grid) return;
  var cats = (SITE_DATA && SITE_DATA.accesorios) ? SITE_DATA.accesorios : [];
  if (cats.length === 0) { grid.innerHTML = ""; return; }
  var html = "";
  for (var i = 0; i < cats.length; i++) {
    var cat = cats[i];
    var count = (cat.items || []).length;
    var catId = encodeURIComponent(cat.id || String(i));
    var url = "categoria.html?cat=" + catId + "&idx=" + i;
    var imgPart;
    if (cat.imagen) {
      imgPart = "<div class=\"acc-img-wrap\"><img src=\"" + cat.imagen + "\" alt=\"" + cat.nombre + "\" style=\"width:100%;height:100%;object-fit:cover\"/></div>";
    } else {
      imgPart = "<div class=\"acc-icon\"><i class=\"" + (cat.icono || "fas fa-cube") + "\"></i></div>";
    }
    var label = cat.nombre || "";
    var badge = count + " item" + (count !== 1 ? "s" : "");
    var card = "<div class=\"accesorio-item\" onclick=\"window.location='" + url + "'\" style=\"cursor:pointer\">" +
      imgPart +
      "<span>" + label + "</span>" +
      "<small style=\"color:var(--gold);font-size:11px;margin-top:2px\"><i class=\"fas fa-tags\"></i> " + badge + "</small>" +
      "</div>";
    html += card;
  }
  grid.innerHTML = html;
}

function renderVentajas() {
  const grid = el("ventajasGrid"); if(!grid) return;
  const vents = SITE_DATA.ventajas || [];
  grid.innerHTML = vents.map(v=>`
    <div class="ventaja-card">
      <div class="ventaja-icon"><i class="${v.icono||'fas fa-star'}"></i></div>
      <h3>${v.titulo}</h3>
      <p>${v.descripcion}</p>
    </div>`).join("");
}

// ── GALERÍA ───────────────────────────────────────────────────
function filterGaleria(ev, cat) {
  document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
  ev.target.classList.add("active");
  renderGaleria(cat);
}
function renderGaleria(cat) {
  const grid = el("galeriaGrid"); if(!grid) return;
  const all = SITE_DATA.galeria || [];
  const items = cat==="todos" ? all : all.filter(g=>g.categoria===cat);
  grid.innerHTML = items.map(g => {
    const img = g.imagen || placeholder(g.titulo, "#C9A84C");
    return `<div class="galeria-item">
      <img src="${img}" alt="${g.titulo}" loading="lazy" onerror="this.src='${placeholder(g.titulo)}'"/>
      <div class="galeria-overlay">
        <span class="galeria-cat">${g.categoria.charAt(0).toUpperCase()+g.categoria.slice(1)}</span>
        <h4>${g.titulo}</h4>
        <p><i class="fas fa-map-marker-alt"></i> ${g.ubicacion}</p>
      </div>
    </div>`;
  }).join("");
}

// ── WHATSAPP ──────────────────────────────────────────────────
function renderWhatsappNumbers() {
  const cont = el("whatsappNumbers"); if(!cont) return;
  cont.innerHTML = (SITE_DATA.contacto.whatsappNumbers||[]).map(w=>`
    <div class="contact-item">
      <i class="fab fa-whatsapp green"></i>
      <div>
        <span class="contact-label">${w.etiqueta}</span>
        <a href="https://wa.me/${w.numero}?text=${encodeURIComponent(SITE_DATA.contacto.mensajeBienvenida)}" target="_blank">+${w.numero}</a>
      </div>
    </div>`).join("");
}
function openWhatsApp() {
  const first=(SITE_DATA.contacto.whatsappNumbers||[])[0]; if(!first) return;
  window.open(`https://wa.me/${first.numero}?text=${encodeURIComponent(SITE_DATA.contacto.mensajeBienvenida)}`,"_blank");
}
function enviarCotizacion(e) {
  e.preventDefault(); const f=e.target;
  const t=`🏠 *Nueva Cotización - Megacubiertas*\n\n👤 ${f[0].value}\n📧 ${f[1].value}\n📱 ${f[2].value}\n🏗️ ${f[3].value}\n📝 ${f[4].value}`;
  const first=(SITE_DATA.contacto.whatsappNumbers||[])[0]; if(!first) return;
  window.open(`https://wa.me/${first.numero}?text=${encodeURIComponent(t)}`,"_blank");
}
function contactProduct(nombre) {
  const prod = getAllProductos().find(function(p){ return p.nombre===nombre; });
  if(prod) { window.location.href='detalle.html?tipo=producto&id='+encodeURIComponent(prod.id); }
  else {
    const msg=`Hola! Me interesa: ${nombre}. ¿Pueden ayudarme?`;
    const first=(SITE_DATA.contacto.whatsappNumbers||[])[0]; if(!first) return;
    window.open(`https://wa.me/${first.numero}?text=${encodeURIComponent(msg)}`,"_blank");
  }
}
function countChars(){ txt("charCount", el("msgArea").value.length); }
function setupScrollEffects(){
  window.addEventListener("scroll",()=>{ el("navbar")&&el("navbar").classList.toggle("scrolled",window.scrollY>60); });
}
function switchCardImg(thumb, mainId) {
  var main = document.getElementById(mainId);
  if (main && thumb.src) main.src = thumb.src;
  var strip = thumb.parentElement;
  if (strip) strip.querySelectorAll("img").forEach(function(i){ i.classList.remove("active"); });
  thumb.classList.add("active");
}

function irACategoria(catId, idx) {
  window.location = 'categoria.html?cat=' + encodeURIComponent(catId) + '&idx=' + idx;
}

function toggleMenu(){ el("navLinks")&&el("navLinks").classList.toggle("open"); }
