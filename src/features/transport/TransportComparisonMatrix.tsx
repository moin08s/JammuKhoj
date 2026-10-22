import React from 'react';
import { BadgeIndianRupee, Clock, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

export const TransportComparisonMatrix: React.FC = () => {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border shadow-xs space-y-3 text-ink">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgeIndianRupee className="w-4 h-4 text-primary" />
          <h3 className="font-serif font-bold text-ink text-sm">Mode Comparison: Matador vs Auto vs Taxi</h3>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
          Surveyed Oct 2026
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        {/* Matador */}
        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900 dark:text-blue-300 text-sm">Matador (Mini-Bus)</span>
            <span className="font-bold text-blue-700 dark:text-blue-300 bg-card px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
              ₹10 - ₹25
            </span>
          </div>
          <div className="text-stone space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-blue-950 dark:text-blue-200">
              <Clock className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Frequency: Every 3 - 5 mins</span>
            </div>
            <div>• <strong>Hours:</strong> 6:00 AM – 9:30 PM</div>
            <div>• <strong>Best For:</strong> Budget hops across City Centre, Gandhi Nagar & Old City.</div>
          </div>
        </div>

        {/* Auto / E-Rickshaw */}
        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-950 dark:text-amber-300 text-sm">Auto / E-Rickshaw</span>
            <span className="font-bold text-amber-800 dark:text-amber-300 bg-card px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              ₹50 - ₹150
            </span>
          </div>
          <div className="text-stone space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-amber-950 dark:text-amber-200">
              <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Frequency: Instant on-demand</span>
            </div>
            <div>• <strong>Hours:</strong> 5:00 AM – 11:00 PM</div>
            <div>• <strong>Best For:</strong> Direct drop to temple gates, tight alleys & market bazaars.</div>
          </div>
        </div>

        {/* Prepaid Taxi */}
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 dark:text-emerald-300 text-sm">Prepaid Taxi / Cab</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-card px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              ₹300 - ₹2200
            </span>
          </div>
          <div className="text-stone space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-950 dark:text-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Fixed Booth rates (No surge)</span>
            </div>
            <div>• <strong>Hours:</strong> 24x7 Available at Station & Airport</div>
            <div>• <strong>Best For:</strong> Katra (₹1500), Patnitop (₹2800), and family groups with luggage.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
