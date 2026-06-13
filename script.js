const selectedDivision = document.querySelector("#selectedDivision");
const menuCategorias = document.querySelector("#menu-categorias");
const homeContent = document.querySelector("#homeContent");
const publicInfoContent = document.querySelector("#publicInfoContent");
const divisionContent = document.querySelector("#divisionContent");
const divisionLoader = document.querySelector(".division-loader");
const divisionView = document.querySelector("#divisionView");
const divisionTitle = document.querySelector("#divisionTitle");
const teamCarousel = document.querySelector("#teamCarousel");
const teamDetailView = document.querySelector("#teamDetailView");
const divisionTables = document.querySelector("#divisionTables");
const standingsBody = document.querySelector("#standingsBody");
const fixtureBody = document.querySelector("#fixtureBody");
const fixtureDateSelect = document.querySelector("#fixtureDateSelect");
const loginForm = document.querySelector("#loginForm");
const loginModalElement = document.querySelector("#loginModal");
const loginErrorModalElement = document.querySelector("#loginErrorModal");
const loginErrorMessage = document.querySelector("#loginErrorMessage");
const loginRetryButton = document.querySelector("[data-login-retry]");
const openLoginButton = document.querySelector("[data-bs-target='#loginModal']");
const sidebarContent = document.querySelector("#sidebarContent");
const contentShell = document.querySelector("#contentShell");
const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("[data-password-toggle]");
const darkModeToggle = document.querySelector("#darkModeToggle");
const observationModalElement = document.querySelector("#observationModal");
const observationModalBody = document.querySelector("#observationModalBody");
const newTeamModalElement = document.querySelector("#newTeamModal");
const newTeamForm = document.querySelector("#newTeamForm");
const newTeamName = document.querySelector("#newTeamName");
const newTeamShortName = document.querySelector("#newTeamShortName");
const newTeamCategory = document.querySelector("#newTeamCategory");
const newTeamDivision = document.querySelector("#newTeamDivision");
const createTeamButton = document.querySelector("#createTeamButton");
const newCategoryModalElement = document.querySelector("#newCategoryModal");
const newCategoryForm = document.querySelector("#newCategoryForm");
const newCategoryId = document.querySelector("#newCategoryId");
const newCategoryName = document.querySelector("#newCategoryName");
const newCategoryDescription = document.querySelector("#newCategoryDescription");
const createCategoryButton = document.querySelector("#createCategoryButton");
const adminDivisionModalElement = document.querySelector("#adminDivisionModal");
const adminDivisionForm = document.querySelector("#adminDivisionForm");
const adminDivisionId = document.querySelector("#adminDivisionId");
const adminDivisionCategory = document.querySelector("#adminDivisionCategory");
const adminDivisionName = document.querySelector("#adminDivisionName");
const adminDivisionDescription = document.querySelector("#adminDivisionDescription");
const saveDivisionButton = document.querySelector("#saveDivisionButton");
const adminObserverModalElement = document.querySelector("#adminObserverModal");
const adminObserverForm = document.querySelector("#adminObserverForm");
const adminObserverId = document.querySelector("#adminObserverId");
const adminObserverFirstName = document.querySelector("#adminObserverFirstName");
const adminObserverLastName = document.querySelector("#adminObserverLastName");
const adminObserverContact = document.querySelector("#adminObserverContact");
const adminObserverUsername = document.querySelector("#adminObserverUsername");
const adminObserverPassword = document.querySelector("#adminObserverPassword");
const adminObserverPasswordToggle = document.querySelector("[data-admin-observer-password-toggle]");
const adminObserverFeedback = document.querySelector("#adminObserverFeedback");
const saveObserverButton = document.querySelector("#saveObserverButton");
const newDelegateModalElement = document.querySelector("#newDelegateModal");
const newDelegateForm = document.querySelector("#newDelegateForm");
const newDelegateLastName = document.querySelector("#newDelegateLastName");
const newDelegateFirstName = document.querySelector("#newDelegateFirstName");
const newDelegateContact = document.querySelector("#newDelegateContact");
const newDelegateCategory = document.querySelector("#newDelegateCategory");
const newDelegateTeam = document.querySelector("#newDelegateTeam");
const newDelegateUsername = document.querySelector("#newDelegateUsername");
const newDelegatePassword = document.querySelector("#newDelegatePassword");
const delegatePasswordToggle = document.querySelector("[data-delegate-password-toggle]");
const createDelegateButton = document.querySelector("#createDelegateButton");
const newObserverModalElement = document.querySelector("#newObserverModal");
const newObserverForm = document.querySelector("#newObserverForm");
const newObserverLastName = document.querySelector("#newObserverLastName");
const newObserverFirstName = document.querySelector("#newObserverFirstName");
const newObserverContact = document.querySelector("#newObserverContact");
const newObserverUsername = document.querySelector("#newObserverUsername");
const newObserverPassword = document.querySelector("#newObserverPassword");
const newObserverUserFeedback = document.querySelector("#newObserverUserFeedback");
const observerPasswordToggle = document.querySelector("[data-observer-password-toggle]");
const createObserverButton = document.querySelector("#createObserverButton");
const delegatePlayerModalElement = document.querySelector("#delegatePlayerModal");
const delegatePlayerForm = document.querySelector("#delegatePlayerForm");
const delegatePlayerLastName = document.querySelector("#delegatePlayerLastName");
const delegatePlayerFirstName = document.querySelector("#delegatePlayerFirstName");
const delegatePlayerBirthDate = document.querySelector("#delegatePlayerBirthDate");
const delegatePlayerDni = document.querySelector("#delegatePlayerDni");
const delegatePlayerNumber = document.querySelector("#delegatePlayerNumber");
const saveDelegatePlayerButton = document.querySelector("#saveDelegatePlayerButton");

let divisionLoadTimer;
let selectedTeamId = null;
let activeObservationButton = null;
const playerObservations = {};
const playerObservationResolutions = {};
let adminSearchTimer;
let teamCarouselActiveIndex = 0;
const adminCategoriesState = {
  includeInactive: false,
  items: [],
  editingId: null
};
const adminDivisionsState = {
  includeInactive: false,
  items: [],
  categories: [],
  selectedCategory: "",
  editingId: null
};
const adminObserversState = {
  includeInactive: false,
  items: [],
  users: [],
  editingId: null,
  searchTerm: ""
};

const ADMIN_PAGE_SIZE = 20;
const DRIVE_FOLDER_ID = "1Rc5iI61AXuY-DjYL11cVGb7Wg3JTPLEj";
const THEME_STORAGE_KEY = "frame0-dark-mode";
const HELP_URLS = {
  admin: "https://sites.google.com/view/frame0-principal/inicio",
  observer: "https://sites.google.com/view/frame0-veedores/inicio",
  delegate: "https://sites.google.com/view/frame0-delegados/inicio"
};
const publicSettings = {
  instagramUrl: "#",
  facebookUrl: "#",
  whatsappPhone: "3510000000",
  locationTitle: "Córdoba Capital",
  locationText: "La sede principal del torneo estará ubicada en Córdoba Capital, con programación semanal y comunicación oficial para delegados antes de cada fecha.",
  contactTitle: "351 XXX XXXX",
  contactText: "Consultas por cupos, inscripción, documentación y calendario inicial. La atención se centraliza para mantener una comunicación clara con cada equipo.",
  regulationText: `La competencia se disputa bajo principios de juego limpio, respeto entre participantes y cumplimiento de la programación oficial informada por la organización. Cada equipo deberá presentar su lista de buena fe, contar con jugadores habilitados y respetar los horarios asignados para cada fecha.

Los partidos tendrán una duración definida por la organización según categoría y división. La tabla de posiciones se ordenará por puntos obtenidos, diferencia de gol, goles a favor y resultado entre equipos cuando corresponda. Las sanciones disciplinarias podrán incluir suspensión por acumulación de tarjetas, expulsiones directas o informes del veedor.

La organización podrá reprogramar encuentros por razones climáticas, disponibilidad de cancha o fuerza mayor. Todo reclamo deberá ser presentado por el delegado dentro de los plazos establecidos y será evaluado por la mesa organizadora.`
};
const PUBLIC_SETTINGS_CONFIG_KEY = "public_settings";
const tournamentSettings = {
  playerRegistrationFrom: "2026-06-01",
  playerRegistrationTo: "2026-07-31",
  divisions: {}
};
const aboutMembers = [
  {
    name: "Ignacio Cerutti",
    role: "Product Manager",
    image: "assets/about-ignacio.png"
  },
  {
    name: "Jorge Guerra",
    role: "Data Analytics",
    image: "assets/about-jorge.png"
  },
  {
    name: "Juan Pablo Valdivia",
    role: "Developer",
    image: "assets/about-juan.png"
  },
  {
    name: "Leonel Salguero",
    role: "Tester",
    image: "assets/about-leonel.png"
  }
];

function applyDarkMode(isDarkMode) {
  document.body.classList.toggle("dark-mode", isDarkMode);
  syncDarkModeControls(isDarkMode);
  localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? "true" : "false");
}

function syncDarkModeControls(isDarkMode) {
  document.querySelectorAll("[data-dark-mode-control]").forEach((control) => {
    control.checked = isDarkMode;
  });
}

function renderDarkModeSwitcher() {
  const isDarkMode = localStorage.getItem(THEME_STORAGE_KEY) === "true";

  return `
    <div class="theme-switcher profile-theme-switcher">
      <div>
        <span>DarkMode</span>
      </div>
      <label class="theme-switch">
        <input type="checkbox" data-dark-mode-control aria-label="Activar modo oscuro" ${isDarkMode ? "checked" : ""}>
        <span class="theme-slider"></span>
      </label>
    </div>
  `;
}

function getWhatsappUrl(phone) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  return cleanPhone ? `https://wa.me/54${cleanPhone}` : "#";
}

function setLinkIfExists(selector, href) {
  const link = document.querySelector(selector);
  if (!link) return;

  link.href = href || "#";
  link.target = href && href !== "#" ? "_blank" : "";
  link.rel = href && href !== "#" ? "noopener noreferrer" : "";
}

function applyPublicSettings() {
  const locationTitle = document.querySelector("#homeLocationTitle");
  const locationText = document.querySelector("#homeLocationText");
  const contactTitle = document.querySelector("#homeContactTitle");
  const contactText = document.querySelector("#homeContactText");

  if (locationTitle) locationTitle.textContent = publicSettings.locationTitle;
  if (locationText) locationText.textContent = publicSettings.locationText;
  if (contactTitle) contactTitle.textContent = publicSettings.contactTitle;
  if (contactText) contactText.textContent = publicSettings.contactText;

  setLinkIfExists("#homeInstagramLink", publicSettings.instagramUrl);
  setLinkIfExists("#loginInstagramLink", publicSettings.instagramUrl);
  setLinkIfExists("#homeFacebookLink", publicSettings.facebookUrl);
  setLinkIfExists("#loginFacebookLink", publicSettings.facebookUrl);
  setLinkIfExists("#homeWhatsappLink", getWhatsappUrl(publicSettings.whatsappPhone));
  setLinkIfExists("#loginWhatsappLink", getWhatsappUrl(publicSettings.whatsappPhone));
}

function getPublicSettingsPayload() {
  return {
    instagramUrl: publicSettings.instagramUrl,
    facebookUrl: publicSettings.facebookUrl,
    whatsappPhone: publicSettings.whatsappPhone,
    locationTitle: publicSettings.locationTitle,
    locationText: publicSettings.locationText,
    contactTitle: publicSettings.contactTitle,
    contactText: publicSettings.contactText,
    regulationText: publicSettings.regulationText
  };
}

function mergePublicSettings(settings = {}) {
  Object.keys(publicSettings).forEach((key) => {
    if (settings[key] !== undefined && settings[key] !== null) {
      publicSettings[key] = String(settings[key]);
    }
  });
}

async function loadPublicSettingsFromSupabase() {
  if (typeof supabaseClient === "undefined") return;

  const { data, error } = await supabaseClient
    .from("configuraciones")
    .select("valor")
    .eq("clave", PUBLIC_SETTINGS_CONFIG_KEY)
    .eq("activa", true)
    .maybeSingle();

  if (error) {
    console.error("Error al cargar redes y contacto desde Supabase:", error);
    return;
  }

  if (data?.valor && typeof data.valor === "object") {
    mergePublicSettings(data.valor);
    applyPublicSettings();
  }
}

async function savePublicSettingsToSupabase() {
  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no esta disponible.");
  }

  const { error } = await supabaseClient
    .from("configuraciones")
    .upsert({
      clave: PUBLIC_SETTINGS_CONFIG_KEY,
      valor: getPublicSettingsPayload(),
      descripcion: "Redes, contacto, ubicacion y reglamento publico de Frame0.",
      activa: true,
      updated_at: new Date().toISOString()
    }, { onConflict: "clave" });

  if (error) throw error;
}

// Cuenta registros de una tabla de Supabase sin traer filas al navegador.
async function contarRegistrosSupabase(nombreTabla) {
  if (typeof supabaseClient === "undefined") {
    console.error("Supabase no está disponible. Revisá la carga de supabaseClient.js.");
    return 0;
  }

  const { count, error } = await supabaseClient
    .from(nombreTabla)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error(`Error al contar registros de ${nombreTabla}:`, error);
    return 0;
  }

  return count ?? 0;
}

async function cargarResumenDashboard() {
  try {
    const [categorias, divisiones, equipos] = await Promise.all([
      contarRegistrosSupabase("categorias"),
      contarRegistrosSupabase("divisiones"),
      contarRegistrosSupabase("equipos")
    ]);

    const resumen = { categorias, divisiones, equipos };

    document.querySelectorAll("[data-dashboard-count]").forEach((element) => {
      const clave = element.dataset.dashboardCount;
      element.textContent = resumen[clave] ?? 0;
    });
  } catch (error) {
    console.error("Error al cargar el resumen del dashboard:", error);
  }
}


function limpiarSeleccionDivisiones() {
  document.querySelectorAll("[data-division]").forEach((item) => item.classList.remove("active"));
}

function agruparDivisionesPorCategoria(divisiones) {
  return divisiones.reduce((grupo, division) => {
    const categoriaId = String(division.categoria_id);
    if (!grupo[categoriaId]) {
      grupo[categoriaId] = [];
    }
    grupo[categoriaId].push(division);
    return grupo;
  }, {});
}

