// ============================================================
// ADMIN.JS — Panel de Administración con sync en tiempo real
// ============================================================

window.__IS_ADMIN__ = true; // evitar auto-reload en esta pestaña

let currentData;
let selectedBadgeColor = "orange";
let editingProductId = null;
let editingGaleriaId = null;
let editingVentajaId = null;
let editingAccId = null;

document.addEventListener("DOMContentLoaded", () => {
  try {
    currentData = getSiteData();
    // Validar que los datos son correctos antes de renderizar
    if (!currentData || !Array.isArray(currentData.productos)) {
      console.warn("Datos inválidos en admin, usando defaults");
      currentData = JSON.parse(JSON.stringify(SITE_DATA_DEFAULT));
    }
    renderAll();
    loadContentFields();
    loadMVFields();
    loadTemaFields();
  } catch(e) {
    console.error("Error iniciando admin:", e);
    // Reset total y reintentar
    ["mc_data","mc_ver","mc_ts"].forEach(k=>localStorage.removeItem(k));
    currentData = JSON.parse(JSON.stringify(SITE_DATA_DEFAULT));
    try { renderAll(); loadContentFields(); loadMVFields(); loadTemaFields(); } catch(e2){}
  }
});

function renderAll() {
  renderProductsAdmin();
  renderGaleriaAdmin();
  renderVentajasAdmin();
  renderAccesoriosAdmin();
  renderProdCatsAdmin();
  renderCatalogoAdmin();
}

// ── PERSIST ──────────────────────────────────────────────────
function persist() {
  saveSiteData(currentData);
  SITE_DATA = currentData;
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg, isError = false) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show" + (isError ? " error" : "");
  setTimeout(() => t.className = "toast", 3200);
}


// ── PREVIEW IMAGEN POR URL ────────────────────────────────────
function previewUrlImg(url, previewId) {
  const img = document.getElementById(previewId);
  if (!img) return;
  if (url && url.startsWith("http")) {
    img.src = url;
    img.style.display = "block";
    img.onerror = () => { img.style.display = "none"; };
  } else {
    img.style.display = "none";
  }
}

function previewFotosUrls(text, previewId) {
  const cont = document.getElementById(previewId);
  if (!cont) return;
  const urls = text.split("\n").map(u => u.trim()).filter(u => u.startsWith("http"));
  cont.innerHTML = urls.map(u =>
    `<img src="${u}" style="width:72px;height:52px;object-fit:cover;border-radius:6px;border:1px solid rgba(201,168,76,0.3)" onerror="this.style.display='none'"/>`
  ).join("");
}

// ── TABS ─────────────────────────────────────────────────────
function showMainTab(tab) {
  document.querySelectorAll(".admin-section").forEach(s => s.classList.add("hidden"));
  document.querySelectorAll(".tab-main").forEach(b => b.classList.remove("active"));
  document.getElementById("tab-" + tab).classList.remove("hidden");
  event.target.classList.add("active");
  if (tab === "catalogo") renderCatalogoAdmin();
}

function showContentTab(tab) {
  document.querySelectorAll(".ctab-content").forEach(c => c.classList.add("hidden"));
  document.querySelectorAll(".ctab").forEach(b => b.classList.remove("active"));
  document.getElementById("ctab-" + tab).classList.remove("hidden");
  event.target.classList.add("active");
}

// ── HELPERS ──────────────────────────────────────────────────
function setVal(id, val) { const el = document.getElementById(id); if (el) el.value = val || ""; }
function getVal(id) { const el = document.getElementById(id); return el ? el.value : ""; }

// ── CARGAR IMAGEN DESDE PC (base64) ──────────────────────────
function setupImageUpload(dropZoneId, inputId, previewId, onResult) {
  const dropZone = document.getElementById(dropZoneId);
  const fileInput = document.getElementById(inputId);
  if (!dropZone || !fileInput) return;

  dropZone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

  dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("drag-over"); });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    handleFile(e.dataTransfer.files[0]);
  });

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) { showToast("Solo imágenes (JPG, PNG, WebP)", true); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("Imagen muy grande (máx 5MB)", true); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const preview = document.getElementById(previewId);
      if (preview) { preview.src = base64; preview.style.display = "block"; }
      onResult(base64);
    };
    reader.readAsDataURL(file);
  }
}

// ── CONTENT FIELDS ───────────────────────────────────────────
function loadContentFields() {
  const d = currentData;
  const wa = d.contacto.whatsappNumbers;
  if (wa[0]) { setVal("wa1", wa[0].numero); setVal("wa1Label", wa[0].etiqueta); }
  if (wa[1]) { setVal("wa2", wa[1].numero); setVal("wa2Label", wa[1].etiqueta); }
  if (wa[2]) { setVal("wa3", wa[2].numero); setVal("wa3Label", wa[2].etiqueta); }
  setVal("emailField", d.contacto.email);
  setVal("horLV", d.contacto.horarioLV);
  setVal("horSab", d.contacto.horarioSab);
  setVal("horDom", d.contacto.horarioDom);
  setVal("dirField", d.contacto.direccion.replace(/<br>/g, "\n"));
  setVal("waMsgField", d.contacto.mensajeBienvenida);
  setVal("fbUrl", d.redes.facebook);
  setVal("igUrl", d.redes.instagram);
  setVal("ttUrl", d.redes.tiktok);
  setVal("ytUrl", d.redes.youtube);
  setVal("heroBadgeF", d.hero.badge);
  setVal("heroTitleF", d.hero.titulo.replace(/<br>/g, "\n"));
  setVal("heroDescF", d.hero.descripcion);
  if (d.hero.estadisticas[0]) { setVal("stat1V", d.hero.estadisticas[0].valor); setVal("stat1L", d.hero.estadisticas[0].etiqueta); }
  if (d.hero.estadisticas[1]) { setVal("stat2V", d.hero.estadisticas[1].valor); setVal("stat2L", d.hero.estadisticas[1].etiqueta); }
  if (d.hero.estadisticas[2]) { setVal("stat3V", d.hero.estadisticas[2].valor); setVal("stat3L", d.hero.estadisticas[2].etiqueta); }
  // mostrar preview portada actual
  const heroBgUrlInput = document.getElementById("heroBgUrlInput");
  if (heroBgUrlInput && d.hero.bgImage && d.hero.bgImage.startsWith("http")) {
    heroBgUrlInput.value = d.hero.bgImage;
    previewUrlImg(d.hero.bgImage, "heroBgPreview");
  }
  const heroPrev = document.getElementById("heroBgPreview");
  if (heroPrev && d.hero.bgImage && !d.hero.bgImage.startsWith("http")) { heroPrev.src = d.hero.bgImage; heroPrev.style.display = "block"; }
  setVal("quienesImgUrlInput", d.quienes.imagen);
  // preview quienes
  const qPrev = document.getElementById("quienesImgPreview");
  if (qPrev && d.quienes.imagen) { qPrev.src = d.quienes.imagen; qPrev.style.display = "block"; }
  setVal("quienesAnosF", d.quienes.anos);
  setVal("beneficiosF", d.quienes.beneficios.join("\n"));
  setVal("mapaEmbedUrl", d.mapa.embedUrl);
  setVal("mapaDirectLink", d.mapa.mapsLink);

  // Setup image uploads
  setupImageUpload("heroDropZone", "heroBgFile", "heroBgPreview", (b64) => {
    currentData.hero.bgImage = b64;
  });
  setupImageUpload("quienesDropZone", "quienesImgFile", "quienesImgPreview", (b64) => {
    currentData.quienes.imagen = b64;
    setVal("quienesImgUrlInput", "");
  });
}

function saveChanges() {
  const d = currentData;
  d.contacto.whatsappNumbers = [];
  [[getVal("wa1"), getVal("wa1Label")], [getVal("wa2"), getVal("wa2Label")], [getVal("wa3"), getVal("wa3Label")]].forEach(([n, l]) => {
    if (n.trim()) d.contacto.whatsappNumbers.push({ numero: n.trim(), etiqueta: l.trim() || "WhatsApp" });
  });
  d.contacto.email = getVal("emailField");
  d.contacto.horarioLV = getVal("horLV");
  d.contacto.horarioSab = getVal("horSab");
  d.contacto.horarioDom = getVal("horDom");
  d.contacto.direccion = getVal("dirField").replace(/\n/g, "<br>");
  d.contacto.mensajeBienvenida = getVal("waMsgField");
  d.redes = { facebook: getVal("fbUrl"), instagram: getVal("igUrl"), tiktok: getVal("ttUrl"), youtube: getVal("ytUrl") };
  d.hero.badge = getVal("heroBadgeF");
  d.hero.titulo = getVal("heroTitleF").replace(/\n/g, "<br>");
  d.hero.descripcion = getVal("heroDescF");
  d.hero.estadisticas = [
    { valor: getVal("stat1V"), etiqueta: getVal("stat1L") },
    { valor: getVal("stat2V"), etiqueta: getVal("stat2L") },
    { valor: getVal("stat3V"), etiqueta: getVal("stat3L") }
  ];
  // URL portada hero
  const heroBgUrl = getVal("heroBgUrlInput");
  if (heroBgUrl) d.hero.bgImage = heroBgUrl;
  // URL quiénes somos
  const qUrl = getVal("quienesImgUrlInput");
  if (qUrl) d.quienes.imagen = qUrl;
  d.quienes.anos = getVal("quienesAnosF");
  d.quienes.beneficios = getVal("beneficiosF").split("\n").filter(b => b.trim());
  d.mapa.embedUrl = getVal("mapaEmbedUrl");
  d.mapa.mapsLink = getVal("mapaDirectLink");

  persist();
  showToast("✅ Cambios guardados — la página se actualizó");
}

function restoreDefaults() {
  if (!confirm("¿Restaurar todos los valores por defecto?")) return;
  localStorage.removeItem("mc_data");
  localStorage.removeItem("mc_ts");
  currentData = JSON.parse(JSON.stringify(SITE_DATA_DEFAULT));
  loadContentFields(); loadMVFields(); renderAll();
  showToast("Valores restaurados");
}

function testMap() {
  const url = getVal("mapaEmbedUrl");
  const wrap = document.getElementById("mapaTestWrap");
  const frame = document.getElementById("mapaTestFrame");
  wrap.style.display = "block"; frame.src = url;
}

