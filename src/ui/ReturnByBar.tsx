import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface ReturnByBarProps {
  deadline: string; // "13:15"
  departureHubName?: string;
  onHeadBackClick?: () => void;
  className?: string;
}

export const ReturnByBar: React.FC<ReturnByBarProps> = ({
  deadline,
  departureHubName = 'Jammu Tawi Station',
  onHeadBackClick,
  className = '',
}) => {
  const [minutesRemaining, setMinutesRemaining] = useState<number>(0);

  useEffect(() => {
    function calculateDiff() {
      const now = new Date();
      const [dh, dm] = deadline.split(':').map(Number);
      const target = new Date();
      target.setHours(dh, dm, 0, 0);

      // If already past today, or near midnight
      let diffMs = target.getTime() - now.getTime();
      if (diffMs < -720 * 60 * 1000) {
        target.setDate(target.getDate() + 1);
        diffMs = target.getTime() - now.getTime();
      }

      const diffMins = Math.round(diffMs / (60 * 1000));
      setMinutesRemaining(diffMins);
    }

    calculateDiff();
    const interval = setInterval(calculateDiff, 15000);
    return () => clearInterval(interval);
  }, [deadline]);

  const isPassed = minutesRemaining <= 0;
  const isUrgent = minutesRemaining > 0 && minutesRemaining <= 30;
  const isWarning = minutesRemaining > 30 && minutesRemaining <= 60;

  const hours = Math.floor(Math.abs(minutesRemaining) / 60);
  const mins = Math.abs(minutesRemaining) % 60;
  const timeText = isPassed
    ? `${mins}m overdue!`
    : hours > 0
    ? `${hours}h ${mins}m remaining`
    : `${mins}m remaining`;

  let badgeStyle = 'bg-accent/15 border-accent/30 text-accent-ink';
  if (isPassed) badgeStyle = 'bg-danger/15 border-danger/30 text-danger animate-pulse';
  else if (isUrgent) badgeStyle = 'bg-accent border-accent text-accent-ink shadow-md font-bold';
  else if (isWarning) badgeStyle = 'bg-warn/15 border-warn/30 text-warn';

  return (
    <div
      role="timer"
      aria-live="polite"
      className={`sticky top-14 z-20 w-full rounded-card border p-3.5 flex items-center justify-between gap-3 shadow-sm transition-colors ${badgeStyle} ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-10 h-10 rounded-full bg-card/80 border border-current/20 flex items-center justify-center shrink-0">
          {isPassed || isUrgent ? <AlertTriangle size={20} /> : <Clock size={20} />}
        </div>
        <div className="truncate">
          <div className="text-[11px] uppercase tracking-wider font-semibold opacity-85">
            Return-By Clock · {departureHubName}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight tabular-nums">
              {deadline}
            </span>
            <span className="text-xs font-semibold tabular-nums opacity-90">
              ({timeText})
            </span>
          </div>
        </div>
      </div>

      {onHeadBackClick && (
        <button
          onClick={onHeadBackClick}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-control bg-card text-ink text-xs font-bold border border-border shadow-sm hover:bg-surface active:scale-95 transition-all"
        >
          <span>Return Now</span>
          <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};
