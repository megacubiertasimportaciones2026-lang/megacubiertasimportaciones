// ============================================================
// DATA.JS v3.0 — SIN localStorage, datos directos del archivo
// ============================================================

const SITE_DATA_DEFAULT = {
  contacto: {
    whatsappNumbers: [
      { numero: "593997019778", etiqueta: "Ventas Principal" },
      { numero: "593995586336", etiqueta: "Ventas 2" },
      { numero: "593984317900", etiqueta: "Soporte Técnico" }
    ],
    email: "chulcodarwin9@gmail.com",
    direccion: "Av. Bolivariana y Convenio de San Agustín,<br>Frente al Estadio alterno Neptalí Barona,<br>180204 Ambato – Ecuador",
    horarioLV: "Lunes a Viernes: 8:00 AM – 6:00 PM",
    horarioSab: "Sábados: 8:00 AM – 1:00 PM",
    horarioDom: "Domingos: Cerrado",
    mensajeBienvenida: "Hola! Me interesa cotizar materiales de Megacubiertas Importaciones. ¿Me pueden ayudar?",
    footerCopyright: "© Desde 2019 — Megacubiertas Importaciones | Ambato, Ecuador"
  },
  redes: {
    facebook: "https://www.facebook.com/share/14XoA2ASonY/",
    instagram: "https://www.instagram.com/megacubiertas/?igsh=MXZ6ZjQ1OGRvcjQyeg==",
    tiktok: "https://www.tiktok.com/@megacubiertas?_r=1&_t=ZS-94cKcDFgqeK",
    youtube: "#"
  },
  mapa: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d989.4!2d-78.62!3d-1.254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTUnMTUuNSJTIDc4wrAzNycxMi40Ilc!5e0!3m2!1ses!2sec!4v1700000000000",
    mapsLink: "https://maps.google.com/?q=Av.+Bolivariana+y+Convenio+de+San+Agust%C3%ADn,+Ambato,+Ecuador"
  },
  hero: {
    badge: "Megacubiertas Importaciones • Importadores directos en Ambato, Ecuador",
    titulo: "Megacubiertas Importaciones<br>Tejas PVC y Policarbonato en<br>Ambato, Ecuador",
    descripcion: "Importadores directos de tejas PVC, policarbonato y láminas translúcidas de alta calidad. Venta al por mayor y menor con asesoramiento técnico para proyectos residenciales, comerciales e industriales.",
    bgImage: "portada.jpg",
    estadisticas: [
      { valor: "+200", etiqueta: "Proyectos Instalados" },
      { valor: "Stock Permanente", etiqueta: "Entrega Inmediata" },
      { valor: "Mayor y Menor", etiqueta: "Venta Flexible" }
    ]
  },
  quienes: {
    imagen: "portada.jpg",
    anos: "Más de 10 años en el mercado",
    beneficios: [
      "Importadores directos sin intermediarios",
      "Productos certificados con garantía de fábrica",
      "Asesoramiento técnico especializado",
      "Stock permanente para entrega inmediata",
      "Venta al por mayor y menor",
      "Cobertura nacional con envíos a todo Ecuador"
    ]
  },
  misionVision: {
    mision: "Proveer materiales de cubierta de alta calidad importados directamente, ofreciendo precios competitivos, asesoramiento técnico especializado y soluciones integrales para proyectos residenciales, comerciales e industriales en todo Ecuador.",
    vision: "Ser la empresa líder en importación y distribución de materiales de cubierta en Ecuador, reconocida por la excelencia en calidad, innovación y servicio al cliente, expandiendo nuestra presencia a nivel nacional e internacional."
  },
  productos: [],
  accesorios: [
    {
      id: "cat-1",
      nombre: "Cumbreros",
      icono: "fas fa-hat-cowboy",
      imagen: "",
      descripcion: "Remates superiores para cubiertas. Sellado perfecto en la cumbrera.",
      items: [
        { id:"acc-1-1", nombre:"Cumbrero PVC Estándar", imagen:"", fotos:[], descripcion:"Cumbrero de PVC para tejas españolas estándar.", caracteristicas:["Compatible con tejas 2.5mm y 3mm","Sellado hermético","UV resistente"], colores:[{nombre:"Rojo",hex:"#8B2500",imagen:""},{nombre:"Verde",hex:"#2D5A1B",imagen:""}], ficha:[["Material","PVC"],["Largo","1.10m"],["Garantía","10 años"]] },
        { id:"acc-1-2", nombre:"Cumbrero Metálico", imagen:"", fotos:[], descripcion:"Cumbrero de acero galvanizado para alta resistencia.", caracteristicas:["Acero galvanizado","Alta resistencia","Anti-corrosión"], colores:[{nombre:"Gris",hex:"#888",imagen:""}], ficha:[["Material","Acero galvanizado"],["Largo","2m"],["Garantía","20 años"]] },
        { id:"acc-1-3", nombre:"Cumbrero Trapezoidal", imagen:"", fotos:[], descripcion:"Diseñado para tejas trapezoidales y onduladas.", caracteristicas:["Para teja trapezoidal","Ajuste perfecto","Fácil instalación"], colores:[{nombre:"Blanco",hex:"#F5F5F5",imagen:""},{nombre:"Rojo",hex:"#8B2500",imagen:""}], ficha:[["Material","PVC reforzado"],["Largo","1.10m"],["Tipo","Trapezoidal"]] }
      ]
    },
    {
      id: "cat-2",
      nombre: "Tornillería",
      icono: "fas fa-screwdriver",
      imagen: "",
      descripcion: "Fijaciones y tornillos especiales para todo tipo de cubiertas.",
      items: [
        { id:"acc-2-1", nombre:"Tornillo Autoperforante 50mm", imagen:"", fotos:[], descripcion:"Tornillo autoperforante con arandela neopreno para PVC.", caracteristicas:["Autoperforante","Arandela neopreno incluida","Acero inoxidable","Cabeza hexagonal"], colores:[], ficha:[["Material","Acero inoxidable"],["Largo","50mm"],["Diámetro","6mm"],["Presentación","Caja x100"]] },
        { id:"acc-2-2", nombre:"Tornillo Autoperforante 75mm", imagen:"", fotos:[], descripcion:"Para estructuras de mayor grosor. Con arandela de neopreno.", caracteristicas:["Mayor agarre","Para estructura gruesa","Anti-corrosión"], colores:[], ficha:[["Material","Acero inoxidable"],["Largo","75mm"],["Diámetro","6mm"],["Presentación","Caja x100"]] },
        { id:"acc-2-3", nombre:"Remaches Aluminio", imagen:"", fotos:[], descripcion:"Remaches de aluminio para unión de perfiles y cubiertas.", caracteristicas:["Aluminio de alta calidad","Resistente a corrosión","Fácil aplicación"], colores:[], ficha:[["Material","Aluminio"],["Diámetro","4.8mm"],["Largo","12mm / 16mm"],["Presentación","Bolsa x500"]] }
      ]
    },
    {
      id: "cat-3",
      nombre: "Perfiles",
      icono: "fas fa-ruler-combined",
      imagen: "",
      descripcion: "Perfiles de aluminio y PVC para ensamblaje y terminado de cubiertas.",
      items: [
        { id:"acc-3-1", nombre:"Perfil U Aluminio", imagen:"", fotos:[], descripcion:"Perfil en U de aluminio para remate de bordes de policarbonato.", caracteristicas:["Aluminio extruido","Acabado anodizado","Resistente a UV","Fácil corte"], colores:[{nombre:"Natural",hex:"#C0C0C0",imagen:""},{nombre:"Blanco",hex:"#F5F5F5",imagen:""}], ficha:[["Material","Aluminio"],["Tipo","Perfil U"],["Largo","6m"],["Ancho","6mm / 8mm / 10mm"]] },
        { id:"acc-3-2", nombre:"Perfil H Aluminio", imagen:"", fotos:[], descripcion:"Perfil H para unión de dos láminas de policarbonato.", caracteristicas:["Unión perfecta","Sin filtraciones","Aluminio anodizado"], colores:[{nombre:"Natural",hex:"#C0C0C0",imagen:""}], ficha:[["Material","Aluminio"],["Tipo","Perfil H"],["Largo","6m"],["Ancho","6mm / 8mm"]] },
        { id:"acc-3-3", nombre:"Perfil Gotero PVC", imagen:"", fotos:[], descripcion:"Perfil gotero de PVC para el borde inferior de cubiertas.", caracteristicas:["Desvía el agua","PVC rígido","Compatible con tejas MC"], colores:[{nombre:"Blanco",hex:"#F5F5F5",imagen:""},{nombre:"Gris",hex:"#888",imagen:""}], ficha:[["Material","PVC"],["Largo","3m"],["Tipo","Gotero"]] }
      ]
    },
    {
      id: "cat-4",
      nombre: "Selladores",
      icono: "fas fa-paint-roller",
      imagen: "",
      descripcion: "Selladores y cintas para impermeabilización total de juntas.",
      items: [
        { id:"acc-4-1", nombre:"Sellador Siliconado Neutro", imagen:"", fotos:[], descripcion:"Silicona neutra de alta calidad para sellado de juntas en policarbonato y PVC.", caracteristicas:["Impermeabilidad total","No ataca policarbonato","Resistente UV","Flexible"], colores:[{nombre:"Transparente",hex:"#E8F4FD",imagen:""},{nombre:"Blanco",hex:"#F5F5F5",imagen:""}], ficha:[["Tipo","Siliconado neutro"],["Rendimiento","8-10m/cartucho"],["Secado","24h"],["Temperatura","−40°C a +200°C"]] },
        { id:"acc-4-2", nombre:"Cinta Selladora Foam", imagen:"", fotos:[], descripcion:"Cinta de espuma selladora para el borde inferior de tejas.", caracteristicas:["Sello hermético","Impide ingreso de insectos","Fácil aplicación","Auto-adhesiva"], colores:[], ficha:[["Material","Espuma PE"],["Ancho","50mm"],["Largo","5m"],["Espesor","10mm"]] },
        { id:"acc-4-3", nombre:"Sellador Butílico", imagen:"", fotos:[], descripcion:"Sellador de butilo para uniones en techos metálicos y PVC.", caracteristicas:["Súper adherente","Resistente a agua","Alta durabilidad","Sin curado"], colores:[{nombre:"Negro",hex:"#111",imagen:""},{nombre:"Gris",hex:"#888",imagen:""}], ficha:[["Tipo","Butílico"],["Presentación","Rollo 5m"],["Ancho","20mm"],["Espesor","3mm"]] }
      ]
    }
  ],
  ventajas: [
    { icono:"fas fa-sun",              titulo:"Resistencia UV Superior",   descripcion:"Protección avanzada contra rayos ultravioleta que garantiza colores vibrantes y durabilidad por décadas sin decoloración." },
    { icono:"fas fa-tint",             titulo:"Impermeabilidad Total",      descripcion:"Sistema de sellado perfecto que evita filtraciones. Protección completa contra lluvia y humedad." },
    { icono:"fas fa-thermometer-half", titulo:"Aislamiento Térmico",        descripcion:"Reduce hasta 30% la temperatura interior. Ahorra en climatización y mejora el confort de tu hogar o negocio." },
    { icono:"fas fa-tools",            titulo:"Fácil Instalación",          descripcion:"Sistema de montaje sencillo que reduce tiempos y costos de instalación. Compatible con estructuras existentes." },
    { icono:"fas fa-leaf",             titulo:"Ecológico y Reciclable",     descripcion:"Materiales 100% reciclables que contribuyen al cuidado del medio ambiente sin comprometer calidad ni resistencia." },
    { icono:"fas fa-shield-alt",       titulo:"Garantía Extendida",         descripcion:"Respaldo de fábrica con garantía extendida. Productos certificados que cumplen estándares internacionales de calidad." }
  ],
  galeria: [
    { imagen:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80", titulo:"Residencia Familiar – Ambato",   ubicacion:"Ambato, Tungurahua", categoria:"residencial" },
    { imagen:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80", titulo:"Centro Comercial Plaza Norte",   ubicacion:"Quito, Pichincha",   categoria:"comercial"   },
    { imagen:"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80", titulo:"Nave Industrial Tungurahua",     ubicacion:"Ambato, Tungurahua", categoria:"industrial"  },
    { imagen:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80", titulo:"Residencia Privada",             ubicacion:"Quito, Pichincha",   categoria:"residencial" },
    { imagen:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80", titulo:"Proyecto Comercial Guayaquil",   ubicacion:"Guayaquil, Guayas",  categoria:"comercial"   },
    { imagen:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", titulo:"Complejo Residencial Mirador",   ubicacion:"Ambato, Tungurahua", categoria:"residencial" }
  ],
  footer: {
    copyright: "© Desde 2019 — Megacubiertas Importaciones | Ambato, Ecuador",
    descripcion: "Importadores y distribuidores al por mayor y menor de materiales de construcción, acabados, decorados, terminados y mucho más con la más alta calidad.",
    tagline: "Servicio · Calidad · Garantía"
  },
  // ── COTIZACIÓN ──
  cotizacion: {
    titulo: "Solicita tu Cotización",
    subtitulo: "Respuesta en menos de 2 horas",
    tiposProyecto: ["Residencial","Comercial","Industrial"]
  },
  // ── CATEGORÍAS DE PRODUCTOS CON ITEMS ──
  categoriasProducto: [
    {
      id: "cat-pvc", nombre: "Tejas PVC", icono: "fas fa-home",
      imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
      descripcion: "Tejas españolas de PVC de alta calidad",
      items: [
        {
          id: "pi-pvc-1", nombre: "Tejas Españolas PVC 2.5mm", badge: "MÁS VENDIDO", badgeColor: "orange",
          imagen: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
          fotos: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"],
          descripcion: "Teja española de PVC 2.5mm, ideal para proyectos residenciales. Alta resistencia a los rayos UV, aislamiento térmico y acústico. Disponible en múltiples colores.",
          caracteristicas: ["Alta resistencia al impacto","Aislamiento termoacústico","Protección UV garantizada","Fácil instalación","Peso ligero"],
          colores: [{nombre:"Rojo Teja",hex:"#8B2500",imagen:""},{nombre:"Verde",hex:"#2D5A1B",imagen:""},{nombre:"Blanco",hex:"#F5F5F5",imagen:""},{nombre:"Gris",hex:"#888",imagen:""}],
          ficha: [["Grosor","2.5mm"],["Material","PVC de alta densidad"],["Largo estándar","1.10m / 2.20m / 3.30m"],["Ancho útil","900mm"],["Peso","4.5 kg/m²"],["Garantía","10 años UV"]]
        },
        {
          id: "pi-pvc-2", nombre: "Tejas Españolas PVC 3mm", badge: "", badgeColor: "",
          imagen: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80",
          fotos: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"],
          descripcion: "Versión reforzada de 3mm para proyectos que requieren mayor resistencia estructural y climática. Ideal para zonas con fuertes lluvias y vientos.",
          caracteristicas: ["Mayor grosor = Mayor durabilidad","Resistencia superior al clima","Ideal para proyectos exigentes","Mayor aislamiento térmico","Resistente a granizo"],
          colores: [{nombre:"Rojo Teja",hex:"#8B2500",imagen:""},{nombre:"Verde",hex:"#2D5A1B",imagen:""},{nombre:"Terracota",hex:"#C84B31",imagen:""}],
          ficha: [["Grosor","3mm"],["Material","PVC reforzado"],["Largo estándar","1.10m / 2.20m / 3.30m"],["Ancho útil","900mm"],["Peso","5.4 kg/m²"],["Garantía","15 años UV"]]
        }
      ]
    },
    {
      id: "cat-poli", nombre: "Policarbonato", icono: "fas fa-sun",
      imagen: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80",
      descripcion: "Láminas de policarbonato alveolar",
      items: [
        {
          id: "pi-poli-1", nombre: "Policarbonato Alveolar 6mm", badge: "", badgeColor: "",
          imagen: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80",
          fotos: ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80"],
          descripcion: "Lámina de policarbonato alveolar de 6mm para cubiertas traslúcidas. Permite iluminación natural manteniendo aislamiento térmico.",
          caracteristicas: ["Excelente iluminación natural","Ideal para cubiertas traslúcidas","Resistente a condiciones climáticas","Liviano y fácil de instalar","Filtro UV integrado"],
          colores: [{nombre:"Transparente",hex:"#E8F4FD",imagen:""},{nombre:"Opal",hex:"#F0F0F0",imagen:""},{nombre:"Bronce",hex:"#8B6914",imagen:""}],
          ficha: [["Grosor","6mm"],["Material","Policarbonato alveolar"],["Transmisión de luz","82%"],["Ancho","1.05m / 2.10m"],["Resistencia","IK10"],["Garantía","10 años"]]
        },
        {
          id: "pi-poli-2", nombre: "Policarbonato Alveolar 8mm", badge: "MÁXIMA RESISTENCIA", badgeColor: "teal",
          imagen: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
          fotos: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"],
          descripcion: "El policarbonato más resistente de nuestra línea. 8mm de grosor para proyectos industriales y comerciales de alta exigencia.",
          caracteristicas: ["Mayor resistencia estructural","Ideal para proyectos industriales","Máxima protección y durabilidad","Alta resistencia al impacto","Aislamiento térmico superior"],
          colores: [{nombre:"Transparente",hex:"#E8F4FD",imagen:""},{nombre:"Opal",hex:"#F0F0F0",imagen:""},{nombre:"Azul",hex:"#1565C0",imagen:""}],
          ficha: [["Grosor","8mm"],["Material","Policarbonato alveolar reforzado"],["Transmisión de luz","78%"],["Ancho","1.05m / 2.10m"],["Resistencia","IK10+"],["Garantía","15 años"]]
        }
      ]
    },
    {
      id: "cat-trap", nombre: "Teja Trapezoidal", icono: "fas fa-layer-group",
      imagen: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80",
      descripcion: "Tejas trapezoidales para uso industrial",
      items: [
        {
          id: "pi-trap-1", nombre: "Teja Trapezoidal PVC", badge: "VARIOS COLORES", badgeColor: "blue",
          imagen: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80",
          fotos: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80"],
          descripcion: "Teja trapezoidal de PVC disponible en múltiples colores. Perfecta para galpones, bodegas y construcciones industriales.",
          caracteristicas: ["Alta resistencia a la corrosión","Alta resistencia al impacto","Alta resistencia a los rayos UV","Múltiples colores disponibles","Fácil instalación"],
          colores: [{nombre:"Rojo",hex:"#C62828",imagen:""},{nombre:"Azul",hex:"#1565C0",imagen:""},{nombre:"Verde",hex:"#2E7D32",imagen:""},{nombre:"Blanco",hex:"#F5F5F5",imagen:""},{nombre:"Gris",hex:"#757575",imagen:""}],
          ficha: [["Grosor","0.5mm"],["Material","Acero recubierto PVC"],["Largo","2m / 3m / 4m / 6m"],["Ancho útil","1000mm"],["Perfil","Trapezoidal 35/35"],["Garantía","20 años"]]
        }
      ]
    }
  ],
  // ── CATEGORÍAS DE PRODUCTOS (filtros del menú) ──
  productoCategorias: [
    { id: "todos",         nombre: "Todos",        icono: "fas fa-th-large",    filtro: "" },
    { id: "pvc",           nombre: "Tejas PVC",     icono: "fas fa-home",        filtro: "pvc" },
    { id: "policarbonato", nombre: "Policarbonato", icono: "fas fa-sun",         filtro: "policarbonato" },
    { id: "trapezoidal",   nombre: "Trapezoidal",   icono: "fas fa-layer-group", filtro: "trapezoidal" }
  ],
  tema: {
    colorPrimario:"#C9A84C", colorSecundario:"#E87820",
    colorFondo:"#111111",    colorFondo2:"#1A1A1A",
    colorTexto:"#F5F0E8",    colorAccent:"#1A7F6E",
    fuente:"Barlow",         fuenteTitulos:"Playfair Display"
  }
};

// ── VERSIÓN ──────────────────────────────────────────────────
const DATA_VERSION = "4.2";

function getSiteData() {
  try {
    const savedVer = localStorage.getItem("mc_ver");
    const saved    = localStorage.getItem("mc_data");
    // If version changed, clear stored data and use new defaults
    if (savedVer !== DATA_VERSION) {
      localStorage.removeItem("mc_data");
      localStorage.setItem("mc_ver", DATA_VERSION);
      return deepClone(SITE_DATA_DEFAULT);
    }
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return deepMerge(deepClone(SITE_DATA_DEFAULT), parsed);
      }
    }
  } catch(e) {
    console.warn("Error leyendo datos:", e.message);
    localStorage.removeItem("mc_data");
  }
  localStorage.setItem("mc_ver", DATA_VERSION);
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
    if (Array.isArray(source[key])) {
      target[key] = source[key];
    } else if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== "object") target[key] = {};
      deepMerge(target[key], source[key]);
    } else if (source[key] !== undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

// Recargar página cuando admin guarda
window.addEventListener("storage", (e) => {
  if (e.key === "mc_ts" && !window.__IS_ADMIN__) location.reload();
});

let SITE_DATA = getSiteData();
