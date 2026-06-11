import { useCallback, useRef, useState } from 'react';
import { useRequestFeedback } from './useRequestFeedback';

export type LoaderStatus = 'idle' | 'loading' | 'success' | 'error';
const DEBUG_REQUEST_FLOW = false;

export function useEntityCrudLoader<T>(listAction: () => Promise<T[]>) {
  const [status, setStatus] = useState<LoaderStatus>('idle');
  const [items, setItems] = useState<T[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inFlightLoadRef = useRef<Promise<void> | null>(null);
  const loadCountRef = useRef(0);
  const mutationCountRef = useRef(0);
  const { errorMessage, fieldErrors, clearFeedback, captureError } = useRequestFeedback();

  const load = useCallback(async () => {
    loadCountRef.current += 1;
    if (DEBUG_REQUEST_FLOW) {
      console.info('[useEntityCrudLoader] load called', {
        count: loadCountRef.current,
        hasInFlightLoad: Boolean(inFlightLoadRef.current),
      });
    }

    if (inFlightLoadRef.current) {
      if (DEBUG_REQUEST_FLOW) {
        console.info('[useEntityCrudLoader] reusing in-flight load', {
          count: loadCountRef.current,
        });
      }
      return inFlightLoadRef.current;
    }

    const loadPromise = (async () => {
      setStatus('loading');
      clearFeedback();
      try {
        setItems(await listAction());
        setStatus('success');
        if (DEBUG_REQUEST_FLOW) {
          console.info('[useEntityCrudLoader] load success', {
            count: loadCountRef.current,
          });
        }
      } catch (error) {
        setStatus('error');
        captureError(error);
        if (DEBUG_REQUEST_FLOW) {
          console.error('[useEntityCrudLoader] load error', {
            count: loadCountRef.current,
            error,
          });
        }
      } finally {
        inFlightLoadRef.current = null;
      }
    })();

    inFlightLoadRef.current = loadPromise;
    return loadPromise;
  }, [captureError, clearFeedback, listAction]);

  const runMutation = useCallback(
    async (action: () => Promise<unknown>) => {
      mutationCountRef.current += 1;
      if (DEBUG_REQUEST_FLOW) {
        console.info('[useEntityCrudLoader] mutation called', {
          count: mutationCountRef.current,
        });
      }

      setIsSubmitting(true);
      clearFeedback();
      try {
        await action();
        if (DEBUG_REQUEST_FLOW) {
          console.info('[useEntityCrudLoader] mutation success before reload', {
            count: mutationCountRef.current,
          });
        }
        await load();
        return true;
      } catch (error) {
        captureError(error);
        if (DEBUG_REQUEST_FLOW) {
          console.error('[useEntityCrudLoader] mutation error', {
            count: mutationCountRef.current,
            error,
          });
        }
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [captureError, clearFeedback, load]
  );

  return {
    items,
    status,
    isSubmitting,
    errorMessage,
    fieldErrors,
    load,
    runMutation,
  };
}
