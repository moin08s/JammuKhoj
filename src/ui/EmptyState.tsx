import React from 'react';
import { SearchX, Sparkles, RotateCcw, MapPin, Compass } from 'lucide-react';

interface EmptyStateProps {
  query?: string;
  onReset?: () => void;
  onSuggestionClick?: (suggestion: string) => void;
  title?: string;
  description?: string;
  suggestions?: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  onReset,
  onSuggestionClick,
  title = 'No destinations matched',
  description,
  suggestions = ['Vaishno Devi', 'Raghunath Temple', 'Bahu Fort', 'Patnitop', 'Kaladi Kulcha']
}) => {
  return (
    <div className="py-10 px-4 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 max-w-md mx-auto animate-in fade-in">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-xs">
        <SearchX className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="font-serif font-bold text-base text-ink">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {description || (query ? `No spots found for "${query}". Try popular search terms or clear your active filters.` : 'No results found under the current filters.')}
        </p>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Popular Searches
          </div>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSuggestionClick && onSuggestionClick(s)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-primary-soft hover:text-primary text-slate-700 text-xs font-medium transition-colors border border-slate-200"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {onReset && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors shadow-xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};