// ── PRODUCTOS ────────────────────────────────────────────────
function renderProductsAdmin() {
  var countEl = document.getElementById("productCount");
  var grid    = document.getElementById("productsAdminGrid");
  if (!grid) return;
  var cats = (currentData.categoriasProducto && currentData.categoriasProducto.length > 0)
    ? currentData.categoriasProducto
    : [];
  // Legacy: if no categories yet, show migration prompt
  if (cats.length === 0) {
    if (countEl) countEl.textContent = "Sin categorías de productos";
    grid.innerHTML = "<div style='background:rgba(201,168,76,0.08);border:1px dashed var(--gold);border-radius:14px;padding:28px;text-align:center;color:var(--gray)'>" +
      "<i class='fas fa-info-circle' style='color:var(--gold);font-size:24px;margin-bottom:10px;display:block'></i>" +
      "<p style='margin-bottom:14px'>Aún no tienes categorías de productos creadas.</p>" +
      "<button class='btn-add' onclick='openProdCategoriaModal()'><i class='fas fa-plus'></i> Crear primera categoría</button>" +
    "</div>";
    return;
  }
  // Count total items
  var totalItems = 0;
  cats.forEach(function(c){ totalItems += (c.items||[]).length; });
  if (countEl) countEl.textContent = cats.length + " categorías · " + totalItems + " producto(s)";

  var html = "";
  for (var ci = 0; ci < cats.length; ci++) {
    var cat = cats[ci];
    var items = cat.items || [];
    var iconHtml = cat.imagen
      ? "<img src='" + cat.imagen + "' class='cat-admin-img' alt='" + cat.nombre + "'/>"
      : "<div class='cat-admin-icon'><i class='" + (cat.icono||"fas fa-box") + "'></i></div>";

    var itemsHtml = "";
    for (var ii = 0; ii < items.length; ii++) {
      var item = items[ii];
      var ithumb = item.imagen
        ? "<img src='" + item.imagen + "' class='ci-thumb'/>"
        : "<div class='ci-thumb ci-icon'><i class='" + (cat.icono||"fas fa-box") + "'></i></div>";
      var meta = (item.caracteristicas||[]).length + " caract · " +
                 (item.fotos||[]).length + " fotos · " +
                 (item.colores||[]).length + " colores";
      itemsHtml += "<div class='cat-item-row'>" +
        ithumb +
        "<div style='flex:1;min-width:0'>" +
          "<span class='ci-name'>" + item.nombre + "</span>" +
          "<span style='font-size:11px;color:var(--gray);display:block;margin-top:2px'>" + meta + "</span>" +
        "</div>" +
        "<div class='ci-actions'>" +
          "<button class='btn-edit' onclick='editProdItem(" + ci + "," + ii + ")' title='Editar'><i class='fas fa-edit'></i></button>" +
          "<button class='btn-edit' onclick='toggleProdItemSub(" + ci + "," + ii + ")' title='Fotos/Colores/Ficha' style='background:rgba(66,165,245,0.1);border-color:#42A5F5;color:#42A5F5'><i class='fas fa-layer-group'></i></button>" +
          "<button class='btn-delete' onclick='deleteProdItem(" + ci + "," + ii + ")' title='Eliminar'><i class='fas fa-trash'></i></button>" +
        "</div>" +
      "</div>" +
      // Expandable submenu for this item
      "<div class='pac-submenu hidden' id='pisub-" + ci + "-" + ii + "'>" +
        buildProdItemSubHTML(ci, ii, item) +
      "</div>";
    }

    // Meta info for category: sum up all items stats
    var totalCaract = 0, totalFotos = 0, totalColores = 0;
    items.forEach(function(it){
      totalCaract  += (it.caracteristicas||[]).length;
      totalFotos   += (it.fotos||[]).length;
      totalColores += (it.colores||[]).length;
    });
    var catMeta = items.length + " producto(s)";
    if(totalCaract > 0)  catMeta += " · " + totalCaract + " caract";
    if(totalFotos  > 0)  catMeta += " · " + totalFotos  + " fotos";
    if(totalColores > 0) catMeta += " · " + totalColores + " colores";

    html += "<div class='cat-admin-card'>" +
      // Category header
      "<div class='cat-admin-head'>" +
        iconHtml +
        "<div class='cat-admin-info'>" +
          "<h3>" + cat.nombre + "</h3>" +
          "<span style='font-size:11px;color:var(--gray)'>" + catMeta + "</span>" +
        "</div>" +
        "<div class='cat-admin-btns'>" +
          "<button class='btn-edit' onclick='editProdCategoria(" + ci + ")' title='Editar categoría'><i class='fas fa-edit'></i></button>" +
          // ── Blue button: expands/collapses all items with their sub-menus ──
          "<button class='btn-edit' " +
            "onclick='toggleCatItems(" + ci + ")' " +
            "title='Ver productos / Fotos · Colores · Ficha' " +
            "id='catToggleBtn-" + ci + "' " +
            "style='background:rgba(66,165,245,0.12);border-color:#42A5F5;color:#42A5F5'>" +
            "<i class='fas fa-layer-group'></i>" +
          "</button>" +
          "<button class='btn-delete' onclick='deleteProdCategoria(" + ci + ")' title='Eliminar'><i class='fas fa-trash'></i></button>" +
        "</div>" +
      "</div>" +
      // Items list (collapsible)
      "<div class='cat-items-list' id='catItemsList-" + ci + "'>" +
        itemsHtml +
        "<button class='btn-add-item' onclick='openProdItemModal(" + ci + ")'>" +
          "<i class='fas fa-plus'></i> Agregar producto a " + cat.nombre +
        "</button>" +
      "</div>" +
    "</div>";
  }
  grid.innerHTML = html;
}


// ── TOGGLE CATEGORY ITEMS VISIBILITY ─────────────────────────
function toggleCatItems(ci) {
  var listEl = document.getElementById("catItemsList-" + ci);
  var btnEl  = document.getElementById("catToggleBtn-" + ci);
  if(!listEl) return;

  var isVisible = listEl.style.display !== "none";

  // Close all first
  document.querySelectorAll("[id^='catItemsList-']").forEach(function(el){
    el.style.display = "none";
  });
  document.querySelectorAll("[id^='catToggleBtn-']").forEach(function(b){
    b.style.background = "rgba(66,165,245,0.12)";
    b.style.borderColor = "#42A5F5";
    b.style.boxShadow = "none";
  });
  // Close all pi submenus
  document.querySelectorAll(".pac-submenu").forEach(function(s){
    s.classList.add("hidden");
  });

  if(isVisible) {
    // was visible → keep hidden (toggled off)
  } else {
    // was hidden → show this one
    listEl.style.display = "block";
    if(btnEl){
      btnEl.style.background = "rgba(66,165,245,0.25)";
      btnEl.style.borderColor = "#42A5F5";
      btnEl.style.boxShadow = "0 0 0 3px rgba(66,165,245,0.2)";
    }
  }
}

function buildProdItemSubHTML(ci, ii, item) {
  var fotos  = (item.fotos && item.fotos.length > 0) ? item.fotos : (item.imagen ? [item.imagen] : []);
  var colores = item.colores || [];
  var ficha   = item.ficha   || [];
  var caract  = item.caracteristicas || [];

  // ── Fotos HTML ──
  var fotosHtml = fotos.length > 0
    ? fotos.map(function(f,fi){
        return "<div style='position:relative;display:inline-block;margin:4px'>" +
          "<img src='"+f+"' style='width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid var(--border)'/>" +
          "<button onclick='removePIFoto("+ci+","+ii+","+fi+")' style='position:absolute;top:-6px;right:-6px;background:#E84040;border:none;color:#fff;width:18px;height:18px;border-radius:50%;font-size:10px;cursor:pointer;line-height:18px;text-align:center'>×</button>" +
        "</div>";
      }).join("")
    : "<p style='color:#888;font-size:12px;padding:4px'>Sin fotos aún</p>";

  // ── Características HTML ──
  var caractHtml = caract.length === 0
    ? "<p style='color:#888;font-size:12px;padding:4px'>Sin características. Agrega la primera.</p>"
    : "<div style='display:flex;flex-direction:column;gap:5px'>" +
        caract.map(function(c,cii){
          return "<div class='cat-item-row'>" +
            "<i class='fas fa-check' style='color:var(--gold);font-size:11px'></i>" +
            "<span class='ci-name'>"+c+"</span>" +
            "<button onclick='removePICaract("+ci+","+ii+","+cii+")' class='btn-delete' style='padding:3px 8px'><i class='fas fa-trash'></i></button>" +
            "</div>";
        }).join("") + "</div>";

  // ── Colores actuales HTML ──
  var colListHtml = colores.length === 0
    ? "<p style='color:#888;font-size:12px'>Sin colores. Usa la paleta o agrega uno personalizado.</p>"
    : colores.map(function(c,ki){
        return "<div style='display:inline-flex;align-items:center;gap:6px;padding:5px 10px 5px 6px;background:var(--dark3);border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--white);margin:3px'>" +
          "<span style='width:22px;height:22px;border-radius:50%;background:"+(c.hex||"#888")+";display:inline-block;border:2px solid rgba(255,255,255,0.2);flex-shrink:0'></span>" +
          "<span>"+c.nombre+"</span>" +
          "<button onclick='removePIColor("+ci+","+ii+","+ki+")' style='background:none;border:none;color:#E84040;cursor:pointer;font-size:15px;line-height:1;padding:0;margin-left:2px'>×</button>" +
        "</div>";
      }).join("");

  // ── Preset color palette ──
  var PRESETS = [
    {n:"Rojo Teja",h:"#8B2500"},{n:"Terracota",h:"#C0392B"},{n:"Granate",h:"#7B241C"},
    {n:"Verde Selva",h:"#1E8449"},{n:"Verde Pino",h:"#2D5A1B"},{n:"Verde",h:"#27AE60"},
    {n:"Blanco",h:"#F5F5F5"},{n:"Gris",h:"#888888"},{n:"Gris Oscuro",h:"#444444"},
    {n:"Negro",h:"#1A1A1A"},{n:"Azul",h:"#1565C0"},{n:"Celeste",h:"#2196F3"},
    {n:"Café",h:"#6D4C41"},{n:"Teja",h:"#B5651D"},{n:"Naranja",h:"#E65100"},
    {n:"Beige",h:"#D7C4A0"},{n:"Madera",h:"#A0845C"},{n:"Amarillo",h:"#F9A825"}
  ];
  var paletteHtml = PRESETS.map(function(col){
    return "<div " +
      "onclick='piQuickColor("+ci+","+ii+",\""+col.n+"\",\""+col.h+"\")' " +
      "title='"+col.n+"' " +
      "style='width:30px;height:30px;border-radius:50%;background:"+col.h+";cursor:pointer;" +
             "border:3px solid rgba(255,255,255,0.12);transition:transform 0.15s,border-color 0.15s;" +
             "box-shadow:0 2px 6px rgba(0,0,0,0.4);flex-shrink:0' " +
      "onmouseover=\"this.style.transform='scale(1.3)';this.style.borderColor='rgba(255,255,255,0.8)'\" " +
      "onmouseout=\"this.style.transform='scale(1)';this.style.borderColor='rgba(255,255,255,0.12)'\">" +
    "</div>";
  }).join("");

  // ── Ficha HTML ──
  var fichaListHtml = ficha.length === 0
    ? "<p style='color:#888;font-size:12px;padding:4px'>Sin ficha técnica aún.</p>"
    : "<table style='width:100%;border-collapse:collapse;font-size:12px'>" +
        ficha.map(function(r,fi){
          return "<tr style='border-bottom:1px solid var(--border)'>" +
            "<td style='padding:6px 10px;color:var(--gold);font-weight:600;width:42%'>"+r[0]+"</td>" +
            "<td style='padding:6px 10px;color:var(--white)'>"+r[1]+"</td>" +
            "<td style='text-align:right;padding:6px'>" +
              "<button onclick='removePIFicha("+ci+","+ii+","+fi+")' style='background:none;border:none;color:#E84040;cursor:pointer;font-size:13px'>×</button>" +
            "</td></tr>";
        }).join("") + "</table>";

  return (
    // ── Tabs bar ──
    "<div class='pac-sub-tabs'>" +
      "<button class='pst active' onclick='showPITab("+ci+","+ii+",\"caract\",this)'><i class='fas fa-check-circle'></i> Características</button>" +
      "<button class='pst' onclick='showPITab("+ci+","+ii+",\"fotos\",this)'><i class='fas fa-images'></i> Fotos</button>" +
      "<button class='pst' onclick='showPITab("+ci+","+ii+",\"colores\",this)'><i class='fas fa-palette'></i> Colores</button>" +
      "<button class='pst' onclick='showPITab("+ci+","+ii+",\"ficha\",this)'><i class='fas fa-file-alt'></i> Ficha Técnica</button>" +
    "</div>" +

    // ── Tab: Características ──
    "<div class='pst-content active' id='pit-caract-"+ci+"-"+ii+"'>" +
      "<div id='pi-caract-list-"+ci+"-"+ii+"' style='margin-bottom:10px'>"+caractHtml+"</div>" +
      "<div style='display:flex;gap:8px;margin-top:4px'>" +
        "<input type='text' id='pi-caract-inp-"+ci+"-"+ii+"' placeholder='Nueva característica...' class='psc-input' style='flex:1' " +
          "onkeydown='if(event.key===\"Enter\"){event.preventDefault();addPICaract("+ci+","+ii+");}'/>" +
        "<button class='btn-add' style='padding:8px 12px;font-size:12px' onclick='addPICaract("+ci+","+ii+")'><i class='fas fa-plus'></i></button>" +
      "</div>" +
    "</div>" +

    // ── Tab: Fotos ──
    "<div class='pst-content' id='pit-fotos-"+ci+"-"+ii+"'>" +
      "<div class='pi-fotos-wrap' style='display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px'>"+fotosHtml+"</div>" +
      "<div class='drop-zone' style='padding:12px' onclick='document.getElementById(\"pi-foto-"+ci+"-"+ii+"\").click()'>" +
        "<i class='fas fa-cloud-upload-alt drop-icon' style='font-size:22px'></i>" +
        "<p style='font-size:12px;margin-top:4px'>Arrastra o haz clic para agregar fotos</p>" +
        "<input type='file' id='pi-foto-"+ci+"-"+ii+"' accept='image/*' multiple style='display:none' onchange='addPIFotos("+ci+","+ii+",this)'/>" +
      "</div>" +
    "</div>" +

    // ── Tab: Colores ──
    "<div class='pst-content' id='pit-colores-"+ci+"-"+ii+"'>" +
      // Current colors list
      "<div id='pi-colores-list-"+ci+"-"+ii+"' style='display:flex;flex-wrap:wrap;gap:4px;margin-bottom:14px;min-height:28px'>"+colListHtml+"</div>" +
      // Preset palette
      "<div style='margin-bottom:12px;padding:12px;background:rgba(0,0,0,0.2);border-radius:10px;border:1px solid var(--border)'>" +
        "<p style='font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px'>" +
          "<i class='fas fa-magic' style='color:var(--gold);margin-right:4px'></i>Clic rápido para agregar:</p>" +
        "<div style='display:flex;flex-wrap:wrap;gap:8px'>"+paletteHtml+"</div>" +
      "</div>" +
      // Custom color input
      "<div style='display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px;background:rgba(201,168,76,0.05);border:1px solid rgba(201,168,76,0.2);border-radius:10px'>" +
        "<i class='fas fa-palette' style='color:var(--gold);font-size:14px'></i>" +
        "<input type='text' id='pi-col-nom-"+ci+"-"+ii+"' placeholder='Nombre del color' class='psc-input' style='flex:1;min-width:100px' " +
          "onkeydown='if(event.key===\"Enter\"){event.preventDefault();addPIColor("+ci+","+ii+");}'/>" +
        "<input type='color' id='pi-col-hex-"+ci+"-"+ii+"' value='#C9A84C' style='width:44px;height:36px;border-radius:8px;border:2px solid rgba(201,168,76,0.3);cursor:pointer;padding:2px;background:transparent'/>" +
        "<button class='btn-add' style='padding:8px 14px;font-size:12px' onclick='addPIColor("+ci+","+ii+")'><i class='fas fa-plus'></i> Agregar</button>" +
      "</div>" +
    "</div>" +

    // ── Tab: Ficha Técnica ──
    "<div class='pst-content' id='pit-ficha-"+ci+"-"+ii+"'>" +
      "<div id='pi-ficha-list-"+ci+"-"+ii+"' style='margin-bottom:10px'>"+fichaListHtml+"</div>" +
      "<div style='display:flex;gap:8px;flex-wrap:wrap'>" +
        "<input type='text' id='pi-fk-"+ci+"-"+ii+"' placeholder='Propiedad (ej: Grosor)' class='psc-input' style='flex:1;min-width:100px'/>" +
        "<input type='text' id='pi-fv-"+ci+"-"+ii+"' placeholder='Valor (ej: 2.5mm)' class='psc-input' style='flex:1;min-width:100px'/>" +
        "<button class='btn-add' style='padding:8px 12px;font-size:12px' onclick='addPIFicha("+ci+","+ii+")'><i class='fas fa-plus'></i></button>" +
      "</div>" +
    "</div>"
  );
}


