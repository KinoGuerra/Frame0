const selectedDivision = document.querySelector("#selectedDivision");
const divisionButtons = document.querySelectorAll(".division-link");
const homeContent = document.querySelector("#homeContent");
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

let divisionLoadTimer;
let selectedTeamId = null;

const teams = [
  {
    id: "belgrano",
    name: "Belgrano de Córdoba",
    shortName: "Belgrano",
    initials: "BEL",
    colors: ["#58aee8", "#111827"],
    city: "Córdoba Capital",
    captain: "Matías Rojas",
    delegate: "Delegado: Hernán Suárez",
    topScorer: "Pablo Heredia",
    mostSanctioned: "Iván Molina",
    players: ["Pablo Heredia", "Iván Molina", "Franco Nieto", "Agustín Peralta", "Juan Sosa", "Lucas Arce", "Tomás Ferreyra", "Martín Quiroga"],
    founded: "Equipo invitado",
    description: "Plantel competitivo de la zona norte, fuerte en pelota parada y transiciones rápidas."
  },
  {
    id: "instituto",
    name: "Instituto de Córdoba",
    shortName: "Instituto",
    initials: "INS",
    colors: ["#e11d48", "#ffffff"],
    city: "Alta Córdoba",
    captain: "Lucas Gómez",
    delegate: "Delegada: Camila Torres",
    topScorer: "Lucas Gómez",
    mostSanctioned: "Emanuel Pérez",
    players: ["Lucas Gómez", "Emanuel Pérez", "Mateo Roldán", "Facundo Vega", "Joaquín Ruiz", "Nicolás Castro", "Alan Moreno", "Brian Díaz"],
    founded: "Equipo invitado",
    description: "Equipo intenso, con presión alta y buen volumen ofensivo por las bandas."
  },
  {
    id: "boca",
    name: "Boca Juniors",
    shortName: "Boca",
    initials: "BOC",
    colors: ["#0033a0", "#f7c600"],
    city: "Buenos Aires",
    captain: "Nicolás Vega",
    delegate: "Delegado: Rodrigo Méndez",
    topScorer: "Nicolás Vega",
    mostSanctioned: "Lautaro Silva",
    players: ["Nicolás Vega", "Lautaro Silva", "Diego Romero", "Matías Ocampo", "Enzo Farías", "Bruno Acosta", "Santiago Leiva", "Kevin Torres"],
    founded: "Equipo invitado",
    description: "Conjunto ordenado, de bloque compacto y buen rendimiento en partidos cerrados."
  },
  {
    id: "river",
    name: "River Plate",
    shortName: "River",
    initials: "RIV",
    colors: ["#ffffff", "#d71920"],
    city: "Buenos Aires",
    captain: "Santiago Arias",
    delegate: "Delegado: Gabriel Núñez",
    topScorer: "Santiago Arias",
    mostSanctioned: "Ramiro Luna",
    players: ["Santiago Arias", "Ramiro Luna", "Federico Vera", "Ignacio Campos", "Ezequiel Ríos", "Gonzalo Medina", "Manuel Cabrera", "Andrés Godoy"],
    founded: "Equipo invitado",
    description: "Equipo de posesión, salida limpia y mucha llegada desde segunda línea."
  },
  {
    id: "real",
    name: "Real Madrid",
    shortName: "Real Madrid",
    initials: "RMA",
    colors: ["#ffffff", "#d4af37"],
    city: "Madrid",
    captain: "Federico Luna",
    delegate: "Delegado: Daniel Ortega",
    topScorer: "Federico Luna",
    mostSanctioned: "Álvaro Martín",
    players: ["Federico Luna", "Álvaro Martín", "Mario Benítez", "Rafael Gil", "Hugo Blanco", "Carlos Méndez", "Sergio Vidal", "Pablo Costa"],
    founded: "Equipo invitado",
    description: "Plantel equilibrado, con buen manejo de tiempos y pegada desde media distancia."
  },
  {
    id: "barcelona",
    name: "Barcelona",
    shortName: "Barcelona",
    initials: "BAR",
    colors: ["#a50044", "#004d98"],
    city: "Barcelona",
    captain: "Julián Paredes",
    delegate: "Delegado: Sebastián Rivas",
    topScorer: "Julián Paredes",
    mostSanctioned: "Maxi Salas",
    players: ["Julián Paredes", "Maxi Salas", "Pedro Font", "Axel Ramos", "Cristian Díaz", "Leo Suárez", "Marcos Peña", "Adrián Vera"],
    founded: "Equipo invitado",
    description: "Equipo asociado, de pases cortos y ataques elaborados por dentro."
  },
  {
    id: "manchester",
    name: "Manchester United",
    shortName: "Man. United",
    initials: "MUN",
    colors: ["#da291c", "#111827"],
    city: "Manchester",
    captain: "Bruno Silva",
    delegate: "Delegado: Mauro Gutiérrez",
    topScorer: "Bruno Silva",
    mostSanctioned: "Tomás Brown",
    players: ["Bruno Silva", "Tomás Brown", "Alan Smith", "Franco Gómez", "Miguel Torres", "Javier Ruiz", "Nico Herrera", "Damián López"],
    founded: "Equipo invitado",
    description: "Equipo físico, vertical y peligroso cuando encuentra espacios para correr."
  }
];

