import assert from "node:assert/strict";
import { test } from "node:test";
import { authenticateFrame0 } from "../supabase/functions/_shared/frame0-auth.ts";

test("Edge Functions authenticate with the login RPC", async () => {
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return new Response(JSON.stringify([{ id: "delegate-id", rol: "delegado" }]), { status: 200 });
  };
  try {
    const user = await authenticateFrame0("https://example.supabase.co", "service-key", " delegada ", " clave ", ["delegado"]);
    assert.equal(user.id, "delegate-id");
    assert.equal(request.url, "https://example.supabase.co/rest/v1/rpc/iniciar_sesion_frame0");
    assert.deepEqual(JSON.parse(request.options.body), { p_usuario: "delegada", p_password: "clave" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Edge Functions reject an unexpected role", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify([{ id: "observer-id", rol: "veedor" }]), { status: 200 });
  try {
    await assert.rejects(authenticateFrame0("https://example.supabase.co", "service-key", "observadora", "clave", ["admin"]));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