function togglePacDetails(i) {
  var sub = document.getElementById("pac-sub-" + i);
  if (!sub) return;
  var opening = sub.classList.contains("hidden");
  // Close all
  document.querySelectorAll(".pac-submenu").forEach(function(s){ s.classList.add("hidden"); });
  if (opening) {
    sub.classList.remove("hidden");
    pacRefreshLists(i);
  }
}

function showPst(i, tab, btn) {
  var sub = document.getElementById("pac-sub-" + i);
  if (!sub) return;
  sub.querySelectorAll(".pst-content").forEach(function(t){ t.classList.remove("active"); });
  sub.querySelectorAll(".pst").forEach(function(b){ b.classList.remove("active"); });
  var t = document.getElementById("psc-" + tab + "-" + i);
  if (t) t.classList.add("active");
  if (btn) btn.classList.add("active");
}

function pacRefreshLists(i) {
  var p = currentData.productos[i];
  if (!p) return;
  // Características
  var cl = document.getElementById("psc-caract-list-" + i);
  if (cl) {
    var caract = p.caracteristicas || [];
    if (caract.length === 0) { cl.innerHTML = "<p style='color:#888;font-size:12px;padding:6px'>Sin características. Agrega la primera.</p>"; }
    else {
      var ch = "<div style='display:flex;flex-direction:column;gap:6px'>";
      for (var ci = 0; ci < caract.length; ci++) {
        ch += "<div class='cat-item-row'><i class='fas fa-check' style='color:var(--gold);font-size:11px'></i><span class='ci-name'>" + caract[ci] + "</span><div class='ci-actions'><button class='btn-delete' onclick='pacRemoveCaract(" + i + "," + ci + ")' style='padding:4px 8px'><i class='fas fa-trash'></i></button></div></div>";
      }
      cl.innerHTML = ch + "</div>";
    }
  }
  // Fotos
  var fl = document.getElementById("psc-fotos-list-" + i);
  if (fl) {
    var fotos = p.fotos && p.fotos.length > 0 ? p.fotos : (p.imagen ? [p.imagen] : []);
    if (fotos.length === 0) { fl.innerHTML = "<p style='color:#888;font-size:12px;padding:6px'>Sin fotos aún.</p>"; }
    else {
      var fh = "";
      for (var fi = 0; fi < fotos.length; fi++) {
        fh += "<div style='position:relative'><img src='" + fotos[fi] + "' style='width:80px;height:80px;object-fit:cover;border-radius:8px;border:1px solid var(--border)'/><button onclick='pacRemoveFoto(" + i + "," + fi + ")' style='position:absolute;top:-6px;right:-6px;background:#E84040;border:none;color:#fff;width:20px;height:20px;border-radius:50%;font-size:11px;cursor:pointer'>×</button></div>";
      }
      fl.innerHTML = fh;
    }
  }
  // Colores
  var kl = document.getElementById("psc-colores-list-" + i);
  if (kl) {
    var cols = p.colores || [];
    if (cols.length === 0) { kl.innerHTML = "<p style='color:#888;font-size:12px;padding:6px'>Sin colores. Agrega el primero.</p>"; }
    else {
      var kh = "";
      for (var ki = 0; ki < cols.length; ki++) {
        kh += "<span style='display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:var(--dark3);border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--white)'><span style='width:14px;height:14px;border-radius:50%;background:" + (cols[ki].hex||"#888") + ";display:inline-block;flex-shrink:0'></span>" + cols[ki].nombre + "<button onclick='pacRemoveColor(" + i + "," + ki + ")' style='background:none;border:none;color:#E84040;cursor:pointer;font-size:13px;line-height:1;padding:0'>×</button></span>";
      }
      kl.innerHTML = kh;
    }
  }
  // Ficha
  var ffl = document.getElementById("psc-ficha-list-" + i);
  if (ffl) {
    var ficha = p.ficha || [];
    if (ficha.length === 0) { ffl.innerHTML = "<p style='color:#888;font-size:12px;padding:6px'>Sin ficha técnica. Agrega propiedades.</p>"; }
    else {
      var ffh = "<table style='width:100%;border-collapse:collapse;font-size:12px'>";
      for (var ffi = 0; ffi < ficha.length; ffi++) {
        ffh += "<tr style='border-bottom:1px solid var(--border)'><td style='padding:7px 10px;color:var(--gold);font-weight:600;width:40%'>" + ficha[ffi][0] + "</td><td style='padding:7px 10px;color:var(--white)'>" + ficha[ffi][1] + "</td><td style='text-align:right;padding:7px'><button onclick='pacRemoveFicha(" + i + "," + ffi + ")' style='background:none;border:none;color:#E84040;cursor:pointer;font-size:13px'>×</button></td></tr>";
      }
      ffl.innerHTML = ffh + "</table>";
    }
  }
}

// ── ADD / REMOVE ──────────────────────────────────────────────
function pacAddCaract(i) {
  var inp = document.getElementById("psc-caract-inp-" + i);
  var val = inp ? inp.value.trim() : "";
  if (!val) { showToast("Ingresa la característica", true); return; }
  var p = currentData.productos[i];
  if (!p.caracteristicas) p.caracteristicas = [];
  p.caracteristicas.push(val);
  inp.value = "";
  persist(); pacRefreshLists(i); renderProductsAdmin(); togglePacDetails(i);
  showToast("✅ Característica agregada");
}
function pacRemoveCaract(i, ci) {
  currentData.productos[i].caracteristicas.splice(ci, 1);
  persist(); pacRefreshLists(i); renderProductsAdmin(); togglePacDetails(i);
}
function pacAddFotos(i, input) {
  var p = currentData.productos[i];
  if (!p.fotos) p.fotos = p.imagen ? [p.imagen] : [];
  var files = Array.from(input.files);
  var done = 0;
  files.forEach(function(file) {
    if (file.size > 5*1024*1024) { showToast("Imagen muy grande (máx 5MB)", true); done++; return; }
    var r = new FileReader();
    r.onload = function(e) {
      p.fotos.push(e.target.result);
      if (!p.imagen) p.imagen = e.target.result;
      done++;
      if (done === files.length) {
        persist(); pacRefreshLists(i); renderProductsAdmin(); togglePacDetails(i);
        showToast("✅ " + files.length + " foto(s) agregada(s)");
      }
    };
    r.readAsDataURL(file);
  });
}
function pacRemoveFoto(i, fi) {
  var p = currentData.productos[i];
  var fotos = p.fotos && p.fotos.length > 0 ? p.fotos : (p.imagen ? [p.imagen] : []);
  fotos.splice(fi, 1);
  p.fotos = fotos;
  p.imagen = fotos[0] || "";
  persist(); pacRefreshLists(i); renderProductsAdmin(); togglePacDetails(i);
}
function pacAddColor(i) {
  var nom = document.getElementById("psc-col-nom-" + i);
  var hex = document.getElementById("psc-col-hex-" + i);
  if (!nom || !nom.value.trim()) { showToast("Ingresa el nombre del color", true); return; }
  var p = currentData.productos[i];
  if (!p.colores) p.colores = [];
  p.colores.push({ nombre: nom.value.trim(), hex: hex ? hex.value : "#888", imagen: "" });
  nom.value = "";
  persist(); pacRefreshLists(i); renderProductsAdmin(); togglePacDetails(i);
  showToast("✅ Color agregado");
}
function pacRemoveColor(i, ki) {
  currentData.productos[i].colores.splice(ki, 1);
  persist(); pacRefreshLists(i); renderProductsAdmin(); togglePacDetails(i);
}
function pacAddFicha(i) {
  var k = document.getElementById("psc-ficha-k-" + i);
  var v = document.getElementById("psc-ficha-v-" + i);
  if (!k||!v||!k.value.trim()||!v.value.trim()) { showToast("Completa propiedad y valor", true); return; }
  var p = currentData.productos[i];
  if (!p.ficha) p.ficha = [];
  p.ficha.push([k.value.trim(), v.value.trim()]);
  k.value = ""; v.value = "";
  persist(); pacRefreshLists(i); renderProductsAdmin(); togglePacDetails(i);
  showToast("✅ Fila de ficha agregada");
}
function pacRemoveFicha(i, fi) {
  currentData.productos[i].ficha.splice(fi, 1);
  persist(); pacRefreshLists(i); renderProductsAdmin(); togglePacDetails(i);
}



// ── PRODUCT CATEGORIES ───────────────────────────────────────
var editingProdCatIdx2 = null;
var _prodCatImgB64 = null;

