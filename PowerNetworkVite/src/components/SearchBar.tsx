import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useStore } from '../store';
import { skAPI } from '../services/api';

export function SearchBar() {
  const { setLoading, addToHistory, setAnalysis } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const analysis = await skAPI.searchPerson(searchInput.trim());
      setAnalysis(analysis);
      addToHistory(searchInput.trim());
      setSearchInput(''); // Clear input after successful search
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Search failed');
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for any public figure..."
          className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Search size={20} />
        </button>
      </form>
      {error && (
        <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}