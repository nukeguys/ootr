'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Location } from '@/entities/location';

interface UseLocationSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: Location[];
  isLoading: boolean;
}

// 간단한 debounce 구현
function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export function useLocationSearch(): UseLocationSearchReturn {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['locationSearch', debouncedQuery],
    queryFn: async () => {
      const { data } = await axios.get<Location[]>('/api/location/search', {
        params: { q: debouncedQuery },
      });
      return data;
    },
    enabled: debouncedQuery.length >= 2,
  });

  return {
    query,
    setQuery,
    results: data ?? [],
    isLoading: isLoading && debouncedQuery.length >= 2,
  };
}