function openProdCategoriaModal(idx) {
  editingProdCatIdx2 = (idx !== undefined) ? idx : null;
  _prodCatImgB64 = null;
  var title = editingProdCatIdx2 !== null ? "Editar Categoría" : "Nueva Categoría de Producto";
  // Reuse categoriaModal
  document.getElementById("categoriaModal").querySelector("h3").textContent = title;
  if (editingProdCatIdx2 !== null) {
    var c = currentData.categoriasProducto[editingProdCatIdx2];
    setVal("catNombre", c.nombre); setVal("catDesc", c.descripcion||""); setVal("catIcono", c.icono||"");
    setVal("catImgUrl", c.imagen||"");
    var prev = document.getElementById("catImgPreview");
    if(c.imagen){prev.src=c.imagen;prev.style.display="block";}else prev.style.display="none";
  } else {
    ["catNombre","catDesc","catIcono","catImgUrl"].forEach(function(id){ setVal(id,""); });
    document.getElementById("catImgPreview").style.display="none";
  }
  openModal("categoriaModal");
  // Override save button
  document.querySelector("#categoriaModal .btn-save").setAttribute("onclick","saveProdCategoria()");
  setTimeout(function(){
    setupImageUpload("catDropZone","catImgFile","catImgPreview",function(b64){ _prodCatImgB64=b64; });
  },100);
}

function editProdCategoria(ci) { openProdCategoriaModal(ci); }

function deleteProdCategoria(ci) {
  var cat = (currentData.categoriasProducto||[])[ci];
  if (!cat) return;
  var n = (cat.items||[]).length;
  if (!confirm("¿Eliminar la categoría \"" + cat.nombre + "\"" + (n>0?" y sus "+n+" producto(s)?":"?"))) return;
  currentData.categoriasProducto.splice(ci, 1);
  persist(); renderProductsAdmin(); showToast("Categoría eliminada");
}

function saveProdCategoria() {
  var nombre = getVal("catNombre").trim();
  if (!nombre) { showToast("El nombre es requerido", true); return; }
  if (!currentData.categoriasProducto) currentData.categoriasProducto = [];
  var prev = editingProdCatIdx2 !== null ? currentData.categoriasProducto[editingProdCatIdx2] : {};
  var cat = {
    id:          editingProdCatIdx2 !== null ? prev.id : "pcat-"+Date.now(),
    nombre:      nombre,
    descripcion: getVal("catDesc"),
    icono:       getVal("catIcono") || "fas fa-box",
    imagen:      _prodCatImgB64 || getVal("catImgUrl").trim() || (editingProdCatIdx2 !== null ? prev.imagen : "") || "",
    items:       editingProdCatIdx2 !== null ? (prev.items||[]) : []
  };
  if (editingProdCatIdx2 !== null) { currentData.categoriasProducto[editingProdCatIdx2] = cat; }
  else { currentData.categoriasProducto.push(cat); }
  persist(); renderProductsAdmin(); closeModal("categoriaModal");
  showToast(editingProdCatIdx2 !== null ? "✅ Categoría actualizada" : "✅ Categoría creada");
}

// ── PRODUCT ITEMS ─────────────────────────────────────────────
var editingProdItemCi  = null;
var editingProdItemIdx2 = null;
var _prodItemImgB64   = null;
var _prodItemFotosB64 = [];

function openProdItemModal(ci, ii) {
  editingProdItemCi   = ci;
  editingProdItemIdx2 = (ii !== undefined) ? ii : null;
  _prodItemImgB64    = null;
  _prodItemFotosB64  = [];
  var cat  = currentData.categoriasProducto[ci];
  var isEdit = editingProdItemIdx2 !== null;
  document.getElementById("itemModalTitle").textContent = isEdit ? "Editar Producto" : "Agregar Producto";
  document.getElementById("itemCatLabel").textContent   = cat ? cat.nombre : "";
  if (isEdit) {
    var item = cat.items[editingProdItemIdx2];
    setVal("itemNombre",  item.nombre||"");
    setVal("itemDesc",    item.descripcion||"");
    setVal("itemCaract",  (item.caracteristicas||[]).join("\n"));
    setVal("itemColores", (item.colores||[]).map(function(c){ return c.nombre+"|"+(c.hex||"#888"); }).join("\n"));
    setVal("itemFicha",   (item.ficha||[]).map(function(r){ return r[0]+":"+r[1]; }).join("\n"));
    // Populate URL fields
    var mainImg = item.imagen || "";
    setVal("itemImgUrl", mainImg);
    var extraFotos = (item.fotos||[]).filter(function(f){ return f !== mainImg; });
    setVal("itemFotosUrls", extraFotos.join("\n"));
    var prevEl = document.getElementById("itemImgPreview");
    if(mainImg){prevEl.src=mainImg;prevEl.style.display="block";}else prevEl.style.display="none";
    var fp = document.getElementById("itemFotosPreview");
    fp.innerHTML = extraFotos.map(function(f){
      return "<img src='"+f+"' style='width:60px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--border)'/>";
    }).join("");
  } else {
    ["itemNombre","itemDesc","itemCaract","itemColores","itemFicha","itemImgUrl","itemFotosUrls"].forEach(function(id){ setVal(id,""); });
    document.getElementById("itemImgPreview").style.display = "none";
    document.getElementById("itemFotosPreview").innerHTML = "";
  }
  // Override save button
  document.querySelector("#itemModal .btn-save").setAttribute("onclick","saveProdItem()");
  openModal("itemModal");
  setTimeout(function(){
    var existingCols = (ii!==undefined && currentData.categoriasProducto[ci] && currentData.categoriasProducto[ci].items[ii])
      ? (currentData.categoriasProducto[ci].items[ii].colores||[]) : [];
    initModalColorPicker(existingCols);
  }, 30);
  setTimeout(function(){
    setupImageUpload("itemDropZone","itemImgFile","itemImgPreview",function(b64){ _prodItemImgB64=b64; });
    var multi = document.getElementById("itemFotosFile");
    multi.onchange = function(){
      Array.from(multi.files).forEach(function(file){
        var r2 = new FileReader();
        r2.onload = function(e){
          _prodItemFotosB64.push(e.target.result);
          var fp2 = document.getElementById("itemFotosPreview");
          var img = document.createElement("img");
          img.src = e.target.result;
          img.style = "width:60px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--gold)";
          fp2.appendChild(img);
        };
        r2.readAsDataURL(file);
      });
    };
  }, 100);
}

function editProdItem(ci, ii) { openProdItemModal(ci, ii); }

function deleteProdItem(ci, ii) {
  var item = (currentData.categoriasProducto[ci].items||[])[ii];
  if (!confirm("¿Eliminar \"" + (item?item.nombre:"producto") + "\"?")) return;
  currentData.categoriasProducto[ci].items.splice(ii, 1);
  persist(); renderProductsAdmin(); showToast("Producto eliminado");
}

function saveProdItem() {
  var nombre = getVal("itemNombre").trim();
  if (!nombre) { showToast("El nombre es requerido", true); return; }
  var cat = currentData.categoriasProducto[editingProdItemCi];
  if (!cat) return;
  var prev = editingProdItemIdx2 !== null ? cat.items[editingProdItemIdx2] : {};
  // Prefer base64 upload, then URL field, then existing value
  var urlFieldImg = getVal("itemImgUrl").trim();
  var mainImg = _prodItemImgB64 || urlFieldImg || (editingProdItemIdx2!==null ? prev.imagen : "") || "";
  // Fotos: from PC upload, or from URL textarea, or from existing
  var fotosFromUrl = getVal("itemFotosUrls").split("\n").map(function(u){ return u.trim(); }).filter(function(u){ return u.length > 0; });
  var extraFotos = _prodItemFotosB64.length > 0 ? _prodItemFotosB64 : (fotosFromUrl.length > 0 ? fotosFromUrl : (editingProdItemIdx2!==null ? (prev.fotos||[]).filter(function(f){ return f!==prev.imagen; }) : []));
  var allFotos = mainImg ? [mainImg].concat(extraFotos.filter(function(f){ return f!==mainImg; })) : extraFotos;
  var colRaw = getVal("itemColores").split("\n").map(function(c){ return c.trim(); }).filter(Boolean);
  var colores = (_modalColors && _modalColors.length > 0)
    ? _modalColors
    : colRaw.map(function(c){ var p=c.split("|"); return {nombre:p[0]||c, hex:p[1]||"#888", imagen:""}; });
  var fichaRaw = getVal("itemFicha").split("\n").map(function(f){ return f.trim(); }).filter(Boolean);
  var ficha = fichaRaw.map(function(f){ var p=f.split(":"); return [p[0]||f, p.slice(1).join(":")||""]; });
  var item = {
    id:              editingProdItemIdx2!==null ? prev.id : "pi-"+Date.now(),
    nombre:          nombre,
    descripcion:     getVal("itemDesc"),
    imagen:          mainImg,
    fotos:           allFotos,
    caracteristicas: getVal("itemCaract").split("\n").filter(function(c){ return c.trim(); }),
    colores:         colores.length > 0 ? colores : (editingProdItemIdx2!==null ? (prev.colores||[]) : []),
    ficha:           ficha.length > 0 ? ficha : (editingProdItemIdx2!==null ? (prev.ficha||[]) : [])
  };
  if (!cat.items) cat.items = [];
  if (editingProdItemIdx2 !== null) { cat.items[editingProdItemIdx2] = item; }
  else { cat.items.push(item); }
  persist(); renderProductsAdmin(); closeModal("itemModal");
  showToast(editingProdItemIdx2!==null ? "✅ Producto actualizado" : "✅ Producto agregado");
}

// ── PROD ITEM SUBMENU ─────────────────────────────────────────
function toggleProdItemSub(ci, ii) {
  var id = "pisub-" + ci + "-" + ii;
  var el = document.getElementById(id);
  if (!el) return;
  var opening = el.classList.contains("hidden");
  document.querySelectorAll(".pac-submenu").forEach(function(s){ s.classList.add("hidden"); });
  if (opening) el.classList.remove("hidden");
}

function showPITab(ci, ii, tab, btn) {
  var sub = document.getElementById("pisub-" + ci + "-" + ii);
  if (!sub) return;
  sub.querySelectorAll(".pst-content").forEach(function(t){ t.classList.remove("active"); });
  sub.querySelectorAll(".pst").forEach(function(b){ b.classList.remove("active"); });
  var t = document.getElementById("pit-" + tab + "-" + ci + "-" + ii);
  if (t) t.classList.add("active");
  if (btn) btn.classList.add("active");
}

function getPI(ci, ii) { return (currentData.categoriasProducto[ci].items||[])[ii]; }

