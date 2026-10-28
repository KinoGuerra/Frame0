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