const standings = [
  { teamId: "belgrano", pts: 12, pj: 4, g: 4, e: 0, p: 0, dg: 9 },
  { teamId: "barcelona", pts: 10, pj: 4, g: 3, e: 1, p: 0, dg: 8 },
  { teamId: "real", pts: 9, pj: 4, g: 3, e: 0, p: 1, dg: 6 },
  { teamId: "river", pts: 7, pj: 4, g: 2, e: 1, p: 1, dg: 3 },
  { teamId: "boca", pts: 6, pj: 4, g: 2, e: 0, p: 2, dg: 1 },
  { teamId: "instituto", pts: 3, pj: 4, g: 1, e: 0, p: 3, dg: -4 },
  { teamId: "manchester", pts: 1, pj: 4, g: 0, e: 1, p: 3, dg: -8 }
];

const fixtures = {
  1: [
    { status: "Final", home: "belgrano", away: "instituto", homeGoals: 2, awayGoals: 1 },
    { status: "Final", home: "boca", away: "river", homeGoals: 1, awayGoals: 1 },
    { status: "Final", home: "real", away: "barcelona", homeGoals: 2, awayGoals: 3 }
  ],
  2: [
    { status: "Final", home: "barcelona", away: "manchester", homeGoals: 4, awayGoals: 0 },
    { status: "Final", home: "river", away: "belgrano", homeGoals: 2, awayGoals: 0 },
    { status: "Final", home: "instituto", away: "boca", homeGoals: 0, awayGoals: 1 }
  ],
  3: [
    { status: "A disputar", home: "belgrano", away: "boca", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "instituto", away: "real", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "manchester", away: "river", homeGoals: null, awayGoals: null }
  ],
  4: [
    { status: "A disputar", home: "barcelona", away: "belgrano", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "boca", away: "real", homeGoals: null, awayGoals: null },
    { status: "A disputar", home: "river", away: "instituto", homeGoals: null, awayGoals: null }
  ]
};

function getTeam(teamId) {
  return teams.find((team) => team.id === teamId);
}

function getBadgeStyle(team) {
  return `--badge-primary: ${team.colors[0]}; --badge-secondary: ${team.colors[1]};`;
}

function renderTeamBadge(team, sizeClass = "") {
  return `<span class="team-badge ${sizeClass}" style="${getBadgeStyle(team)}">${team.initials}</span>`;
}

function truncateTeamName(name) {
  return name.length > 12 ? `${name.slice(0, 12)}...` : name;
}

function renderTeamCarousel() {
  teamCarousel.innerHTML = teams.map((team) => `
    <button class="team-card ${team.id === selectedTeamId ? "active" : ""}" type="button" data-team-id="${team.id}">
      ${renderTeamBadge(team)}
      <span>${team.shortName}</span>
    </button>
  `).join("");
}