function addPICaract(ci, ii) {
  var inp = document.getElementById("pi-caract-inp-"+ci+"-"+ii);
  var val = inp ? inp.value.trim() : "";
  if (!val) { showToast("Ingresa la característica", true); return; }
  var p = getPI(ci,ii); if(!p.caracteristicas) p.caracteristicas=[];
  p.caracteristicas.push(val);
  if(inp) inp.value="";
  persist(); piRefreshCaract(ci,ii); showToast("✅ Característica agregada");
}
function removePICaract(ci, ii, idx) {
  var p = getPI(ci,ii);
  if(p.caracteristicas) p.caracteristicas.splice(idx,1);
  persist(); piRefreshCaract(ci,ii);
}
function piRefreshCaract(ci, ii) {
  var listEl = document.getElementById("pi-caract-list-"+ci+"-"+ii);
  if(!listEl) return;
  var caract = getPI(ci,ii).caracteristicas || [];
  if(caract.length === 0){
    listEl.innerHTML = "<p style='color:#888;font-size:12px;padding:4px'>Sin características. Agrega la primera.</p>";
    return;
  }
  listEl.innerHTML = "<div style='display:flex;flex-direction:column;gap:5px'>" +
    caract.map(function(c,cii){
      return "<div class='cat-item-row'>" +
        "<i class='fas fa-check' style='color:var(--gold);font-size:11px'></i>" +
        "<span class='ci-name'>"+c+"</span>" +
        "<button onclick='removePICaract("+ci+","+ii+","+cii+")' class='btn-delete' style='padding:3px 8px'><i class='fas fa-trash'></i></button>" +
        "</div>";
    }).join("") + "</div>";
}
function addPIFotos(ci, ii, input) {
  var p = getPI(ci,ii); if(!p.fotos) p.fotos=p.imagen?[p.imagen]:[];
  var files = Array.from(input.files), done=0;
  files.forEach(function(file){
    if(file.size>5*1024*1024){showToast("Imagen muy grande (máx 5MB)",true);done++;return;}
    var r=new FileReader();
    r.onload=function(e){
      p.fotos.push(e.target.result);
      if(!p.imagen) p.imagen=e.target.result;
      done++;
      if(done===files.length){persist();piRefreshFotos(ci,ii);showToast("✅ "+files.length+" foto(s) agregada(s)");}
    };
    r.readAsDataURL(file);
  });
}
function removePIFoto(ci, ii, fi) {
  var p=getPI(ci,ii);
  var fotos=p.fotos&&p.fotos.length>0?p.fotos:(p.imagen?[p.imagen]:[]);
  fotos.splice(fi,1); p.fotos=fotos; p.imagen=fotos[0]||"";
  persist(); piRefreshFotos(ci,ii);
}
function piRefreshFotos(ci, ii) {
  var wrapEl = document.querySelector("#pit-fotos-"+ci+"-"+ii+" .pi-fotos-wrap");
  if(!wrapEl) return;
  var p = getPI(ci,ii);
  var fotos = (p.fotos&&p.fotos.length>0)?p.fotos:(p.imagen?[p.imagen]:[]);
  if(fotos.length===0){ wrapEl.innerHTML="<p style='color:#888;font-size:12px;padding:4px'>Sin fotos aún</p>"; return; }
  wrapEl.innerHTML = fotos.map(function(f,fi){
    return "<div style='position:relative;display:inline-block;margin:4px'>" +
      "<img src='"+f+"' style='width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid var(--border)'/>" +
      "<button onclick='removePIFoto("+ci+","+ii+","+fi+")' style='position:absolute;top:-6px;right:-6px;background:#E84040;border:none;color:#fff;width:18px;height:18px;border-radius:50%;font-size:10px;cursor:pointer;line-height:18px;text-align:center'>×</button>" +
    "</div>";
  }).join("");
}
function addPIColor(ci, ii) {
  var nom=document.getElementById("pi-col-nom-"+ci+"-"+ii);
  var hex=document.getElementById("pi-col-hex-"+ci+"-"+ii);
  if(!nom||!nom.value.trim()){showToast("Ingresa el nombre del color",true);return;}
  var p=getPI(ci,ii); if(!p.colores) p.colores=[];
  p.colores.push({nombre:nom.value.trim(), hex:hex?hex.value:"#888", imagen:""});
  if(nom) nom.value="";
  persist(); piRefreshColores(ci,ii); showToast("✅ Color agregado");
}
function piQuickColor(ci, ii, nombre, hex) {
  var p=getPI(ci,ii); if(!p.colores) p.colores=[];
  if(p.colores.find(function(c){return c.nombre===nombre;})){
    showToast("Ya existe: "+nombre, true); return;
  }
  p.colores.push({nombre:nombre, hex:hex, imagen:""});
  persist(); piRefreshColores(ci,ii); showToast("✅ "+nombre+" agregado");
}
function removePIColor(ci, ii, ki) {
  var p=getPI(ci,ii);
  if(p.colores) p.colores.splice(ki,1);
  persist(); piRefreshColores(ci,ii);
}
function piRefreshColores(ci, ii) {
  var listEl = document.getElementById("pi-colores-list-"+ci+"-"+ii);
  if(!listEl) return;
  var colores = getPI(ci,ii).colores || [];
  if(colores.length === 0){
    listEl.innerHTML = "<p style='color:#888;font-size:12px'>Sin colores. Usa la paleta o agrega uno personalizado.</p>";
    return;
  }
  listEl.innerHTML = colores.map(function(c,ki){
    return "<div style='display:inline-flex;align-items:center;gap:6px;padding:5px 10px 5px 6px;background:var(--dark3);border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--white);margin:3px'>" +
      "<span style='width:22px;height:22px;border-radius:50%;background:"+(c.hex||"#888")+";display:inline-block;border:2px solid rgba(255,255,255,0.2);flex-shrink:0'></span>" +
      "<span>"+c.nombre+"</span>" +
      "<button onclick='removePIColor("+ci+","+ii+","+ki+")' style='background:none;border:none;color:#E84040;cursor:pointer;font-size:15px;line-height:1;padding:0;margin-left:2px'>×</button>" +
    "</div>";
  }).join("");
}
function addPIFicha(ci, ii) {
  var k=document.getElementById("pi-fk-"+ci+"-"+ii);
  var v=document.getElementById("pi-fv-"+ci+"-"+ii);
  if(!k||!v||!k.value.trim()||!v.value.trim()){showToast("Completa propiedad y valor",true);return;}
  var p=getPI(ci,ii); if(!p.ficha) p.ficha=[];
  p.ficha.push([k.value.trim(),v.value.trim()]);
  k.value=""; v.value="";
  persist(); piRefreshFicha(ci,ii); showToast("✅ Fila agregada");
}
function removePIFicha(ci, ii, fi) {
  var p=getPI(ci,ii);
  if(p.ficha) p.ficha.splice(fi,1);
  persist(); piRefreshFicha(ci,ii);
}
function piRefreshFicha(ci, ii) {
  var listEl = document.getElementById("pi-ficha-list-"+ci+"-"+ii);
  if(!listEl) return;
  var ficha = getPI(ci,ii).ficha || [];
  if(ficha.length===0){
    listEl.innerHTML="<p style='color:#888;font-size:12px;padding:4px'>Sin ficha técnica aún.</p>";
    return;
  }
  listEl.innerHTML = "<table style='width:100%;border-collapse:collapse;font-size:12px'>" +
    ficha.map(function(r,fi){
      return "<tr style='border-bottom:1px solid var(--border)'>" +
        "<td style='padding:6px 10px;color:var(--gold);font-weight:600;width:42%'>"+r[0]+"</td>" +
        "<td style='padding:6px 10px;color:var(--white)'>"+r[1]+"</td>" +
        "<td style='text-align:right;padding:6px'>" +
          "<button onclick='removePIFicha("+ci+","+ii+","+fi+")' style='background:none;border:none;color:#E84040;cursor:pointer;font-size:13px'>×</button>" +
        "</td></tr>";
    }).join("") + "</table>";
}


// ── GALERÍA ──────────────────────────────────────────────────
function renderGaleriaAdmin() {
  const grid = document.getElementById("galeriaAdminGrid");
  if(!grid) return;
  const items = (currentData && currentData.galeria) ? currentData.galeria : [];
  if(items.length === 0){grid.innerHTML="<p style='color:#888;padding:20px'>No hay imágenes.</p>";return;}
  var html="";
  for(var i=0;i<items.length;i++){
    var g=items[i];
    var imgTag=g.imagen?"<img class='gac-img' src='"+g.imagen+"' alt='"+g.titulo+"'>":"<div class='gac-img' style='background:var(--dark3);display:flex;align-items:center;justify-content:center;color:var(--gray);font-size:12px'>Sin imagen</div>";
    html+="<div class='galeria-admin-card'>"+imgTag+"<div class='gac-info'><span class='gac-cat'>"+g.categoria+"</span><h4>"+g.titulo+"</h4><p><i class='fas fa-map-marker-alt'></i> "+g.ubicacion+"</p><div class='gac-actions'><button class='btn-edit' onclick='editGaleria("+i+")'><i class='fas fa-edit'></i> Editar</button><button class='btn-delete' onclick='deleteGaleria("+i+")'><i class='fas fa-trash'></i> Eliminar</button></div></div></div>";
  }
  grid.innerHTML=html;
}

let _galeriaImgB64 = null;

function openGaleriaModal(idx = null) {
  editingGaleriaId = idx; _galeriaImgB64 = null;
  document.getElementById("galeriaModalTitle").textContent = idx !== null ? "Editar Imagen" : "Agregar Imagen";
  if (idx !== null) {
    const g = currentData.galeria[idx];
    setVal("gTitulo", g.titulo); setVal("gUbicacion", g.ubicacion);
    setVal("gImagenUrl", g.imagen); setVal("gCategoria", g.categoria);
    const prev = document.getElementById("gImgPreview");
    prev.src = g.imagen; prev.style.display = "block";
  } else {
    ["gTitulo","gUbicacion","gImagenUrl"].forEach(id => setVal(id, ""));
    document.getElementById("gImgPreview").style.display = "none";
  }
  openModal("galeriaModal");
  setTimeout(() => {
    setupImageUpload("gDropZone", "gImgFile", "gImgPreview", (b64) => {
      _galeriaImgB64 = b64; setVal("gImagenUrl", "");
    });
  }, 100);
}

function editGaleria(idx) { openGaleriaModal(idx); }

function deleteGaleria(idx) {
  if (!confirm("¿Eliminar esta imagen?")) return;
  currentData.galeria.splice(idx, 1);
  persist(); renderGaleriaAdmin(); showToast("Imagen eliminada");
}

function saveGaleria() {
  const titulo = getVal("gTitulo").trim();
  if (!titulo) { showToast("El título es requerido", true); return; }
  const imgSrc = _galeriaImgB64 || getVal("gImagenUrl").trim() ||
    "https://via.placeholder.com/600x400/1A1A1A/C9A84C?text=Proyecto";
  const item = { titulo, ubicacion: getVal("gUbicacion"), imagen: imgSrc, categoria: getVal("gCategoria") };
  if (editingGaleriaId !== null) { currentData.galeria[editingGaleriaId] = item; }
  else { currentData.galeria.push(item); }
  persist(); renderGaleriaAdmin(); closeModal("galeriaModal");
  showToast(editingGaleriaId !== null ? "✅ Imagen actualizada" : "✅ Imagen agregada");
}

// ── VENTAJAS ─────────────────────────────────────────────────
function renderVentajasAdmin() {
  const grid = document.getElementById("ventajasAdminGrid");
  if(!grid) return;
  const items = (currentData && currentData.ventajas) ? currentData.ventajas : [];
  if(items.length===0){grid.innerHTML="<p style='color:#888;padding:20px'>No hay ventajas.</p>";return;}
  var html="";
  for(var i=0;i<items.length;i++){
    var v=items[i];
    html+="<div class='ventaja-admin-card'><i class='"+(v.icono||"fas fa-star")+" vac-icon'></i><div class='vac-title'>"+v.titulo+"</div><div class='vac-desc'>"+v.descripcion+"</div><div class='vac-actions'><button class='btn-edit' onclick='editVentaja("+i+")'><i class='fas fa-edit'></i> Editar</button><button class='btn-delete' onclick='deleteVentaja("+i+")'><i class='fas fa-trash'></i> Eliminar</button></div></div>";
  }
  grid.innerHTML=html;
}

function openVentajaModal(idx = null) {
  editingVentajaId = idx;
  if (idx !== null) { const v = currentData.ventajas[idx]; setVal("vTitulo", v.titulo); setVal("vDesc", v.descripcion); setVal("vIcono", v.icono); }
  else { ["vTitulo","vDesc","vIcono"].forEach(id => setVal(id, "")); }
  openModal("ventajaModal");
}
function editVentaja(idx) { openVentajaModal(idx); }
function deleteVentaja(idx) {
  if (!confirm("¿Eliminar esta ventaja?")) return;
  currentData.ventajas.splice(idx, 1); persist(); renderVentajasAdmin(); showToast("Ventaja eliminada");
}
function saveVentaja() {
  const titulo = getVal("vTitulo").trim();
  if (!titulo) { showToast("El título es requerido", true); return; }
  const item = { titulo, descripcion: getVal("vDesc"), icono: getVal("vIcono") || "fas fa-star" };
  if (editingVentajaId !== null) { currentData.ventajas[editingVentajaId] = item; }
  else { currentData.ventajas.push(item); }
  persist(); renderVentajasAdmin(); closeModal("ventajaModal");
  showToast(editingVentajaId !== null ? "✅ Ventaja actualizada" : "✅ Ventaja agregada");
}

// ── ACCESORIOS (CATEGORÍAS + ITEMS) ──────────────────────────
let editingCatIdx = null;
let editingItemIdx = null;
let currentCatIdx = null;
let _catImgB64 = null;
let _itemImgB64 = null;
let _itemFotosB64 = [];

