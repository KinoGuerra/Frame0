const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "fortune.js"), "utf8");
const extract = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));

test("una corrección de resultado puede dejar saldo negativo", () => {
  const context = {
    fortuneData: {
      activeSeason: { id: "s" },
      points: [{ temporada_id: "s", puntos: 3 }],
      vouchers: [{ temporada_id: "s", costo_puntos: 5 }]
    }
  };
  vm.runInNewContext(`${extract("function fortuneBalance()", "function renderFortuneShellHeader(")}\nthis.balance = fortuneBalance;`, context);
  assert.equal(context.balance().balance, -2);
});

test("un marcador vacío no se guarda como 0 a 0", async () => {
  let calls = 0;
  const card = { querySelector: (selector) => ({ value: selector === "[data-prediction-home]" ? "" : "0" }) };
  const context = {
    document: { querySelector: () => card },
    CSS: { escape: (value) => value },
    supabaseClient: { rpc: async () => { calls += 1; return {}; } },
    showFortunePage: async () => {}
  };
  vm.runInNewContext(`${extract("async function saveFortunePrediction(", "async function redeemFortuneVoucher(")}\nthis.save = saveFortunePrediction;`, context);
  await assert.rejects(context.save("partido-1"), /resultado válido/);
  assert.equal(calls, 0);
});

test("la lectura de vouchers funciona antes de agregar la descripción", async () => {
  const columns = [];
  const context = {
    fortuneParticipant: { id: "p-1" },
    supabaseClient: { from: () => ({
      select: (selection) => {
        columns.push(selection);
        return { eq: () => ({ order: async () => columns.length === 1
          ? { error: { code: "42703" } }
          : { data: [{ id: "v-1" }], error: null } }) };
      }
    }) }
  };
  vm.runInNewContext(`${extract("async function loadParticipantVouchers()", "async function loadFortuneData()") }\nthis.load = loadParticipantVouchers;`, context);
  const result = await context.load();
  assert.equal(result.data[0].id, "v-1");
  assert.match(columns[0], /producto_descripcion/);
  assert.doesNotMatch(columns[1], /producto_descripcion/);
});

test("el historial pagina y muestra solo el documento parcial", async () => {
  const shell = { innerHTML: "" };
  let args;
  const context = {
    constatadorSettingsSession: { usuario: "constatador", password: "clave" },
    document: { querySelector: () => shell },
    supabaseClient: { rpc: async (_name, payload) => {
      args = payload;
      return { data: [{ entregado_at: "2026-10-28T12:00:00Z", codigo: "F0-1",
        producto: "Remera", descripcion: "Azul", titular: "Ana", documento: "123456781234", documento_parcial: "••••1234",
        constatador: "Carlos", correo_estado: "enviado", total: 55 }], error: null };
    } },
    fortuneFormatDate: () => "28/10/2026",
    fortuneEscape: (value) => String(value).replaceAll("<", "&lt;")
  };
  vm.runInNewContext(`${extract("async function showConstatadorDeliveryHistory(", "async function enterConstatadorView()") }\nthis.show = showConstatadorDeliveryHistory;`, context);
  await context.show(2);
  assert.equal(args.p_pagina, 2);
  assert.match(shell.innerHTML, /••••1234/);
  assert.match(shell.innerHTML, /Página 2 de 2/);
  assert.match(shell.innerHTML, /data-constatador-deliveries-page="3" disabled/);
  assert.doesNotMatch(shell.innerHTML, /123456781234/);
});

test("la apuesta cierra al comenzar el día del partido en Argentina", () => {
  const context = { fortuneDayFormatter: new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit"
  }) };
  vm.runInNewContext(`${extract("function fortuneDayKey(", "function fortuneToLocalInput(")}\nthis.open = fortunePredictionOpen;`, context);
  const season = { inicia_at: "2026-11-01T00:00:00-03:00", finaliza_at: "2026-11-10T00:00:00-03:00" };
  const match = { estado: "programado", fecha_hora: "2026-11-03T00:10:00-03:00" };
  assert.equal(context.open(match, season, Date.parse("2026-11-02T23:59:59-03:00")), true);
  assert.equal(context.open(match, season, Date.parse("2026-11-03T00:00:00-03:00")), false);
  assert.equal(context.open({ ...match, fecha_hora: "2026-11-04T00:10:00-03:00" }, season, Date.parse("2026-11-03T00:00:00-03:00")), true);
  assert.equal(context.open({ ...match, estado: "finalizado" }, season, Date.parse("2026-11-02T12:00:00-03:00")), false);
  assert.equal(context.open(match, null, Date.parse("2026-11-02T12:00:00-03:00")), false);
});