function getTeamStanding(teamId) {
  return standings.find((row) => row.teamId === teamId);
}

function renderTeamDetail() {
  const team = getTeam(selectedTeamId);
  const standing = getTeamStanding(selectedTeamId);

  teamDetailView.innerHTML = `
    <button class="back-to-division" type="button" data-back-to-division>
      <i class="bi bi-arrow-left"></i>
      Volver
    </button>
    <div class="team-detail-header">
      ${renderTeamBadge(team)}
      <div>
        <p class="section-kicker mb-1">Información del equipo</p>
        <h2>${team.name}</h2>
        <p>${team.description}</p>
      </div>
    </div>
    <div class="team-detail-stats">
      <div class="team-detail-stat">
        <span>Delegado</span>
        <strong>${team.delegate}</strong>
      </div>
      <div class="team-detail-stat">
        <span>Partidos jugados</span>
        <strong>${standing.pj}</strong>
      </div>
      <div class="team-detail-stat">
        <span>Goleador</span>
        <strong>${team.topScorer}</strong>
      </div>
      <div class="team-detail-stat">
        <span>Más sanciones</span>
        <strong>${team.mostSanctioned}</strong>
      </div>
    </div>
    <div class="players-list">
      <h3>Jugadores</h3>
      <div class="players-grid">
        ${team.players.map((player, index) => `
          <div class="player-pill">
            <span>${player}</span>
            <small>#${index + 1}</small>
          </div>
        `).join("")}
      </div>
    </div>
  `;
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
  renderTeamCarousel();
  renderTeamDetail();
  divisionTables.classList.add("d-none");
  teamDetailView.classList.remove("d-none");
}

function renderDivisionView(divisionName) {
  selectedTeamId = null;
  divisionTitle.textContent = divisionName;
  renderTeamCarousel();
  renderStandings();
  renderFixture();
  teamDetailView.classList.add("d-none");
  divisionTables.classList.remove("d-none");
}

function setSelectedDivision(button) {
  const divisionName = button.dataset.division;

  divisionButtons.forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  button.classList.add("is-clicking");

  selectedDivision.textContent = `División seleccionada: ${divisionName}`;
  selectedDivision.classList.remove("d-none");
  homeContent.classList.add("d-none");
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
  divisionButtons.forEach((item) => item.classList.remove("active"));
  selectedDivision.classList.add("d-none");
  homeContent.classList.remove("d-none");
  divisionContent.classList.add("d-none");
  divisionLoader.classList.remove("is-hidden");
  divisionView.classList.add("d-none");
  window.clearTimeout(divisionLoadTimer);
}

function getActiveLoginRole() {
  const activeTab = document.querySelector("#loginRoleTabs .nav-link.active");
  return activeTab ? activeTab.dataset.role : "Delegado";
}

divisionButtons.forEach((button) => {
  button.addEventListener("click", () => setSelectedDivision(button));
});

document.querySelector(".frame-logo").addEventListener("click", showHome);

document.querySelectorAll("[data-scroll-team]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = Number(button.dataset.scrollTeam);
    teamCarousel.scrollBy({ left: direction * 260, behavior: "smooth" });
  });
});

teamCarousel.addEventListener("click", (event) => {
  const teamButton = event.target.closest("[data-team-id]");
  if (!teamButton) return;

  selectTeam(teamButton.dataset.teamId);
});

teamDetailView.addEventListener("click", (event) => {
  const backButton = event.target.closest("[data-back-to-division]");
  if (!backButton) return;

  showDivisionTables();
});

standingsBody.addEventListener("click", (event) => {
  const teamLink = event.target.closest("[data-team-id]");
  if (!teamLink) return;

  event.preventDefault();
  selectTeam(teamLink.dataset.teamId);
  teamDetailView.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

fixtureDateSelect.addEventListener("change", renderFixture);

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const role = getActiveLoginRole();

  alert(`Ingreso simulado como ${role}: ${username}`);
});
