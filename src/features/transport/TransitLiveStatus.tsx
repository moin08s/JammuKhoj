import React, { useState } from 'react';
import {
  Train,
  Plane,
  Bus,
  Search,
  ExternalLink,
  Clock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const ChopperIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 4h20" />
    <path d="M12 4v5" />
    <path d="M4 14a8 8 0 0 0 16 0v-4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v4Z" />
    <path d="M4 19h16" />
    <path d="M7 14v5" />
    <path d="M17 14v5" />
    <path d="M20 12l2-4" />
  </svg>
);

export const TransitLiveStatus: React.FC = () => {
  const [pnrInput, setPnrInput] = useState('');
  const [trainNoInput, setTrainNoInput] = useState('');

  const handlePnrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;
    window.open(
      `https://www.confirmtkt.com/pnr-status/${encodeURIComponent(pnrInput.trim())}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleTrainLiveSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainNoInput.trim()) return;
    window.open(
      `https://enquiry.indianrail.gov.in/mntes/`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="font-heading text-base font-bold text-ink flex items-center gap-2">
            <span className="p-1 rounded-lg bg-primary/10 text-primary">
              <Clock size={16} />
            </span>
            <span>Live Transit & Schedule Checkers</span>
          </h3>
          <p className="text-xs text-stone">
            Verify real-time train running, flight delays, and Katra helicopter weather.
          </p>
        </div>
      </div>

      {/* Grid of 4 transit status portals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Train Running & PNR Card */}
        <div className="p-4 rounded-3xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Train size={16} />
            <span>Indian Railways (JAT & SVDK)</span>
          </div>

          <form onSubmit={handlePnrSearch} className="space-y-1.5">
            <label className="text-[10px] font-bold text-stone uppercase tracking-wider">
              10-Digit PNR Status Check
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                maxLength={10}
                placeholder="Enter PNR Number"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value)}
                className="flex-1 p-2 rounded-xl bg-surface border border-border text-xs text-ink focus:outline-hidden"
              />
              <button
                type="submit"
                className="py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold shrink-0 apple-press"
              >
                Check PNR
              </button>
            </div>
          </form>

          <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
            <a
              href="https://enquiry.indianrail.gov.in/mntes/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold flex items-center gap-1 text-[11px]"
            >
              <span>NTES Live Train Running</span>
              <ExternalLink size={11} />
            </a>
            <span className="text-[10px] text-stone">Official NTES</span>
          </div>
        </div>

        {/* Airport Flight Status */}
        <div className="p-4 rounded-3xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
            <Plane size={16} />
            <span>Jammu Airport (IXJ) Flights</span>
          </div>

          <p className="text-xs text-stone leading-relaxed">
            Direct tracking of daily inbound and outbound flights from Delhi, Mumbai, Srinagar, and Chandigarh.
          </p>

          <div className="space-y-2 pt-1">
            <a
              href="https://www.flightradar24.com/airport/ixj/arrivals"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-surface border border-border hover:bg-card text-ink font-semibold text-xs flex items-center justify-between transition-all apple-press"
            >
              <span>Live Arrivals Board (IXJ)</span>
              <ExternalLink size={13} className="text-stone" />
            </a>

            <a
              href="https://www.flightradar24.com/airport/ixj/departures"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-surface border border-border hover:bg-card text-ink font-semibold text-xs flex items-center justify-between transition-all apple-press"
            >
              <span>Live Departures Board (IXJ)</span>
              <ExternalLink size={13} className="text-stone" />
            </a>
          </div>
        </div>

        {/* Katra Helicopter Service Status */}
        <div className="p-4 rounded-3xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <ChopperIcon size={16} />
            <span>Katra ⇄ Sanjichhat Chopper</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-stone leading-relaxed">
            <strong>Weather Advisory:</strong> Helicopter operations are subject to visibility in Trikuta Hills. In case of dense fog or high winds, tickets are 100% refunded at Katra heli-base.
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <a
              href="https://online.maavaishnodevi.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>SMVDSB Chopper Portal</span>
              <ExternalLink size={11} />
            </a>
            <a
              href="tel:01991232125"
              className="text-[11px] font-semibold text-stone hover:text-ink"
            >
              Call Heli-Desk
            </a>
          </div>
        </div>

        {/* J&K RTC Bus Tracker */}
        <div className="p-4 rounded-3xl bg-card border border-border shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Bus size={16} />
            <span>J&K RTC Inter-City & Volvo</span>
          </div>

          <p className="text-xs text-stone leading-relaxed">
            Reserve AC Deluxe and Volvo coaches between Jammu General Bus Stand, Katra, Patnitop, and Srinagar.
          </p>

          <a
            href="https://jkrtc.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-surface border border-border hover:bg-card text-ink font-semibold text-xs flex items-center justify-between transition-all apple-press block mt-auto"
          >
            <span>JKRTC Official Online Booking</span>
            <ExternalLink size={13} className="text-stone" />
          </a>
        </div>
      </div>
    </div>
  );
};
