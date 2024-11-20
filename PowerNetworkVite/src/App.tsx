import React from 'react';
import { Network } from 'lucide-react';
import { useStore } from './store';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { ViewToggle } from './components/ViewToggle';
import { NetworkVisualization } from './components/NetworkVisualization';
import { TextAnalysis } from './components/TextAnalysis';
import { SearchHistory } from './components/SearchHistory';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const { isLoading, viewMode } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Network size={32} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Power Network Analyzer
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Search Section */}
          <div className="flex justify-center">
            <SearchBar />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <FilterBar />
            <ViewToggle />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          )}

          {/* Results */}
          {!isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <ErrorBoundary>
                  {viewMode === 'diagram' ? (
                    <NetworkVisualization />
                  ) : (
                    <TextAnalysis />
                  )}
                </ErrorBoundary>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <SearchHistory />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;