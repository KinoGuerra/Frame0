const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const script = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
const extract = (start, end) => script.slice(script.indexOf(start), script.indexOf(end, script.indexOf(start)));
const context = {
  previousTournamentError: false,
  previousTournament: {
    nombre: "Copa <2025>", archivado_en: "2025-12-01T18:00:00Z",
    datos: {
      categorias: [{ id: "c", nombre: "Primera" }],
      divisiones: [{ id: "d", categoria_id: "c", nombre: "A" }],
      equipos: [
        { id: "a", division_id: "d", nombre: "Azul", nombre_corto: "Azul" },
        { id: "b", division_id: "d", nombre: "Blanco", nombre_corto: "Blanco" }
      ],
      partidos: [{ division_id: "d", equipo_local_id: "a", equipo_visitante_id: "b", goles_local: 2, goles_visitante: 1, estado: "finalizado", observaciones: "Fecha 1" }]
    }
  },
  normalizeSupabaseTeam: (team) => ({ id: team.id, name: team.nombre, shortName: team.nombre_corto }),
  normalizeSupabaseMatch: (match) => ({ home: match.equipo_local_id, away: match.equipo_visitante_id, homeGoals: match.goles_local, awayGoals: match.goles_visitante }),
  getFixtureRound: (match) => String(match.observaciones).match(/\d+/)?.[0] || "1",
  escapeHtml: (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
};
vm.runInNewContext(`${extract("function calculateStandingsFromMatches(", "function getPlayerDataSession(")}\n${extract("function renderPreviousTournamentContent()", "async function showPublicInfo(")}\nthis.render = renderPreviousTournamentContent;`, context);

test("el historial muestra resultados y posiciones sin controles de edición", () => {
  const html = context.render();
  assert.match(html, /Copa &lt;2025&gt;/);
  assert.match(html, /Azul/);
  assert.match(html, /<td>3<\/td><td>1<\/td>/);
  assert.match(html, /2 - 1/);
  assert.doesNotMatch(html, /<(?:button|input|textarea)\b/i);
});
