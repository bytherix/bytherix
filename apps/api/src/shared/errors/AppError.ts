export class AppError extends Error {
  public readonly statusCode:    number
  public readonly isOperational: boolean
   public readonly code:          string | undefined 

  constructor(message: string, statusCode: number, code?: string, isOperational = true) {
    super(message)
    this.statusCode    = statusCode
    this.isOperational = isOperational
    this.code          = code
    Object.setPrototypeOf(this, AppError.prototype)
    Error.captureStackTrace(this, this.constructor)
  }
}

export class UnauthorizedError   extends AppError { constructor(m = 'Unauthorized')            { super(m, 401, 'UNAUTHORIZED') } }
export class ForbiddenError      extends AppError { constructor(m = 'Forbidden')               { super(m, 403, 'FORBIDDEN') } }
export class NotFoundError       extends AppError { constructor(r = 'Resource')                { super(`${r} not found`, 404, 'NOT_FOUND') } }
export class ConflictError       extends AppError { constructor(m: string)                     { super(m, 409, 'CONFLICT') } }
export class ValidationError     extends AppError { constructor(m: string)                     { super(m, 422, 'VALIDATION_ERROR') } }
export class TooManyRequestsError extends AppError { constructor(m = 'Too many requests')      { super(m, 429, 'RATE_LIMIT_EXCEEDED') } }