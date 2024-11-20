import React from 'react';
import { AlignLeft, Network } from 'lucide-react';
import { useStore } from '../store';

export function ViewToggle() {
  const { viewMode, setViewMode } = useStore();

  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-300">
      <button
        onClick={() => setViewMode('text')}
        className={`
          flex items-center gap-2 px-4 py-2
          ${viewMode === 'text'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'}
        `}
      >
        <AlignLeft size={16} />
        <span>Text</span>
      </button>
      <button
        onClick={() => setViewMode('diagram')}
        className={`
          flex items-center gap-2 px-4 py-2
          ${viewMode === 'diagram'
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'}
        `}
      >
        <Network size={16} />
        <span>Diagram</span>
      </button>
    </div>
  );
}