const selectedDivision = document.querySelector("#selectedDivision");
const menuCategorias = document.querySelector("#menu-categorias");
const homeContent = document.querySelector("#homeContent");
const publicInfoContent = document.querySelector("#publicInfoContent");
const divisionContent = document.querySelector("#divisionContent");
const divisionLoader = document.querySelector(".division-loader");
const divisionView = document.querySelector("#divisionView");
const divisionTitle = document.querySelector("#divisionTitle");
const teamCarousel = document.querySelector("#teamCarousel");
const sponsorBanner = document.querySelector("#sponsorBanner");
const sponsorCarousel = document.querySelector("[data-sponsor-carousel]");
const tournamentCarousel = document.querySelector("#tournamentCarousel");
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
const sidebarPanel = document.querySelector("#sidebarPanel");
const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenuBackdrop = document.querySelector("[data-mobile-menu-backdrop]");
const contentShell = document.querySelector("#contentShell");
const initialSidebarContent = sidebarContent.innerHTML;
const initialTournamentCarouselContent = tournamentCarousel?.innerHTML || "";
const initialContentShell = contentShell.innerHTML;
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
const adminObserverDocument = document.querySelector("#adminObserverDocument");
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
const newDelegateDocument = document.querySelector("#newDelegateDocument");
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
const newObserverDocument = document.querySelector("#newObserverDocument");
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
const delegatePlayerFeedback = document.querySelector("#delegatePlayerFeedback");
const saveDelegatePlayerButton = document.querySelector("#saveDelegatePlayerButton");

let divisionLoadTimer;
let selectedTeamId = null;
let selectedTeamFixtureRound = "";
let activeObservationButton = null;
const playerObservations = {};
const playerObservationResolutions = {};
let adminSearchTimer;
let teamCarouselActiveIndex = 0;
let sponsorCarouselActiveIndex = 0;
let sponsorCarouselTimer = null;
const MAX_SPONSOR_IMAGES = 15;
const MAX_HOME_CAROUSEL_IMAGES = 3;
const HOME_CAROUSEL_RECOMMENDED_SIZE = "1920 x 720 px";
const HOME_CAROUSEL_MAX_WIDTH = 1920;
const HOME_CAROUSEL_MAX_HEIGHT = 720;
const LANDING_VIDEO_MAX_BYTES = 10 * 1024 * 1024;
const mobileMenuMedia = window.matchMedia("(max-width: 991.98px)");

function getMobileMenuFocusableElements() {
  if (!sidebarPanel) return [];

  return [...sidebarPanel.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")]
    .filter((element) => element.getClientRects().length > 0);
}

function openMobileMenu() {
  if (!mobileMenuMedia.matches || !mobileMenuToggle || !sidebarPanel) return;

  document.body.classList.add("mobile-menu-open");
  mobileMenuToggle.setAttribute("aria-expanded", "true");
  mobileMenuToggle.setAttribute("aria-label", "Cerrar menú");
  window.requestAnimationFrame(() => getMobileMenuFocusableElements()[0]?.focus());
}

function closeMobileMenu({ restoreFocus = true } = {}) {
  if (!mobileMenuToggle) return;

  const wasOpen = document.body.classList.contains("mobile-menu-open");
  document.body.classList.remove("mobile-menu-open");
  mobileMenuToggle.setAttribute("aria-expanded", "false");
  mobileMenuToggle.setAttribute("aria-label", "Abrir menú");

  if (wasOpen && restoreFocus && mobileMenuMedia.matches) {
    mobileMenuToggle.focus();
  }
}

function toggleMobileMenu() {
  if (document.body.classList.contains("mobile-menu-open")) {
    closeMobileMenu();
    return;
  }

  openMobileMenu();
}
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
const adminDelegatesState = {
  includeInactive: false,
  selectedCategory: "",
  selectedDivision: "",
  searchTerm: ""
};

const ADMIN_PAGE_SIZE = 20;
const DEFAULT_DRIVE_PHOTOS_LINK = "https://drive.google.com/drive/folders/1Rc5iI61AXuY-DjYL11cVGb7Wg3JTPLEj";
const THEME_STORAGE_KEY = "frame0-dark-mode";
const LANDING_VIDEO_SEEN_KEY = "frame0-landing-video-seen";
const HELP_URLS = {
  admin: "https://sites.google.com/view/frame0-principal/inicio",
  observer: "https://sites.google.com/view/frame0-veedores/inicio",
  delegate: "https://sites.google.com/view/frame0-delegados/inicio"
};
const REQUIRED_FIELDS_NOTE_TEXT = "Los campos identificados con * son obligatorios";
const AI_REPORT_TITLE = "Resumen ejecutivo del torneo";
const AI_REPORT_PDF_FOOTER = "Generado automáticamente por Frame0 IA";
const publicSettings = {
  instagramUrl: "#",
  facebookUrl: "#",
  whatsappPhone: "3510000000",
  drivePhotosLink: DEFAULT_DRIVE_PHOTOS_LINK,
  tournamentInfoText: "La competencia tiene seguimiento de calendario, posiciones, estadísticas y novedades para que cada equipo pueda consultar la información de forma simple.",
  locationTitle: "Córdoba Capital",
  locationText: "La sede principal del torneo estará ubicada en Córdoba Capital, con programación semanal y comunicación oficial para delegados antes de cada fecha.",
  contactTitle: "351 XXX XXXX",
  contactText: "Consultas por cupos, inscripción, documentación y calendario inicial. La atención se centraliza para mantener una comunicación clara con cada equipo.",
  sponsorImages: [],
  homeCarouselImages: [],
  landingPopupVideo: null,
  regulationText: `La competencia se disputa bajo principios de juego limpio, respeto entre participantes y cumplimiento de la programación oficial informada por la organización. Cada equipo deberá presentar su lista de buena fe, contar con jugadores habilitados y respetar los horarios asignados para cada fecha.

Los partidos tendrán una duración definida por la organización según categoría y división. La tabla de posiciones se ordenará por puntos obtenidos, diferencia de gol, goles a favor y resultado entre equipos cuando corresponda. Las sanciones disciplinarias podrán incluir suspensión por acumulación de tarjetas, expulsiones directas o informes del veedor.

La organización podrá reprogramar encuentros por razones climáticas, disponibilidad de cancha o fuerza mayor. Todo reclamo deberá ser presentado por el delegado dentro de los plazos establecidos y será evaluado por la mesa organizadora.`
};
const PUBLIC_SETTINGS_CONFIG_KEY = "public_settings";
const TOURNAMENT_SETTINGS_CONFIG_KEY = "tournament_settings";
let adminSettingsSession = null;
let observerSettingsSession = null;
let delegateSettingsSession = null;
let currentAppUser = null;
let tournamentCatalog = [];
let activeDivisionId = "";
let adminTeamsForView = [];
let adminMetricsState = null;
const adminObservedSummaryState = {
  loaded: false,
  count: 0,
  rows: []
};
let currentAiReport = null;
let publishedNewsEditions = [];
let selectedNewsEditionId = "";
let selectedNewsPageIndex = 0;
let adminNewsEditions = [];
let adminNewsSportsDates = [];
let editingNewsEditionId = "";
let editingNewsPageIndex = 0;
let adminNewsDraft = null;
const tournamentSettings = {
  playerRegistrationFrom: "2026-06-01",
  playerRegistrationTo: "2026-07-31",
  divisions: {}
};
const MATCH_DAY_OPTIONS = [
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" },
  { value: "0", label: "Domingo" }
];
const DEFAULT_FIXTURE_MATCH_DAY = "0";
const DEFAULT_FIXTURE_START_DATE = "2026-07-01";
const aboutMembers = [
  {
    name: "Ignacio Cerutti",
    role: "Product Manager",
    image: "assets/about-ignacio.png",
    visual: "planning"
  },
  {
    name: "Jorge Guerra",
    role: "Data Analytics",
    image: "assets/about-jorge.png",
    visual: "data"
  },
  {
    name: "Juan Pablo Valdivia",
    role: "Developer",
    image: "assets/about-juan.png",
    visual: "software"
  },
  {
    name: "Leonel Salguero",
    role: "Tester",
    image: "assets/about-leonel.png",
    visual: "testing-infra"
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
  const tournamentInfoText = document.querySelector("#homeTournamentInfoText");
  const locationTitle = document.querySelector("#homeLocationTitle");
  const locationText = document.querySelector("#homeLocationText");
  const contactTitle = document.querySelector("#homeContactTitle");
  const contactText = document.querySelector("#homeContactText");

  if (tournamentInfoText) tournamentInfoText.textContent = publicSettings.tournamentInfoText;
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
  setLinkIfExists("#floatingMascotWhatsapp", getWhatsappUrl(publicSettings.whatsappPhone));
  renderSponsorCarousel();
  renderHomeCarouselImages();
}

const fulbitoAssistant = document.querySelector("[data-fulbito-assistant]");
const fulbitoChat = document.querySelector("[data-fulbito-chat]");
const fulbitoMessages = document.querySelector("[data-fulbito-messages]");
const fulbitoSuggestions = document.querySelector("[data-fulbito-suggestions]");
const fulbitoForm = document.querySelector("[data-fulbito-form]");
const fulbitoInput = document.querySelector("[data-fulbito-input]");

function getFulbitoContext() {
  const isDelegate = document.body.classList.contains("delegate-view");
  const team = isDelegate ? getTeam(sidebarContent.dataset.currentDelegateTeam) : null;
  return {
    profile: isDelegate ? "delegate" : "public",
    teamId: team?.id || null,
    teamName: team?.shortName || team?.name || null
  };
}

function renderFulbitoWelcome() {
  const { profile, teamName } = getFulbitoContext();
  const welcome = profile === "delegate"
    ? `¡Hola! Soy Fulbito. Puedo ayudarte a usar el sistema y responder consultas sobre ${teamName || "tu equipo"}.`
    : "¡Hola! Soy Fulbito. Preguntame sobre el reglamento, torneos, categorías, fixture o posiciones.";
  const prompts = profile === "delegate"
    ? ["¿Cómo cargo un jugador?", "¿Cuándo cierra la inscripción?", "Resumen de mi equipo"]
    : ["¿Qué torneos están disponibles?", "¿Quién va primero?", "Consultar el reglamento"];
  fulbitoMessages.innerHTML = `<div class="fulbito-message">${escapeHtml(welcome)}</div>`;
  fulbitoSuggestions.innerHTML = prompts.map((prompt) => `<button type="button" data-fulbito-prompt="${escapeHtml(prompt)}">${escapeHtml(prompt)}</button>`).join("");
}

function openFulbitoChat() {
  fulbitoAssistant.classList.remove("is-open");
  fulbitoAssistant.querySelector("[data-fulbito-toggle]").setAttribute("aria-expanded", "false");
  renderFulbitoWelcome();
  fulbitoChat.classList.add("is-open");
  fulbitoChat.setAttribute("aria-hidden", "false");
  window.setTimeout(() => fulbitoInput.focus(), 100);
}

function closeFulbitoChat() {
  fulbitoChat.classList.remove("is-open");
  fulbitoChat.setAttribute("aria-hidden", "true");
}

async function requestFulbitoAnswer(question, context) {
  const body = { question, profile: context.profile };
  if (context.profile === "delegate") {
    body.usuario = delegateSettingsSession?.usuario || "";
    body.password = delegateSettingsSession?.password || "";
  }
  const { data, error } = await supabaseClient.functions.invoke("fulbito-chat", { body });
  if (error || !data?.answer) throw new Error(data?.error || error?.message || "Fulbito no pudo responder.");
  return data.answer;
}

fulbitoAssistant?.addEventListener("click", (event) => {
  if (event.target.closest("[data-fulbito-open]")) return openFulbitoChat();
  if (!event.target.closest("[data-fulbito-toggle]")) return;
  if (document.body.classList.contains("delegate-view")) return openFulbitoChat();
  const isOpen = fulbitoAssistant.classList.toggle("is-open");
  event.currentTarget.querySelector("[data-fulbito-toggle]").setAttribute("aria-expanded", String(isOpen));
});

fulbitoChat?.addEventListener("click", (event) => {
  if (event.target.closest("[data-fulbito-close]")) return closeFulbitoChat();
  const prompt = event.target.closest("[data-fulbito-prompt]")?.dataset.fulbitoPrompt;
  if (prompt) { fulbitoInput.value = prompt; fulbitoForm.requestSubmit(); }
});

fulbitoInput?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  fulbitoForm.requestSubmit();
});

fulbitoForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = fulbitoInput.value.trim();
  if (!question) return;
  fulbitoInput.value = "";
  fulbitoMessages.insertAdjacentHTML("beforeend", `<div class="fulbito-message is-user">${escapeHtml(question)}</div><div class="fulbito-message" data-fulbito-thinking>Fulbito está pensando…</div>`);
  fulbitoMessages.scrollTop = fulbitoMessages.scrollHeight;
  try {
    const answer = await requestFulbitoAnswer(question, getFulbitoContext());
    fulbitoMessages.querySelector("[data-fulbito-thinking]")?.remove();
    fulbitoMessages.insertAdjacentHTML("beforeend", `<div class="fulbito-message">${escapeHtml(answer)}</div>`);
  } catch (error) {
    fulbitoMessages.querySelector("[data-fulbito-thinking]")?.remove();
    fulbitoMessages.insertAdjacentHTML("beforeend", `<div class="fulbito-message">No pude responder ahora. ${escapeHtml(error.message || "Intentá nuevamente.")}</div>`);
  }
  fulbitoMessages.scrollTop = fulbitoMessages.scrollHeight;
});

function getPublicSettingsPayload() {
  return {
    instagramUrl: publicSettings.instagramUrl,
    facebookUrl: publicSettings.facebookUrl,
    whatsappPhone: publicSettings.whatsappPhone,
    drivePhotosLink: publicSettings.drivePhotosLink,
    tournamentInfoText: publicSettings.tournamentInfoText,
    locationTitle: publicSettings.locationTitle,
    locationText: publicSettings.locationText,
    contactTitle: publicSettings.contactTitle,
    contactText: publicSettings.contactText,
    sponsorImages: publicSettings.sponsorImages,
    homeCarouselImages: publicSettings.homeCarouselImages,
    landingPopupVideo: publicSettings.landingPopupVideo,
    regulationText: publicSettings.regulationText
  };
}

function mergePublicSettings(settings = {}) {
  Object.keys(publicSettings).forEach((key) => {
    if (settings[key] !== undefined && settings[key] !== null) {
      if (Array.isArray(publicSettings[key])) {
        const maxItems = key === "homeCarouselImages" ? MAX_HOME_CAROUSEL_IMAGES : MAX_SPONSOR_IMAGES;
        publicSettings[key] = (Array.isArray(settings[key]) ? settings[key] : []).filter(Boolean).slice(0, maxItems);
      } else if (key === "landingPopupVideo" && typeof settings[key] === "object") {
        publicSettings[key] = settings[key];
      } else {
        publicSettings[key] = String(settings[key]);
      }
    }
  });
}

function getSponsorCarouselClass(index, activeIndex, total) {
  if (!total) return "hidden";
  const offset = ((index - activeIndex + total + Math.floor(total / 2)) % total) - Math.floor(total / 2);
  const previousIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;
  const farPreviousIndex = (activeIndex - 2 + total) % total;
  const farNextIndex = (activeIndex + 2) % total;
  const edgePreviousIndex = (activeIndex - 3 + total) % total;
  const edgeNextIndex = (activeIndex + 3) % total;

  if (index === activeIndex) return "active";
  if (index === previousIndex) return "previous";
  if (index === nextIndex) return "next";
  if (total > 3 && index === farPreviousIndex) return "far-previous";
  if (total > 3 && index === farNextIndex) return "far-next";
  if (total > 5 && index === edgePreviousIndex) return "edge-previous";
  if (total > 5 && index === edgeNextIndex) return "edge-next";
  if (Math.abs(offset) <= 2) return offset < 0 ? "far-previous" : "far-next";
  if (Math.abs(offset) === 3) return offset < 0 ? "edge-previous" : "edge-next";
  return "hidden";
}

function renderSponsorCarousel() {
  if (!sponsorBanner || !sponsorCarousel) return;

  const images = publicSettings.sponsorImages || [];
  sponsorBanner.classList.toggle("is-empty", images.length === 0);
  window.clearInterval(sponsorCarouselTimer);
  sponsorCarouselTimer = null;

  if (!images.length) {
    sponsorCarousel.innerHTML = "";
    return;
  }

  sponsorCarouselActiveIndex = Math.min(sponsorCarouselActiveIndex, images.length - 1);
  sponsorCarousel.innerHTML = images.map((image, index) => `
    <div class="sponsor-slide ${getSponsorCarouselClass(index, sponsorCarouselActiveIndex, images.length)}">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.name || `Auspiciante ${index + 1}`)}" loading="lazy">
    </div>
  `).join("");

  if (images.length > 1) {
    sponsorCarouselTimer = window.setInterval(() => {
      sponsorCarouselActiveIndex = (sponsorCarouselActiveIndex + 1) % images.length;
      renderSponsorCarousel();
    }, 2000);
  }
}

function renderHomeCarouselImages() {
  if (!tournamentCarousel) return;

  const images = publicSettings.homeCarouselImages || [];
  if (!images.length) {
    tournamentCarousel.innerHTML = initialTournamentCarouselContent;
    return;
  }

  tournamentCarousel.innerHTML = `
    <div class="carousel-indicators">
      ${images.map((image, index) => `
        <button type="button" data-bs-target="#tournamentCarousel" data-bs-slide-to="${index}" class="${index === 0 ? "active" : ""}" ${index === 0 ? 'aria-current="true"' : ""} aria-label="Imagen ${index + 1}"></button>
      `).join("")}
    </div>
    <div class="carousel-inner">
      ${images.map((image, index) => `
        <div class="carousel-item ${index === 0 ? "active" : ""}">
          <div class="carousel-scene home-carousel-image-scene">
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.name || `Imagen del torneo ${index + 1}`)}" class="home-carousel-image">
          </div>
        </div>
      `).join("")}
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#tournamentCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#tournamentCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Siguiente</span>
    </button>
  `;
}

function renderSponsorAdminImages() {
  const images = publicSettings.sponsorImages || [];

  if (!images.length) {
    return `<div class="admin-empty-row sponsor-empty">Sin auspiciantes cargados.</div>`;
  }

  return images.map((image, index) => `
    <div class="sponsor-admin-card">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.name || `Auspiciante ${index + 1}`)}">
      <div>
        <strong>${escapeHtml(image.name || `Auspiciante ${index + 1}`)}</strong>
        <small>${index + 1} de ${MAX_SPONSOR_IMAGES}</small>
      </div>
      <button type="button" aria-label="Eliminar auspiciante ${index + 1}" data-remove-sponsor-image="${index}">
        <i class="bi bi-trash-fill"></i>
      </button>
    </div>
  `).join("");
}

function renderHomeCarouselAdminImages() {
  const images = publicSettings.homeCarouselImages || [];

  if (!images.length) {
    return `<div class="admin-empty-row sponsor-empty">Sin imágenes cargadas para el carrusel.</div>`;
  }

  return images.map((image, index) => `
    <div class="sponsor-admin-card">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.name || `Imagen carrusel ${index + 1}`)}">
      <div>
        <strong>${escapeHtml(image.name || `Imagen carrusel ${index + 1}`)}</strong>
        <small>${index + 1} de ${MAX_HOME_CAROUSEL_IMAGES}</small>
      </div>
      <button type="button" aria-label="Eliminar imagen de carrusel ${index + 1}" data-remove-home-carousel-image="${index}">
        <i class="bi bi-trash-fill"></i>
      </button>
    </div>
  `).join("");
}

function renderLandingVideoAdminPreview() {
  const video = publicSettings.landingPopupVideo;
  if (!video?.src) return `<div class="admin-empty-row sponsor-empty">Sin video cargado.</div>`;

  return `
    <div class="landing-video-admin-preview">
      <video src="${escapeHtml(video.src)}" controls muted playsinline preload="metadata"></video>
      <div>
        <strong>${escapeHtml(video.name || "Video del emergente")}</strong>
        <small>Este video se muestra al ingresar a la landing page.</small>
      </div>
    </div>
  `;
}

function refreshSponsorAdminPreview() {
  const preview = contentShell.querySelector("[data-sponsor-preview]");
  const counter = contentShell.querySelector("[data-sponsor-count]");
  const input = contentShell.querySelector("[data-sponsor-upload]");
  const homeCarouselPreview = contentShell.querySelector("[data-home-carousel-preview]");
  const homeCarouselCounter = contentShell.querySelector("[data-home-carousel-count]");
  const homeCarouselInput = contentShell.querySelector("[data-home-carousel-upload]");
  const landingVideoPreview = contentShell.querySelector("[data-landing-video-preview]");

  if (preview) preview.innerHTML = renderSponsorAdminImages();
  if (counter) counter.textContent = `${publicSettings.sponsorImages.length}/${MAX_SPONSOR_IMAGES}`;
  if (input) input.disabled = publicSettings.sponsorImages.length >= MAX_SPONSOR_IMAGES;
  if (homeCarouselPreview) homeCarouselPreview.innerHTML = renderHomeCarouselAdminImages();
  if (homeCarouselCounter) homeCarouselCounter.textContent = `${publicSettings.homeCarouselImages.length}/${MAX_HOME_CAROUSEL_IMAGES}`;
  if (homeCarouselInput) homeCarouselInput.disabled = publicSettings.homeCarouselImages.length >= MAX_HOME_CAROUSEL_IMAGES;
  if (landingVideoPreview) landingVideoPreview.innerHTML = renderLandingVideoAdminPreview();
  renderSponsorCarousel();
  renderHomeCarouselImages();
}

function readSponsorFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      name: file.name,
      type: file.type || "image/svg+xml",
      src: String(reader.result || "")
    });
    reader.onerror = () => reject(reader.error || new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

function readHomeCarouselFile(file) {
  const isSvg = file.name.toLowerCase().endsWith(".svg") || file.type === "image/svg+xml";
  if (isSvg) return readSponsorFile(file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(
          HOME_CAROUSEL_MAX_WIDTH / image.naturalWidth,
          HOME_CAROUSEL_MAX_HEIGHT / image.naturalHeight,
          1
        );
        const width = Math.max(Math.round(image.naturalWidth * scale), 1);
        const height = Math.max(Math.round(image.naturalHeight * scale), 1);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");

        if (!context) {
          resolve({
            name: file.name,
            type: file.type || "image/*",
            src: String(reader.result || "")
          });
          return;
        }

        context.drawImage(image, 0, 0, width, height);
        resolve({
          name: file.name,
          type: "image/jpeg",
          src: canvas.toDataURL("image/jpeg", 0.88)
        });
      };
      image.onerror = () => reject(new Error("No se pudo procesar la imagen del carrusel."));
      image.src = String(reader.result || "");
    };
    reader.onerror = () => reject(reader.error || new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

async function addSponsorImages(files = []) {
  const availableSlots = MAX_SPONSOR_IMAGES - publicSettings.sponsorImages.length;
  const validFiles = [...files]
    .filter((file) => file.type.startsWith("image/") || file.name.toLowerCase().endsWith(".svg"))
    .slice(0, availableSlots);

  if (!validFiles.length) return;

  const images = await Promise.all(validFiles.map(readSponsorFile));
  publicSettings.sponsorImages = [...publicSettings.sponsorImages, ...images].slice(0, MAX_SPONSOR_IMAGES);
  refreshSponsorAdminPreview();
}

async function addHomeCarouselImages(files = []) {
  const availableSlots = MAX_HOME_CAROUSEL_IMAGES - publicSettings.homeCarouselImages.length;
  const validFiles = [...files]
    .filter((file) => file.type.startsWith("image/") || file.name.toLowerCase().endsWith(".svg"))
    .slice(0, availableSlots);

  if (!validFiles.length) return;

  const images = await Promise.all(validFiles.map(readHomeCarouselFile));
  publicSettings.homeCarouselImages = [...publicSettings.homeCarouselImages, ...images].slice(0, MAX_HOME_CAROUSEL_IMAGES);
  refreshSponsorAdminPreview();
}

function readLandingVideoFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type || "video/mp4", src: String(reader.result || "") });
    reader.onerror = () => reject(reader.error || new Error("No se pudo leer el video."));
    reader.readAsDataURL(file);
  });
}

async function replaceLandingVideo(file) {
  if (!file?.type.startsWith("video/")) throw new Error("Seleccioná un archivo de video válido.");
  if (file.size > LANDING_VIDEO_MAX_BYTES) throw new Error("El video no puede superar los 10 MB.");
  publicSettings.landingPopupVideo = await readLandingVideoFile(file);
  refreshSponsorAdminPreview();
}

function showLandingVideoModal() {
  const modalElement = document.querySelector("#landingVideoModal");
  const videoElement = document.querySelector("#landingPopupVideo");
  const miniPlayer = document.querySelector("[data-landing-video-mini]");
  const miniVideo = document.querySelector("#landingMiniVideo");
  const startButton = document.querySelector("[data-landing-video-start]");
  const repeatButton = document.querySelector("[data-landing-video-repeat]");
  const closeMiniButton = document.querySelector("[data-landing-video-close-mini]");
  const video = publicSettings.landingPopupVideo;
  if (!modalElement || !videoElement || !video?.src || sessionStorage.getItem(LANDING_VIDEO_SEEN_KEY)) return;
  sessionStorage.setItem(LANDING_VIDEO_SEEN_KEY, "true");

  videoElement.src = video.src;
  videoElement.muted = true;
  if (miniVideo) miniVideo.src = video.src;
  const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
  const playWithSound = () => {
    videoElement.muted = false;
    startButton?.classList.add("d-none");
    videoElement.play().catch(() => startButton?.classList.remove("d-none"));
  };
  const playAutomatically = () => {
    videoElement.muted = true;
    startButton?.classList.remove("d-none");
    videoElement.play().catch(() => {});
  };

  modalElement.addEventListener("shown.bs.modal", playAutomatically, { once: true });
  modalElement.addEventListener("hidden.bs.modal", () => videoElement.pause());
  videoElement.addEventListener("ended", () => {
    modalElement.addEventListener("hidden.bs.modal", () => {
      if (miniVideo?.duration) miniVideo.currentTime = Math.max(miniVideo.duration - 0.1, 0);
      miniPlayer?.classList.remove("d-none");
    }, { once: true });
    modal.hide();
  });
  startButton?.addEventListener("click", playWithSound);
  repeatButton?.addEventListener("click", () => {
    miniPlayer?.classList.add("d-none");
    videoElement.currentTime = 0;
    modal.show();
    playWithSound();
  });
  closeMiniButton?.addEventListener("click", () => miniPlayer?.classList.add("d-none"));
  modal.show();
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
    throw new Error("Supabase no está disponible.");
  }

  if (!adminSettingsSession?.usuario || !adminSettingsSession?.password) {
    throw new Error("La sesión de administrador no está disponible. Cerrá sesión e ingresá nuevamente.");
  }

  const { error } = await supabaseClient.rpc("guardar_configuracion_publica", {
    p_usuario: adminSettingsSession.usuario,
    p_password: adminSettingsSession.password,
    p_valor: getPublicSettingsPayload()
  });

  if (error) throw error;
}

function getTournamentSettingsPayload() {
  return {
    playerRegistrationFrom: tournamentSettings.playerRegistrationFrom,
    playerRegistrationTo: tournamentSettings.playerRegistrationTo,
    divisions: tournamentSettings.divisions
  };
}

function mergeTournamentSettings(settings = {}) {
  if (settings.playerRegistrationFrom) {
    tournamentSettings.playerRegistrationFrom = String(settings.playerRegistrationFrom);
  }
  if (settings.playerRegistrationTo) {
    tournamentSettings.playerRegistrationTo = String(settings.playerRegistrationTo);
  }
  if (settings.divisions && typeof settings.divisions === "object" && !Array.isArray(settings.divisions)) {
    tournamentSettings.divisions = settings.divisions;
  }
}

async function loadTournamentSettingsFromSupabase() {
  if (typeof supabaseClient === "undefined") return;

  const { data, error } = await supabaseClient
    .from("configuraciones")
    .select("valor")
    .eq("clave", TOURNAMENT_SETTINGS_CONFIG_KEY)
    .eq("activa", true)
    .maybeSingle();

  if (error) {
    console.error("Error al cargar configuración general del torneo desde Supabase:", error);
    return;
  }

  if (data?.valor && typeof data.valor === "object") {
    mergeTournamentSettings(data.valor);
  }
}

async function saveTournamentSettingsToSupabase() {
  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no está disponible.");
  }

  if (!adminSettingsSession?.usuario || !adminSettingsSession?.password) {
    throw new Error("La sesión de administrador no está disponible. Cerrá sesión e ingresá nuevamente.");
  }

  const { error } = await supabaseClient.rpc("guardar_configuracion_torneo", {
    p_usuario: adminSettingsSession.usuario,
    p_password: adminSettingsSession.password,
    p_valor: getTournamentSettingsPayload()
  });

  if (error) throw error;
}

async function saveFixtureMatchesToSupabase(fixture) {
  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no está disponible.");
  }

  if (!adminSettingsSession?.usuario || !adminSettingsSession?.password) {
    throw new Error("La sesión de administrador no está disponible. Cerrá sesión e ingresá nuevamente.");
  }

  const matches = (fixture.rounds || []).flatMap((round) =>
    (round.dbMatches || []).map((match) => ({
      fecha: match.round,
      equipo_local_id: match.homeTeamId,
      equipo_visitante_id: match.awayTeamId,
      fecha_hora: match.fechaHora
    }))
  );

  const { error } = await supabaseClient.rpc("guardar_fixture_partidos", {
    p_usuario: adminSettingsSession.usuario,
    p_password: adminSettingsSession.password,
    p_division_id: fixture.divisionId,
    p_partidos: matches
  });

  if (error) throw error;
}

