import React from 'react';
import { ExternalLink } from 'lucide-react';

interface SourceLineProps {
  sourceName: string;
  updatedAt: string;
  sourceUrl?: string;
}

export const SourceLine: React.FC<SourceLineProps> = ({ sourceName, updatedAt, sourceUrl }) => {
  const formatted = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Recent';

  return (
    <div className="text-[11px] text-stone leading-relaxed">
      <span>Cites: </span>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-ink underline inline-flex items-center gap-0.5 hover:text-primary"
        >
          <span>{sourceName}</span>
          <ExternalLink size={10} />
        </a>
      ) : (
        <span className="font-medium text-ink">{sourceName}</span>
      )}
      <span className="opacity-75"> · Verified {formatted}</span>
    </div>
  );
};
