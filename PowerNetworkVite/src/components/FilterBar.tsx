import React from 'react';
import { useStore } from '../store';
import { 
  Building2, Users, Landmark, Building, MessagesSquare, Newspaper, UserCircle2
} from 'lucide-react';

const filters = [
  { type: 'think-tank', label: 'Think Tanks', icon: Building2 },
  { type: 'donor', label: 'Donors', icon: Users },
  { type: 'political', label: 'Political', icon: Landmark },
  { type: 'corporate', label: 'Corporate', icon: Building },
  { type: 'lobbying', label: 'Lobbying', icon: MessagesSquare },
  { type: 'media', label: 'Media', icon: Newspaper },
  { type: 'personal', label: 'Personal', icon: UserCircle2 }
] as const;

export function FilterBar() {
  const { activeFilters, toggleFilter } = useStore();

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {filters.map(({ type, label, icon: Icon }) => (
        <button
          key={type}
          onClick={() => toggleFilter(type)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full
            transition-colors duration-200
            ${activeFilters.has(type)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          `}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}