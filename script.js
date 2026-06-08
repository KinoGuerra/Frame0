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
const sidebarContent = document.querySelector("#sidebarContent");
const contentShell = document.querySelector("#contentShell");
const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("[data-password-toggle]");
const observationModalElement = document.querySelector("#observationModal");
const observationText = document.querySelector("#observationText");
const saveObservationButton = document.querySelector("#saveObservation");

let divisionLoadTimer;
let selectedTeamId = null;
let activeObservationButton = null;

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

const observerMatches = [
  { id: "v-1", date: "08/06/2026", home: "belgrano", away: "instituto", homeGoals: 2, awayGoals: 1 },
  { id: "v-2", date: "08/06/2026", home: "boca", away: "river", homeGoals: 1, awayGoals: 1 },
  { id: "v-3", date: "08/06/2026", home: "real", away: "barcelona", homeGoals: null, awayGoals: null },
  { id: "v-4", date: "08/06/2026", home: "manchester", away: "belgrano", homeGoals: null, awayGoals: null }
];

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

function renderProfileLoader(roleName) {
  return `
    <div class="profile-loader-shell" role="status" aria-live="polite">
      <div class="division-loader">
        <div class="loader-stage" aria-hidden="true">
          <img src="assets/frame0-logo.png" alt="" class="loader-logo">
          <div class="ball-track">
            <div class="soccer-spinner"></div>
          </div>
        </div>
        <span>Cargando ${roleName}...</span>
      </div>
    </div>
  `;
}

