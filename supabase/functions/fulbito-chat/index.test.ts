import { compactSettings } from "./index.ts";

Deno.test("excludes media from the Gemini context", () => {
  const [settings] = compactSettings([{
    clave: "public_settings",
    valor: { regulationText: "Reglamento", landingPopupVideo: {}, sponsorImages: ["image"], homeCarouselImages: ["image"] }
  }]);

  if (JSON.stringify(settings.valor) !== JSON.stringify({ regulationText: "Reglamento" })) {
    throw new Error("El contexto público todavía contiene multimedia.");
  }
});
