import React from 'react';
import { ShieldCheck, Users, CalendarCheck, WifiOff } from 'lucide-react';

interface TrustBadgesProps {
  className?: string;
  variant?: 'compact' | 'detailed';
}

export const TrustBadges: React.FC<TrustBadgesProps> = ({ className = '', variant = 'compact' }) => {
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Verified by Dogra Locals
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-500/20 font-medium">
          <Users className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          45,000+ Yatris Guided
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 font-medium">
          <CalendarCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Updated: Oct 2026
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-stone border border-border font-medium">
          <WifiOff className="w-3.5 h-3.5 text-stone" />
          100% Offline Capable
        </span>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      <div className="bg-card p-3 rounded-xl border border-border shadow-xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-ink">Verified Data</div>
          <div className="text-[11px] text-stone">By Jammu locals & yatris</div>
        </div>
      </div>

      <div className="bg-card p-3 rounded-xl border border-border shadow-xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-ink">45,000+ Yatris</div>
          <div className="text-[11px] text-stone">Pilgrims & explorers</div>
        </div>
      </div>

      <div className="bg-card p-3 rounded-xl border border-border shadow-xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <CalendarCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-ink">October 2026</div>
          <div className="text-[11px] text-stone">Fares & timings audited</div>
        </div>
      </div>

      <div className="bg-card p-3 rounded-xl border border-border shadow-xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-surface text-stone flex items-center justify-center shrink-0 border border-border">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-ink">100% Offline</div>
          <div className="text-[11px] text-stone">Zero data required</div>
        </div>
      </div>
    </div>
  );
};