function renderAccesoriosAdmin() {
  var grid = document.getElementById("accesoriosAdminGrid");
  if(!grid) return;
  var cats = (currentData && currentData.accesorios) ? currentData.accesorios : [];
  if(cats.length===0){grid.innerHTML="<p style='color:#888;padding:20px'>No hay categorías. Agrega la primera.</p>";return;}
  var html="";
  for(var ci=0;ci<cats.length;ci++){
    var cat=cats[ci];
    var items=cat.items||[];
    var iconHtml=cat.imagen
      ? "<img src='"+cat.imagen+"' class='cat-admin-img' alt='"+cat.nombre+"'>"
      : "<div class='cat-admin-icon'><i class='"+(cat.icono||"fas fa-cube")+"'></i></div>";
    var itemsHtml="";
    for(var ii=0;ii<items.length;ii++){
      var item=items[ii];
      var ithumb=item.imagen?"<img src='"+item.imagen+"' class='ci-thumb'>":"<div class='ci-thumb ci-icon'><i class='"+(cat.icono||"fas fa-cube")+"'></i></div>";
      itemsHtml+="<div class='cat-item-row'>"+ithumb+"<span class='ci-name'>"+item.nombre+"</span><div class='ci-actions'><button class='btn-edit' onclick='editItem("+ci+","+ii+")'><i class='fas fa-edit'></i></button><button class='btn-delete' onclick='deleteItem("+ci+","+ii+")'><i class='fas fa-trash'></i></button></div></div>";
    }
    html+="<div class='cat-admin-card'><div class='cat-admin-head'>"+iconHtml+"<div class='cat-admin-info'><h3>"+cat.nombre+"</h3><span>"+items.length+" item(s)</span></div><div class='cat-admin-btns'><button class='btn-edit' onclick='editCategoria("+ci+")' title='Editar categoría'><i class='fas fa-edit'></i></button><button class='btn-delete' onclick='deleteCategoria("+ci+")' title='Eliminar'><i class='fas fa-trash'></i></button></div></div><div class='cat-items-list'>"+itemsHtml+"<button class='btn-add-item' onclick='openItemModal("+ci+")'><i class='fas fa-plus'></i> Agregar accesorio a "+cat.nombre+"</button></div></div>";
  }
  grid.innerHTML=html;
}


// ── CATEGORÍA ─────────────────────────────────────────────────
function editCategoria(ci) {
  editingCatIdx = ci; _catImgB64 = null;
  const cat = currentData.accesorios[ci];
  setVal("catNombre", cat.nombre);
  setVal("catIcono", cat.icono||"");
  setVal("catDesc", cat.descripcion||"");
  const prev = document.getElementById("catImgPreview");
  if(cat.imagen){prev.src=cat.imagen;prev.style.display="block";}else prev.style.display="none";
  setVal("catImgUrl", (cat.imagen && cat.imagen.startsWith("http")) ? cat.imagen : "");
  openModal("categoriaModal");
  setTimeout(()=>setupImageUpload("catDropZone","catImgFile","catImgPreview",(b64)=>{_catImgB64=b64;}),100);
}
function openCategoriaModal() {
  editingCatIdx = null; _catImgB64 = null;
  ["catNombre","catIcono","catDesc","catImgUrl"].forEach(id=>setVal(id,""));
  const cp=document.getElementById("catImgPreview"); if(cp){cp.style.display="none";cp.src="";}
  openModal("categoriaModal");
  setTimeout(()=>setupImageUpload("catDropZone","catImgFile","catImgPreview",(b64)=>{_catImgB64=b64;}),100);
}
function deleteCategoria(ci) {
  if(!confirm(`¿Eliminar la categoría "${currentData.accesorios[ci].nombre}" y todos sus items?`)) return;
  currentData.accesorios.splice(ci,1); persist(); renderAccesoriosAdmin(); showToast("Categoría eliminada");
}
function saveCategoria() {
  const nombre = getVal("catNombre").trim();
  if(!nombre){showToast("El nombre es requerido",true);return;}
  const prev = editingCatIdx!==null ? currentData.accesorios[editingCatIdx] : {};
  const cat = {
    id: editingCatIdx!==null ? prev.id : "cat-"+Date.now(),
    nombre,
    icono: getVal("catIcono")||"fas fa-cube",
    descripcion: getVal("catDesc"),
    imagen: _catImgB64 || getVal("catImgUrl") || (editingCatIdx!==null?prev.imagen:"")||"",
    items: editingCatIdx!==null ? (prev.items||[]) : []
  };
  if(editingCatIdx!==null){currentData.accesorios[editingCatIdx]=cat;}
  else{currentData.accesorios.push(cat);}
  persist(); renderAccesoriosAdmin(); closeModal("categoriaModal");
  showToast(editingCatIdx!==null?"✅ Categoría actualizada":"✅ Categoría agregada");
}

// ── ITEM ──────────────────────────────────────────────────────
function openItemModal(ci, ii=null) {
  currentCatIdx=ci; editingItemIdx=ii; _itemImgB64=null; _itemFotosB64=[];
  document.getElementById("itemModalTitle").textContent = ii!==null?"Editar Accesorio":"Agregar Accesorio";
  document.getElementById("itemCatLabel").textContent = currentData.accesorios[ci].nombre;
  if(ii!==null){
    const item = currentData.accesorios[ci].items[ii];
    setVal("itemNombre", item.nombre);
    setVal("itemDesc", item.descripcion||"");
    setVal("itemCaract", (item.caracteristicas||[]).join("\n"));
    setVal("itemColores", (item.colores||[]).map(c=>`${c.nombre}|${c.hex||"#888"}${c.imagen?"|"+c.imagen:""}`).join("\n"));
    setVal("itemFicha", (item.ficha||[]).map(r=>`${r[0]}:${r[1]}`).join("\n"));
    const prevI=document.getElementById("itemImgPreview");
    if(item.imagen){prevI.src=item.imagen;prevI.style.display="block";}else prevI.style.display="none";
    setVal("itemImgUrl",(item.imagen&&item.imagen.startsWith("http"))?item.imagen:"");
    // Fotos adicionales
    const fotosHttp=(item.fotos||[]).filter(f=>f&&f.startsWith("http")&&f!==item.imagen);
    setVal("itemFotosUrls", fotosHttp.join("\n"));
    previewFotosUrls(fotosHttp.join("\n"),"itemFotosPreview");
  } else {
    ["itemNombre","itemDesc","itemCaract","itemColores","itemFicha","itemImgUrl","itemFotosUrls"].forEach(id=>setVal(id,""));
    const ip=document.getElementById("itemImgPreview"); if(ip){ip.style.display="none";ip.src="";}
    const fp=document.getElementById("itemFotosPreview"); if(fp) fp.innerHTML="";
    document.getElementById("itemImgPreview").style.display="none";
    document.getElementById("itemFotosPreview").innerHTML="";
  }
  openModal("itemModal");
  setTimeout(function(){
    var existingCols = (ii!==null && currentData.accesorios[ci] && currentData.accesorios[ci].items[ii])
      ? (currentData.accesorios[ci].items[ii].colores||[]) : [];
    initModalColorPicker(existingCols);
  }, 30);
  setTimeout(()=>{
    setupImageUpload("itemDropZone","itemImgFile","itemImgPreview",(b64)=>{_itemImgB64=b64;});
    // Multiple photos upload
    const multi=document.getElementById("itemFotosFile");
    multi.onchange=()=>{
      Array.from(multi.files).forEach(file=>{
        const r=new FileReader();
        r.onload=e=>{
          _itemFotosB64.push(e.target.result);
          const fp=document.getElementById("itemFotosPreview");
          const img=document.createElement("img");
          img.src=e.target.result;
          img.style="width:60px;height:60px;object-fit:cover;border-radius:8px;border:1px solid var(--gold)";
          fp.appendChild(img);
        };
        r.readAsDataURL(file);
      });
    };
  },100);
}
function editItem(ci,ii){openItemModal(ci,ii);}
function deleteItem(ci,ii){
  if(!confirm("¿Eliminar este accesorio?")) return;
  currentData.accesorios[ci].items.splice(ii,1);
  persist(); renderAccesoriosAdmin(); showToast("Accesorio eliminado");
}
function saveItem(){
  const nombre=getVal("itemNombre").trim();
  if(!nombre){showToast("El nombre es requerido",true);return;}
  const prev=editingItemIdx!==null?currentData.accesorios[currentCatIdx].items[editingItemIdx]:{};
  const mainImg=_itemImgB64||getVal("itemImgUrl")||(editingItemIdx!==null?prev.imagen:"")||"";
  const fotosUrlsField=getVal("itemFotosUrls").split("\n").map(u=>u.trim()).filter(u=>u.startsWith("http"));
  const extraFotos=_itemFotosB64.length>0?_itemFotosB64:(fotosUrlsField.length>0?fotosUrlsField:(editingItemIdx!==null?(prev.fotos||[]).filter(f=>f&&f!==prev.imagen):[]));
  const allFotos=mainImg?[mainImg,...extraFotos.filter(f=>f!==mainImg)]:extraFotos;
  const coloresRaw=getVal("itemColores").split("\n").map(c=>c.trim()).filter(Boolean);
  const colores=(_modalColors && _modalColors.length > 0)
    ? _modalColors
    : coloresRaw.map(c=>{const p=c.split("|");return{nombre:p[0]||c,hex:p[1]||"#888",imagen:p[2]||""};});
  const fichaRaw=getVal("itemFicha").split("\n").map(f=>f.trim()).filter(Boolean);
  const ficha=fichaRaw.map(f=>{const p=f.split(":");return[p[0]||f,p.slice(1).join(":")||""];});
  const item={
    id:editingItemIdx!==null?prev.id:"acc-"+Date.now(),
    nombre,
    descripcion:getVal("itemDesc"),
    imagen:mainImg,
    fotos:allFotos,
    caracteristicas:getVal("itemCaract").split("\n").filter(c=>c.trim()),
    colores:colores.length>0?colores:(editingItemIdx!==null?(prev.colores||[]):[]),
    ficha:ficha.length>0?ficha:(editingItemIdx!==null?(prev.ficha||[]):[]),
  };
  if(!currentData.accesorios[currentCatIdx].items) currentData.accesorios[currentCatIdx].items=[];
  if(editingItemIdx!==null){currentData.accesorios[currentCatIdx].items[editingItemIdx]=item;}
  else{currentData.accesorios[currentCatIdx].items.push(item);}
  persist(); renderAccesoriosAdmin(); closeModal("itemModal");
  showToast(editingItemIdx!==null?"✅ Accesorio actualizado":"✅ Accesorio agregado");
}

// Legacy aliases (keep for compatibility)
function openAccesorioModal(){openCategoriaModal();}
function saveAccesorio(){saveCategoria();}

// ── TEMA ─────────────────────────────────────────────────────
function loadTemaFields() {
  const t = currentData.tema || {};
  setVal("tColorPrimario",   t.colorPrimario   || "#C9A84C");
  setVal("tColorSecundario", t.colorSecundario || "#E87820");
  setVal("tColorFondo",      t.colorFondo      || "#111111");
  setVal("tColorFondo2",     t.colorFondo2     || "#1A1A1A");
  setVal("tColorTexto",      t.colorTexto      || "#F5F0E8");
  setVal("tColorAccent",     t.colorAccent     || "#1A7F6E");
  setVal("tFuente",          t.fuente          || "Barlow");
  setVal("tFuenteTitulos",   t.fuenteTitulos   || "Playfair Display");
  syncColorPreviews();
}

function syncColorPreviews() {
  ["tColorPrimario","tColorSecundario","tColorFondo","tColorFondo2","tColorTexto","tColorAccent"].forEach(id => {
    const inp = document.getElementById(id);
    const swatch = document.getElementById(id + "Swatch");
    if (inp && swatch) swatch.style.background = inp.value;
  });
}

function saveTema() {
  if (!currentData.tema) currentData.tema = {};
  currentData.tema.colorPrimario   = getVal("tColorPrimario");
  currentData.tema.colorSecundario = getVal("tColorSecundario");
  currentData.tema.colorFondo      = getVal("tColorFondo");
  currentData.tema.colorFondo2     = getVal("tColorFondo2");
  currentData.tema.colorTexto      = getVal("tColorTexto");
  currentData.tema.colorAccent     = getVal("tColorAccent");
  currentData.tema.fuente          = getVal("tFuente");
  currentData.tema.fuenteTitulos   = getVal("tFuenteTitulos");
  persist(); showToast("✅ Tema guardado — recarga la página para ver los cambios");
}

