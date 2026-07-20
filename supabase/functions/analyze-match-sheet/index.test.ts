import { hasValidFileSignature, normalizeOcrResult } from "./index.ts";

Deno.test("normalizes OCR incidences and rejects unknown players", () => {
  const result = normalizeOcrResult({
    score: { home: 1, away: 0, confidence: 0.95 },
    players: [
      { player_id: "player-1", goals: 1, yellow_cards: 1, red_cards: 0, observation: "", confidence: 0.9 },
      { player_id: "unknown", goals: 2, yellow_cards: 0, red_cards: 0, observation: "", confidence: 0.4 }
    ],
    warnings: []
  }, [{ id: "player-1", equipo_id: "home" }], "home", "away");

  if (result.incidences.length !== 1 || result.incidences[0].jugador_id !== "player-1" || !result.needs_review) {
    throw new Error("La normalización OCR no protegió el plantel oficial.");
  }
});

Deno.test("validates file signatures instead of trusting only the MIME type", () => {
  const validPdf = new TextEncoder().encode("%PDF-1.7 test");
  const renamedText = new TextEncoder().encode("not a pdf");
  if (!hasValidFileSignature("application/pdf", validPdf) || hasValidFileSignature("application/pdf", renamedText)) {
    throw new Error("La validación de firma de archivo no funcionó.");
  }
});
