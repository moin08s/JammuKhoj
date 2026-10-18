import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

interface DisclaimerNoteProps {
  kind: 'emergency' | 'fare' | 'map';
  className?: string;
}

export const DisclaimerNote: React.FC<DisclaimerNoteProps> = ({ kind, className = '' }) => {
  if (kind === 'emergency') {
    return (
      <div
        className={`flex items-start gap-2.5 p-3 rounded-card bg-danger/10 border border-danger/25 text-danger text-xs leading-relaxed ${className}`}
        role="note"
      >
        <ShieldAlert size={16} className="shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Important Safety Notice:</strong> JammuKhoj is an offline informational companion and not a government dispatch center. In an emergency, dial <strong className="underline font-bold">112</strong> immediately.
        </div>
      </div>
    );
  }

  if (kind === 'fare') {
    return (
      <div
        className={`flex items-start gap-2 p-3 rounded-card bg-card border border-border text-stone text-xs leading-relaxed ${className}`}
        role="note"
      >
        <Info size={15} className="shrink-0 mt-0.5 text-primary" />
        <div>
          Fares displayed are surveyed reference benchmarks, not fixed binding prices. Always confirm meter or negotiated total prior to loading luggage.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-card bg-card border border-border text-stone text-xs leading-relaxed ${className}`}
      role="note"
    >
      <Info size={15} className="shrink-0 mt-0.5 text-primary" />
      <div>
        Offline walking times and road corridors are estimates based on standard OSM vector routing and normal traffic.
      </div>
    </div>
  );
};
