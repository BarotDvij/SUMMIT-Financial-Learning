/**
 * Domain-level error codes consumed by both API and UI layers. tRPC maps these
 * to HTTP status codes; the UI maps them to user-facing copy.
 */
export const SUMMIT_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION: 'VALIDATION',
  CONSENT_REQUIRED: 'CONSENT_REQUIRED',
  CONSENT_WITHDRAWN: 'CONSENT_WITHDRAWN',
  WRONG_TENANT: 'WRONG_TENANT',
  RATE_LIMITED: 'RATE_LIMITED',
  CONFLICT: 'CONFLICT',
  INTERNAL: 'INTERNAL',
} as const;

export type SummitErrorCode = (typeof SUMMIT_ERROR_CODES)[keyof typeof SUMMIT_ERROR_CODES];

export class SummitError extends Error {
  public readonly code: SummitErrorCode;
  public readonly details?: unknown;

  constructor(code: SummitErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'SummitError';
    this.code = code;
    this.details = details;
  }
}

export const HTTP_STATUS_BY_CODE: Record<SummitErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION: 400,
  CONSENT_REQUIRED: 403,
  CONSENT_WITHDRAWN: 403,
  WRONG_TENANT: 403,
  RATE_LIMITED: 429,
  CONFLICT: 409,
  INTERNAL: 500,
};
