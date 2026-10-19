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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Verified by Dogra Locals
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-medium">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          45,000+ Yatris Guided
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
          <CalendarCheck className="w-3.5 h-3.5 text-amber-600" />
          Updated: Oct 2026
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
          <WifiOff className="w-3.5 h-3.5 text-slate-500" />
          100% Offline Capable
        </span>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-800">Verified Data</div>
          <div className="text-[11px] text-slate-500">By Jammu locals & yatris</div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-800">45,000+ Yatris</div>
          <div className="text-[11px] text-slate-500">Pilgrims & explorers</div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <CalendarCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-800">October 2026</div>
          <div className="text-[11px] text-slate-500">Fares & timings audited</div>
        </div>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
          <WifiOff className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-800">100% Offline</div>
          <div className="text-[11px] text-slate-500">Zero data required</div>
        </div>
      </div>
    </div>
  );
};