function showContentLoader(sectionName, callback) {
  contentShell.innerHTML = renderProfileLoader(sectionName);
  window.setTimeout(callback, 650);
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

function renderDelegatePlayers(team) {
  return `
    <div class="fixture-toolbar delegate-players-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Delegado</p>
        <h2>Jugadores de ${team.shortName}</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button">
        <i class="bi bi-plus-lg"></i>
        Agregar jugador
      </button>
    </div>
    <section class="division-table-panel">
      <div class="table-responsive">
        <table class="table frame-table delegate-players-table mb-0">
          <thead>
            <tr>
              <th>Num</th>
              <th>Apellido y nombre</th>
              <th>Fecha nac.</th>
              <th>Estado</th>
              <th>#</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${team.players.map((player, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${String(10 + (index % 20)).padStart(2, "0")}/03/${1990 + (index % 15)}</td>
                <td><span class="player-status ${getPlayerStatus(player).toLowerCase()}">${getPlayerStatus(player)}</span></td>
                <td>${player.number}</td>
                <td>
                  <div class="table-actions">
                    <button type="button" aria-label="Editar ${player.name}"><i class="bi bi-pencil-fill"></i></button>
                    <button type="button" aria-label="Eliminar ${player.name}"><i class="bi bi-trash-fill"></i></button>
                  </div>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function getObserverMatch(matchId) {
  return observerMatches.find((match) => match.id === matchId);
}

function renderObserverMatchRows() {
  return observerMatches.map((match) => {
    const homeTeam = getTeam(match.home);
    const awayTeam = getTeam(match.away);
    const score = match.homeGoals === null || match.awayGoals === null ? "" : `${match.homeGoals} - ${match.awayGoals}`;

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
            <button type="button" aria-label="Editar partido" data-observer-edit-match="${match.id}">
              <i class="bi bi-pencil-fill"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderObserverMatches() {
  return `
    <div class="section-toolbar admin-toolbar">
      <div>
        <p class="section-kicker section-brand mb-1">Frame0</p>
        <h2 class="section-title mb-0">Partidos del día</h2>
      </div>
    </div>

    <section class="division-table-panel observer-panel">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Veedor</p>
        <h2>Fecha 08/06/2026</h2>
      </div>
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
          <tbody>${renderObserverMatchRows()}</tbody>
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

function renderObserverPlayerRows(team) {
  return team.players.map((player) => `
    <tr>
      <td>${player.name}</td>
      <td>${player.number}</td>
      <td>
        <div class="event-actions">
          <button class="event-btn player-of-match" type="button" aria-label="Jugador del partido">
            <i class="bi bi-star-fill"></i>
          </button>
          <button class="event-btn yellow-card" type="button" aria-label="Tarjeta amarilla">
            <i class="bi bi-square-fill"></i>
          </button>
          <button class="event-btn red-card" type="button" aria-label="Tarjeta roja">
            <i class="bi bi-square-fill"></i>
          </button>
        </div>
      </td>
      <td>
        <div class="goal-counter">
          <button type="button" data-goal-dec aria-label="Restar gol"><i class="bi bi-dash-lg"></i></button>
          <span><i class="bi bi-circle-fill goal-ball-icon"></i></span>
          <strong data-goal-value>0</strong>
          <button type="button" data-goal-inc aria-label="Sumar gol"><i class="bi bi-plus-lg"></i></button>
        </div>
      </td>
      <td>
        <button class="observation-btn" type="button" data-observation aria-label="Agregar observación disciplinaria">
          <i class="bi bi-file-earmark-text-fill"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

function renderObserverPlayersTable(team, sideLabel) {
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
              <th>Incidencias</th>
              <th>Goles</th>
              <th>Obs.</th>
            </tr>
          </thead>
          <tbody>${renderObserverPlayerRows(team)}</tbody>
        </table>
      </div>
    </section>
  `;
}

function renderObserverEditMatch(matchId) {
  const match = getObserverMatch(matchId);
  if (!match) return renderObserverMatches();

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
      ${renderObserverPlayersTable(homeTeam, "Equipo 1")}
      ${renderObserverPlayersTable(awayTeam, "Equipo 2")}
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
          <strong>${metrics.categories.length}</strong>
          <div class="quick-stat-copy">
            <span>Categorías</span>
            <small>Libre, Senior, Femenino</small>
          </div>
        </div>
      </div>
      <div class="quick-stat">
        <i class="bi bi-shield-fill-check"></i>
        <div class="quick-stat-content">
          <strong>${metrics.totalTeams}</strong>
          <div class="quick-stat-copy">
            <span>Equipos</span>
            <small>Total general de la competencia</small>
          </div>
        </div>
      </div>
      <div class="quick-stat">
        <i class="bi bi-people-fill"></i>
        <div class="quick-stat-content">
          <strong>${metrics.totalPlayers}</strong>
          <div class="quick-stat-copy">
            <span>Jugadores</span>
            <small>Estimación demo del torneo</small>
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

function renderAdminTeamRows(hasCompletedFilters) {
  if (!hasCompletedFilters) {
    return `
      <tr>
        <td colspan="4" class="admin-empty-row">Seleccioná categoría y división para visualizar equipos.</td>
      </tr>
    `;
  }

  return teams.map((team, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>
        <span class="fixture-team">${renderTeamBadge(team, "small")} ${team.shortName}</span>
      </td>
      <td>${team.delegate}</td>
      <td>
        <div class="table-actions">
          <button type="button" aria-label="Editar ${team.shortName}">
            <i class="bi bi-pencil-fill"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function renderAdminTeamsView(selectedCategory = "", selectedDivision = "") {
  const divisionMap = getAdminDivisionMap();
  const categories = Object.keys(divisionMap);
  const divisions = selectedCategory ? divisionMap[selectedCategory] : [];
  const hasCompletedFilters = Boolean(selectedCategory && selectedDivision);

  return `
    <div class="fixture-toolbar delegate-players-toolbar admin-teams-toolbar">
      <div class="division-section-heading">
        <p class="section-kicker mb-1">Administrador</p>
        <h2>Equipos</h2>
      </div>
      <button class="btn btn-ingreso delegate-add-player" type="button">
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
          <tbody>${renderAdminTeamRows(hasCompletedFilters)}</tbody>
        </table>
      </div>
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
        <div class="admin-actions">
          <button class="division-link" type="button" data-delegate-home>
            <i class="bi bi-house-fill"></i>
            Resumen
          </button>
          <button class="division-link" type="button" data-delegate-players>
            <i class="bi bi-people-fill"></i>
            Jugadores
          </button>
        </div>
      </div>
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
          </button>
          <button class="division-link" type="button" data-admin-action="Configuraciones">
            <i class="bi bi-gear-fill"></i>
            Configuraciones
          </button>
        </div>
      </div>
      <button class="btn btn-ingreso w-100" type="button" data-admin-logout>
        <i class="bi bi-box-arrow-left"></i>
        Salir
      </button>
    </div>
  `;
  contentShell.innerHTML = renderAdminHome();
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
        <div class="admin-actions">
          <button class="division-link" type="button" data-observer-matches>
            <i class="bi bi-calendar2-week-fill"></i>
            Partidos
          </button>
        </div>
      </div>
      <button class="btn btn-ingreso w-100" type="button" data-admin-logout>
        <i class="bi bi-box-arrow-left"></i>
        Salir
      </button>
    </div>
  `;
  contentShell.innerHTML = renderObserverMatches();
  document.body.classList.add("admin-view");
}

divisionButtons.forEach((button) => {
  button.addEventListener("click", () => setSelectedDivision(button));
});

document.querySelector(".frame-logo").addEventListener("click", showHome);

passwordToggle.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "text";

  passwordInput.type = isPasswordVisible ? "password" : "text";
  passwordToggle.setAttribute("aria-label", isPasswordVisible ? "Mostrar contraseña" : "Ocultar contraseña");
  passwordToggle.innerHTML = `<i class="bi ${isPasswordVisible ? "bi-eye-fill" : "bi-eye-slash-fill"}"></i>`;
});

sidebarContent.addEventListener("click", (event) => {
  const logoutButton = event.target.closest("[data-admin-logout]");
  const delegatePlayersButton = event.target.closest("[data-delegate-players]");
  const delegateHomeButton = event.target.closest("[data-delegate-home]");
  const observerMatchesButton = event.target.closest("[data-observer-matches]");
  const adminActionButton = event.target.closest("[data-admin-action]");

  if (delegatePlayersButton || delegateHomeButton) {
    const team = getTeam(sidebarContent.dataset.delegateTeam);
    const sectionName = delegatePlayersButton ? "Jugadores" : "Resumen";
    showContentLoader(sectionName, () => {
      contentShell.innerHTML = delegatePlayersButton ? renderDelegatePlayers(team) : renderDelegateHome(team);
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
    showContentLoader(actionName, () => {
      contentShell.innerHTML = actionName === "Equipos" ? renderAdminTeamsView() : renderAdminActionView(actionName);
    });
    return;
  }

  if (!logoutButton) return;

  window.location.href = "index.html#home";
  window.location.reload();
});

contentShell.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-observer-edit-match]");
  const observerBackButton = event.target.closest("[data-observer-back]");
  const scoreIncButton = event.target.closest("[data-score-inc]");
  const scoreDecButton = event.target.closest("[data-score-dec]");
  const goalIncButton = event.target.closest("[data-goal-inc]");
  const goalDecButton = event.target.closest("[data-goal-dec]");
  const eventButton = event.target.closest(".event-btn");
  const observationButton = event.target.closest("[data-observation]");
  const observerSaveButton = event.target.closest("[data-observer-save]");

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

  if (observationButton) {
    activeObservationButton = observationButton;
    observationText.value = observationButton.dataset.observationText || "";
    const observationModal = bootstrap.Modal.getOrCreateInstance(observationModalElement);
    observationModal.show();
  }
});

contentShell.addEventListener("change", (event) => {
  const categorySelect = event.target.closest("[data-admin-team-category]");
  const divisionSelect = event.target.closest("[data-admin-team-division]");

  if (categorySelect) {
    const category = categorySelect.value;
    showContentLoader("Equipos", () => {
      contentShell.innerHTML = renderAdminTeamsView(category, "");
    });
    return;
  }

  if (divisionSelect) {
    const category = contentShell.querySelector("[data-admin-team-category]")?.value || "";
    const division = divisionSelect.value;
    showContentLoader("Equipos", () => {
      contentShell.innerHTML = renderAdminTeamsView(category, division);
    });
  }
});

saveObservationButton.addEventListener("click", () => {
  if (!activeObservationButton) return;

  const text = observationText.value.trim();
  activeObservationButton.dataset.observationText = text;
  activeObservationButton.classList.toggle("has-observation", Boolean(text));

  const observationModal = bootstrap.Modal.getInstance(observationModalElement);
  if (observationModal) {
    observationModal.hide();
  }
});

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
  const password = document.querySelector("#password").value;
  const role = getActiveLoginRole();

  if (role === "Administrador" && username.toLowerCase() === "admin" && password === "123456") {
    const modalElement = document.querySelector("#loginModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
      modalInstance.hide();
    }

    showProfileLoader("Administrador", enterAdminView);
    loginForm.reset();
    return;
  }

  if (username.toLowerCase() === "veedor" && password === "123456") {
    const modalElement = document.querySelector("#loginModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
      modalInstance.hide();
    }

    showProfileLoader("Veedor", enterObserverView);
    loginForm.reset();
    return;
  }

  const team = getTeamFromUsername(username);

  if (team && password === "123456") {
    const modalElement = document.querySelector("#loginModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
      modalInstance.hide();
    }

    showProfileLoader("Delegado", () => enterDelegateView(team));
    loginForm.reset();
    return;
  }

  alert("Usuario o contraseña incorrectos.");
});
