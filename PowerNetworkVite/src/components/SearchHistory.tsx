import React from 'react';
import { History, X } from 'lucide-react';
import { useStore } from '../store';
import { skAPI } from '../services/api';

export function SearchHistory() {
  const { searchHistory, removeFromHistory, setLoading, setAnalysis } = useStore();

  if (searchHistory.length === 0) {
    return null;
  }

  const handleSearch = async (query: string) => {
    setLoading(true);
    try {
      const analysis = await skAPI.searchPerson(query);
      if (analysis) {
        setAnalysis(analysis);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    removeFromHistory(id);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <History size={20} className="text-gray-500" />
        <h2 className="text-lg font-semibold">Recent Searches</h2>
      </div>
      <div className="space-y-2">
        {searchHistory.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSearch(item.query)}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
          >
            <div>
              <p className="font-medium">{item.query}</p>
              <p className="text-sm text-gray-500">
                {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={(e) => handleRemove(e, item.id)}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              aria-label="Remove from history"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}