function applyTemaPreview() {
  const t = {
    colorPrimario:   getVal("tColorPrimario"),
    colorSecundario: getVal("tColorSecundario"),
    colorFondo:      getVal("tColorFondo"),
    colorFondo2:     getVal("tColorFondo2"),
    colorTexto:      getVal("tColorTexto"),
    colorAccent:     getVal("tColorAccent"),
    fuente:          getVal("tFuente"),
    fuenteTitulos:   getVal("tFuenteTitulos")
  };
  // Preview in admin panel itself
  const r = document.documentElement.style;
  r.setProperty("--gold",    t.colorPrimario);
  r.setProperty("--orange",  t.colorSecundario);
  showToast("Vista previa aplicada en admin");
}

function applyPaleta(nombre) {
  const paletas = {
    dorado: { colorPrimario:"#C9A84C", colorSecundario:"#E87820", colorFondo:"#111111", colorFondo2:"#1A1A1A", colorTexto:"#F5F0E8", colorAccent:"#1A7F6E" },
    verde:  { colorPrimario:"#4CAF50", colorSecundario:"#8BC34A", colorFondo:"#0D1F0E", colorFondo2:"#162418", colorTexto:"#E8F5E9", colorAccent:"#2E7D32" },
    azul:   { colorPrimario:"#42A5F5", colorSecundario:"#26C6DA", colorFondo:"#0D1321", colorFondo2:"#132241", colorTexto:"#E3F2FD", colorAccent:"#1565C0" },
    rojo:   { colorPrimario:"#EF5350", colorSecundario:"#FF8A65", colorFondo:"#1A0000", colorFondo2:"#2D0000", colorTexto:"#FFEBEE", colorAccent:"#C62828" },
    blanco: { colorPrimario:"#212121", colorSecundario:"#424242", colorFondo:"#FAFAFA", colorFondo2:"#F0F0F0", colorTexto:"#212121", colorAccent:"#1565C0" },
    cafe:   { colorPrimario:"#BCAAA4", colorSecundario:"#A1887F", colorFondo:"#1C0F0A", colorFondo2:"#2D1B11", colorTexto:"#EFEBE9", colorAccent:"#6D4C41" }
  };
  const p = paletas[nombre]; if (!p) return;
  Object.keys(p).forEach(k => {
    setVal("t" + k.charAt(0).toUpperCase() + k.slice(1), p[k]);
  });
  syncColorPreviews();
  showToast("Paleta aplicada — guarda para confirmar");
}



// ── CATÁLOGO DIGITAL ADMIN ────────────────────────────────────
function showMainTab_Productos() {
  // Now opens "nueva categoría de producto" instead
  openProdCategoriaModal();
  return;
}
function showMainTab_ProductosOLD() {
  // Switch to productos tab
  document.querySelectorAll(".admin-section").forEach(function(s){ s.classList.add("hidden"); });
  document.querySelectorAll(".tab-main").forEach(function(b){ b.classList.remove("active"); });
  var sec = document.getElementById("tab-productos");
  if (sec) sec.classList.remove("hidden");
  var btns = document.querySelectorAll(".tab-main");
  btns.forEach(function(b){ if(b.textContent.includes("Productos")) b.classList.add("active"); });
  openProductModal();
}

function renderCatalogoAdmin() {
  var prods = currentData.productos || [];
  var cats  = currentData.productoCategorias || [];

  // ── Stats ──────────────────────────────────────────────────
  var statsEl = document.getElementById("catalogoStats");
  if (statsEl) {
    var withImg   = prods.filter(function(p){ return !!p.imagen; }).length;
    var withColores = prods.filter(function(p){ return p.colores && p.colores.length > 0; }).length;
    var withFicha = prods.filter(function(p){ return p.ficha && p.ficha.length > 0; }).length;
    var withFotos = prods.filter(function(p){ return p.fotos && p.fotos.length > 1; }).length;
    var stats = [
      { icon:"fas fa-box", label:"Total productos", value: prods.length, color:"var(--gold)" },
      { icon:"fas fa-image", label:"Con imagen", value: withImg + " / " + prods.length, color:"#25D366" },
      { icon:"fas fa-palette", label:"Con colores", value: withColores, color:"#42A5F5" },
      { icon:"fas fa-file-alt", label:"Con ficha técnica", value: withFicha, color:"var(--orange)" },
      { icon:"fas fa-images", label:"Con fotos extra", value: withFotos, color:"#AB47BC" }
    ];
    statsEl.innerHTML = stats.map(function(s){
      return "<div style='background:var(--dark2);border:1px solid var(--border);border-radius:14px;padding:20px;text-align:center'>" +
        "<i class='" + s.icon + "' style='font-size:24px;color:" + s.color + ";margin-bottom:8px;display:block'></i>" +
        "<div style='font-size:22px;font-weight:700;color:var(--white)'>" + s.value + "</div>" +
        "<div style='font-size:12px;color:var(--gray);margin-top:4px'>" + s.label + "</div>" +
      "</div>";
    }).join("");
  }

  // ── Filter buttons ─────────────────────────────────────────
  var filtersEl = document.getElementById("catalogoAdminFilters");
  if (filtersEl) {
    var filterCats = cats.length > 0 ? cats : [
      {id:"todos",nombre:"Todos",icono:"fas fa-th-large",filtro:""},
      {id:"pvc",nombre:"Tejas PVC",icono:"fas fa-home",filtro:"pvc"},
      {id:"policarbonato",nombre:"Policarbonato",icono:"fas fa-sun",filtro:"policarbonato"},
      {id:"trapezoidal",nombre:"Trapezoidal",icono:"fas fa-layer-group",filtro:"trapezoidal"}
    ];
    filtersEl.innerHTML = filterCats.map(function(c,i){
      return "<button class='cat-filter-adm" + (i===0?" active":"") + "' data-f='" + (c.filtro||"") + "' onclick='filtrarCatAdmin(this)'>" +
        "<i class='" + (c.icono||"fas fa-circle") + "'></i> " + c.nombre + "</button>";
    }).join("");
  }

  // ── Grid ───────────────────────────────────────────────────
  renderCatAdminGrid("");
}

function filtrarCatAdmin(btn) {
  document.querySelectorAll(".cat-filter-adm").forEach(function(b){ b.classList.remove("active"); });
  if (btn) btn.classList.add("active");
  renderCatAdminGrid(btn ? (btn.dataset.f || "") : "");
}

function renderCatAdminGrid(filtro) {
  var grid = document.getElementById("catalogoAdminGrid");
  if (!grid) return;
  var all = currentData.productos || [];
  var prods = all;
  if (filtro && filtro !== "") {
    var f = filtro.toLowerCase();
    prods = all.filter(function(p){
      var n = (p.nombre||"").toLowerCase();
      if (f === "pvc") return n.includes("pvc") && !n.includes("trapezoidal");
      if (f === "policarbonato") return n.includes("policarbonato");
      if (f === "trapezoidal") return n.includes("trapezoidal");
      return n.includes(f);
    });
  }

  if (prods.length === 0) {
    grid.innerHTML = "<p style='color:var(--gray);padding:40px;text-align:center;grid-column:1/-1'>No hay productos en esta categoría.</p>";
    return;
  }

  grid.innerHTML = prods.map(function(p) {
    var idx = (currentData.productos||[]).findIndex(function(x){ return x.id === p.id; });
    var imgHtml = p.imagen
      ? "<img src='" + p.imagen + "' style='width:100%;height:180px;object-fit:cover;border-radius:12px 12px 0 0'/>"
      : "<div style='width:100%;height:180px;background:var(--dark3);border-radius:12px 12px 0 0;display:flex;align-items:center;justify-content:center'><i class='fas fa-box' style='font-size:40px;color:var(--gold);opacity:0.4'></i></div>";

    var fotosCount = (p.fotos||[]).length;
    var colCount   = (p.colores||[]).length;
    var fichaCount = (p.ficha||[]).length;
    var caractCount= (p.caracteristicas||[]).length;

    // Completion score
    var score = 0;
    if (p.imagen) score += 25;
    if (fotosCount > 1) score += 15;
    if (colCount > 0) score += 20;
    if (fichaCount > 0) score += 20;
    if (caractCount >= 3) score += 20;
    var scoreColor = score >= 80 ? "#25D366" : score >= 50 ? "var(--gold)" : "var(--orange)";

    var badge = p.badge ? "<span class='pac-badge badge-" + p.badgeColor + "' style='position:absolute;top:10px;left:10px;z-index:1'>" + p.badge + "</span>" : "";

    return "<div class='cat-admin-preview-card'>" +
      "<div style='position:relative'>" + badge + imgHtml + "</div>" +
      "<div style='padding:16px'>" +
        "<h3 style='font-size:15px;font-weight:700;color:var(--white);margin-bottom:10px'>" + p.nombre + "</h3>" +
        // Completion bar
        "<div style='margin-bottom:14px'>" +
          "<div style='display:flex;justify-content:space-between;font-size:11px;color:var(--gray);margin-bottom:4px'>" +
            "<span>Completitud del producto</span><span style='color:" + scoreColor + ";font-weight:700'>" + score + "%</span>" +
          "</div>" +
          "<div style='height:4px;background:var(--dark3);border-radius:2px;overflow:hidden'>" +
            "<div style='height:100%;width:" + score + "%;background:" + scoreColor + ";border-radius:2px;transition:width 0.5s'></div>" +
          "</div>" +
        "</div>" +
        // Meta chips
        "<div style='display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px'>" +
          "<span style='font-size:10px;padding:3px 8px;border-radius:10px;background:" + (fotosCount>0?"rgba(37,211,102,0.12)":"rgba(255,255,255,0.05)") + ";color:" + (fotosCount>0?"#25D366":"var(--gray)") + ";border:1px solid " + (fotosCount>0?"rgba(37,211,102,0.3)":"var(--border)") + "'><i class='fas fa-images'></i> " + fotosCount + " foto" + (fotosCount!==1?"s":"") + "</span>" +
          "<span style='font-size:10px;padding:3px 8px;border-radius:10px;background:" + (colCount>0?"rgba(66,165,245,0.12)":"rgba(255,255,255,0.05)") + ";color:" + (colCount>0?"#42A5F5":"var(--gray)") + ";border:1px solid " + (colCount>0?"rgba(66,165,245,0.3)":"var(--border)") + "'><i class='fas fa-palette'></i> " + colCount + " color" + (colCount!==1?"es":"") + "</span>" +
          "<span style='font-size:10px;padding:3px 8px;border-radius:10px;background:" + (fichaCount>0?"rgba(201,168,76,0.12)":"rgba(255,255,255,0.05)") + ";color:" + (fichaCount>0?"var(--gold)":"var(--gray)") + ";border:1px solid " + (fichaCount>0?"var(--border)":"var(--border)") + "'><i class='fas fa-list'></i> " + fichaCount + " ficha</span>" +
          "<span style='font-size:10px;padding:3px 8px;border-radius:10px;background:" + (caractCount>0?"rgba(171,71,188,0.12)":"rgba(255,255,255,0.05)") + ";color:" + (caractCount>0?"#AB47BC":"var(--gray)") + ";border:1px solid " + (caractCount>0?"rgba(171,71,188,0.3)":"var(--border)") + "'><i class='fas fa-check-circle'></i> " + caractCount + " caract.</span>" +
        "</div>" +
        // Actions
        "<div style='display:flex;gap:8px'>" +
          "<button class='btn-edit' style='flex:1' onclick='editProductFromCatalog(" + idx + ")'><i class='fas fa-edit'></i> Editar</button>" +
          "<button class='btn-edit' style='background:rgba(66,165,245,0.1);border-color:#42A5F5;color:#42A5F5' onclick='editProductSubMenu(" + idx + ")' title='Agregar fotos/colores/ficha'><i class='fas fa-layer-group'></i></button>" +
          "<a href='detalle.html?tipo=producto&id=" + p.id + "' target='_blank' class='btn-edit' style='background:rgba(37,211,102,0.1);border-color:#25D366;color:#25D366' title='Ver en página'><i class='fas fa-eye'></i></a>" +
        "</div>" +
      "</div>" +
    "</div>";
  }).join("");
}

