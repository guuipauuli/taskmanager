import { useCallback, useState } from 'react';
import { toAppError } from '../http/appError';

export function useRequestFeedback() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearFeedback = useCallback(() => {
    setErrorMessage(null);
    setFieldErrors({});
  }, []);

  const captureError = useCallback((error: unknown) => {
    const appError = toAppError(error);
    setErrorMessage(appError.message);
    setFieldErrors(appError.fieldErrors ?? {});
    return appError;
  }, []);

  return {
    errorMessage,
    fieldErrors,
    clearFeedback,
    captureError,
  };
}
