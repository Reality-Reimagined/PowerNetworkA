import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useStore } from '../store';
import { skAPI } from '../services/api';
import { Download } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  flowchart: {
    curve: 'basis',
    padding: 20,
    nodeSpacing: 50,
    rankSpacing: 50
  },
  securityLevel: 'loose'
});

export function NetworkVisualization() {
  const { currentAnalysis, activeFilters, viewMode } = useStore();
  const diagramRef = useRef<HTMLDivElement>(null);
  const renderTimeoutRef = useRef<NodeJS.Timeout>();

  const handleDownload = () => {
    if (!diagramRef.current) return;
    
    const svg = diagramRef.current.querySelector('svg');
    if (!svg) return;

    // Create a blob from the SVG content
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentAnalysis?.subject.replace(/\s+/g, '-').toLowerCase()}-network.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (diagramRef.current) {
      diagramRef.current.innerHTML = '';
    }

    const renderDiagram = async () => {
      if (!currentAnalysis || !diagramRef.current) return;

      const filteredAnalysis = {
        ...currentAnalysis,
        connections: currentAnalysis.connections.filter(conn => activeFilters.has(conn.type))
      };

      try {
        const diagram = await skAPI.generateDiagram(filteredAnalysis);
        
        if (renderTimeoutRef.current) {
          clearTimeout(renderTimeoutRef.current);
        }

        renderTimeoutRef.current = setTimeout(async () => {
          try {
            if (diagramRef.current) {
              diagramRef.current.innerHTML = '';
              const { svg } = await mermaid.render('network-diagram', diagram);
              if (diagramRef.current) {
                diagramRef.current.innerHTML = svg;
              }
            }
          } catch (error) {
            console.error('Failed to render diagram:', error);
          }
        }, 50);
      } catch (error) {
        console.error('Failed to generate diagram:', error);
      }
    };

    if (viewMode === 'diagram') {
      renderDiagram();
    }

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [currentAnalysis, activeFilters, viewMode]);

  if (!currentAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">No analysis available. Try searching for someone.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={16} />
          <span>Download SVG</span>
        </button>
      </div>
      <div ref={diagramRef} className="min-w-[800px] min-h-[400px]" />
    </div>
  );
}