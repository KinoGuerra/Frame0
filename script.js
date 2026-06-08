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
    legalName: "Club Atlético Belgrano",
    abbreviation: "CAB",
    shortName: "Belgrano",
    initials: "BEL",
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

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.querySelector("#username").value.trim();
  const role = getActiveLoginRole();

  alert(`Ingreso simulado como ${role}: ${username}`);
});
