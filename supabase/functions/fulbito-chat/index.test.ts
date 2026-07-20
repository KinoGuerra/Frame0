import { PUBLIC_SETTINGS_CONTEXT_PATH } from "./index.ts";

Deno.test("does not fetch public media for the Gemini context", () => {
  if (/landingPopupVideo|sponsorImages|homeCarouselImages/.test(PUBLIC_SETTINGS_CONTEXT_PATH)) {
    throw new Error("La consulta pública todavía descarga multimedia.");
  }
});