function editProductFromCatalog(idx) {
  // Switch to productos tab and open edit modal
  document.querySelectorAll(".admin-section").forEach(function(s){ s.classList.add("hidden"); });
  document.querySelectorAll(".tab-main").forEach(function(b){ b.classList.remove("active"); });
  var sec = document.getElementById("tab-productos");
  if (sec) sec.classList.remove("hidden");
  var btns = document.querySelectorAll(".tab-main");
  btns.forEach(function(b){ if(b.textContent.includes("Productos")) b.classList.add("active"); });
  renderProductsAdmin();
  setTimeout(function(){ editProduct(idx); }, 200);
}

function editProductSubMenu(idx) {
  // Switch to productos tab and expand submenu
  document.querySelectorAll(".admin-section").forEach(function(s){ s.classList.add("hidden"); });
  document.querySelectorAll(".tab-main").forEach(function(b){ b.classList.remove("active"); });
  var sec = document.getElementById("tab-productos");
  if (sec) sec.classList.remove("hidden");
  var btns = document.querySelectorAll(".tab-main");
  btns.forEach(function(b){ if(b.textContent.includes("Productos")) b.classList.add("active"); });
  renderProductsAdmin();
  setTimeout(function(){
    togglePacDetails(idx);
    var card = document.getElementById("pac-" + idx);
    if (card) card.scrollIntoView({behavior:"smooth", block:"center"});
  }, 200);
}


// ── FILTROS / CATEGORÍAS DE PRODUCTOS ────────────────────────
let editingProdCatIdx = null;

function renderProdCatsAdmin() {
  var grid = document.getElementById("prodCatsGrid");
  if (!grid) return;
  var cats = (currentData.productoCategorias && currentData.productoCategorias.length > 0)
    ? currentData.productoCategorias
    : [];
  if (cats.length === 0) {
    grid.innerHTML = "<p style='color:#888;padding:20px'>No hay filtros. Agrega el primero.</p>";
    return;
  }
  var html = "";
  for (var i = 0; i < cats.length; i++) {
    var c = cats[i];
    html += "<div class='cat-admin-card' style='margin-bottom:10px'>" +
      "<div class='cat-admin-head'>" +
        "<div class='cat-admin-icon'><i class='" + (c.icono||"fas fa-circle") + "'></i></div>" +
        "<div class='cat-admin-info'>" +
          "<h3>" + c.nombre + "</h3>" +
          "<span>Filtro: <strong style='color:var(--gold)'>" + (c.filtro || "todos (sin filtro)") + "</strong></span>" +
        "</div>" +
        "<div class='cat-admin-btns'>" +
          "<button class='btn-edit' onclick='editProdCat(" + i + ")'><i class='fas fa-edit'></i></button>" +
          (i > 0 ? "<button class='btn-delete' onclick='deleteProdCat(" + i + ")'><i class='fas fa-trash'></i></button>" : "") +
        "</div>" +
      "</div>" +
    "</div>";
  }
  grid.innerHTML = html;
}

function openProdCatModal(idx) {
  editingProdCatIdx = (idx !== undefined) ? idx : null;
  document.getElementById("prodCatModalTitle").textContent = editingProdCatIdx !== null ? "Editar Filtro" : "Agregar Filtro";
  if (editingProdCatIdx !== null) {
    var c = currentData.productoCategorias[editingProdCatIdx];
    setVal("pcNombre", c.nombre);
    setVal("pcFiltro",  c.filtro || "");
    setVal("pcIcono",   c.icono  || "");
  } else {
    ["pcNombre","pcFiltro","pcIcono"].forEach(function(id){ setVal(id,""); });
  }
  openModal("prodCatModal");
}

function editProdCat(idx) { openProdCatModal(idx); }

function deleteProdCat(idx) {
  if (!confirm("¿Eliminar este filtro?")) return;
  currentData.productoCategorias.splice(idx, 1);
  persist(); renderProdCatsAdmin(); showToast("Filtro eliminado");
}

function saveProdCat() {
  var nombre = getVal("pcNombre").trim();
  if (!nombre) { showToast("El nombre es requerido", true); return; }
  var cat = {
    id:     nombre.toLowerCase().replace(/\s+/g,"-"),
    nombre: nombre,
    filtro: getVal("pcFiltro").trim().toLowerCase(),
    icono:  getVal("pcIcono").trim() || "fas fa-circle"
  };
  if (!currentData.productoCategorias) currentData.productoCategorias = [];
  if (editingProdCatIdx !== null) {
    currentData.productoCategorias[editingProdCatIdx] = cat;
  } else {
    currentData.productoCategorias.push(cat);
  }
  persist(); renderProdCatsAdmin(); closeModal("prodCatModal");
  showToast(editingProdCatIdx !== null ? "✅ Filtro actualizado" : "✅ Filtro agregado");
}

// ── MISIÓN & VISIÓN ──────────────────────────────────────────
function loadMVFields() { setVal("misionAdmin", currentData.misionVision.mision); setVal("visionAdmin", currentData.misionVision.vision); }
function saveMV() {
  currentData.misionVision.mision = getVal("misionAdmin");
  currentData.misionVision.vision = getVal("visionAdmin");
  persist(); showToast("✅ Misión & Visión guardados");
}

// ── MODALES ──────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add("open"); }
function closeModal(id) { document.getElementById(id).classList.remove("open"); }
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) e.target.classList.remove("open");
});

// ── PUBLICAR CAMBIOS (exportar data.js para subir a Netlify) ──
function publicarCambios() {
  const newVersion = "4." + Date.now();
  const dataStr = JSON.stringify(currentData, null, 2);
  const contenido = `// ============================================================
// DATA.JS — Generado automáticamente desde el Panel Admin
// Versión: ${newVersion}
// ============================================================

const DATA_VERSION = "${newVersion}";

const SITE_DATA_DEFAULT = ${dataStr};

function getSiteData() {
  try {
    const ver = localStorage.getItem("mc_ver");
    if (ver !== DATA_VERSION) {
      localStorage.removeItem("mc_data");
      localStorage.setItem("mc_ver", DATA_VERSION);
      return deepClone(SITE_DATA_DEFAULT);
    }
    const saved = localStorage.getItem("mc_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.productos || !Array.isArray(parsed.productos)) throw new Error("Datos inválidos");
      return deepMerge(deepClone(SITE_DATA_DEFAULT), parsed);
    }
  } catch(e) {
    localStorage.removeItem("mc_data");
    localStorage.removeItem("mc_ver");
  }
  return deepClone(SITE_DATA_DEFAULT);
}

function saveSiteData(data) {
  localStorage.setItem("mc_data", JSON.stringify(data));
  localStorage.setItem("mc_ver", DATA_VERSION);
  localStorage.setItem("mc_ts", Date.now().toString());
}

function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (Array.isArray(source[key])) { target[key] = source[key]; }
    else if (source[key] && typeof source[key] === "object") { if (!target[key]) target[key] = {}; deepMerge(target[key], source[key]); }
    else if (source[key] !== undefined) { target[key] = source[key]; }
  }
  return target;
}

window.addEventListener("storage", (e) => { if (e.key === "mc_ts" && !window.__IS_ADMIN__) location.reload(); });

let SITE_DATA = getSiteData();
`;

  const blob = new Blob([contenido], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.js";
  a.click();
  URL.revokeObjectURL(url);

  // Mostrar instrucciones
  document.getElementById("publishModal").classList.add("open");
}

function closePublishModal() {
  document.getElementById("publishModal").classList.remove("open");
}


// ── MODAL VISUAL COLOR PICKER ─────────────────────────────────
var _modalColors = [];

var MODAL_PRESET_COLORS = [
  {n:"Rojo Teja",h:"#8B2500"},{n:"Terracota",h:"#C0392B"},{n:"Granate",h:"#7B241C"},
  {n:"Verde Selva",h:"#1E8449"},{n:"Verde Pino",h:"#2D5A1B"},{n:"Verde",h:"#27AE60"},
  {n:"Blanco",h:"#F5F5F5"},{n:"Gris",h:"#888888"},{n:"Gris Oscuro",h:"#444444"},
  {n:"Negro",h:"#1A1A1A"},{n:"Azul",h:"#1565C0"},{n:"Celeste",h:"#2196F3"},
  {n:"Café",h:"#6D4C41"},{n:"Teja",h:"#B5651D"},{n:"Naranja",h:"#E65100"},
  {n:"Beige",h:"#D7C4A0"},{n:"Madera",h:"#A0845C"},{n:"Amarillo",h:"#F9A825"}
];

function initModalColorPicker(existingColors) {
  _modalColors = (existingColors||[]).map(function(c){
    return {nombre:c.nombre, hex:c.hex||"#888", imagen:c.imagen||""};
  });
  // Render palette
  var pal = document.getElementById("itemModalPalette");
  if(pal){
    pal.innerHTML = MODAL_PRESET_COLORS.map(function(col){
      return "<div " +
        "onclick=\"modalQuickColor('"+col.n+"','"+col.h+"')\" " +
        "title='"+col.n+"' " +
        "style=\"width:30px;height:30px;border-radius:50%;background:"+col.h+";cursor:pointer;" +
               "border:3px solid rgba(255,255,255,0.12);transition:transform 0.15s,border-color 0.15s;" +
               "box-shadow:0 2px 6px rgba(0,0,0,0.4)\" " +
        "onmouseover=\"this.style.transform='scale(1.3)';this.style.borderColor='rgba(255,255,255,0.8)'\" " +
        "onmouseout=\"this.style.transform='scale(1)';this.style.borderColor='rgba(255,255,255,0.12)'\"></div>";
    }).join("");
  }
  modalRefreshColorVisual();
}

function modalQuickColor(nombre, hex) {
  if(_modalColors.find(function(c){return c.nombre===nombre;})){
    showToast("Ya existe: "+nombre, true); return;
  }
  _modalColors.push({nombre:nombre, hex:hex, imagen:""});
  modalSyncTextarea();
  modalRefreshColorVisual();
  showToast("✅ "+nombre+" agregado");
}

function modalAddColor() {
  var nom = document.getElementById("modalColNom");
  var hex = document.getElementById("modalColHex");
  var nombre = nom ? nom.value.trim() : "";
  if(!nombre){showToast("Ingresa el nombre del color",true);return;}
  _modalColors.push({nombre:nombre, hex:hex?hex.value:"#888", imagen:""});
  if(nom) nom.value="";
  modalSyncTextarea();
  modalRefreshColorVisual();
  showToast("✅ Color agregado");
}

function modalRemoveColor(ki) {
  _modalColors.splice(ki,1);
  modalSyncTextarea();
  modalRefreshColorVisual();
}

function modalRefreshColorVisual() {
  var vis = document.getElementById("itemColoresVisual");
  if(!vis) return;
  if(_modalColors.length === 0){
    vis.innerHTML = "<p style='color:#888;font-size:12px;font-style:italic;margin:0'>Sin colores seleccionados — usa la paleta o agrega manualmente</p>";
    return;
  }
  vis.innerHTML = _modalColors.map(function(c,ki){
    return "<div style='display:inline-flex;align-items:center;gap:6px;padding:4px 10px 4px 5px;" +
             "background:var(--dark);border:1px solid var(--border);border-radius:20px;font-size:12px;color:var(--white)'>" +
      "<span style='width:20px;height:20px;border-radius:50%;background:"+(c.hex||"#888")+";" +
             "display:inline-block;border:2px solid rgba(255,255,255,0.2);flex-shrink:0'></span>" +
      "<span>"+c.nombre+"</span>" +
      "<button onclick='modalRemoveColor("+ki+")' style='background:none;border:none;color:#E84040;" +
             "cursor:pointer;font-size:14px;line-height:1;padding:0;margin-left:2px'>×</button>" +
    "</div>";
  }).join("");
}

function modalSyncTextarea() {
  var ta = document.getElementById("itemColores");
  if(ta) ta.value = _modalColors.map(function(c){return c.nombre+"|"+c.hex;}).join("\n");
}
