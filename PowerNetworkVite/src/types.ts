export interface Connection {
  type: 'think-tank' | 'donor' | 'political' | 'corporate' | 'lobbying' | 'media' | 'personal';
  name: string;
  role?: string;
  description: string;
  startYear?: number;
  endYear?: number;
}

export interface NetworkAnalysis {
  subject: string;
  connections: Connection[];
  lastUpdated: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
}