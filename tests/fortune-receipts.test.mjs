import assert from "node:assert/strict";
import { test } from "node:test";

globalThis.Deno = {
  env: { get: (name) => ({
    SUPABASE_URL: "https://project.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "service-secret",
    RESEND_API_KEY: "resend-secret",
    RECEIPT_FROM_EMAIL: "Frame0 <comprobantes@example.com>"
  })[name] || "" },
  serve: () => {}
};
const { buildReceiptEmail, handleRequest } = await import("../supabase/functions/enviar-comprobantes-fortuna/index.ts");

const receipt = (tipo) => ({
  id: `${tipo}-1`, tipo, destino_email: "titular@example.com", titular_nombre: "Ana <Test>",
  producto_nombre: "Remera", producto_descripcion: "Talle M & azul", codigo: "F0-1234",
  costo_puntos: 5, emitido_at: "2026-10-28T12:00:00Z", vence_at: "2026-11-28T12:00:00Z",
  entregado_at: "2026-10-29T12:00:00Z", constatador_nombre: "Carlos", intentos: 1
});

test("los dos correos incluyen la descripción y escapan HTML", () => {
  const issued = buildReceiptEmail(receipt("canje"));
  const delivered = buildReceiptEmail(receipt("entrega"));
  assert.match(issued.text, /Talle M & azul/);
  assert.match(issued.text, /Puntos canjeados: 5/);
  assert.match(delivered.text, /Constatador: Carlos/);
  assert.match(delivered.text, /Talle M & azul/);
  assert.match(issued.html, /Ana &lt;Test&gt;/);
  assert.doesNotMatch(issued.html, /Ana <Test>/);
});

test("la función exige clave interna y envía con idempotencia", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith("/tomar_comprobantes_fortuna")) return Response.json([receipt("canje")]);
    if (url === "https://api.resend.com/emails") return Response.json({ id: "resend-id" });
    return new Response(null, { status: 204 });
  };
  try {
    const denied = await handleRequest(new Request("https://example.com", { method: "POST" }));
    assert.equal(denied.status, 401);
    assert.equal(calls.length, 0);
    const response = await handleRequest(new Request("https://example.com", { method: "POST", headers: { authorization: "Bearer service-secret" } }));
    assert.deepEqual(await response.json(), { processed: 1, sent: 1, failed: 0 });
    const emailCall = calls.find((call) => call.url === "https://api.resend.com/emails");
    assert.equal(emailCall.options.headers["Idempotency-Key"], "fortuna/canje-1");
    assert.deepEqual(JSON.parse(emailCall.options.body).to, ["titular@example.com"]);
    const finished = calls.find((call) => call.url.endsWith("/finalizar_comprobante_fortuna"));
    assert.equal(JSON.parse(finished.options.body).p_proveedor_id, "resend-id");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("si Resend falla, conserva el comprobante para reintentar", async () => {
  const originalFetch = globalThis.fetch;
  let finished;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/tomar_comprobantes_fortuna")) return Response.json([receipt("entrega")]);
    if (url === "https://api.resend.com/emails") return Response.json({ message: "Límite temporal" }, { status: 429 });
    finished = JSON.parse(options.body);
    return new Response(null, { status: 204 });
  };
  try {
    const response = await handleRequest(new Request("https://example.com", { method: "POST", headers: { authorization: "Bearer service-secret" } }));
    assert.deepEqual(await response.json(), { processed: 1, sent: 0, failed: 1 });
    assert.equal(finished.p_proveedor_id, null);
    assert.match(finished.p_error, /Resend 429/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
