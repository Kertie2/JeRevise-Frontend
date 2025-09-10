import { useState, useEffect } from 'react';

interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAPI<T>(
  apiCall: () => Promise<{ data: T }>,
  dependencies: any[] = []
): UseAPIState<T> & { refetch: () => void } {
  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await apiCall();
      setState({ data: response.data, loading: false, error: null });
    } catch (error: any) {
      setState({ 
        data: null, 
        loading: false, 
        error: error.response?.data?.message || 'Une erreur est survenue' 
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { ...state, refetch: fetchData };
}