function renderMenuCategorias(categorias, divisiones) {
  const divisionesPorCategoria = agruparDivisionesPorCategoria(divisiones);
  const categoriasOrdenadas = [...categorias].sort((a, b) => {
    const nombreA = String(a.nombre || "").trim().toLowerCase();
    const nombreB = String(b.nombre || "").trim().toLowerCase();

    if (nombreA === "femenino") return 1;
    if (nombreB === "femenino") return -1;
    return nombreA.localeCompare(nombreB, "es");
  });

  if (!categoriasOrdenadas.length) {
    menuCategorias.innerHTML = `<div class="menu-empty">Sin categorías activas.</div>`;
    return;
  }

  menuCategorias.innerHTML = categoriasOrdenadas.map((categoria) => {
    const categoriaId = String(categoria.id);
    const panelId = `category-${categoriaId}`.replace(/[^a-zA-Z0-9_-]/g, "-");
    const divisionesCategoria = divisionesPorCategoria[categoriaId] || [];
    console.log(`Divisiones para ${categoria.nombre}:`, divisionesCategoria);
    const divisionesHtml = divisionesCategoria.length
      ? divisionesCategoria.map((division) => `
        <button class="division-link" type="button" data-division="${escapeHtml(division.nombre)}" data-division-id="${division.id}">
          ${escapeHtml(division.nombre)}
        </button>
      `).join("")
      : `<div class="menu-empty">Sin divisiones</div>`;

    return `
      <div class="accordion-item">
        <h3 class="accordion-header">
          <button class="accordion-button collapsed" type="button" data-category-toggle="${panelId}" aria-expanded="false" aria-controls="${panelId}">
            ${escapeHtml(categoria.nombre)}
          </button>
        </h3>
        <div id="${panelId}" class="accordion-collapse menu-category-panel">
          <div class="accordion-body">
            ${divisionesHtml}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

async function cargarMenuCategorias() {
  if (!menuCategorias) return;

  try {
    const [{ data: categorias, error: categoriasError }, { data: divisiones, error: divisionesError }] = await Promise.all([
      supabaseClient
        .from("categorias")
        .select("id,nombre,activa")
        .eq("activa", true)
        .order("nombre", { ascending: true }),
      supabaseClient
        .from("divisiones")
        .select("id,nombre,categoria_id,activa")
        .eq("activa", true)
        .order("nombre", { ascending: true })
    ]);

    if (categoriasError) {
      console.error("Error al cargar categorías del menú:", categoriasError);
    }

    if (divisionesError) {
      console.error("Error al cargar divisiones del menú:", divisionesError);
    }

    const categoriasActivas = categoriasError ? [] : (categorias || []);
    const divisionesActivas = divisionesError ? [] : (divisiones || []);

    console.log("Menú categorías:", categoriasActivas);
    console.log("Menú divisiones:", divisionesActivas);

    renderMenuCategorias(categoriasActivas, divisionesActivas);
  } catch (error) {
    console.error("Error al cargar el menú de categorías:", error);
    menuCategorias.innerHTML = `<div class="menu-empty">No se pudo cargar el menú.</div>`;
  }
}

function getAboutCarouselClass(index, activeIndex) {
  const total = aboutMembers.length;
  const previousIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  if (index === activeIndex) return "active";
  if (index === previousIndex) return "previous";
  if (index === nextIndex) return "next";
  return "hidden";
}

function createDemoPlayers(prefix, goalsBase = 0) {
  const names = [
    "Santiago Molina",
    "Lucas Pereira",
    "Mateo Vargas",
    "Nicolás Duarte",
    "Franco Acosta",
    "Tomás Rivas",
    "Bruno Herrera",
    "Julián Morales",
    "Agustín Campos",
    "Pablo Ferreyra",
    "Ramiro Costa",
    "Enzo Medina",
    "Alan Cabrera",
    "Martín Castro",
    "Lautaro Díaz"
  ];

  return names.map((name, index) => ({
    number: index + 1,
    name: `${name} ${prefix}`,
    age: 22 + (index % 10),
    goals: index % 4 === 0 ? goalsBase + 2 : index % 5 === 0 ? 1 : 0,
    yellow: index % 3,
    red: index === 4 ? 1 : 0
  }));
}

const teams = [
  {
    id: "belgrano",
    name: "Belgrano de Córdoba",
    legalName: "Club Atlético Belgrano",
    abbreviation: "CAB",
    shortName: "Belgrano",
    initials: "BEL",
    crest: "assets/team-belgrano.svg",
    colors: ["#58aee8", "#111827"],
    shirtColors: ["#58aee8", "#111827", "#ffffff"],
    city: "Córdoba Capital",
    captain: "Matías Rojas",
    delegate: "Hernán Suárez",
    contact: "351555555",
    topScorer: "Pablo Heredia",
    mostSanctioned: "Iván Molina",
    players: [
      { number: 1, name: "Pablo Heredia", age: 28, goals: 6, yellow: 1, red: 0 },
      { number: 4, name: "Iván Molina", age: 31, goals: 0, yellow: 4, red: 1 },
      { number: 7, name: "Franco Nieto", age: 24, goals: 3, yellow: 0, red: 0 },
      { number: 9, name: "Agustín Peralta", age: 27, goals: 5, yellow: 2, red: 0 },
      { number: 10, name: "Juan Sosa", age: 25, goals: 2, yellow: 1, red: 0 },
      { number: 14, name: "Lucas Arce", age: 29, goals: 0, yellow: 2, red: 0 },
      { number: 18, name: "Tomás Ferreyra", age: 23, goals: 1, yellow: 0, red: 0 },
      { number: 22, name: "Martín Quiroga", age: 32, goals: 0, yellow: 1, red: 0 },
      { number: 2, name: "Emiliano Díaz", age: 26, goals: 0, yellow: 1, red: 0 },
      { number: 5, name: "Rodrigo Ponce", age: 30, goals: 1, yellow: 2, red: 0 },
      { number: 6, name: "Maximiliano Acuña", age: 28, goals: 0, yellow: 0, red: 0 },
      { number: 11, name: "Germán Salvatierra", age: 24, goals: 2, yellow: 1, red: 0 },
      { number: 15, name: "Ezequiel Molina", age: 27, goals: 0, yellow: 3, red: 0 },
      { number: 19, name: "Nahuel Ortiz", age: 23, goals: 1, yellow: 0, red: 0 },
      { number: 21, name: "Sebastián Roldán", age: 29, goals: 0, yellow: 1, red: 0 }
    ],
    founded: "Equipo invitado",
    description: "Plantel competitivo de la zona norte, fuerte en pelota parada y transiciones rápidas."
  },
  {
    id: "instituto",
    name: "Instituto Atlético Central Córdoba",
    legalName: "Instituto Atlético Central Córdoba",
    abbreviation: "IACC",
    shortName: "Instituto",
    initials: "INS",
    crest: "assets/team-instituto.svg",
    colors: ["#e11d48", "#ffffff"],
    shirtColors: ["#e11d48", "#ffffff"],
    city: "Alta Córdoba",
    captain: "Lucas Gómez",
    delegate: "Ignacio Cerutti",
    contact: "351444444",
    topScorer: "Lucas Gómez",
    mostSanctioned: "Emanuel Pérez",
    players: [
      { number: 1, name: "Lucas Gómez", age: 30, goals: 4, yellow: 1, red: 0 },
      { number: 2, name: "Emanuel Pérez", age: 29, goals: 0, yellow: 5, red: 1 },
      { number: 5, name: "Mateo Roldán", age: 22, goals: 1, yellow: 2, red: 0 },
      { number: 8, name: "Facundo Vega", age: 26, goals: 2, yellow: 1, red: 0 },
      { number: 11, name: "Joaquín Ruiz", age: 24, goals: 3, yellow: 0, red: 0 },
      { number: 13, name: "Nicolás Castro", age: 28, goals: 0, yellow: 2, red: 0 },
      { number: 17, name: "Alan Moreno", age: 25, goals: 1, yellow: 1, red: 0 },
      { number: 20, name: "Brian Díaz", age: 27, goals: 0, yellow: 0, red: 0 },
      { number: 3, name: "Gonzalo Alarcón", age: 25, goals: 0, yellow: 1, red: 0 },
      { number: 4, name: "Ramiro Juárez", age: 31, goals: 0, yellow: 2, red: 0 },
      { number: 6, name: "Sebastián Vera", age: 26, goals: 1, yellow: 0, red: 0 },
      { number: 9, name: "Ignacio Cerutti", age: 29, goals: 2, yellow: 1, red: 0 },
      { number: 14, name: "Mauricio Cabrera", age: 28, goals: 0, yellow: 3, red: 0 },
      { number: 18, name: "Franco Bustos", age: 24, goals: 1, yellow: 0, red: 0 },
      { number: 22, name: "Tomás Navarro", age: 23, goals: 0, yellow: 1, red: 0 }
    ],
    founded: "Equipo invitado",
    description: "Equipo intenso, con presión alta y buen volumen ofensivo por las bandas."
  },
  {
    id: "boca",
    name: "Boca Juniors",
    legalName: "Club Atlético Boca Juniors",
    abbreviation: "CABJ",
    shortName: "Boca",
    initials: "BOC",
    crest: "assets/team-boca.svg",
    colors: ["#0033a0", "#f7c600"],
    shirtColors: ["#0033a0", "#f7c600"],
    city: "Buenos Aires",
    captain: "Nicolás Vega",
    delegate: "Rodrigo Méndez",
    contact: "351333333",
    topScorer: "Nicolás Vega",
    mostSanctioned: "Lautaro Silva",
    players: [
      { number: 1, name: "Nicolás Vega", age: 29, goals: 5, yellow: 1, red: 0 },
      { number: 3, name: "Lautaro Silva", age: 27, goals: 0, yellow: 4, red: 0 },
      { number: 6, name: "Diego Romero", age: 31, goals: 1, yellow: 2, red: 0 },
      { number: 9, name: "Matías Ocampo", age: 25, goals: 3, yellow: 1, red: 0 },
      { number: 10, name: "Enzo Farías", age: 24, goals: 2, yellow: 0, red: 0 },
      { number: 15, name: "Bruno Acosta", age: 28, goals: 0, yellow: 1, red: 1 },
      { number: 18, name: "Santiago Leiva", age: 23, goals: 1, yellow: 0, red: 0 },
      { number: 21, name: "Kevin Torres", age: 26, goals: 0, yellow: 2, red: 0 },
      { number: 2, name: "Agustín Ledesma", age: 23, goals: 0, yellow: 1, red: 0 },
      { number: 5, name: "Gabriel Moyano", age: 30, goals: 0, yellow: 2, red: 0 },
      { number: 8, name: "Lucas Ceballos", age: 27, goals: 1, yellow: 1, red: 0 },
      { number: 11, name: "Julián Molina", age: 24, goals: 2, yellow: 0, red: 0 },
      { number: 13, name: "Fernando Salas", age: 29, goals: 0, yellow: 3, red: 0 },
      { number: 16, name: "Matías Barrera", age: 25, goals: 1, yellow: 0, red: 0 },
      { number: 22, name: "Tomás Herrera", age: 22, goals: 0, yellow: 1, red: 0 }
    ],
    founded: "Equipo invitado",
    description: "Conjunto ordenado, de bloque compacto y buen rendimiento en partidos cerrados."
  },
  {
    id: "river",
    name: "River Plate",
    legalName: "Club Atlético River Plate",
    abbreviation: "CARP",
    shortName: "River",
    initials: "RIV",
    crest: "assets/team-river.svg",
    colors: ["#ffffff", "#d71920"],
    shirtColors: ["#ffffff", "#d71920", "#111827"],
    city: "Buenos Aires",
    captain: "Santiago Arias",
    delegate: "Gabriel Núñez",
    contact: "351222222",
    topScorer: "Santiago Arias",
    mostSanctioned: "Ramiro Luna",
    players: [
      { number: 1, name: "Santiago Arias", age: 27, goals: 4, yellow: 1, red: 0 },
      { number: 4, name: "Ramiro Luna", age: 30, goals: 0, yellow: 4, red: 1 },
      { number: 6, name: "Federico Vera", age: 25, goals: 1, yellow: 2, red: 0 },
      { number: 8, name: "Ignacio Campos", age: 26, goals: 2, yellow: 1, red: 0 },
      { number: 10, name: "Ezequiel Ríos", age: 24, goals: 3, yellow: 0, red: 0 },
      { number: 14, name: "Gonzalo Medina", age: 28, goals: 0, yellow: 2, red: 0 },
      { number: 19, name: "Manuel Cabrera", age: 22, goals: 1, yellow: 1, red: 0 },
      { number: 23, name: "Andrés Godoy", age: 29, goals: 0, yellow: 0, red: 0 },
      { number: 2, name: "Pablo Giménez", age: 26, goals: 0, yellow: 1, red: 0 },
      { number: 3, name: "Leandro Morales", age: 28, goals: 0, yellow: 2, red: 0 },
      { number: 7, name: "Franco Mercado", age: 24, goals: 2, yellow: 0, red: 0 },
      { number: 9, name: "Nicolás Suárez", age: 27, goals: 3, yellow: 1, red: 0 },
      { number: 15, name: "Juan Maldonado", age: 30, goals: 0, yellow: 3, red: 0 },
      { number: 18, name: "Alan Pereyra", age: 23, goals: 1, yellow: 0, red: 0 },
      { number: 21, name: "Marcos Toledo", age: 25, goals: 0, yellow: 1, red: 0 }
    ],
    founded: "Equipo invitado",
    description: "Equipo de posesión, salida limpia y mucha llegada desde segunda línea."
  },
  {
    id: "real",
    name: "Real Madrid",
    legalName: "Real Madrid Club de Fútbol",
    abbreviation: "RMA",
    shortName: "Real Madrid",
    initials: "RMA",
    crest: "assets/team-real.svg",
    colors: ["#ffffff", "#d4af37"],
    shirtColors: ["#ffffff", "#d4af37", "#4f46e5"],
    city: "Madrid",
    captain: "Federico Luna",
    delegate: "Daniel Ortega",
    contact: "351666666",
    topScorer: "Federico Luna",
    mostSanctioned: "Álvaro Martín",
    players: [
      { number: 1, name: "Federico Luna", age: 28, goals: 5, yellow: 1, red: 0 },
      { number: 2, name: "Álvaro Martín", age: 30, goals: 0, yellow: 4, red: 0 },
      { number: 5, name: "Mario Benítez", age: 31, goals: 1, yellow: 2, red: 0 },
      { number: 7, name: "Rafael Gil", age: 25, goals: 4, yellow: 0, red: 0 },
      { number: 10, name: "Hugo Blanco", age: 27, goals: 2, yellow: 1, red: 0 },
      { number: 12, name: "Carlos Méndez", age: 24, goals: 0, yellow: 3, red: 1 },
      { number: 16, name: "Sergio Vidal", age: 29, goals: 1, yellow: 1, red: 0 },
      { number: 20, name: "Pablo Costa", age: 26, goals: 0, yellow: 0, red: 0 },
      { number: 3, name: "Joaquín Serrano", age: 24, goals: 0, yellow: 1, red: 0 },
      { number: 4, name: "Esteban Castro", age: 29, goals: 0, yellow: 2, red: 0 },
      { number: 6, name: "Martín Salcedo", age: 27, goals: 1, yellow: 1, red: 0 },
      { number: 9, name: "Lucas Fernández", age: 25, goals: 3, yellow: 0, red: 0 },
      { number: 13, name: "Diego Ibarra", age: 31, goals: 0, yellow: 3, red: 0 },
      { number: 17, name: "Nahuel Pérez", age: 23, goals: 1, yellow: 0, red: 0 },
      { number: 22, name: "Rodrigo Álvarez", age: 28, goals: 0, yellow: 1, red: 0 }
    ],
    founded: "Equipo invitado",
    description: "Plantel equilibrado, con buen manejo de tiempos y pegada desde media distancia."
  },
  {
    id: "barcelona",
    name: "Barcelona",
    legalName: "Fútbol Club Barcelona",
    abbreviation: "FCB",
    shortName: "Barcelona",
    initials: "BAR",
    crest: "assets/team-barcelona.svg",
    colors: ["#a50044", "#004d98"],
    shirtColors: ["#a50044", "#004d98", "#fbbf24"],
    city: "Barcelona",
    captain: "Julián Paredes",
    delegate: "Sebastián Rivas",
    contact: "351777777",
    topScorer: "Julián Paredes",
    mostSanctioned: "Maxi Salas",
    players: [
      { number: 1, name: "Julián Paredes", age: 26, goals: 6, yellow: 0, red: 0 },
      { number: 3, name: "Maxi Salas", age: 28, goals: 1, yellow: 4, red: 1 },
      { number: 5, name: "Pedro Font", age: 30, goals: 0, yellow: 2, red: 0 },
      { number: 8, name: "Axel Ramos", age: 24, goals: 3, yellow: 1, red: 0 },
      { number: 10, name: "Cristian Díaz", age: 27, goals: 5, yellow: 0, red: 0 },
      { number: 11, name: "Leo Suárez", age: 25, goals: 2, yellow: 1, red: 0 },
      { number: 17, name: "Marcos Peña", age: 23, goals: 1, yellow: 0, red: 0 },
      { number: 22, name: "Adrián Vera", age: 29, goals: 0, yellow: 2, red: 0 },
      { number: 2, name: "Federico Sosa", age: 26, goals: 0, yellow: 1, red: 0 },
      { number: 4, name: "Bruno Medina", age: 30, goals: 0, yellow: 2, red: 0 },
      { number: 6, name: "Lautaro Giménez", age: 25, goals: 1, yellow: 1, red: 0 },
      { number: 9, name: "Mateo Almirón", age: 24, goals: 3, yellow: 0, red: 0 },
      { number: 13, name: "Germán Páez", age: 31, goals: 0, yellow: 3, red: 0 },
      { number: 16, name: "Tomás Quiroga", age: 23, goals: 1, yellow: 0, red: 0 },
      { number: 19, name: "Iván Cabrera", age: 28, goals: 0, yellow: 1, red: 0 }
    ],
    founded: "Equipo invitado",
    description: "Equipo asociado, de pases cortos y ataques elaborados por dentro."
  },
  {
    id: "manchester",
    name: "Manchester United",
    legalName: "Manchester United Football Club",
    abbreviation: "MUFC",
    shortName: "Man. United",
    initials: "MUN",
    crest: "assets/team-manchester.svg",
    colors: ["#da291c", "#111827"],
    shirtColors: ["#da291c", "#111827", "#ffffff"],
    city: "Manchester",
    captain: "Bruno Silva",
    delegate: "Mauro Gutiérrez",
    contact: "351888888",
    topScorer: "Bruno Silva",
    mostSanctioned: "Tomás Brown",
    players: [
      { number: 1, name: "Bruno Silva", age: 29, goals: 4, yellow: 1, red: 0 },
      { number: 4, name: "Tomás Brown", age: 31, goals: 0, yellow: 5, red: 1 },
      { number: 6, name: "Alan Smith", age: 27, goals: 1, yellow: 2, red: 0 },
      { number: 8, name: "Franco Gómez", age: 25, goals: 2, yellow: 1, red: 0 },
      { number: 9, name: "Miguel Torres", age: 24, goals: 3, yellow: 0, red: 0 },
      { number: 12, name: "Javier Ruiz", age: 28, goals: 0, yellow: 3, red: 0 },
      { number: 18, name: "Nico Herrera", age: 23, goals: 1, yellow: 1, red: 0 },
      { number: 21, name: "Damián López", age: 30, goals: 0, yellow: 0, red: 0 },
      { number: 2, name: "Cristian Romero", age: 27, goals: 0, yellow: 1, red: 0 },
      { number: 5, name: "Pablo Núñez", age: 29, goals: 0, yellow: 2, red: 0 },
      { number: 7, name: "Emiliano Torres", age: 24, goals: 2, yellow: 0, red: 0 },
      { number: 10, name: "Joaquín López", age: 25, goals: 3, yellow: 1, red: 0 },
      { number: 14, name: "Matías Robles", age: 31, goals: 0, yellow: 3, red: 0 },
      { number: 17, name: "Agustín Arias", age: 23, goals: 1, yellow: 0, red: 0 },
      { number: 22, name: "Santiago Molina", age: 28, goals: 0, yellow: 1, red: 0 }
    ],
    founded: "Equipo invitado",
    description: "Equipo físico, vertical y peligroso cuando encuentra espacios para correr."
  },
  {
    id: "inter",
    name: "Inter de Milán",
    legalName: "Football Club Internazionale Milano",
    abbreviation: "INT",
    shortName: "Inter",
    initials: "INT",
    crest: "assets/team-inter.svg",
    colors: ["#0057b8", "#111827"],
    shirtColors: ["#0057b8", "#111827", "#ffffff"],
    city: "Milán",
    captain: "Valentín Moretti",
    delegate: "Federico Conti",
    contact: "351999101",
    topScorer: "Valentín Moretti",
    mostSanctioned: "Bruno Herrera Inter",
    players: createDemoPlayers("Inter", 3),
    founded: "Equipo invitado",
    description: "Plantel compacto, con buena presión tras pérdida y ataques rápidos por los costados."
  },
  {
    id: "roma",
    name: "Roma",
    legalName: "Associazione Sportiva Roma",
    abbreviation: "ASR",
    shortName: "Roma",
    initials: "ROM",
    crest: "assets/team-roma.svg",
    colors: ["#8e1f2f", "#f0bc42"],
    shirtColors: ["#8e1f2f", "#f0bc42", "#ffffff"],
    city: "Roma",
    captain: "Matías Mancini",
    delegate: "Diego Romano",
    contact: "351999102",
    topScorer: "Matías Mancini",
    mostSanctioned: "Ramiro Costa Roma",
    players: createDemoPlayers("Roma", 2),
    founded: "Equipo invitado",
    description: "Equipo de mucha intensidad, fuerte en duelos individuales y con buen juego directo."
  },
  {
    id: "coritiba",
    name: "Coritiba",
    legalName: "Coritiba Foot Ball Club",
    abbreviation: "CFC",
    shortName: "Coritiba",
    initials: "CFC",
    crest: "assets/team-coritiba.svg",
    colors: ["#006b3f", "#ffffff"],
    shirtColors: ["#006b3f", "#ffffff"],
    city: "Curitiba",
    captain: "João Ferreira",
    delegate: "Rafael Silva",
    contact: "351999103",
    topScorer: "João Ferreira",
    mostSanctioned: "Mateo Vargas Coritiba",
    players: createDemoPlayers("Coritiba", 1),
    founded: "Equipo invitado",
    description: "Conjunto ordenado, solidario en defensa y peligroso cuando acelera en transición."
  }
];

playerObservations[getPlayerObservationKey("v-3", "real", teams.find((team) => team.id === "real").players[0])] = "Insultó al arbitro, agravante 2";

const standings = [
  { teamId: "belgrano", pts: 12, pj: 4, g: 4, e: 0, p: 0, dg: 9 },
  { teamId: "barcelona", pts: 10, pj: 4, g: 3, e: 1, p: 0, dg: 8 },
  { teamId: "real", pts: 9, pj: 4, g: 3, e: 0, p: 1, dg: 6 },
  { teamId: "river", pts: 7, pj: 4, g: 2, e: 1, p: 1, dg: 3 },
  { teamId: "boca", pts: 6, pj: 4, g: 2, e: 0, p: 2, dg: 1 },
  { teamId: "inter", pts: 6, pj: 4, g: 1, e: 3, p: 0, dg: 2 },
  { teamId: "roma", pts: 4, pj: 4, g: 1, e: 1, p: 2, dg: -1 },
  { teamId: "instituto", pts: 3, pj: 4, g: 1, e: 0, p: 3, dg: -4 },
  { teamId: "coritiba", pts: 2, pj: 4, g: 0, e: 2, p: 2, dg: -5 },
  { teamId: "manchester", pts: 1, pj: 4, g: 0, e: 1, p: 3, dg: -8 }
];

const fixtures = {
  1: [
    { status: "Final", home: "belgrano", away: "instituto", homeGoals: 2, awayGoals: 1 },
    { status: "Final", home: "boca", away: "river", homeGoals: 1, awayGoals: 1 },
    { status: "Final", home: "real", away: "barcelona", homeGoals: 2, awayGoals: 3 },
    { status: "Final", home: "inter", away: "roma", homeGoals: 2, awayGoals: 2 },
    { status: "Final", home: "coritiba", away: "manchester", homeGoals: 1, awayGoals: 1 }
  ],
  2: [
    { status: "Final", home: "barcelona", away: "manchester", homeGoals: 4, awayGoals: 0 },
    { status: "Final", home: "river", away: "belgrano", homeGoals: 2, awayGoals: 0 },
    { status: "Final", home: "instituto", away: "boca", homeGoals: 0, awayGoals: 1 },
    { status: "Final", home: "roma", away: "coritiba", homeGoals: 1, awayGoals: 0 },
    { status: "Final", home: "inter", away: "real", homeGoals: 1, awayGoals: 1 }
  ],
  3: [
    { status: "A disputar", home: "belgrano", away: "boca", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "instituto", away: "real", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "manchester", away: "river", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "roma", away: "barcelona", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "coritiba", away: "inter", homeGoals: null, awayGoals: null }
  ],
  4: [
    { status: "A disputar", home: "barcelona", away: "belgrano", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "boca", away: "real", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "river", away: "instituto", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "inter", away: "manchester", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "coritiba", away: "roma", homeGoals: null, awayGoals: null }
  ]
};

const observerMatches = [
  { id: "v-1", date: "08/06/2026", home: "belgrano", away: "instituto", homeGoals: 2, awayGoals: 1 },
  { id: "v-2", date: "08/06/2026", home: "boca", away: "river", homeGoals: 1, awayGoals: 1 },
  { id: "v-3", date: "08/06/2026", fixtureDate: "Fecha 3", home: "real", away: "barcelona", homeGoals: null, awayGoals: null, reporter: "Carlos Gigli" },
  { id: "v-4", date: "08/06/2026", home: "manchester", away: "belgrano", homeGoals: null, awayGoals: null },
  { id: "v-5", date: "09/06/2026", home: "inter", away: "roma", homeGoals: null, awayGoals: null },
  { id: "v-6", date: "10/06/2026", home: "coritiba", away: "barcelona", homeGoals: null, awayGoals: null }
];

const observers = [
  { id: 1, name: "Santiago Ferreyra", contact: "351555101", username: "veedor", password: "123456" },
  { id: 2, name: "Marcos Bustos", contact: "351555102", username: "veedor.bustos", password: "123456" },
  { id: 3, name: "Camila Roldán", contact: "351555103", username: "veedor.roldan", password: "123456" },
  { id: 4, name: "Nicolás Peralta", contact: "351555104", username: "veedor.peralta", password: "123456" }
];

function getTeam(teamId) {
  return teams.find((team) => team.id === teamId);
}

function getPlayerObservationKey(matchId, teamId, player) {
  return `${matchId || "sin-partido"}::${teamId}::${player.number}::${player.name}`;
}

function parsePlayerObservationKey(key) {
  const [matchId, teamId, number, ...nameParts] = String(key || "").split("::");
  return {
    matchId,
    teamId,
    number: Number(number),
    playerName: nameParts.join("::")
  };
}

function getPlayerFromObservationKey(key) {
  const { teamId, number, playerName } = parsePlayerObservationKey(key);
  const team = getTeam(teamId);
  if (!team) return null;

  const player = team.players.find((item) => item.number === number && item.name === playerName);
  return player ? { ...player, team } : null;
}

function getPlayerObservationCount() {
  return Object.entries(playerObservations)
    .filter(([key, text]) => String(text || "").trim() && !playerObservationResolutions[key])
    .length;
}

function getFixtureDateLabel(match) {
  if (!match) return "Sin fixture asociado";
  if (match.fixtureDate) return match.fixtureDate;

  const fixtureMatch = Object.entries(fixtures).find(([, matches]) =>
    matches.some((fixture) => fixture.home === match.home && fixture.away === match.away)
  );

  return fixtureMatch ? `Fecha ${fixtureMatch[0]}` : "Sin fixture asociado";
}

function getObservationReporter(matchId) {
  const match = getObserverMatch(matchId);
  if (match?.reporter) return match.reporter;

  const matchIndex = observerMatches.findIndex((match) => match.id === matchId);
  return observers[matchIndex >= 0 ? matchIndex % observers.length : 0]?.name || "Veedor no informado";
}

function getPlayerStatusKey(player) {
  return `${player.team?.id || ""}::${player.number}::${player.name}`;
}

function getResolvedPlayerStatus(player) {
  const resolution = Object.values(playerObservationResolutions).find((item) =>
    item.playerKey === getPlayerStatusKey(player) && item.status
  );
  return resolution?.status || "";
}

function getPlayerDisciplinaryNotifications(player) {
  return getPlayerObservationsForAdmin(player).filter((observation) =>
    observation.text || observation.resolution?.detail
  );
}

function renderObservationNotificationSummary(player) {
  const notifications = getPlayerDisciplinaryNotifications(player);
  if (!notifications.length) {
    return `<span class="admin-observation-empty">Sin novedades</span>`;
  }

  return `
    <button class="admin-observation-view" type="button" data-player-history="${escapeHtml(getPlayerStatusKey(player))}">
      <i class="bi bi-bell-fill"></i>
      Ver (${notifications.length})
    </button>
  `;
}

function updatePlayerObservationBadge() {
  document.querySelectorAll("[data-player-observation-count]").forEach((badge) => {
    badge.textContent = getPlayerObservationCount();
  });
}

function getPlayerObservationsForAdmin(player) {
  return Object.entries(playerObservations)
    .filter(([key, text]) => key.includes(`::${player.team.id}::${player.number}::${player.name}`) && String(text || "").trim())
    .map(([key, text]) => {
      const [matchId] = key.split("::");
      const match = getObserverMatch(matchId);
      const matchLabel = match ? `${match.date} - ${getTeam(match.home)?.shortName || ""} vs ${getTeam(match.away)?.shortName || ""}` : "Partido";
      const resolution = playerObservationResolutions[key] || null;

      return {
        key,
        calendarDate: match?.date || "Sin fecha calendario",
        fixtureDate: getFixtureDateLabel(match),
        matchLabel,
        reporter: getObservationReporter(matchId),
        resolution,
        text: String(text).trim()
      };
    });
}

function getPendingPlayerObservationsForAdmin(player) {
  return getPlayerObservationsForAdmin(player).filter((observation) => !observation.resolution);
}

function renderPlayerObservationSummary(observations) {
  if (!observations.length) {
    return `<span class="admin-observation-empty">Sin observaciones</span>`;
  }

  return `
    <button class="admin-observation-view" type="button" data-admin-player-observation="${escapeHtml(observations[0].key)}">
      <i class="bi bi-file-earmark-text-fill"></i>
      Ver (${observations.length})
    </button>
  `;
}

function getObservedPlayersCount(selectedTeamId = "") {
  return teams
    .filter((team) => !selectedTeamId || team.id === selectedTeamId)
    .flatMap((team) => team.players.map((player) => ({ ...player, team })))
    .filter((player) => getPendingPlayerObservationsForAdmin(player).length > 0)
    .length;
}

function getAdminPlayerObservationMetricRows(selectedCategory = "", selectedDivision = "", selectedTeamId = "") {
  const observedCount = getObservedPlayersCount(selectedTeamId);
  if (!observedCount) return [];

  if (selectedCategory && selectedDivision) {
    return [{ category: selectedCategory, division: selectedDivision, observed: observedCount }];
  }

  const firstCategory = getAdminMetrics().categories[0];
  const firstDivision = firstCategory?.divisions[0];
  if (!firstCategory || !firstDivision) return [];

  return [{ category: firstCategory.name, division: firstDivision.name, observed: observedCount }];
}

function renderAdminPlayerObservationMetrics(selectedCategory = "", selectedDivision = "", selectedTeamId = "") {
  const rows = getAdminPlayerObservationMetricRows(selectedCategory, selectedDivision, selectedTeamId);

  if (!rows.length) {
    return `
      <div class="admin-player-observation-empty">
        En estos momentos no se encuentran jugadores observados
      </div>
    `;
  }

  return `
    <div class="admin-player-observation-summary table-responsive" aria-label="Resumen de jugadores observados">
      <table class="table frame-table admin-observed-summary-table mb-0">
        <thead>
          <tr>
            <th>Categor&iacute;a</th>
            <th>Divisi&oacute;n</th>
            <th>Observados</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${escapeHtml(row.category)}</td>
              <td>${escapeHtml(row.division)}</td>
              <td>${row.observed}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function setObservationModalHeading(kicker, title) {
  const modalKicker = observationModalElement?.querySelector(".section-kicker");
  const modalTitle = observationModalElement?.querySelector("#observationModalLabel");
  if (modalKicker) modalKicker.textContent = kicker;
  if (modalTitle) modalTitle.textContent = title;
}

function renderObservationEditorBody(text = "") {
  setObservationModalHeading("Veedor", "Observación disciplinaria");
  observationModalBody.innerHTML = `
    <label for="observationText" class="form-label">Detalle de la observación</label>
    <textarea class="form-control observation-textarea" id="observationText" rows="5" placeholder="Escribí la observación del jugador...">${escapeHtml(text)}</textarea>
    <button class="btn btn-login-submit w-100 mt-3" type="button" id="saveObservation">
      <i class="bi bi-check2-circle"></i>
      Guardar observación
    </button>
  `;
}

function autoResizeTextarea(textarea) {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function autoResizeObservationTextareas() {
  observationModalBody?.querySelectorAll("[data-auto-resize-textarea]").forEach(autoResizeTextarea);
}

function getObservationContext(observationKey) {
  const player = getPlayerFromObservationKey(observationKey);
  const observation = player ? getPlayerObservationsForAdmin(player).find((item) => item.key === observationKey) : null;
  return { player, observation };
}

function renderObservationReviewBody(observationKey, options = {}) {
  const { readOnlyResolution = false } = options;
  const { player, observation } = getObservationContext(observationKey);

  if (!player || !observation) {
    setObservationModalHeading("Administrador", "Observación disciplinaria");
    observationModalBody.innerHTML = `<div class="admin-empty-row">No se encontró la observación seleccionada.</div>`;
    return;
  }

  const selectedCategory = contentShell.querySelector("[data-admin-player-category]")?.value || getAdminMetrics().categories[0]?.name || "-";
  const selectedDivision = contentShell.querySelector("[data-admin-player-division]")?.value || getAdminMetrics().categories[0]?.divisions[0]?.name || "-";
  const resolution = observation.resolution || {};

  setObservationModalHeading("Administrador", readOnlyResolution ? "Historial disciplinario" : "Resolución de observación");
  observationModalBody.innerHTML = `
    <div class="observation-review" data-observation-review="${escapeHtml(observationKey)}">
      <div class="observation-review-meta">
        <span><strong>Fecha calendario</strong>${escapeHtml(observation.calendarDate)}</span>
        <span><strong>Fecha fixture</strong>${escapeHtml(observation.fixtureDate)}</span>
        <span><strong>Veedor</strong>${escapeHtml(observation.reporter)}</span>
      </div>

      <div class="observation-review-pair">
        <div><span>Categoría</span><strong>${escapeHtml(selectedCategory)}</strong></div>
        <div><span>División</span><strong>${escapeHtml(selectedDivision)}</strong></div>
      </div>

      <div class="observation-review-player">
        <span>Jugador</span>
        <strong>${escapeHtml(player.name)}</strong>
        <small>${escapeHtml(player.team.shortName)}</small>
      </div>

      <label class="form-label" for="observationReadonlyText">Detalle de la observación</label>
      <textarea class="form-control observation-textarea observation-readonly-viewer" id="observationReadonlyText" rows="1" readonly data-auto-resize-textarea>${escapeHtml(observation.text)}</textarea>

      ${readOnlyResolution ? `
        <label class="admin-filter-field observation-resolution-readonly">
          <span>Detalle de la resolución</span>
          <textarea class="form-control observation-auto-textarea" rows="1" readonly data-auto-resize-textarea>${escapeHtml(resolution.detail || "Sin resolución cargada")}</textarea>
        </label>
      ` : `
        <div class="observation-resolution-grid">
          <label class="admin-filter-field observation-resolution-detail">
            <span>Detalle de lo resuelto por el tribunal</span>
            <textarea class="form-control observation-auto-textarea" rows="1" data-resolution-detail data-auto-resize-textarea>${escapeHtml(resolution.detail || "")}</textarea>
          </label>
          <label class="admin-filter-field">
            <span>Partidos de suspensión</span>
            <input class="form-control" type="number" min="0" value="${Number(resolution.suspensionMatches || 0)}" data-resolution-suspension>
          </label>
          <label class="admin-filter-field">
            <span>Estado del jugador</span>
            <select class="form-select" data-resolution-status>
              ${["Habilitado", "Inhabilitado", "Suspendido"].map((status) => `
                <option value="${status}" ${status === (resolution.status || getPlayerStatus(player)) ? "selected" : ""}>${status}</option>
              `).join("")}
            </select>
          </label>
        </div>
      `}

      ${readOnlyResolution ? "" : `
        <button class="btn btn-login-submit w-100 mt-3" type="button" data-save-observation-resolution>
          <i class="bi bi-check2-circle"></i>
          Guardar resolución
        </button>
      `}
    </div>
  `;
  autoResizeObservationTextareas();
}

function renderPlayerHistoryBody(playerKey) {
  const [teamId, number, ...nameParts] = String(playerKey || "").split("::");
  const team = getTeam(teamId);
  const player = team?.players.find((item) => item.number === Number(number) && item.name === nameParts.join("::"));
  const playerWithTeam = player && team ? { ...player, team } : null;
  const observations = playerWithTeam ? getPlayerObservationsForAdmin(playerWithTeam) : [];

  setObservationModalHeading("Administrador", "Historial disciplinario");

  if (!playerWithTeam || !observations.length) {
    observationModalBody.innerHTML = `<div class="disciplinary-history-empty">No registra problemas disciplinarios</div>`;
    return;
  }

  observationModalBody.innerHTML = `
    <div class="disciplinary-history-list">
      <div class="observation-review-player">
        <span>Jugador</span>
        <strong>${escapeHtml(playerWithTeam.name)}</strong>
        <small>${escapeHtml(playerWithTeam.team.shortName)}</small>
      </div>
      <table class="table frame-table mb-0">
        <thead>
          <tr>
            <th>Fecha calendario</th>
            <th>Fecha fixture</th>
            <th>Ver</th>
            <th>Editar resolución</th>
          </tr>
        </thead>
        <tbody>
          ${observations.map((observation) => `
            <tr>
              <td>${escapeHtml(observation.calendarDate)}</td>
              <td>${escapeHtml(observation.fixtureDate)}</td>
              <td>
                <button class="admin-observation-view" type="button" data-history-observation-view="${escapeHtml(observation.key)}">
                  <i class="bi bi-eye-fill"></i>
                  Ver
                </button>
              </td>
              <td>
                ${observation.resolution ? `
                  <button class="admin-observation-view" type="button" data-history-resolution-edit="${escapeHtml(observation.key)}">
                    <i class="bi bi-pencil-fill"></i>
                    Editar
                  </button>
                ` : `<span class="admin-observation-empty">Sin resolución</span>`}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function saveActiveObservationText() {
  if (!activeObservationButton) return;

  const textArea = observationModalBody.querySelector("#observationText");
  const text = textArea?.value.trim() || "";
  activeObservationButton.dataset.observationText = text;
  activeObservationButton.classList.toggle("has-observation", Boolean(text));
  if (activeObservationButton.dataset.observationKey) {
    playerObservations[activeObservationButton.dataset.observationKey] = text;
    updatePlayerObservationBadge();
  }

  const observationModal = bootstrap.Modal.getInstance(observationModalElement);
  if (observationModal) {
    observationModal.hide();
  }
}

function refreshCurrentPlayersTables() {
  if (contentShell.querySelector("[data-admin-player-category]")) {
    const category = contentShell.querySelector("[data-admin-player-category]")?.value || "";
    const division = contentShell.querySelector("[data-admin-player-division]")?.value || "";
    const teamId = contentShell.querySelector("[data-admin-player-team]")?.value || "";
    const searchTerm = getEffectiveSearchTerm(contentShell.querySelector("[data-admin-player-search]")?.value || "");
    const onlyWithObservations = contentShell.querySelector("[data-admin-player-observations-only]")?.checked || false;
    contentShell.innerHTML = renderAdminPlayersView(category, division, teamId, searchTerm, 1, onlyWithObservations);
    return;
  }

  if (sidebarContent.dataset.delegateTeam && contentShell.querySelector(".delegate-players-table")) {
    const team = getTeam(sidebarContent.dataset.delegateTeam);
    if (team) contentShell.innerHTML = renderDelegatePlayers(team);
  }
}

function saveObservationResolution() {
  const review = observationModalBody.querySelector("[data-observation-review]");
  if (!review) return;

  const observationKey = review.dataset.observationReview;
  const player = getPlayerFromObservationKey(observationKey);
  const detail = observationModalBody.querySelector("[data-resolution-detail]")?.value.trim() || "";
  const suspensionMatches = Math.max(Number(observationModalBody.querySelector("[data-resolution-suspension]")?.value) || 0, 0);
  const status = observationModalBody.querySelector("[data-resolution-status]")?.value || "Habilitado";

  playerObservationResolutions[observationKey] = {
    detail,
    suspensionMatches,
    status,
    playerKey: player ? getPlayerStatusKey(player) : ""
  };
  updatePlayerObservationBadge();

  const observationModal = bootstrap.Modal.getInstance(observationModalElement);
  if (observationModal) {
    observationModal.hide();
  }
  refreshCurrentPlayersTables();
}

function getBadgeStyle(team) {
  return `--badge-primary: ${team.colors[0]}; --badge-secondary: ${team.colors[1]};`;
}

function renderTeamBadge(team, sizeClass = "") {
  if (team.crest) {
    return `<span class="team-badge team-badge-image team-badge-${team.id} ${sizeClass}" style="${getBadgeStyle(team)}"><img src="${team.crest}" alt="Escudo ${team.shortName}" loading="lazy"></span>`;
  }

  return `<span class="team-badge ${sizeClass}" style="${getBadgeStyle(team)}">${team.initials}</span>`;
}

function truncateTeamName(name) {
  return name.length > 12 ? `${name.slice(0, 12)}...` : name;
}

function getTeamCarouselClass(index, activeIndex) {
  const total = teams.length;
  const offset = ((index - activeIndex + total + Math.floor(total / 2)) % total) - Math.floor(total / 2);
  const previousIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  if (index === activeIndex) return "active";
  if (index === previousIndex) return "previous";
  if (index === nextIndex) return "next";
  if (offset === -2) return "far-previous";
  if (offset === 2) return "far-next";
  if (offset === -3) return "edge-previous";
  if (offset === 3) return "edge-next";
  return "hidden";
}

function renderTeamCarousel() {
  teamCarousel.dataset.teamCarouselActive = String(teamCarouselActiveIndex);
  teamCarousel.innerHTML = teams.map((team, index) => `
    <button class="team-card ${getTeamCarouselClass(index, teamCarouselActiveIndex)} ${team.id === selectedTeamId ? "selected" : ""}" type="button" data-team-id="${team.id}" data-team-carousel-index="${index}" aria-hidden="${getTeamCarouselClass(index, teamCarouselActiveIndex) === "hidden" ? "true" : "false"}">
      ${renderTeamBadge(team)}
      <span>${team.shortName}</span>
    </button>
  `).join("");
}

function moveTeamCarousel(direction) {
  teamCarouselActiveIndex = (teamCarouselActiveIndex + direction + teams.length) % teams.length;
  renderTeamCarousel();
}

function getTeamStanding(teamId) {
  return standings.find((row) => row.teamId === teamId);
}

function renderShirt(team) {
  const [primary, secondary, accent = "#ffffff"] = team.shirtColors;

  return `
    <div class="shirt-preview" style="--shirt-primary: ${primary}; --shirt-secondary: ${secondary}; --shirt-accent: ${accent};" aria-label="Camiseta de ${team.name}">
      <div class="shirt-sleeve left"></div>
      <div class="shirt-body"></div>
      <div class="shirt-sleeve right"></div>
    </div>
  `;
}

function renderRoster(team) {
  return team.players.map((player) => `
    <tr>
      <td>${player.number}</td>
      <td>${player.name}</td>
      <td>${player.age}</td>
    </tr>
  `).join("");
}

function getPlayerStats(team, statType) {
  if (statType === "goals") {
    return team.players
      .filter((player) => player.goals > 0)
      .sort((a, b) => b.goals - a.goals)
      .map((player) => ({ name: player.name, value: player.goals }));
  }

  return team.players
    .filter((player) => player.yellow > 0 || player.red > 0)
    .sort((a, b) => (b.yellow + b.red) - (a.yellow + a.red))
    .map((player) => ({ name: player.name, value: `${player.yellow}A / ${player.red}R` }));
}

function renderPlayerStats(team, statType = "goals") {
  const rows = getPlayerStats(team, statType);

  if (!rows.length) {
    return `
      <tr>
        <td colspan="2">Sin registros disponibles</td>
      </tr>
    `;
  }

  return rows.map((row) => `
      <tr>
        <td>${row.name}</td>
        <td>${row.value}</td>
    </tr>
  `).join("");
}

function getTeamMatches(teamId) {
  return Object.entries(fixtures).flatMap(([dateNumber, matches]) =>
    matches
      .filter((match) => match.home === teamId || match.away === teamId)
      .map((match) => ({ ...match, dateNumber }))
  );
}

function getMatchResultClass(match, teamId) {
  if (match.homeGoals === null || match.awayGoals === null) return "match-pending";
  if (match.homeGoals === match.awayGoals) return "match-draw";

  const isHome = match.home === teamId;
  const won = isHome ? match.homeGoals > match.awayGoals : match.awayGoals > match.homeGoals;
  return won ? "match-win" : "match-loss";
}

function renderTeamMatches(teamId) {
  return getTeamMatches(teamId).map((match) => {
    const isHome = match.home === teamId;
    const rival = getTeam(isHome ? match.away : match.home);
    const hasResult = match.homeGoals !== null && match.awayGoals !== null;
    const resultText = hasResult ? `${match.homeGoals} - ${match.awayGoals}` : "";

    return `
      <tr>
        <td>Fecha ${match.dateNumber}</td>
        <td>
          <span class="fixture-team">${renderTeamBadge(rival, "small")} ${rival.shortName}</span>
        </td>
        <td class="team-match-result ${getMatchResultClass(match, teamId)}">${resultText}</td>
      </tr>
    `;
  }).join("");
}

function getDemoPlayerBirthDate(player, index) {
  return player.birthDate || `${String(10 + (index % 20)).padStart(2, "0")}/03/${1990 + (index % 15)}`;
}

function getDemoPlayerDni(player, index) {
  return player.dni || String(30000000 + (index + 1) * 13729);
}

function formatDateInputToDisplay(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function renderTeamDetail() {
  const team = getTeam(selectedTeamId);
  const standing = getTeamStanding(selectedTeamId);
  const goalsAgainst = Math.max(0, standing.g * 2 + standing.e - standing.dg);
  const goalsFor = goalsAgainst + standing.dg;

  teamDetailView.innerHTML = `
    <button class="back-to-division" type="button" data-back-to-division>
      <i class="bi bi-arrow-left"></i>
      Volver
    </button>
    <div class="team-detail-header">
      ${renderTeamBadge(team)}
      <div>
        <p class="section-kicker mb-1">Información del equipo</p>
        <h2>${team.legalName}</h2>
        <p>${team.description}</p>
      </div>
    </div>

    <section class="team-id-card">
      <div class="team-id-main">
        ${renderTeamBadge(team)}
        <div class="team-id-data">
          <span>Nombre del equipo</span>
          <strong>${team.legalName}</strong>
          <span>Abreviatura</span>
          <strong>${team.abbreviation}</strong>
          <span>Delegado</span>
          <strong>${team.delegate}</strong>
          <span>Contacto</span>
          <strong>${team.contact}</strong>
        </div>
      </div>

      <div class="team-kit-panel">
        <div class="kit-swatches">
          ${team.shirtColors.slice(0, 3).map((color) => `<span style="background: ${color};"></span>`).join("")}
        </div>
        ${renderShirt(team)}
      </div>
    </section>

    <section class="team-metrics">
      <div><span>Jugadores</span><strong>${team.players.length}</strong></div>
      <div><span>PJ</span><strong>${standing.pj}</strong></div>
      <div><span>PG</span><strong>${standing.g}</strong></div>
      <div><span>PE</span><strong>${standing.e}</strong></div>
      <div><span>PP</span><strong>${standing.p}</strong></div>
      <div><span>GF</span><strong>${goalsFor}</strong></div>
      <div><span>GC</span><strong>${goalsAgainst}</strong></div>
    </section>

    <div class="team-detail-grid">
      <section class="division-table-panel">
        <div class="division-section-heading">
          <p class="section-kicker mb-1">Plantel</p>
          <h2>Jugadores</h2>
        </div>
        <div class="table-responsive">
          <table class="table frame-table roster-table mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Apellido y Nombre</th>
                <th>Edad</th>
              </tr>
            </thead>
            <tbody>${renderRoster(team)}</tbody>
          </table>
        </div>
      </section>

      <div class="team-side-tables">
      <section class="division-table-panel">
        <div class="division-section-heading">
          <p class="section-kicker mb-1">Calendario</p>
          <h2>Partidos</h2>
        </div>
        <div class="table-responsive">
          <table class="table frame-table team-matches-table mb-0">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Rival</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>${renderTeamMatches(team.id)}</tbody>
          </table>
        </div>
      </section>

      <section class="division-table-panel">
        <div class="fixture-toolbar">
          <div class="division-section-heading">
            <p class="section-kicker mb-1">Estadísticas</p>
            <h2>Detalle</h2>
          </div>
          <label class="fixture-select-label" for="teamStatSelect">
            Tipo
            <select id="teamStatSelect" class="form-select form-select-sm" data-team-stat-select>
              <option value="goals">Goleadores</option>
              <option value="sanctions">Sanciones</option>
            </select>
          </label>
        </div>
        <div class="table-responsive">
          <table class="table frame-table player-stats-table mb-0">
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody id="teamStatsBody">${renderPlayerStats(team)}</tbody>
          </table>
        </div>
      </section>
      </div>
    </div>
  `;
}

function updateTeamStats(statType) {
  const team = getTeam(selectedTeamId);
  const statsBody = document.querySelector("#teamStatsBody");

  if (statsBody) {
    statsBody.innerHTML = renderPlayerStats(team, statType);
  }
}

function renderStandings() {
  standingsBody.innerHTML = standings.map((row, index) => {
    const team = getTeam(row.teamId);

    return `
      <tr class="${index === 0 ? "standing-leader" : ""} ${index === standings.length - 1 ? "standing-relegation" : ""}">
        <td class="standings-rank">${index + 1}</td>
        <td>
          <a href="#" class="team-table-link" data-team-id="${team.id}" title="${team.name}" aria-label="Ver información de ${team.name}">
            ${renderTeamBadge(team, "small")}
            ${truncateTeamName(team.name)}
          </a>
        </td>
        <td>${row.pts}</td>
        <td>${row.pj}</td>
        <td>${row.g}</td>
        <td>${row.e}</td>
        <td>${row.p}</td>
        <td>${row.dg > 0 ? `+${row.dg}` : row.dg}</td>
      </tr>
    `;
  }).join("");
}

function renderFixture() {
  const matches = fixtures[fixtureDateSelect.value] || [];

  fixtureBody.innerHTML = matches.map((match) => {
    const home = getTeam(match.home);
    const away = getTeam(match.away);
    const hasResult = match.homeGoals !== null && match.awayGoals !== null;

    return `
      <tr>
        <td class="fixture-status">${match.status}</td>
        <td>
          <span class="fixture-team">${renderTeamBadge(home, "small")} ${home.shortName}</span>
        </td>
        <td class="fixture-score ${hasResult ? "" : "fixture-pending"}">
          ${hasResult ? `${match.homeGoals} - ${match.awayGoals}` : "-"}
        </td>
        <td>
          <span class="fixture-team">${renderTeamBadge(away, "small")} ${away.shortName}</span>
        </td>
      </tr>
    `;
  }).join("");
}

function showDivisionTables() {
  selectedTeamId = null;
  renderTeamCarousel();
  teamDetailView.classList.add("d-none");
  divisionTables.classList.remove("d-none");
}

function selectTeam(teamId) {
  selectedTeamId = teamId;
  const teamIndex = teams.findIndex((team) => team.id === teamId);
  if (teamIndex >= 0) {
    teamCarouselActiveIndex = teamIndex;
  }
  renderTeamCarousel();
  renderTeamDetail();
  divisionTables.classList.add("d-none");
  teamDetailView.classList.remove("d-none");
}

function renderDivisionView(divisionName) {
  selectedTeamId = null;
  teamCarouselActiveIndex = 0;
  divisionTitle.textContent = divisionName;
  renderTeamCarousel();
  renderStandings();
  renderFixture();
  teamDetailView.classList.add("d-none");
  divisionTables.classList.remove("d-none");
}

function setSelectedDivision(button) {
  const divisionName = button.dataset.division;

  limpiarSeleccionDivisiones();
  button.classList.add("active");
  button.classList.add("is-clicking");

  selectedDivision.textContent = `División seleccionada: ${divisionName}`;
  selectedDivision.classList.remove("d-none");
  homeContent.classList.add("d-none");
  publicInfoContent.classList.add("d-none");
  divisionContent.classList.remove("d-none");
  divisionLoader.classList.remove("is-hidden");
  divisionView.classList.add("d-none");

  window.clearTimeout(divisionLoadTimer);
  divisionLoadTimer = window.setTimeout(() => {
    renderDivisionView(divisionName);
    divisionLoader.classList.add("is-hidden");
    divisionView.classList.remove("d-none");
  }, 800);

  window.setTimeout(() => {
    button.classList.remove("is-clicking");
  }, 280);
}

function showHome() {
  limpiarSeleccionDivisiones();
  selectedDivision.classList.add("d-none");
  homeContent.classList.remove("d-none");
  publicInfoContent.classList.add("d-none");
  divisionContent.classList.add("d-none");
  divisionLoader.classList.remove("is-hidden");
  divisionView.classList.add("d-none");
  window.clearTimeout(divisionLoadTimer);
}

function renderRegulationContent() {
  const regulationParagraphs = publicSettings.regulationText
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  return `
    <section class="public-info-panel">
      <p class="section-kicker mb-2">Reglamento</p>
      <h2>Reglamento general de competencia amateur</h2>
      ${regulationParagraphs}
    </section>
  `;
}

function renderPhotosContent() {
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#grid`;

  return `
    <section class="public-info-panel photos-panel">
      <div class="photos-heading">
        <div>
          <p class="section-kicker mb-2">Fotos</p>
          <h2>Galería del torneo</h2>
          <p>Aquí puedes visualizar todas las fotos del torneo, se encuentran organizadas por fecha.</p>
        </div>
      </div>
      <iframe class="drive-photos-frame" src="${embedUrl}" title="Fotos del torneo Frame0 en Google Drive"></iframe>
    </section>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAboutContent() {
  const activeIndex = 0;
  const carouselItems = aboutMembers.map((member, index) => `
    <article class="about-member-card ${getAboutCarouselClass(index, activeIndex)}" data-about-index="${index}" aria-hidden="${index === activeIndex ? "false" : "true"}">
      <img src="${member.image}" alt="${member.name} - ${member.role}" loading="${index === activeIndex ? "eager" : "lazy"}">
    </article>
  `).join("");

  return `
    <section class="public-info-panel about-panel" data-about-carousel data-about-active="0">
      <div class="about-hero">
        <img src="assets/frame0-logo.png" alt="Escudo Frame0" class="about-frame-logo">
        <p class="section-kicker mb-2">Nosotros</p>
        <h2>Somos TheBlackListSystem</h2>
      </div>

      <div class="about-carousel-shell">
        <button class="about-carousel-control previous" type="button" data-about-carousel-move="-1" aria-label="Ver integrante anterior">
          <i class="bi bi-chevron-left"></i>
        </button>
        <div class="about-carousel-stage" aria-live="polite">
          ${carouselItems}
        </div>
        <button class="about-carousel-control next" type="button" data-about-carousel-move="1" aria-label="Ver integrante siguiente">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </section>
  `;
}

function updateAboutCarousel(direction) {
  const carousel = publicInfoContent.querySelector("[data-about-carousel]");
  if (!carousel) return;

  const total = aboutMembers.length;
  const currentIndex = Number(carousel.dataset.aboutActive || 0);
  const nextIndex = (currentIndex + direction + total) % total;

  carousel.dataset.aboutActive = String(nextIndex);
  carousel.querySelectorAll("[data-about-index]").forEach((item) => {
    const itemIndex = Number(item.dataset.aboutIndex);
    item.className = `about-member-card ${getAboutCarouselClass(itemIndex, nextIndex)}`;
    item.setAttribute("aria-hidden", itemIndex === nextIndex ? "false" : "true");
  });
}

function showPublicInfo(page) {
  limpiarSeleccionDivisiones();
  selectedDivision.classList.add("d-none");
  homeContent.classList.add("d-none");
  divisionContent.classList.add("d-none");
  divisionLoader.classList.remove("is-hidden");
  divisionView.classList.add("d-none");
  window.clearTimeout(divisionLoadTimer);

  const publicPages = {
    fotos: renderPhotosContent,
    reglamento: renderRegulationContent,
    nosotros: renderAboutContent
  };

  publicInfoContent.innerHTML = (publicPages[page] || renderAboutContent)();
  publicInfoContent.classList.remove("d-none");
}

function getActiveLoginRole() {
  const activeTab = document.querySelector("#loginRoleTabs .nav-link.active");
  return activeTab ? activeTab.dataset.role : "Delegado";
}

function showLoginError(message = "Usuario o contraseña incorrectos.") {
  if (loginErrorMessage) {
    loginErrorMessage.textContent = message;
  }

  bootstrap.Modal.getInstance(loginModalElement)?.hide();
  bootstrap.Modal.getOrCreateInstance(loginErrorModalElement).show();
}

function renderProfileLoader(roleName) {
  return `
    <div class="profile-loader-shell" role="status" aria-live="polite">
      <div class="division-loader">
        <div class="loader-stage" aria-hidden="true">
          <img src="assets/frame0-logo.png" alt="" class="loader-logo">
          <div class="ball-track">
            <img src="assets/soccer-ball.svg" alt="" class="soccer-spinner">
          </div>
        </div>
        <span>Cargando ${roleName}...</span>
      </div>
    </div>
  `;
}

function showContentLoader(sectionName, callback) {
  contentShell.innerHTML = renderProfileLoader(sectionName);
  window.setTimeout(async () => {
    try {
      await callback();
    } catch (error) {
      console.error(`Error al cargar ${sectionName}:`, error);
      contentShell.innerHTML = `
        <section class="admin-error-panel">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <h2>No se pudo cargar la sección</h2>
          <p>Revis&aacute; la conexi&oacute;n con Supabase e intent&aacute; nuevamente.</p>
        </section>
      `;
    }
  }, 650);
}

function showProfileLoader(roleName, callback) {
  sidebarContent.innerHTML = `
    <div class="sidebar-main admin-sidebar-main">
      <div>
        <div class="sidebar-heading">
          <i class="bi bi-hourglass-split"></i>
          <h2>Acceso</h2>
        </div>
      </div>
    </div>
  `;
  contentShell.innerHTML = renderProfileLoader(roleName);
  document.body.classList.add("admin-view");
  window.setTimeout(callback, 800);
}

function getAdminMetrics() {
  const categories = [
    {
      name: "Libre",
      divisions: [
        { name: "Primera División", teams: 14 },
        { name: "Segunda División", teams: 12 }
      ]
    },
    {
      name: "Senior",
      divisions: [
        { name: "Senior A", teams: 10 },
        { name: "Senior B", teams: 8 }
      ]
    },
    {
      name: "Femenino",
      divisions: [
        { name: "Fem A", teams: 8 },
        { name: "Fem B", teams: 6 }
      ]
    }
  ];
  const totalTeams = categories.flatMap((category) => category.divisions).reduce((sum, division) => sum + division.teams, 0);
  const averagePlayers = 15;

  return {
    categories,
    totalTeams,
    averagePlayers,
    totalPlayers: totalTeams * averagePlayers
  };
}

function getAdminDivisionMap() {
  return getAdminMetrics().categories.reduce((map, category) => {
    map[category.name] = category.divisions.map((division) => division.name);
    return map;
  }, {});
}

function populateNewTeamCategories() {
  const divisionMap = getAdminDivisionMap();
  const categoryOptions = Object.keys(divisionMap).map((category) => `
    <option value="${category}">${category}</option>
  `).join("");

  newTeamCategory.innerHTML = `<option value="">Seleccionar categoría</option>${categoryOptions}`;
}

function populateNewTeamDivisions(category) {
  const divisions = getAdminDivisionMap()[category] || [];
  const divisionOptions = divisions.map((division) => `
    <option value="${division}">${division}</option>
  `).join("");

  newTeamDivision.innerHTML = `<option value="">Seleccionar división</option>${divisionOptions}`;
  newTeamDivision.disabled = !category;
}

function validateNewTeamForm() {
  const isValid = Boolean(
    newTeamName.value.trim() &&
    newTeamShortName.value.trim() &&
    newTeamCategory.value &&
    newTeamDivision.value
  );

  createTeamButton.disabled = !isValid;
}

function populateNewDelegateCategories() {
  const categories = getTournamentCategories().map((category) => `
    <option value="${category.name}">${category.name}</option>
  `).join("");

  newDelegateCategory.innerHTML = `<option value="">Todas las categorías</option>${categories}`;
}

function populateNewDelegateTeams(category = "") {
  const filteredTeams = teams
    .filter((team) => !category || getTournamentCategories().some(() => true))
    .sort((a, b) => a.shortName.localeCompare(b.shortName));

  newDelegateTeam.innerHTML = `
    <option value="">Seleccionar equipo</option>
    ${filteredTeams.map((team) => `<option value="${team.id}">${team.shortName}</option>`).join("")}
  `;
}

function updateDelegateDefaultsFromTeam() {
  const team = getTeam(newDelegateTeam.value);
  if (!team) {
    if (!newDelegatePassword.value.trim()) {
      newDelegatePassword.value = "123456";
    }
    return;
  }

  if (!newDelegateUsername.value.trim()) {
    newDelegateUsername.value = team.shortName;
  }

  if (!newDelegatePassword.value.trim()) {
    newDelegatePassword.value = "123456";
  }
}

function validateNewDelegateForm() {
  const isValidPhone = /^[0-9]+$/.test(newDelegateContact.value.trim());
  const isValid = Boolean(
    newDelegateLastName.value.trim() &&
    newDelegateFirstName.value.trim() &&
    isValidPhone &&
    newDelegateTeam.value &&
    newDelegateUsername.value.trim() &&
    newDelegatePassword.value.trim()
  );

  createDelegateButton.disabled = !isValid;
}

function getNextObserverId() {
  return observers.reduce((maxId, observer) => Math.max(maxId, Number(observer.id) || 0), 0) + 1;
}

function isObserverUsernameAvailable(username) {
  const normalizedUsername = username.trim().toLowerCase();

  return Boolean(normalizedUsername) &&
    !observers.some((observer) => observer.username.toLowerCase() === normalizedUsername);
}

function prepareNewObserverForm() {
  newObserverForm.reset();
  newObserverUsername.value = `veedor${getNextObserverId()}`;
  newObserverPassword.value = "123456";
  newObserverPassword.type = "password";
  observerPasswordToggle.setAttribute("aria-label", "Mostrar contraseña");
  observerPasswordToggle.innerHTML = `<i class="bi bi-eye-fill"></i>`;
  validateNewObserverForm();
}

function validateNewObserverForm() {
  const isValidPhone = /^[0-9]+$/.test(newObserverContact.value.trim());
  const username = newObserverUsername.value.trim();
  const isUniqueUsername = isObserverUsernameAvailable(username);
  const isValid = Boolean(
    newObserverLastName.value.trim() &&
    newObserverFirstName.value.trim() &&
    isValidPhone &&
    username &&
    isUniqueUsername &&
    newObserverPassword.value.trim()
  );

  newObserverUserFeedback.textContent = username && !isUniqueUsername
    ? "Ese usuario ya existe. Ingresá uno diferente."
    : "";
  newObserverUserFeedback.classList.toggle("is-error", Boolean(username && !isUniqueUsername));
  createObserverButton.disabled = !isValid;
}

function validateDelegatePlayerForm() {
  if (!saveDelegatePlayerButton) return;
  saveDelegatePlayerButton.disabled = !(
    delegatePlayerLastName?.value.trim() &&
    delegatePlayerFirstName?.value.trim() &&
    delegatePlayerBirthDate?.value &&
    /^[0-9]+$/.test(delegatePlayerDni?.value.trim() || "") &&
    delegatePlayerNumber?.value
  );
}

function isPlayerRegistrationOpen(date = new Date()) {
  const from = tournamentSettings.playerRegistrationFrom;
  const to = tournamentSettings.playerRegistrationTo;
  if (!from || !to) return true;

  const currentDate = new Date(date.toISOString().slice(0, 10));
  return currentDate >= new Date(from) && currentDate <= new Date(to);
}

function getTournamentDivisionKey(categoryName, divisionName) {
  return `${categoryName}::${divisionName}`;
}

function getTournamentDivisionConfig(categoryName, divisionName, teamCount) {
  const key = getTournamentDivisionKey(categoryName, divisionName);
  const defaultPlayoffTeams = [32, 16, 8, 4, 2].find((option) => option <= teamCount) || 2;

  if (!tournamentSettings.divisions[key]) {
    tournamentSettings.divisions[key] = {
      datesCount: Math.max(teamCount - 1, 1),
      playoffEnabled: false,
      playoffTeams: defaultPlayoffTeams,
      fixture: null
    };
  }

  return tournamentSettings.divisions[key];
}

function getTournamentConfigByKey(key) {
  const [categoryName, divisionName] = key.split("::");
  const row = getTournamentDivisionRows().find((item) =>
    item.category === categoryName && item.division === divisionName
  );

  return row ? { ...row, key } : null;
}

function getTournamentDivisionRows() {
  return getAdminMetrics().categories.flatMap((category) =>
    category.divisions.map((division) => ({
      category: category.name,
      division: division.name,
      teams: division.teams,
      config: getTournamentDivisionConfig(category.name, division.name, division.teams)
    }))
  );
}

function buildPlayoffCups(teamCount, playoffTeams) {
  if (!playoffTeams || playoffTeams < 2) return [];

  const cupNames = ["Copa Oro", "Copa Plata", "Copa Bronce", "Copa Cobre"];
  const cups = [];
  let start = 1;
  let cupIndex = 0;

  while (start <= teamCount) {
    const end = Math.min(start + playoffTeams - 1, teamCount);
    const qualifiedCount = end - start + 1;

    cups.push({
      name: cupNames[cupIndex] || `Copa ${cupIndex + 1}`,
      range: `${start} al ${end}`,
      stages: buildPlayoffStages(start, qualifiedCount)
    });

    start = end + 1;
    cupIndex += 1;
  }

  return cups;
}

function buildPlayoffStages(startPosition, teamsCount) {
  const bracketSize = [32, 16, 8, 4, 2].find((size) => teamsCount >= size) || 2;
  const stageNames = {
    2: "Final",
    4: "Semifinales",
    8: "Cuartos de Final",
    16: "Octavos de Final",
    32: "Dieciseisavos de Final"
  };
  const groupLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const firstLabels = bracketSize === 2
    ? ["Final A"]
    : Array.from({ length: bracketSize / 2 }, (_, index) => {
      const group = groupLetters[Math.floor(index / 2)];
      return bracketSize === 4 ? group : `${group}${(index % 2) + 1}`;
    });
  const firstMatches = firstLabels.map((label, index) => {
    const leftSeed = startPosition + index;
    const rightSeed = startPosition + bracketSize - 1 - index;
    return `${label}: Equipo ${leftSeed} vs Equipo ${rightSeed}`;
  });

  if (bracketSize === 2) {
    return [{ name: "Final", matches: firstMatches }];
  }

  const stages = [{ name: stageNames[bracketSize], matches: firstMatches }];
  let currentLabels = firstLabels;
  let nextStageName = {
    4: "Final",
    8: "Semifinales",
    16: "Cuartos de Final",
    32: "Octavos de Final"
  }[bracketSize];

  while (currentLabels.length > 2) {
    const nextMatches = [];
    const nextLabels = [];

    for (let index = 0; index < currentLabels.length; index += 4) {
      const group = groupLetters[nextLabels.length];
      const firstLeft = currentLabels[index];
      const firstRight = currentLabels[index + 3] || currentLabels[index + 1];
      const secondLeft = currentLabels[index + 1];
      const secondRight = currentLabels[index + 2] || currentLabels[index + 1];

      nextMatches.push(`${group}: Ganador ${firstLeft} vs Ganador ${firstRight}`);
      nextLabels.push(group);

      if (secondLeft && secondRight && secondLeft !== secondRight) {
        const secondGroup = groupLetters[nextLabels.length];
        nextMatches.push(`${secondGroup}: Ganador ${secondLeft} vs Ganador ${secondRight}`);
        nextLabels.push(secondGroup);
      }
    }

    stages.push({ name: nextStageName, matches: nextMatches });
    currentLabels = nextLabels;
    nextStageName = {
      "Octavos de Final": "Cuartos de Final",
      "Cuartos de Final": "Semifinales",
      "Semifinales": "Final"
    }[nextStageName] || "Final";
  }

  stages.push({
    name: "Final",
    matches: [`Ganador ${currentLabels[0]} vs Ganador ${currentLabels[1]}`]
  });

  return stages;
}

function shuffleItems(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function getFixtureTeamNames(categoryName, divisionName, teamCount) {
  const fallbackNames = [
    "La Reserva",
    "Los Pibes FC",
    "Barrio Norte",
    "La Academia",
    "Deportivo Sur",
    "Unión Amateur",
    "Los Halcones",
    "Atlético Centro",
    "La Banda",
    "Sportivo Alberdi",
    "Nueva Córdoba",
    "Villa Unión",
    "Los Titanes",
    "Defensores del Parque",
    "San Martín",
    "El Fortín",
    "La Cantera",
    "Estrella Roja",
    "Deportivo Oeste",
    "Los Cóndores",
    "Fénix FC",
    "La Gloria Amateur"
  ];
  const loadedNames = teams.map((team) => team.shortName);
  const contextSuffix = `${categoryName} ${divisionName}`.replace(/\s+/g, " ").trim();
  const allNames = [...loadedNames];

  fallbackNames.forEach((name) => {
    if (allNames.length < teamCount) {
      allNames.push(`${name} ${contextSuffix}`);
    }
  });

  while (allNames.length < teamCount) {
    allNames.push(`Club ${allNames.length + 1} ${contextSuffix}`);
  }

  return allNames.slice(0, teamCount);
}

function buildRoundRobinRounds(teamNames, requestedDates) {
  const teamsList = shuffleItems(teamNames);
  const hasBye = teamsList.length % 2 !== 0;
  const rotation = hasBye ? [...teamsList, null] : [...teamsList];
  const baseRoundCount = rotation.length - 1;
  const totalRoundCount = Math.max(baseRoundCount, Math.ceil((Number(requestedDates) || baseRoundCount) / baseRoundCount) * baseRoundCount);
  const rounds = [];

  for (let roundIndex = 0; roundIndex < totalRoundCount; roundIndex += 1) {
    const cycleRound = roundIndex % baseRoundCount;
    const matches = [];

    for (let index = 0; index < rotation.length / 2; index += 1) {
      const home = rotation[index];
      const away = rotation[rotation.length - 1 - index];

      if (home && away) {
        matches.push(cycleRound % 2 === 0 ? `${home} vs ${away}` : `${away} vs ${home}`);
      }
    }

    rounds.push({
      name: `Fecha ${roundIndex + 1}`,
      matches
    });

    rotation.splice(1, 0, rotation.pop());
  }

  return rounds;
}

function generateFixturePlan(categoryName, divisionName) {
  const row = getTournamentDivisionRows().find((item) =>
    item.category === categoryName && item.division === divisionName
  );
  if (!row) return null;

  const config = row.config;
  const teamsCount = row.teams;
  const fixtureTeamNames = getFixtureTeamNames(categoryName, divisionName, teamsCount);
  const rounds = buildRoundRobinRounds(fixtureTeamNames, config.datesCount);
  const datesCount = rounds.length;
  config.datesCount = datesCount;

  config.fixture = {
    generatedAt: new Date().toLocaleString("es-AR"),
    category: categoryName,
    division: divisionName,
    teamsCount,
    datesCount,
    rounds,
    cups: config.playoffEnabled ? buildPlayoffCups(teamsCount, Number(config.playoffTeams)) : []
  };

  return config.fixture;
}

function renderFixtureDownloadDocument(fixture) {
  const roundsHtml = fixture.rounds.map((round) => `
    <section>
      <h2>${round.name}</h2>
      <ul>${round.matches.map((match) => `<li>${match}</li>`).join("")}</ul>
    </section>
  `).join("");
  const cupsHtml = fixture.cups.length ? `
    <h2>Playoff</h2>
    ${fixture.cups.map((cup) => `
      <section>
        <h3>${cup.name} (${cup.range})</h3>
        ${cup.stages.map((stage) => `
          <h4>${stage.name}</h4>
          <ul>${stage.matches.map((match) => `<li>${match}</li>`).join("")}</ul>
        `).join("")}
      </section>
    `).join("")}
  ` : "";

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Fixture ${fixture.category} - ${fixture.division}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; padding: 28px; }
          h1 { color: #0b4fe8; margin-bottom: 4px; }
          h2 { margin-top: 22px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; }
          h3 { margin-bottom: 6px; }
          h4 { margin: 12px 0 4px; color: #263241; }
          li { margin: 5px 0; }
          .meta { color: #526070; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Fixture ${fixture.category} - ${fixture.division}</h1>
        <p class="meta">${fixture.teamsCount} equipos · ${fixture.datesCount} fechas · Generado: ${fixture.generatedAt}</p>
        ${roundsHtml}
        ${cupsHtml}
        <script>window.print();</script>
      </body>
    </html>
  `;
}

function renderAdminSummaryList(items) {
  return items.map((item) => `
    <div class="admin-summary-row">
      <span>${item.name}</span>
      <strong>${item.teams}</strong>
    </div>
  `).join("");
}

function getTeamFromUsername(username) {
  const normalizedUsername = username.trim().toLowerCase();

  return teams.find((team) =>
    team.id.toLowerCase() === normalizedUsername ||
    team.shortName.toLowerCase() === normalizedUsername ||
    team.name.toLowerCase().includes(normalizedUsername) ||
    team.legalName.toLowerCase().includes(normalizedUsername)
  );
}

function getTeamStatusCounts(team) {
  return team.players.reduce((counts, player) => {
    const status = player.red > 0 ? "suspended" : player.yellow >= 4 ? "disabled" : "enabled";
    counts[status] += 1;
    return counts;
  }, { enabled: 0, suspended: 0, disabled: 0 });
}

function getTeamRecord(teamId) {
  return getTeamMatches(teamId).reduce((record, match) => {
    if (match.homeGoals === null || match.awayGoals === null) return record;

    record.played += 1;
    if (match.homeGoals === match.awayGoals) {
      record.drawn += 1;
      return record;
    }

    const isHome = match.home === teamId;
    const won = isHome ? match.homeGoals > match.awayGoals : match.awayGoals > match.homeGoals;
    if (won) {
      record.won += 1;
    } else {
      record.lost += 1;
    }

    return record;
  }, { played: 0, won: 0, drawn: 0, lost: 0 });
}

function getPlayerStatus(player) {
  const resolvedStatus = getResolvedPlayerStatus(player);
  if (resolvedStatus) return resolvedStatus;
  if (player.red > 0) return "Suspendido";
  if (player.yellow >= 4) return "Inhabilitado";
  return "Habilitado";
}

function renderDelegateHome(team) {
  const record = getTeamRecord(team.id);
  const statusCounts = getTeamStatusCounts(team);

  return `
    <div class="section-toolbar admin-toolbar">
      <div>
        <p class="section-kicker section-brand mb-1">Frame0</p>
        <h2 class="section-title mb-0">${team.legalName}</h2>
      </div>
    </div>

    <section class="quick-stats admin-quick-stats" aria-label="Métricas del equipo">
      <div class="quick-stat">
        <i class="bi bi-calendar-check-fill"></i>
        <div class="quick-stat-content">
          <strong>${record.played}</strong>
          <div class="quick-stat-copy"><span>Jugados</span><small>Partidos disputados</small></div>
        </div>
      </div>
      <div class="quick-stat">
        <i class="bi bi-trophy-fill"></i>
        <div class="quick-stat-content">
          <strong>${record.won}</strong>
          <div class="quick-stat-copy"><span>Ganados</span><small>Victorias del equipo</small></div>
        </div>
      </div>
      <div class="quick-stat">
        <i class="bi bi-dash-circle-fill"></i>
        <div class="quick-stat-content">
          <strong>${record.drawn}</strong>
          <div class="quick-stat-copy"><span>Empatados</span><small>Partidos igualados</small></div>
        </div>
      </div>
      <div class="quick-stat">
        <i class="bi bi-x-circle-fill"></i>
        <div class="quick-stat-content">
          <strong>${record.lost}</strong>
          <div class="quick-stat-copy"><span>Perdidos</span><small>Derrotas registradas</small></div>
        </div>
      </div>
    </section>

    <section class="team-metrics delegate-metrics">
      <div><span>Habilitados</span><strong>${statusCounts.enabled}</strong></div>
      <div><span>Suspendidos</span><strong>${statusCounts.suspended}</strong></div>
      <div><span>Inhabilitados</span><strong>${statusCounts.disabled}</strong></div>
      <div><span>Jugadores</span><strong>${team.players.length}</strong></div>
    </section>

    <section class="division-table-panel">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Calendario</p>
        <h2>Partidos del equipo</h2>
      </div>
      <div class="table-responsive">
        <table class="table frame-table team-matches-table mb-0">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Rival</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>${renderTeamMatches(team.id)}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderDelegateTeamView(team, isEditing = false) {
  const colors = team.shirtColors?.length ? team.shirtColors : team.colors;
  const [firstColor = "#0d4ea2", secondColor = "#ffffff", thirdColor = ""] = colors;
  const noThirdColor = !thirdColor;

  return `
    <div class="fixture-toolbar delegate-players-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Delegado</p>
        <h2>Mi equipo</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-delegate-team-edit="${isEditing ? "save" : "edit"}">
        <i class="bi ${isEditing ? "bi-save-fill" : "bi-pencil-fill"}"></i>
        ${isEditing ? "Guardar cambios" : "Editar"}
      </button>
    </div>

    <section class="division-table-panel delegate-team-panel ${isEditing ? "is-editing" : ""}">
      <div class="delegate-team-card">
        <div class="delegate-team-crest" style="${getBadgeStyle(team)}">
          ${team.crest ? `<img src="${team.crest}" alt="Escudo ${team.shortName}">` : `<span>${team.initials}</span>`}
        </div>
        <div class="delegate-team-copy">
          <p class="section-kicker mb-1">Datos institucionales</p>
          <h2>${team.legalName}</h2>
          <div class="delegate-team-meta">
            <span>Abreviatura: <strong>${team.abbreviation}</strong></span>
            <span>Nombre corto: <strong>${team.shortName}</strong></span>
          </div>
          <p>${team.description}</p>
          <div class="delegate-team-swatches" aria-label="Colores del equipo">
            ${colors.slice(0, 3).map((color) => `<span style="background: ${color};"></span>`).join("")}
          </div>
        </div>
      </div>

      ${isEditing ? `
        <div class="admin-filter-grid delegate-team-edit-grid">
          <label class="admin-filter-field delegate-team-file-field">
            <span>Escudo del equipo</span>
            <span class="delegate-file-control">
              <i class="bi bi-image-fill"></i>
              <span>Seleccionar imagen</span>
              <input type="file" accept="image/*" data-team-edit-field="crest">
            </span>
            <small class="form-helper-text">Actual: ${escapeHtml(team.crest || "Sin escudo cargado")}</small>
          </label>
          <label class="admin-filter-field">
            <span>Abreviatura</span>
            <input class="form-control" type="text" value="${escapeHtml(team.abbreviation || "")}" data-team-edit-field="abbreviation" maxlength="8">
          </label>
          <label class="admin-filter-field">
            <span>Nombre corto</span>
            <input class="form-control" type="text" value="${escapeHtml(team.shortName || "")}" data-team-edit-field="shortName" maxlength="24">
          </label>
          <label class="admin-filter-field delegate-team-description-field">
            <span>Descripción del equipo</span>
            <textarea class="form-control" rows="4" data-team-edit-field="description">${escapeHtml(team.description || "")}</textarea>
          </label>
          <div class="delegate-color-editor">
            <label class="delegate-color-field">
              <span>Color 1</span>
              <input type="color" value="${firstColor}" data-team-color="0">
            </label>
            <label class="delegate-color-field">
              <span>Color 2</span>
              <input type="color" value="${secondColor}" data-team-color="1">
            </label>
            <label class="delegate-color-field">
              <span>Color 3</span>
              <input type="color" value="${thirdColor || "#ffffff"}" data-team-color="2" ${noThirdColor ? "disabled" : ""}>
              <label class="delegate-color-na">
                <input type="checkbox" data-team-color-none ${noThirdColor ? "checked" : ""}>
                No corresponde
              </label>
            </label>
          </div>
        </div>
      ` : ""}
    </section>
  `;
}

function renderDelegatePlayers(team) {
  const canEditPlayers = isPlayerRegistrationOpen();
  const disabledAttribute = canEditPlayers ? "" : "disabled";
  const registrationNotice = canEditPlayers
    ? `<div class="delegate-edit-window is-open"><i class="bi bi-unlock-fill"></i> Edición habilitada hasta ${tournamentSettings.playerRegistrationTo}</div>`
    : `<div class="delegate-edit-window is-closed"><i class="bi bi-lock-fill"></i> La edición de jugadores está cerrada. Período: ${tournamentSettings.playerRegistrationFrom} al ${tournamentSettings.playerRegistrationTo}</div>`;

  return `
    <div class="fixture-toolbar delegate-players-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Delegado</p>
        <h2>Jugadores de ${team.shortName}</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-open-delegate-player-modal ${disabledAttribute}>
        <i class="bi bi-plus-lg"></i>
        Cargar nuevo jugador
      </button>
    </div>
    ${registrationNotice}
    <section class="division-table-panel">
      <div class="table-responsive">
        <table class="table frame-table delegate-players-table mb-0">
          <thead>
            <tr>
              <th>Num</th>
              <th>Apellido y nombre</th>
              <th>Fecha nac.</th>
              <th>DNI</th>
              <th>Estado</th>
              <th>#</th>
              <th>Notificaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${team.players.map((player, index) => {
              const playerWithTeam = { ...player, team };
              return `
              <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${getDemoPlayerBirthDate(player, index)}</td>
                <td>${getDemoPlayerDni(player, index)}</td>
                <td><span class="player-status ${getPlayerStatus(playerWithTeam).toLowerCase()}">${getPlayerStatus(playerWithTeam)}</span></td>
                <td>${player.number}</td>
                <td>${renderObservationNotificationSummary(playerWithTeam)}</td>
                <td>
                  <div class="table-actions">
                    <button type="button" aria-label="Editar ${player.name}" ${disabledAttribute}><i class="bi bi-pencil-fill"></i></button>
                    <button type="button" aria-label="Eliminar ${player.name}" ${disabledAttribute}><i class="bi bi-trash-fill"></i></button>
                  </div>
                </td>
              </tr>
            `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function getObserverMatch(matchId) {
  return observerMatches.find((match) => match.id === matchId);
}

function parseLocalDate(dateText) {
  const [day, month, year] = dateText.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function normalizeDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isFutureMatchDate(dateText) {
  return parseLocalDate(dateText) > normalizeDateOnly(new Date());
}

function getObserverAvailableDates() {
  return [...new Set(observerMatches.map((match) => match.date))]
    .sort((first, second) => parseLocalDate(second) - parseLocalDate(first));
}

function getDefaultObserverDate() {
  const today = normalizeDateOnly(new Date());
  const availableDates = getObserverAvailableDates();
  return availableDates.find((date) => parseLocalDate(date) <= today) || availableDates[0] || "";
}

function renderObserverDateOptions(selectedDate) {
  return getObserverAvailableDates().map((date) => `
    <option value="${date}" ${date === selectedDate ? "selected" : ""}>${date}</option>
  `).join("");
}

function renderObserverMatchRows(selectedDate) {
  const selectedMatches = observerMatches.filter((match) => match.date === selectedDate);
  const isFutureDate = isFutureMatchDate(selectedDate);

  if (!selectedMatches.length) {
    return `<tr><td colspan="5" class="admin-empty-row">No hay partidos cargados para esta fecha.</td></tr>`;
  }

  return selectedMatches.map((match) => {
    const homeTeam = getTeam(match.home);
    const awayTeam = getTeam(match.away);
    const score = match.homeGoals === null || match.awayGoals === null ? "" : `${match.homeGoals} - ${match.awayGoals}`;
    const disabledAttribute = isFutureDate ? "disabled" : "";

    return `
      <tr>
        <td>${match.date}</td>
        <td>
          <span class="fixture-team">${renderTeamBadge(homeTeam, "small")} ${homeTeam.shortName}</span>
        </td>
        <td>${score}</td>
        <td>
          <span class="fixture-team">${renderTeamBadge(awayTeam, "small")} ${awayTeam.shortName}</span>
        </td>
        <td>
          <div class="table-actions">
            <button type="button" aria-label="Editar partido" data-observer-edit-match="${match.id}" ${disabledAttribute}>
              <i class="bi bi-pencil-fill"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderObserverMatches(selectedDate = getDefaultObserverDate()) {
  const isFutureDate = selectedDate && isFutureMatchDate(selectedDate);

  return `
    <div class="section-toolbar admin-toolbar">
      <div>
        <p class="section-kicker section-brand mb-1">Frame0</p>
        <h2 class="section-title mb-0">Partidos por fecha</h2>
      </div>
    </div>

    <section class="division-table-panel observer-panel">
      <div class="fixture-toolbar">
        <div class="division-section-heading">
          <p class="section-kicker mb-1">Veedor</p>
          <h2>Fecha ${selectedDate}</h2>
        </div>
        <label class="fixture-select-label">
          Fecha
          <select class="form-select form-select-sm" data-observer-date-select>
            ${renderObserverDateOptions(selectedDate)}
          </select>
        </label>
      </div>
      ${isFutureDate ? `<div class="delegate-edit-window is-closed"><i class="bi bi-lock-fill"></i> Esta fecha es futura. Los partidos todavía no pueden editarse.</div>` : ""}
      <div class="table-responsive">
        <table class="table frame-table observer-matches-table mb-0">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Equipo 1</th>
              <th>Marcador</th>
              <th>Equipo 2</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>${renderObserverMatchRows(selectedDate)}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderScoreCounter(label, value, key) {
  const score = value === null ? 0 : value;

  return `
    <div class="score-control" aria-label="${label}">
      <button type="button" data-score-dec="${key}" aria-label="Restar gol"><i class="bi bi-dash-lg"></i></button>
      <strong data-score-value="${key}">${score}</strong>
      <button type="button" data-score-inc="${key}" aria-label="Sumar gol"><i class="bi bi-plus-lg"></i></button>
      <span>${label}</span>
    </div>
  `;
}

function renderObserverPlayerRows(team, matchId) {
  return team.players.map((player) => {
    const status = getPlayerStatus(player);
    const isDisabledPlayer = status !== "Habilitado";
    const disabledAttribute = isDisabledPlayer ? "disabled" : "";
    const observationKey = getPlayerObservationKey(matchId, team.id, player);
    const currentObservation = playerObservations[observationKey] || "";

    return `
    <tr class="${isDisabledPlayer ? "observer-player-disabled" : ""}">
      <td>${player.name}</td>
      <td>${player.number}</td>
      <td><span class="player-status ${status.toLowerCase()}">${status}</span></td>
      <td>
        <div class="event-actions">
          <button class="event-btn player-of-match" type="button" aria-label="Jugador del partido" ${disabledAttribute}>
            <i class="bi bi-star-fill"></i>
          </button>
          <button class="event-btn yellow-card" type="button" aria-label="Tarjeta amarilla" ${disabledAttribute}>
            <i class="bi bi-square-fill"></i>
          </button>
          <button class="event-btn red-card" type="button" aria-label="Tarjeta roja" ${disabledAttribute}>
            <i class="bi bi-square-fill"></i>
          </button>
        </div>
      </td>
      <td>
        <div class="goal-counter">
          <button type="button" data-goal-dec aria-label="Restar gol" ${disabledAttribute}><i class="bi bi-dash-lg"></i></button>
          <span><img src="assets/soccer-ball.svg" alt="" class="goal-ball-icon"></span>
          <strong data-goal-value>0</strong>
          <button type="button" data-goal-inc aria-label="Sumar gol" ${disabledAttribute}><i class="bi bi-plus-lg"></i></button>
        </div>
      </td>
      <td>
        <button class="observation-btn ${currentObservation ? "has-observation" : ""}" type="button" data-observation data-observation-key="${escapeHtml(observationKey)}" data-observation-text="${escapeHtml(currentObservation)}" aria-label="Agregar observación disciplinaria">
          <i class="bi bi-file-earmark-text-fill"></i>
        </button>
      </td>
    </tr>
  `;
  }).join("");
}

function renderObserverPlayersTable(team, sideLabel, matchId) {
  return `
    <section class="division-table-panel observer-team-panel">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">${sideLabel}</p>
        <h2>${team.shortName}</h2>
      </div>
      <div class="table-responsive">
        <table class="table frame-table observer-player-table mb-0">
          <thead>
            <tr>
              <th>Apellido y nombre</th>
              <th>#</th>
              <th>Estado</th>
              <th>Incidencias</th>
              <th>Goles</th>
              <th>Obs.</th>
            </tr>
          </thead>
          <tbody>${renderObserverPlayerRows(team, matchId)}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderObserverEditMatch(matchId) {
  const match = getObserverMatch(matchId);
  if (!match) return renderObserverMatches();

  if (isFutureMatchDate(match.date)) {
    return renderObserverMatches(match.date);
  }

  const homeTeam = getTeam(match.home);
  const awayTeam = getTeam(match.away);

  return `
    <div class="observer-edit-toolbar">
      <button class="back-to-division" type="button" data-observer-back>
        <i class="bi bi-arrow-left"></i>
        Volver a partidos
      </button>
      <button class="btn btn-ingreso observer-save-btn" type="button" data-observer-save>
        <i class="bi bi-save-fill"></i>
        Guardar
      </button>
    </div>

    <section class="observer-scoreboard">
      <div class="score-team">
        ${renderTeamBadge(homeTeam)}
        <strong>${homeTeam.shortName}</strong>
      </div>
      <div class="score-controls-wrap">
        ${renderScoreCounter(homeTeam.shortName, match.homeGoals, "home")}
        ${renderScoreCounter(awayTeam.shortName, match.awayGoals, "away")}
      </div>
      <div class="score-team">
        ${renderTeamBadge(awayTeam)}
        <strong>${awayTeam.shortName}</strong>
      </div>
    </section>

    <div class="observer-edit-grid">
      ${renderObserverPlayersTable(homeTeam, "Equipo 1", match.id)}
      ${renderObserverPlayersTable(awayTeam, "Equipo 2", match.id)}
    </div>
  `;
}

function renderAdminHome() {
  const metrics = getAdminMetrics();
  const divisions = metrics.categories.flatMap((category) =>
    category.divisions.map((division) => ({
      name: `${category.name} - ${division.name}`,
      teams: division.teams
    }))
  );
  const categories = metrics.categories.map((category) => ({
    name: category.name,
    teams: category.divisions.reduce((sum, division) => sum + division.teams, 0)
  }));

  return `
    <div class="section-toolbar admin-toolbar">
      <div>
        <p class="section-kicker section-brand mb-1">Frame0</p>
        <h2 class="section-title mb-0">Panel administrador</h2>
      </div>
    </div>

    <section class="quick-stats admin-quick-stats" aria-label="Métricas generales de administrador">
      <div class="quick-stat">
        <i class="bi bi-grid-1x2-fill"></i>
        <div class="quick-stat-content">
          <strong data-dashboard-count="categorias">${metrics.categories.length}</strong>
          <div class="quick-stat-copy">
            <span>Categorías</span>
            <small>Libre, Senior, Femenino</small>
          </div>
        </div>
      </div>
      <div class="quick-stat">
        <i class="bi bi-shield-fill-check"></i>
        <div class="quick-stat-content">
          <strong data-dashboard-count="equipos">${metrics.totalTeams}</strong>
          <div class="quick-stat-copy">
            <span>Equipos</span>
            <small>Total general de la competencia</small>
          </div>
        </div>
      </div>
      <div class="quick-stat">
        <i class="bi bi-diagram-3-fill"></i>
        <div class="quick-stat-content">
          <strong data-dashboard-count="divisiones">${divisions.length}</strong>
          <div class="quick-stat-copy">
            <span>Divisiones</span>
            <small>Total configurado en Supabase</small>
          </div>
        </div>
      </div>
      <div class="quick-stat">
        <i class="bi bi-person-lines-fill"></i>
        <div class="quick-stat-content">
          <strong>${metrics.averagePlayers}</strong>
          <div class="quick-stat-copy">
            <span>Promedio</span>
            <small>Jugadores por equipo</small>
          </div>
        </div>
      </div>
    </section>

    <div class="admin-summary-grid">
      <section class="admin-summary-panel">
        <div class="division-section-heading">
          <p class="section-kicker mb-1">Distribución</p>
          <h2>Equipos por categoría</h2>
        </div>
        ${renderAdminSummaryList(categories)}
      </section>
      <section class="admin-summary-panel">
        <div class="division-section-heading">
          <p class="section-kicker mb-1">Detalle</p>
          <h2>Equipos por división</h2>
        </div>
        ${renderAdminSummaryList(divisions)}
      </section>
    </div>
  `;
}

function renderAdminActionView(actionName) {
  return `
    <div class="section-toolbar admin-toolbar">
      <div>
        <p class="section-kicker section-brand mb-1">Frame0</p>
        <h2 class="section-title mb-0">${actionName}</h2>
      </div>
    </div>
    <section class="division-table-panel admin-placeholder-panel">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Administrador</p>
        <h2>${actionName}</h2>
      </div>
    </section>
  `;
}

function renderTournamentGeneralRows() {
  return getTournamentDivisionRows().map((row) => {
    const key = getTournamentDivisionKey(row.category, row.division);
    const fixture = row.config.fixture;
    const playoffSummary = fixture?.cups?.length
      ? fixture.cups.map((cup) => `${cup.name}: ${cup.range}`).join(" · ")
      : fixture
        ? "Fixture generado sin playoff"
        : "Sin fixture generado";
    const playoffOptions = [2, 4, 8, 16, 32].map((option) => `
      <option value="${option}" ${Number(row.config.playoffTeams) === option ? "selected" : ""} ${option > row.teams ? "disabled" : ""}>${option}</option>
    `).join("");

    return `
      <tr data-tournament-row="${escapeHtml(key)}">
        <td>${row.category}</td>
        <td>${row.division}</td>
        <td>${row.teams}</td>
        <td>
          <input class="form-control form-control-sm tournament-number-input" type="number" min="1" max="60" value="${row.config.datesCount}" data-tournament-dates="${escapeHtml(key)}" aria-label="Cantidad de fechas de ${row.division}">
        </td>
        <td>
          <div class="playoff-config">
            <label class="form-check form-switch m-0">
              <input class="form-check-input" type="checkbox" ${row.config.playoffEnabled ? "checked" : ""} data-tournament-playoff="${escapeHtml(key)}">
            </label>
            <select class="form-select form-select-sm tournament-number-input" ${row.config.playoffEnabled ? "" : "disabled"} data-tournament-playoff-teams="${escapeHtml(key)}" aria-label="Cantidad de equipos playoff de ${row.division}">
              ${playoffOptions}
            </select>
          </div>
        </td>
        <td>
          <div class="tournament-actions">
            <button class="table-action-btn" type="button" data-generate-fixture="${escapeHtml(key)}" aria-label="Generar fixture ${row.division}">
              <i class="bi bi-shuffle"></i>
            </button>
            <button class="table-action-btn" type="button" data-download-fixture="${escapeHtml(key)}" ${fixture ? "" : "disabled"} aria-label="Descargar fixture ${row.division}">
              <i class="bi bi-file-earmark-pdf-fill"></i>
            </button>
          </div>
          <small class="fixture-generated-state">${fixture ? `Generado ${fixture.generatedAt}` : "Pendiente"}</small>
        </td>
        <td><small>${playoffSummary}</small></td>
      </tr>
    `;
  }).join("");
}

function refreshTournamentGeneralRows() {
  const rows = contentShell.querySelector("[data-tournament-general-rows]");
  if (rows) {
    rows.innerHTML = renderTournamentGeneralRows();
  }
}

function renderTournamentGeneralSettings() {
  return `
    <form class="settings-form tournament-general-form">
      <div class="settings-note tournament-note">
        <i class="bi bi-calendar-range-fill"></i>
        <div>
          <h3>Inscripción de jugadores</h3>
          <p>Este rango determina hasta cuándo los delegados pueden agregar, editar o eliminar jugadores desde su perfil.</p>
        </div>
      </div>

      <div class="admin-filter-grid settings-grid">
        <label class="admin-filter-field">
          <span>Fecha desde</span>
          <input class="form-control" type="date" value="${tournamentSettings.playerRegistrationFrom}" data-registration-from>
        </label>
        <label class="admin-filter-field">
          <span>Fecha hasta</span>
          <input class="form-control" type="date" value="${tournamentSettings.playerRegistrationTo}" data-registration-to>
        </label>
      </div>

      <div class="division-table-panel tournament-config-panel">
        <div class="division-section-heading">
          <p class="section-kicker mb-1">Confección</p>
          <h2>Categorías y divisiones</h2>
        </div>
        <div class="table-responsive">
          <table class="table frame-table tournament-config-table mb-0">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>División</th>
                <th>Equipos</th>
                <th>Fechas</th>
                <th>Playoff</th>
                <th>Fixture</th>
                <th>Resumen</th>
              </tr>
            </thead>
            <tbody data-tournament-general-rows>${renderTournamentGeneralRows()}</tbody>
          </table>
        </div>
      </div>
    </form>
  `;
}

function renderAdminSettingsView() {
  return `
    <div class="section-toolbar admin-toolbar">
      <div>
        <p class="section-kicker section-brand mb-1">Frame0</p>
        <h2 class="section-title mb-0">Configuraciones</h2>
      </div>
    </div>
    <section class="division-table-panel admin-settings-panel">
      <ul class="nav nav-pills admin-settings-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#settings-general" type="button" role="tab">Generales Torneo</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="pill" data-bs-target="#settings-social" type="button" role="tab">Redes y Contacto</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="pill" data-bs-target="#settings-comms" type="button" role="tab">Comunicaciones</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="pill" data-bs-target="#settings-rules" type="button" role="tab">Reglamento</button>
        </li>
      </ul>

      <div class="tab-content admin-settings-content">
        <div class="tab-pane fade show active" id="settings-general" role="tabpanel" tabindex="0">
          ${renderTournamentGeneralSettings()}
        </div>

        <div class="tab-pane fade" id="settings-social" role="tabpanel" tabindex="0">
          <form class="settings-form" data-public-settings-form>
            <div class="admin-filter-grid settings-grid">
              <label class="admin-filter-field">
                <span>Instagram URL</span>
                <input class="form-control" type="url" value="${escapeHtml(publicSettings.instagramUrl)}" data-setting="instagramUrl">
              </label>
              <label class="admin-filter-field">
                <span>Facebook URL</span>
                <input class="form-control" type="url" value="${escapeHtml(publicSettings.facebookUrl)}" data-setting="facebookUrl">
              </label>
              <label class="admin-filter-field">
                <span>Teléfono WhatsApp</span>
                <input class="form-control" type="tel" inputmode="numeric" value="${escapeHtml(publicSettings.whatsappPhone)}" data-setting="whatsappPhone">
              </label>
              <label class="admin-filter-field">
                <span>Título ubicación</span>
                <input class="form-control" type="text" value="${escapeHtml(publicSettings.locationTitle)}" data-setting="locationTitle">
              </label>
              <label class="admin-filter-field settings-wide">
                <span>Información ubicación</span>
                <textarea class="form-control" rows="3" data-setting="locationText">${escapeHtml(publicSettings.locationText)}</textarea>
              </label>
              <label class="admin-filter-field">
                <span>Título contacto</span>
                <input class="form-control" type="text" value="${escapeHtml(publicSettings.contactTitle)}" data-setting="contactTitle">
              </label>
              <label class="admin-filter-field settings-wide">
                <span>Información contacto</span>
                <textarea class="form-control" rows="3" data-setting="contactText">${escapeHtml(publicSettings.contactText)}</textarea>
              </label>
            </div>
            <button class="btn btn-ingreso settings-save-btn" type="button" data-save-public-settings>
              <i class="bi bi-save-fill"></i>
              Guardar redes y contacto
            </button>
          </form>
        </div>

        <div class="tab-pane fade" id="settings-comms" role="tabpanel" tabindex="0">
          <div class="settings-note">
            <i class="bi bi-megaphone-fill"></i>
            <div>
              <h3>Comunicaciones</h3>
              <p>Espacio preparado para mensajes generales, avisos a delegados y notificaciones del torneo.</p>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="settings-rules" role="tabpanel" tabindex="0">
          <form class="settings-form">
            <label class="admin-filter-field">
              <span>Texto público del reglamento</span>
              <textarea class="form-control settings-regulation-text" rows="11" data-setting="regulationText">${escapeHtml(publicSettings.regulationText)}</textarea>
            </label>
            <button class="btn btn-ingreso settings-save-btn" type="button" data-save-public-settings>
              <i class="bi bi-save-fill"></i>
              Guardar reglamento
            </button>
          </form>
        </div>
      </div>
    </section>
  `;
}

function getTournamentCategories() {
  return getAdminMetrics().categories.map((category) => ({ name: category.name }));
}

function getTournamentDivisions(selectedCategory = "") {
  return getAdminMetrics().categories
    .filter((category) => !selectedCategory || category.name === selectedCategory)
    .flatMap((category) => category.divisions.map((division) => ({
      name: division.name,
      category: category.name
    })));
}

function renderAdminCategoryRows() {
  return getTournamentCategories().map((category, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${category.name}</td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar categoría ${category.name}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button type="button" aria-label="Eliminar categoría ${category.name}">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminCategoriesView() {
  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Torneo</p>
        <h2>Categorías</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button">
        <i class="bi bi-plus-lg"></i>
        Crear nueva categoría
      </button>
    </div>

    <section class="division-table-panel admin-teams-panel">
      <div class="table-responsive">
        <table class="table frame-table admin-categories-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>${renderAdminCategoryRows()}</tbody>
        </table>
      </div>
    </section>
  `;
}

function getApiData(response) {
  return response?.data ?? response ?? [];
}

async function fetchAdminCategories(includeInactive = false) {
  if (typeof apiGet !== "function") {
    console.error("apiClient no esta disponible para el ABM de categorias.");
    return [];
  }

  const endpoint = includeInactive ? "/categorias?verBajas=true" : "/categorias";
  const response = await apiGet(endpoint);
  return getApiData(response);
}

function getAdminCategoryStatus(category) {
  return category.activa === false ? "Dado de baja" : "Activa";
}

function renderAdminCategoryRows(categories = adminCategoriesState.items) {
  if (!categories.length) {
    return `
      <tr>
        <td colspan="5" class="admin-empty-row">No se encontraron categorÃ­as.</td>
      </tr>
    `;
  }

  return categories.map((category, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(category.nombre || "")}</td>
      <td>${escapeHtml(category.descripcion || "-")}</td>
      <td>
        <span class="admin-status-pill ${category.activa === false ? "inactive" : "active"}">
          ${getAdminCategoryStatus(category)}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar categorÃ­a ${escapeHtml(category.nombre || "")}" data-admin-category-edit="${category.id}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          ${category.activa === false
            ? `<button type="button" aria-label="Reactivar categorÃ­a ${escapeHtml(category.nombre || "")}" data-admin-category-activate="${category.id}">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>`
            : `<button type="button" aria-label="Dar de baja categorÃ­a ${escapeHtml(category.nombre || "")}" data-admin-category-deactivate="${category.id}">
                <i class="bi bi-trash-fill"></i>
              </button>`
          }
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminCategoryForm(editingCategory = null) {
  const isEditing = Boolean(editingCategory);
  const nombre = editingCategory?.nombre || "";
  const descripcion = editingCategory?.descripcion || "";

  return `
    <form class="admin-category-form" data-admin-category-form data-editing-id="${editingCategory?.id || ""}">
      <label class="admin-filter-field">
        <span>Nombre</span>
        <input class="form-control" type="text" name="nombre" value="${escapeHtml(nombre)}" autocomplete="off" required>
      </label>
      <label class="admin-filter-field admin-category-description">
        <span>DescripciÃ³n</span>
        <input class="form-control" type="text" name="descripcion" value="${escapeHtml(descripcion)}" autocomplete="off">
      </label>
      <div class="admin-category-form-actions">
        <button class="btn btn-ingreso" type="submit" data-admin-category-save ${nombre.trim() ? "" : "disabled"}>
          <i class="bi ${isEditing ? "bi-save-fill" : "bi-plus-circle-fill"}"></i>
          ${isEditing ? "Guardar cambios" : "Crear categorÃ­a"}
        </button>
        ${isEditing
          ? `<button class="btn btn-outline-light admin-secondary-btn" type="button" data-admin-category-cancel>
              Cancelar
            </button>`
          : ""
        }
      </div>
    </form>
  `;
}

async function renderAdminCategoriesView(options = {}) {
  adminCategoriesState.includeInactive = options.includeInactive ?? adminCategoriesState.includeInactive;
  adminCategoriesState.editingId = options.editingId ?? adminCategoriesState.editingId;

  try {
    adminCategoriesState.items = await fetchAdminCategories(adminCategoriesState.includeInactive);
  } catch (error) {
    console.error("Error al cargar categorias desde Supabase:", error);
    adminCategoriesState.items = [];
  }

  const editingCategory = adminCategoriesState.items.find((category) => String(category.id) === String(adminCategoriesState.editingId));

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Torneo</p>
        <h2>CategorÃ­as</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-admin-categories-toggle-bajas>
        <i class="bi ${adminCategoriesState.includeInactive ? "bi-eye-slash-fill" : "bi-eye-fill"}"></i>
        ${adminCategoriesState.includeInactive ? "Ocultar bajas" : "Ver bajas"}
      </button>
    </div>

    <section class="admin-filter-panel admin-category-editor">
      ${renderAdminCategoryForm(editingCategory)}
    </section>

    <section class="division-table-panel admin-teams-panel">
      <div class="table-responsive">
        <table class="table frame-table admin-categories-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Nombre</th>
              <th>DescripciÃ³n</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody data-admin-category-rows>${renderAdminCategoryRows()}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderAdminCategoryRows(categories = adminCategoriesState.items) {
  if (!categories.length) {
    return `
      <tr>
        <td colspan="5" class="admin-empty-row">No se encontraron categorías.</td>
      </tr>
    `;
  }

  return categories.map((category, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(category.nombre || "")}</td>
      <td>${escapeHtml(category.descripcion || "-")}</td>
      <td>
        <span class="admin-status-pill ${category.activa === false ? "inactive" : "active"}">
          ${getAdminCategoryStatus(category)}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar categoría ${escapeHtml(category.nombre || "")}" data-admin-category-edit="${category.id}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          ${category.activa === false
            ? `<button type="button" aria-label="Reactivar categoría ${escapeHtml(category.nombre || "")}" data-admin-category-activate="${category.id}">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>`
            : `<button type="button" aria-label="Dar de baja categoría ${escapeHtml(category.nombre || "")}" data-admin-category-deactivate="${category.id}">
                <i class="bi bi-trash-fill"></i>
              </button>`
          }
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminCategoryForm(editingCategory = null) {
  const isEditing = Boolean(editingCategory);
  const nombre = editingCategory?.nombre || "";
  const descripcion = editingCategory?.descripcion || "";

  return `
    <form class="admin-category-form" data-admin-category-form data-editing-id="${editingCategory?.id || ""}">
      <label class="admin-filter-field">
        <span>Nombre</span>
        <input class="form-control" type="text" name="nombre" value="${escapeHtml(nombre)}" autocomplete="off" required>
      </label>
      <label class="admin-filter-field admin-category-description">
        <span>Descripción</span>
        <input class="form-control" type="text" name="descripcion" value="${escapeHtml(descripcion)}" autocomplete="off">
      </label>
      <div class="admin-category-form-actions">
        <button class="btn btn-ingreso" type="submit" data-admin-category-save ${nombre.trim() ? "" : "disabled"}>
          <i class="bi ${isEditing ? "bi-save-fill" : "bi-plus-circle-fill"}"></i>
          ${isEditing ? "Guardar cambios" : "Crear categoría"}
        </button>
        ${isEditing
          ? `<button class="btn btn-outline-light admin-secondary-btn" type="button" data-admin-category-cancel>
              Cancelar
            </button>`
          : ""
        }
      </div>
    </form>
  `;
}

async function renderAdminCategoriesView(options = {}) {
  adminCategoriesState.includeInactive = options.includeInactive ?? adminCategoriesState.includeInactive;
  adminCategoriesState.editingId = options.editingId ?? adminCategoriesState.editingId;

  try {
    adminCategoriesState.items = await fetchAdminCategories(adminCategoriesState.includeInactive);
  } catch (error) {
    console.error("Error al cargar categorias desde Supabase:", error);
    adminCategoriesState.items = [];
  }

  const editingCategory = adminCategoriesState.items.find((category) => String(category.id) === String(adminCategoriesState.editingId));

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Torneo</p>
        <h2>Categorías</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-admin-category-new>
        <i class="bi bi-plus-lg"></i>
        Cargar categoría
      </button>
    </div>

    <section class="admin-filter-panel admin-category-editor">
      ${renderAdminCategoryForm(editingCategory)}
    </section>

    <section class="division-table-panel admin-teams-panel">
      <div class="table-responsive">
        <table class="table frame-table admin-categories-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody data-admin-category-rows>${renderAdminCategoryRows()}</tbody>
        </table>
      </div>
    </section>

    <div class="admin-category-footer-actions">
      <button class="btn btn-ingreso admin-view-inactive-btn" type="button" data-admin-categories-toggle-bajas>
        <i class="bi ${adminCategoriesState.includeInactive ? "bi-eye-slash-fill" : "bi-eye-fill"}"></i>
        ${adminCategoriesState.includeInactive ? "Ocultar bajas" : "Ver bajas"}
      </button>
    </div>
  `;
}

function renderAdminCategoryRows(categories = adminCategoriesState.items) {
  if (!categories.length) {
    return `
      <tr>
        <td colspan="5" class="admin-empty-row">No se encontraron categor&iacute;as.</td>
      </tr>
    `;
  }

  return categories.map((category, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(category.nombre || "")}</td>
      <td>${escapeHtml(category.descripcion || "-")}</td>
      <td>
        <span class="admin-status-pill ${category.activa === false ? "inactive" : "active"}">
          ${getAdminCategoryStatus(category)}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar categoria ${escapeHtml(category.nombre || "")}" data-admin-category-edit="${category.id}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          ${category.activa === false
            ? `<button type="button" aria-label="Reactivar categoria ${escapeHtml(category.nombre || "")}" data-admin-category-activate="${category.id}">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>`
            : `<button type="button" aria-label="Dar de baja categoria ${escapeHtml(category.nombre || "")}" data-admin-category-deactivate="${category.id}">
                <i class="bi bi-trash-fill"></i>
              </button>`
          }
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminCategoryForm(editingCategory = null) {
  return "";
}

async function renderAdminCategoriesView(options = {}) {
  adminCategoriesState.includeInactive = options.includeInactive ?? adminCategoriesState.includeInactive;
  adminCategoriesState.editingId = options.editingId ?? adminCategoriesState.editingId;

  try {
    adminCategoriesState.items = await fetchAdminCategories(adminCategoriesState.includeInactive);
  } catch (error) {
    console.error("Error al cargar categorias desde Supabase:", error);
    adminCategoriesState.items = [];
  }

  const editingCategory = adminCategoriesState.items.find((category) => String(category.id) === String(adminCategoriesState.editingId));

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Torneo</p>
        <h2>Categor&iacute;as</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-admin-category-new>
        <i class="bi bi-plus-lg"></i>
        Cargar nueva categor&iacute;a
      </button>
    </div>

    ${renderAdminCategoryForm(editingCategory)}

    <section class="division-table-panel admin-teams-panel">
      <div class="table-responsive">
        <table class="table frame-table admin-categories-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Nombre</th>
              <th>Descripci&oacute;n</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody data-admin-category-rows>${renderAdminCategoryRows()}</tbody>
        </table>
      </div>
    </section>

    <div class="admin-category-footer-actions">
      <button class="btn btn-ingreso admin-view-inactive-btn" type="button" data-admin-categories-toggle-bajas>
        <i class="bi ${adminCategoriesState.includeInactive ? "bi-eye-slash-fill" : "bi-eye-fill"}"></i>
        ${adminCategoriesState.includeInactive ? "Ocultar bajas" : "Ver bajas"}
      </button>
    </div>
  `;
}

function renderAdminDivisionRows(selectedCategory = "", page = 1) {
  const divisions = getTournamentDivisions(selectedCategory);

  if (!divisions.length) {
    return `
      <tr>
        <td colspan="4" class="admin-empty-row">No se encontraron divisiones.</td>
      </tr>
    `;
  }

  const pageInfo = paginateItems(divisions, page, 30);

  return pageInfo.items.map((division, index) => `
    <tr>
      <td>${(pageInfo.page - 1) * pageInfo.pageSize + index + 1}</td>
      <td>${division.name}</td>
      <td>${division.category}</td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar división ${division.name}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button type="button" aria-label="Eliminar división ${division.name}">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminDivisionsView(selectedCategory = "", page = 1) {
  const categories = getTournamentCategories();
  const divisionsPageInfo = paginateItems(getTournamentDivisions(selectedCategory), page, 30);

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Torneo</p>
        <h2>Divisiones</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button">
        <i class="bi bi-plus-lg"></i>
        Crear nueva división
      </button>
    </div>

    <section class="division-table-panel admin-teams-panel">
      <div class="admin-filter-grid admin-single-filter-grid" aria-label="Filtro de divisiones">
        <label class="admin-filter-field admin-search-field">
          <span>Categoría</span>
          <select class="form-select" data-admin-division-category>
            <option value="">Todas las categorías</option>
            ${categories.map((category) => `
              <option value="${category.name}" ${category.name === selectedCategory ? "selected" : ""}>${category.name}</option>
            `).join("")}
          </select>
        </label>
      </div>

      <div class="table-responsive">
        <table class="table frame-table admin-divisions-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>${renderAdminDivisionRows(selectedCategory, divisionsPageInfo.page)}</tbody>
        </table>
      </div>
      ${renderAdminPagination("tournament-divisions", divisionsPageInfo)}
    </section>
  `;
}

function normalizeSearchText(value) {
  return value.trim().toLowerCase();
}

function getEffectiveSearchTerm(value) {
  const term = value.trim();
  return term.length >= 3 ? term : "";
}

function paginateItems(items, page = 1, pageSize = ADMIN_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(Number(page) || 1, 1), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems: items.length,
    pageSize
  };
}

function renderAdminPagination(type, pageInfo) {
  if (pageInfo.totalItems <= pageInfo.pageSize) {
    return "";
  }

  return `
    <div class="admin-pagination" data-admin-pagination="${type}">
      <span>Página ${pageInfo.page} de ${pageInfo.totalPages}</span>
      <div>
        <button type="button" data-admin-page="${type}" data-page="${pageInfo.page - 1}" ${pageInfo.page === 1 ? "disabled" : ""}>
          <i class="bi bi-chevron-left"></i>
        </button>
        <button type="button" data-admin-page="${type}" data-page="${pageInfo.page + 1}" ${pageInfo.page === pageInfo.totalPages ? "disabled" : ""}>
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  `;
}

function updateAdminPagination(type, pageInfo) {
  const pagination = contentShell.querySelector(`[data-admin-pagination="${type}"]`);
  if (!pagination) return;
  pagination.outerHTML = renderAdminPagination(type, pageInfo);
}

function getAdminTeamsForFilters(selectedCategory, selectedDivision) {
  if (!selectedCategory || !selectedDivision) return [];
  return [...teams].sort((a, b) => a.shortName.localeCompare(b.shortName));
}

function getAdminFilteredTeams(searchTerm = "") {
  const normalizedSearch = normalizeSearchText(searchTerm);
  return teams.filter((team) => team.shortName.toLowerCase().includes(normalizedSearch));
}

function renderAdminTeamRows(hasCompletedFilters, searchTerm = "", page = 1) {
  if (!hasCompletedFilters) {
    return `
      <tr>
        <td colspan="4" class="admin-empty-row">Seleccioná categoría y división para visualizar equipos.</td>
      </tr>
    `;
  }

  const filteredTeams = getAdminFilteredTeams(searchTerm);

  if (!filteredTeams.length) {
    return `
      <tr>
        <td colspan="4" class="admin-empty-row">No se encontraron equipos para la búsqueda indicada.</td>
      </tr>
    `;
  }

  const pageInfo = paginateItems(filteredTeams, page);

  return pageInfo.items.map((team, index) => `
    <tr>
      <td>${(pageInfo.page - 1) * ADMIN_PAGE_SIZE + index + 1}</td>
      <td>
        <span class="fixture-team">${renderTeamBadge(team, "small")} ${team.shortName}</span>
      </td>
      <td>${team.delegate}</td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar ${team.shortName}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button type="button" aria-label="Eliminar ${team.shortName}">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminTeamsView(selectedCategory = "", selectedDivision = "", searchTerm = "", page = 1) {
  const divisionMap = getAdminDivisionMap();
  const categories = Object.keys(divisionMap);
  const divisions = selectedCategory ? divisionMap[selectedCategory] : [];
  const hasCompletedFilters = Boolean(selectedCategory && selectedDivision);
  const teamPageInfo = paginateItems(hasCompletedFilters ? getAdminFilteredTeams(searchTerm) : [], page);

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Administrador</p>
        <h2>Equipos</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-open-new-team-modal>
        <i class="bi bi-plus-lg"></i>
        Cargar nuevo equipo
      </button>
    </div>

    <section class="division-table-panel admin-teams-panel">
      <div class="admin-filter-grid" aria-label="Filtros obligatorios de equipos">
        <label class="admin-filter-field">
          <span>Categoría</span>
          <select class="form-select" data-admin-team-category>
            <option value="">Seleccionar categoría</option>
            ${categories.map((category) => `
              <option value="${category}" ${category === selectedCategory ? "selected" : ""}>${category}</option>
            `).join("")}
          </select>
        </label>

        <label class="admin-filter-field">
          <span>División</span>
          <select class="form-select" data-admin-team-division ${selectedCategory ? "" : "disabled"}>
            <option value="">Seleccionar división</option>
            ${divisions.map((division) => `
              <option value="${division}" ${division === selectedDivision ? "selected" : ""}>${division}</option>
            `).join("")}
          </select>
        </label>

        <label class="admin-filter-field admin-search-field">
          <span>Buscar equipo</span>
          <input class="form-control" type="search" value="${searchTerm}" placeholder="Buscar por nombre corto" data-admin-team-search ${hasCompletedFilters ? "" : "disabled"}>
        </label>
      </div>

      <div class="table-responsive">
        <table class="table frame-table admin-teams-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Equipo</th>
              <th>Delegado</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody data-admin-team-rows>${renderAdminTeamRows(hasCompletedFilters, searchTerm, teamPageInfo.page)}</tbody>
        </table>
      </div>
      ${hasCompletedFilters ? renderAdminPagination("teams", teamPageInfo) : ""}
    </section>
  `;
}

function getAdminFilteredDelegateTeams(searchTerm = "") {
  const normalizedSearch = normalizeSearchText(searchTerm);
  return teams.filter((team) =>
    team.delegate.toLowerCase().includes(normalizedSearch) ||
    team.shortName.toLowerCase().includes(normalizedSearch) ||
    team.contact.toLowerCase().includes(normalizedSearch)
  );
}

function renderAdminDelegateRows(hasCompletedFilters, searchTerm = "", page = 1) {
  if (!hasCompletedFilters) {
    return `
      <tr>
        <td colspan="5" class="admin-empty-row">Seleccioná categoría y división para visualizar delegados.</td>
      </tr>
    `;
  }

  const filteredTeams = getAdminFilteredDelegateTeams(searchTerm);

  if (!filteredTeams.length) {
    return `
      <tr>
        <td colspan="5" class="admin-empty-row">No se encontraron delegados para la búsqueda indicada.</td>
      </tr>
    `;
  }

  const pageInfo = paginateItems(filteredTeams, page);

  return pageInfo.items.map((team, index) => `
    <tr>
      <td>${(pageInfo.page - 1) * ADMIN_PAGE_SIZE + index + 1}</td>
      <td>${team.delegate}</td>
      <td>
        <span class="fixture-team">${renderTeamBadge(team, "small")} ${team.shortName}</span>
      </td>
      <td>${team.contact}</td>
      <td>${team.id}</td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar delegado ${team.delegate}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button type="button" aria-label="Eliminar delegado ${team.delegate}">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminDelegatesView(selectedCategory = "", selectedDivision = "", searchTerm = "", page = 1) {
  const divisionMap = getAdminDivisionMap();
  const categories = Object.keys(divisionMap);
  const divisions = selectedCategory ? divisionMap[selectedCategory] : [];
  const hasCompletedFilters = Boolean(selectedCategory && selectedDivision);
  const delegatePageInfo = paginateItems(hasCompletedFilters ? getAdminFilteredDelegateTeams(searchTerm) : [], page);

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Administrador</p>
        <h2>Delegados</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-open-new-delegate-modal>
        <i class="bi bi-plus-lg"></i>
        Cargar nuevo delegado
      </button>
    </div>

    <section class="division-table-panel admin-teams-panel">
      <div class="admin-filter-grid" aria-label="Filtros obligatorios de delegados">
        <label class="admin-filter-field">
          <span>Categoría</span>
          <select class="form-select" data-admin-delegate-category>
            <option value="">Seleccionar categoría</option>
            ${categories.map((category) => `
              <option value="${category}" ${category === selectedCategory ? "selected" : ""}>${category}</option>
            `).join("")}
          </select>
        </label>

        <label class="admin-filter-field">
          <span>División</span>
          <select class="form-select" data-admin-delegate-division ${selectedCategory ? "" : "disabled"}>
            <option value="">Seleccionar división</option>
            ${divisions.map((division) => `
              <option value="${division}" ${division === selectedDivision ? "selected" : ""}>${division}</option>
            `).join("")}
          </select>
        </label>

        <label class="admin-filter-field admin-search-field">
          <span>Buscar delegado</span>
          <input class="form-control" type="search" value="${searchTerm}" placeholder="Apellido y nombre, equipo o contacto" data-admin-delegate-search ${hasCompletedFilters ? "" : "disabled"}>
        </label>
      </div>

      <div class="table-responsive">
        <table class="table frame-table admin-delegates-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Apellido y nombre</th>
              <th>Equipo</th>
              <th>Contacto</th>
              <th>Usuario</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody data-admin-delegate-rows>${renderAdminDelegateRows(hasCompletedFilters, searchTerm, delegatePageInfo.page)}</tbody>
        </table>
      </div>
      ${hasCompletedFilters ? renderAdminPagination("delegates", delegatePageInfo) : ""}
    </section>
  `;
}

function getAdminFilteredObservers(searchTerm = "") {
  const normalizedSearch = normalizeSearchText(searchTerm);
  return observers
    .filter((observer) => observer.name.toLowerCase().includes(normalizedSearch))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function renderAdminObserverRows(searchTerm = "", page = 1) {
  const filteredObservers = getAdminFilteredObservers(searchTerm);

  if (!filteredObservers.length) {
    return `
      <tr>
        <td colspan="5" class="admin-empty-row">No se encontraron veedores para la búsqueda indicada.</td>
      </tr>
    `;
  }

  const pageInfo = paginateItems(filteredObservers, page);

  return pageInfo.items.map((observer, index) => `
    <tr>
      <td>${(pageInfo.page - 1) * ADMIN_PAGE_SIZE + index + 1}</td>
      <td>${observer.name}</td>
      <td>${observer.contact}</td>
      <td>${observer.username}</td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar veedor ${observer.name}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button type="button" aria-label="Eliminar veedor ${observer.name}">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminObserversView(searchTerm = "", page = 1) {
  const observerPageInfo = paginateItems(getAdminFilteredObservers(searchTerm), page);

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Administrador</p>
        <h2>Veedores</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-open-new-observer-modal>
        <i class="bi bi-plus-lg"></i>
        Cargar nuevo veedor
      </button>
    </div>

    <section class="division-table-panel admin-teams-panel">
      <div class="admin-filter-grid admin-single-filter-grid" aria-label="Filtro de veedores">
        <label class="admin-filter-field admin-search-field">
          <span>Buscar veedor</span>
          <input class="form-control" type="search" value="${searchTerm}" placeholder="Apellido y nombre" data-admin-observer-search>
        </label>
      </div>

      <div class="table-responsive">
        <table class="table frame-table admin-observers-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Apellido y nombre</th>
              <th>Contacto</th>
              <th>Usuario</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody data-admin-observer-rows>${renderAdminObserverRows(searchTerm, observerPageInfo.page)}</tbody>
        </table>
      </div>
      ${renderAdminPagination("observers", observerPageInfo)}
    </section>
  `;
}

async function fetchAdminDivisions(includeInactive = false) {
  const endpoint = includeInactive ? "/divisiones?verBajas=true" : "/divisiones";
  const response = await apiGet(endpoint);
  return getApiData(response);
}

async function fetchActiveAdminCategories() {
  const response = await apiGet("/categorias");
  return getApiData(response);
}

async function fetchAdminObservers(includeInactive = false) {
  const endpoint = includeInactive ? "/veedores?verBajas=true" : "/veedores";
  const response = await apiGet(endpoint);
  return getApiData(response);
}

async function fetchAdminUsers() {
  const response = await apiGet("/usuarios");
  return getApiData(response);
}

function getDivisionCategoryName(division) {
  return division.categoria?.nombre || adminDivisionsState.categories.find((category) => String(category.id) === String(division.categoria_id))?.nombre || "-";
}

function getAdminDivisionStatus(division) {
  return division.activa === false ? "Dado de baja" : "Activa";
}

function getAdminObserverStatus(observer) {
  return observer.activo === false ? "Dado de baja" : "Activo";
}

function renderAdminDivisionRows(page = 1) {
  let divisions = adminDivisionsState.items;

  if (adminDivisionsState.selectedCategory) {
    divisions = divisions.filter((division) => String(division.categoria_id) === String(adminDivisionsState.selectedCategory));
  }

  if (!divisions.length) {
    return `
      <tr>
        <td colspan="6" class="admin-empty-row">No se encontraron divisiones.</td>
      </tr>
    `;
  }

  const pageInfo = paginateItems(divisions, page, 30);

  return pageInfo.items.map((division, index) => `
    <tr>
      <td>${(pageInfo.page - 1) * pageInfo.pageSize + index + 1}</td>
      <td>${escapeHtml(division.nombre || "")}</td>
      <td>${escapeHtml(getDivisionCategoryName(division))}</td>
      <td>${escapeHtml(division.descripcion || "-")}</td>
      <td>
        <span class="admin-status-pill ${division.activa === false ? "inactive" : "active"}">
          ${getAdminDivisionStatus(division)}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar division ${escapeHtml(division.nombre || "")}" data-admin-division-edit="${division.id}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          ${division.activa === false
            ? `<button type="button" aria-label="Reactivar division ${escapeHtml(division.nombre || "")}" data-admin-division-activate="${division.id}">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>`
            : `<button type="button" aria-label="Dar de baja division ${escapeHtml(division.nombre || "")}" data-admin-division-deactivate="${division.id}">
                <i class="bi bi-trash-fill"></i>
              </button>`
          }
        </div>
      </td>
    </tr>
  `).join("");
}

async function renderAdminDivisionsView(selectedCategory = adminDivisionsState.selectedCategory, page = 1, options = {}) {
  adminDivisionsState.includeInactive = options.includeInactive ?? adminDivisionsState.includeInactive;
  adminDivisionsState.selectedCategory = selectedCategory || "";

  try {
    const [divisions, categories] = await Promise.all([
      fetchAdminDivisions(adminDivisionsState.includeInactive),
      fetchActiveAdminCategories()
    ]);
    adminDivisionsState.items = divisions;
    adminDivisionsState.categories = categories;
  } catch (error) {
    console.error("Error al cargar divisiones desde Supabase:", error);
    adminDivisionsState.items = [];
  }

  const filteredDivisions = adminDivisionsState.selectedCategory
    ? adminDivisionsState.items.filter((division) => String(division.categoria_id) === String(adminDivisionsState.selectedCategory))
    : adminDivisionsState.items;
  const divisionsPageInfo = paginateItems(filteredDivisions, page, 30);

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Torneo</p>
        <h2>Divisiones</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-admin-division-new>
        <i class="bi bi-plus-lg"></i>
        Cargar nueva divisi&oacute;n
      </button>
    </div>

    <section class="division-table-panel admin-teams-panel">
      <div class="admin-filter-grid admin-single-filter-grid" aria-label="Filtro de divisiones">
        <label class="admin-filter-field admin-search-field">
          <span>Categor&iacute;a</span>
          <select class="form-select" data-admin-division-category>
            <option value="">Todas las categor&iacute;as</option>
            ${adminDivisionsState.categories.map((category) => `
              <option value="${category.id}" ${String(category.id) === String(adminDivisionsState.selectedCategory) ? "selected" : ""}>${escapeHtml(category.nombre)}</option>
            `).join("")}
          </select>
        </label>
      </div>

      <div class="table-responsive">
        <table class="table frame-table admin-divisions-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Nombre</th>
              <th>Categor&iacute;a</th>
              <th>Descripci&oacute;n</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody data-admin-division-rows>${renderAdminDivisionRows(divisionsPageInfo.page)}</tbody>
        </table>
      </div>
      ${renderAdminPagination("tournament-divisions", divisionsPageInfo)}
    </section>

    <div class="admin-category-footer-actions">
      <button class="btn btn-ingreso admin-view-inactive-btn" type="button" data-admin-divisions-toggle-bajas>
        <i class="bi ${adminDivisionsState.includeInactive ? "bi-eye-slash-fill" : "bi-eye-fill"}"></i>
        ${adminDivisionsState.includeInactive ? "Ocultar bajas" : "Ver bajas"}
      </button>
    </div>
  `;
}

function renderAdminObserverRows(searchTerm = adminObserversState.searchTerm, page = 1) {
  const filteredObservers = getAdminFilteredObserversFromBackend(searchTerm);

  if (!filteredObservers.length) {
    return `
      <tr>
        <td colspan="6" class="admin-empty-row">No se encontraron veedores.</td>
      </tr>
    `;
  }

  const pageInfo = paginateItems(filteredObservers, page);

  return pageInfo.items.map((observer, index) => {
    const user = observer.usuario || {};

    return `
      <tr>
        <td>${(pageInfo.page - 1) * ADMIN_PAGE_SIZE + index + 1}</td>
        <td>${escapeHtml(`${user.nombre || ""} ${user.apellido || ""}`.trim() || "Usuario sin nombre")}</td>
        <td>${escapeHtml(user.contacto || "-")}</td>
        <td>${escapeHtml(user.usuario || "-")}</td>
        <td>
          <span class="admin-status-pill ${observer.activo === false ? "inactive" : "active"}">
            ${getAdminObserverStatus(observer)}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button type="button" aria-label="Editar veedor ${escapeHtml(user.nombre || "")}" data-admin-observer-edit="${observer.id}">
              <i class="bi bi-pencil-fill"></i>
            </button>
            ${observer.activo === false
              ? `<button type="button" aria-label="Reactivar veedor ${escapeHtml(user.nombre || "")}" data-admin-observer-activate="${observer.id}">
                  <i class="bi bi-arrow-counterclockwise"></i>
                </button>`
              : `<button type="button" aria-label="Dar de baja veedor ${escapeHtml(user.nombre || "")}" data-admin-observer-deactivate="${observer.id}">
                  <i class="bi bi-trash-fill"></i>
                </button>`
            }
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function getAdminFilteredObserversFromBackend(searchTerm = "") {
  const normalizedSearch = normalizeSearchText(searchTerm);
  return adminObserversState.items.filter((observer) => {
    const user = observer.usuario || {};
    return `${user.nombre || ""} ${user.apellido || ""} ${user.contacto || ""} ${user.usuario || ""}`.toLowerCase().includes(normalizedSearch);
  });
}

async function renderAdminObserversView(searchTerm = adminObserversState.searchTerm, page = 1, options = {}) {
  adminObserversState.includeInactive = options.includeInactive ?? adminObserversState.includeInactive;
  adminObserversState.searchTerm = searchTerm || "";

  try {
    adminObserversState.items = await fetchAdminObservers(adminObserversState.includeInactive);
  } catch (error) {
    console.error("Error al cargar veedores desde Supabase:", error);
    adminObserversState.items = [];
  }

  const filteredObservers = getAdminFilteredObserversFromBackend(adminObserversState.searchTerm);
  const observerPageInfo = paginateItems(filteredObservers, page);

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Administrador</p>
        <h2>Veedores</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button" data-admin-observer-new>
        <i class="bi bi-plus-lg"></i>
        Cargar nuevo veedor
      </button>
    </div>

    <section class="division-table-panel admin-teams-panel">
      <div class="admin-filter-grid admin-single-filter-grid" aria-label="Filtro de veedores">
        <label class="admin-filter-field admin-search-field">
          <span>Buscar veedor</span>
          <input class="form-control" type="search" value="${escapeHtml(adminObserversState.searchTerm)}" placeholder="Nombre, contacto o usuario" data-admin-observer-search>
        </label>
      </div>

      <div class="table-responsive">
        <table class="table frame-table admin-observers-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Apellido y nombre</th>
              <th>Contacto</th>
              <th>Usuario</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody data-admin-observer-rows>${renderAdminObserverRows(adminObserversState.searchTerm, observerPageInfo.page)}</tbody>
        </table>
      </div>
      ${renderAdminPagination("observers", observerPageInfo)}
    </section>

    <div class="admin-category-footer-actions">
      <button class="btn btn-ingreso admin-view-inactive-btn" type="button" data-admin-observers-toggle-bajas>
        <i class="bi ${adminObserversState.includeInactive ? "bi-eye-slash-fill" : "bi-eye-fill"}"></i>
        ${adminObserversState.includeInactive ? "Ocultar bajas" : "Ver bajas"}
      </button>
    </div>
  `;
}

function getAdminPlayers(hasCompletedFilters, selectedTeamId = "", searchTerm = "", onlyWithObservations = false) {
  if (!hasCompletedFilters) return [];

  const normalizedSearch = normalizeSearchText(searchTerm);
  return teams
    .filter((team) => !selectedTeamId || team.id === selectedTeamId)
    .flatMap((team) => team.players.map((player) => ({ ...player, team })))
    .filter((player) => player.name.toLowerCase().includes(normalizedSearch))
    .filter((player) => !onlyWithObservations || getPendingPlayerObservationsForAdmin(player).length > 0)
    .sort((a, b) => {
      const teamOrder = a.team.shortName.localeCompare(b.team.shortName);
      return teamOrder || a.name.localeCompare(b.name);
    });
}

function renderAdminPlayerRows(hasCompletedFilters, selectedTeamId = "", searchTerm = "", page = 1, onlyWithObservations = false) {
  if (!hasCompletedFilters) {
    return `
      <tr>
        <td colspan="7" class="admin-empty-row">Seleccioná categoría y división para visualizar jugadores.</td>
      </tr>
    `;
  }

  const players = getAdminPlayers(hasCompletedFilters, selectedTeamId, searchTerm, onlyWithObservations);

  if (!players.length) {
    return `
      <tr>
        <td colspan="7" class="admin-empty-row">No se encontraron jugadores para la búsqueda indicada.</td>
      </tr>
    `;
  }

  const pageInfo = paginateItems(players, page);

  return pageInfo.items.map((player, index) => {
    const observations = getPendingPlayerObservationsForAdmin(player);
    const playerStatus = getPlayerStatus(player);

    return `
    <tr>
      <td>${(pageInfo.page - 1) * ADMIN_PAGE_SIZE + index + 1}</td>
      <td>${player.name}</td>
      <td>
        <span class="fixture-team">${renderTeamBadge(player.team, "small")} ${player.team.shortName}</span>
      </td>
      <td>${player.team.contact}</td>
      <td>
        <span class="player-status ${playerStatus.toLowerCase()}">${playerStatus}</span>
      </td>
      <td>${renderPlayerObservationSummary(observations)}</td>
      <td>
        <button class="admin-observation-view" type="button" data-player-history="${escapeHtml(getPlayerStatusKey(player))}">
          <i class="bi bi-clock-history"></i>
          Historial
        </button>
      </td>
    </tr>
  `;
  }).join("");
}

function renderAdminPlayersView(selectedCategory = "", selectedDivision = "", selectedTeamId = "", searchTerm = "", page = 1, onlyWithObservations = false) {
  const divisionMap = getAdminDivisionMap();
  const categories = Object.keys(divisionMap);
  const divisions = selectedCategory ? divisionMap[selectedCategory] : [];
  const hasCompletedFilters = Boolean(selectedCategory && selectedDivision);
  const hasObservedPlayers = getObservedPlayersCount() > 0;
  const effectiveOnlyWithObservations = hasObservedPlayers && onlyWithObservations;
  const availableTeams = getAdminTeamsForFilters(selectedCategory, selectedDivision);
  const playerPageInfo = paginateItems(getAdminPlayers(hasCompletedFilters, selectedTeamId, searchTerm, effectiveOnlyWithObservations), page);

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Administrador</p>
        <h2>Jugadores</h2>
      </div>
    </div>

    <section class="division-table-panel admin-teams-panel">
      ${renderAdminPlayerObservationMetrics(selectedCategory, selectedDivision, selectedTeamId)}

      <div class="admin-filter-grid admin-player-filter-grid" aria-label="Filtros obligatorios de jugadores">
        <label class="admin-filter-field">
          <span>Categoría</span>
          <select class="form-select" data-admin-player-category>
            <option value="">Seleccionar categoría</option>
            ${categories.map((category) => `
              <option value="${category}" ${category === selectedCategory ? "selected" : ""}>${category}</option>
            `).join("")}
          </select>
        </label>

        <label class="admin-filter-field">
          <span>División</span>
          <select class="form-select" data-admin-player-division ${selectedCategory ? "" : "disabled"}>
            <option value="">Seleccionar división</option>
            ${divisions.map((division) => `
              <option value="${division}" ${division === selectedDivision ? "selected" : ""}>${division}</option>
            `).join("")}
          </select>
        </label>

        <label class="admin-filter-field">
          <span>Equipo</span>
          <select class="form-select" data-admin-player-team ${hasCompletedFilters ? "" : "disabled"}>
            <option value="">Todos los equipos</option>
            ${availableTeams.map((team) => `
              <option value="${team.id}" ${team.id === selectedTeamId ? "selected" : ""}>${team.shortName}</option>
            `).join("")}
          </select>
        </label>

        <label class="admin-filter-field admin-check-field">
          <span>Observaciones</span>
          <span class="admin-check-control">
            <input class="form-check-input" type="checkbox" data-admin-player-observations-only ${effectiveOnlyWithObservations ? "checked" : ""} ${hasCompletedFilters && hasObservedPlayers ? "" : "disabled"}>
            Ver jugadores observados
          </span>
        </label>

        <label class="admin-filter-field admin-search-field">
          <span>Buscar jugador</span>
          <input class="form-control" type="search" value="${searchTerm}" placeholder="Apellido y nombre" data-admin-player-search ${hasCompletedFilters ? "" : "disabled"}>
        </label>
      </div>

      <div class="table-responsive">
        <table class="table frame-table admin-players-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Apellido y nombre</th>
              <th>Equipo</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th>Observaci&oacute;n</th>
              <th>Historial disciplinario</th>
            </tr>
          </thead>
          <tbody data-admin-player-rows>${renderAdminPlayerRows(hasCompletedFilters, selectedTeamId, searchTerm, playerPageInfo.page, effectiveOnlyWithObservations)}</tbody>
        </table>
      </div>
      ${hasCompletedFilters ? renderAdminPagination("players", playerPageInfo) : ""}
    </section>
  `;
}

function enterDelegateView(team) {
  sidebarContent.innerHTML = `
    <div class="sidebar-main admin-sidebar-main">
      <div>
        <div class="sidebar-heading">
          <i class="bi bi-sliders2-vertical"></i>
          <h2>Acciones</h2>
        </div>
        <div class="sidebar-role-label">Rol: Delegado</div>
        <div class="admin-actions">
          <button class="division-link" type="button" data-delegate-home>
            <i class="bi bi-house-fill"></i>
            Resumen
          </button>
          <button class="division-link" type="button" data-delegate-team>
            <i class="bi bi-shield-fill-check"></i>
            Mi equipo
          </button>
          <button class="division-link" type="button" data-delegate-players>
            <i class="bi bi-people-fill"></i>
            Jugadores
          </button>
          <button class="division-link" type="button" data-help-role="delegate">
            <i class="bi bi-question-circle-fill"></i>
            Ayuda
          </button>
        </div>
      </div>
      ${renderDarkModeSwitcher()}
      <button class="btn btn-ingreso w-100" type="button" data-admin-logout>
        <i class="bi bi-box-arrow-left"></i>
        Salir
      </button>
    </div>
  `;
  sidebarContent.dataset.delegateTeam = team.id;
  contentShell.innerHTML = renderDelegateHome(team);
  document.body.classList.add("admin-view");
}

function enterAdminView() {
  sidebarContent.innerHTML = `
    <div class="sidebar-main admin-sidebar-main">
      <div>
        <div class="sidebar-heading">
          <i class="bi bi-sliders2-vertical"></i>
          <h2>Acciones</h2>
        </div>
        <div class="sidebar-role-label">Rol: Administrador</div>
        <div class="admin-actions">
          <button class="division-link" type="button" data-admin-action="Equipos">
            <i class="bi bi-shield-fill-check"></i>
            Equipos
          </button>
          <button class="division-link" type="button" data-admin-action="Delegados">
            <i class="bi bi-person-badge-fill"></i>
            Delegados
          </button>
          <button class="division-link" type="button" data-admin-action="Jugadores">
            <i class="bi bi-people-fill"></i>
            Jugadores
            <span class="menu-alert-badge" data-player-observation-count>${getPlayerObservationCount()}</span>
          </button>
          <button class="division-link" type="button" data-admin-action="Veedores">
            <i class="bi bi-clipboard2-check-fill"></i>
            Veedores
          </button>
          <div class="admin-menu-accordion">
            <button class="division-link admin-menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#adminTournamentMenu" aria-expanded="false" aria-controls="adminTournamentMenu">
              <i class="bi bi-trophy-fill"></i>
              Torneo
              <i class="bi bi-chevron-down ms-auto"></i>
            </button>
            <div class="collapse" id="adminTournamentMenu">
              <button class="division-link admin-sub-action" type="button" data-admin-action="Categorías">
                Categorías
              </button>
              <button class="division-link admin-sub-action" type="button" data-admin-action="Divisiones">
                Divisiones
              </button>
            </div>
          </div>
          <button class="division-link" type="button" data-admin-action="Configuraciones">
            <i class="bi bi-gear-fill"></i>
            Configuraciones
          </button>
          <button class="division-link" type="button" data-help-role="admin">
            <i class="bi bi-question-circle-fill"></i>
            Ayuda
          </button>
        </div>
      </div>
      ${renderDarkModeSwitcher()}
      <button class="btn btn-ingreso w-100" type="button" data-admin-logout>
        <i class="bi bi-box-arrow-left"></i>
        Salir
      </button>
    </div>
  `;
  contentShell.innerHTML = renderAdminHome();
  cargarResumenDashboard();
  document.body.classList.add("admin-view");
}

function enterObserverView() {
  sidebarContent.innerHTML = `
    <div class="sidebar-main admin-sidebar-main">
      <div>
        <div class="sidebar-heading">
          <i class="bi bi-sliders2-vertical"></i>
          <h2>Acciones</h2>
        </div>
        <div class="sidebar-role-label">Rol: Veedor</div>
        <div class="admin-actions">
          <button class="division-link" type="button" data-observer-matches>
            <i class="bi bi-calendar2-week-fill"></i>
            Partidos
          </button>
          <button class="division-link" type="button" data-help-role="observer">
            <i class="bi bi-question-circle-fill"></i>
            Ayuda
          </button>
        </div>
      </div>
      ${renderDarkModeSwitcher()}
      <button class="btn btn-ingreso w-100" type="button" data-admin-logout>
        <i class="bi bi-box-arrow-left"></i>
        Salir
      </button>
    </div>
  `;
  contentShell.innerHTML = renderObserverMatches();
  document.body.classList.add("admin-view");
}

document.querySelector(".frame-logo").addEventListener("click", showHome);

passwordToggle.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "text";

  passwordInput.type = isPasswordVisible ? "password" : "text";
  passwordToggle.setAttribute("aria-label", isPasswordVisible ? "Mostrar contraseña" : "Ocultar contraseña");
  passwordToggle.innerHTML = `<i class="bi ${isPasswordVisible ? "bi-eye-fill" : "bi-eye-slash-fill"}"></i>`;
});

sidebarContent.addEventListener("click", async (event) => {
  const logoutButton = event.target.closest("[data-admin-logout]");
  const delegatePlayersButton = event.target.closest("[data-delegate-players]");
  const delegateHomeButton = event.target.closest("[data-delegate-home]");
  const delegateTeamButton = event.target.closest("[data-delegate-team]");
  const observerMatchesButton = event.target.closest("[data-observer-matches]");
  const adminActionButton = event.target.closest("[data-admin-action]");
  const publicPageButton = event.target.closest("[data-public-page]");
  const helpButton = event.target.closest("[data-help-role]");
  const divisionButton = event.target.closest("[data-division]");
  const categoryToggleButton = event.target.closest("[data-category-toggle]");

  if (categoryToggleButton && sidebarContent.contains(categoryToggleButton)) {
    const panel = document.getElementById(categoryToggleButton.dataset.categoryToggle);
    const isOpen = panel?.classList.toggle("show");

    categoryToggleButton.classList.toggle("collapsed", !isOpen);
    categoryToggleButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    return;
  }

  if (divisionButton && sidebarContent.contains(divisionButton)) {
    setSelectedDivision(divisionButton);
    return;
  }

  if (helpButton) {
    const helpUrl = HELP_URLS[helpButton.dataset.helpRole];
    if (helpUrl) {
      window.open(helpUrl, "_blank", "noopener");
    }
    return;
  }

  if (publicPageButton) {
    showPublicInfo(publicPageButton.dataset.publicPage);
    return;
  }

  if (delegatePlayersButton || delegateHomeButton || delegateTeamButton) {
    const team = getTeam(sidebarContent.dataset.delegateTeam);
    const sectionName = delegatePlayersButton ? "Jugadores" : delegateTeamButton ? "Mi equipo" : "Resumen";
    showContentLoader(sectionName, () => {
      contentShell.innerHTML = delegatePlayersButton
        ? renderDelegatePlayers(team)
        : delegateTeamButton
          ? renderDelegateTeamView(team)
          : renderDelegateHome(team);
    });
    return;
  }

  if (observerMatchesButton) {
    showContentLoader("Partidos", () => {
      contentShell.innerHTML = renderObserverMatches();
    });
    return;
  }

  if (adminActionButton) {
    const actionName = adminActionButton.dataset.adminAction;
    showContentLoader(actionName, async () => {
      if (actionName === "Equipos") {
        contentShell.innerHTML = renderAdminTeamsView();
        return;
      }

      if (actionName === "Delegados") {
        contentShell.innerHTML = renderAdminDelegatesView();
        return;
      }

      if (actionName === "Jugadores") {
        contentShell.innerHTML = renderAdminPlayersView();
        return;
      }

      if (actionName === "Veedores") {
        contentShell.innerHTML = await renderAdminObserversView("", 1, { includeInactive: false });
        return;
      }

      if (actionName === "Categorías") {
        contentShell.innerHTML = await renderAdminCategoriesView({ includeInactive: false, editingId: null });
        return;
      }

      if (actionName === "Divisiones") {
        contentShell.innerHTML = await renderAdminDivisionsView("", 1, { includeInactive: false });
        return;
      }

      if (actionName === "Configuraciones") {
        contentShell.innerHTML = renderAdminSettingsView();
        return;
      }

      contentShell.innerHTML = renderAdminActionView(actionName);
    });
    return;
  }

  if (!logoutButton) return;

  try {
    await supabaseClient?.auth?.signOut();
  } catch (error) {
    console.error("Error al cerrar sesion de Supabase:", error);
  }

  window.location.href = "index.html#home";
  window.location.reload();
});

sidebarContent.addEventListener("change", (event) => {
  const themeControl = event.target.closest("[data-dark-mode-control]");

  if (themeControl && sidebarContent.contains(themeControl)) {
    applyDarkMode(themeControl.checked);
  }
});

contentShell.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-observer-edit-match]");
  const observerBackButton = event.target.closest("[data-observer-back]");
  const scoreIncButton = event.target.closest("[data-score-inc]");
  const scoreDecButton = event.target.closest("[data-score-dec]");
  const goalIncButton = event.target.closest("[data-goal-inc]");
  const goalDecButton = event.target.closest("[data-goal-dec]");
  const eventButton = event.target.closest(".event-btn");
  const observationButton = event.target.closest("[data-observation]");
  const adminPlayerObservationButton = event.target.closest("[data-admin-player-observation]");
  const playerHistoryButton = event.target.closest("[data-player-history]");
  const observerSaveButton = event.target.closest("[data-observer-save]");
  const adminPageButton = event.target.closest("[data-admin-page]");
  const delegateTeamEditButton = event.target.closest("[data-delegate-team-edit]");
  const openDelegatePlayerButton = event.target.closest("[data-open-delegate-player-modal]");
  const openNewTeamButton = event.target.closest("[data-open-new-team-modal]");
  const openNewDelegateButton = event.target.closest("[data-open-new-delegate-modal]");
  const openNewObserverButton = event.target.closest("[data-open-new-observer-modal]");
  const savePublicSettingsButton = event.target.closest("[data-save-public-settings]");
  const aboutCarouselMoveButton = event.target.closest("[data-about-carousel-move]");
  const generateFixtureButton = event.target.closest("[data-generate-fixture]");
  const downloadFixtureButton = event.target.closest("[data-download-fixture]");
  const toggleCategoriesBajasButton = event.target.closest("[data-admin-categories-toggle-bajas]");
  const newCategoryButton = event.target.closest("[data-admin-category-new]");
  const editCategoryButton = event.target.closest("[data-admin-category-edit]");
  const cancelCategoryButton = event.target.closest("[data-admin-category-cancel]");
  const deactivateCategoryButton = event.target.closest("[data-admin-category-deactivate]");
  const activateCategoryButton = event.target.closest("[data-admin-category-activate]");
  const newDivisionButton = event.target.closest("[data-admin-division-new]");
  const editDivisionButton = event.target.closest("[data-admin-division-edit]");
  const deactivateDivisionButton = event.target.closest("[data-admin-division-deactivate]");
  const activateDivisionButton = event.target.closest("[data-admin-division-activate]");
  const toggleDivisionsBajasButton = event.target.closest("[data-admin-divisions-toggle-bajas]");
  const newAdminObserverButton = event.target.closest("[data-admin-observer-new]");
  const editAdminObserverButton = event.target.closest("[data-admin-observer-edit]");
  const deactivateAdminObserverButton = event.target.closest("[data-admin-observer-deactivate]");
  const activateAdminObserverButton = event.target.closest("[data-admin-observer-activate]");
  const toggleObserversBajasButton = event.target.closest("[data-admin-observers-toggle-bajas]");

  if (newDivisionButton) {
    await openAdminDivisionModal();
    return;
  }

  if (editDivisionButton) {
    await openAdminDivisionModal(editDivisionButton.dataset.adminDivisionEdit);
    return;
  }

  if (toggleDivisionsBajasButton) {
    contentShell.innerHTML = await renderAdminDivisionsView(adminDivisionsState.selectedCategory, 1, {
      includeInactive: !adminDivisionsState.includeInactive
    });
    return;
  }

  if (deactivateDivisionButton || activateDivisionButton) {
    const id = deactivateDivisionButton?.dataset.adminDivisionDeactivate || activateDivisionButton?.dataset.adminDivisionActivate;
    const action = deactivateDivisionButton ? "desactivar" : "activar";
    try {
      await apiPatch(`/divisiones/${id}/${action}`);
      contentShell.innerHTML = await renderAdminDivisionsView(adminDivisionsState.selectedCategory, 1);
      cargarMenuCategorias();
    } catch (error) {
      console.error(`Error al ${action} la division:`, error);
    }
    return;
  }

  if (newAdminObserverButton) {
    await openAdminObserverModal();
    return;
  }

  if (editAdminObserverButton) {
    await openAdminObserverModal(editAdminObserverButton.dataset.adminObserverEdit);
    return;
  }

  if (toggleObserversBajasButton) {
    contentShell.innerHTML = await renderAdminObserversView(adminObserversState.searchTerm, 1, {
      includeInactive: !adminObserversState.includeInactive
    });
    return;
  }

  if (deactivateAdminObserverButton || activateAdminObserverButton) {
    const id = deactivateAdminObserverButton?.dataset.adminObserverDeactivate || activateAdminObserverButton?.dataset.adminObserverActivate;
    const action = deactivateAdminObserverButton ? "desactivar" : "activar";
    try {
      await apiPatch(`/veedores/${id}/${action}`);
      contentShell.innerHTML = await renderAdminObserversView(adminObserversState.searchTerm, 1);
    } catch (error) {
      console.error(`Error al ${action} el veedor:`, error);
    }
    return;
  }

  if (toggleCategoriesBajasButton) {
    contentShell.innerHTML = await renderAdminCategoriesView({
      includeInactive: !adminCategoriesState.includeInactive,
      editingId: null
    });
    return;
  }

  if (newCategoryButton) {
    openAdminCategoryModal();
    return;
  }

  if (editCategoryButton) {
    openAdminCategoryModal(editCategoryButton.dataset.adminCategoryEdit);
    return;
  }

  if (cancelCategoryButton) {
    contentShell.innerHTML = await renderAdminCategoriesView({
      includeInactive: adminCategoriesState.includeInactive,
      editingId: null
    });
    return;
  }

  if (deactivateCategoryButton) {
    try {
      await apiPatch(`/categorias/${deactivateCategoryButton.dataset.adminCategoryDeactivate}/desactivar`);
      contentShell.innerHTML = await renderAdminCategoriesView({
        includeInactive: adminCategoriesState.includeInactive,
        editingId: null
      });
      cargarResumenDashboard();
      cargarMenuCategorias();
    } catch (error) {
      console.error("Error al dar de baja la categorÃ­a:", error);
    }
    return;
  }

  if (activateCategoryButton) {
    try {
      await apiPatch(`/categorias/${activateCategoryButton.dataset.adminCategoryActivate}/activar`);
      contentShell.innerHTML = await renderAdminCategoriesView({
        includeInactive: true,
        editingId: null
      });
      cargarResumenDashboard();
      cargarMenuCategorias();
    } catch (error) {
      console.error("Error al reactivar la categorÃ­a:", error);
    }
    return;
  }

  if (aboutCarouselMoveButton) {
    updateAboutCarousel(Number(aboutCarouselMoveButton.dataset.aboutCarouselMove));
    return;
  }

  if (editButton) {
    const matchId = editButton.dataset.observerEditMatch;
    showContentLoader("Detalle del partido", () => {
      contentShell.innerHTML = renderObserverEditMatch(matchId);
    });
    return;
  }

  if (observerBackButton) {
    showContentLoader("Partidos", () => {
      contentShell.innerHTML = renderObserverMatches();
    });
    return;
  }

  if (scoreIncButton || scoreDecButton) {
    const key = scoreIncButton ? scoreIncButton.dataset.scoreInc : scoreDecButton.dataset.scoreDec;
    const valueElement = contentShell.querySelector(`[data-score-value="${key}"]`);
    const currentValue = Number(valueElement.textContent);
    const nextValue = Math.max(0, currentValue + (scoreIncButton ? 1 : -1));
    valueElement.textContent = nextValue;
    return;
  }

  if (goalIncButton || goalDecButton) {
    const goalCounter = (goalIncButton || goalDecButton).closest(".goal-counter");
    const valueElement = goalCounter.querySelector("[data-goal-value]");
    const currentValue = Number(valueElement.textContent);
    const nextValue = Math.max(0, currentValue + (goalIncButton ? 1 : -1));
    valueElement.textContent = nextValue;
    return;
  }

  if (eventButton) {
    eventButton.classList.toggle("is-selected");
    return;
  }

  if (observerSaveButton) {
    observerSaveButton.classList.add("is-saved");
    observerSaveButton.innerHTML = `<i class="bi bi-check2-circle"></i> Guardado`;
    window.setTimeout(() => {
      observerSaveButton.classList.remove("is-saved");
      observerSaveButton.innerHTML = `<i class="bi bi-save-fill"></i> Guardar`;
    }, 1600);
    return;
  }

  if (savePublicSettingsButton) {
    const originalLabel = savePublicSettingsButton.dataset.originalLabel || savePublicSettingsButton.textContent.trim();
    savePublicSettingsButton.dataset.originalLabel = originalLabel;
    contentShell.querySelectorAll("[data-setting]").forEach((field) => {
      publicSettings[field.dataset.setting] = field.value.trim();
    });

    savePublicSettingsButton.disabled = true;
    savePublicSettingsButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

    try {
      await savePublicSettingsToSupabase();
      applyPublicSettings();
      savePublicSettingsButton.classList.add("is-saved");
      savePublicSettingsButton.innerHTML = `<i class="bi bi-check2-circle"></i> Guardado`;
      window.setTimeout(() => {
        savePublicSettingsButton.classList.remove("is-saved");
        savePublicSettingsButton.disabled = false;
        savePublicSettingsButton.innerHTML = `<i class="bi bi-save-fill"></i> ${originalLabel}`;
      }, 1400);
    } catch (error) {
      console.error("Error al guardar redes y contacto en Supabase:", error);
      savePublicSettingsButton.disabled = false;
      savePublicSettingsButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
      return;
    }

    if (!publicInfoContent.classList.contains("d-none")) {
      const regulationTitle = publicInfoContent.querySelector("h2");
      if (regulationTitle && regulationTitle.textContent.includes("Reglamento")) {
        publicInfoContent.innerHTML = renderRegulationContent();
      }
    }
    return;
  }

  if (generateFixtureButton) {
    const key = generateFixtureButton.dataset.generateFixture;
    const row = getTournamentConfigByKey(key);
    if (!row) return;

    generateFixturePlan(row.category, row.division);
    refreshTournamentGeneralRows();
    return;
  }

  if (downloadFixtureButton) {
    const key = downloadFixtureButton.dataset.downloadFixture;
    const row = getTournamentConfigByKey(key);
    const fixture = row?.config.fixture;
    if (!fixture) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("El navegador bloqueó la ventana de descarga. Permití ventanas emergentes para generar el PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(renderFixtureDownloadDocument(fixture));
    printWindow.document.close();
    return;
  }

  if (adminPageButton) {
    const type = adminPageButton.dataset.adminPage;
    const page = Number(adminPageButton.dataset.page);

    if (type === "teams") {
      const category = contentShell.querySelector("[data-admin-team-category]")?.value || "";
      const division = contentShell.querySelector("[data-admin-team-division]")?.value || "";
      const searchTerm = getEffectiveSearchTerm(contentShell.querySelector("[data-admin-team-search]")?.value || "");
      contentShell.innerHTML = renderAdminTeamsView(category, division, searchTerm, page);
      return;
    }

    if (type === "delegates") {
      const category = contentShell.querySelector("[data-admin-delegate-category]")?.value || "";
      const division = contentShell.querySelector("[data-admin-delegate-division]")?.value || "";
      const searchTerm = getEffectiveSearchTerm(contentShell.querySelector("[data-admin-delegate-search]")?.value || "");
      contentShell.innerHTML = renderAdminDelegatesView(category, division, searchTerm, page);
      return;
    }

    if (type === "observers") {
      const searchTerm = getEffectiveSearchTerm(contentShell.querySelector("[data-admin-observer-search]")?.value || "");
      contentShell.innerHTML = await renderAdminObserversView(searchTerm, page);
      return;
    }

    if (type === "tournament-divisions") {
      const category = contentShell.querySelector("[data-admin-division-category]")?.value || "";
      contentShell.innerHTML = await renderAdminDivisionsView(category, page);
      return;
    }

    const category = contentShell.querySelector("[data-admin-player-category]")?.value || "";
    const division = contentShell.querySelector("[data-admin-player-division]")?.value || "";
    const teamId = contentShell.querySelector("[data-admin-player-team]")?.value || "";
    const searchTerm = getEffectiveSearchTerm(contentShell.querySelector("[data-admin-player-search]")?.value || "");
    const onlyWithObservations = contentShell.querySelector("[data-admin-player-observations-only]")?.checked || false;
    contentShell.innerHTML = renderAdminPlayersView(category, division, teamId, searchTerm, page, onlyWithObservations);
    return;
  }

  if (delegateTeamEditButton) {
    const team = getTeam(sidebarContent.dataset.delegateTeam);
    if (!team) return;

    if (delegateTeamEditButton.dataset.delegateTeamEdit === "edit") {
      contentShell.innerHTML = renderDelegateTeamView(team, true);
      return;
    }

    const crestInput = contentShell.querySelector('[data-team-edit-field="crest"]');
    const crest = crestInput?.files?.[0] ? URL.createObjectURL(crestInput.files[0]) : team.crest;
    const abbreviation = contentShell.querySelector('[data-team-edit-field="abbreviation"]')?.value.trim() || team.abbreviation;
    const shortName = contentShell.querySelector('[data-team-edit-field="shortName"]')?.value.trim() || team.shortName;
    const description = contentShell.querySelector('[data-team-edit-field="description"]')?.value.trim() || team.description;
    const colorInputs = [...contentShell.querySelectorAll("[data-team-color]")];
    const noThirdColor = contentShell.querySelector("[data-team-color-none]")?.checked || false;
    const nextColors = colorInputs
      .filter((input) => input.dataset.teamColor !== "2" || !noThirdColor)
      .map((input) => input.value);

    team.crest = crest;
    team.abbreviation = abbreviation;
    team.shortName = shortName;
    team.description = description;
    team.shirtColors = nextColors;
    team.colors = nextColors.slice(0, 2);
    contentShell.innerHTML = renderDelegateTeamView(team);
    return;
  }

  if (openDelegatePlayerButton) {
    delegatePlayerForm?.reset();
    if (saveDelegatePlayerButton) saveDelegatePlayerButton.disabled = true;
    bootstrap.Modal.getOrCreateInstance(delegatePlayerModalElement).show();
    return;
  }

  if (openNewTeamButton) {
    newTeamForm.reset();
    populateNewTeamCategories();
    populateNewTeamDivisions("");
    validateNewTeamForm();
    bootstrap.Modal.getOrCreateInstance(newTeamModalElement).show();
    return;
  }

  if (openNewDelegateButton) {
    newDelegateForm.reset();
    newDelegatePassword.value = "123456";
    populateNewDelegateCategories();
    populateNewDelegateTeams("");
    validateNewDelegateForm();
    bootstrap.Modal.getOrCreateInstance(newDelegateModalElement).show();
    return;
  }

  if (openNewObserverButton) {
    prepareNewObserverForm();
    bootstrap.Modal.getOrCreateInstance(newObserverModalElement).show();
    return;
  }

  const adminSaveButton = event.target.closest(".admin-save-row-btn");
  if (adminSaveButton) {
    adminSaveButton.classList.add("is-saved");
    adminSaveButton.innerHTML = `<i class="bi bi-check2-circle"></i> Guardado`;
    window.setTimeout(() => {
      adminSaveButton.classList.remove("is-saved");
      adminSaveButton.innerHTML = `<i class="bi bi-save-fill"></i> Guardar`;
      adminSaveButton.disabled = true;
    }, 1200);
    return;
  }

  if (observationButton) {
    activeObservationButton = observationButton;
    renderObservationEditorBody(observationButton.dataset.observationText || "");
    const observationModal = bootstrap.Modal.getOrCreateInstance(observationModalElement);
    observationModal.show();
    return;
  }

  if (adminPlayerObservationButton) {
    activeObservationButton = null;
    renderObservationReviewBody(adminPlayerObservationButton.dataset.adminPlayerObservation);
    const observationModal = bootstrap.Modal.getOrCreateInstance(observationModalElement);
    observationModal.show();
    return;
  }

  if (playerHistoryButton) {
    activeObservationButton = null;
    renderPlayerHistoryBody(playerHistoryButton.dataset.playerHistory);
    const observationModal = bootstrap.Modal.getOrCreateInstance(observationModalElement);
    observationModal.show();
    return;
  }
});

contentShell.addEventListener("change", async (event) => {
  const categorySelect = event.target.closest("[data-admin-team-category]");
  const divisionSelect = event.target.closest("[data-admin-team-division]");
  const delegateCategorySelect = event.target.closest("[data-admin-delegate-category]");
  const delegateDivisionSelect = event.target.closest("[data-admin-delegate-division]");
  const playerCategorySelect = event.target.closest("[data-admin-player-category]");
  const playerDivisionSelect = event.target.closest("[data-admin-player-division]");
  const playerTeamSelect = event.target.closest("[data-admin-player-team]");
  const playerStatusSelect = event.target.closest("[data-admin-player-status]");
  const playerObservationFilter = event.target.closest("[data-admin-player-observations-only]");
  const tournamentDivisionCategorySelect = event.target.closest("[data-admin-division-category]");
  const observerDateSelect = event.target.closest("[data-observer-date-select]");
  const teamThirdColorNone = event.target.closest("[data-team-color-none]");
  const registrationFromInput = event.target.closest("[data-registration-from]");
  const registrationToInput = event.target.closest("[data-registration-to]");
  const tournamentDatesInput = event.target.closest("[data-tournament-dates]");
  const tournamentPlayoffInput = event.target.closest("[data-tournament-playoff]");
  const tournamentPlayoffTeamsInput = event.target.closest("[data-tournament-playoff-teams]");

  if (observerDateSelect) {
    contentShell.innerHTML = renderObserverMatches(observerDateSelect.value);
    return;
  }

  if (teamThirdColorNone) {
    const thirdColorInput = contentShell.querySelector('[data-team-color="2"]');
    if (thirdColorInput) thirdColorInput.disabled = teamThirdColorNone.checked;
    return;
  }

  if (registrationFromInput) {
    tournamentSettings.playerRegistrationFrom = registrationFromInput.value;
    return;
  }

  if (registrationToInput) {
    tournamentSettings.playerRegistrationTo = registrationToInput.value;
    return;
  }

  if (tournamentDatesInput) {
    const row = getTournamentConfigByKey(tournamentDatesInput.dataset.tournamentDates);
    if (row) {
      row.config.datesCount = Math.max(Number(tournamentDatesInput.value) || 1, 1);
      row.config.fixture = null;
      refreshTournamentGeneralRows();
    }
    return;
  }

  if (tournamentPlayoffInput) {
    const row = getTournamentConfigByKey(tournamentPlayoffInput.dataset.tournamentPlayoff);
    if (row) {
      row.config.playoffEnabled = tournamentPlayoffInput.checked;
      row.config.fixture = null;
      refreshTournamentGeneralRows();
    }
    return;
  }

  if (tournamentPlayoffTeamsInput) {
    const row = getTournamentConfigByKey(tournamentPlayoffTeamsInput.dataset.tournamentPlayoffTeams);
    if (row) {
      row.config.playoffTeams = Math.min(Math.max(Number(tournamentPlayoffTeamsInput.value) || 2, 2), row.teams);
      row.config.fixture = null;
      refreshTournamentGeneralRows();
    }
    return;
  }

  if (categorySelect) {
    const category = categorySelect.value;
    contentShell.innerHTML = renderAdminTeamsView(category, "");
    return;
  }

  if (divisionSelect) {
    const category = contentShell.querySelector("[data-admin-team-category]")?.value || "";
    const division = divisionSelect.value;
    contentShell.innerHTML = renderAdminTeamsView(category, division);
    return;
  }

  if (delegateCategorySelect) {
    const category = delegateCategorySelect.value;
    contentShell.innerHTML = renderAdminDelegatesView(category, "");
    return;
  }

  if (delegateDivisionSelect) {
    const category = contentShell.querySelector("[data-admin-delegate-category]")?.value || "";
    const division = delegateDivisionSelect.value;
    contentShell.innerHTML = renderAdminDelegatesView(category, division);
    return;
  }

  if (playerCategorySelect) {
    const category = playerCategorySelect.value;
    contentShell.innerHTML = renderAdminPlayersView(category, "");
    return;
  }

  if (playerDivisionSelect) {
    const category = contentShell.querySelector("[data-admin-player-category]")?.value || "";
    const division = playerDivisionSelect.value;
    contentShell.innerHTML = renderAdminPlayersView(category, division);
    return;
  }

  if (playerTeamSelect) {
    const category = contentShell.querySelector("[data-admin-player-category]")?.value || "";
    const division = contentShell.querySelector("[data-admin-player-division]")?.value || "";
    const teamId = playerTeamSelect.value;
    const onlyWithObservations = contentShell.querySelector("[data-admin-player-observations-only]")?.checked || false;
    contentShell.innerHTML = renderAdminPlayersView(category, division, teamId, "", 1, onlyWithObservations);
    return;
  }

  if (playerObservationFilter) {
    const category = contentShell.querySelector("[data-admin-player-category]")?.value || "";
    const division = contentShell.querySelector("[data-admin-player-division]")?.value || "";
    const teamId = contentShell.querySelector("[data-admin-player-team]")?.value || "";
    const searchTerm = getEffectiveSearchTerm(contentShell.querySelector("[data-admin-player-search]")?.value || "");
    contentShell.innerHTML = renderAdminPlayersView(category, division, teamId, searchTerm, 1, playerObservationFilter.checked);
    return;
  }

  if (playerStatusSelect) {
    const row = playerStatusSelect.closest("tr");
    const saveButton = row.querySelector(".admin-save-row-btn");
    if (saveButton) saveButton.disabled = false;
    return;
  }

  if (tournamentDivisionCategorySelect) {
    contentShell.innerHTML = await renderAdminDivisionsView(tournamentDivisionCategorySelect.value, 1);
  }
});

contentShell.addEventListener("submit", async (event) => {
  const categoryForm = event.target.closest("[data-admin-category-form]");
  if (!categoryForm) return;

  event.preventDefault();

  const formData = new FormData(categoryForm);
  const nombre = String(formData.get("nombre") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const editingId = categoryForm.dataset.editingId;
  const saveButton = categoryForm.querySelector("[data-admin-category-save]");

  if (!nombre) return;

  if (saveButton) {
    saveButton.disabled = true;
    saveButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;
  }

  try {
    if (editingId) {
      await apiPut(`/categorias/${editingId}`, { nombre, descripcion });
    } else {
      await apiPost("/categorias", { nombre, descripcion });
    }

    contentShell.innerHTML = await renderAdminCategoriesView({
      includeInactive: adminCategoriesState.includeInactive,
      editingId: null
    });
    cargarResumenDashboard();
    cargarMenuCategorias();
  } catch (error) {
    console.error("Error al guardar la categorÃ­a:", error);
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
    }
  }
});

contentShell.addEventListener("input", (event) => {
  const whatsappPhoneInput = event.target.closest('[data-setting="whatsappPhone"]');
  const teamSearch = event.target.closest("[data-admin-team-search]");
  const delegateSearch = event.target.closest("[data-admin-delegate-search]");
  const playerSearch = event.target.closest("[data-admin-player-search]");
  const observerSearch = event.target.closest("[data-admin-observer-search]");
  const categoryFormInput = event.target.closest("[data-admin-category-form] input");

  if (whatsappPhoneInput) {
    whatsappPhoneInput.value = whatsappPhoneInput.value.replace(/\D/g, "");
  }

  if (categoryFormInput) {
    const form = categoryFormInput.closest("[data-admin-category-form]");
    const saveButton = form.querySelector("[data-admin-category-save]");
    const nameInput = form.querySelector('[name="nombre"]');
    if (saveButton && nameInput) {
      saveButton.disabled = !nameInput.value.trim();
    }
    return;
  }

  if (!teamSearch && !delegateSearch && !playerSearch && !observerSearch) return;

  window.clearTimeout(adminSearchTimer);
  adminSearchTimer = window.setTimeout(async () => {
    if (teamSearch) {
      const category = contentShell.querySelector("[data-admin-team-category]")?.value || "";
      const division = contentShell.querySelector("[data-admin-team-division]")?.value || "";
      const searchTerm = getEffectiveSearchTerm(teamSearch.value);
      const rows = contentShell.querySelector("[data-admin-team-rows]");
      const pageInfo = paginateItems(getAdminFilteredTeams(searchTerm), 1);

      rows.innerHTML = renderAdminTeamRows(Boolean(category && division), searchTerm, 1);
      updateAdminPagination("teams", pageInfo);
      return;
    }

    if (delegateSearch) {
      const category = contentShell.querySelector("[data-admin-delegate-category]")?.value || "";
      const division = contentShell.querySelector("[data-admin-delegate-division]")?.value || "";
      const searchTerm = getEffectiveSearchTerm(delegateSearch.value);
      const rows = contentShell.querySelector("[data-admin-delegate-rows]");
      const pageInfo = paginateItems(getAdminFilteredDelegateTeams(searchTerm), 1);

      rows.innerHTML = renderAdminDelegateRows(Boolean(category && division), searchTerm, 1);
      updateAdminPagination("delegates", pageInfo);
      return;
    }

    if (observerSearch) {
      const searchTerm = getEffectiveSearchTerm(observerSearch.value);
      adminObserversState.searchTerm = searchTerm;
      const rows = contentShell.querySelector("[data-admin-observer-rows]");
      const pageInfo = paginateItems(getAdminFilteredObserversFromBackend(searchTerm), 1);

      rows.innerHTML = renderAdminObserverRows(searchTerm, 1);
      updateAdminPagination("observers", pageInfo);
      return;
    }

    const category = contentShell.querySelector("[data-admin-player-category]")?.value || "";
    const division = contentShell.querySelector("[data-admin-player-division]")?.value || "";
    const teamId = contentShell.querySelector("[data-admin-player-team]")?.value || "";
    const onlyWithObservations = contentShell.querySelector("[data-admin-player-observations-only]")?.checked || false;
    const searchTerm = getEffectiveSearchTerm(playerSearch.value);
    const rows = contentShell.querySelector("[data-admin-player-rows]");
    const pageInfo = paginateItems(getAdminPlayers(Boolean(category && division), teamId, searchTerm, onlyWithObservations), 1);

    rows.innerHTML = renderAdminPlayerRows(Boolean(category && division), teamId, searchTerm, 1, onlyWithObservations);
    updateAdminPagination("players", pageInfo);
  }, 220);
});

observationModalBody?.addEventListener("click", (event) => {
  const saveObservation = event.target.closest("#saveObservation");
  const saveResolution = event.target.closest("[data-save-observation-resolution]");
  const historyObservationView = event.target.closest("[data-history-observation-view]");
  const historyResolutionEdit = event.target.closest("[data-history-resolution-edit]");

  if (saveObservation) {
    saveActiveObservationText();
    return;
  }

  if (saveResolution) {
    saveObservationResolution();
    return;
  }

  if (historyObservationView) {
    renderObservationReviewBody(historyObservationView.dataset.historyObservationView, { readOnlyResolution: true });
    return;
  }

  if (historyResolutionEdit) {
    renderObservationReviewBody(historyResolutionEdit.dataset.historyResolutionEdit);
  }
});

observationModalBody?.addEventListener("input", (event) => {
  const autoResizeField = event.target.closest("[data-auto-resize-textarea]");
  if (autoResizeField) {
    autoResizeTextarea(autoResizeField);
  }
});

newTeamCategory.addEventListener("change", () => {
  populateNewTeamDivisions(newTeamCategory.value);
  validateNewTeamForm();
});

function validateNewCategoryForm() {
  if (!createCategoryButton || !newCategoryName) return;
  createCategoryButton.disabled = !newCategoryName.value.trim();
}

function openAdminCategoryModal(categoryId = "") {
  if (!newCategoryModalElement || !newCategoryForm) return;

  const category = adminCategoriesState.items.find((item) => String(item.id) === String(categoryId));
  newCategoryForm.reset();
  if (newCategoryId) newCategoryId.value = category?.id || "";
  if (newCategoryName) newCategoryName.value = category?.nombre || "";
  if (newCategoryDescription) newCategoryDescription.value = category?.descripcion || "";

  if (createCategoryButton) {
    createCategoryButton.disabled = !newCategoryName?.value.trim();
    createCategoryButton.innerHTML = `<i class="bi ${category ? "bi-save-fill" : "bi-plus-circle-fill"}"></i> ${category ? "Guardar cambios" : "Crear categor&iacute;a"}`;
  }

  const title = document.querySelector("#newCategoryModalLabel");
  if (title) {
    title.innerHTML = category ? "Editar categor&iacute;a" : "Cargar nueva categor&iacute;a";
  }

  bootstrap.Modal.getOrCreateInstance(newCategoryModalElement).show();
}

function populateAdminDivisionCategorySelect(selectedId = "") {
  if (!adminDivisionCategory) return;

  adminDivisionCategory.innerHTML = `
    <option value="">Seleccionar categor&iacute;a</option>
    ${adminDivisionsState.categories.map((category) => `
      <option value="${category.id}" ${String(category.id) === String(selectedId) ? "selected" : ""}>${escapeHtml(category.nombre)}</option>
    `).join("")}
  `;
}

function validateAdminDivisionForm() {
  if (!saveDivisionButton) return;
  saveDivisionButton.disabled = !(adminDivisionCategory?.value && adminDivisionName?.value.trim());
}

function validateAdminObserverForm() {
  if (!saveObserverButton) return;
  const observerId = adminObserverId?.value || "";
  const username = adminObserverUsername?.value.trim().toLowerCase() || "";
  const password = adminObserverPassword?.value || "";
  const isUsernameFormatValid = /^[a-z0-9._-]{3,}$/i.test(username);
  const isUsernameUnique = !adminObserversState.items.some((observer) =>
    String(observer.id) !== String(observerId) &&
    String(observer.usuario?.usuario || "").trim().toLowerCase() === username
  );
  const isPasswordValid = observerId ? !password || password.length >= 6 : password.length >= 6;
  const isContactValid = /^[0-9]+$/.test(adminObserverContact?.value.trim() || "");
  const isValid = Boolean(
    adminObserverFirstName?.value.trim() &&
    adminObserverLastName?.value.trim() &&
    isContactValid &&
    isUsernameFormatValid &&
    isUsernameUnique &&
    isPasswordValid
  );

  if (adminObserverFeedback) {
    if (username && !isUsernameFormatValid) {
      adminObserverFeedback.textContent = "El usuario debe tener al menos 3 caracteres y no usar espacios.";
    } else if (username && !isUsernameUnique) {
      adminObserverFeedback.textContent = "El usuario ya existe.";
    } else if (password && !isPasswordValid) {
      adminObserverFeedback.textContent = "La contraseña debe tener al menos 6 caracteres.";
    } else if (adminObserverContact?.value && !isContactValid) {
      adminObserverFeedback.textContent = "El contacto debe contener solo números.";
    } else {
      adminObserverFeedback.textContent = "";
    }
    adminObserverFeedback.classList.toggle("is-error", Boolean(adminObserverFeedback.textContent));
  }

  saveObserverButton.disabled = !isValid;
}

async function openAdminDivisionModal(divisionId = "") {
  if (!adminDivisionModalElement || !adminDivisionForm) return;

  if (!adminDivisionsState.categories.length) {
    adminDivisionsState.categories = await fetchActiveAdminCategories();
  }

  const division = adminDivisionsState.items.find((item) => String(item.id) === String(divisionId));
  adminDivisionForm.reset();
  adminDivisionId.value = division?.id || "";
  adminDivisionName.value = division?.nombre || "";
  adminDivisionDescription.value = division?.descripcion || "";
  populateAdminDivisionCategorySelect(division?.categoria_id || "");

  if (saveDivisionButton) {
    saveDivisionButton.innerHTML = `<i class="bi ${division ? "bi-save-fill" : "bi-plus-circle-fill"}"></i> ${division ? "Guardar cambios" : "Crear divisi&oacute;n"}`;
  }
  validateAdminDivisionForm();
  bootstrap.Modal.getOrCreateInstance(adminDivisionModalElement).show();
}

async function openAdminObserverModal(observerId = "") {
  if (!adminObserverModalElement || !adminObserverForm) return;

  const observer = adminObserversState.items.find((item) => String(item.id) === String(observerId));
  const user = observer?.usuario || {};
  adminObserverForm.reset();
  adminObserverId.value = observer?.id || "";
  adminObserverFirstName.value = user.nombre || "";
  adminObserverLastName.value = user.apellido || "";
  adminObserverContact.value = user.contacto || "";
  adminObserverUsername.value = user.usuario || "";
  adminObserverPassword.value = "";
  adminObserverPassword.placeholder = observer ? "Dejar vacía para no cambiar" : "";
  adminObserverPassword.required = !observer;
  adminObserverPassword.type = "password";
  if (adminObserverFeedback) {
    adminObserverFeedback.textContent = "";
    adminObserverFeedback.classList.remove("is-error");
  }

  if (saveObserverButton) {
    saveObserverButton.innerHTML = `<i class="bi ${observer ? "bi-save-fill" : "bi-plus-circle-fill"}"></i> ${observer ? "Guardar cambios" : "Crear veedor"}`;
  }
  validateAdminObserverForm();
  bootstrap.Modal.getOrCreateInstance(adminObserverModalElement).show();
}

newCategoryForm?.addEventListener("input", validateNewCategoryForm);

newCategoryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!newCategoryForm || !newCategoryName || !createCategoryButton || createCategoryButton.disabled) return;

  createCategoryButton.disabled = true;
  createCategoryButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

  try {
    const categoryId = newCategoryId?.value || "";
    const payload = {
      nombre: newCategoryName.value.trim(),
      descripcion: newCategoryDescription?.value.trim() || ""
    };

    if (categoryId) {
      await apiPut(`/categorias/${categoryId}`, payload);
    } else {
      await apiPost("/categorias", payload);
    }

    createCategoryButton.classList.add("is-saved");
    createCategoryButton.innerHTML = `<i class="bi bi-check2-circle"></i> Categor&iacute;a guardada`;

    window.setTimeout(async () => {
      createCategoryButton.classList.remove("is-saved");
      createCategoryButton.innerHTML = `<i class="bi bi-plus-circle-fill"></i> Crear categor&iacute;a`;
      bootstrap.Modal.getInstance(newCategoryModalElement)?.hide();
      newCategoryForm.reset();
      validateNewCategoryForm();
      contentShell.innerHTML = await renderAdminCategoriesView({
        includeInactive: adminCategoriesState.includeInactive,
        editingId: null
      });
      cargarResumenDashboard();
      cargarMenuCategorias();
    }, 650);
  } catch (error) {
    console.error("Error al crear la categoria:", error);
    createCategoryButton.disabled = false;
    createCategoryButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
  }
});

adminDivisionForm?.addEventListener("input", validateAdminDivisionForm);
adminDivisionForm?.addEventListener("change", validateAdminDivisionForm);

adminDivisionForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!saveDivisionButton || saveDivisionButton.disabled) return;

  const id = adminDivisionId?.value || "";
  const payload = {
    categoria_id: adminDivisionCategory.value,
    nombre: adminDivisionName.value.trim(),
    descripcion: adminDivisionDescription?.value.trim() || ""
  };

  saveDivisionButton.disabled = true;
  saveDivisionButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

  try {
    if (id) {
      await apiPut(`/divisiones/${id}`, payload);
    } else {
      await apiPost("/divisiones", payload);
    }

    saveDivisionButton.innerHTML = `<i class="bi bi-check2-circle"></i> Divisi&oacute;n guardada`;
    window.setTimeout(async () => {
      bootstrap.Modal.getInstance(adminDivisionModalElement)?.hide();
      contentShell.innerHTML = await renderAdminDivisionsView(adminDivisionsState.selectedCategory, 1);
      cargarMenuCategorias();
    }, 550);
  } catch (error) {
    console.error("Error al guardar la division:", error);
    saveDivisionButton.disabled = false;
    saveDivisionButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
  }
});

adminObserverContact?.addEventListener("input", () => {
  adminObserverContact.value = adminObserverContact.value.replace(/\D/g, "");
  validateAdminObserverForm();
});

adminObserverPasswordToggle?.addEventListener("click", () => {
  const isPasswordVisible = adminObserverPassword.type === "text";

  adminObserverPassword.type = isPasswordVisible ? "password" : "text";
  adminObserverPasswordToggle.setAttribute("aria-label", isPasswordVisible ? "Mostrar contraseña" : "Ocultar contraseña");
  adminObserverPasswordToggle.innerHTML = `<i class="bi ${isPasswordVisible ? "bi-eye-fill" : "bi-eye-slash-fill"}"></i>`;
});

adminObserverForm?.addEventListener("input", validateAdminObserverForm);
adminObserverForm?.addEventListener("change", validateAdminObserverForm);

adminObserverUsername?.addEventListener("input", () => {
  adminObserverUsername.value = adminObserverUsername.value.trim().toLowerCase();
  validateAdminObserverForm();
});

adminObserverForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!saveObserverButton || saveObserverButton.disabled) return;

  const id = adminObserverId?.value || "";
  const payload = {
    nombre: adminObserverFirstName.value.trim(),
    apellido: adminObserverLastName.value.trim(),
    contacto: adminObserverContact.value.trim(),
    usuario: adminObserverUsername.value.trim(),
    password: adminObserverPassword.value
  };

  if (id && !payload.password) {
    delete payload.password;
  }

  saveObserverButton.disabled = true;
  saveObserverButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

  try {
    if (id) {
      await apiPut(`/veedores/${id}`, payload);
    } else {
      await apiPost("/veedores", payload);
    }

    saveObserverButton.innerHTML = `<i class="bi bi-check2-circle"></i> Veedor guardado`;
    window.setTimeout(async () => {
      bootstrap.Modal.getInstance(adminObserverModalElement)?.hide();
      contentShell.innerHTML = await renderAdminObserversView(adminObserversState.searchTerm, 1);
    }, 550);
  } catch (error) {
    console.error("Error al guardar el veedor:", error);
    if (adminObserverFeedback) {
      adminObserverFeedback.textContent = error.message || "No se pudo guardar el veedor.";
      adminObserverFeedback.classList.add("is-error");
    }
    saveObserverButton.disabled = false;
    saveObserverButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
  }
});

newTeamForm.addEventListener("input", validateNewTeamForm);
newTeamForm.addEventListener("change", validateNewTeamForm);

newTeamForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (createTeamButton.disabled) return;

  createTeamButton.classList.add("is-saved");
  createTeamButton.innerHTML = `<i class="bi bi-check2-circle"></i> Equipo creado`;

  window.setTimeout(() => {
    createTeamButton.classList.remove("is-saved");
    createTeamButton.innerHTML = `<i class="bi bi-plus-circle-fill"></i> Crear equipo`;
    bootstrap.Modal.getInstance(newTeamModalElement)?.hide();
    newTeamForm.reset();
    populateNewTeamDivisions("");
    validateNewTeamForm();
  }, 900);
});

newDelegateCategory.addEventListener("change", () => {
  populateNewDelegateTeams(newDelegateCategory.value);
  newDelegateUsername.value = "";
  validateNewDelegateForm();
});

newDelegateTeam.addEventListener("change", () => {
  newDelegateUsername.value = "";
  updateDelegateDefaultsFromTeam();
  validateNewDelegateForm();
});

newDelegateContact.addEventListener("input", () => {
  newDelegateContact.value = newDelegateContact.value.replace(/\D/g, "");
  validateNewDelegateForm();
});

delegatePasswordToggle.addEventListener("click", () => {
  const isPasswordVisible = newDelegatePassword.type === "text";

  newDelegatePassword.type = isPasswordVisible ? "password" : "text";
  delegatePasswordToggle.setAttribute("aria-label", isPasswordVisible ? "Mostrar contraseña" : "Ocultar contraseña");
  delegatePasswordToggle.innerHTML = `<i class="bi ${isPasswordVisible ? "bi-eye-fill" : "bi-eye-slash-fill"}"></i>`;
});

newDelegateForm.addEventListener("input", validateNewDelegateForm);
newDelegateForm.addEventListener("change", validateNewDelegateForm);

newDelegateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (createDelegateButton.disabled) return;

  createDelegateButton.classList.add("is-saved");
  createDelegateButton.innerHTML = `<i class="bi bi-check2-circle"></i> Delegado creado`;

  window.setTimeout(() => {
    createDelegateButton.classList.remove("is-saved");
    createDelegateButton.innerHTML = `<i class="bi bi-plus-circle-fill"></i> Crear delegado`;
    bootstrap.Modal.getInstance(newDelegateModalElement)?.hide();
    newDelegateForm.reset();
    validateNewDelegateForm();
  }, 900);
});

delegatePlayerForm?.addEventListener("input", validateDelegatePlayerForm);
delegatePlayerForm?.addEventListener("change", validateDelegatePlayerForm);

delegatePlayerDni?.addEventListener("input", () => {
  delegatePlayerDni.value = delegatePlayerDni.value.replace(/\D/g, "");
  validateDelegatePlayerForm();
});

delegatePlayerForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!saveDelegatePlayerButton || saveDelegatePlayerButton.disabled) return;

  const team = getTeam(sidebarContent.dataset.delegateTeam);
  if (!team) return;

  team.players.push({
    number: Number(delegatePlayerNumber.value),
    name: `${delegatePlayerLastName.value.trim()} ${delegatePlayerFirstName.value.trim()}`,
    birthDate: formatDateInputToDisplay(delegatePlayerBirthDate.value),
    dni: delegatePlayerDni.value.trim(),
    age: 0,
    goals: 0,
    yellow: 0,
    red: 0
  });

  bootstrap.Modal.getInstance(delegatePlayerModalElement)?.hide();
  delegatePlayerForm.reset();
  validateDelegatePlayerForm();
  contentShell.innerHTML = renderDelegatePlayers(team);
});

newObserverContact.addEventListener("input", () => {
  newObserverContact.value = newObserverContact.value.replace(/\D/g, "");
  validateNewObserverForm();
});

observerPasswordToggle.addEventListener("click", () => {
  const isPasswordVisible = newObserverPassword.type === "text";

  newObserverPassword.type = isPasswordVisible ? "password" : "text";
  observerPasswordToggle.setAttribute("aria-label", isPasswordVisible ? "Mostrar contraseña" : "Ocultar contraseña");
  observerPasswordToggle.innerHTML = `<i class="bi ${isPasswordVisible ? "bi-eye-fill" : "bi-eye-slash-fill"}"></i>`;
});

newObserverForm.addEventListener("input", validateNewObserverForm);
newObserverForm.addEventListener("change", validateNewObserverForm);

newObserverForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (createObserverButton.disabled) return;

  const nextObserverId = getNextObserverId();
  observers.push({
    id: nextObserverId,
    name: `${newObserverLastName.value.trim()} ${newObserverFirstName.value.trim()}`,
    contact: newObserverContact.value.trim(),
    username: newObserverUsername.value.trim(),
    password: newObserverPassword.value
  });

  createObserverButton.classList.add("is-saved");
  createObserverButton.innerHTML = `<i class="bi bi-check2-circle"></i> Veedor creado`;

  window.setTimeout(async () => {
    createObserverButton.classList.remove("is-saved");
    createObserverButton.innerHTML = `<i class="bi bi-plus-circle-fill"></i> Crear veedor`;
    bootstrap.Modal.getInstance(newObserverModalElement)?.hide();
    contentShell.innerHTML = await renderAdminObserversView();
  }, 900);
});

document.querySelectorAll("[data-scroll-team]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = Number(button.dataset.scrollTeam);
    moveTeamCarousel(direction);
  });
});

