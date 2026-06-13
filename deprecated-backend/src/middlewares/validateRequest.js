import { errorResponse } from "../utils/responses.js";

export function validateRequiredFields(requiredFields = []) {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length) {
      return errorResponse(res, `Campos requeridos: ${missingFields.join(", ")}`, 400);
    }

    return next();
  };
}
