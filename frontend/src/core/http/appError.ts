export class AppError extends Error {
  statusCode?: number;
  code: string;
  details?: string;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      code?: string;
      details?: string;
      fieldErrors?: Record<string, string>;
    }
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = options?.statusCode;
    this.code = options?.code ?? 'UNEXPECTED_ERROR';
    this.details = options?.details;
    this.fieldErrors = options?.fieldErrors;
  }
}

export const DEFAULT_APP_ERROR_MESSAGE = 'Erro inesperado.';

export function toAppError(error: unknown, fallbackMessage = DEFAULT_APP_ERROR_MESSAGE): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message || fallbackMessage, { code: 'UNEXPECTED_ERROR' });
  }

  return new AppError(fallbackMessage, { code: 'UNEXPECTED_ERROR' });
}
