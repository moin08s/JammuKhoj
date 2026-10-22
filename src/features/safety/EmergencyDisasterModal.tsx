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
  Volume2,
  VolumeX,
  Radio,
} from 'lucide-react';
import { useCommandControlStore } from '@/stores/commandControlStore';
import { OfflineCityDisasterMap } from '@/features/map/OfflineCityDisasterMap';
import { audioAlertService } from '@/services/audioAlertService';
import { notificationService } from '@/services/notificationService';

export function calculateBearingAndDistance(
  fromLng: number,
  fromLat: number,
  toLng: number,
  toLat: number
): { distanceMeters: number; bearingDeg: number; cardinal: string } {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (fromLat * Math.PI) / 180;
  const phi2 = (toLat * Math.PI) / 180;
  const deltaPhi = ((toLat - fromLat) * Math.PI) / 180;
  const deltaLambda = ((toLng - fromLng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceMeters = Math.round(R * c);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const theta = Math.atan2(y, x);
  const bearingDeg = Math.round((theta * 180) / Math.PI + 360) % 360;

  const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const cardinal = cardinals[Math.round(bearingDeg / 45) % 8];

  return { distanceMeters, bearingDeg, cardinal };
}

export const EmergencyDisasterModal: React.FC = () => {
  const navigate = useNavigate();
  const { activeEmergencyPopup, dismissEmergencyModal } = useCommandControlStore();

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showFullMapPreview, setShowFullMapPreview] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLang, setVoiceLang] = useState<'hi' | 'doi' | 'en'>('hi');

  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [notificationPerm, setNotificationPerm] = useState<NotificationPermission>(
    notificationService.getPermission()
  );

  // Watch GPS and trigger siren & vibration once on popup emergence
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPos([pos.coords.longitude, pos.coords.latitude]),
        () => setUserPos(null),
        { timeout: 4000 }
      );
    }

    if (activeEmergencyPopup) {
      audioAlertService.playEmergencySiren(2.5);
    }
    return () => {
      audioAlertService.stopEmergencySiren();
      audioAlertService.stopSpeaking();
    };
  }, [activeEmergencyPopup]);

  const handleRequestPush = async () => {
    const res = await notificationService.requestPermission();
    setNotificationPerm(res);
  };

  const handlePlayVoice = (lang: 'hi' | 'doi' | 'en' = voiceLang) => {
    if (isSpeaking) {
      audioAlertService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    if (!activeEmergencyPopup) return;

    let voiceText = '';
    if (lang === 'hi' || lang === 'doi') {
      voiceText = `सावधान! नागरिक सुरक्षा निर्देश: ${activeEmergencyPopup.actionRequired}। निकटतम सुरक्षित आश्रय स्थल: ${activeEmergencyPopup.safeHoldingArea.name}। आपातकालीन नंबर 112 डायल करें।`;
    } else {
      voiceText = `Attention! Emergency civic directive: ${activeEmergencyPopup.actionRequired}. Designated safe holding area: ${activeEmergencyPopup.safeHoldingArea.name}. Dial 112 for emergency assistance.`;
    }

    setIsSpeaking(true);
    audioAlertService.speakEmergencyDirective(voiceText, lang, () => {
      setIsSpeaking(false);
    });
  };

  const handleClose = () => {
    audioAlertService.stopSpeaking();
    audioAlertService.stopEmergencySiren();
    dismissEmergencyModal();
  };

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

  const originLng = userPos ? userPos[0] : activeEmergencyPopup.coordinates[0];
  const originLat = userPos ? userPos[1] : activeEmergencyPopup.coordinates[1];
  const targetLng = activeEmergencyPopup.safeHoldingArea.coordinates[0];
  const targetLat = activeEmergencyPopup.safeHoldingArea.coordinates[1];

  const { distanceMeters, bearingDeg, cardinal } = calculateBearingAndDistance(
    originLng,
    originLat,
    targetLng,
    targetLat
  );
  const estWalkMin = Math.max(1, Math.round(distanceMeters / 80));

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
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            aria-label="Dismiss Alert"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
          {/* Spoken Voice Evacuation Broadcast (Speech Synthesis in Dogri / Hindi / English) */}
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => handlePlayVoice(voiceLang)}
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm ${
                  isSpeaking ? 'bg-danger text-white animate-pulse' : 'bg-primary text-white hover:bg-primary-hover'
                }`}
                title={isSpeaking ? 'Stop voice broadcast' : 'Play spoken audio directive'}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div className="min-w-0">
                <span className="font-bold text-xs text-ink block truncate">
                  {isSpeaking ? 'Speaking Directive Now...' : 'Listen to Spoken Instructions'}
                </span>
                <span className="text-[10px] text-stone block">
                  Voice guidance for rural & senior pilgrims
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 bg-surface rounded-lg p-0.5 border border-border">
              {(['hi', 'doi', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setVoiceLang(lang);
                    handlePlayVoice(lang);
                  }}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                    voiceLang === lang
                      ? 'bg-primary text-white'
                      : 'text-stone hover:text-ink'
                  }`}
                >
                  {lang === 'hi' ? 'हिन्दी' : lang === 'doi' ? 'डोगरी' : 'EN'}
                </button>
              ))}
            </div>
          </div>

          {/* Cryptographic Digital Signature & Anti-Tampering Shield */}
          {activeEmergencyPopup.signatureStatus === 'tampered' ? (
            <div className="p-3 bg-red-950/90 border-2 border-red-500 rounded-xl text-white shadow-md animate-pulse">
              <div className="flex items-center gap-2 text-red-300 font-bold text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>CYBER INTRUSION WARNING: TAMPERED BROADCAST DETECTED</span>
              </div>
              <p className="mt-1 text-[11px] text-red-100 leading-relaxed">
                The HMAC-SHA256 digital signature does not match the official JKDMA central key. This alert content or coordinates have been forged or altered in transit. Citizens are advised to ignore unverified instructions.
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-[10px] font-mono text-red-200">
                <span>DIGEST STATUS: CORRUPTED / REJECTED</span>
                <span>•</span>
                <span>SECURITY AUDIT LOGGED</span>
              </div>
            </div>
          ) : activeEmergencyPopup.signatureStatus === 'verified' ? (
            <div className="p-2.5 bg-emerald-950/50 border border-emerald-500/50 rounded-xl text-xs flex items-center justify-between text-emerald-300 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-[11px] block text-emerald-200">
                    CRYPTOGRAPHICALLY VERIFIED CIVIC BROADCAST
                  </span>
                  <span className="text-[10px] text-emerald-400/90 font-mono">
                    Signed by: {activeEmergencyPopup.signedByOfficerId || 'DSP Rajeshwar Singh [JKDMA-CMD-9021]'} • Level-4 Command
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold shrink-0">
                HMAC-SHA256 OK
              </span>
            </div>
          ) : (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs flex items-center justify-between text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <span className="font-bold text-[11px] block">
                    LEGACY / UNVERIFIED BROADCAST NOTICE
                  </span>
                  <span className="text-[10px] opacity-90">
                    Pending cryptographic re-issuance from Central Command.
                  </span>
                </div>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold shrink-0">
                UNVERIFIED
              </span>
            </div>
          )}

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

          {/* Tactical Evacuation Compass HUD */}
          <div className="p-3 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 rounded-xl text-white flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full border-2 border-emerald-400/40 bg-emerald-950 flex items-center justify-center shrink-0 shadow-inner">
                <span className="absolute top-0.5 text-[8px] font-mono text-emerald-400 font-bold">N</span>
                <span className="absolute bottom-0.5 text-[8px] font-mono text-slate-400 font-bold">S</span>
                <span className="absolute right-1 text-[8px] font-mono text-slate-400 font-bold">E</span>
                <span className="absolute left-1 text-[8px] font-mono text-slate-400 font-bold">W</span>
                <div
                  style={{ transform: `rotate(${bearingDeg}deg)` }}
                  className="transition-transform duration-500 ease-out"
                >
                  <Navigation className="w-5 h-5 text-emerald-400 drop-shadow" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                  Tactical Safe Spot Vector
                </span>
                <div className="text-sm font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="text-emerald-400">{distanceMeters > 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters} m`}</span>
                  <span className="text-white/60">•</span>
                  <span>~{estWalkMin} min walk</span>
                  <span className="text-white/60">•</span>
                  <span className="text-amber-300 font-mono text-xs">{cardinal} ({bearingDeg}°)</span>
                </div>
                <span className="text-[10px] text-white/70 block">
                  Direct heading towards: {activeEmergencyPopup.safeHoldingArea.name}
                </span>
              </div>
            </div>
          </div>

          {/* Lock-Screen Native Notification Permission Bar */}
          {notificationPerm !== 'granted' && (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-ink">
              <span className="text-[11px] text-amber-800 dark:text-amber-300">
                Receive lock-screen push sirens when phone is in your pocket.
              </span>
              <button
                type="button"
                onClick={handleRequestPush}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[10px] shrink-0 transition-colors shadow-xs"
              >
                Enable Push Alerts
              </button>
            </div>
          )}

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
            onClick={handleClose}
            className="py-2 px-4 border border-border bg-surface text-stone font-semibold rounded-xl text-xs sm:text-sm hover:bg-surface-subtle transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
