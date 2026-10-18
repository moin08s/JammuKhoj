import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  bgGradient: string;
  count: number;
}

const TRAVELLO_CATEGORIES: CategoryItem[] = [
  { id: 'religious', name: 'Temples', icon: '🛕', bgGradient: 'from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30', count: 12 },
  { id: 'heritage', name: 'Forts & Palaces', icon: '🏰', bgGradient: 'from-teal-500/20 to-emerald-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30', count: 7 },
  { id: 'offbeat_valley', name: 'Alpine Valleys', icon: '🌲', bgGradient: 'from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30', count: 8 },
  { id: 'lakes', name: 'Lakes & Waters', icon: '🚣', bgGradient: 'from-blue-500/20 to-cyan-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30', count: 6 },
  { id: 'border', name: 'Border & Forts', icon: '🦅', bgGradient: 'from-rose-500/20 to-red-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30', count: 5 },
  { id: 'shopping', name: 'Bazaars & Saffron', icon: '🛍️', bgGradient: 'from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30', count: 4 },
];

export const TravelloCategories: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading font-bold text-sm text-ink">
          Categories
        </h3>
        <button
          onClick={() => navigate('/explore')}
          className="text-xs font-bold text-primary hover:underline"
        >
          See All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {TRAVELLO_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => navigate('/explore')}
            className={`p-3 rounded-2xl bg-gradient-to-br ${cat.bgGradient} border flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 shadow-xs`}
          >
            <div className="text-2xl leading-none">{cat.icon}</div>
            <div className="font-bold text-xs leading-tight text-center">{cat.name}</div>
            <div className="text-[10px] opacity-75 font-semibold">{cat.count} spots</div>
          </button>
        ))}
      </div>
    </div>
  );
};