function requireDelegateSettingsSession() {
  if (!delegateSettingsSession?.usuario || !delegateSettingsSession?.password) {
    throw new Error("La sesión del delegado no está disponible. Cerrá sesión e ingresá nuevamente.");
  }

  return delegateSettingsSession;
}

async function saveDelegateTeamToSupabase(teamId, payload = {}) {
  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no está disponible.");
  }

  const session = requireDelegateSettingsSession();
  const { error } = await supabaseClient.rpc("guardar_equipo_delegado", {
    p_usuario: session.usuario,
    p_password: session.password,
    p_equipo_id: teamId,
    p_valor: payload
  });

  if (error) throw error;
}

async function saveDelegatePlayerToSupabase(teamId, playerId, payload = {}) {
  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no está disponible.");
  }

  const session = requireDelegateSettingsSession();
  const { data, error } = await supabaseClient.rpc("guardar_jugador_delegado", {
    p_usuario: session.usuario,
    p_password: session.password,
    p_equipo_id: teamId,
    p_jugador_id: playerId || null,
    p_valor: payload
  });

  if (error) throw error;
  return data;
}

async function changeDelegatePlayerStatusInSupabase(playerId, active) {
  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no está disponible.");
  }

  const session = requireDelegateSettingsSession();
  const { data, error } = await supabaseClient.rpc("cambiar_estado_jugador_delegado", {
    p_usuario: session.usuario,
    p_password: session.password,
    p_jugador_id: playerId,
    p_activo: active
  });

  if (error) throw error;
  return data;
}

async function hasExistingFixtureForDivision(divisionId = "") {
  if (!divisionId || typeof supabaseClient === "undefined") return false;

  const { count, error } = await supabaseClient
    .from("partidos")
    .select("id", { count: "exact", head: true })
    .eq("division_id", divisionId);

  if (error) {
    console.warn("No se pudo verificar si ya existe fixture para la división:", error);
    return false;
  }

  return Number(count || 0) > 0;
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
        <button class="division-link" type="button" data-division="${escapeHtml(division.nombre)}" data-division-id="${division.id}" data-category="${escapeHtml(categoria.nombre)}">
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

function renderHomeTournamentChecklist() {
  const checklist = document.querySelector("#homeTournamentChecklist");
  if (!checklist) return;

  const categoryItems = tournamentCatalog.length
    ? tournamentCatalog.map((category) => {
      const divisions = category.divisions.length
        ? category.divisions.map((division) => `
          <div class="home-check-item home-check-division">
            <span>${escapeHtml(division.name)}</span>
            <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
          </div>
        `).join("")
        : `
          <div class="home-check-item home-check-division">
            <span>Sin divisiones activas</span>
            <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
          </div>
        `;

      return `
        <div class="home-check-category">
          <div class="home-check-item home-check-category-title">
            <strong>${escapeHtml(category.name)}</strong>
            <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
          </div>
          ${divisions}
        </div>
      `;
    }).join("")
    : `
      <div class="home-check-item">
        <span>Categorías y divisiones en carga</span>
        <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
      </div>
    `;

  checklist.innerHTML = `
    <div class="home-check-section-label">Categorías:</div>
    ${categoryItems}
    <div class="home-check-item">
      <span>Resultados en el día</span>
      <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
    </div>
    <div class="home-check-item">
      <span>Estadísticas actualizadas</span>
      <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
    </div>
    <div class="home-check-item">
      <span>Gestión web de tu equipo</span>
      <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
    </div>
    <div class="home-check-item">
      <span>Fotos profesionales</span>
      <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
    </div>
  `;
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
    tournamentCatalog = categoriasActivas.map((categoria) => ({
      id: categoria.id,
      name: categoria.nombre,
      divisions: divisionesActivas
        .filter((division) => String(division.categoria_id) === String(categoria.id))
        .map((division) => ({
          id: division.id,
          name: division.nombre
        }))
    }));

    console.log("Menú categorías:", categoriasActivas);
    console.log("Menú divisiones:", divisionesActivas);

    renderMenuCategorias(categoriasActivas, divisionesActivas);
    renderHomeTournamentChecklist();
  } catch (error) {
    console.error("Error al cargar el menú de categorías:", error);
    menuCategorias.innerHTML = `<div class="menu-empty">No se pudo cargar el menú.</div>`;
    renderHomeTournamentChecklist();
  }
}

