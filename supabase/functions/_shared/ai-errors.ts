export class AiProviderError extends Error {
  constructor(message: string, public code: string, public status: number) {
    super(message);
    this.name = "AiProviderError";
  }
}

type AiProviderOptions = {
  provider: string;
  apiKeyName: string;
  modelName: string;
};

export function missingAiKeyError(provider: string, apiKeyName: string) {
  return new AiProviderError(
    `La conexión con ${provider} no está configurada. Revisá ${apiKeyName} en Supabase.`,
    "ai_not_configured",
    503
  );
}

export async function ensureAiResponse(response: Response, options: AiProviderOptions) {
  if (response.ok) return;

  const detail = await response.text();
  const normalized = detail.toLowerCase();

  if (response.status === 429 || /resource_exhausted|quota|rate.?limit|too many requests/.test(normalized)) {
    throw new AiProviderError(
      "La IA agotó temporalmente los créditos disponibles. Volvé a intentar cuando se renueve la cuota.",
      "ai_quota_exceeded",
      429
    );
  }

  if ([401, 403].includes(response.status) || /api.?key|invalid.?key|authentication|unauthorized/.test(normalized)) {
    throw new AiProviderError(
      `La clave de ${options.provider} no es válida o no tiene permisos. Revisá ${options.apiKeyName} en Supabase.`,
      "ai_invalid_key",
      503
    );
  }

  if (response.status === 404 || /model.*(?:not found|does not exist|decommissioned)/.test(normalized)) {
    throw new AiProviderError(
      `El modelo de ${options.provider} configurado no está disponible. Revisá ${options.modelName} en Supabase.`,
      "ai_model_unavailable",
      503
    );
  }

  if (response.status >= 500) {
    throw new AiProviderError(
      `${options.provider} está temporalmente no disponible. Intentá nuevamente más tarde.`,
      "ai_provider_unavailable",
      503
    );
  }

  throw new AiProviderError(
    `${options.provider} no pudo procesar la solicitud. Intentá nuevamente.`,
    "ai_request_failed",
    502
  );
}

export function getFunctionFailure(error: unknown, fallback: string) {
  if (error instanceof AiProviderError) {
    return { message: error.message, code: error.code, status: error.status };
  }

  return {
    message: error instanceof Error ? error.message : fallback,
    code: "request_failed",
    status: 400
  };
}
