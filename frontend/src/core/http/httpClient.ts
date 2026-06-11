import { env } from '../config/env';
import { AppError } from './appError';
const DEBUG_HTTP = false;
let requestSequence = 0;
const CLIENT_BURST_LIMIT = 50;
const CLIENT_BURST_WINDOW_MS = 3000;
const requestTimeline: number[] = [];
const CLIENT_INFLIGHT_LIMIT = 12;
let inFlightRequests = 0;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

interface BackendErrorPayload {
  status?: number;
  detail?: string;
  code?: string;
  userSafe?: boolean;
  fieldErrors?: Record<string, string>;
}

type HttpErrorHandler = (error: AppError) => void;

let onHttpError: HttpErrorHandler = () => undefined;

export function setHttpErrorHandler(handler: HttpErrorHandler) {
  onHttpError = handler;
}

function normalizeHttpError(statusCode: number, payload: BackendErrorPayload, rawBody: string): AppError {
  const backendMessage = payload.detail?.trim();
  const fieldErrors = payload.fieldErrors;

  if (statusCode === 400) {
    return new AppError(backendMessage || 'Requisicao invalida.', {
      statusCode,
      code: payload.code || 'HTTP_ERROR',
      details: rawBody,
      fieldErrors,
    });
  }

  if (statusCode === 404) {
    return new AppError(backendMessage || 'Recurso nao encontrado.', {
      statusCode,
      code: payload.code || 'HTTP_ERROR',
      details: rawBody,
    });
  }

  if (statusCode >= 500) {
    return new AppError(backendMessage || 'Falha interna no servidor.', {
      statusCode,
      code: payload.code || 'HTTP_ERROR',
      details: rawBody,
    });
  }

  return new AppError(backendMessage || 'Nao foi possivel concluir a requisicao.', {
    statusCode,
    code: payload.code || 'HTTP_ERROR',
    details: rawBody,
    fieldErrors,
  });
}

async function parseErrorPayload(response: Response): Promise<{ payload: BackendErrorPayload; rawBody: string }> {
  const rawBody = await response.text();
  if (!rawBody) {
    return { payload: {}, rawBody: '' };
  }

  try {
    const payload = JSON.parse(rawBody) as BackendErrorPayload;
    return { payload, rawBody };
  } catch {
    return { payload: {}, rawBody };
  }
}

function dispatchHttpError(error: AppError): never {
  onHttpError(error);
  throw error;
}

function assertClientBurstLimit() {
  const now = Date.now();
  requestTimeline.push(now);

  while (requestTimeline.length > 0 && now - requestTimeline[0] > CLIENT_BURST_WINDOW_MS) {
    requestTimeline.shift();
  }

  if (requestTimeline.length > CLIENT_BURST_LIMIT) {
    dispatchHttpError(
      new AppError('Muitas requisicoes em curto intervalo. Aguarde alguns segundos e tente novamente.', {
        code: 'CLIENT_RATE_LIMIT',
      })
    );
  }
}

function assertClientInflightLimit() {
  if (inFlightRequests >= CLIENT_INFLIGHT_LIMIT) {
    dispatchHttpError(
      new AppError('Muitas requisicoes simultaneas. Aguarde e tente novamente.', {
        code: 'CLIENT_CONCURRENCY_LIMIT',
      })
    );
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  assertClientBurstLimit();
  assertClientInflightLimit();

  const requestId = ++requestSequence;
  inFlightRequests += 1;
  if (DEBUG_HTTP) {
    console.info('[httpClient] request start', {
      requestId,
      method: options.method ?? 'GET',
      path,
      inFlightRequests,
    });
  }

  try {
    const hasBody = options.body !== undefined;
    const headers: Record<string, string> = hasBody ? { 'Content-Type': 'application/json' } : {};

    const response = await fetch(`${env.apiBaseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const { payload, rawBody } = await parseErrorPayload(response);
      if (DEBUG_HTTP) {
        console.error('[httpClient] request failed', {
          requestId,
          status: response.status,
          path,
          payload,
        });
      }
      return dispatchHttpError(normalizeHttpError(response.status, payload, rawBody));
    }

    if (response.status === 204) {
      if (DEBUG_HTTP) {
        console.info('[httpClient] request success', {
          requestId,
          status: response.status,
          path,
        });
      }
      return undefined as T;
    }

    const responseBody = (await response.json()) as T;
    if (DEBUG_HTTP) {
      console.info('[httpClient] request success', {
        requestId,
        status: response.status,
        path,
      });
    }
    return responseBody;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (DEBUG_HTTP) {
      console.error('[httpClient] request network error', {
        requestId,
        path,
        error,
      });
    }

    return dispatchHttpError(
      new AppError('Falha de conexao. Verifique se o backend esta disponivel.', {
        code: 'NETWORK_ERROR',
      })
    );
  } finally {
    inFlightRequests = Math.max(0, inFlightRequests - 1);
    if (DEBUG_HTTP) {
      console.info('[httpClient] request end', {
        requestId,
        inFlightRequests,
      });
    }
  }

  return undefined as T;
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: (path: string) => request<void>(path, { method: 'DELETE' }),
};
