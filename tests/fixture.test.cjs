const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const script = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
const start = script.indexOf("function buildRoundRobinRounds(");
const end = script.indexOf("async function generateFixturePlan(", start);
assert.ok(start >= 0 && end > start, "No se encontró el generador de fixture");
const context = {
  shuffleItems: (items) => [...items],
  getRoundMatchDateIso: (round) => `2026-07-${String(round).padStart(2, "0")}`,
  DEFAULT_FIXTURE_START_DATE: "2026-07-01",
  DEFAULT_FIXTURE_MATCH_DAY: "0"
};
vm.runInNewContext(`${script.slice(start, end)}\nthis.build = buildRoundRobinRounds;`, context);

const teams = (count) => Array.from({ length: count }, (_, index) => ({ id: String(index + 1), shortName: `Equipo ${index + 1}` }));
const fixture = (count, dates) => context.build(teams(count), dates);
const pair = (match) => [match.homeTeamId, match.awayTeamId].sort().join(":");

test("una rueda completa enfrenta cada par una sola vez", () => {
  for (const count of [3, 4, 5, 6]) {
    const rounds = fixture(count, 1);
    const expectedRounds = count % 2 ? count : count - 1;
    assert.equal(rounds.length, expectedRounds);
    const pairs = rounds.flatMap((round) => round.dbMatches.map(pair));
    assert.equal(new Set(pairs).size, count * (count - 1) / 2);
    rounds.forEach((round) => {
      const participants = round.dbMatches.flatMap((match) => [match.homeTeamId, match.awayTeamId]);
      assert.equal(new Set(participants).size, participants.length);
    });
  }
});

test("la segunda rueda invierte localía y respeta la cantidad pedida", () => {
  for (const count of [2, 3, 4, 5]) {
    const cycle = count % 2 ? count : count - 1;
    const rounds = fixture(count, cycle * 2);
    assert.equal(rounds.length, cycle * 2);
    for (let index = 0; index < cycle; index += 1) {
      const first = rounds[index].dbMatches;
      const returnLeg = rounds[index + cycle].dbMatches;
      assert.deepEqual(first.map(pair), returnLeg.map(pair));
      first.forEach((match, matchIndex) => {
        assert.equal(match.homeTeamId, returnLeg[matchIndex].awayTeamId);
        assert.equal(match.awayTeamId, returnLeg[matchIndex].homeTeamId);
      });
    }
  }
  assert.equal(fixture(4, 4).length, 4);
  assert.equal(fixture(3, 4).length, 4);
});

test("sin rivales no genera fechas", () => {
  assert.equal(fixture(1, 6).length, 0);
});
