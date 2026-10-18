import React from 'react';
import { Building2, ShieldCheck, Link2, Users, Sparkles } from 'lucide-react';
import type { SourceType } from '@/data/types';

interface SourceBadgeProps {
  type: SourceType;
  size?: 'sm' | 'md';
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ type, size = 'sm' }) => {
  const isSm = size === 'sm';
  const iconSize = isSm ? 12 : 14;

  switch (type) {
    case 'official':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border border-primary/40 bg-primary/10 text-primary ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          }`}
          title="From official Government or Trust authority records"
        >
          <Building2 size={iconSize} />
          Official
        </span>
      );
    case 'verified_partner':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border border-success/40 bg-success/10 text-success ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          }`}
          title="Physically inspected & verified on-site by field surveyor"
        >
          <ShieldCheck size={iconSize} />
          Verified
        </span>
      );
    case 'third_party':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full border border-stone/30 bg-stone/10 text-stone ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          }`}
          title="Based on field surveys and standard observed tariffs"
        >
          <Link2 size={iconSize} />
          Survey Ref
        </span>
      );
    case 'community':
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded-full border border-dashed border-stone/40 bg-stone/5 text-stone ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Users size={iconSize} />
          Community
        </span>
      );
    case 'promoted':
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded-full border border-accent/40 bg-accent/15 text-accent-ink ${
            isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Sparkles size={iconSize} />
          Promoted
        </span>
      );
    default:
      return null;
  }
};
