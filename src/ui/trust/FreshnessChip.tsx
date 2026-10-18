import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { FreshnessState } from '@/data/types';

interface FreshnessChipProps {
  verifiedOn: string | null;
  reviewDueOn?: string;
  size?: 'sm' | 'md';
}

export function getFreshnessState(verifiedOn: string | null, reviewDueOn?: string): FreshnessState {
  if (!verifiedOn) return 'stale';
  const now = new Date().getTime();
  const verified = new Date(verifiedOn).getTime();
  const diffDays = Math.floor((now - verified) / (1000 * 60 * 60 * 24));

  if (reviewDueOn && new Date(reviewDueOn).getTime() < now) {
    return 'stale';
  }
  if (diffDays <= 90) return 'fresh';
  if (diffDays <= 180) return 'aging';
  return 'stale';
}

export const FreshnessChip: React.FC<FreshnessChipProps> = ({ verifiedOn, reviewDueOn, size = 'sm' }) => {
  const state = getFreshnessState(verifiedOn, reviewDueOn);
  const isSm = size === 'sm';
  const iconSize = isSm ? 11 : 13;

  if (state === 'fresh') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium text-success ${
          isSm ? 'text-[11px]' : 'text-xs'
        }`}
        title={`Verified on ${verifiedOn || 'recent date'}`}
      >
        <CheckCircle2 size={iconSize} className="shrink-0" />
        Fresh ({verifiedOn ? new Date(verifiedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Verified'})
      </span>
    );
  }

  if (state === 'aging') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-medium text-warn ${
          isSm ? 'text-[11px]' : 'text-xs'
        }`}
        title={`Checked on ${verifiedOn || 'past date'}`}
      >
        <Clock size={iconSize} className="shrink-0" />
        Aging ({verifiedOn ? new Date(verifiedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Over 90d'})
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium bg-warn/15 text-warn px-1.5 py-0.5 rounded ${
        isSm ? 'text-[11px]' : 'text-xs'
      }`}
      title="Verification past 180 days. Check locally before relying."
    >
      <AlertTriangle size={iconSize} className="shrink-0" />
      Stale · Check first
    </span>
  );
};
