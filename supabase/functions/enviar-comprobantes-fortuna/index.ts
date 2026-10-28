type Receipt = {
  id: string;
  tipo: "canje" | "entrega";
  destino_email: string | null;
  titular_nombre: string;
  producto_nombre: string;
  producto_descripcion: string | null;
  codigo: string;
  costo_puntos: number;
  emitido_at: string;
  vence_at: string;
  entregado_at: string | null;
  constatador_nombre: string | null;
  intentos: number;
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("FRAME0_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const fromEmail = Deno.env.get("RECEIPT_FROM_EMAIL") || "";
const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  timeZone: "America/Argentina/Buenos_Aires", dateStyle: "long", timeStyle: "short"
});

function formatDate(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
}

function escapeHtml(value: unknown) {
  const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(value ?? "").replace(/[&<>"']/g, (character) =>
    entities[character] || character);
}

export function buildReceiptEmail(receipt: Receipt) {
  const title = receipt.tipo === "canje" ? "Voucher emitido" : "Comprobante de entrega";
  const details = receipt.tipo === "canje"
    ? [
      ["Código", receipt.codigo], ["Premio", receipt.producto_nombre],
      ["Descripción", receipt.producto_descripcion || "Sin descripción adicional"],
      ["Puntos canjeados", String(receipt.costo_puntos)],
      ["Emitido", formatDate(receipt.emitido_at)], ["Vence", formatDate(receipt.vence_at)]
    ]
    : [
      ["Código", receipt.codigo], ["Premio", receipt.producto_nombre],
      ["Descripción", receipt.producto_descripcion || "Sin descripción adicional"],
      ["Entregado", formatDate(receipt.entregado_at)],
      ["Constatador", receipt.constatador_nombre || "Organización Frame0"]
    ];
  const intro = `Hola ${receipt.titular_nombre}. ${title} de Fortuna Frame0.`;
  return {
    subject: `${title} · Fortuna Frame0`,
    text: [intro, "", ...details.map(([label, value]) => `${label}: ${value}`), "", "Conservá este correo como comprobante."].join("\n"),
    html: `<main style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#122033"><h1>${title} · Fortuna Frame0</h1><p>Hola ${escapeHtml(receipt.titular_nombre)}.</p><dl>${details.map(([label, value]) => `<dt style="font-weight:bold;margin-top:12px">${escapeHtml(label)}</dt><dd style="margin-left:0">${escapeHtml(value).replaceAll("\n", "<br>")}</dd>`).join("")}</dl><p>Conservá este correo como comprobante.</p></main>`
  };
}

async function rpc(name: string, payload: Record<string, unknown>) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: serviceRoleKey, authorization: `Bearer ${serviceRoleKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Supabase ${name}: ${response.status} ${await response.text()}`);
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

export async function handleRequest(request: Request) {
  if (request.method !== "POST") return Response.json({ error: "Método no permitido." }, { status: 405 });
  if (!serviceRoleKey || request.headers.get("authorization") !== `Bearer ${serviceRoleKey}`) {
    return Response.json({ error: "Acceso no autorizado." }, { status: 401 });
  }
  if (!supabaseUrl || !resendApiKey || !fromEmail) {
    return Response.json({ error: "Faltan secretos de Supabase o Resend." }, { status: 503 });
  }

  let receipts: Receipt[];
  try {
    receipts = await rpc("tomar_comprobantes_fortuna", { p_limite: 10 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "No se pudo reclamar la cola." }, { status: 502 });
  }

  let sent = 0;
  let failed = 0;
  for (const receipt of receipts) {
    let providerId: string | null = null;
    let sendError: string | null = null;
    try {
      if (!receipt.destino_email) throw new Error("El titular no tiene un correo de destino.");
      const email = buildReceiptEmail(receipt);
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `fortuna/${receipt.id}`
        },
        body: JSON.stringify({ from: fromEmail, to: [receipt.destino_email], ...email }),
        signal: AbortSignal.timeout(8000)
      });
      const payload = await response.json();
      if (!response.ok || !payload?.id) throw new Error(`Resend ${response.status}: ${JSON.stringify(payload).slice(0, 350)}`);
      providerId = String(payload.id);
      sent += 1;
    } catch (error) {
      sendError = error instanceof Error ? error.message : "Error desconocido al enviar correo.";
      failed += 1;
    }
    await rpc("finalizar_comprobante_fortuna", {
      p_id: receipt.id, p_intentos: receipt.intentos,
      p_proveedor_id: providerId, p_error: sendError
    });
  }
  return Response.json({ processed: receipts.length, sent, failed });
}

if (import.meta.main) Deno.serve(handleRequest);