test("la tienda pública muestra disponibilidad y exige ingreso para canjear", () => {
  const context = { fortuneData: null, fortuneEscape: (value) => String(value) };
  vm.runInNewContext(`${extract("function renderFortuneRewardCard(", "function renderPublicFortunaStore(")}\nthis.card = renderFortuneRewardCard;`, context);
  const reward = { id: "premio-1", nombre: "Remera", descripcion: "Azul", costo_puntos: 5, vigencia_dias: 7, disponibles: 2 };
  assert.match(context.card(reward), /2 disponibles/);
  assert.match(context.card(reward), /data-participant-auth/);
  assert.doesNotMatch(context.card(reward), /data-redeem-voucher/);
  assert.match(context.card({ ...reward, disponibles: 0 }), /Sin stock/);
  assert.match(context.card({ ...reward, disponibles: 0 }), /data-participant-auth disabled/);
  context.fortuneData = { activeSeason: { id: "campaña-1" } };
  assert.match(context.card(reward, 5), /data-redeem-voucher="premio-1"/);
  assert.match(context.card(reward, 4), /data-redeem-voucher="premio-1" disabled/);
});

test("el fixture sigue visible sin campaña y los partidos cerrados no tienen controles", () => {
  const context = {
    fortuneData: { activeSeason: null, predictions: [], matches: [
      { id: "final", division_id: "d", fecha_hora: "2026-11-01T15:00:00-03:00", estado: "finalizado", goles_local: 2, goles_visitante: 1 },
      { id: "pendiente", division_id: "d", fecha_hora: null, estado: "programado", goles_local: null, goles_visitante: null }
    ], divisionMap: new Map([["d", { nombre: "Primera", categoria_id: "c" }]]), categoryMap: new Map([["c", { nombre: "Mayores" }]]) },
    fortuneDayFormatter: new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit" }),
    fortuneLongDayFormatter: new Intl.DateTimeFormat("es-AR", { timeZone: "America/Argentina/Buenos_Aires", dateStyle: "full" }),
    fortuneEscape: (value) => String(value), fortuneTeamName: () => "Equipo", fortuneFormatDate: () => "1/11/2026",
    renderFortuneShellHeader: () => "<header>Saldo 0</header>", renderFortuneEmpty: () => "Sin partidos"
  };
  vm.runInNewContext(`${extract("function fortuneDayKey(", "function fortuneToLocalInput(")}\n${extract("function fortuneDivisionLabel(", "function fortuneVoucherStatus(")}\nthis.fixture = renderFortunePredictions;`, context);
  const html = context.fixture();
  assert.match(html, /Mayores · Primera/);
  assert.match(html, /Resultado final/);
  assert.match(html, /Fecha a confirmar/);
  assert.doesNotMatch(html, /data-save-prediction/);
  assert.doesNotMatch(html, /data-prediction-home/);
});

test("ingreso y registro conservan el formulario después de la espera de Supabase", async () => {
  for (const mode of ["login", "register"]) {
    let handler;
    let reset = false;
    let currentTarget = { reset: () => { reset = true; } };
    const context = {
      document: { querySelector: (selector) => selector === `#participant${mode === "login" ? "Login" : "Register"}Form`
        ? { addEventListener: (_event, callback) => { handler = callback; } }
        : { value: selector.endsWith("Email") ? "prueba@example.com" : "clave" } },
      FormData: class { get(field) { return field === "email" ? "prueba@example.com" : "dato"; } },
      URL, window: { location: { href: "https://example.com/index.html" } },
      supabaseClient: { auth: {
        signInWithPassword: async () => ({ error: null }),
        signUp: async () => ({ error: null }), signOut: async () => {}
      } },
      fortuneSetAuthFeedback: () => {}, fortuneErrorMessage: (error) => error.message,
      getFortuneParticipantProfile: async () => ({ id: "participante" }),
      enterFortuneParticipantView: async () => {},
      bootstrap: { Modal: { getInstance: () => ({ hide: () => {} }) } }
    };
    const start = `document.querySelector("#participant${mode === "login" ? "Login" : "Register"}Form")`;
    const end = mode === "login" ? 'document.querySelector("#participantRegisterForm")' : 'document.querySelector("#participantResetForm")';
    vm.runInNewContext(extract(start, end), context);
    const submission = handler({ preventDefault: () => {}, get currentTarget() { return currentTarget; } });
    currentTarget = null;
    await submission;
    assert.equal(reset, true, `${mode} debe limpiar el formulario`);
  }
});
