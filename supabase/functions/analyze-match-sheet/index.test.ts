import { encodeBase64, hasValidFileSignature, normalizeOcrResult } from "./index.ts";

Deno.test("normalizes OCR incidences and rejects unknown players", () => {
  const result = normalizeOcrResult({
    score: { detected: true, home: 1, away: 0, confidence: 0.95 },
    players: [
      { player_id: "player-1", goals: 1, yellow_cards: 1, red_cards: 0, observation: "", confidence: 0.9 },
      { player_id: "unknown", goals: 2, yellow_cards: 0, red_cards: 0, observation: "", confidence: 0.4 }
    ],
    warnings: [],
    complete_sheet: true
  }, [{ id: "player-1", equipo_id: "home" }], "home", "away");

  if (result.incidences.length !== 1 || result.incidences[0].jugador_id !== "player-1" || !result.needs_review) {
    throw new Error("La normalización OCR no protegió el plantel oficial.");
  }
});

Deno.test("accepts a partial page without erasing an unseen score", () => {
  const result = normalizeOcrResult({
    score: { detected: false, home: 0, away: 0, confidence: 0 },
    players: [
      { player_id: "away-1", goals: 1, yellow_cards: 0, red_cards: 0, observation: "", confidence: 0.92 }
    ],
    warnings: [],
    complete_sheet: false
  }, [{ id: "away-1", equipo_id: "away" }], "home", "away");

  if (result.score.detected || result.incidences.length !== 1 || !result.needs_review) {
    throw new Error("La página parcial no se normalizó correctamente.");
  }
});

Deno.test("validates file signatures instead of trusting only the MIME type", () => {
  const validPdf = new TextEncoder().encode("%PDF-1.7 test");
  const renamedText = new TextEncoder().encode("not a pdf");
  if (!hasValidFileSignature("application/pdf", validPdf) || hasValidFileSignature("application/pdf", renamedText)) {
    throw new Error("La validación de firma de archivo no funcionó.");
  }
});

Deno.test("encodes binary files as base64 without Uint8Array.toBase64", () => {
  const bytes = new Uint8Array(70_001).map((_, index) => index % 256);
  const decoded = Uint8Array.from(atob(encodeBase64(bytes)), (character) => character.charCodeAt(0));
  if (decoded.length !== bytes.length || decoded.some((value, index) => value !== bytes[index])) {
    throw new Error("La codificación Base64 alteró el archivo.");
  }
});
