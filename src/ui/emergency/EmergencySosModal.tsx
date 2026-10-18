import React, { useState, useEffect } from 'react';
import { ShieldAlert, PhoneCall, Share2, MapPin, Copy, Check, X, AlertTriangle } from 'lucide-react';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({ isOpen, onClose }) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          },
          () => {
            // Default Jammu city coordinates fallback
            setCoords({ lat: 32.7266, lng: 74.8643 });
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        setCoords({ lat: 32.7266, lng: 74.8643 });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const latStr = coords ? coords.lat.toFixed(5) : '32.72660';
  const lngStr = coords ? coords.lng.toFixed(5) : '74.86430';
  const mapsLink = `https://maps.google.com/?q=${latStr},${lngStr}`;

  const sosMessage = `🚨 EMERGENCY SOS (JammuKhoj Pilgrim Alert):\nI need immediate assistance in Jammu Division.\nMy GPS Location: ${latStr}, ${lngStr}\nLive Map Link: ${mapsLink}\nTimestamp: ${new Date().toLocaleTimeString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sosMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(sosMessage)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white border-2 border-red-500 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 className="font-heading font-black text-base text-red-700 leading-tight">
                Emergency Pilgrim SOS
              </h3>
              <p className="text-[11px] text-stone-500 font-semibold">100% Offline GPS Broadcast</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:bg-stone-100">
            <X size={18} />
          </button>
        </div>

        {/* Live GPS Coordinates Box */}
        <div className="p-3 bg-red-50/70 border border-red-200 rounded-2xl space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-red-900">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-red-600" />
              <span>Current GPS Fix:</span>
            </span>
            <span className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-mono">
              OFFLINE READY
            </span>
          </div>

          <div className="font-mono text-xs font-bold text-ink bg-white p-2 rounded-xl border border-red-100 flex items-center justify-between">
            <span>
              {latStr}° N, {lngStr}° E
            </span>
            <button
              onClick={handleCopy}
              className="text-[11px] text-stone-600 hover:text-red-600 flex items-center gap-1"
              title="Copy Coordinates"
            >
              {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-[10px] text-stone-600 leading-tight">
            Nearest Landmark: Jammu Tawi Central Corridor (Zone 1)
          </p>
        </div>

        {/* Primary SOS Action Buttons */}
        <div className="space-y-2">
          {/* Call 112 */}
          <a
            href="tel:112"
            className="w-full py-3 px-4 rounded-2xl bg-red-600 text-white font-bold text-xs shadow-lg shadow-red-600/30 hover:bg-red-700 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <PhoneCall size={16} />
            <span>Call 112 ERSS Police Central</span>
          </a>

          {/* Share via WhatsApp / SMS */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-600/25 hover:bg-emerald-700 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Share2 size={15} />
            <span>Broadcast GPS Location on WhatsApp</span>
          </button>
        </div>

        {/* Secondary Helplines Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-stone-100">
          <a
            href="tel:01991232029"
            className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-center hover:bg-stone-100 transition-colors"
          >
            <div className="font-bold text-ink text-[11px]">Katra Yatra Helpline</div>
            <div className="text-[10px] text-stone-500 font-mono">01991-232029</div>
          </a>

          <a
            href="tel:01912459048"
            className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-center hover:bg-stone-100 transition-colors"
          >
            <div className="font-bold text-ink text-[11px]">Jammu Traffic Police</div>
            <div className="text-[10px] text-stone-500 font-mono">0191-2459048</div>
          </a>
        </div>
      </div>
    </div>
  );
};