function getAboutCarouselClass(index, activeIndex) {
  const total = aboutMembers.length;
  if (!total) return "hidden";
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

let teams = [];
let standings = [];
let fixtures = {};
let observerMatches = [];
let observers = [];
let matchDetailsById = new Map();

function getTeam(teamId) {
  return teams.find((team) => String(team.id) === String(teamId))
    || adminTeamsForView.find((team) => String(team.id) === String(teamId));
}

function getActivePlayers(team = {}) {
  return (team.players || []).filter((player) => player.active !== false);
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
  if (String(key || "").startsWith("sancion:")) {
    const pools = [adminTeamsForView, teams];
    for (const pool of pools) {
      for (const team of pool || []) {
        const player = (team.players || []).find((item) =>
          (item.observations || []).some((observation) => observation.key === key)
        );
        if (player) return { ...player, team };
      }
    }
    return null;
  }

  const { teamId, number, playerName } = parsePlayerObservationKey(key);
  const team = getTeam(teamId);
  if (!team) return null;

  const player = team.players.find((item) => item.number === number && item.name === playerName);
  return player ? { ...player, team } : null;
}

function getPlayerMatchIncidence(player = {}, matchId = "") {
  const matchStats = player.matchStats || {};
  return matchStats[String(matchId)] || {
    goals: 0,
    yellow: 0,
    red: 0,
    observation: ""
  };
}

function buildMatchLabel(match) {
  if (!match) return "Partido";

  const homeName = getTeam(match.home)?.shortName || "Equipo 1";
  const awayName = getTeam(match.away)?.shortName || "Equipo 2";
  return `${match.date || "Sin fecha"} - ${homeName} vs ${awayName}`;
}

async function loadMatchIncidences(matchIds = []) {
  if (!matchIds.length || typeof supabaseClient === "undefined") {
    return { goals: [], cards: [], sanctions: [] };
  }

  const [{ data: goals, error: goalsError }, { data: cards, error: cardsError }, sanctionsResult] = await Promise.all([
    supabaseClient
      .from("goles")
      .select("id,partido_id,jugador_id,equipo_id,tipo")
      .in("partido_id", matchIds),
    supabaseClient
      .from("tarjetas")
      .select("id,partido_id,jugador_id,equipo_id,tipo,motivo")
      .in("partido_id", matchIds),
    supabaseClient
      .from("sanciones")
      .select("id,jugador_id,partido_id,motivo,fechas_suspension,cumplida,created_at,resolucion_detalle,estado_jugador,resuelta_por,resuelta_at,notificada_delegado,notificada_at")
      .in("partido_id", matchIds)
  ]);

  if (goalsError) throw goalsError;
  if (cardsError) throw cardsError;

  let sanctions = sanctionsResult.data;
  let sanctionsError = sanctionsResult.error;

  if (sanctionsError) {
    console.warn("No se pudieron leer columnas de resolución en sanciones. Se usa lectura base.", sanctionsError);
    const fallback = await supabaseClient
      .from("sanciones")
      .select("id,jugador_id,partido_id,motivo,fechas_suspension,cumplida")
      .in("partido_id", matchIds);
    sanctions = fallback.data;
    sanctionsError = fallback.error;
  }

  if (sanctionsError) throw sanctionsError;

  return {
    goals: goals || [],
    cards: cards || [],
    sanctions: sanctions || []
  };
}

function applyPlayerStatsToTeams(teamList = [], incidences = {}) {
  const playerMap = new Map();

  teamList.forEach((team) => {
    (team.players || []).forEach((player) => {
      player.goals = 0;
      player.yellow = 0;
      player.red = 0;
      player.observations = [];
      player.suspensionMatches = 0;
      player.resolvedStatus = "";
      player.resolvedAt = "";
      player.matchStats = {};
      if (player.id) playerMap.set(String(player.id), { player, team });
    });
  });

  const ensureMatchStats = (player, matchId) => {
    const key = String(matchId || "");
    if (!player.matchStats[key]) {
      player.matchStats[key] = {
        goals: 0,
        yellow: 0,
        red: 0,
        observation: ""
      };
    }
    return player.matchStats[key];
  };

  (incidences.goals || []).forEach((goal) => {
    const entry = playerMap.get(String(goal.jugador_id || ""));
    if (!entry) return;
    entry.player.goals += 1;
    ensureMatchStats(entry.player, goal.partido_id).goals += 1;
  });

  (incidences.cards || []).forEach((card) => {
    const entry = playerMap.get(String(card.jugador_id || ""));
    if (!entry) return;
    const matchStats = ensureMatchStats(entry.player, card.partido_id);
    if (card.tipo === "roja") {
      entry.player.red += 1;
      matchStats.red += 1;
      return;
    }
    entry.player.yellow += 1;
    matchStats.yellow += 1;
  });

  (incidences.sanctions || []).forEach((sanction) => {
    const entry = playerMap.get(String(sanction.jugador_id || ""));
    if (!entry) return;
    const text = String(sanction.motivo || "").trim();
    const suspensionMatches = Math.max(Number(sanction.fechas_suspension) || 0, 0);
    if (suspensionMatches > 0 && sanction.cumplida !== true) {
      entry.player.suspensionMatches += suspensionMatches;
    }
    if (sanction.estado_jugador) {
      const resolvedAt = sanction.resuelta_at || sanction.created_at || "";
      if (!entry.player.resolvedAt || String(resolvedAt) >= String(entry.player.resolvedAt)) {
        entry.player.resolvedStatus = sanction.estado_jugador;
        entry.player.resolvedAt = resolvedAt;
      }
    }
    if (!text) return;

    const matchStats = ensureMatchStats(entry.player, sanction.partido_id);
    matchStats.observation = text;
    entry.player.observations.push({
      id: sanction.id,
      key: sanction.id ? `sancion:${sanction.id}` : "",
      sanctionId: sanction.id,
      matchId: sanction.partido_id,
      text,
      suspensionMatches,
      fulfilled: sanction.cumplida === true,
      createdAt: sanction.created_at || "",
      resolutionDetail: sanction.resolucion_detalle || "",
      resolvedStatus: sanction.estado_jugador || "",
      resolvedAt: sanction.resuelta_at || "",
      resolvedBy: sanction.resuelta_por || "",
      notifiedDelegate: sanction.notificada_delegado === true,
      notifiedAt: sanction.notificada_at || ""
    });
  });
}

function getPlayerObservationCount() {
  if (adminObservedSummaryState.loaded) {
    return adminObservedSummaryState.count;
  }

  const pools = [adminTeamsForView, teams];
  const persistedKeys = new Set();

  pools.forEach((pool) => {
    (pool || []).forEach((team) => {
      (team.players || []).forEach((player) => {
        getPendingPlayerObservationsForAdmin({ ...player, team }).forEach((observation) => {
          persistedKeys.add(observation.key);
        });
      });
    });
  });

  const memoryCount = Object.entries(playerObservations)
    .filter(([key, text]) => String(text || "").trim() && !playerObservationResolutions[key] && !persistedKeys.has(key))
    .length;

  return persistedKeys.size + memoryCount;
}

function getFixtureDateLabel(match) {
  if (!match) return "Sin fixture asociado";
  if (match.fixtureDate) return match.fixtureDate;

  const fixtureMatch = Object.entries(fixtures).find(([, matches]) =>
    matches.some((fixture) => fixture.home === match.home && fixture.away === match.away)
  );

  return fixtureMatch ? `Fecha ${fixtureMatch[0]}` : "Sin fixture asociado";
}

function rememberMatchDetails(matches = []) {
  matchDetailsById = new Map(matchDetailsById);
  matches.forEach((match, index) => {
    const normalized = normalizeSupabaseMatch(match, index);
    if (!normalized.id) return;

    const date = match.fecha_hora ? new Date(match.fecha_hora) : null;
    matchDetailsById.set(String(normalized.id), {
      id: normalized.id,
      date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("es-AR") : "Sin fecha",
      fixtureDate: `Fecha ${normalized.dateNumber}`,
      home: normalized.home,
      away: normalized.away,
      homeGoals: normalized.homeGoals,
      awayGoals: normalized.awayGoals,
      reporter: "Veedor"
    });
  });
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
  if (player?.resolvedStatus) return player.resolvedStatus;

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

function getPlayerUnreadResolutionNotifications(player) {
  return getPlayerObservationsForAdmin(player).filter((observation) =>
    observation.resolution && observation.resolution.notifiedDelegate !== true
  );
}

function getDelegateUnreadNotificationCount(team = {}) {
  return (team.players || [])
    .filter((player) => player.active !== false)
    .reduce((count, player) => count + getPlayerUnreadResolutionNotifications({ ...player, team }).length, 0);
}

function renderDelegatePlayersBadge(team = {}) {
  const unreadCount = getDelegateUnreadNotificationCount(team);
  return unreadCount > 0
    ? `<span class="menu-alert-badge" data-delegate-player-notification-count>${unreadCount}</span>`
    : "";
}

function updateDelegatePlayerNotificationBadge(team = {}) {
  const playersButton = sidebarContent.querySelector("[data-delegate-players]");
  if (!playersButton) return;

  const unreadCount = getDelegateUnreadNotificationCount(team);
  const currentBadge = playersButton.querySelector("[data-delegate-player-notification-count]");

  if (!unreadCount) {
    currentBadge?.remove();
    return;
  }

  if (currentBadge) {
    currentBadge.textContent = String(unreadCount);
    return;
  }

  playersButton.insertAdjacentHTML("beforeend", renderDelegatePlayersBadge(team));
}

function renderObservationNotificationSummary(player) {
  const notifications = getPlayerDisciplinaryNotifications(player);
  if (!notifications.length) {
    return `<span class="admin-observation-empty">Sin novedades</span>`;
  }

  const hasResolution = notifications.some((observation) => observation.resolution);

  return `
    <button class="admin-observation-view" type="button" data-player-history="${escapeHtml(getPlayerStatusKey(player))}">
      <i class="bi bi-bell-fill"></i>
      ${hasResolution ? "Ver resolución" : "Ver"} (${notifications.length})
    </button>
  `;
}

function updatePlayerObservationBadge() {
  document.querySelectorAll("[data-player-observation-count]").forEach((badge) => {
    badge.textContent = getPlayerObservationCount();
  });
}

function getPlayerObservationsForAdmin(player) {
  const persistedObservations = (player.observations || [])
    .filter((observation) => String(observation.text || "").trim())
    .map((observation) => {
      const match = getObserverMatch(observation.matchId);
      const key = observation.key || (observation.sanctionId
        ? `sancion:${observation.sanctionId}`
        : getPlayerObservationKey(observation.matchId, player.team.id, player));
      const hasPersistedResolution = Boolean(
        observation.resolvedAt
        || observation.resolutionDetail
        || observation.resolvedStatus
        || observation.suspensionMatches > 0
      );
      const resolution = playerObservationResolutions[key] || (hasPersistedResolution ? {
        detail: observation.resolutionDetail || "",
        suspensionMatches: observation.suspensionMatches,
        status: observation.resolvedStatus || (observation.fulfilled ? "Habilitado" : "Suspendido"),
        playerKey: getPlayerStatusKey(player),
        resolvedAt: observation.resolvedAt || "",
        notifiedDelegate: observation.notifiedDelegate === true,
        notifiedAt: observation.notifiedAt || ""
      } : null);

      return {
        key,
        sanctionId: observation.sanctionId || observation.id || "",
        matchId: observation.matchId || "",
        calendarDate: match?.date || "Sin fecha calendario",
        fixtureDate: getFixtureDateLabel(match),
        matchLabel: buildMatchLabel(match),
        reporter: getObservationReporter(observation.matchId),
        resolution,
        text: String(observation.text).trim()
      };
    });

  const memoryObservations = Object.entries(playerObservations)
    .filter(([key, text]) => key.includes(`::${player.team.id}::${player.number}::${player.name}`) && String(text || "").trim())
    .map(([key, text]) => {
      const [matchId] = key.split("::");
      const match = getObserverMatch(matchId);
      const resolution = playerObservationResolutions[key] || null;

      return {
        key,
        matchId,
        calendarDate: match?.date || "Sin fecha calendario",
        fixtureDate: getFixtureDateLabel(match),
        matchLabel: buildMatchLabel(match),
        reporter: getObservationReporter(matchId),
        resolution,
        text: String(text).trim()
      };
    });

  const seen = new Set();
  return [...persistedObservations, ...memoryObservations].filter((observation) => {
    const uniqueKey = `${observation.matchId || observation.key}::${observation.text}`;
    if (seen.has(uniqueKey)) return false;
    seen.add(uniqueKey);
    return true;
  });
}

function getPendingPlayerObservationsForAdmin(player) {
  return getPlayerObservationsForAdmin(player).filter((observation) => !observation.resolution);
}

function getDivisionCatalogEntryById(divisionId = "") {
  const normalizedDivisionId = String(divisionId || "");
  for (const category of getAdminMetrics().categories) {
    const division = category.divisions.find((item) => String(item.id) === normalizedDivisionId);
    if (division) {
      return {
        category: category.name,
        division: division.name
      };
    }
  }
  return {
    category: "Sin categoría",
    division: "Sin división"
  };
}

function resetAdminObservedSummary() {
  adminObservedSummaryState.loaded = false;
  adminObservedSummaryState.count = 0;
  adminObservedSummaryState.rows = [];
}

async function loadAdminObservedSummaryFromSupabase() {
  if (typeof supabaseClient === "undefined") {
    resetAdminObservedSummary();
    return adminObservedSummaryState;
  }

  if (!tournamentCatalog.length) {
    await cargarMenuCategorias();
  }

  let { data: sanctions, error: sanctionsError } = await supabaseClient
    .from("sanciones")
    .select("id,jugador_id,motivo,resuelta_at,resolucion_detalle,estado_jugador")
    .is("resuelta_at", null);

  if (sanctionsError) {
    console.warn("No se pudieron leer columnas de resolución para el resumen de observados. Se usa lectura base.", sanctionsError);
    const fallback = await supabaseClient
      .from("sanciones")
      .select("id,jugador_id,motivo,cumplida");
    sanctions = fallback.data;
    sanctionsError = fallback.error;
  }

  if (sanctionsError) throw sanctionsError;

  const pendingSanctions = (sanctions || [])
    .filter((sanction) => String(sanction.motivo || "").trim())
    .filter((sanction) => !("resuelta_at" in sanction) || !sanction.resuelta_at)
    .filter((sanction) => !("resolucion_detalle" in sanction) || !sanction.resolucion_detalle)
    .filter((sanction) => !("estado_jugador" in sanction) || !sanction.estado_jugador);

  const playerIds = [...new Set(pendingSanctions.map((sanction) => String(sanction.jugador_id || "")).filter(Boolean))];

  if (!playerIds.length) {
    adminObservedSummaryState.loaded = true;
    adminObservedSummaryState.count = 0;
    adminObservedSummaryState.rows = [];
    updatePlayerObservationBadge();
    return adminObservedSummaryState;
  }

  const { data: players, error: playersError } = await supabaseClient
    .from("jugadores")
    .select("id,equipo_id,activo")
    .in("id", playerIds)
    .eq("activo", true);

  if (playersError) throw playersError;

  const teamIds = [...new Set((players || []).map((player) => String(player.equipo_id || "")).filter(Boolean))];
  const { data: teamsForSummary, error: teamsError } = teamIds.length
    ? await supabaseClient
      .from("equipos")
      .select("id,division_id,activo")
      .in("id", teamIds)
      .eq("activo", true)
    : { data: [], error: null };

  if (teamsError) throw teamsError;

  const playerTeamMap = new Map((players || []).map((player) => [String(player.id), String(player.equipo_id || "")]));
  const teamDivisionMap = new Map((teamsForSummary || []).map((team) => [String(team.id), String(team.division_id || "")]));
  const grouped = new Map();

  pendingSanctions.forEach((sanction) => {
    const teamId = playerTeamMap.get(String(sanction.jugador_id || ""));
    const divisionId = teamDivisionMap.get(String(teamId || ""));
    if (!divisionId) return;

    const catalogEntry = getDivisionCatalogEntryById(divisionId);
    const groupKey = `${catalogEntry.category}::${catalogEntry.division}`;
    const current = grouped.get(groupKey) || {
      category: catalogEntry.category,
      division: catalogEntry.division,
      observed: 0,
      playerIds: new Set()
    };
    current.playerIds.add(String(sanction.jugador_id || ""));
    current.observed = current.playerIds.size;
    grouped.set(groupKey, current);
  });

  adminObservedSummaryState.loaded = true;
  adminObservedSummaryState.rows = [...grouped.values()].map(({ playerIds, ...row }) => row);
  adminObservedSummaryState.count = adminObservedSummaryState.rows.reduce((sum, row) => sum + row.observed, 0);
  updatePlayerObservationBadge();
  return adminObservedSummaryState;
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
  const adminPlayerTeams = adminTeamsForView.length ? adminTeamsForView : teams;

  return adminPlayerTeams
    .filter((team) => !selectedTeamId || team.id === selectedTeamId)
    .flatMap((team) => getActivePlayers(team).map((player) => ({ ...player, team })))
    .filter((player) => getPendingPlayerObservationsForAdmin(player).length > 0)
    .length;
}

function getAdminPlayerObservationMetricRows(selectedCategory = "", selectedDivision = "", selectedTeamId = "") {
  const observedCount = getObservedPlayersCount(selectedTeamId);
  if (observedCount && selectedCategory && selectedDivision) {
    return [{ category: selectedCategory, division: selectedDivision, observed: observedCount }];
  }

  if (adminObservedSummaryState.rows.length) {
    if (selectedCategory && selectedDivision) {
      return adminObservedSummaryState.rows.filter((row) =>
        row.category === selectedCategory && row.division === selectedDivision
      );
    }

    return adminObservedSummaryState.rows;
  }

  if (!observedCount) return [];

  const firstCategory = getAdminMetrics().categories[0];
  const firstDivision = firstCategory?.divisions[0];
  return firstCategory && firstDivision
    ? [{ category: firstCategory.name, division: firstDivision.name, observed: observedCount }]
    : [];
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

  const { category: selectedCategory, division: selectedDivision } = getDivisionCatalogEntryById(player.team.division_id);
  const resolution = observation.resolution || {};

  const modalRoleLabel = readOnlyResolution && contentShell.querySelector(".delegate-players-table") ? "Delegado" : "Administrador";
  setObservationModalHeading(modalRoleLabel, readOnlyResolution ? "Historial disciplinario" : "Resolución de observación");
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

function renderPlayerHistoryBody(playerKey, options = {}) {
  const { readOnlyResolution = false } = options;
  const [teamId, number, ...nameParts] = String(playerKey || "").split("::");
  const team = getTeam(teamId);
  const player = team?.players.find((item) => item.number === Number(number) && item.name === nameParts.join("::"));
  const playerWithTeam = player && team ? { ...player, team } : null;
  const observations = playerWithTeam ? getPlayerObservationsForAdmin(playerWithTeam) : [];

  setObservationModalHeading(readOnlyResolution ? "Delegado" : "Administrador", "Historial disciplinario");

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
            <th>${readOnlyResolution ? "Resolución" : "Editar resolución"}</th>
          </tr>
        </thead>
        <tbody>
          ${observations.map((observation) => {
            const hasResolution = Boolean(observation.resolution);
            return `
            <tr>
              <td>${escapeHtml(observation.calendarDate)}</td>
              <td>${escapeHtml(observation.fixtureDate)}</td>
              <td>
                ${readOnlyResolution && hasResolution ? `
                  <button class="admin-observation-view" type="button" disabled aria-disabled="true">
                    <i class="bi bi-eye-slash-fill"></i>
                    Ver
                  </button>
                ` : `
                  <button class="admin-observation-view" type="button" data-history-observation-view="${escapeHtml(observation.key)}">
                    <i class="bi bi-eye-fill"></i>
                    Ver
                  </button>
                `}
              </td>
              <td>
                ${hasResolution ? `
                  <button class="admin-observation-view" type="button" data-history-${readOnlyResolution ? "resolution-view" : "resolution-edit"}="${escapeHtml(observation.key)}">
                    <i class="bi ${readOnlyResolution ? "bi-eye-fill" : "bi-pencil-fill"}"></i>
                    ${readOnlyResolution ? "Ver resolución" : "Editar"}
                  </button>
                ` : readOnlyResolution ? `
                  <button class="admin-observation-view" type="button" disabled aria-disabled="true">
                    <i class="bi bi-hourglass-split"></i>
                    Ver resolución
                  </button>
                ` : `<span class="admin-observation-empty">Sin resolución</span>`}
              </td>
            </tr>
          `;
          }).join("")}
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

async function refreshCurrentPlayersTables() {
  if (contentShell.querySelector("[data-admin-player-category]")) {
    const category = contentShell.querySelector("[data-admin-player-category]")?.value || "";
    const division = contentShell.querySelector("[data-admin-player-division]")?.value || "";
    const teamId = contentShell.querySelector("[data-admin-player-team]")?.value || "";
    const searchTerm = getEffectiveSearchTerm(contentShell.querySelector("[data-admin-player-search]")?.value || "");
    const onlyWithObservations = contentShell.querySelector("[data-admin-player-observations-only]")?.checked || false;
    if (category && division) {
      await loadAdminTeamsForFilters(category, division);
    }
    contentShell.innerHTML = renderAdminPlayersView(category, division, teamId, searchTerm, 1, onlyWithObservations);
    return;
  }

  if (sidebarContent.dataset.currentDelegateTeam && contentShell.querySelector(".delegate-players-table")) {
    const currentTeam = getTeam(sidebarContent.dataset.currentDelegateTeam);
    if (currentTeam?.division_id) {
      await loadDivisionDataFromSupabase(activeDivisionId || currentTeam.division_id);
    }
    const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
    if (team) contentShell.innerHTML = renderDelegatePlayers(team);
  }
}

async function saveObservationResolution() {
  const review = observationModalBody.querySelector("[data-observation-review]");
  if (!review) return;

  const observationKey = review.dataset.observationReview;
  const player = getPlayerFromObservationKey(observationKey);
  const observation = player ? getPlayerObservationsForAdmin(player).find((item) => item.key === observationKey) : null;
  const detail = observationModalBody.querySelector("[data-resolution-detail]")?.value.trim() || "";
  const suspensionMatches = Math.max(Number(observationModalBody.querySelector("[data-resolution-suspension]")?.value) || 0, 0);
  const status = observationModalBody.querySelector("[data-resolution-status]")?.value || "Habilitado";

  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no está disponible.");
  }

  if (!adminSettingsSession?.usuario || !adminSettingsSession?.password) {
    throw new Error("La sesión del administrador no está disponible. Cerrá sesión e ingresá nuevamente.");
  }

  if (!observation?.sanctionId) {
    throw new Error("La observación todavía no está persistida en Supabase. Primero guardá el detalle del partido desde el perfil veedor.");
  }

  const { error } = await supabaseClient.rpc("resolver_observacion_jugador_admin", {
    p_usuario: adminSettingsSession.usuario,
    p_password: adminSettingsSession.password,
    p_sancion_id: observation.sanctionId,
    p_resolucion_detalle: detail,
    p_fechas_suspension: suspensionMatches,
    p_estado_jugador: status
  });

  if (error) throw error;

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
  await refreshCurrentPlayersTables();
}

async function markDelegateResolutionNotificationAsRead(observationKey = "") {
  const { observation } = getObservationContext(observationKey);

  if (!observation?.sanctionId || !observation.resolution) return;
  if (observation.resolution.notifiedDelegate === true) return;
  if (typeof supabaseClient === "undefined") return;
  if (!delegateSettingsSession?.usuario || !delegateSettingsSession?.password) return;

  const { error } = await supabaseClient.rpc("marcar_resolucion_notificada_delegado", {
    p_usuario: delegateSettingsSession.usuario,
    p_password: delegateSettingsSession.password,
    p_sancion_id: observation.sanctionId
  });

  if (error) throw error;

  const currentTeam = getTeam(sidebarContent.dataset.currentDelegateTeam);
  if (currentTeam?.division_id) {
    await loadDivisionDataFromSupabase(activeDivisionId || currentTeam.division_id);
  }

  const updatedTeam = getTeam(sidebarContent.dataset.currentDelegateTeam);
  if (updatedTeam) {
    updateDelegatePlayerNotificationBadge(updatedTeam);
    if (contentShell.querySelector(".delegate-players-table")) {
      contentShell.innerHTML = renderDelegatePlayers(updatedTeam);
    }
  }
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

function getInitialsFromName(name = "") {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "EQ";
}

function getShortTeamName(name = "") {
  return String(name).replace(/^Club\s+/i, "").trim() || "Equipo";
}

function calculateAgeFromDate(dateValue) {
  if (!dateValue) return "-";

  const birthDate = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return "-";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

function normalizeSupabasePlayer(player = {}) {
  const fullName = `${player.nombre || ""} ${player.apellido || ""}`.trim() || "Jugador";

  return {
    id: player.id,
    firstName: player.nombre || "",
    lastName: player.apellido || "",
    number: player.dorsal || "-",
    name: fullName,
    age: calculateAgeFromDate(player.fecha_nacimiento),
    goals: 0,
    yellow: 0,
    red: 0,
    observations: [],
    suspensionMatches: 0,
    matchStats: {},
    active: player.activo !== false,
    birthDate: player.fecha_nacimiento || "",
    dni: player.dni || ""
  };
}

function normalizeSupabaseTeam(team = {}) {
  const colors = [
    team.color_principal || "#64748b",
    team.color_secundario || "#111827"
  ];
  const abbreviation = team.abreviatura || getInitialsFromName(team.nombre);
  const shortName = team.nombre_corto || getShortTeamName(team.nombre);

  return {
    id: team.id,
    division_id: team.division_id || "",
    name: team.nombre || "Equipo",
    legalName: team.nombre || "Equipo",
    abbreviation,
    shortName,
    initials: abbreviation,
    crest: team.escudo_url || "",
    colors,
    shirtColors: [...colors, team.color_terciario || "#ffffff"],
    city: "-",
    captain: "-",
    delegate: "-",
    contact: "-",
    topScorer: "-",
    mostSanctioned: "-",
    players: (team.jugadores || [])
      .sort((a, b) => (a.dorsal || 999) - (b.dorsal || 999))
      .map(normalizeSupabasePlayer),
    founded: "Supabase",
    description: team.descripcion || "Datos cargados desde Supabase."
  };
}

async function loadTeamDelegatesByTeam(teamIds = []) {
  if (!teamIds.length || typeof supabaseClient === "undefined") return new Map();

  const { data, error } = await supabaseClient
    .from("delegados")
    .select("equipo_id,activo,usuario:usuarios_app(nombre,apellido,contacto,usuario,activo)")
    .in("equipo_id", teamIds)
    .eq("activo", true);

  if (error) {
    console.warn("No se pudieron cargar delegados para el detalle público de equipos:", error);
    return new Map();
  }

  return new Map((data || [])
    .filter((item) => item.usuario?.activo !== false)
    .map((item) => {
      const fullName = `${item.usuario?.nombre || ""} ${item.usuario?.apellido || ""}`.trim() || item.usuario?.usuario || "-";
      return [item.equipo_id, {
        name: fullName,
        contact: item.usuario?.contacto || "-"
      }];
    }));
}

function getFixtureRound(match = {}, index = 0) {
  const observation = String(match.observaciones || "");
  const roundMatch = observation.match(/fecha\s*(\d+)/i);
  if (roundMatch) return roundMatch[1];
  if (match.fecha_hora) {
    const date = new Date(match.fecha_hora);
    if (!Number.isNaN(date.getTime())) return String(index + 1);
  }
  return String(index + 1);
}

function normalizeSupabaseMatch(match = {}, index = 0) {
  return {
    id: match.id,
    status: match.estado === "finalizado" ? "Final" : "A disputar",
    home: match.equipo_local_id,
    away: match.equipo_visitante_id,
    homeGoals: match.estado === "finalizado" ? match.goles_local : null,
    awayGoals: match.estado === "finalizado" ? match.goles_visitante : null,
    dateNumber: getFixtureRound(match, index),
    fechaHora: match.fecha_hora || ""
  };
}

function filterDuplicateProgrammedMatches(matches = []) {
  const roundsWithRealMatches = new Set(
    matches
      .filter((match) => match.estado && match.estado !== "programado")
      .map((match, index) => getFixtureRound(match, index))
  );

  return matches.filter((match, index) => {
    const round = getFixtureRound(match, index);
    return match.estado !== "programado" || !roundsWithRealMatches.has(round);
  });
}

function calculateStandingsFromMatches(teamList = [], groupedFixtures = {}) {
  const table = new Map(teamList.map((team) => [team.id, {
    teamId: team.id,
    pts: 0,
    pj: 0,
    g: 0,
    e: 0,
    p: 0,
    gf: 0,
    gc: 0,
    dg: 0
  }]));

  Object.values(groupedFixtures).flat().forEach((match) => {
    if (match.homeGoals === null || match.awayGoals === null) return;

    const home = table.get(match.home);
    const away = table.get(match.away);
    if (!home || !away) return;

    home.pj += 1;
    away.pj += 1;
    home.gf += match.homeGoals;
    home.gc += match.awayGoals;
    away.gf += match.awayGoals;
    away.gc += match.homeGoals;

    if (match.homeGoals === match.awayGoals) {
      home.e += 1;
      away.e += 1;
      home.pts += 1;
      away.pts += 1;
    } else if (match.homeGoals > match.awayGoals) {
      home.g += 1;
      away.p += 1;
      home.pts += 3;
    } else {
      away.g += 1;
      home.p += 1;
      away.pts += 3;
    }
  });

  return Array.from(table.values())
    .map((row) => ({ ...row, dg: row.gf - row.gc }))
    .sort((a, b) =>
      b.pts - a.pts ||
      b.dg - a.dg ||
      b.gf - a.gf ||
      getTeam(a.teamId)?.name.localeCompare(getTeam(b.teamId)?.name || "", "es")
    );
}

async function loadDivisionDataFromSupabase(divisionId) {
  if (!divisionId || typeof supabaseClient === "undefined") {
    teams = [];
    standings = [];
    fixtures = {};
    return;
  }

  let equiposQuery = supabaseClient
      .from("equipos")
      .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo,jugadores(id,nombre,apellido,dni,fecha_nacimiento,dorsal,activo)")
      .eq("division_id", divisionId)
      .eq("activo", true)
      .order("dorsal", { referencedTable: "jugadores", ascending: true })
      .order("nombre", { ascending: true });

  const [{ data: equiposBase, error: equiposBaseError }, { data: partidos, error: partidosError }] = await Promise.all([
    equiposQuery,
    supabaseClient
      .from("partidos")
      .select("id,division_id,equipo_local_id,equipo_visitante_id,fecha_hora,cancha,goles_local,goles_visitante,estado,observaciones")
      .eq("division_id", divisionId)
      .order("fecha_hora", { ascending: true })
  ]);

  let equipos = equiposBase;
  let equiposError = equiposBaseError;
  if (equiposError) {
    console.warn("No se pudo cargar equipos con perfil extendido. Se usa lectura base.", equiposError);
    const fallback = await supabaseClient
      .from("equipos")
      .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo,jugadores(id,nombre,apellido,dni,fecha_nacimiento,dorsal,activo)")
      .eq("division_id", divisionId)
      .eq("activo", true)
      .order("dorsal", { referencedTable: "jugadores", ascending: true })
      .order("nombre", { ascending: true });
    equipos = fallback.data;
    equiposError = fallback.error;
  }

  if (equiposError) throw equiposError;
  if (partidosError) throw partidosError;

  rememberMatchDetails(partidos || []);
  const matchIncidences = await loadMatchIncidences((partidos || []).map((match) => match.id).filter(Boolean));
  const delegateMap = await loadTeamDelegatesByTeam((equipos || []).map((team) => team.id).filter(Boolean));
  teams = (equipos || []).map((team) => {
    const normalized = normalizeSupabaseTeam(team);
    const delegate = delegateMap.get(normalized.id);
    return delegate
      ? { ...normalized, delegate: delegate.name, contact: delegate.contact }
      : normalized;
  });
  applyPlayerStatsToTeams(teams, matchIncidences);
  fixtures = filterDuplicateProgrammedMatches(partidos || []).reduce((grouped, match, index) => {
    const normalized = normalizeSupabaseMatch(match, index);
    const round = normalized.dateNumber;
    if (!grouped[round]) grouped[round] = [];
    grouped[round].push(normalized);
    return grouped;
  }, {});
  standings = calculateStandingsFromMatches(teams, fixtures);
}

function truncateTeamName(name) {
  return name.length > 12 ? `${name.slice(0, 12)}...` : name;
}

function getTeamCarouselClass(index, activeIndex) {
  const total = teams.length;
  if (!total) return "hidden";
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
  if (!teams.length) {
    teamCarousel.dataset.teamCarouselSignature = "";
    teamCarousel.innerHTML = `<div class="admin-empty-row">Sin equipos cargados en Supabase para esta división.</div>`;
    return;
  }

  const carouselSignature = teams.map((team) => team.id).join("|");
  const shouldRebuild = teamCarousel.dataset.teamCarouselSignature !== carouselSignature
    || teamCarousel.querySelectorAll("[data-team-id]").length !== teams.length;

  if (shouldRebuild) {
    teamCarousel.dataset.teamCarouselSignature = carouselSignature;
    teamCarousel.innerHTML = teams.map((team, index) => `
      <button class="team-card" type="button" data-team-id="${team.id}" data-team-carousel-index="${index}">
        ${renderTeamBadge(team)}
        <span>${team.shortName}</span>
      </button>
    `).join("");
  }

  teamCarousel.querySelectorAll("[data-team-id]").forEach((button) => {
    const index = Number(button.dataset.teamCarouselIndex || 0);
    const team = teams[index];
    const carouselClass = getTeamCarouselClass(index, teamCarouselActiveIndex);
    button.className = `team-card ${carouselClass} ${team?.id === selectedTeamId ? "selected" : ""}`.trim();
    button.setAttribute("aria-hidden", carouselClass === "hidden" ? "true" : "false");
  });
}

function moveTeamCarousel(direction) {
  if (!teams.length) return;
  teamCarouselActiveIndex = (teamCarouselActiveIndex + direction + teams.length) % teams.length;
  renderTeamCarousel();
}

function getTeamStanding(teamId) {
  return standings.find((row) => row.teamId === teamId) || {
    teamId,
    pts: 0,
    pj: 0,
    g: 0,
    e: 0,
    p: 0,
    gf: 0,
    gc: 0,
    dg: 0
  };
}

function renderShirt(team) {
  const [primary, secondary, accent = "#ffffff"] = team.shirtColors;
  const displayName = team.shortName || team.name;

  return `
    <div class="shirt-preview" style="--shirt-primary: ${primary}; --shirt-secondary: ${secondary}; --shirt-accent: ${accent};" aria-label="Camiseta de ${escapeHtml(displayName)}">
      <div class="shirt-sleeve left"></div>
      <div class="shirt-body"></div>
      <div class="shirt-sleeve right"></div>
    </div>
  `;
}

function renderRoster(team) {
  return getActivePlayers(team).map((player) => `
    <tr>
      <td>${player.number}</td>
      <td>${player.name}</td>
      <td>${player.age}</td>
    </tr>
  `).join("");
}

function getPlayerStats(team, statType) {
  if (statType === "goals") {
    return getActivePlayers(team)
      .filter((player) => player.goals > 0)
      .sort((a, b) => b.goals - a.goals)
      .map((player) => ({ name: player.name, value: player.goals }));
  }

  return getActivePlayers(team)
    .filter((player) => player.yellow > 0 || player.red > 0 || (player.observations || []).length > 0)
    .sort((a, b) =>
      (b.yellow + b.red + (b.observations || []).length) -
      (a.yellow + a.red + (a.observations || []).length)
    )
    .map((player) => {
      const observationsCount = (player.observations || []).length;
      const observationsLabel = observationsCount > 0 ? ` / ${observationsCount} obs.` : "";
      return { name: player.name, value: `${player.yellow}A / ${player.red}R${observationsLabel}` };
    });
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

function getSortedTeamMatches(teamId) {
  return getTeamMatches(teamId).sort((a, b) =>
    Number(a.dateNumber) - Number(b.dateNumber) ||
    String(a.fechaHora || "").localeCompare(String(b.fechaHora || ""))
  );
}

function getDefaultTeamFixtureRound(teamId) {
  const matches = getSortedTeamMatches(teamId);
  if (!matches.length) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextScheduled = matches.find((match) => {
    if (match.homeGoals !== null || match.awayGoals !== null || !match.fechaHora) return false;
    const matchDate = new Date(match.fechaHora);
    if (Number.isNaN(matchDate.getTime())) return false;
    matchDate.setHours(0, 0, 0, 0);
    return matchDate >= today;
  });
  const nextPending = matches.find((match) => match.homeGoals === null && match.awayGoals === null);

  return String((nextScheduled || nextPending || matches[0]).dateNumber);
}

function renderTeamFixtureRoundOptions(teamId, selectedRound = "") {
  const rounds = [...new Set(getSortedTeamMatches(teamId).map((match) => String(match.dateNumber)))];
  if (!rounds.length) return `<option value="">Sin fechas</option>`;

  return rounds.map((round) => `
    <option value="${escapeHtml(round)}" ${String(selectedRound) === String(round) ? "selected" : ""}>Fecha ${escapeHtml(round)}</option>
  `).join("");
}

function getMatchResultClass(match, teamId) {
  if (match.homeGoals === null || match.awayGoals === null) return "match-pending";
  if (match.homeGoals === match.awayGoals) return "match-draw";

  const isHome = match.home === teamId;
  const won = isHome ? match.homeGoals > match.awayGoals : match.awayGoals > match.homeGoals;
  return won ? "match-win" : "match-loss";
}

function getTeamMatchPassport(teamId) {
  const matches = getSortedTeamMatches(teamId);
  const finishedMatches = matches.filter((match) => match.homeGoals !== null && match.awayGoals !== null);
  const lastMatch = finishedMatches.at(-1) || null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextScheduled = matches.find((match) => {
    if (match.homeGoals !== null || match.awayGoals !== null || !match.fechaHora) return false;
    const matchDate = new Date(match.fechaHora);
    if (Number.isNaN(matchDate.getTime())) return false;
    matchDate.setHours(0, 0, 0, 0);
    return matchDate >= today;
  });
  const nextMatch = nextScheduled || matches.find((match) => match.homeGoals === null && match.awayGoals === null) || null;

  const getRivalName = (match) => {
    if (!match) return "Sin datos";
    const rival = getTeam(match.home === teamId ? match.away : match.home);
    return rival?.shortName || rival?.name || "Sin datos";
  };

  const getTeamScore = (match) => {
    if (!match || match.homeGoals === null || match.awayGoals === null) return "-";
    return match.home === teamId
      ? `${match.homeGoals} - ${match.awayGoals}`
      : `${match.awayGoals} - ${match.homeGoals}`;
  };

  return {
    lastRival: getRivalName(lastMatch),
    lastScore: getTeamScore(lastMatch),
    lastResultClass: lastMatch ? getMatchResultClass(lastMatch, teamId) : "match-pending",
    nextRival: getRivalName(nextMatch)
  };
}

function renderTeamMatches(teamId, selectedRound = "") {
  const matches = getSortedTeamMatches(teamId)
    .filter((match) => !selectedRound || String(match.dateNumber) === String(selectedRound));
  if (!matches.length) {
    return `<tr><td colspan="3">Sin partidos cargados para esta fecha</td></tr>`;
  }

  return matches.map((match) => {
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

function renderTeamDetail() {
  const team = getTeam(selectedTeamId);
  if (!team) {
    teamDetailView.innerHTML = `
      <section class="admin-empty-row">
        No se encontró el equipo seleccionado en Supabase.
      </section>
    `;
    return;
  }

  const standing = getTeamStanding(selectedTeamId);
  const matchPassport = getTeamMatchPassport(team.id);
  const teamRounds = [...new Set(getSortedTeamMatches(team.id).map((match) => String(match.dateNumber)))];
  if (!teamRounds.includes(String(selectedTeamFixtureRound))) {
    selectedTeamFixtureRound = getDefaultTeamFixtureRound(team.id);
  }

  teamDetailView.innerHTML = `
    <button class="back-to-division" type="button" data-back-to-division>
      <i class="bi bi-arrow-left"></i>
      Volver
    </button>
    <div class="team-detail-header">
      <div>
        <h2>${escapeHtml(team.shortName || team.legalName || team.name)}</h2>
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

    <section class="team-metrics team-detail-metrics team-passport-metrics" aria-label="Pasaporte de partidos del equipo">
      <article class="team-passport-page team-passport-page-main">
        <div class="team-passport-title-row">
          <h3>Partidos</h3>
          <i class="bi bi-passport" aria-hidden="true"></i>
        </div>
        <div class="team-passport-main-stat">
          <span>Jugados</span>
          <strong>${standing.pj}</strong>
        </div>
        <dl class="team-passport-results-grid">
          <div><dt>Ganados</dt><dd>${standing.g}</dd></div>
          <div><dt>Empatados</dt><dd>${standing.e}</dd></div>
          <div><dt>Perdidos</dt><dd>${standing.p}</dd></div>
        </dl>
      </article>

      <article class="team-passport-page team-passport-page-detail">
        <div class="team-passport-title-row">
          <h3>Detalle</h3>
          <i class="bi bi-journal-text" aria-hidden="true"></i>
        </div>
        <div class="team-passport-detail-block">
          <span>Último partido</span>
          <strong>${escapeHtml(matchPassport.lastRival)}</strong>
          <small class="team-match-result ${matchPassport.lastResultClass}">Resultado ${escapeHtml(matchPassport.lastScore)}</small>
        </div>
        <div class="team-passport-detail-block">
          <span>Próximo partido</span>
          <strong>${escapeHtml(matchPassport.nextRival)}</strong>
        </div>
      </article>
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
        <div class="fixture-toolbar">
          <div class="division-section-heading">
            <p class="section-kicker mb-1">Calendario</p>
            <h2>Partidos</h2>
          </div>
          <label class="fixture-select-label" for="teamFixtureDateSelect">
            Fecha
            <select id="teamFixtureDateSelect" class="form-select form-select-sm" data-team-fixture-select>
              ${renderTeamFixtureRoundOptions(team.id, selectedTeamFixtureRound)}
            </select>
          </label>
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
            <tbody>${renderTeamMatches(team.id, selectedTeamFixtureRound)}</tbody>
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
  if (!standings.length) {
    standingsBody.innerHTML = `<tr><td colspan="8">Sin equipos cargados en Supabase para esta división.</td></tr>`;
    return;
  }

  standingsBody.innerHTML = standings.map((row, index) => {
    const team = getTeam(row.teamId);
    if (!team) return "";
    const standingsTeamName = team.shortName || team.name;
    const standingsTeamTitle = team.legalName || team.name;

    return `
      <tr class="${index === 0 ? "standing-leader" : ""} ${index === standings.length - 1 ? "standing-relegation" : ""}">
        <td class="standings-rank">${index + 1}</td>
        <td>
          <a href="#" class="team-table-link" data-team-id="${team.id}" title="${escapeHtml(standingsTeamTitle)}" aria-label="Ver información de ${escapeHtml(standingsTeamName)}">
            ${renderTeamBadge(team, "small")}
            ${escapeHtml(truncateTeamName(standingsTeamName))}
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
  if (!matches.length) {
    fixtureBody.innerHTML = `<tr><td colspan="4">Sin partidos cargados en Supabase para esta fecha.</td></tr>`;
    return;
  }

  fixtureBody.innerHTML = matches.map((match) => {
    const home = getTeam(match.home);
    const away = getTeam(match.away);
    if (!home || !away) return "";
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
  if (!getTeam(teamId)) return;

  selectedTeamId = teamId;
  selectedTeamFixtureRound = getDefaultTeamFixtureRound(teamId);
  const teamIndex = teams.findIndex((team) => team.id === teamId);
  if (teamIndex >= 0) {
    teamCarouselActiveIndex = teamIndex;
  }
  renderTeamCarousel();
  renderTeamDetail();
  divisionTables.classList.add("d-none");
  teamDetailView.classList.remove("d-none");
}

function renderFixtureDateOptions() {
  const rounds = Object.keys(fixtures).sort((a, b) => Number(a) - Number(b));
  fixtureDateSelect.innerHTML = rounds.length
    ? rounds.map((round) => `<option value="${escapeHtml(round)}">Fecha ${escapeHtml(round)}</option>`).join("")
    : `<option value="">Sin fechas</option>`;
}

async function renderDivisionView(divisionName, divisionId) {
  selectedTeamId = null;
  teamCarouselActiveIndex = 0;
  activeDivisionId = divisionId || "";
  divisionTitle.textContent = divisionName;
  await loadDivisionDataFromSupabase(activeDivisionId);
  renderFixtureDateOptions();
  renderTeamCarousel();
  renderStandings();
  renderFixture();
  teamDetailView.classList.add("d-none");
  divisionTables.classList.remove("d-none");
}

function setSelectedDivision(button) {
  const divisionName = button.dataset.division;
  const divisionId = button.dataset.divisionId || "";
  const categoryName = button.dataset.category || "";
  const displayName = categoryName ? `${categoryName} / ${divisionName}` : divisionName;

  limpiarSeleccionDivisiones();
  button.classList.add("active");
  button.classList.add("is-clicking");

  selectedDivision.textContent = `División seleccionada: ${displayName}`;
  selectedDivision.classList.remove("d-none");
  homeContent.classList.add("d-none");
  publicInfoContent.classList.add("d-none");
  divisionContent.classList.remove("d-none");
  divisionLoader.classList.remove("is-hidden");
  divisionView.classList.add("d-none");

  window.clearTimeout(divisionLoadTimer);
  divisionLoadTimer = window.setTimeout(async () => {
    try {
      await renderDivisionView(displayName, divisionId);
    } catch (error) {
      console.error("Error al cargar la división desde Supabase:", error);
      teams = [];
      standings = [];
      fixtures = {};
      renderFixtureDateOptions();
      renderTeamCarousel();
      renderStandings();
      renderFixture();
    } finally {
      divisionLoader.classList.add("is-hidden");
      divisionView.classList.remove("d-none");
    }
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

async function exitProfileToPublicHome() {
  adminSettingsSession = null;
  observerSettingsSession = null;
  delegateSettingsSession = null;
  currentAppUser = null;
  currentAiReport = null;
  document.body.classList.remove("delegate-view");
  closeFulbitoChat();

  supabaseClient?.auth?.signOut?.().catch((error) => {
    console.error("Error al cerrar sesión de Supabase:", error);
  });

  const homeUrl = new URL("index.html", window.location.href);
  homeUrl.searchParams.set("logout", Date.now());
  homeUrl.hash = "home";
  window.location.assign(homeUrl.href);
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

function formatNewsDate(value = "") {
  return value ? String(value).split("-").reverse().join("/") : "-";
}

async function loadPublishedNews() {
  const { data, error } = await supabaseClient
    .from("noticias_ediciones")
    .select("id,titulo,slogan,fecha_publicacion,fecha:fechas_deportivas(id,numero_fecha,fecha_edicion),paginas:noticias_paginas(id,numero_pagina,titulo,resumen_general,contenido_texto,contenido_json,tabla_posiciones_snapshot,categoria:categorias(id,nombre),division:divisiones(id,nombre))")
    .eq("estado", "publicado")
    .order("fecha_publicacion", { ascending: false });
  if (error) {
    console.error("Error al cargar Diario Noticias:", error);
    publishedNewsEditions = [];
    return;
  }
  publishedNewsEditions = (data || []).map((edition) => ({
    ...edition,
    paginas: [...(edition.paginas || [])].sort((a, b) => a.numero_pagina - b.numero_pagina)
  }));
  if (!publishedNewsEditions.some((item) => String(item.id) === String(selectedNewsEditionId))) {
    selectedNewsEditionId = publishedNewsEditions[0]?.id || "";
    selectedNewsPageIndex = 0;
  }
}

function renderNewsStandings(snapshot = []) {
  if (!Array.isArray(snapshot) || !snapshot.length) {
    return `<div class="news-empty">Tabla no disponible para esta fecha.</div>`;
  }
  return `
    <table class="news-standings-table">
      <thead><tr><th>#</th><th>Equipo</th><th>Pts</th><th>DG</th></tr></thead>
      <tbody>${snapshot.map((row, index) => `
        <tr><td>${index + 1}</td><td>${escapeHtml(row.equipo || row.nombre || "Equipo")}</td><td>${Number(row.puntos ?? row.points ?? 0)}</td><td>${Number(row.diferencia ?? row.goalDifference ?? 0)}</td></tr>
      `).join("")}</tbody>
    </table>
  `;
}

function renderNewsContent() {
  const edition = publishedNewsEditions.find((item) => String(item.id) === String(selectedNewsEditionId));
  if (!edition) {
    return `<section class="public-info-panel news-paper"><div class="news-empty">Aún no hay noticias publicadas.</div></section>`;
  }
  const pages = edition.paginas || [];
  const page = pages[selectedNewsPageIndex] || pages[0];
  const blocks = Array.isArray(page?.contenido_json?.bloques) ? page.contenido_json.bloques : [];
  return `
    <section class="news-shell">
      <label class="news-date-header">
        <span class="news-date-label">Edición deportiva</span>
        <i class="bi bi-calendar-event" aria-hidden="true"></i>
        <select data-news-edition aria-label="Elegir fecha publicada">
          ${publishedNewsEditions.map((item) => `<option value="${item.id}" ${item.id === edition.id ? "selected" : ""}>Fecha ${item.fecha?.numero_fecha || "-"} · ${formatNewsDate(item.fecha?.fecha_edicion)}</option>`).join("")}
        </select>
      </label>
      <article class="news-paper">
        <header class="news-masthead">
          <div class="news-rule">Diario deportivo inteligente</div>
          <h2>${escapeHtml(edition.titulo || "Frame0")}</h2>
          <p>${escapeHtml(edition.slogan || "Un fin de semana a puro fútbol")}</p>
          <small>${escapeHtml(page?.categoria?.nombre || "Categoría")} / ${escapeHtml(page?.division?.nombre || "División")}</small>
        </header>
        <div class="news-edition-strip">
          <span><i class="bi bi-calendar3"></i> Fecha ${edition.fecha?.numero_fecha || "-"}</span>
          <strong>${formatNewsDate(edition.fecha?.fecha_edicion)}</strong>
          <span>Edición oficial Frame0</span>
        </div>
        ${page ? `
          <nav class="news-pagination" aria-label="Páginas por categoría y división">
            ${pages.map((item, index) => `<button type="button" data-news-page="${index}" class="${index === selectedNewsPageIndex ? "active" : ""}">${escapeHtml(item.categoria?.nombre || "Categoría")} · ${escapeHtml(item.division?.nombre || "División")}</button>`).join("")}
          </nav>
          <div class="news-layout">
            <main class="news-main-copy">
              <h3>${escapeHtml(page.titulo || `${page.categoria?.nombre || ""} - ${page.division?.nombre || ""}`)}</h3>
              <p class="news-lead">${escapeHtml(page.resumen_general || "Sin resumen general cargado.")}</p>
              ${page.contenido_texto ? `<p>${escapeHtml(page.contenido_texto)}</p>` : ""}
              <div class="news-block-grid">${blocks.map((block) => `
                <section class="news-block"><span>${escapeHtml(block.tipo || "destacado")}</span><h4>${escapeHtml(block.titulo || "Destacado")}</h4><p>${escapeHtml(block.texto || "")}</p></section>
              `).join("")}</div>
            </main>
            <aside class="news-standings"><h3>Tabla de posiciones</h3>${renderNewsStandings(page.tabla_posiciones_snapshot)}</aside>
          </div>
        ` : `<div class="news-empty">No hay contenido disponible para esta fecha.</div>`}
      </article>
    </section>
  `;
}

function getDriveFolderId(value = "") {
  const rawValue = String(value || "").trim();
  if (!rawValue) return "";
  const foldersMatch = rawValue.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (foldersMatch) return foldersMatch[1];
  const idMatch = rawValue.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];
  return rawValue.replace(/[^a-zA-Z0-9_-]/g, "");
}

function renderPhotosContent() {
  const driveFolderId = getDriveFolderId(publicSettings.drivePhotosLink || DEFAULT_DRIVE_PHOTOS_LINK);
  const embedUrl = driveFolderId ? `https://drive.google.com/embeddedfolderview?id=${driveFolderId}#grid` : "";

  return `
    <section class="public-info-panel photos-panel">
      <div class="photos-heading">
        <div>
          <p class="section-kicker mb-2">Fotos</p>
          <h2>Galería del torneo</h2>
          <p>Aquí puedes visualizar todas las fotos del torneo, se encuentran organizadas por fecha.</p>
        </div>
      </div>
      ${embedUrl
        ? `<iframe class="drive-photos-frame" src="${embedUrl}" title="Fotos del torneo Frame0 en Google Drive"></iframe>`
        : `<div class="admin-empty-row">Configurá el link de Drive desde Administrador &gt; Configuraciones &gt; Public Page.</div>`}
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

function getEscapedSelectorId(id = "") {
  return window.CSS?.escape ? window.CSS.escape(id) : String(id).replace(/["\\]/g, "\\$&");
}

function getLabelForRequiredField(field, form) {
  if (field.id) {
    const labelByFor = form.querySelector(`label[for="${getEscapedSelectorId(field.id)}"]`)
      || document.querySelector(`label[for="${getEscapedSelectorId(field.id)}"]`);
    if (labelByFor) return labelByFor;
  }

  return field.closest("label");
}

function getFormSubmitButton(form) {
  return [...form.querySelectorAll('button[type="submit"], .btn-login-submit')]
    .filter((button) => button.offsetParent !== null || button.type === "submit")
    .at(-1);
}

function addRequiredMarkerToLabel(label) {
  const textTarget = label.classList.contains("admin-filter-field")
    ? label.querySelector(":scope > span") || label
    : label;
  textTarget.insertAdjacentHTML("beforeend", ' <span class="required-marker" data-required-marker aria-hidden="true">*</span>');
}

function syncRequiredFieldIndicators(scope = document) {
  const scopedForms = [];
  if (scope.matches?.("form")) scopedForms.push(scope);
  scopedForms.push(...(scope.querySelectorAll?.("form") || []));

  const forms = scopedForms.filter((form) =>
    !form.matches("#loginForm")
    && (
      form.closest(".frame-form-modal")
      || form.matches(".team-create-form")
      || form.matches(".admin-category-form")
    )
  );

  forms.forEach((form) => {
    form.querySelectorAll("[data-required-marker]").forEach((marker) => marker.remove());

    const requiredFields = [...form.querySelectorAll("input[required], select[required], textarea[required]")]
      .filter((field) => field.type !== "hidden");

    requiredFields.forEach((field) => {
      const label = getLabelForRequiredField(field, form);
      if (!label) return;
      addRequiredMarkerToLabel(label);
    });

    let note = form.querySelector("[data-required-fields-note]");
    if (!requiredFields.length) {
      note?.remove();
      return;
    }

    if (!note) {
      note = document.createElement("p");
      note.className = "required-fields-note";
      note.dataset.requiredFieldsNote = "true";
    }

    note.textContent = REQUIRED_FIELDS_NOTE_TEXT;
    const submitButton = getFormSubmitButton(form);
    if (submitButton) {
      submitButton.before(note);
    } else {
      form.append(note);
    }
  });
}

function normalizeAiReport(report = {}) {
  return {
    title: report.title || AI_REPORT_TITLE,
    generatedAt: report.generatedAt || new Date().toISOString(),
    source: report.source || "Frame0 IA",
    model: report.model || "",
    summary: report.summary || "No se pudo generar un resumen detallado con los datos disponibles.",
    metrics: Array.isArray(report.metrics) ? report.metrics : [],
    sections: Array.isArray(report.sections) ? report.sections : [],
    alerts: Array.isArray(report.alerts) ? report.alerts : [],
    recommendations: Array.isArray(report.recommendations) ? report.recommendations : [],
    warning: report.warning || ""
  };
}

function getAiReportDisplayDate(report = {}) {
  const date = report.generatedAt ? new Date(report.generatedAt) : new Date();
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString("es-AR");
}

function countBy(items = [], keyGetter = () => "") {
  return items.reduce((map, item) => {
    const key = keyGetter(item) || "Sin dato";
    map.set(key, (map.get(key) || 0) + 1);
    return map;
  }, new Map());
}

function getTopEntriesFromCountMap(countMap, labelGetter = (key) => key, limit = 5) {
  return [...countMap.entries()]
    .sort((first, second) => second[1] - first[1])
    .slice(0, limit)
    .map(([key, count]) => `${labelGetter(key)} (${count})`);
}

async function selectSanctionsForAiReport() {
  let { data, error } = await supabaseClient
    .from("sanciones")
    .select("id,jugador_id,partido_id,motivo,fechas_suspension,cumplida,resolucion_detalle,estado_jugador,resuelta_at");

  if (error) {
    console.warn("No se pudieron leer columnas extendidas de sanciones para reportería IA. Se usa lectura base.", error);
    const fallback = await supabaseClient
      .from("sanciones")
      .select("id,jugador_id,partido_id,motivo,fechas_suspension,cumplida");
    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;
  return data || [];
}

async function fetchAiReportDatasetFromSupabase() {
  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no está disponible.");
  }

  const [
    categoriasResult,
    divisionesResult,
    equiposResult,
    jugadoresResult,
    partidosResult,
    golesResult,
    tarjetasResult,
    sanciones
  ] = await Promise.all([
    supabaseClient.from("categorias").select("id,nombre,activa"),
    supabaseClient.from("divisiones").select("id,nombre,categoria_id,activa"),
    supabaseClient.from("equipos").select("id,nombre,division_id,activo"),
    supabaseClient.from("jugadores").select("id,equipo_id,nombre,apellido,activo,dorsal"),
    supabaseClient.from("partidos").select("id,division_id,equipo_local_id,equipo_visitante_id,fecha_hora,goles_local,goles_visitante,estado,observaciones"),
    supabaseClient.from("goles").select("id,partido_id,jugador_id,equipo_id,tipo"),
    supabaseClient.from("tarjetas").select("id,partido_id,jugador_id,equipo_id,tipo"),
    selectSanctionsForAiReport()
  ]);

  const results = [categoriasResult, divisionesResult, equiposResult, jugadoresResult, partidosResult, golesResult, tarjetasResult];
  const firstError = results.find((result) => result.error)?.error;
  if (firstError) throw firstError;

  return {
    categorias: categoriasResult.data || [],
    divisiones: divisionesResult.data || [],
    equipos: equiposResult.data || [],
    jugadores: jugadoresResult.data || [],
    partidos: partidosResult.data || [],
    goles: golesResult.data || [],
    tarjetas: tarjetasResult.data || [],
    sanciones
  };
}

function buildRuleBasedAiReport(dataset = {}, options = {}) {
  const source = options.source || "Fallback local";
  const categorias = dataset.categorias || [];
  const divisiones = dataset.divisiones || [];
  const equipos = dataset.equipos || [];
  const jugadores = dataset.jugadores || [];
  const partidos = dataset.partidos || [];
  const goles = dataset.goles || [];
  const tarjetas = dataset.tarjetas || [];
  const sanciones = dataset.sanciones || [];

  const activeTeams = equipos.filter((team) => team.activo !== false);
  const activePlayers = jugadores.filter((player) => player.activo !== false);
  const activeCategories = categorias.filter((category) => category.activa !== false);
  const activeDivisions = divisiones.filter((division) => division.activa !== false);
  const finishedMatches = partidos.filter((match) => match.estado === "finalizado");
  const programmedMatches = partidos.filter((match) => match.estado === "programado");
  const suspendedMatches = partidos.filter((match) => ["suspendido", "cancelado"].includes(match.estado));
  const yellowCards = tarjetas.filter((card) => card.tipo === "amarilla").length;
  const redCards = tarjetas.filter((card) => card.tipo === "roja").length;
  const pendingSanctions = sanciones.filter((sanction) => {
    const hasText = String(sanction.motivo || "").trim();
    const hasResolution = sanction.resuelta_at || sanction.resolucion_detalle || sanction.estado_jugador;
    return hasText && !hasResolution;
  });
  const averagePlayers = activeTeams.length ? Math.round(activePlayers.length / activeTeams.length) : 0;

  const playerNameMap = new Map(activePlayers.map((player) => [
    String(player.id),
    `${player.apellido || ""} ${player.nombre || ""}`.trim() || "Jugador"
  ]));
  const teamNameMap = new Map(activeTeams.map((team) => [String(team.id), team.nombre || "Equipo"]));
  const divisionNameMap = new Map(activeDivisions.map((division) => {
    const category = activeCategories.find((item) => String(item.id) === String(division.categoria_id));
    return [String(division.id), `${category?.nombre || "Categoría"} - ${division.nombre || "División"}`];
  }));

  const topScorers = getTopEntriesFromCountMap(
    countBy(goles.filter((goal) => goal.jugador_id), (goal) => String(goal.jugador_id)),
    (playerId) => playerNameMap.get(String(playerId)) || "Jugador sin identificar"
  );
  const teamsByGoals = getTopEntriesFromCountMap(
    countBy(goles.filter((goal) => goal.equipo_id), (goal) => String(goal.equipo_id)),
    (teamId) => teamNameMap.get(String(teamId)) || "Equipo sin identificar"
  );
  const matchesByDivision = getTopEntriesFromCountMap(
    countBy(partidos, (match) => String(match.division_id || "")),
    (divisionId) => divisionNameMap.get(String(divisionId)) || "División sin identificar"
  );

  const alerts = [];
  if (!activeTeams.length) alerts.push("No hay equipos activos cargados para analizar.");
  if (!partidos.length) alerts.push("No hay partidos cargados en Supabase.");
  if (pendingSanctions.length) alerts.push(`Hay ${pendingSanctions.length} observaciones disciplinarias pendientes de resolución.`);
  if (suspendedMatches.length) alerts.push(`Hay ${suspendedMatches.length} partidos suspendidos o cancelados para revisar.`);
  if (averagePlayers > 0 && averagePlayers < 7) alerts.push("El promedio de jugadores por equipo es bajo; conviene revisar listas de buena fe.");
  if (!alerts.length) alerts.push("No se detectan alertas críticas con los datos actuales.");

  const summary = `El torneo registra ${activeCategories.length} categorías activas, ${activeDivisions.length} divisiones, ${activeTeams.length} equipos y ${activePlayers.length} jugadores activos. Hay ${partidos.length} partidos cargados, con ${finishedMatches.length} finalizados y ${programmedMatches.length} programados.`;

  return normalizeAiReport({
    title: AI_REPORT_TITLE,
    generatedAt: new Date().toISOString(),
    source,
    model: source === "Groq" ? "openai/gpt-oss-20b" : "Reglas locales",
    summary,
    metrics: [
      { label: "Categorías", value: activeCategories.length },
      { label: "Divisiones", value: activeDivisions.length },
      { label: "Equipos", value: activeTeams.length },
      { label: "Jugadores", value: activePlayers.length },
      { label: "Partidos finalizados", value: finishedMatches.length },
      { label: "Observaciones pendientes", value: pendingSanctions.length }
    ],
    sections: [
      {
        title: "Estado deportivo",
        items: [
          `Partidos programados: ${programmedMatches.length}.`,
          `Partidos finalizados: ${finishedMatches.length}.`,
          `Goles registrados: ${goles.length}.`,
          `Divisiones con más partidos: ${matchesByDivision.join(", ") || "sin datos suficientes"}.`
        ]
      },
      {
        title: "Rendimiento y estadísticas",
        items: [
          `Promedio de jugadores por equipo: ${averagePlayers}.`,
          `Goleadores destacados: ${topScorers.join(", ") || "sin goles registrados"}.`,
          `Equipos con más goles: ${teamsByGoals.join(", ") || "sin goles registrados"}.`
        ]
      },
      {
        title: "Disciplina",
        items: [
          `Tarjetas amarillas: ${yellowCards}.`,
          `Tarjetas rojas: ${redCards}.`,
          `Sanciones/observaciones totales: ${sanciones.length}.`,
          `Pendientes de resolución: ${pendingSanctions.length}.`
        ]
      }
    ],
    alerts,
    recommendations: [
      pendingSanctions.length ? "Resolver las observaciones disciplinarias pendientes antes de la próxima fecha." : "Mantener la revisión disciplinaria después de cada fecha.",
      programmedMatches.length ? "Verificar canchas y horarios de los partidos programados." : "Generar o actualizar el fixture para sostener la planificación.",
      "Revisar equipos con baja cantidad de jugadores activos para evitar problemas de presentación.",
      "Publicar novedades relevantes para delegados si hubo cambios de fixture o sanciones."
    ],
    warning: options.warning || ""
  });
}

async function generateLocalAiReportFallback(warning = "") {
  const dataset = await fetchAiReportDatasetFromSupabase();
  return buildRuleBasedAiReport(dataset, {
    source: "Fallback local",
    warning
  });
}

function renderAboutContextArt(member, index, activeIndex) {
  const isActive = index === activeIndex;
  const visual = member.visual || "software";
  const contextClass = `about-context about-context-${visual} ${isActive ? "active" : ""}`.trim();

  const templates = {
    planning: `
      <div class="about-context-label">Planificación</div>
      <div class="about-plan-board">
        <span></span><span></span><span></span>
        <i class="bi bi-check2"></i>
      </div>
      <div class="about-plan-lines">
        <span></span><span></span><span></span>
      </div>
    `,
    data: `
      <div class="about-context-label">Análisis de datos</div>
      <div class="about-data-chart">
        <span style="--bar-height: 42%;"></span>
        <span style="--bar-height: 68%;"></span>
        <span style="--bar-height: 54%;"></span>
        <span style="--bar-height: 86%;"></span>
      </div>
      <div class="about-data-dots"><span></span><span></span><span></span></div>
    `,
    "testing-infra": `
      <div class="about-context-label">Testing & infra</div>
      <div class="about-pipeline">
        <span><i class="bi bi-check2"></i></span>
        <span><i class="bi bi-hdd-network"></i></span>
        <span><i class="bi bi-shield-check"></i></span>
      </div>
      <div class="about-scan-line"></div>
    `,
    software: `
      <div class="about-context-label">Desarrollo</div>
      <div class="about-code-window">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="about-terminal-cursor"></div>
    `
  };

  return `
    <div class="${contextClass}" data-about-context-index="${index}" data-about-context-visual="${escapeHtml(visual)}" aria-hidden="true">
      ${templates[visual] || templates.software}
    </div>
  `;
}

function renderAboutContent() {
  const activeIndex = 0;
  const carouselItems = aboutMembers.map((member, index) => `
    <article class="about-member-card ${getAboutCarouselClass(index, activeIndex)}" data-about-index="${index}" aria-hidden="${index === activeIndex ? "false" : "true"}">
      <img src="${member.image}" alt="${member.name} - ${member.role}" loading="${index === activeIndex ? "eager" : "lazy"}">
    </article>
  `).join("");
  const contextItems = aboutMembers.map((member, index) => renderAboutContextArt(member, index, activeIndex)).join("");

  return `
    <section class="public-info-panel about-panel" data-about-carousel data-about-active="0">
      <div class="about-page-heading">
        <p class="section-kicker mb-2">Nosotros</p>
      </div>
      <div class="about-hero">
        <div class="about-context-layer">
          ${contextItems}
        </div>
        <h3>Somos TheBlackListSystem</h3>
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
  carousel.querySelectorAll("[data-about-context-index]").forEach((item) => {
    const itemIndex = Number(item.dataset.aboutContextIndex);
    const visual = item.dataset.aboutContextVisual || "software";
    item.className = `about-context about-context-${visual} ${itemIndex === nextIndex ? "active" : ""}`.trim();
  });
}

async function showPublicInfo(page) {
  limpiarSeleccionDivisiones();
  selectedDivision.classList.add("d-none");
  homeContent.classList.add("d-none");
  divisionContent.classList.add("d-none");
  divisionLoader.classList.remove("is-hidden");
  divisionView.classList.add("d-none");
  window.clearTimeout(divisionLoadTimer);

  if (page === "noticias") await loadPublishedNews();

  const publicPages = {
    noticias: renderNewsContent,
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

function getConfirmationModalElement() {
  let modal = document.querySelector("#frameConfirmModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "frameConfirmModal";
  modal.tabIndex = -1;
  modal.setAttribute("aria-labelledby", "frameConfirmModalLabel");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content login-modal frame-confirm-modal">
        <div class="modal-header">
          <div class="login-brand">
            <img src="assets/frame0-logo.png" alt="Logo Frame0">
            <div>
              <p class="section-kicker mb-1">Confirmación</p>
              <h2 class="modal-title fs-5" id="frameConfirmModalLabel">Confirmar acción</h2>
            </div>
          </div>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body">
          <div class="frame-confirm-symbol" aria-hidden="true"><i class="bi bi-question-lg"></i></div>
          <p class="mb-3" data-confirm-message>¿Querés continuar?</p>
          <div class="d-grid gap-2">
            <button class="btn btn-login-submit" type="button" data-confirm-accept>
              Confirmar
            </button>
            <button class="btn btn-outline-light admin-secondary-btn" type="button" data-bs-dismiss="modal">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function requestConfirmation({ title = "Confirmar acción", message = "¿Querés continuar?", confirmLabel = "Confirmar" } = {}) {
  return new Promise((resolve) => {
    const modalElement = getConfirmationModalElement();
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    const titleElement = modalElement.querySelector("#frameConfirmModalLabel");
    const messageElement = modalElement.querySelector("[data-confirm-message]");
    const acceptButton = modalElement.querySelector("[data-confirm-accept]");
    let resolved = false;

    titleElement.textContent = title;
    messageElement.textContent = message;
    acceptButton.textContent = confirmLabel;

    const cleanup = () => {
      acceptButton.removeEventListener("click", acceptHandler);
      modalElement.removeEventListener("hidden.bs.modal", hiddenHandler);
    };
    const finish = (value) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve(value);
    };
    const acceptHandler = () => {
      finish(true);
      modal.hide();
    };
    const hiddenHandler = () => finish(false);

    acceptButton.addEventListener("click", acceptHandler);
    modalElement.addEventListener("hidden.bs.modal", hiddenHandler);
    modal.show();
  });
}

async function loginUsuariosApp(usuarioIngresado, passwordIngresada) {
  const usuarioLimpio = usuarioIngresado.trim();
  const usuarioLookup = usuarioLimpio.includes("@") ? usuarioLimpio.split("@")[0] : usuarioLimpio;

  const { data, error } = await supabaseClient
    .from("usuarios_app")
    .select("*")
    .ilike("usuario", usuarioLookup)
    .eq("activo", true)
    .maybeSingle();

  console.log("usuarioLimpio:", usuarioLimpio);
  console.log("usuarioLookup:", usuarioLookup);
  console.log("data usuarios_app:", data);
  console.log("error usuarios_app:", error);
  console.log("Supabase URL:", typeof SUPABASE_URL !== "undefined" ? SUPABASE_URL : "SUPABASE_URL no disponible");

  if (error) {
    showLoginError("Error consultando Supabase: " + error.message);
    return null;
  }

  if (!data) {
    showLoginError(`Usuario "${usuarioLookup}" no encontrado en usuarios_app.`);
    return null;
  }

  if (data.password_hash && data.password_hash !== passwordIngresada.trim()) {
    showLoginError("Contraseña incorrecta.");
    return null;
  }

  const authReady = await ensureSupabaseAuthSessionForProfile(data, passwordIngresada);
  if (!data.password_hash && !authReady) {
    showLoginError("No hay contraseña configurada para este usuario en usuarios_app y no se pudo validar con Supabase Auth.");
    return null;
  }

  return data;
}

async function ensureSupabaseAuthSessionForProfile(usuarioApp, passwordIngresada) {
  if (!usuarioApp?.usuario || typeof supabaseClient === "undefined") return false;

  const email = `${String(usuarioApp.usuario).trim().toLowerCase()}@frame0.local`;
  const password = String(passwordIngresada || "").trim();
  if (!password) return false;

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (!error) return true;

  if (usuarioApp.rol === "delegado" || usuarioApp.rol === "veedor") {
    const { error: signUpError } = await supabaseClient.auth.signUp({ email, password });
    if (!signUpError) return true;
    console.warn("No se pudo crear sesión Supabase Auth para RLS:", signUpError.message);
    return false;
  }

  console.warn("No se pudo iniciar sesión Supabase Auth para RLS:", error.message);
  return false;
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
  window.setTimeout(async () => {
    try {
      await callback();
    } catch (error) {
      console.error(`Error al cargar perfil ${roleName}:`, error);
      contentShell.innerHTML = `
        <section class="admin-error-panel">
          <i class="bi bi-exclamation-triangle-fill"></i>
          <h2>No se pudo cargar el perfil</h2>
          <p>Revisá la conexión con Supabase e intentá nuevamente.</p>
        </section>
      `;
    }
  }, 800);
}

function getAdminMetrics() {
  const sourceCatalog = adminMetricsState?.categories || tournamentCatalog;
  const categories = sourceCatalog.map((category) => ({
    name: category.name,
    divisions: category.divisions.map((division) => ({
      name: division.name,
      id: division.id,
      teams: Number(division.teams || 0),
      players: Number(division.players || 0)
    }))
  }));
  const totalTeams = categories.flatMap((category) => category.divisions).reduce((sum, division) => sum + division.teams, 0);
  const totalPlayers = categories.flatMap((category) => category.divisions).reduce((sum, division) => sum + division.players, 0);
  const averagePlayers = totalTeams ? Math.round(totalPlayers / totalTeams) : 0;

  return {
    categories,
    totalTeams,
    averagePlayers,
    totalPlayers
  };
}

function invalidateAdminMetrics() {
  adminMetricsState = null;
  resetAdminObservedSummary();
}

async function loadAdminMetricsFromSupabase() {
  if (typeof supabaseClient === "undefined") return getAdminMetrics();

  if (!tournamentCatalog.length) {
    await cargarMenuCategorias();
  }

  const [{ data: equipos, error: equiposError }, { data: jugadores, error: jugadoresError }] = await Promise.all([
    supabaseClient
      .from("equipos")
      .select("id,division_id,activo")
      .eq("activo", true),
    supabaseClient
      .from("jugadores")
      .select("id,equipo_id,activo")
      .eq("activo", true)
  ]);

  if (equiposError) throw equiposError;
  if (jugadoresError) throw jugadoresError;

  const teamCountsByDivision = new Map();
  const teamDivisionById = new Map();
  (equipos || []).forEach((team) => {
    teamDivisionById.set(String(team.id), String(team.division_id));
    teamCountsByDivision.set(String(team.division_id), (teamCountsByDivision.get(String(team.division_id)) || 0) + 1);
  });

  const playerCountsByDivision = new Map();
  (jugadores || []).forEach((player) => {
    const divisionId = teamDivisionById.get(String(player.equipo_id));
    if (!divisionId) return;
    playerCountsByDivision.set(divisionId, (playerCountsByDivision.get(divisionId) || 0) + 1);
  });

  adminMetricsState = {
    categories: tournamentCatalog.map((category) => ({
      ...category,
      divisions: category.divisions.map((division) => ({
        ...division,
        teams: teamCountsByDivision.get(String(division.id)) || 0,
        players: playerCountsByDivision.get(String(division.id)) || 0
      }))
    }))
  };

  return getAdminMetrics();
}

function getAdminDivisionMap() {
  return getAdminMetrics().categories.reduce((map, category) => {
    map[category.name] = category.divisions.map((division) => division.name);
    return map;
  }, {});
}

function populateNewTeamCategories() {
  const categoryOptions = tournamentCatalog.map((category) => `
    <option value="${escapeHtml(category.name)}">${escapeHtml(category.name)}</option>
  `).join("");

  newTeamCategory.innerHTML = `<option value="">Seleccionar categoría</option>${categoryOptions}`;
}

function populateNewTeamDivisions(category) {
  const divisions = tournamentCatalog.find((item) => item.name === category)?.divisions || [];
  const divisionOptions = divisions.map((division) => `
    <option value="${division.id}">${escapeHtml(division.name)}</option>
  `).join("");

  newTeamDivision.innerHTML = `<option value="">Seleccionar división</option>${divisionOptions}`;
  newTeamDivision.disabled = !category;
}

function validateNewTeamForm() {
  const isValid = Boolean(
    newTeamName.value.trim() &&
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
    .filter(() => true)
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
  const editingId = newDelegateForm?.dataset.editingId || "";
  const isValidPhone = /^[0-9]+$/.test(newDelegateContact.value.trim());
  const isPasswordValid = editingId ? true : Boolean(newDelegatePassword.value.trim());
  const isValid = Boolean(
    newDelegateLastName.value.trim() &&
    newDelegateFirstName.value.trim() &&
    newDelegateDocument.value.trim() &&
    isValidPhone &&
    newDelegateTeam.value &&
    newDelegateUsername.value.trim() &&
    isPasswordValid
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
    newObserverDocument.value.trim() &&
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
  const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
  const editingId = delegatePlayerForm?.dataset.editingId || "";
  const dni = delegatePlayerDni?.value.trim() || "";
  const hasDuplicateDni = Boolean(dni) && (team?.players || []).some((player) =>
    String(player.dni || "").trim() === dni &&
    String(player.id) !== String(editingId)
  );
  const isValid = Boolean(
    delegatePlayerLastName?.value.trim() &&
    delegatePlayerFirstName?.value.trim() &&
    delegatePlayerBirthDate?.value &&
    /^[0-9]+$/.test(dni) &&
    delegatePlayerNumber?.value &&
    !hasDuplicateDni
  );

  if (delegatePlayerFeedback) {
    delegatePlayerFeedback.textContent = hasDuplicateDni ? `Ya existe un jugador registrado con DNI ${dni}.` : "";
    delegatePlayerFeedback.classList.toggle("is-error", hasDuplicateDni);
  }

  saveDelegatePlayerButton.disabled = !isValid;
}

function isPlayerRegistrationOpen(date = new Date()) {
  const from = tournamentSettings.playerRegistrationFrom;
  const to = tournamentSettings.playerRegistrationTo;
  if (!from || !to) return true;

  const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const [fromYear, fromMonth, fromDay] = from.split("-").map(Number);
  const [toYear, toMonth, toDay] = to.split("-").map(Number);
  const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
  const toDate = new Date(toYear, toMonth - 1, toDay);
  return currentDate >= fromDate && currentDate <= toDate;
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
      matchDay: DEFAULT_FIXTURE_MATCH_DAY,
      startDate: DEFAULT_FIXTURE_START_DATE,
      playoffEnabled: false,
      playoffTeams: defaultPlayoffTeams,
      fixture: null
    };
  }

  if (tournamentSettings.divisions[key].matchDay === undefined) {
    tournamentSettings.divisions[key].matchDay = DEFAULT_FIXTURE_MATCH_DAY;
  }
  if (!tournamentSettings.divisions[key].startDate) {
    tournamentSettings.divisions[key].startDate = DEFAULT_FIXTURE_START_DATE;
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
      divisionId: division.id,
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

function parseIsoLocalDate(value = "") {
  const [year, month, day] = String(value || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getNextMatchDate(startDate = DEFAULT_FIXTURE_START_DATE, matchDay = DEFAULT_FIXTURE_MATCH_DAY) {
  const date = parseIsoLocalDate(startDate) || parseIsoLocalDate(DEFAULT_FIXTURE_START_DATE);
  const targetDay = Number(matchDay);
  const safeTargetDay = Number.isInteger(targetDay) && targetDay >= 0 && targetDay <= 6 ? targetDay : Number(DEFAULT_FIXTURE_MATCH_DAY);
  const dayOffset = (safeTargetDay - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + dayOffset);
  return date;
}

function getRoundMatchDateIso(roundNumber, startDate, matchDay) {
  const date = getNextMatchDate(startDate, matchDay);
  date.setDate(date.getDate() + (Math.max(Number(roundNumber) || 1, 1) - 1) * 7);
  date.setHours(0, 0, 0, 0);
  return `${formatLocalDate(date)}T00:00:00-03:00`;
}

async function getFixtureTeamsByDivision(divisionId = "") {
  if (!divisionId || typeof supabaseClient === "undefined") return [];

  let { data, error } = await supabaseClient
    .from("equipos")
    .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo")
    .eq("division_id", divisionId)
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (error) {
    console.warn("No se pudieron cargar equipos extendidos para fixture. Se usa lectura base.", error);
    const fallback = await supabaseClient
      .from("equipos")
      .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo")
      .eq("division_id", divisionId)
      .eq("activo", true)
      .order("nombre", { ascending: true });
    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;
  return (data || []).map(normalizeSupabaseTeam);
}

function buildRoundRobinRounds(teamItems, requestedDates, startDate = DEFAULT_FIXTURE_START_DATE, matchDay = DEFAULT_FIXTURE_MATCH_DAY) {
  const teamsList = shuffleItems(teamItems);
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
        const homeTeam = cycleRound % 2 === 0 ? home : away;
        const awayTeam = cycleRound % 2 === 0 ? away : home;
        matches.push({
          home: homeTeam,
          away: awayTeam,
          label: `${homeTeam.shortName} vs ${awayTeam.shortName}`
        });
      }
    }

    rounds.push({
      name: `Fecha ${roundIndex + 1}`,
      matches: matches.map((match) => match.label),
      dbMatches: matches.map((match) => ({
        round: roundIndex + 1,
        homeTeamId: match.home.id,
        awayTeamId: match.away.id,
        fechaHora: getRoundMatchDateIso(roundIndex + 1, startDate, matchDay)
      }))
    });

    rotation.splice(1, 0, rotation.pop());
  }

  return rounds;
}

async function generateFixturePlan(row) {
  if (!row) return null;

  const config = row.config;
  const fixtureTeams = await getFixtureTeamsByDivision(row.divisionId);
  const teamsCount = fixtureTeams.length;
  if (teamsCount < 2) return null;

  const matchDay = config.matchDay || DEFAULT_FIXTURE_MATCH_DAY;
  const startDate = config.startDate || DEFAULT_FIXTURE_START_DATE;
  const firstMatchDate = formatLocalDate(getNextMatchDate(startDate, matchDay));
  const rounds = buildRoundRobinRounds(fixtureTeams, config.datesCount, startDate, matchDay);
  const datesCount = rounds.length;
  config.datesCount = datesCount;

  config.fixture = {
    generatedAt: new Date().toLocaleString("es-AR"),
    category: row.category,
    division: row.division,
    divisionId: row.divisionId,
    matchDay,
    startDate,
    firstMatchDate,
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
      ${round.dbMatches?.[0]?.fechaHora ? `<p class="meta">Programado: ${new Date(round.dbMatches[0].fechaHora).toLocaleDateString("es-AR")}</p>` : ""}
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
        <p class="meta">${fixture.teamsCount} equipos ? ${fixture.datesCount} fechas · Generado: ${fixture.generatedAt}</p>
        ${roundsHtml}
        ${cupsHtml}
        <script>window.print();</script>
      </body>
    </html>
  `;
}

function getCurrentObserverFullName() {
  const lastName = currentAppUser?.apellido || "";
  const firstName = currentAppUser?.nombre || currentAppUser?.usuario || "";
  return `${lastName} ${firstName}`.trim() || "Veedor no informado";
}

function renderMatchSheetPlayerRows(team) {
  return (team?.players || []).map((player, index) => `
    <tr>
      <td class="index">${index + 1}</td>
      <td>${escapeHtml(player.name || "-")}</td>
      <td>${escapeHtml(player.dni || "-")}</td>
      <td class="shirt">${escapeHtml(String(player.number || "-"))}</td>
      <td class="status">${escapeHtml(getPlayerStatus({ ...player, team }) || "-")}</td>
      <td><span class="signature-line"></span></td>
      <td class="mark">TA <span class="radio-circle"></span></td>
      <td class="mark">TR <span class="radio-circle"></span></td>
      <td class="goals">G <span class="goals-line"></span></td>
    </tr>
  `).join("");
}

function renderMatchSheetTeam(team, label) {
  return `
    <section class="team-sheet">
      <h2>${escapeHtml(label)}: ${escapeHtml(team?.name || team?.shortName || "-")}</h2>
      <table>
        <thead>
          <tr>
            <th class="index">N°</th>
            <th>Apellido y nombre</th>
            <th>DNI</th>
            <th class="shirt"># camiseta</th>
            <th>Estado</th>
            <th>Firma del jugador</th>
            <th>TA</th>
            <th>TR</th>
            <th>G</th>
          </tr>
        </thead>
        <tbody>
          ${renderMatchSheetPlayerRows(team)}
        </tbody>
      </table>
    </section>
  `;
}

function renderObserverMatchSheetDocument(match, homeTeam, awayTeam) {
  const observerName = getCurrentObserverFullName();

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Planilla ${escapeHtml(homeTeam?.shortName || "Equipo A")} vs ${escapeHtml(awayTeam?.shortName || "Equipo B")}</title>
        <style>
          @page { size: A4; margin: 12mm; }
          * { box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #111827; margin: 0; }
          h1 { margin: 0 0 8px; color: #0b4fe8; font-size: 22px; }
          h2 { margin: 14px 0 8px; font-size: 16px; color: #111827; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; margin-bottom: 10px; font-size: 12px; }
          .meta span { border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; }
          .divider { height: 1px; margin: 16px 0 10px; background: #94a3b8; }
          table { width: 100%; border-collapse: collapse; table-layout: fixed; font-size: 10.5px; }
          th, td { border: 1px solid #cbd5e1; padding: 5px 4px; vertical-align: middle; }
          th { background: #eef6ff; color: #0f2742; text-align: left; }
          .index { width: 28px; text-align: center; }
          .shirt { width: 58px; text-align: center; }
          th:nth-child(2), td:nth-child(2) { width: 160px; }
          th:nth-child(3), td:nth-child(3) { width: 78px; text-align: center; }
          th:nth-child(5), td:nth-child(5) { width: 78px; text-align: center; }
          th:nth-child(6), td:nth-child(6) { width: 118px; }
          th:nth-child(7), td:nth-child(7),
          th:nth-child(8), td:nth-child(8) { width: 40px; text-align: center; }
          th:nth-child(9), td:nth-child(9) { width: 58px; text-align: center; }
          .status { font-size: 9px; }
          .signature-line, .goals-line { display: inline-block; width: 100%; border-bottom: 1px solid #111827; height: 12px; }
          .goals-line { width: 28px; }
          .radio-circle { display: inline-block; width: 10px; height: 10px; margin-left: 4px; border: 1.5px solid #111827; border-radius: 50%; vertical-align: middle; }
          .mark, .goals { white-space: nowrap; }
          .team-sheet { page-break-inside: avoid; }
        </style>
      </head>
      <body>
        <h1>Planilla de partido</h1>
        <div class="meta">
          <span><strong>Veedor:</strong> ${escapeHtml(observerName)}</span>
          <span><strong>Fecha:</strong> ${escapeHtml(match?.date || "-")}</span>
        </div>
        ${renderMatchSheetTeam(homeTeam, "Nombre del equipo A")}
        <div class="divider"></div>
        ${renderMatchSheetTeam(awayTeam, "Nombre del equipo B")}
        <script>window.setTimeout(() => window.print(), 250);</script>
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

async function getDelegateTeamFromSupabase(usuarioApp) {
  if (!usuarioApp?.id || typeof supabaseClient === "undefined") return null;

  const { data: delegateRelations, error: delegateError } = await supabaseClient
    .from("delegados")
    .select("id,usuario_id,equipo_id,activo")
    .eq("usuario_id", usuarioApp.id)
    .eq("activo", true)
    .limit(3);

  console.log("login delegado relaciones:", delegateRelations);
  console.log("login delegado error relacion:", delegateError);

  if (delegateError) throw delegateError;

  const delegateRelation = delegateRelations?.[0];
  let relatedTeam = null;
  if (delegateRelation?.equipo_id) {
    const { data: teamData, error: teamError } = await supabaseClient
      .from("equipos")
      .select("id,nombre,division_id,activo")
      .eq("id", delegateRelation.equipo_id)
      .eq("activo", true)
      .maybeSingle();

    console.log("login delegado equipo:", teamData);
    console.log("login delegado error equipo:", teamError);
    if (teamError) throw teamError;
    relatedTeam = teamData;
  }

  if (relatedTeam?.id && relatedTeam?.division_id && relatedTeam.activo !== false) {
    await loadDivisionDataFromSupabase(relatedTeam.division_id);
    activeDivisionId = relatedTeam.division_id;
    return getTeam(relatedTeam.id);
  }

  const normalizedUsername = normalizeSearchText(usuarioApp.usuario);
  const { data: teamsData, error: teamsError } = await supabaseClient
    .from("equipos")
    .select("id,nombre,division_id,activo")
    .eq("activo", true);

  if (teamsError) throw teamsError;

  const fallbackTeam = (teamsData || []).find((item) =>
    normalizeSearchText(item.nombre).includes(normalizedUsername)
  );
  const divisionId = fallbackTeam?.division_id;
  const teamId = fallbackTeam?.id;
  if (!divisionId || !teamId) return null;

  await loadDivisionDataFromSupabase(divisionId);
  activeDivisionId = divisionId;
  return getTeam(teamId);
}

function getTeamStatusCounts(team) {
  return getActivePlayers(team).reduce((counts, player) => {
    const status = { Habilitado: "enabled", Suspendido: "suspended", Inhabilitado: "disabled" }[getPlayerStatus({ ...player, team })];
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
  if ((Number(player.suspensionMatches) || 0) > 0) return "Suspendido";
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
        <p class="section-kicker section-brand mb-1">${team.legalName}</p>
        <h2 class="section-title mb-0">Resumen</h2>
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
      <div><span>Jugadores</span><strong>${getActivePlayers(team).length}</strong></div>
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

function renderDelegatePlayers(team, includeInactive = false) {
  const canEditPlayers = isPlayerRegistrationOpen();
  const disabledAttribute = canEditPlayers ? "" : "disabled";
  const visiblePlayers = (team.players || []).filter((player) => includeInactive ? player.active === false : player.active !== false);
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
            ${visiblePlayers.length ? visiblePlayers.map((player, index) => {
              const playerWithTeam = { ...player, team };
              const status = player.active === false ? "Dado de baja" : getPlayerStatus(playerWithTeam);
              return `
              <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${getDemoPlayerBirthDate(player, index)}</td>
                <td>${getDemoPlayerDni(player, index)}</td>
                <td><span class="player-status ${status.toLowerCase().replace(/\s+/g, "-")}">${status}</span></td>
                <td>${player.number}</td>
                <td>${renderObservationNotificationSummary(playerWithTeam)}</td>
                <td>
                  <div class="table-actions">
                    ${player.active === false
                      ? `<button type="button" aria-label="Reactivar ${player.name}" data-delegate-player-activate="${escapeHtml(player.id)}" ${disabledAttribute}><i class="bi bi-arrow-counterclockwise"></i></button>`
                      : `
                        <button type="button" aria-label="Editar ${player.name}" data-delegate-player-edit="${escapeHtml(player.id)}" ${disabledAttribute}><i class="bi bi-pencil-fill"></i></button>
                        <button type="button" aria-label="Dar de baja ${player.name}" data-delegate-player-deactivate="${escapeHtml(player.id)}" ${disabledAttribute}><i class="bi bi-trash-fill"></i></button>
                      `}
                  </div>
                </td>
              </tr>
            `;
            }).join("") : `
              <tr>
                <td colspan="8" class="admin-empty-row">${includeInactive ? "No hay jugadores dados de baja." : "No hay jugadores activos cargados."}</td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </section>
    <div class="admin-category-footer-actions">
      <button class="btn btn-ingreso admin-view-inactive-btn" type="button" data-delegate-players-toggle-bajas="${includeInactive ? "false" : "true"}">
        <i class="bi ${includeInactive ? "bi-eye-slash-fill" : "bi-eye-fill"}"></i>
        ${includeInactive ? "Ocultar bajas" : "Ver bajas"}
      </button>
    </div>
  `;
}

function getObserverMatch(matchId) {
  return observerMatches.find((match) => match.id === matchId) || matchDetailsById.get(String(matchId || ""));
}

function parseDisplayDate(dateText) {
  const [day, month, year] = dateText.split("/").map(Number);
  return new Date(year, month - 1, day);
}

function normalizeDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isFutureMatchDate(dateText) {
  return parseDisplayDate(dateText) > normalizeDateOnly(new Date());
}

function getObserverAvailableDates() {
  return [...new Set(observerMatches.map((match) => match.date))]
    .sort((first, second) => parseDisplayDate(second) - parseDisplayDate(first));
}

function getDefaultObserverDate() {
  const today = normalizeDateOnly(new Date());
  const availableDates = getObserverAvailableDates();
  return availableDates.find((date) => parseDisplayDate(date) <= today) || availableDates[0] || "";
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

async function loadObserverDataFromSupabase() {
  if (typeof supabaseClient === "undefined") {
    observerMatches = [];
    return;
  }

  let equiposQuery = supabaseClient
      .from("equipos")
      .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo,jugadores(id,nombre,apellido,dni,fecha_nacimiento,dorsal,activo)")
      .eq("activo", true)
      .order("dorsal", { referencedTable: "jugadores", ascending: true })
      .order("nombre", { ascending: true });

  const [{ data: equiposBase, error: equiposBaseError }, { data: partidos, error: partidosError }] = await Promise.all([
    equiposQuery,
    supabaseClient
      .from("partidos")
      .select("id,division_id,equipo_local_id,equipo_visitante_id,fecha_hora,cancha,goles_local,goles_visitante,estado,observaciones")
      .order("fecha_hora", { ascending: true })
  ]);

  let equipos = equiposBase;
  let equiposError = equiposBaseError;
  if (equiposError) {
    console.warn("No se pudo cargar equipos extendidos para veedor. Se usa lectura base.", equiposError);
    const fallback = await supabaseClient
      .from("equipos")
      .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo,jugadores(id,nombre,apellido,dni,fecha_nacimiento,dorsal,activo)")
      .eq("activo", true)
      .order("dorsal", { referencedTable: "jugadores", ascending: true })
      .order("nombre", { ascending: true });
    equipos = fallback.data;
    equiposError = fallback.error;
  }

  if (equiposError) throw equiposError;
  if (partidosError) throw partidosError;

  rememberMatchDetails(partidos || []);
  const matchIncidences = await loadMatchIncidences((partidos || []).map((match) => match.id).filter(Boolean));
  teams = (equipos || []).map(normalizeSupabaseTeam);
  applyPlayerStatsToTeams(teams, matchIncidences);
  observerMatches = (partidos || []).map((match, index) => {
    const normalized = normalizeSupabaseMatch(match, index);
    const date = match.fecha_hora ? new Date(match.fecha_hora) : null;
    return {
      id: normalized.id,
      date: date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("es-AR") : "Sin fecha",
      fixtureDate: `Fecha ${normalized.dateNumber}`,
      home: normalized.home,
      away: normalized.away,
      homeGoals: normalized.homeGoals,
      awayGoals: normalized.awayGoals,
      reporter: currentAppUser?.nombre || "Veedor"
    };
  });
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
  return getActivePlayers(team).map((player) => {
    const status = getPlayerStatus(player);
    const currentStats = getPlayerMatchIncidence(player, matchId);
    const hasCurrentMatchRecord = currentStats.goals > 0 || currentStats.yellow > 0 || currentStats.red > 0 || currentStats.observation;
    const isDisabledPlayer = status !== "Habilitado" && !hasCurrentMatchRecord;
    const disabledAttribute = isDisabledPlayer ? "disabled" : "";
    const observationKey = getPlayerObservationKey(matchId, team.id, player);
    const currentObservation = playerObservations[observationKey] || currentStats.observation || "";

    return `
    <tr class="${isDisabledPlayer ? "observer-player-disabled" : ""}" data-observer-player-row data-player-id="${escapeHtml(player.id || "")}" data-team-id="${escapeHtml(team.id)}" data-observation-key="${escapeHtml(observationKey)}">
      <td>${player.name}</td>
      <td>${escapeHtml(player.dni || "-")}</td>
      <td>${player.number}</td>
      <td><span class="player-status ${status.toLowerCase()}">${status}</span></td>
      <td>
        <div class="event-actions">
          <button class="event-btn player-of-match" type="button" aria-label="Jugador del partido" ${disabledAttribute}>
            <i class="bi bi-star-fill"></i>
          </button>
          <button class="event-btn yellow-card ${currentStats.yellow > 0 ? "is-selected" : ""}" type="button" aria-label="Tarjeta amarilla" ${disabledAttribute}>
            <i class="bi bi-square-fill"></i>
          </button>
          <button class="event-btn red-card ${currentStats.red > 0 ? "is-selected" : ""}" type="button" aria-label="Tarjeta roja" ${disabledAttribute}>
            <i class="bi bi-square-fill"></i>
          </button>
        </div>
      </td>
      <td>
        <div class="goal-counter">
          <button type="button" data-goal-dec aria-label="Restar gol" ${disabledAttribute}><i class="bi bi-dash-lg"></i></button>
          <span><img src="assets/soccer-ball.svg" alt="" class="goal-ball-icon"></span>
          <strong data-goal-value>${currentStats.goals}</strong>
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
              <th>DNI</th>
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
      <button class="btn btn-outline-light admin-secondary-btn observer-sheet-btn" type="button" data-observer-download-sheet="${escapeHtml(match.id)}">
        <i class="bi bi-file-earmark-pdf-fill"></i>
        Descargar planilla
      </button>
      <button class="btn btn-ingreso observer-save-btn" type="button" data-observer-save="${escapeHtml(match.id)}">
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

function collectObserverMatchIncidences() {
  return [...contentShell.querySelectorAll("[data-observer-player-row]")]
    .map((row) => {
      const observationKey = row.dataset.observationKey || "";
      const observationButton = row.querySelector("[data-observation]");
      const observationText = playerObservations[observationKey]
        || observationButton?.dataset.observationText
        || "";

      return {
        jugador_id: row.dataset.playerId || "",
        equipo_id: row.dataset.teamId || "",
        goles: Math.max(Number(row.querySelector("[data-goal-value]")?.textContent) || 0, 0),
        amarillas: row.querySelector(".yellow-card.is-selected") ? 1 : 0,
        rojas: row.querySelector(".red-card.is-selected") ? 1 : 0,
        observacion: String(observationText || "").trim()
      };
    })
    .filter((item) => item.jugador_id && item.equipo_id);
}

function getObserverScoreValue(key) {
  return Math.max(Number(contentShell.querySelector(`[data-score-value="${key}"]`)?.textContent) || 0, 0);
}

async function saveObserverMatchDetailsToSupabase(matchId) {
  if (typeof supabaseClient === "undefined") {
    throw new Error("Supabase no está disponible.");
  }

  if (!observerSettingsSession?.usuario || !observerSettingsSession?.password) {
    throw new Error("La sesión del veedor no está disponible. Cerrá sesión e ingresá nuevamente.");
  }

  const { error } = await supabaseClient.rpc("guardar_detalle_partido_veedor", {
    p_usuario: observerSettingsSession.usuario,
    p_password: observerSettingsSession.password,
    p_partido_id: matchId,
    p_goles_local: getObserverScoreValue("home"),
    p_goles_visitante: getObserverScoreValue("away"),
    p_incidencias: collectObserverMatchIncidences()
  });

  if (error) throw error;

  await loadObserverDataFromSupabase();
  if (activeDivisionId) {
    await loadDivisionDataFromSupabase(activeDivisionId);
  }
}

function renderAdminHome() {
  const metrics = getAdminMetrics();
  const categoryNames = metrics.categories.map((category) => category.name).join(", ") || "Sin categorías";
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
            <small>${escapeHtml(categoryNames)}</small>
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

function renderAiReportMetrics(report) {
  if (!report?.metrics?.length) return "";

  return `
    <section class="quick-stats admin-quick-stats ai-report-metrics" aria-label="Métricas del reporte IA">
      ${report.metrics.map((metric) => `
        <div class="quick-stat">
          <i class="bi bi-activity"></i>
          <div class="quick-stat-content">
            <strong>${escapeHtml(metric.value ?? "-")}</strong>
            <div class="quick-stat-copy">
              <span>${escapeHtml(metric.label || "Métrica")}</span>
              <small>Dato del reporte</small>
            </div>
          </div>
        </div>
      `).join("")}
    </section>
  `;
}

function renderAiReportList(items = [], emptyText = "Sin datos para mostrar.") {
  const visibleItems = items.filter((item) => String(item || "").trim());
  if (!visibleItems.length) {
    return `<p class="ai-report-empty">${escapeHtml(emptyText)}</p>`;
  }

  return `
    <ul class="ai-report-list">
      ${visibleItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderAiReportResult(report) {
  if (!report) {
    return `
      <div class="ai-report-placeholder">
        <i class="bi bi-stars"></i>
        <h3>Generá el primer informe inteligente</h3>
        <p>Frame0 va a leer datos de Supabase y preparar un resumen ejecutivo para la administración del torneo.</p>
      </div>
    `;
  }

  return `
    <article class="ai-report-result" data-ai-report-ready="true">
      <div class="ai-report-header">
        <div>
          <p class="section-kicker mb-1">${escapeHtml(report.source || "Frame0 IA")}</p>
          <h3>${escapeHtml(report.title)}</h3>
          <small>Generado: ${escapeHtml(getAiReportDisplayDate(report))}${report.model ? ` · Modelo: ${escapeHtml(report.model)}` : ""}</small>
        </div>
        <i class="bi bi-robot"></i>
      </div>

      ${report.warning ? `<div class="delegate-edit-window is-closed ai-report-warning"><i class="bi bi-exclamation-triangle-fill"></i> ${escapeHtml(report.warning)}</div>` : ""}

      <p class="ai-report-summary">${escapeHtml(report.summary)}</p>
      ${renderAiReportMetrics(report)}

      <div class="ai-report-grid">
        ${(report.sections || []).map((section) => `
          <section class="ai-report-section">
            <h4>${escapeHtml(section.title || "Sección")}</h4>
            ${renderAiReportList(section.items || [])}
          </section>
        `).join("")}
        <section class="ai-report-section is-alert">
          <h4>Alertas</h4>
          ${renderAiReportList(report.alerts || [])}
        </section>
        <section class="ai-report-section is-recommendation">
          <h4>Recomendaciones</h4>
          ${renderAiReportList(report.recommendations || [])}
        </section>
      </div>
    </article>
  `;
}

function renderAdminAiReportView(report = currentAiReport) {
  const hasReport = Boolean(report);

  return `
    <div class="section-toolbar admin-toolbar">
      <div>
        <p class="section-kicker section-brand mb-1">Frame0</p>
        <div class="ai-title-row">
          <h2 class="section-title mb-0">Reportería IA</h2>
          <span class="ai-thinking-robot" aria-hidden="true">
            <span class="ai-thinking-bubbles">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <i class="bi bi-robot"></i>
            <span class="ai-robot-steps">
              <span></span>
              <span></span>
            </span>
          </span>
        </div>
      </div>
    </div>

    <section class="division-table-panel ai-report-panel">
      <div class="fixture-toolbar delegate-players-toolbar ai-report-toolbar">
        <div class="division-section-heading">
          <p class="section-kicker mb-1">Administrador</p>
          <h2>Resumen ejecutivo del torneo</h2>
        </div>
        <div class="ai-report-actions">
          <button class="btn btn-ingreso" type="button" data-generate-ai-report>
            <i class="bi bi-stars"></i>
            Generar reporte IA
          </button>
          <button class="btn btn-outline-light admin-secondary-btn" type="button" data-download-ai-report ${hasReport ? "" : "disabled"}>
            <i class="bi bi-file-earmark-pdf-fill"></i>
            Descargar PDF
          </button>
        </div>
      </div>

      <div data-ai-report-status></div>
      <div data-ai-report-output>
        ${renderAiReportResult(report)}
      </div>
    </section>
  `;
}

async function loadAdminNews() {
  const { data, error } = await supabaseClient.rpc("listar_diarios_noticias_admin", {
    p_usuario: adminSettingsSession?.usuario || "",
    p_password: adminSettingsSession?.password || ""
  });
  if (error) throw error;
  adminNewsEditions = Array.isArray(data) ? data : [];
}

async function loadCompletedNewsSportsDates() {
  const { data, error } = await supabaseClient
    .from("partidos")
    .select("estado,observaciones,fecha_hora")
    .not("observaciones", "is", null);
  if (error) throw error;

  const rounds = new Map();
  (data || []).forEach((match) => {
    const number = Number(String(match.observaciones || "").match(/fecha\s*(\d+)/i)?.[1]);
    if (!number) return;
    const round = rounds.get(number) || { numero_fecha: number, partidos: 0, finalizados: 0, fechas: [] };
    round.partidos += 1;
    if (match.estado === "finalizado") round.finalizados += 1;
    if (match.fecha_hora) round.fechas.push(new Date(match.fecha_hora));
    rounds.set(number, round);
  });

  adminNewsSportsDates = [...rounds.values()]
    .filter((round) => round.partidos > 0 && round.finalizados === round.partidos && round.fechas.length)
    .map((round) => {
      const timestamps = round.fechas.map((date) => date.getTime()).filter(Number.isFinite);
      const minDate = new Date(Math.min(...timestamps));
      const maxDate = new Date(Math.max(...timestamps));
      return {
        numero_fecha: round.numero_fecha,
        fecha_desde: minDate.toISOString().slice(0, 10),
        fecha_hasta: maxDate.toISOString().slice(0, 10),
        fecha_edicion: maxDate.toISOString().slice(0, 10),
        partidos: round.finalizados
      };
    })
    .sort((a, b) => b.numero_fecha - a.numero_fecha);
}

function getNewNewsPages() {
  return tournamentCatalog.flatMap((category) => category.divisions.map((division) => ({
    categoria_id: category.id,
    division_id: division.id,
    titulo: `${category.name} - ${division.name}`,
    resumen_general: "",
    contenido_texto: "",
    contenido_json: { bloques: [] },
    tabla_posiciones_snapshot: [],
    categoria: { id: category.id, nombre: category.name },
    division: { id: division.id, nombre: division.name }
  }))).map((page, index) => ({ ...page, numero_pagina: index + 1 }));
}

function getEditingNewsEdition() {
  return adminNewsDraft;
}

function syncAdminNewsDraftFromForm() {
  if (!adminNewsDraft) return;
  contentShell.querySelectorAll("[data-news-field]").forEach((field) => {
    const key = field.dataset.newsField;
    if (key === "numero_fecha") {
      const selected = adminNewsSportsDates.find((item) => String(item.numero_fecha) === String(field.value));
      adminNewsDraft.fecha = selected ? { ...adminNewsDraft.fecha, ...selected } : {};
    }
    else adminNewsDraft[key] = field.value;
  });
  const page = adminNewsDraft.paginas?.[editingNewsPageIndex];
  contentShell.querySelectorAll("[data-news-page-field]").forEach((field) => {
    if (!page) return;
    if (field.dataset.newsPageField === "contenido_json") {
      try { page.contenido_json = JSON.parse(field.value || "{}"); } catch (_error) { throw new Error("El JSON de segmentos no es válido."); }
      return;
    }
    page[field.dataset.newsPageField] = field.value;
  });
}

async function saveAdminNewsDraft() {
  syncAdminNewsDraftFromForm();
  if (!adminNewsDraft?.titulo?.trim()) throw new Error("El título es obligatorio.");
  if (!adminNewsDraft.fecha?.numero_fecha || !adminNewsDraft.fecha?.fecha_desde || !adminNewsDraft.fecha?.fecha_hasta || !adminNewsDraft.fecha?.fecha_edicion) {
    throw new Error("Seleccioná una fecha deportiva realizada.");
  }
  const estado = adminNewsDraft.estado === "publicado" ? "publicado" : "borrador";
  const editionPayload = {
    ...adminNewsDraft.fecha,
    id: adminNewsDraft.id || "",
    titulo: adminNewsDraft.titulo,
    slogan: adminNewsDraft.slogan,
    estado,
    generado_por_ia: adminNewsDraft.generado_por_ia === true
  };
  console.log("Diario Noticias - guardado:", { ...editionPayload, paginas: adminNewsDraft.paginas.length });
  const { data, error } = await supabaseClient.rpc("guardar_diario_noticias", {
    p_usuario: adminSettingsSession?.usuario || "",
    p_password: adminSettingsSession?.password || "",
    p_edicion: editionPayload,
    p_paginas: adminNewsDraft.paginas
  });
  if (error) {
    console.error("Diario Noticias - error al guardar:", error);
    throw new Error(error.message || "No se pudo guardar el diario.");
  }
  adminNewsDraft.estado = estado;
  adminNewsDraft.id = String(data || adminNewsDraft.id || "");
  return data;
}

async function publishAdminNewsDraft() {
  const editionId = await saveAdminNewsDraft();
  const { error } = await supabaseClient.rpc("publicar_diario_noticias", {
    p_usuario: adminSettingsSession?.usuario || "",
    p_password: adminSettingsSession?.password || "",
    p_edicion_id: editionId
  });
  if (error) throw new Error(error.message || "No se pudo publicar el diario.");
}

async function saveAdminNewsAndCloseEditor() {
  await saveAdminNewsDraft();
  await loadAdminNews();
  editingNewsEditionId = "";
  adminNewsDraft = null;
  contentShell.innerHTML = renderAdminNewsView();
}

async function generateAdminNewsDraft() {
  syncAdminNewsDraftFromForm();
  if (!adminNewsDraft.fecha?.numero_fecha) throw new Error("Seleccioná una fecha deportiva realizada.");
  const payload = {
    usuario: adminSettingsSession?.usuario || "",
    password: adminSettingsSession?.password || "",
    numero_fecha: adminNewsDraft.fecha.numero_fecha
  };
  console.log("Payload enviado a generate-sports-diary:", { ...payload, password: "[oculta]" });
  const { data, error } = await supabaseClient.functions.invoke("generate-sports-diary", {
    body: payload
  });
  console.log("Respuesta Edge Function:", data);
  if (error) {
    console.error("Error completo Edge Function:", error);
    let message = data?.error || "";
    try {
      const errorBody = await error.context?.json?.();
      message = errorBody?.error || message;
    } catch (_contextError) {
      // La respuesta no siempre expone un body JSON (por ejemplo, rechazo JWT del gateway).
    }
    if (!message && error.context?.status === 401) message = "No se pudo autorizar la generación IA. Redesplegá la función con --no-verify-jwt.";
    throw new Error(message || "La IA no pudo generar el diario. Revisá los logs de la función en Supabase.");
  }
  if (data?.success !== true) throw new Error(data?.error || "La función no devolvió un diario válido.");
  adminNewsDraft = {
    ...adminNewsDraft,
    ...(data.edicion || {}),
    id: adminNewsDraft.id || "",
    fecha: data.edicion?.fecha || adminNewsDraft.fecha,
    paginas: Array.isArray(data.paginas) ? data.paginas : [],
    estado: "borrador",
    generado_por_ia: true
  };
}

function renderAdminNewsEditor(edition) {
  if (!edition) return "";
  const pages = edition.paginas || [];
  const page = pages[editingNewsPageIndex] || pages[0];
  return `
    <section class="division-table-panel news-admin-editor" data-news-editing-id="${escapeHtml(edition.id || "")}">
      <div class="division-section-heading"><p class="section-kicker mb-1">Edición</p><h2>${edition.id ? "Editar diario" : "Nuevo borrador"}</h2></div>
      <div data-admin-news-generation-status>${edition.generado_por_ia ? `<div class="delegate-edit-window is-open"><i class="bi bi-stars"></i> Borrador generado por IA. Revisalo antes de publicar.</div>` : ""}</div>
      <div class="admin-filter-grid settings-grid">
        <label class="admin-filter-field settings-wide"><span>Fecha deportiva realizada</span><select class="form-select" data-news-field="numero_fecha" required><option value="">Seleccionar fecha</option>${adminNewsSportsDates.map((item) => `<option value="${item.numero_fecha}" ${String(item.numero_fecha) === String(edition.fecha?.numero_fecha) ? "selected" : ""}>Fecha ${item.numero_fecha} · ${item.partidos} partidos finalizados</option>`).join("")}</select><small>El diario incluirá automáticamente todos los partidos de la fecha elegida.</small></label>
        <label class="admin-filter-field settings-wide"><span>Título</span><input class="form-control" type="text" maxlength="150" value="${escapeHtml(edition.titulo || "")}" data-news-field="titulo" required></label>
        <label class="admin-filter-field settings-wide"><span>Slogan</span><input class="form-control" type="text" maxlength="200" value="${escapeHtml(edition.slogan || "")}" data-news-field="slogan"></label>
        <label class="admin-filter-field"><span>Estado</span><input class="form-control" type="text" value="${escapeHtml(edition.estado || "borrador")}" readonly></label>
      </div>
      <div class="news-admin-tabs">${pages.map((item, index) => `<button type="button" data-admin-news-page-tab="${index}" class="${index === editingNewsPageIndex ? "active" : ""}">${escapeHtml(item.categoria?.nombre || "Categoría")} · ${escapeHtml(item.division?.nombre || "División")}</button>`).join("")}</div>
      ${page ? `<div class="news-page-editor" data-news-page-index="${editingNewsPageIndex}">
        <label class="admin-filter-field"><span>Título de página</span><input class="form-control" type="text" value="${escapeHtml(page.titulo || "")}" data-news-page-field="titulo"></label>
        <label class="admin-filter-field"><span>Resumen general</span><textarea class="form-control" rows="4" data-news-page-field="resumen_general">${escapeHtml(page.resumen_general || "")}</textarea></label>
        <label class="admin-filter-field"><span>Contenido editorial</span><textarea class="form-control" rows="8" data-news-page-field="contenido_texto">${escapeHtml(page.contenido_texto || "")}</textarea></label>
        <label class="admin-filter-field"><span>Segmentos destacados (JSON)</span><textarea class="form-control" rows="8" data-news-page-field="contenido_json">${escapeHtml(JSON.stringify(page.contenido_json || { bloques: [] }, null, 2))}</textarea></label>
      </div>` : `<div class="admin-empty-row">No hay páginas disponibles. Cargá categorías y divisiones activas antes de crear el diario.</div>`}
      <div class="news-admin-actions">
        <button class="btn btn-outline-light admin-secondary-btn" type="button" data-admin-news-cancel>Cancelar</button>
        <button class="btn btn-outline-light admin-secondary-btn" type="button" data-admin-news-generate><i class="bi bi-stars"></i> Generar con IA</button>
        <button class="btn btn-outline-light admin-secondary-btn" type="button" data-admin-news-save ${pages.length ? "" : "disabled"}><i class="bi bi-save-fill"></i> ${edition.estado === "publicado" ? "Guardar cambios" : "Guardar borrador"}</button>
        ${edition.estado !== "publicado" ? `<button class="btn btn-ingreso" type="button" data-admin-news-publish ${pages.length ? "" : "disabled"}><i class="bi bi-megaphone-fill"></i> Publicar en landing</button>` : ""}
      </div>
    </section>
  `;
}

function renderAdminNewsView() {
  const editingEdition = getEditingNewsEdition();
  return `
    <div class="section-toolbar admin-toolbar"><div><p class="section-kicker section-brand mb-1">Frame0</p><h2 class="section-title mb-0">Diario Noticias</h2></div>
      <button class="btn btn-ingreso" type="button" data-admin-news-new><i class="bi bi-plus-lg"></i> Nuevo diario</button>
    </div>
    <section class="division-table-panel">
      <div class="table-responsive"><table class="table frame-table mb-0"><thead><tr><th>Fecha deportiva</th><th>Edición</th><th>Título</th><th>Slogan</th><th>Estado</th><th>IA</th><th>Publicación</th><th>Acciones</th></tr></thead>
      <tbody>${adminNewsEditions.length ? adminNewsEditions.map((item) => `<tr><td>Fecha ${item.fecha?.numero_fecha || "-"}</td><td>${formatNewsDate(item.fecha?.fecha_edicion)}</td><td>${escapeHtml(item.titulo)}</td><td>${escapeHtml(item.slogan || "-")}</td><td><span class="admin-status-pill ${item.estado === "publicado" ? "active" : "inactive"}">${escapeHtml(item.estado)}</span></td><td>${item.generado_por_ia ? "Sí" : "No"}</td><td>${item.fecha_publicacion ? new Date(item.fecha_publicacion).toLocaleDateString("es-AR") : "-"}</td><td><div class="table-actions"><button type="button" data-admin-news-edit="${item.id}" aria-label="Editar diario Fecha ${item.fecha?.numero_fecha}"><i class="bi bi-pencil-fill"></i></button>${item.estado !== "baja" ? `<button type="button" data-admin-news-deactivate="${item.id}" aria-label="Dar de baja diario Fecha ${item.fecha?.numero_fecha}"><i class="bi bi-trash-fill"></i></button>` : ""}</div></td></tr>`).join("") : `<tr><td colspan="8" class="admin-empty-row">No hay diarios generados.</td></tr>`}</tbody></table></div>
    </section>
    ${renderAdminNewsEditor(editingEdition)}
  `;
}

function renderAiReportPrintDocument(report) {
  const safeReport = normalizeAiReport(report);

  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(safeReport.title)}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          * { box-sizing: border-box; }
          body { margin: 0; font-family: Arial, sans-serif; color: #111827; }
          h1 { margin: 0; color: #0b4fe8; font-size: 24px; }
          h2 { margin: 18px 0 8px; font-size: 15px; color: #0f2742; }
          p { line-height: 1.45; }
          .meta { margin: 7px 0 14px; color: #475569; font-size: 11px; }
          .summary { border: 1px solid #cbd5e1; border-radius: 8px; background: #f8fbff; padding: 12px; }
          .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 14px 0; }
          .metric { border: 1px solid #dbe7f3; border-radius: 6px; padding: 8px; }
          .metric strong { display: block; color: #0b4fe8; font-size: 18px; }
          ul { margin-top: 6px; padding-left: 18px; }
          li { margin-bottom: 5px; }
          footer { margin-top: 22px; border-top: 1px solid #cbd5e1; padding-top: 8px; color: #64748b; font-size: 10px; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(safeReport.title)}</h1>
        <div class="meta">
          Generado: ${escapeHtml(getAiReportDisplayDate(safeReport))} · Fuente: ${escapeHtml(safeReport.source || "Frame0 IA")}${safeReport.model ? ` · Modelo: ${escapeHtml(safeReport.model)}` : ""}
        </div>
        <p class="summary">${escapeHtml(safeReport.summary)}</p>
        ${safeReport.metrics?.length ? `
          <div class="metrics">
            ${safeReport.metrics.map((metric) => `
              <div class="metric">
                <strong>${escapeHtml(metric.value ?? "-")}</strong>
                <span>${escapeHtml(metric.label || "Métrica")}</span>
              </div>
            `).join("")}
          </div>
        ` : ""}
        ${(safeReport.sections || []).map((section) => `
          <h2>${escapeHtml(section.title || "Sección")}</h2>
          ${renderAiReportList(section.items || [])}
        `).join("")}
        <h2>Alertas</h2>
        ${renderAiReportList(safeReport.alerts || [])}
        <h2>Recomendaciones</h2>
        ${renderAiReportList(safeReport.recommendations || [])}
        <footer>${AI_REPORT_PDF_FOOTER}</footer>
        <script>window.setTimeout(() => window.print(), 250);</script>
      </body>
    </html>
  `;
}

async function requestAiReportFromEdgeFunction() {
  if (typeof supabaseClient === "undefined" || !supabaseClient.functions?.invoke) {
    throw new Error("Las funciones de Supabase no están disponibles.");
  }

  if (!adminSettingsSession?.usuario || !adminSettingsSession?.password) {
    throw new Error("La sesión del administrador no está disponible. Cerrá sesión e ingresá nuevamente.");
  }

  const { data, error } = await supabaseClient.functions.invoke("generate-ai-report", {
    body: {
      usuario: adminSettingsSession.usuario,
      password: adminSettingsSession.password,
      tipo: "resumen_torneo"
    }
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return normalizeAiReport(data?.report || data);
}

function getAiReportFallbackWarning(error) {
  const rawMessage = error?.message || String(error || "error desconocido");
  const normalizedMessage = normalizeSearchText(rawMessage);

  if (
    normalizedMessage.includes("failed to send")
    || normalizedMessage.includes("failed to fetch")
    || normalizedMessage.includes("edge function")
    || normalizedMessage.includes("functionsfetcherror")
  ) {
    return "No se pudo conectar con la Edge Function generate-ai-report. Verificá que esté desplegada en Supabase y que los secretos GROQ_API_KEY, GROQ_MODEL y SUPABASE_SERVICE_ROLE_KEY estén configurados. Mientras tanto se generó un reporte básico por reglas locales.";
  }

  if (normalizedMessage.includes("groq") || normalizedMessage.includes("api_key") || normalizedMessage.includes("rate") || normalizedMessage.includes("limit")) {
    return `La Edge Function respondió, pero Groq no pudo generar el reporte (${rawMessage}). Se generó un reporte básico por reglas locales.`;
  }

  return `No se pudo usar la reportería IA (${rawMessage}). Se generó un reporte básico por reglas locales.`;
}

async function generateAiReportForAdmin() {
  try {
    return await requestAiReportFromEdgeFunction();
  } catch (error) {
    console.warn("No se pudo generar el reporte con Groq. Se usa fallback local.", error);
    return generateLocalAiReportFallback(getAiReportFallbackWarning(error));
  }
}

function updateAiReportView(report) {
  currentAiReport = normalizeAiReport(report);
  const output = contentShell.querySelector("[data-ai-report-output]");
  const downloadButton = contentShell.querySelector("[data-download-ai-report]");
  const status = contentShell.querySelector("[data-ai-report-status]");

  if (output) output.innerHTML = renderAiReportResult(currentAiReport);
  if (downloadButton) downloadButton.disabled = false;
  if (status) status.innerHTML = "";
}

function downloadCurrentAiReportPdf() {
  if (!currentAiReport) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("El navegador bloqueó la ventana de descarga. Permití ventanas emergentes para generar el PDF.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(renderAiReportPrintDocument(currentAiReport));
  printWindow.document.close();
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
      ? fixture.cups.map((cup) => `${cup.name}: ${cup.range}`).join(" ? ")
      : fixture
        ? "Fixture generado sin playoff"
        : "Sin fixture generado";
    const playoffOptions = [2, 4, 8, 16, 32].map((option) => `
      <option value="${option}" ${Number(row.config.playoffTeams) === option ? "selected" : ""} ${option > row.teams ? "disabled" : ""}>${option}</option>
    `).join("");
    const matchDayOptions = MATCH_DAY_OPTIONS.map((option) => `
      <option value="${option.value}" ${String(row.config.matchDay || DEFAULT_FIXTURE_MATCH_DAY) === option.value ? "selected" : ""}>${option.label}</option>
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
          <select class="form-select form-select-sm tournament-number-input" data-tournament-match-day="${escapeHtml(key)}" aria-label="Día de juego de ${row.division}">
            ${matchDayOptions}
          </select>
        </td>
        <td>
          <input class="form-control form-control-sm tournament-number-input" type="date" value="${escapeHtml(row.config.startDate || DEFAULT_FIXTURE_START_DATE)}" data-tournament-start-date="${escapeHtml(key)}" aria-label="Fecha de inicio de ${row.division}">
        </td>
        <td>
          <div class="playoff-config">
            <label class="form-check form-switch m-0">
              <input class="form-check-input" type="checkbox" ${row.config.playoffEnabled ? "checked" : ""} data-tournament-playoff="${escapeHtml(key)}">
            </label>
            <select class="form-select form-select-sm tournament-number-input tournament-playoff-select" ${row.config.playoffEnabled ? "" : "disabled"} data-tournament-playoff-teams="${escapeHtml(key)}" aria-label="Cantidad de equipos playoff de ${row.division}">
              ${playoffOptions}
            </select>
          </div>
        </td>
        <td>
          <div class="tournament-actions">
            <button class="table-action-btn" type="button" data-generate-fixture="${escapeHtml(key)}" aria-label="Generar fixture ${row.division}" title="Generar fixture">
              <i class="bi bi-shuffle"></i>
            </button>
            <button class="table-action-btn" type="button" data-download-fixture="${escapeHtml(key)}" ${fixture ? "" : "disabled"} aria-label="Descargar fixture ${row.division}" title="Descargar fixture">
              <i class="bi bi-file-earmark-pdf-fill"></i>
            </button>
          </div>
          <small class="fixture-generated-state">${fixture ? `Generado ${fixture.generatedAt} · Primera fecha ${fixture.firstMatchDate || row.config.startDate}` : "Pendiente"}</small>
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
                <th>Día</th>
                <th>Inicio</th>
                <th>Playoff</th>
                <th>Fixture</th>
                <th>Resumen</th>
              </tr>
            </thead>
            <tbody data-tournament-general-rows>${renderTournamentGeneralRows()}</tbody>
          </table>
        </div>
      </div>
      <button class="btn btn-ingreso settings-save-btn" type="button" data-save-tournament-settings>
        <i class="bi bi-save-fill"></i>
        Guardar generales torneo
      </button>
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
          <button class="nav-link" data-bs-toggle="pill" data-bs-target="#settings-social" type="button" role="tab">Public Page</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" data-bs-toggle="pill" data-bs-target="#settings-sponsors" type="button" role="tab">Auspiciantes</button>
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
              <label class="admin-filter-field settings-wide">
                <span>Link de Drive para fotos</span>
                <input class="form-control" type="url" value="${escapeHtml(publicSettings.drivePhotosLink)}" placeholder="https://drive.google.com/drive/folders/..." data-setting="drivePhotosLink">
              </label>
              <label class="admin-filter-field settings-wide">
                <span>Información del torneo</span>
                <textarea class="form-control" rows="3" data-setting="tournamentInfoText">${escapeHtml(publicSettings.tournamentInfoText)}</textarea>
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
              Guardar Public Page
            </button>
          </form>
        </div>

        <div class="tab-pane fade" id="settings-sponsors" role="tabpanel" tabindex="0">
          <form class="settings-form sponsor-settings-form">
            <div class="division-section-heading sponsor-section-heading">
              <p class="section-kicker mb-1">Banner automático</p>
              <h2>Auspiciantes</h2>
            </div>

            <label class="admin-filter-field sponsor-upload-field">
              <span>Imágenes de auspiciantes <strong data-sponsor-count>${publicSettings.sponsorImages.length}/${MAX_SPONSOR_IMAGES}</strong></span>
              <input class="form-control" type="file" accept="image/*,.svg" multiple data-sponsor-upload ${publicSettings.sponsorImages.length >= MAX_SPONSOR_IMAGES ? "disabled" : ""}>
            </label>

            <div class="sponsor-admin-grid" data-sponsor-preview>
              ${renderSponsorAdminImages()}
            </div>

            <div class="sponsor-section-divider" aria-hidden="true"></div>

            <div class="division-section-heading sponsor-section-heading">
              <p class="section-kicker mb-1">Imágenes destacadas</p>
              <h2>Carrusel principal de la home</h2>
            </div>

            <label class="admin-filter-field sponsor-upload-field">
              <span>Imágenes del carrusel <strong data-home-carousel-count>${publicSettings.homeCarouselImages.length}/${MAX_HOME_CAROUSEL_IMAGES}</strong></span>
              <input class="form-control" type="file" accept="image/*,.svg" multiple data-home-carousel-upload ${publicSettings.homeCarouselImages.length >= MAX_HOME_CAROUSEL_IMAGES ? "disabled" : ""}>
              <small class="form-helper-text">Para una correcta visualización, usá imágenes horizontales de ${HOME_CAROUSEL_RECOMMENDED_SIZE}. Si la imagen es más grande, se ajustará automáticamente; si tiene otra proporción, puede recortarse para no deformar el carrusel.</small>
            </label>

            <div class="sponsor-admin-grid" data-home-carousel-preview>
              ${renderHomeCarouselAdminImages()}
            </div>

            <div class="sponsor-section-divider" aria-hidden="true"></div>

            <div class="division-section-heading sponsor-section-heading">
              <p class="section-kicker mb-1">Emergente de bienvenida</p>
              <h2>Video de ingreso</h2>
            </div>

            <label class="admin-filter-field sponsor-upload-field">
              <span>Reemplazar video</span>
              <input class="form-control" type="file" accept="video/mp4,video/webm,video/ogg" data-landing-video-upload>
              <small class="form-helper-text">Formatos MP4, WebM u OGG. Tamaño máximo: 10 MB.</small>
            </label>

            <div data-landing-video-preview>
              ${renderLandingVideoAdminPreview()}
            </div>

            <button class="btn btn-ingreso settings-save-btn" type="button" data-save-public-settings>
              <i class="bi bi-save-fill"></i>
              Guardar auspiciantes y video
            </button>
          </form>
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

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
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
  return [...adminTeamsForView].sort((a, b) => a.shortName.localeCompare(b.shortName));
}

function getAdminFilteredTeams(searchTerm = "") {
  const normalizedSearch = normalizeSearchText(searchTerm);
  return adminTeamsForView.filter((team) =>
    team.shortName.toLowerCase().includes(normalizedSearch) ||
    team.name.toLowerCase().includes(normalizedSearch)
  );
}

function getDivisionIdFromCatalog(categoryName = "", divisionName = "") {
  const normalizedCategory = normalizeSearchText(categoryName);
  const normalizedDivision = normalizeSearchText(divisionName);
  const category = tournamentCatalog.find((item) => normalizeSearchText(item.name) === normalizedCategory);
  const division = category?.divisions.find((item) => normalizeSearchText(item.name) === normalizedDivision);
  return division?.id || "";
}

async function loadAdminTeamsForFilters(selectedCategory = "", selectedDivision = "") {
  adminTeamsForView = [];
  const divisionId = getDivisionIdFromCatalog(selectedCategory, selectedDivision);
  if (!divisionId || typeof supabaseClient === "undefined") return;

  let { data, error } = await supabaseClient
    .from("equipos")
    .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo,jugadores(id,nombre,apellido,dni,fecha_nacimiento,dorsal,activo)")
    .eq("division_id", divisionId)
    .eq("activo", true)
    .order("dorsal", { referencedTable: "jugadores", ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    console.warn("No se pudo leer el perfil extendido de equipos. Se usa lectura base.", error);
    const fallback = await supabaseClient
      .from("equipos")
      .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo,jugadores(id,nombre,apellido,dni,fecha_nacimiento,dorsal,activo)")
      .eq("division_id", divisionId)
      .eq("activo", true)
      .order("dorsal", { referencedTable: "jugadores", ascending: true })
      .order("nombre", { ascending: true });

    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;
  adminTeamsForView = (data || []).map(normalizeSupabaseTeam);
  const { data: partidos, error: partidosError } = await supabaseClient
    .from("partidos")
    .select("id,division_id,equipo_local_id,equipo_visitante_id,fecha_hora,cancha,goles_local,goles_visitante,estado,observaciones")
    .eq("division_id", divisionId);

  if (partidosError) throw partidosError;
  rememberMatchDetails(partidos || []);
  const matchIncidences = await loadMatchIncidences((partidos || []).map((match) => match.id).filter(Boolean));
  applyPlayerStatsToTeams(adminTeamsForView, matchIncidences);
  console.log("delegados filtros:", {
    selectedCategory,
    selectedDivision,
    divisionId,
    equipos: adminTeamsForView.length
  });
}

async function applyDelegateUsersFallback(includeInactive = false, fallbackToUsername = true) {
  if (!fallbackToUsername) {
    adminTeamsForView = adminTeamsForView.map((team) => ({
      ...team,
      delegateRelationId: "",
      delegateId: "",
      delegate: "-",
      delegateFirstName: "",
      delegateLastName: "",
      delegateDocument: "",
      contact: "-",
      delegateUsername: "-"
    }));
    return;
  }

  const { data: users, error } = await supabaseClient
    .from("usuarios_app")
    .select("id,nombre,apellido,documento,contacto,usuario,rol,activo")
    .eq("rol", "delegado")
    .eq("activo", !includeInactive);

  if (error) throw error;

  adminTeamsForView = adminTeamsForView.map((team) => {
    const user = (users || []).find((delegateUser) => {
      const normalizedUsername = normalizeSearchText(delegateUser.usuario || "");
      return normalizedUsername && (
        normalizeSearchText(team.name).includes(normalizedUsername) ||
        normalizeSearchText(team.shortName).includes(normalizedUsername) ||
        normalizeSearchText(team.legalName).includes(normalizedUsername)
      );
    });

    return {
      ...team,
      delegateRelationId: "",
      delegateId: user?.id || "",
      delegate: user ? `${user.nombre || ""} ${user.apellido || ""}`.trim() || user.usuario : "-",
      delegateFirstName: user?.nombre || "",
      delegateLastName: user?.apellido || "",
      delegateDocument: user?.documento || "",
      contact: user?.contacto || "-",
      delegateUsername: user?.usuario || "-"
    };
  });
}

async function loadAdminDelegatesForFilters(selectedCategory = "", selectedDivision = "", options = {}) {
  const includeInactive = options.includeInactive ?? adminDelegatesState.includeInactive;
  const fallbackToUsername = options.fallbackToUsername ?? true;

  await loadAdminTeamsForFilters(selectedCategory, selectedDivision);
  const teamIds = adminTeamsForView.map((team) => team.id).filter(Boolean);

  if (!teamIds.length) return;

  let query = supabaseClient
    .from("delegados")
    .select("id,usuario_id,equipo_id,activo,usuario:usuarios_app(id,nombre,apellido,documento,contacto,usuario,rol,activo)")
    .in("equipo_id", teamIds);

  if (!includeInactive) {
    query = query.eq("activo", true);
  }
  const { data, error } = await query;

  if (error) {
    console.warn("No se pudo leer delegados por relacion. Se usa busqueda por usuario.", error);
    await applyDelegateUsersFallback(includeInactive, fallbackToUsername);
    return;
  }

  console.log("delegados por relacion:", { relaciones: (data || []).length, equipos: teamIds.length });

  if (!(data || []).length) {
    console.warn("No hay relaciones activas en delegados para estos equipos. Se usa busqueda por usuario.");
    await applyDelegateUsersFallback(includeInactive, fallbackToUsername);
    return;
  }

  const delegatesByTeam = (data || []).reduce((map, row) => {
    const user = row.usuario;
    if (!user || user.rol !== "delegado") return map;
    const shouldShow = includeInactive
      ? user.activo === false || row.activo === false
      : user.activo !== false && row.activo !== false;
    if (!shouldShow) return map;
    map.set(String(row.equipo_id), {
      relationId: row.id,
      user
    });
    return map;
  }, new Map());

  if (!delegatesByTeam.size) {
    console.warn("Las relaciones de delegados llegaron sin perfil de usuario activo. Se usa busqueda por usuario.");
    await applyDelegateUsersFallback(includeInactive, fallbackToUsername);
    return;
  }

  adminTeamsForView = adminTeamsForView.map((team) => {
    const delegate = delegatesByTeam.get(String(team.id));
    const user = delegate?.user;

    return {
      ...team,
      delegateRelationId: delegate?.relationId || "",
      delegateId: user?.id || "",
      delegate: user ? `${user.nombre || ""} ${user.apellido || ""}`.trim() || user.usuario : "-",
      delegateFirstName: user?.nombre || "",
      delegateLastName: user?.apellido || "",
      delegateDocument: user?.documento || "",
      contact: user?.contacto || "-",
      delegateUsername: user?.usuario || "-"
    };
  });
}

async function createTeamInSupabase() {
  const editingId = newTeamForm?.dataset.editingId || "";
  const divisionId = newTeamDivision.value;
  const teamName = newTeamName.value.trim();
  const currentTeam = adminTeamsForView.find((team) => String(team.id) === String(editingId));
  const shortName = newTeamShortName.value.trim() || getShortTeamName(teamName);
  const payload = {
    division_id: divisionId,
    nombre: teamName,
    abreviatura: getInitialsFromName(shortName),
    nombre_corto: shortName,
    descripcion: currentTeam?.description || "",
    escudo_url: currentTeam?.crest || "",
    color_principal: currentTeam?.colors?.[0] || "#64748b",
    color_secundario: currentTeam?.colors?.[1] || "#111827",
    color_terciario: currentTeam?.shirtColors?.[2] || "#ffffff",
    activo: true
  };

  if (editingId) {
    return apiPut(`/equipos/${editingId}`, payload);
  }

  return apiPost("/equipos", payload);
}

async function openAdminTeamModal(teamId = "") {
  if (!newTeamModalElement || !newTeamForm) return;

  if (!tournamentCatalog.length) {
    await cargarMenuCategorias();
  }

  const team = adminTeamsForView.find((item) => String(item.id) === String(teamId));
  const division = tournamentCatalog
    .flatMap((category) => category.divisions.map((item) => ({ ...item, categoryName: category.name })))
    .find((item) => String(item.id) === String(team?.division_id));

  newTeamForm.reset();
  newTeamForm.dataset.editingId = team?.id || "";
  newTeamName.value = team?.name || "";
  newTeamShortName.value = team?.shortName || "";
  populateNewTeamCategories();
  newTeamCategory.value = division?.categoryName || "";
  populateNewTeamDivisions(newTeamCategory.value);
  newTeamDivision.value = team?.division_id || "";

  const title = document.querySelector("#newTeamModalLabel");
  if (title) title.textContent = team ? "Editar equipo" : "Cargar nuevo equipo";
  if (createTeamButton) {
    createTeamButton.innerHTML = `<i class="bi ${team ? "bi-save-fill" : "bi-plus-circle-fill"}"></i> ${team ? "Guardar cambios" : "Crear equipo"}`;
  }

  validateNewTeamForm();
  bootstrap.Modal.getOrCreateInstance(newTeamModalElement).show();
}

async function loadAllActiveTeamsForForms() {
  if (typeof supabaseClient === "undefined") return [];

  let { data, error } = await supabaseClient
    .from("equipos")
    .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo,jugadores(id,nombre,apellido,dni,fecha_nacimiento,dorsal,activo)")
    .eq("activo", true)
    .order("dorsal", { referencedTable: "jugadores", ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    console.warn("No se pudo leer el perfil extendido de equipos para formularios. Se usa lectura base.", error);
    const fallback = await supabaseClient
      .from("equipos")
      .select("id,nombre,division_id,escudo_url,color_principal,color_secundario,color_terciario,abreviatura,nombre_corto,descripcion,activo,jugadores(id,nombre,apellido,dni,fecha_nacimiento,dorsal,activo)")
      .eq("activo", true)
      .order("dorsal", { referencedTable: "jugadores", ascending: true })
      .order("nombre", { ascending: true });

    data = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;
  teams = (data || []).map(normalizeSupabaseTeam);
  return teams;
}

async function createDelegateInSupabase() {
  const editingId = newDelegateForm?.dataset.editingId || "";
  const payload = {
    nombre: newDelegateFirstName.value.trim(),
    apellido: newDelegateLastName.value.trim(),
    documento: newDelegateDocument.value.trim(),
    contacto: newDelegateContact.value.trim(),
    usuario: newDelegateUsername.value.trim(),
    password: newDelegatePassword.value,
    rol: "delegado",
    activo: true
  };

  if (editingId) {
    const updatePayload = {
      nombre: payload.nombre,
      apellido: payload.apellido,
      documento: payload.documento,
      contacto: payload.contacto,
      usuario: payload.usuario,
      rol: "delegado",
      activo: true
    };

    if (payload.password) {
      updatePayload.password_hash = payload.password;
    }

    return apiPut(`/usuarios/${editingId}`, updatePayload);
  }

  return apiPost("/delegados", {
    ...payload,
    equipo_id: newDelegateTeam.value
  });
}

async function getAdminDelegateRowFallback(delegateUserId = "", teamId = "") {
  if (!delegateUserId || typeof supabaseClient === "undefined") return null;

  const { data: user, error } = await supabaseClient
    .from("usuarios_app")
    .select("id,nombre,apellido,documento,contacto,usuario,rol,activo")
    .eq("id", delegateUserId)
    .maybeSingle();

  if (error) throw error;
  if (!user) return null;

  const team = adminTeamsForView.find((item) => String(item.id) === String(teamId))
    || teams.find((item) => String(item.id) === String(teamId))
    || {};

  return {
    ...team,
    id: team.id || teamId,
    delegateId: user.id,
    delegate: `${user.nombre || ""} ${user.apellido || ""}`.trim() || user.usuario,
    delegateFirstName: user.nombre || "",
    delegateLastName: user.apellido || "",
    delegateDocument: user.documento || "",
    contact: user.contacto || "-",
    delegateUsername: user.usuario || "-"
  };
}

async function openAdminDelegateModal(delegateUserId = "", teamId = "") {
  if (!newDelegateModalElement || !newDelegateForm) return;

  await loadAllActiveTeamsForForms();
  const row = adminTeamsForView.find((team) =>
    String(team.delegateId) === String(delegateUserId) ||
    (teamId && String(team.id) === String(teamId))
  ) || await getAdminDelegateRowFallback(delegateUserId, teamId);

  newDelegateForm.reset();
  newDelegateForm.dataset.editingId = row?.delegateId || "";
  newDelegateLastName.value = row?.delegateLastName || "";
  newDelegateFirstName.value = row?.delegateFirstName || "";
  newDelegateDocument.value = row?.delegateDocument || "";
  newDelegateContact.value = row?.contact && row.contact !== "-" ? row.contact : "";
  newDelegateUsername.value = row?.delegateUsername && row.delegateUsername !== "-" ? row.delegateUsername : "";
  newDelegatePassword.value = row ? "" : "123456";
  newDelegatePassword.required = !row;
  populateNewDelegateCategories();
  populateNewDelegateTeams("");
  newDelegateTeam.value = row?.id || "";
  newDelegateTeam.disabled = Boolean(row);

  const title = document.querySelector("#newDelegateModalLabel");
  if (title) title.textContent = row ? "Editar delegado" : "Cargar nuevo delegado";
  if (createDelegateButton) {
    createDelegateButton.innerHTML = `<i class="bi ${row ? "bi-save-fill" : "bi-plus-circle-fill"}"></i> ${row ? "Guardar cambios" : "Crear delegado"}`;
  }

  validateNewDelegateForm();
  bootstrap.Modal.getOrCreateInstance(newDelegateModalElement).show();
}

function getDelegatePlayerNameParts(player = {}) {
  if (player.firstName || player.lastName) {
    return {
      firstName: player.firstName || "",
      lastName: player.lastName || ""
    };
  }

  const parts = String(player.name || "").trim().split(/\s+/);
  return {
    firstName: parts.slice(0, -1).join(" ") || parts[0] || "",
    lastName: parts.length > 1 ? parts.at(-1) : ""
  };
}

function openDelegatePlayerModal(playerId = "") {
  const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
  const player = team?.players.find((item) => String(item.id) === String(playerId));
  const nameParts = getDelegatePlayerNameParts(player);

  delegatePlayerForm?.reset();
  delegatePlayerForm.dataset.editingId = player?.id || "";
  delegatePlayerLastName.value = nameParts.lastName || "";
  delegatePlayerFirstName.value = nameParts.firstName || "";
  delegatePlayerBirthDate.value = player?.birthDate || "";
  delegatePlayerDni.value = player?.dni || "";
  delegatePlayerNumber.value = player?.number && player.number !== "-" ? player.number : "";
  if (delegatePlayerFeedback) {
    delegatePlayerFeedback.textContent = "";
    delegatePlayerFeedback.classList.remove("is-error");
  }

  const title = document.querySelector("#delegatePlayerModalLabel");
  if (title) title.textContent = player ? "Editar jugador" : "Cargar nuevo jugador";
  if (saveDelegatePlayerButton) {
    saveDelegatePlayerButton.innerHTML = `<i class="bi ${player ? "bi-save-fill" : "bi-plus-circle-fill"}"></i> ${player ? "Guardar cambios" : "Cargar jugador"}`;
  }

  validateDelegatePlayerForm();
  bootstrap.Modal.getOrCreateInstance(delegatePlayerModalElement).show();
}

async function saveDelegatePlayerInSupabase(team) {
  const editingId = delegatePlayerForm?.dataset.editingId || "";
  const dni = delegatePlayerDni.value.trim();
  const duplicatedDni = (team.players || []).find((player) =>
    String(player.dni || "").trim() === dni &&
    String(player.id) !== String(editingId)
  );

  if (duplicatedDni) {
    throw new Error(`Ya existe un jugador registrado con DNI ${dni}.`);
  }

  const payload = {
    equipo_id: team.id,
    nombre: delegatePlayerFirstName.value.trim(),
    apellido: delegatePlayerLastName.value.trim(),
    fecha_nacimiento: delegatePlayerBirthDate.value,
    dni,
    dorsal: Number(delegatePlayerNumber.value),
    activo: true
  };

  return saveDelegatePlayerToSupabase(team.id, editingId || null, payload);
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
          <button type="button" aria-label="Editar ${team.shortName}" data-admin-team-edit="${team.id}">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button type="button" aria-label="Dar de baja ${team.shortName}" data-admin-team-deactivate="${team.id}">
            <i class="bi bi-trash-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

async function renderAdminTeamsView(selectedCategory = "", selectedDivision = "", searchTerm = "", page = 1) {
  if (!tournamentCatalog.length) {
    await cargarMenuCategorias();
  }

  const divisionMap = getAdminDivisionMap();
  const categories = Object.keys(divisionMap);
  const divisions = selectedCategory ? divisionMap[selectedCategory] : [];
  const hasCompletedFilters = Boolean(selectedCategory && selectedDivision);
  if (hasCompletedFilters) {
    try {
      await loadAdminDelegatesForFilters(selectedCategory, selectedDivision, {
        includeInactive: false,
        fallbackToUsername: false
      });
    } catch (error) {
      console.error("Error al cargar equipos desde Supabase:", error);
      adminTeamsForView = [];
    }
  } else {
    adminTeamsForView = [];
  }
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
  return adminTeamsForView
    .filter((team) => Boolean(team.delegateId))
    .filter((team) =>
      team.delegate.toLowerCase().includes(normalizedSearch) ||
      team.shortName.toLowerCase().includes(normalizedSearch) ||
      (team.delegateUsername || "").toLowerCase().includes(normalizedSearch) ||
      (team.delegateDocument || "").toLowerCase().includes(normalizedSearch) ||
      team.contact.toLowerCase().includes(normalizedSearch)
    );
}

function renderAdminDelegateRows(hasCompletedFilters, searchTerm = "", page = 1) {
  if (!hasCompletedFilters) {
    return `
      <tr>
        <td colspan="7" class="admin-empty-row">Seleccioná categoría y división para visualizar delegados.</td>
      </tr>
    `;
  }

  const filteredTeams = getAdminFilteredDelegateTeams(searchTerm);

  if (!filteredTeams.length) {
    return `
      <tr>
        <td colspan="7" class="admin-empty-row">${adminDelegatesState.includeInactive ? "No hay delegados dados de baja para la búsqueda indicada." : "No se encontraron delegados para la búsqueda indicada."}</td>
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
      <td>${escapeHtml(team.delegateDocument || "-")}</td>
      <td>${team.contact}</td>
      <td>${team.delegateUsername || "-"}</td>
      <td>
        <div class="table-actions">
          ${adminDelegatesState.includeInactive
            ? `<button type="button" aria-label="Reactivar delegado ${team.delegate}" data-admin-delegate-activate="${team.delegateId}" data-admin-delegate-relation="${team.delegateRelationId || ""}" ${team.delegateId ? "" : "disabled"}>
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>`
            : `<button type="button" aria-label="Editar delegado ${team.delegate}" data-admin-delegate-edit="${team.delegateId}" data-admin-delegate-team="${team.id}" ${team.delegateId ? "" : "disabled"}>
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button type="button" aria-label="Dar de baja delegado ${team.delegate}" data-admin-delegate-deactivate="${team.delegateId}" data-admin-delegate-relation="${team.delegateRelationId || ""}" ${team.delegateId ? "" : "disabled"}>
                <i class="bi bi-trash-fill"></i>
              </button>`}
        </div>
      </td>
    </tr>
  `).join("");
}

async function renderAdminDelegatesView(selectedCategory = "", selectedDivision = "", searchTerm = "", page = 1) {
  if (!tournamentCatalog.length) {
    await cargarMenuCategorias();
  }

  adminDelegatesState.selectedCategory = selectedCategory || "";
  adminDelegatesState.selectedDivision = selectedDivision || "";
  adminDelegatesState.searchTerm = searchTerm || "";

  const divisionMap = getAdminDivisionMap();
  const categories = Object.keys(divisionMap);
  const divisions = selectedCategory ? divisionMap[selectedCategory] : [];
  const hasCompletedFilters = Boolean(selectedCategory && selectedDivision);

  if (hasCompletedFilters) {
    try {
      await loadAdminDelegatesForFilters(selectedCategory, selectedDivision);
    } catch (error) {
      console.error("Error al cargar delegados desde Supabase:", error);
      adminTeamsForView = [];
    }
  } else {
    adminTeamsForView = [];
  }

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
          <input class="form-control" type="search" value="${searchTerm}" placeholder="Apellido y nombre, documento, usuario, equipo o contacto" data-admin-delegate-search ${hasCompletedFilters ? "" : "disabled"}>
        </label>
      </div>

      <div class="table-responsive">
        <table class="table frame-table admin-delegates-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Apellido y nombre</th>
              <th>Equipo</th>
              <th>DNI/Pasaporte</th>
              <th>Contacto</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody data-admin-delegate-rows>${renderAdminDelegateRows(hasCompletedFilters, searchTerm, delegatePageInfo.page)}</tbody>
        </table>
      </div>
      ${hasCompletedFilters ? renderAdminPagination("delegates", delegatePageInfo) : ""}
      ${hasCompletedFilters ? `
        <div class="admin-category-footer-actions">
          <button class="btn btn-ingreso admin-view-inactive-btn" type="button" data-admin-delegates-toggle-bajas>
            <i class="bi ${adminDelegatesState.includeInactive ? "bi-eye-slash-fill" : "bi-eye-fill"}"></i>
            ${adminDelegatesState.includeInactive ? "Ocultar bajas" : "Ver bajas"}
          </button>
        </div>
      ` : ""}
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
        <td colspan="7" class="admin-empty-row">No se encontraron veedores.</td>
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
        <td>${escapeHtml(user.documento || "-")}</td>
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
    return `${user.nombre || ""} ${user.apellido || ""} ${user.documento || ""} ${user.contacto || ""} ${user.usuario || ""}`.toLowerCase().includes(normalizedSearch);
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
          <input class="form-control" type="search" value="${escapeHtml(adminObserversState.searchTerm)}" placeholder="Nombre, documento, contacto o usuario" data-admin-observer-search>
        </label>
      </div>

      <div class="table-responsive">
        <table class="table frame-table admin-observers-table mb-0">
          <thead>
            <tr>
              <th>N&deg;</th>
              <th>Apellido y nombre</th>
              <th>DNI/Pasaporte</th>
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
  return adminTeamsForView
    .filter((team) => !selectedTeamId || team.id === selectedTeamId)
    .flatMap((team) => getActivePlayers(team).map((player) => ({ ...player, team })))
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
        <td colspan="8" class="admin-empty-row">Seleccioná categoría y división para visualizar jugadores.</td>
      </tr>
    `;
  }

  const players = getAdminPlayers(hasCompletedFilters, selectedTeamId, searchTerm, onlyWithObservations);

  if (!players.length) {
    return `
      <tr>
        <td colspan="8" class="admin-empty-row">No se encontraron jugadores para la búsqueda indicada.</td>
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
      <td>${escapeHtml(player.dni || "-")}</td>
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
              <th>DNI</th>
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

async function enterDelegateView(team) {
  await loadTournamentSettingsFromSupabase();

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
            ${renderDelegatePlayersBadge(team)}
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
  sidebarContent.dataset.currentDelegateTeam = team.id;
  contentShell.innerHTML = renderDelegateHome(team);
  document.body.classList.add("admin-view");
  document.body.classList.add("delegate-view");
}

async function enterAdminView() {
  document.body.classList.remove("delegate-view");
  try {
    await loadAdminMetricsFromSupabase();
    await loadAdminObservedSummaryFromSupabase();
  } catch (error) {
    console.error("Error al cargar métricas del administrador:", error);
  }

  sidebarContent.innerHTML = `
    <div class="sidebar-main admin-sidebar-main">
      <div>
        <div class="sidebar-heading">
          <i class="bi bi-sliders2-vertical"></i>
          <h2>Acciones</h2>
        </div>
        <div class="sidebar-role-label">Rol: Administrador</div>
        <div class="admin-actions">
          <button class="division-link" type="button" data-admin-action="Dashboard">
            <i class="bi bi-speedometer2"></i>
            Dashboard
          </button>
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
          <button class="division-link" type="button" data-admin-action="Reportería IA">
            <i class="bi bi-robot"></i>
            Reportería IA
          </button>
          <button class="division-link" type="button" data-admin-action="Diario Noticias">
            <i class="bi bi-newspaper"></i>
            Diario Noticias
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
  document.body.classList.add("admin-view");
}

async function enterObserverView() {
  document.body.classList.remove("delegate-view");
  await loadObserverDataFromSupabase();
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

mobileMenuToggle?.addEventListener("click", toggleMobileMenu);
mobileMenuBackdrop?.addEventListener("click", () => closeMobileMenu());

document.addEventListener("keydown", (event) => {
  if (!document.body.classList.contains("mobile-menu-open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeMobileMenu();
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getMobileMenuFocusableElements();
  if (!focusableElements.length) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

mobileMenuMedia.addEventListener("change", (event) => {
  if (!event.matches) closeMobileMenu({ restoreFocus: false });
});

document.querySelector("#floatingMascotWhatsapp")?.addEventListener("click", (event) => {
  if (event.currentTarget.getAttribute("href") === "#") {
    event.preventDefault();
  }
});

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
  const mobileNavigationButton = event.target.closest("[data-division], [data-public-page], [data-delegate-home], [data-delegate-team], [data-delegate-players], [data-observer-matches], [data-admin-action], [data-help-role], [data-admin-logout], [data-bs-target='#loginModal']");

  if (mobileNavigationButton && mobileMenuMedia.matches) {
    closeMobileMenu();
  }

  if (logoutButton) {
    event.preventDefault();
    event.stopPropagation();
    await exitProfileToPublicHome();
    return;
  }

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
    await showPublicInfo(publicPageButton.dataset.publicPage);
    return;
  }

  if (delegateHomeButton) {
    const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
    showContentLoader("Resumen", () => {
      contentShell.innerHTML = renderDelegateHome(team);
    });
    return;
  }

  if (delegateTeamButton) {
    const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
    showContentLoader("Mi equipo", () => {
      contentShell.innerHTML = renderDelegateTeamView(team);
    });
    return;
  }

  if (delegatePlayersButton) {
    await loadTournamentSettingsFromSupabase();
    const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
    showContentLoader("Jugadores", () => {
      contentShell.innerHTML = renderDelegatePlayers(team);
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
      if (actionName === "Dashboard") {
        await loadAdminMetricsFromSupabase();
        await loadAdminObservedSummaryFromSupabase();
        contentShell.innerHTML = renderAdminHome();
        return;
      }

      if (actionName === "Equipos") {
        contentShell.innerHTML = await renderAdminTeamsView();
        return;
      }

      if (actionName === "Delegados") {
        adminDelegatesState.includeInactive = false;
        contentShell.innerHTML = await renderAdminDelegatesView();
        return;
      }

      if (actionName === "Jugadores") {
        await loadAdminObservedSummaryFromSupabase();
        contentShell.innerHTML = renderAdminPlayersView();
        return;
      }

      if (actionName === "Veedores") {
        contentShell.innerHTML = await renderAdminObserversView("", 1, { includeInactive: false });
        return;
      }

      if (actionName === "Reportería IA") {
        contentShell.innerHTML = renderAdminAiReportView();
        return;
      }

      if (actionName === "Diario Noticias") {
        await Promise.all([loadAdminNews(), loadCompletedNewsSportsDates()]);
        editingNewsEditionId = "";
        editingNewsPageIndex = 0;
        adminNewsDraft = null;
        contentShell.innerHTML = renderAdminNewsView();
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
        await Promise.all([
          loadPublicSettingsFromSupabase(),
          loadTournamentSettingsFromSupabase()
        ]);
        contentShell.innerHTML = renderAdminSettingsView();
        return;
      }

      contentShell.innerHTML = renderAdminActionView(actionName);
    });
    return;
  }

  if (!logoutButton) return;
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
  const observerDownloadSheetButton = event.target.closest("[data-observer-download-sheet]");
  const scoreIncButton = event.target.closest("[data-score-inc]");
  const scoreDecButton = event.target.closest("[data-score-dec]");
  const goalIncButton = event.target.closest("[data-goal-inc]");
  const goalDecButton = event.target.closest("[data-goal-dec]");
  const eventButton = event.target.closest(".event-btn");
  const observationButton = event.target.closest("[data-observation]");
  const adminPlayerObservationButton = event.target.closest("[data-admin-player-observation]");
  const playerHistoryButton = event.target.closest("[data-player-history]");
  const observerSaveButton = event.target.closest("[data-observer-save]");
  const generateAiReportButton = event.target.closest("[data-generate-ai-report]");
  const downloadAiReportButton = event.target.closest("[data-download-ai-report]");
  const saveTournamentSettingsButton = event.target.closest("[data-save-tournament-settings]");
  const adminPageButton = event.target.closest("[data-admin-page]");
  const delegateTeamEditButton = event.target.closest("[data-delegate-team-edit]");
  const openDelegatePlayerButton = event.target.closest("[data-open-delegate-player-modal]");
  const editDelegatePlayerButton = event.target.closest("[data-delegate-player-edit]");
  const deactivateDelegatePlayerButton = event.target.closest("[data-delegate-player-deactivate]");
  const activateDelegatePlayerButton = event.target.closest("[data-delegate-player-activate]");
  const toggleDelegatePlayersBajasButton = event.target.closest("[data-delegate-players-toggle-bajas]");
  const openNewTeamButton = event.target.closest("[data-open-new-team-modal]");
  const editAdminTeamButton = event.target.closest("[data-admin-team-edit]");
  const deactivateAdminTeamButton = event.target.closest("[data-admin-team-deactivate]");
  const openNewDelegateButton = event.target.closest("[data-open-new-delegate-modal]");
  const editAdminDelegateButton = event.target.closest("[data-admin-delegate-edit]");
  const deactivateAdminDelegateButton = event.target.closest("[data-admin-delegate-deactivate]");
  const activateAdminDelegateButton = event.target.closest("[data-admin-delegate-activate]");
  const toggleDelegatesBajasButton = event.target.closest("[data-admin-delegates-toggle-bajas]");
  const openNewObserverButton = event.target.closest("[data-open-new-observer-modal]");
  const savePublicSettingsButton = event.target.closest("[data-save-public-settings]");
  const removeSponsorImageButton = event.target.closest("[data-remove-sponsor-image]");
  const removeHomeCarouselImageButton = event.target.closest("[data-remove-home-carousel-image]");
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
  const newsPageButton = event.target.closest("[data-news-page]");
  const newNewsButton = event.target.closest("[data-admin-news-new]");
  const editNewsButton = event.target.closest("[data-admin-news-edit]");
  const deactivateNewsButton = event.target.closest("[data-admin-news-deactivate]");
  const cancelNewsButton = event.target.closest("[data-admin-news-cancel]");
  const newsPageTabButton = event.target.closest("[data-admin-news-page-tab]");
  const saveNewsButton = event.target.closest("[data-admin-news-save]");
  const publishNewsButton = event.target.closest("[data-admin-news-publish]");
  const generateNewsButton = event.target.closest("[data-admin-news-generate]");

  if (newsPageButton) {
    selectedNewsPageIndex = Number(newsPageButton.dataset.newsPage) || 0;
    publicInfoContent.innerHTML = renderNewsContent();
    return;
  }

  if (newNewsButton) {
    editingNewsEditionId = "new";
    editingNewsPageIndex = 0;
    adminNewsDraft = { id: "", titulo: "Frame0", slogan: "Un fin de semana a puro fútbol", estado: "borrador", generado_por_ia: false, fecha: {}, paginas: getNewNewsPages() };
    contentShell.innerHTML = renderAdminNewsView();
    return;
  }

  if (editNewsButton) {
    editingNewsEditionId = editNewsButton.dataset.adminNewsEdit;
    editingNewsPageIndex = 0;
    adminNewsDraft = JSON.parse(JSON.stringify(adminNewsEditions.find((item) => String(item.id) === String(editingNewsEditionId)) || null));
    contentShell.innerHTML = renderAdminNewsView();
    return;
  }

  if (cancelNewsButton) {
    editingNewsEditionId = "";
    adminNewsDraft = null;
    contentShell.innerHTML = renderAdminNewsView();
    return;
  }

  if (newsPageTabButton) {
    try {
      syncAdminNewsDraftFromForm();
    } catch (error) {
      alert(error.message);
      return;
    }
    editingNewsPageIndex = Number(newsPageTabButton.dataset.adminNewsPageTab) || 0;
    contentShell.innerHTML = renderAdminNewsView();
    return;
  }

  if (saveNewsButton) {
    const isPublished = adminNewsDraft?.estado === "publicado";
    const confirmed = await requestConfirmation({
      title: isPublished ? "Guardar cambios" : "Guardar borrador",
      message: isPublished ? "Se actualizará el diario que ya está visible en la landing. ¿Confirmás?" : "Se guardarán los cambios sin publicar el diario en la landing. ¿Confirmás?",
      confirmLabel: isPublished ? "Guardar cambios" : "Guardar borrador"
    });
    if (!confirmed) return;
    if (adminNewsDraft.estado !== "publicado") adminNewsDraft.estado = "borrador";
    saveNewsButton.disabled = true;
    try {
      await saveAdminNewsAndCloseEditor();
    } catch (error) {
      saveNewsButton.disabled = false;
      alert(error.message || "No se pudo guardar el diario.");
    }
    return;
  }

  if (publishNewsButton) {
    const confirmed = await requestConfirmation({ title: "Publicar diario", message: "El diario quedará visible inmediatamente en Noticias de la landing. ¿Confirmás la publicación?", confirmLabel: "Publicar" });
    if (!confirmed) return;
    publishNewsButton.disabled = true;
    try {
      await publishAdminNewsDraft();
      await loadAdminNews();
      await loadPublishedNews();
      editingNewsEditionId = "";
      adminNewsDraft = null;
      contentShell.innerHTML = renderAdminNewsView();
    } catch (error) {
      publishNewsButton.disabled = false;
      alert(error.message || "No se pudo publicar el diario.");
    }
    return;
  }

  if (generateNewsButton) {
    if (!contentShell.querySelector('[data-news-field="numero_fecha"]')?.value) {
      await requestConfirmation({
        title: "Seleccioná una fecha",
        message: "Elegí una fecha deportiva realizada antes de generar el diario.",
        confirmLabel: "Entendido"
      });
      return;
    }
    const originalLabel = generateNewsButton.innerHTML;
    const generationStatus = contentShell.querySelector("[data-admin-news-generation-status]");
    generateNewsButton.disabled = true;
    generateNewsButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Generando`;
    if (generationStatus) generationStatus.innerHTML = `<div class="delegate-edit-window is-open"><i class="bi bi-hourglass-split"></i> Consultando datos reales y generando el borrador...</div>`;
    try {
      await generateAdminNewsDraft();
      editingNewsPageIndex = 0;
      contentShell.innerHTML = renderAdminNewsView();
    } catch (error) {
      generateNewsButton.disabled = false;
      generateNewsButton.innerHTML = originalLabel;
      if (generationStatus) generationStatus.innerHTML = `<div class="delegate-edit-window is-closed"><i class="bi bi-exclamation-triangle-fill"></i> ${escapeHtml(error.message || "No se pudo generar el diario.")}</div>`;
    }
    return;
  }

  if (deactivateNewsButton) {
    const confirmed = await requestConfirmation({ title: "Dar de baja diario", message: "¿Seguro que deseas dar de baja este diario? El diario dejará de mostrarse en la landing, pero no será eliminado.", confirmLabel: "Dar de baja" });
    if (!confirmed) return;
    const { error } = await supabaseClient.rpc("dar_baja_diario_noticias", { p_usuario: adminSettingsSession?.usuario || "", p_password: adminSettingsSession?.password || "", p_edicion_id: deactivateNewsButton.dataset.adminNewsDeactivate });
    if (error) {
      alert(error.message || "No se pudo dar de baja el diario.");
      return;
    }
    await loadAdminNews();
    contentShell.innerHTML = renderAdminNewsView();
    return;
  }

  if (generateAiReportButton) {
    const status = contentShell.querySelector("[data-ai-report-status]");
    const output = contentShell.querySelector("[data-ai-report-output]");
    const downloadButton = contentShell.querySelector("[data-download-ai-report]");
    const originalLabel = generateAiReportButton.innerHTML;

    generateAiReportButton.disabled = true;
    if (downloadButton) downloadButton.disabled = true;
    generateAiReportButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Generando`;
    if (status) {
      status.innerHTML = `<div class="delegate-edit-window is-open ai-report-loading"><i class="bi bi-stars"></i> Generando reporte con IA. Esto puede tardar unos segundos.</div>`;
    }
    if (output && !currentAiReport) {
      output.innerHTML = renderAiReportResult(null);
    }

    try {
      const report = await generateAiReportForAdmin();
      updateAiReportView(report);
    } catch (error) {
      console.error("Error al generar reporte IA:", error);
      if (status) {
        status.innerHTML = `<div class="delegate-edit-window is-closed"><i class="bi bi-exclamation-triangle-fill"></i> No se pudo generar el reporte: ${escapeHtml(error.message || "Error desconocido")}</div>`;
      }
      if (downloadButton && currentAiReport) downloadButton.disabled = false;
    } finally {
      generateAiReportButton.disabled = false;
      generateAiReportButton.innerHTML = originalLabel;
    }
    return;
  }

  if (downloadAiReportButton) {
    downloadCurrentAiReportPdf();
    return;
  }

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
    const confirmed = await requestConfirmation({
      title: deactivateDivisionButton ? "Dar de baja división" : "Reactivar división",
      message: deactivateDivisionButton
        ? "Esta división dejará de mostrarse como activa. ¿Confirmás la baja?"
        : "Esta división volverá a mostrarse como activa. ¿Confirmás la reactivación?",
      confirmLabel: deactivateDivisionButton ? "Dar de baja" : "Reactivar"
    });
    if (!confirmed) return;

    try {
      await apiPatch(`/divisiones/${id}/${action}`);
      invalidateAdminMetrics();
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
    const confirmed = await requestConfirmation({
      title: deactivateAdminObserverButton ? "Dar de baja veedor" : "Reactivar veedor",
      message: deactivateAdminObserverButton
        ? "El veedor quedará inactivo y no podrá operar. ¿Confirmás la baja?"
        : "El veedor volverá a estar activo y podrá operar. ¿Confirmás la reactivación?",
      confirmLabel: deactivateAdminObserverButton ? "Dar de baja" : "Reactivar"
    });
    if (!confirmed) return;

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
    const confirmed = await requestConfirmation({
      title: "Dar de baja categoría",
      message: "La categoría y sus divisiones asociadas quedarán inactivas. ¿Confirmás la baja?",
      confirmLabel: "Dar de baja"
    });
    if (!confirmed) return;

    try {
      await apiPatch(`/categorias/${deactivateCategoryButton.dataset.adminCategoryDeactivate}/desactivar`);
      invalidateAdminMetrics();
      contentShell.innerHTML = await renderAdminCategoriesView({
        includeInactive: adminCategoriesState.includeInactive,
        editingId: null
      });
      cargarMenuCategorias();
    } catch (error) {
      console.error("Error al dar de baja la categoría:", error);
    }
    return;
  }

  if (activateCategoryButton) {
    const confirmed = await requestConfirmation({
      title: "Reactivar categoría",
      message: "La categoría volverá a mostrarse como activa. ¿Confirmás la reactivación?",
      confirmLabel: "Reactivar"
    });
    if (!confirmed) return;

    try {
      await apiPatch(`/categorias/${activateCategoryButton.dataset.adminCategoryActivate}/activar`);
      invalidateAdminMetrics();
      contentShell.innerHTML = await renderAdminCategoriesView({
        includeInactive: true,
        editingId: null
      });
      cargarMenuCategorias();
    } catch (error) {
      console.error("Error al reactivar la categoría:", error);
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

  if (observerDownloadSheetButton) {
    const match = getObserverMatch(observerDownloadSheetButton.dataset.observerDownloadSheet);
    const homeTeam = getTeam(match?.home);
    const awayTeam = getTeam(match?.away);

    if (!match || !homeTeam || !awayTeam) {
      alert("No se pudo generar la planilla porque faltan datos del partido o de los equipos.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("El navegador bloqueó la ventana de descarga. Permití ventanas emergentes para generar el PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(renderObserverMatchSheetDocument(match, homeTeam, awayTeam));
    printWindow.document.close();
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
    const confirmed = await requestConfirmation({
      title: "Guardar cambios",
      message: "Se van a guardar los cambios de este registro. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;

    const matchId = observerSaveButton.dataset.observerSave;
    observerSaveButton.disabled = true;
    observerSaveButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

    try {
      await saveObserverMatchDetailsToSupabase(matchId);
      observerSaveButton.classList.add("is-saved");
      observerSaveButton.innerHTML = `<i class="bi bi-check2-circle"></i> Guardado`;
      window.setTimeout(() => {
        observerSaveButton.classList.remove("is-saved");
        observerSaveButton.disabled = false;
        observerSaveButton.innerHTML = `<i class="bi bi-save-fill"></i> Guardar`;
      }, 1600);
    } catch (error) {
      console.error("Error al guardar el detalle del partido:", error);
      observerSaveButton.disabled = false;
      observerSaveButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
      alert(`No se pudo guardar el detalle del partido: ${error.message || "Error desconocido"}`);
    }
    return;
  }

  if (saveTournamentSettingsButton) {
    const confirmed = await requestConfirmation({
      title: "Guardar generales torneo",
      message: "Se van a guardar las fechas y configuración general del torneo. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;

    saveTournamentSettingsButton.disabled = true;
    saveTournamentSettingsButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

    try {
      await saveTournamentSettingsToSupabase();
      saveTournamentSettingsButton.classList.add("is-saved");
      saveTournamentSettingsButton.innerHTML = `<i class="bi bi-check2-circle"></i> Guardado`;
      window.setTimeout(() => {
        saveTournamentSettingsButton.classList.remove("is-saved");
        saveTournamentSettingsButton.disabled = false;
        saveTournamentSettingsButton.innerHTML = `<i class="bi bi-save-fill"></i> Guardar generales torneo`;
      }, 1400);
    } catch (error) {
      console.error("Error al guardar configuración general del torneo:", error);
      saveTournamentSettingsButton.disabled = false;
      saveTournamentSettingsButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
    }
    return;
  }

  if (savePublicSettingsButton) {
    const confirmed = await requestConfirmation({
      title: "Guardar cambios",
      message: "Se van a guardar los cambios de esta configuración. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;

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

  if (removeSponsorImageButton) {
    const confirmed = await requestConfirmation({
      title: "Eliminar auspiciante",
      message: "La imagen se quitará del banner cuando guardes la configuración. ¿Confirmás la eliminación?",
      confirmLabel: "Eliminar"
    });
    if (!confirmed) return;

    const index = Number(removeSponsorImageButton.dataset.removeSponsorImage);
    publicSettings.sponsorImages.splice(index, 1);
    refreshSponsorAdminPreview();
    return;
  }

  if (removeHomeCarouselImageButton) {
    const confirmed = await requestConfirmation({
      title: "Eliminar imagen del carrusel",
      message: "La imagen se quitará del carrusel principal cuando guardes la configuración. ¿Confirmás la eliminación?",
      confirmLabel: "Eliminar"
    });
    if (!confirmed) return;

    const index = Number(removeHomeCarouselImageButton.dataset.removeHomeCarouselImage);
    publicSettings.homeCarouselImages.splice(index, 1);
    refreshSponsorAdminPreview();
    return;
  }

  if (generateFixtureButton) {
    const key = generateFixtureButton.dataset.generateFixture;
    const row = getTournamentConfigByKey(key);
    if (!row) return;

    const existingFixture = row.config.fixture || await hasExistingFixtureForDivision(row.divisionId);
    const confirmed = await requestConfirmation({
      title: existingFixture ? "Reemplazar fixture" : "Generar fixture",
      message: existingFixture
        ? `Ya existe un fixture para ${row.category} - ${row.division}. Si confirmás, se borrará y se creará uno nuevo.`
        : `Se generará el fixture para ${row.category} - ${row.division}. ¿Confirmás la acción?`,
      confirmLabel: existingFixture ? "Reemplazar fixture" : "Generar fixture"
    });
    if (!confirmed) return;

    generateFixtureButton.disabled = true;

    try {
      const fixture = await generateFixturePlan(row);
      if (!fixture) {
        alert("No hay equipos suficientes para generar el fixture.");
        return;
      }
      await saveFixtureMatchesToSupabase(fixture);
      await saveTournamentSettingsToSupabase();
      if (activeDivisionId && String(activeDivisionId) === String(row.divisionId)) {
        await loadDivisionDataFromSupabase(activeDivisionId);
        renderFixtureDateOptions();
        renderFixture();
      }
      refreshTournamentGeneralRows();
    } catch (error) {
      console.error("Error al generar fixture en Supabase:", error);
      alert(`No se pudo generar el fixture: ${error.message || "error desconocido"}`);
    } finally {
      generateFixtureButton.disabled = false;
    }
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
      contentShell.innerHTML = await renderAdminTeamsView(category, division, searchTerm, page);
      return;
    }

    if (type === "delegates") {
      const category = contentShell.querySelector("[data-admin-delegate-category]")?.value || "";
      const division = contentShell.querySelector("[data-admin-delegate-division]")?.value || "";
      const searchTerm = getEffectiveSearchTerm(contentShell.querySelector("[data-admin-delegate-search]")?.value || "");
      contentShell.innerHTML = await renderAdminDelegatesView(category, division, searchTerm, page);
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
    const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
    if (!team) return;

    if (delegateTeamEditButton.dataset.delegateTeamEdit === "edit") {
      contentShell.innerHTML = renderDelegateTeamView(team, true);
      return;
    }

    const crestInput = contentShell.querySelector('[data-team-edit-field="crest"]');
    const crest = crestInput?.files?.[0] ? (await readSponsorFile(crestInput.files[0])).src : team.crest;
    const abbreviation = contentShell.querySelector('[data-team-edit-field="abbreviation"]')?.value.trim() || team.abbreviation;
    const shortName = contentShell.querySelector('[data-team-edit-field="shortName"]')?.value.trim() || team.shortName;
    const description = contentShell.querySelector('[data-team-edit-field="description"]')?.value.trim() || team.description;
    const colorInputs = [...contentShell.querySelectorAll("[data-team-color]")];
    const noThirdColor = contentShell.querySelector("[data-team-color-none]")?.checked || false;
    const nextColors = colorInputs
      .filter((input) => input.dataset.teamColor !== "2" || !noThirdColor)
      .map((input) => input.value);

    const confirmed = await requestConfirmation({
      title: "Guardar cambios",
      message: "Se van a guardar los cambios de este equipo. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;

    try {
      await saveDelegateTeamToSupabase(team.id, {
        abreviatura: abbreviation,
        nombre_corto: shortName,
        descripcion: description,
        escudo_url: crest,
        color_principal: nextColors[0],
        color_secundario: nextColors[1],
        color_terciario: nextColors[2] || null
      });

      await loadDivisionDataFromSupabase(activeDivisionId || team.division_id);
      const updatedTeam = getTeam(team.id);
      if (!updatedTeam) {
        throw new Error("El equipo se guardó, pero no se pudo recargar desde Supabase.");
      }
      contentShell.innerHTML = renderDelegateTeamView(updatedTeam);
    } catch (error) {
      console.error("Error al guardar el equipo del delegado:", error);
      alert(error.message || "No se pudo guardar el equipo del delegado.");
      contentShell.innerHTML = renderDelegateTeamView(team, true);
    }
    return;
  }

  if (openDelegatePlayerButton) {
    openDelegatePlayerModal();
    return;
  }

  if (editDelegatePlayerButton) {
    openDelegatePlayerModal(editDelegatePlayerButton.dataset.delegatePlayerEdit);
    return;
  }

  if (toggleDelegatePlayersBajasButton) {
    const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
    contentShell.innerHTML = renderDelegatePlayers(team, toggleDelegatePlayersBajasButton.dataset.delegatePlayersToggleBajas === "true");
    return;
  }

  if (deactivateDelegatePlayerButton) {
    const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
    const player = team?.players.find((item) => String(item.id) === String(deactivateDelegatePlayerButton.dataset.delegatePlayerDeactivate));
    const confirmed = await requestConfirmation({
      title: "Dar de baja jugador",
      message: `El jugador ${player?.name || "seleccionado"} quedará inactivo y dejará de mostrarse en el plantel. ¿Confirmás la baja?`,
      confirmLabel: "Dar de baja"
    });
    if (!confirmed) return;

    try {
      await changeDelegatePlayerStatusInSupabase(deactivateDelegatePlayerButton.dataset.delegatePlayerDeactivate, false);
      invalidateAdminMetrics();
      await loadDivisionDataFromSupabase(activeDivisionId || team?.division_id);
      const updatedTeam = getTeam(team?.id);
      if (!updatedTeam) {
        throw new Error("El jugador se actualizó, pero no se pudo recargar el equipo desde Supabase.");
      }
      contentShell.innerHTML = renderDelegatePlayers(updatedTeam);
    } catch (error) {
      console.error("Error al dar de baja el jugador:", error);
      alert(error.message || "No se pudo dar de baja el jugador.");
    }
    return;
  }

  if (activateDelegatePlayerButton) {
    const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
    const player = team?.players.find((item) => String(item.id) === String(activateDelegatePlayerButton.dataset.delegatePlayerActivate));
    const duplicatedDni = (team?.players || []).find((item) =>
      item.active !== false &&
      String(item.dni || "").trim() === String(player?.dni || "").trim() &&
      String(item.id) !== String(player?.id)
    );

    if (duplicatedDni) {
      alert(`No se puede reactivar: ya existe un jugador activo con DNI ${player?.dni}.`);
      return;
    }

    const confirmed = await requestConfirmation({
      title: "Reactivar jugador",
      message: `El jugador ${player?.name || "seleccionado"} volverá a mostrarse en el plantel activo. ¿Confirmás la reactivación?`,
      confirmLabel: "Reactivar"
    });
    if (!confirmed) return;

    try {
      await changeDelegatePlayerStatusInSupabase(activateDelegatePlayerButton.dataset.delegatePlayerActivate, true);
      invalidateAdminMetrics();
      await loadDivisionDataFromSupabase(activeDivisionId || team?.division_id);
      const updatedTeam = getTeam(team?.id);
      if (!updatedTeam) {
        throw new Error("El jugador se actualizó, pero no se pudo recargar el equipo desde Supabase.");
      }
      contentShell.innerHTML = renderDelegatePlayers(updatedTeam, true);
    } catch (error) {
      console.error("Error al reactivar el jugador:", error);
      alert(error.message || "No se pudo reactivar el jugador.");
    }
    return;
  }

  if (openNewTeamButton) {
    await openAdminTeamModal();
    return;
  }

  if (editAdminTeamButton) {
    await openAdminTeamModal(editAdminTeamButton.dataset.adminTeamEdit);
    return;
  }

  if (deactivateAdminTeamButton) {
    const confirmed = await requestConfirmation({
      title: "Dar de baja equipo",
      message: "El equipo quedará inactivo y dejará de mostrarse en las vistas activas. ¿Confirmás la baja?",
      confirmLabel: "Dar de baja"
    });
    if (!confirmed) return;

    try {
      await apiPatch(`/equipos/${deactivateAdminTeamButton.dataset.adminTeamDeactivate}/desactivar`);
      invalidateAdminMetrics();
      const category = contentShell.querySelector("[data-admin-team-category]")?.value || "";
      const division = contentShell.querySelector("[data-admin-team-division]")?.value || "";
      const searchTerm = getEffectiveSearchTerm(contentShell.querySelector("[data-admin-team-search]")?.value || "");
      contentShell.innerHTML = await renderAdminTeamsView(category, division, searchTerm, 1);
    } catch (error) {
      console.error("Error al dar de baja el equipo:", error);
    }
    return;
  }

  if (openNewDelegateButton) {
    await openAdminDelegateModal();
    return;
  }

  if (editAdminDelegateButton) {
    await openAdminDelegateModal(
      editAdminDelegateButton.dataset.adminDelegateEdit,
      editAdminDelegateButton.dataset.adminDelegateTeam || ""
    );
    return;
  }

  if (toggleDelegatesBajasButton) {
    adminDelegatesState.includeInactive = !adminDelegatesState.includeInactive;
    contentShell.innerHTML = await renderAdminDelegatesView(
      adminDelegatesState.selectedCategory,
      adminDelegatesState.selectedDivision,
      adminDelegatesState.searchTerm,
      1
    );
    return;
  }

  if (deactivateAdminDelegateButton || activateAdminDelegateButton) {
    const isDeactivate = Boolean(deactivateAdminDelegateButton);
    const button = deactivateAdminDelegateButton || activateAdminDelegateButton;
    const userId = isDeactivate ? button.dataset.adminDelegateDeactivate : button.dataset.adminDelegateActivate;
    const relationId = button.dataset.adminDelegateRelation || "";
    const confirmed = await requestConfirmation({
      title: isDeactivate ? "Dar de baja delegado" : "Reactivar delegado",
      message: isDeactivate
        ? "El delegado quedará inactivo y no podrá ingresar. ¿Confirmás la baja?"
        : "El delegado volverá a estar activo y podrá ingresar. ¿Confirmás la reactivación?",
      confirmLabel: isDeactivate ? "Dar de baja" : "Reactivar"
    });
    if (!confirmed) return;

    try {
      const action = isDeactivate ? "desactivar" : "activar";
      await apiPatch(`/usuarios/${userId}/${action}`);
      if (relationId) {
        try {
          await apiPatch(`/delegados/${relationId}/${action}`);
        } catch (relationError) {
          console.warn(`No se pudo ${action} la relacion delegado-equipo:`, relationError);
        }
      }
      contentShell.innerHTML = await renderAdminDelegatesView(
        adminDelegatesState.selectedCategory,
        adminDelegatesState.selectedDivision,
        adminDelegatesState.searchTerm,
        1
      );
    } catch (error) {
      console.error(`Error al ${isDeactivate ? "dar de baja" : "reactivar"} el delegado:`, error);
    }
    return;
  }

  if (openNewObserverButton) {
    prepareNewObserverForm();
    bootstrap.Modal.getOrCreateInstance(newObserverModalElement).show();
    return;
  }

  const adminSaveButton = event.target.closest(".admin-save-row-btn");
  if (adminSaveButton) {
    const confirmed = await requestConfirmation({
      title: "Guardar cambios",
      message: "Se van a guardar los cambios de este registro. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;

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
    renderPlayerHistoryBody(playerHistoryButton.dataset.playerHistory, {
      readOnlyResolution: Boolean(playerHistoryButton.closest(".delegate-players-table"))
    });
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
  const tournamentMatchDayInput = event.target.closest("[data-tournament-match-day]");
  const tournamentStartDateInput = event.target.closest("[data-tournament-start-date]");
  const tournamentPlayoffInput = event.target.closest("[data-tournament-playoff]");
  const tournamentPlayoffTeamsInput = event.target.closest("[data-tournament-playoff-teams]");
  const sponsorUploadInput = event.target.closest("[data-sponsor-upload]");
  const homeCarouselUploadInput = event.target.closest("[data-home-carousel-upload]");
  const landingVideoUploadInput = event.target.closest("[data-landing-video-upload]");
  const newsEditionSelect = event.target.closest("[data-news-edition]");

  if (newsEditionSelect) {
    selectedNewsEditionId = newsEditionSelect.value;
    selectedNewsPageIndex = 0;
    publicInfoContent.innerHTML = renderNewsContent();
    return;
  }

  if (sponsorUploadInput) {
    await addSponsorImages(sponsorUploadInput.files || []);
    sponsorUploadInput.value = "";
    return;
  }

  if (homeCarouselUploadInput) {
    await addHomeCarouselImages(homeCarouselUploadInput.files || []);
    homeCarouselUploadInput.value = "";
    return;
  }

  if (landingVideoUploadInput) {
    const file = landingVideoUploadInput.files?.[0];
    landingVideoUploadInput.value = "";
    if (!file) return;
    const confirmed = await requestConfirmation({
      title: "Reemplazar video",
      message: "El video seleccionado reemplazará al actual cuando guardes la configuración. ¿Confirmás el cambio?",
      confirmLabel: "Reemplazar"
    });
    if (!confirmed) return;
    try {
      await replaceLandingVideo(file);
    } catch (error) {
      window.alert(error.message || "No se pudo procesar el video.");
    }
    return;
  }

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
    if (tournamentSettings.playerRegistrationTo && tournamentSettings.playerRegistrationFrom > tournamentSettings.playerRegistrationTo) {
      tournamentSettings.playerRegistrationTo = tournamentSettings.playerRegistrationFrom;
      const toInput = contentShell.querySelector("[data-registration-to]");
      if (toInput) toInput.value = tournamentSettings.playerRegistrationTo;
    }
    return;
  }

  if (registrationToInput) {
    tournamentSettings.playerRegistrationTo = registrationToInput.value;
    if (tournamentSettings.playerRegistrationFrom && tournamentSettings.playerRegistrationTo < tournamentSettings.playerRegistrationFrom) {
      tournamentSettings.playerRegistrationFrom = tournamentSettings.playerRegistrationTo;
      const fromInput = contentShell.querySelector("[data-registration-from]");
      if (fromInput) fromInput.value = tournamentSettings.playerRegistrationFrom;
    }
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

  if (tournamentMatchDayInput) {
    const row = getTournamentConfigByKey(tournamentMatchDayInput.dataset.tournamentMatchDay);
    if (row) {
      row.config.matchDay = tournamentMatchDayInput.value;
      row.config.fixture = null;
      refreshTournamentGeneralRows();
    }
    return;
  }

  if (tournamentStartDateInput) {
    const row = getTournamentConfigByKey(tournamentStartDateInput.dataset.tournamentStartDate);
    if (row) {
      row.config.startDate = tournamentStartDateInput.value || DEFAULT_FIXTURE_START_DATE;
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
    contentShell.innerHTML = await renderAdminTeamsView(category, "");
    return;
  }

  if (divisionSelect) {
    const category = contentShell.querySelector("[data-admin-team-category]")?.value || "";
    const division = divisionSelect.value;
    contentShell.innerHTML = await renderAdminTeamsView(category, division);
    return;
  }

  if (delegateCategorySelect) {
    const category = delegateCategorySelect.value;
    contentShell.innerHTML = await renderAdminDelegatesView(category, "");
    return;
  }

  if (delegateDivisionSelect) {
    const category = contentShell.querySelector("[data-admin-delegate-category]")?.value || "";
    const division = delegateDivisionSelect.value;
    contentShell.innerHTML = await renderAdminDelegatesView(category, division);
    return;
  }

  if (playerCategorySelect) {
    const category = playerCategorySelect.value;
    adminTeamsForView = [];
    contentShell.innerHTML = renderAdminPlayersView(category, "");
    return;
  }

  if (playerDivisionSelect) {
    const category = contentShell.querySelector("[data-admin-player-category]")?.value || "";
    const division = playerDivisionSelect.value;
    await loadAdminTeamsForFilters(category, division);
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

  if (editingId) {
    const confirmed = await requestConfirmation({
      title: "Guardar cambios",
      message: "Se van a guardar los cambios de esta categoría. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;
  }

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
    invalidateAdminMetrics();
    cargarMenuCategorias();
  } catch (error) {
    console.error("Error al guardar la categoría:", error);
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
      await loadAdminDelegatesForFilters(category, division, {
        includeInactive: false,
        fallbackToUsername: false
      });
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

observationModalBody?.addEventListener("click", async (event) => {
  const saveObservation = event.target.closest("#saveObservation");
  const saveResolution = event.target.closest("[data-save-observation-resolution]");
  const historyObservationView = event.target.closest("[data-history-observation-view]");
  const historyResolutionView = event.target.closest("[data-history-resolution-view]");
  const historyResolutionEdit = event.target.closest("[data-history-resolution-edit]");

  if (saveObservation) {
    const confirmed = await requestConfirmation({
      title: "Guardar observación",
      message: "Se va a guardar esta observación disciplinaria. ¿Confirmás la carga?",
      confirmLabel: "Guardar observación"
    });
    if (!confirmed) return;

    saveActiveObservationText();
    return;
  }

  if (saveResolution) {
    const confirmed = await requestConfirmation({
      title: "Guardar resolución",
      message: "Se va a guardar la resolución administrativa de esta observación. ¿Confirmás los cambios?",
      confirmLabel: "Guardar resolución"
    });
    if (!confirmed) return;

    saveResolution.disabled = true;
    saveResolution.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

    try {
      await saveObservationResolution();
    } catch (error) {
      console.error("Error al guardar la resolución disciplinaria:", error);
      saveResolution.disabled = false;
      saveResolution.innerHTML = `<i class="bi bi-check2-circle"></i> Guardar resolución`;
      alert(`No se pudo guardar la resolución: ${error.message || "Error desconocido"}`);
    }
    return;
  }

  if (historyObservationView) {
    renderObservationReviewBody(historyObservationView.dataset.historyObservationView, { readOnlyResolution: true });
    return;
  }

  if (historyResolutionView) {
    const observationKey = historyResolutionView.dataset.historyResolutionView;
    historyResolutionView.disabled = true;
    historyResolutionView.innerHTML = `<i class="bi bi-hourglass-split"></i> Abriendo`;

    try {
      await markDelegateResolutionNotificationAsRead(observationKey);
    } catch (error) {
      console.warn("No se pudo marcar la resolución como leída:", error);
    }

    renderObservationReviewBody(observationKey, { readOnlyResolution: true });
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
    adminObserverDocument?.value.trim() &&
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
  adminObserverDocument.value = user.documento || "";
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

  try {
    const categoryId = newCategoryId?.value || "";
    const payload = {
      nombre: newCategoryName.value.trim(),
      descripcion: newCategoryDescription?.value.trim() || ""
    };

    if (categoryId) {
      const confirmed = await requestConfirmation({
        title: "Guardar cambios",
        message: "Se van a guardar los cambios de esta categoría. ¿Confirmás la edición?",
        confirmLabel: "Guardar cambios"
      });
      if (!confirmed) return;
    } else {
      const confirmed = await requestConfirmation({
        title: "Crear categoría",
        message: "Se va a crear una nueva categoría. ¿Confirmás el alta?",
        confirmLabel: "Crear categoría"
      });
      if (!confirmed) return;
    }

    createCategoryButton.disabled = true;
    createCategoryButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

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
      invalidateAdminMetrics();
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

  if (id) {
    const confirmed = await requestConfirmation({
      title: "Guardar cambios",
      message: "Se van a guardar los cambios de esta división. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;
  } else {
    const confirmed = await requestConfirmation({
      title: "Crear división",
      message: "Se va a crear una nueva división. ¿Confirmás el alta?",
      confirmLabel: "Crear división"
    });
    if (!confirmed) return;
  }

  saveDivisionButton.disabled = true;
  saveDivisionButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

  try {
    if (id) {
      await apiPut(`/divisiones/${id}`, payload);
    } else {
      await apiPost("/divisiones", payload);
    }

    invalidateAdminMetrics();
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
    documento: adminObserverDocument.value.trim(),
    contacto: adminObserverContact.value.trim(),
    usuario: adminObserverUsername.value.trim(),
    password: adminObserverPassword.value
  };

  if (id && !payload.password) {
    delete payload.password;
  }

  if (id) {
    const confirmed = await requestConfirmation({
      title: "Guardar cambios",
      message: "Se van a guardar los cambios de este veedor. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;
  } else {
    const confirmed = await requestConfirmation({
      title: "Crear veedor",
      message: "Se va a crear un nuevo veedor. ¿Confirmás el alta?",
      confirmLabel: "Crear veedor"
    });
    if (!confirmed) return;
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

newTeamForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (createTeamButton.disabled) return;

  const editingTeamId = newTeamForm?.dataset.editingId || "";
  if (editingTeamId) {
    const confirmed = await requestConfirmation({
      title: "Guardar cambios",
      message: "Se van a guardar los cambios de este equipo. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;
  } else {
    const confirmed = await requestConfirmation({
      title: "Crear equipo",
      message: "Se va a crear un nuevo equipo. ¿Confirmás el alta?",
      confirmLabel: "Crear equipo"
    });
    if (!confirmed) return;
  }

  createTeamButton.disabled = true;
  createTeamButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

  try {
    await createTeamInSupabase();
    createTeamButton.classList.remove("is-saved");
    createTeamButton.classList.add("is-saved");
    createTeamButton.innerHTML = `<i class="bi bi-check2-circle"></i> Equipo creado`;
    bootstrap.Modal.getInstance(newTeamModalElement)?.hide();
    newTeamForm.dataset.editingId = "";
    newTeamForm.reset();
    populateNewTeamDivisions("");
    validateNewTeamForm();
    const category = contentShell.querySelector("[data-admin-team-category]")?.value || "";
    const division = contentShell.querySelector("[data-admin-team-division]")?.value || "";
    contentShell.innerHTML = await renderAdminTeamsView(category, division);
    invalidateAdminMetrics();
  } catch (error) {
    console.error("Error al crear el equipo:", error);
    createTeamButton.disabled = false;
    createTeamButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
  }
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

newDelegateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (createDelegateButton.disabled) return;

  const editingDelegateId = newDelegateForm?.dataset.editingId || "";
  if (editingDelegateId) {
    const confirmed = await requestConfirmation({
      title: "Guardar cambios",
      message: "Se van a guardar los cambios de este delegado. ¿Confirmás la edición?",
      confirmLabel: "Guardar cambios"
    });
    if (!confirmed) return;
  } else {
    const confirmed = await requestConfirmation({
      title: "Crear delegado",
      message: "Se va a crear un nuevo delegado. ¿Confirmás el alta?",
      confirmLabel: "Crear delegado"
    });
    if (!confirmed) return;
  }

  createDelegateButton.disabled = true;
  createDelegateButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

  try {
    await createDelegateInSupabase();
    createDelegateButton.classList.remove("is-saved");
    createDelegateButton.classList.add("is-saved");
    createDelegateButton.innerHTML = `<i class="bi bi-check2-circle"></i> Delegado creado`;
    bootstrap.Modal.getInstance(newDelegateModalElement)?.hide();
    newDelegateForm.dataset.editingId = "";
    newDelegateTeam.disabled = false;
    newDelegatePassword.required = true;
    newDelegateForm.reset();
    validateNewDelegateForm();
    const category = contentShell.querySelector("[data-admin-delegate-category]")?.value || "";
    const division = contentShell.querySelector("[data-admin-delegate-division]")?.value || "";
    contentShell.innerHTML = await renderAdminDelegatesView(category, division);
  } catch (error) {
    console.error("Error al crear el delegado:", error);
    createDelegateButton.disabled = false;
    createDelegateButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
  }
});

delegatePlayerForm?.addEventListener("input", validateDelegatePlayerForm);
delegatePlayerForm?.addEventListener("change", validateDelegatePlayerForm);

delegatePlayerDni?.addEventListener("input", () => {
  delegatePlayerDni.value = delegatePlayerDni.value.replace(/\D/g, "");
  validateDelegatePlayerForm();
});

delegatePlayerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!saveDelegatePlayerButton || saveDelegatePlayerButton.disabled) return;

  const team = getTeam(sidebarContent.dataset.currentDelegateTeam);
  if (!team) return;
  const editingId = delegatePlayerForm?.dataset.editingId || "";

  if (!isPlayerRegistrationOpen()) {
    alert(`La edición de jugadores está cerrada. Período: ${tournamentSettings.playerRegistrationFrom} al ${tournamentSettings.playerRegistrationTo}.`);
    return;
  }

  const confirmed = await requestConfirmation({
    title: editingId ? "Guardar cambios" : "Cargar jugador",
    message: editingId
      ? "Se van a guardar los cambios del jugador. ¿Confirmás la edición?"
      : "Se va a cargar un nuevo jugador en el plantel. ¿Confirmás el alta?",
    confirmLabel: editingId ? "Guardar cambios" : "Cargar jugador"
  });
  if (!confirmed) return;

  saveDelegatePlayerButton.disabled = true;
  saveDelegatePlayerButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

  try {
    await saveDelegatePlayerInSupabase(team);
    invalidateAdminMetrics();
    await loadDivisionDataFromSupabase(activeDivisionId || team.division_id);
    const updatedTeam = getTeam(team.id);
    if (!updatedTeam) {
      throw new Error("El jugador se guardó, pero no se pudo recargar el equipo desde Supabase.");
    }
    bootstrap.Modal.getInstance(delegatePlayerModalElement)?.hide();
    delegatePlayerForm.reset();
    delegatePlayerForm.dataset.editingId = "";
    validateDelegatePlayerForm();
    contentShell.innerHTML = renderDelegatePlayers(updatedTeam);
  } catch (error) {
    console.error("Error al guardar el jugador:", error);
    if (delegatePlayerFeedback) {
      delegatePlayerFeedback.textContent = error.message || "No se pudo guardar el jugador.";
      delegatePlayerFeedback.classList.add("is-error");
    }
    saveDelegatePlayerButton.disabled = false;
    saveDelegatePlayerButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
  }
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

newObserverForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (createObserverButton.disabled) return;

  const confirmed = await requestConfirmation({
    title: "Crear veedor",
    message: "Se va a crear un nuevo veedor. ¿Confirmás el alta?",
    confirmLabel: "Crear veedor"
  });
  if (!confirmed) return;

  createObserverButton.disabled = true;
  createObserverButton.innerHTML = `<i class="bi bi-hourglass-split"></i> Guardando`;

  try {
    await apiPost("/veedores", {
      nombre: newObserverFirstName.value.trim(),
      apellido: newObserverLastName.value.trim(),
      documento: newObserverDocument.value.trim(),
      contacto: newObserverContact.value.trim(),
      usuario: newObserverUsername.value.trim(),
      password: newObserverPassword.value
    });
    createObserverButton.classList.remove("is-saved");
    createObserverButton.classList.add("is-saved");
    createObserverButton.innerHTML = `<i class="bi bi-check2-circle"></i> Veedor creado`;
    bootstrap.Modal.getInstance(newObserverModalElement)?.hide();
    contentShell.innerHTML = await renderAdminObserversView();
  } catch (error) {
    console.error("Error al crear el veedor:", error);
    createObserverButton.disabled = false;
    createObserverButton.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Reintentar`;
  }
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
  const fixtureSelect = event.target.closest("[data-team-fixture-select]");

  if (statSelect) {
    updateTeamStats(statSelect.value);
    return;
  }

  if (fixtureSelect) {
    selectedTeamFixtureRound = fixtureSelect.value;
    renderTeamDetail();
  }
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
loadPublicSettingsFromSupabase().finally(showLandingVideoModal);
loadTournamentSettingsFromSupabase();
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
  adminSettingsSession = null;
  observerSettingsSession = null;
  delegateSettingsSession = null;
  currentAppUser = null;
  currentAiReport = null;

  const username = document.querySelector("#username").value.trim();
  const password = document.querySelector("#password").value;
  const role = getActiveLoginRole();

  if (role === "Administrador") {
    const usuarioApp = await loginUsuariosApp(username, password);
    if (!usuarioApp) return;

    if (!["admin", "superadmin"].includes(usuarioApp.rol)) {
      showLoginError(`El rol "${usuarioApp.rol}" no está autorizado para este ingreso.`);
      return;
    }

    adminSettingsSession = {
      usuario: usuarioApp.usuario || username.trim(),
      password: password.trim()
    };
    currentAppUser = usuarioApp;

    const modalElement = document.querySelector("#loginModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
      modalInstance.hide();
    }

    showProfileLoader("Administrador", enterAdminView);
    loginForm.reset();
    return;
  }
  if (role === "Veedor") {
    const usuarioApp = await loginUsuariosApp(username, password);
    if (!usuarioApp) return;

    if (usuarioApp.rol !== "veedor") {
      showLoginError(`El rol "${usuarioApp.rol}" no está autorizado para este ingreso.`);
      return;
    }

    const modalElement = document.querySelector("#loginModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
      modalInstance.hide();
    }

    observerSettingsSession = {
      usuario: usuarioApp.usuario || username.trim(),
      password: password.trim()
    };
    currentAppUser = usuarioApp;
    showProfileLoader("Veedor", enterObserverView);
    loginForm.reset();
    return;
  }

  if (role === "Delegado") {
    const usuarioApp = await loginUsuariosApp(username, password);
    if (!usuarioApp) return;

    if (usuarioApp.rol !== "delegado") {
      showLoginError(`El rol "${usuarioApp.rol}" no está autorizado para este ingreso.`);
      return;
    }

    let team = null;
    try {
      team = await getDelegateTeamFromSupabase(usuarioApp);
    } catch (error) {
      console.error("Error al resolver el equipo del delegado:", error);
      showLoginError("No se pudo cargar el equipo asociado al delegado desde Supabase.");
      return;
    }

    if (team) {
      delegateSettingsSession = {
        usuario: usuarioApp.usuario || username.trim(),
        password: password.trim()
      };
      currentAppUser = usuarioApp;
      const modalElement = document.querySelector("#loginModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);

      if (modalInstance) {
        modalInstance.hide();
      }

      showProfileLoader("Delegado", () => enterDelegateView(team));
      loginForm.reset();
      return;
    }

    showLoginError(`El delegado "${usuarioApp.usuario}" no tiene un equipo activo asociado.`);
    return;
  }
  showLoginError("Usuario o contraseña incorrectos.");
});

syncRequiredFieldIndicators();
document.querySelectorAll(".frame-form-modal").forEach((modal) => {
  modal.addEventListener("show.bs.modal", () => syncRequiredFieldIndicators(modal));
});

if (contentShell) {
  const requiredFieldsObserver = new MutationObserver(() => syncRequiredFieldIndicators(contentShell));
  requiredFieldsObserver.observe(contentShell, { childList: true, subtree: true });
}