teamCarousel.addEventListener("click", (event) => {
  const teamButton = event.target.closest("[data-team-id]");
  if (!teamButton) return;

  teamCarouselActiveIndex = Number(teamButton.dataset.teamCarouselIndex || 0);
  selectTeam(teamButton.dataset.teamId);
});

teamDetailView.addEventListener("click", (event) => {
  const backButton = event.target.closest("[data-back-to-division]");
  if (!backButton) return;

  showDivisionTables();
});

teamDetailView.addEventListener("change", (event) => {
  const statSelect = event.target.closest("[data-team-stat-select]");
  if (!statSelect) return;

  updateTeamStats(statSelect.value);
});

standingsBody.addEventListener("click", (event) => {
  const teamLink = event.target.closest("[data-team-id]");
  if (!teamLink) return;

  event.preventDefault();
  selectTeam(teamLink.dataset.teamId);
  teamDetailView.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

fixtureDateSelect.addEventListener("change", renderFixture);

if (darkModeToggle) {
  applyDarkMode(localStorage.getItem(THEME_STORAGE_KEY) === "true");
  darkModeToggle.addEventListener("change", () => {
    applyDarkMode(darkModeToggle.checked);
  });
}

applyPublicSettings();
loadPublicSettingsFromSupabase();
cargarResumenDashboard();
cargarMenuCategorias();


if (openLoginButton && loginModalElement) {
  openLoginButton.addEventListener("click", () => {
    bootstrap.Modal.getOrCreateInstance(loginModalElement).show();
  });
}

if (loginRetryButton && loginErrorModalElement && loginModalElement) {
  loginRetryButton.addEventListener("click", () => {
    const errorModal = bootstrap.Modal.getOrCreateInstance(loginErrorModalElement);
    errorModal.hide();

    loginErrorModalElement.addEventListener("hidden.bs.modal", () => {
      bootstrap.Modal.getOrCreateInstance(loginModalElement).show();
    }, { once: true });
  });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;
  const role = getActiveLoginRole();

  if (role === "Administrador") {
    const normalizedAdminLogin = username.toLowerCase();
    const adminUsername = normalizedAdminLogin.includes("@")
      ? normalizedAdminLogin.split("@")[0]
      : normalizedAdminLogin;

    if (adminUsername !== "admin") {
      showLoginError('El usuario administrador debe ser "admin" o "admin@frame0.local".');
      return;
    }

    try {
      await apiSignInWithRole(["admin", "superadmin"], username, password);

      const modalElement = document.querySelector("#loginModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
      }

      showProfileLoader("Administrador", enterAdminView);
      loginForm.reset();
      return;
    } catch (error) {
      console.error("Error al iniciar sesion de administrador en Supabase:", error);
      showLoginError(error.message || "No se pudo iniciar sesion con Supabase Auth.");
      return;
    }
  }

  if (role === "Veedor") {
    try {
      await apiPost("/veedores/login", {
        usuario: username,
        password
      });

      const modalElement = document.querySelector("#loginModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
      }

      showProfileLoader("Veedor", enterObserverView);
      loginForm.reset();
      return;
    } catch (error) {
      const observer = observers.find((item) =>
        item.username.toLowerCase() === username.toLowerCase() &&
        item.password === password
      );

      if (observer) {
        const modalElement = document.querySelector("#loginModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);

        if (modalInstance) {
          modalInstance.hide();
        }

        showProfileLoader("Veedor", enterObserverView);
        loginForm.reset();
        return;
      }
    }
  }

  const team = getTeamFromUsername(username);

  if (role === "Delegado" && team && password === "123456") {
    const modalElement = document.querySelector("#loginModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
      modalInstance.hide();
    }

    showProfileLoader("Delegado", () => enterDelegateView(team));
    loginForm.reset();
    return;
  }

  showLoginError("Usuario o contraseña incorrectos.");
});
// ============================================================
// FRAME0 - PRUEBA DE CONEXIÓN CON SUPABASE
// Consulta la tabla "categorias" y muestra los datos en consola.
// ============================================================

async function cargarCategorias() {
  const { data, error } = await supabaseClient
    .from('categorias')
    .select('*')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error al cargar categorías:', error);
    return;
  }

  console.log('Categorías cargadas desde Supabase:', data);
}

// cargarCategorias();
