import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Battery,
  Camera,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  X,
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { deviceService } from '@/services/deviceService';

interface PermissionRequestModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const PermissionRequestModal: React.FC<PermissionRequestModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const { setPermissionsReviewed, deviceGps, deviceBattery } = useAppStore();

  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [batteryStatus, setBatteryStatus] = useState<'idle' | 'active'>('idle');
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [photoAccessGranted, setPhotoAccessGranted] = useState(true);

  // Initialize battery on mount
  useEffect(() => {
    if (isOpen) {
      deviceService.initBatteryMonitor().then((status) => {
        if (status) setBatteryStatus('active');
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestLocation = async () => {
    setLocationStatus('requesting');
    const res = await deviceService.requestGpsLocation();
    if (res.success) {
      setLocationStatus('granted');
    } else {
      setLocationStatus('denied');
    }
  };

  const handleGrantAllAndContinue = async () => {
    // Request location
    await deviceService.requestGpsLocation();

    // Init battery
    await deviceService.initBatteryMonitor();

    // Request notification
    await deviceService.requestNotificationPermission();

    // Mark as reviewed
    setPermissionsReviewed(true);
    onComplete();
  };

  const handleSkip = () => {
    setPermissionsReviewed(true);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-3xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 select-none relative">
        {/* Top-Right Dismiss Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone hover:text-ink hover:bg-surface transition-colors"
          aria-label="Close setup modal"
          title="Skip for now"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-[#174D3C] text-white flex items-center justify-center mx-auto shadow-md shadow-[#174D3C]/25">
            <ShieldCheck size={26} />
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3C969] text-[#1C2923]">
            <Sparkles size={11} /> Device & Privacy Setup
          </span>
          <h2 className="font-heading text-xl font-bold text-ink">
            Tailor Your Jammu Experience
          </h2>
          <p className="text-xs text-stone leading-relaxed max-w-xs mx-auto">
            JammuKhoj runs 100% client-side. We request these permissions solely to provide live routing, battery saving, and accurate travel advice.
          </p>
        </div>

        {/* Permissions Cards */}
        <div className="space-y-2.5 pt-1">
          {/* 1. Precise GPS Location */}
          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#174D3C] dark:text-[#F3C969] flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-ink">Precise GPS Location</h4>
                  <p className="text-[11px] text-stone leading-tight">
                    For nearest shrines, transit walking time, and SOS 112 dispatch.
                  </p>
                </div>
              </div>

              {locationStatus === 'granted' || deviceGps ? (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <CheckCircle2 size={12} /> Active
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={locationStatus === 'requesting'}
                  className="px-2.5 py-1 rounded-lg bg-[#174D3C] text-white text-[10px] font-bold hover:bg-[#123E38] transition-colors shrink-0"
                >
                  {locationStatus === 'requesting' ? 'Detecting...' : 'Allow GPS'}
                </button>
              )}
            </div>

            {/* Live GPS Feedback */}
            {deviceGps && (
              <div className="text-[10px] font-mono bg-card px-2.5 py-1 rounded-lg border border-border text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                <span>📍 {deviceGps.lat}° N, {deviceGps.lng}° E</span>
                <span>Accuracy: ±{deviceGps.accuracy}m</span>
              </div>
            )}
          </div>

          {/* 2. Battery Status & Power Saving */}
          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Battery size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-ink">Battery Optimization</h4>
                  <p className="text-[11px] text-stone leading-tight">
                    Power saving mode when battery falls below 20% on long yatras.
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <Zap size={11} /> {deviceBattery ? `${deviceBattery.level}%` : '85% Active'}
              </span>
            </div>
          </div>

          {/* 3. Camera & Photos for Uploads */}
          <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <Camera size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-ink">Photo & Spot Uploads</h4>
                  <p className="text-[11px] text-stone leading-tight">
                    Upload accurate attraction photos, crowd reports & corrections.
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <CheckCircle2 size={12} /> Ready
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleGrantAllAndContinue}
            className="w-full py-3.5 px-4 rounded-xl bg-[#174D3C] text-white font-bold text-xs shadow-md shadow-[#174D3C]/25 hover:bg-[#123E38] transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <span>Grant Permissions & Start Journey</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-2 text-xs font-semibold text-stone hover:text-ink transition-colors text-center"
          >
            Skip for Now (Ask Later)
          </button>
        </div>
      </div>
    </div>
  );
};
