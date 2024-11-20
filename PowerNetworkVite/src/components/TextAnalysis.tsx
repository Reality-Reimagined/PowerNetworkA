import React from 'react';
import { useStore } from '../store';

export function TextAnalysis() {
  const { currentAnalysis, activeFilters } = useStore();

  if (!currentAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">No analysis available. Try searching for someone.</p>
      </div>
    );
  }

  const filteredConnections = currentAnalysis.connections?.filter(
    conn => activeFilters.has(conn.type)
  ) || [];

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Network Analysis: {currentAnalysis.subject}
      </h2>
      
      {filteredConnections.length === 0 ? (
        <p className="text-gray-500">No connections found with current filters.</p>
      ) : (
        <div className="space-y-4">
          {filteredConnections.map((connection, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {connection.name}
              </h3>
              <p className="text-sm text-gray-500">
                {connection.role && `${connection.role} • `}
                {connection.type}
              </p>
              <p className="mt-1 text-gray-700">{connection.description}</p>
              {(connection.startYear || connection.endYear) && (
                <p className="text-sm text-gray-500 mt-1">
                  {connection.startYear && `From ${connection.startYear}`}
                  {connection.startYear && connection.endYear && ' to '}
                  {connection.endYear && `${connection.endYear}`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}