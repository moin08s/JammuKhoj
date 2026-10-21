import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  MapPin,
  Navigation,
  PhoneCall,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  Building,
  CheckCircle2,
  WifiOff,
  Maximize2,
  Map as MapIcon,
} from 'lucide-react';
import { useCommandControlStore } from '@/stores/commandControlStore';
import { OfflineCityDisasterMap } from '@/features/map/OfflineCityDisasterMap';

export const EmergencyDisasterModal: React.FC = () => {
  const navigate = useNavigate();
  const { activeEmergencyPopup, dismissEmergencyModal } = useCommandControlStore();

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showFullMapPreview, setShowFullMapPreview] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!activeEmergencyPopup) return null;

  const isLandslide = activeEmergencyPopup.incidentType === 'landslide';
  const isOvercrowd = activeEmergencyPopup.incidentType === 'overcrowding';

  const handleNavigateToSafeHaven = () => {
    dismissEmergencyModal();
    navigate('/map', {
      state: {
        focusSafeSpot: activeEmergencyPopup.safeHoldingArea.coordinates,
        safeSpotName: activeEmergencyPopup.safeHoldingArea.name,
        hazardCoords: activeEmergencyPopup.coordinates,
        hazardName: activeEmergencyPopup.locationName,
        hazardType: activeEmergencyPopup.incidentType,
        offlineMode: true,
      },
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disaster-alert-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-surface border-2 border-danger rounded-2xl shadow-2xl overflow-hidden flex flex-col text-ink max-h-[92vh]">
        {/* Urgent Header */}
        <div className="bg-danger px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase opacity-90 block">
                {activeEmergencyPopup.severity.toUpperCase()} CIVIC ALERT • {activeEmergencyPopup.issuedBy}
              </span>
              <h2 id="disaster-alert-title" className="text-sm sm:text-base font-bold leading-tight">
                {activeEmergencyPopup.incidentType === 'landslide' ? 'MOUNTAIN LANDSLIDE DANGER' : 'URGENT DISASTER SAFETY PROTOCOL'}
              </h2>
            </div>
          </div>
          <button
            onClick={dismissEmergencyModal}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Dismiss Alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
          {/* Offline Mode Active Banner */}
          <div className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
            isOffline
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block text-xs">
                  {isOffline ? 'Offline Mode Active • Local Map Ready' : '100% Offline Resilience Active'}
                </span>
                <span className="text-[10px] opacity-90">
                  Tactical city map, hazard zones, & safe havens are cached on-device without internet.
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold shrink-0">
              OFFLINE READY
            </span>
          </div>

          {/* Main Headline */}
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-xl">
            <h3 className="font-bold text-danger text-sm sm:text-base flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-danger" />
              <span>{activeEmergencyPopup.title}</span>
            </h3>
            <p className="mt-1.5 text-ink leading-relaxed">
              {activeEmergencyPopup.description}
            </p>
          </div>

          {/* Action Required Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <span className="font-bold text-amber-700 dark:text-amber-400 block text-xs uppercase tracking-wide">
              Mandatory Traveler Action:
            </span>
            <p className="mt-0.5 font-semibold text-ink">
              {activeEmergencyPopup.actionRequired}
            </p>
            {activeEmergencyPopup.alternativeRouteName && (
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-xs flex items-center gap-1.5 text-ink/80">
                <Compass className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span><strong>Recommended Divert Axis:</strong> {activeEmergencyPopup.alternativeRouteName}</span>
              </div>
            )}
          </div>

          {/* Embedded Offline Evacuation Map Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-ink">
              <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <MapIcon className="w-4 h-4" />
                <span>Offline Disaster & Safe Haven Map</span>
              </span>
              <button
                onClick={() => setShowFullMapPreview(!showFullMapPreview)}
                className="text-[10px] text-stone hover:text-ink font-semibold"
              >
                {showFullMapPreview ? 'Minimize Map' : 'Show Map'}
              </button>
            </div>

            {showFullMapPreview && (
              <div className="rounded-2xl overflow-hidden border border-border shadow-md">
                <OfflineCityDisasterMap
                  compact={true}
                  onOpenFullMap={handleNavigateToSafeHaven}
                  selectedAlert={activeEmergencyPopup}
                />
              </div>
            )}
          </div>

          {/* Designated Safe Haven Spot */}
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Designated Safe Holding Haven
              </span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Capacity: {activeEmergencyPopup.safeHoldingArea.capacity.toLocaleString()} Yatris
              </span>
            </div>
            
            <div className="flex items-start gap-2">
              <Building className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-ink text-sm">
                  {activeEmergencyPopup.safeHoldingArea.name}
                </h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeEmergencyPopup.safeHoldingArea.amenities.map((item, idx) => (
                    <span key={idx} className="text-[10px] bg-surface border border-emerald-500/20 text-stone px-1.5 py-0.5 rounded">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Hotline Direct Dial */}
          <div className="flex items-center justify-between p-2.5 bg-surface-subtle border border-border rounded-xl">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-danger animate-bounce" />
              <div>
                <span className="text-[10px] text-stone uppercase block font-semibold">Immediate Assistance</span>
                <span className="font-mono font-bold text-xs">{activeEmergencyPopup.emergencyHotline}</span>
              </div>
            </div>
            <a
              href={`tel:${activeEmergencyPopup.emergencyHotline.split('/')[0].trim()}`}
              className="px-3 py-1.5 bg-danger text-white rounded-lg font-bold text-xs hover:bg-danger/90 transition-colors flex items-center gap-1"
            >
              Call 112
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-surface-subtle border-t border-border flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleNavigateToSafeHaven}
            className="flex-1 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm text-xs sm:text-sm flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            <Navigation className="w-4 h-4 text-emerald-200" />
            <span>Open Safe Haven on City Map (Offline)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={dismissEmergencyModal}
            className="py-2 px-4 border border-border bg-surface text-stone font-semibold rounded-xl text-xs sm:text-sm hover:bg-surface-subtle transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
