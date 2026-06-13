import { errorResponse } from "../utils/responses.js";

export function errorHandler(error, req, res, next) {
  console.error(error);
  return errorResponse(res, error.message || "Error interno del servidor", error.statusCode || 500);
}
