import { create } from 'zustand';
import { Connection, NetworkAnalysis, SearchHistory } from './types';

interface Store {
  currentAnalysis: NetworkAnalysis | null;
  searchHistory: SearchHistory[];
  activeFilters: Set<Connection['type']>;
  isLoading: boolean;
  viewMode: 'text' | 'diagram';
  setAnalysis: (analysis: NetworkAnalysis) => void;
  addToHistory: (query: string) => void;
  removeFromHistory: (id: string) => void;
  toggleFilter: (filter: Connection['type']) => void;
  setViewMode: (mode: 'text' | 'diagram') => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<Store>((set) => ({
  currentAnalysis: null,
  searchHistory: [],
  activeFilters: new Set(['think-tank', 'donor', 'political', 'corporate', 'lobbying', 'media', 'personal']),
  isLoading: false,
  viewMode: 'text',
  
  setAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  addToHistory: (query) => set((state) => ({
    searchHistory: [
      {
        id: crypto.randomUUID(),
        query,
        timestamp: new Date().toISOString()
      },
      ...state.searchHistory.slice(0, 9) // Keep only last 10 items
    ]
  })),
  removeFromHistory: (id) => set((state) => ({
    searchHistory: state.searchHistory.filter(item => item.id !== id)
  })),
  toggleFilter: (filter) => set((state) => {
    const newFilters = new Set(state.activeFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    return { activeFilters: newFilters };
  }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setLoading: (loading) => set({ isLoading: loading })
}));