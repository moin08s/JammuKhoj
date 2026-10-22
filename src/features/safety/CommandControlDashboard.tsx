import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldAlert,
  Flame,
  AlertTriangle,
  Building,
  CheckCircle2,
  Sliders,
  Sparkles,
  PhoneCall,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  RefreshCw,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  FileText,
  Terminal,
  Radio,
  Eye,
  XCircle,
  X,
  AlertCircle,
} from 'lucide-react';
import { useCommandControlStore, type IncidentType, type AlertSeverity } from '@/stores/commandControlStore';
import {
  OFFICIAL_DISASTER_COMMANDER,
  COMMANDER_ACCESS_PIN,
  securityLimiter,
  securityAudit,
} from '@/services/securityService';
import { useNavigate } from 'react-router-dom';

export const CommandControlDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    locations,
    activeAlerts,
    festivalSurgeActive,
    selectedFestival,
    commanderSession,
    authenticateCommander,
    logoutCommander,
    signAndBroadcastAlert,
    injectTamperedAlertTest,
    toggleFestivalSurge,
    updateLocationCrowd,
    simulateIncident,
    resolveIncident,
    triggerEmergencyModal,
  } = useCommandControlStore();

  const [activeTab, setActiveTab] = useState<'crowd' | 'hazards' | 'dispatch' | 'audit' | 'evacuation'>('crowd');
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0].id);

  // Commander Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [badgeInput, setBadgeInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Dispatch Form State
  const [dispatchTitle, setDispatchTitle] = useState('');
  const [dispatchType, setDispatchType] = useState<IncidentType>('landslide');
  const [dispatchSeverity, setDispatchSeverity] = useState<AlertSeverity>('critical');
  const [dispatchLocation, setDispatchLocation] = useState('NH-44 Ramban-Banihal Corridor');
  const [dispatchCoords, setDispatchCoords] = useState<[number, number]>([75.242, 33.155]);
  const [dispatchRadius, setDispatchRadius] = useState<number>(3500);
  const [dispatchDesc, setDispatchDesc] = useState('');
  const [dispatchAction, setDispatchAction] = useState('');
  const [dispatchSafeSpot, setDispatchSafeSpot] = useState('Banihal Transit Safety Concourse');
  const [dispatchFeedback, setDispatchFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  // Auto-Sync Telemetry Simulator
  const [autoSync, setAutoSync] = useState(false);

  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      // Pick random location and simulate small natural fluctuation (+/- 80 to 220 pilgrims)
      const randomLoc = locations[Math.floor(Math.random() * locations.length)];
      if (!randomLoc) return;
      const delta = Math.floor(Math.random() * 300) - 120;
      const newCount = Math.max(1000, randomLoc.currentCount + delta);
      updateLocationCrowd(randomLoc.id, newCount);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoSync, locations, updateLocationCrowd]);

  const totalVisitors = locations.reduce((sum, loc) => sum + loc.currentCount, 0);
  const totalSafeCapacity = locations.reduce((sum, loc) => sum + loc.safeCapacity, 0);
  const criticalCount = locations.filter((loc) => loc.crowdLevel === 'critical').length;
  const highCount = locations.filter((loc) => loc.crowdLevel === 'high').length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = authenticateCommander(badgeInput, pinInput);
    if (res.success) {
      setShowAuthModal(false);
      setBadgeInput('');
      setPinInput('');
    } else {
      setAuthError(res.error || 'Authentication failed');
    }
  };

  const handleFillDemoCreds = () => {
    setBadgeInput(OFFICIAL_DISASTER_COMMANDER.officerId);
    setPinInput(COMMANDER_ACCESS_PIN);
    setAuthError(null);
  };

  const handleBroadcastDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setDispatchFeedback(null);

    if (!dispatchTitle.trim() || !dispatchAction.trim()) {
      setDispatchFeedback({ success: false, msg: 'Title and Mandatory Traveler Action are required.' });
      return;
    }

    const res = signAndBroadcastAlert({
      title: dispatchTitle,
      incidentType: dispatchType,
      severity: dispatchSeverity,
      locationName: dispatchLocation,
      coordinates: dispatchCoords,
      affectedRadiusMeters: dispatchRadius,
      description: dispatchDesc || `Official hazard directive issued for ${dispatchLocation}.`,
      actionRequired: dispatchAction,
      safeHoldingArea: {
        name: dispatchSafeSpot,
        coordinates: [dispatchCoords[0] - 0.05, dispatchCoords[1] - 0.05],
        capacity: 3000,
        amenities: ['Emergency Potable Water', 'First Aid Station', 'Satellite Telecom Post', 'Relief Langar'],
      },
    });

    if (res.success) {
      setDispatchFeedback({ success: true, msg: `Alert successfully signed and broadcasted across Jammu Division! (HMAC-SHA256 verified)` });
      setDispatchTitle('');
      setDispatchDesc('');
      setDispatchAction('');
    } else {
      setDispatchFeedback({ success: false, msg: res.error || 'Failed to dispatch alert.' });
    }
  };

  const auditLogs = securityAudit.getLogs();

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Officer Clearance Status Bar */}
      <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm transition-all ${
        commanderSession
          ? 'bg-emerald-950/80 border-emerald-500/50 text-white'
          : 'bg-amber-500/10 border-amber-500/30 text-ink'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            commanderSession ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-600'
          }`}>
            {commanderSession ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold">
              <span>{commanderSession ? 'COMMANDER CLEARANCE ACTIVE' : 'CIVIC OBSERVER MODE (READ-ONLY)'}</span>
              {commanderSession && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {commanderSession.clearanceLevel}
                </span>
              )}
            </div>
            <p className="text-[11px] opacity-80 mt-0.5">
              {commanderSession
                ? `${commanderSession.officerName} (${commanderSession.officerId}) • ${commanderSession.department}`
                : 'Authenticated Commander credentials required to broadcast signed alerts or modify gate protocols.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {commanderSession ? (
            <button
              onClick={() => logoutCommander()}
              className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              Lock Terminal / Sign Out
            </button>
          ) : (
            <button
              onClick={() => {
                setShowAuthModal(true);
                setAuthError(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Officer Login (Level-4)</span>
            </button>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-600/30 rounded-2xl p-4 sm:p-5 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300">
                Civic Authority Command & Control Room
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading mt-1 flex items-center gap-2">
              Crowd Density & Disaster Management Hub
            </h1>
            <p className="text-xs text-white/80 max-w-xl mt-1 leading-relaxed">
              Real-time pilgrim footfall monitoring, festival surge protocol regulator, landslide & hazard early warning dispatch for Jammu Division.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setAutoSync(!autoSync)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                autoSync
                  ? 'bg-emerald-400 text-black hover:bg-emerald-300'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
              title="Automatically pulses live telemetry counts every 8 seconds"
            >
              <Activity className={`w-3.5 h-3.5 ${autoSync ? 'animate-pulse text-black' : 'text-emerald-400'}`} />
              <span>{autoSync ? 'Live Sensor Feed (ON)' : 'Live Sensor Feed'}</span>
            </button>
            <button
              onClick={() => toggleFestivalSurge(!festivalSurgeActive)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                festivalSurgeActive
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{festivalSurgeActive ? 'Festival Surge Active (ON)' : 'Activate Festival Surge'}</span>
            </button>
            <button
              onClick={() => navigate('/map')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open Geographic Map</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-3.5 border-t border-white/15">
          <div className="p-2.5 bg-black/20 rounded-xl">
            <span className="text-[10px] text-white/70 block uppercase tracking-wider">Live Tracked Visitors</span>
            <div className="text-lg font-bold font-mono text-emerald-300">
              {totalVisitors.toLocaleString()}
            </div>
            <span className="text-[10px] text-white/60">Across 6 major hubs</span>
          </div>

          <div className="p-2.5 bg-black/20 rounded-xl">
            <span className="text-[10px] text-white/70 block uppercase tracking-wider">Total Safe Capacity</span>
            <div className="text-lg font-bold font-mono text-white">
              {totalSafeCapacity.toLocaleString()}
            </div>
            <span className="text-[10px] text-white/60">
              {Math.round((totalVisitors / totalSafeCapacity) * 100)}% utilized
            </span>
          </div>

          <div className="p-2.5 bg-black/20 rounded-xl">
            <span className="text-[10px] text-white/70 block uppercase tracking-wider">Critical Density Zones</span>
            <div className="text-lg font-bold font-mono text-danger">
              {criticalCount} Zone{criticalCount !== 1 ? 's' : ''}
            </div>
            <span className="text-[10px] text-amber-300">{highCount} at high alert</span>
          </div>

          <div className="p-2.5 bg-black/20 rounded-xl">
            <span className="text-[10px] text-white/70 block uppercase tracking-wider">Active Disaster Hazards</span>
            <div className="text-lg font-bold font-mono text-amber-400">
              {activeAlerts.length} Active
            </div>
            <span className="text-[10px] text-white/60">HMAC-Signed Dispatches</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('crowd')}
          className={`pb-2.5 px-3 sm:px-4 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'crowd'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Crowd Regulator ({locations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hazards')}
          className={`pb-2.5 px-3 sm:px-4 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'hazards'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Hazards Alerter ({activeAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatch')}
          className={`pb-2.5 px-3 sm:px-4 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'dispatch'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <Radio className="w-4 h-4 text-red-500" />
          <span>Emergency Dispatcher</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-2.5 px-3 sm:px-4 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'audit'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span>Cyber Security Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('evacuation')}
          className={`pb-2.5 px-3 sm:px-4 border-b-2 transition-colors flex items-center gap-1.5 shrink-0 ${
            activeTab === 'evacuation'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>Safe Havens</span>
        </button>
      </div>

      {/* Tab 1: Crowd Monitoring & Simulation */}
      {activeTab === 'crowd' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {locations.map((loc) => {
              const ratio = loc.currentCount / loc.safeCapacity;
              const isOver = loc.currentCount > loc.safeCapacity;

              let badgeColor = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
              if (loc.crowdLevel === 'critical') badgeColor = 'bg-danger/10 text-danger border-danger/30 animate-pulse';
              else if (loc.crowdLevel === 'high') badgeColor = 'bg-amber-500/10 text-amber-700 border-amber-500/30';

              return (
                <div
                  key={loc.id}
                  className={`p-3.5 bg-surface border rounded-xl shadow-xs space-y-2.5 transition-all ${
                    loc.crowdLevel === 'critical' ? 'border-danger/40 ring-1 ring-danger/20' : 'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone">
                          {loc.category.replace('_', ' ')}
                        </span>
                        {loc.festivalMode && (
                          <span className="text-[9px] bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded">
                            FESTIVAL SURGE
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-ink">{loc.name.en}</h3>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${badgeColor}`}>
                      {loc.crowdLevel} Density
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone mb-1 font-mono">
                      <span>{loc.currentCount.toLocaleString()} Yatris</span>
                      <span>Safe Limit: {loc.safeCapacity.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isOver ? 'bg-danger' : ratio > 0.8 ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, Math.round(ratio * 100))}%` }}
                      />
                    </div>
                  </div>

                  {/* Operational Controls & Status */}
                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-stone">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px]">
                        Gates: <strong className="text-ink uppercase">{loc.entryGatesStatus}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-[11px]">
                        Dispatches: <strong className="text-ink">{loc.activeDispatches}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateLocationCrowd(loc.id, Math.round(loc.currentCount * 1.15))}
                        className="p-1 px-2 text-[10px] bg-surface-subtle border border-border rounded hover:bg-surface font-semibold text-ink"
                        title="Simulate +15% Influx"
                      >
                        + Influx
                      </button>
                      <button
                        onClick={() => updateLocationCrowd(loc.id, Math.max(1000, Math.round(loc.currentCount * 0.85)))}
                        className="p-1 px-2 text-[10px] bg-surface-subtle border border-border rounded hover:bg-surface font-semibold text-ink"
                        title="Simulate -15% Dispersal"
                      >
                        - Disperse
                      </button>
                    </div>
                  </div>

                  {/* Evacuation Safe Haven Link */}
                  {loc.evacuationRoutes[0] && (
                    <div className="bg-surface-subtle p-2 rounded-lg text-xs flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="text-[10px] text-stone block">Designated Safe Spot:</span>
                        <strong className="text-ink truncate block">{loc.evacuationRoutes[0].safeSpotName}</strong>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/map', {
                            state: {
                              focusSafeSpot: loc.evacuationRoutes[0].safeSpotCoords,
                              safeSpotName: loc.evacuationRoutes[0].safeSpotName,
                              offlineMode: true,
                            },
                          });
                        }}
                        className="shrink-0 text-[10px] text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                      >
                        <span>View on Map</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Landslide & Hazard Early Warning Center */}
      {activeTab === 'hazards' && (
        <div className="space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                Active Early Warning Dispatcher & Threat Simulator
              </h3>
              <p className="text-xs text-stone mt-0.5">
                Cryptographically verifies alerts before displaying on citizens' screens. Block forged alerts from bad actors.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <button
                onClick={() => simulateIncident('landslide', 'loc_vaishno_devi_bhawan')}
                className="px-2.5 py-1.5 text-xs bg-danger text-white rounded-lg font-bold hover:bg-danger/90 transition-colors flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Simulate Landslide</span>
              </button>

              <button
                onClick={() => injectTamperedAlertTest(activeAlerts[0]?.id || 'alert_landslide_nh44')}
                className="px-2.5 py-1.5 text-xs bg-red-950 border border-red-500 text-red-200 rounded-lg font-bold hover:bg-red-900 transition-colors flex items-center gap-1"
                title="Simulates a forged or tampered packet to demonstrate client cryptographic rejection."
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                <span>Test Tampered Attack Detection</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 bg-surface border-2 border-danger/40 rounded-xl shadow-xs space-y-2.5 relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase bg-danger/15 text-danger px-2 py-0.5 rounded">
                        {alert.severity} • {alert.incidentType.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-stone">Issued: {alert.issuedAt}</span>
                      {alert.signedByOfficerId && (
                        <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                          Signed by: {alert.signedByOfficerId}
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-ink mt-1">{alert.title}</h4>
                    <span className="text-xs text-stone flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-danger" />
                      {alert.locationName} (Radius: {alert.affectedRadiusMeters}m)
                    </span>
                  </div>

                  <button
                    onClick={() => triggerEmergencyModal(alert)}
                    className="px-3 py-1.5 bg-danger text-white rounded-lg font-bold text-xs hover:bg-danger/90 transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                  >
                    <span>Trigger Modal Alert</span>
                  </button>
                </div>

                <p className="text-xs text-ink/90 leading-relaxed bg-surface-subtle p-2.5 rounded-lg border border-border">
                  {alert.description}
                </p>

                <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-xs space-y-1">
                  <strong className="text-amber-800 dark:text-amber-400 block font-semibold">
                    Traveler Early Warning Directive:
                  </strong>
                  <p className="text-ink">{alert.actionRequired}</p>
                </div>

                {/* Safe Haven Corridor */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-border text-xs">
                  <div>
                    <span className="text-[10px] text-stone uppercase block font-semibold">Safe Holding Concourse:</span>
                    <strong className="text-ink">{alert.safeHoldingArea.name}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigate('/map', {
                          state: {
                            focusSafeSpot: alert.safeHoldingArea.coordinates,
                            safeSpotName: alert.safeHoldingArea.name,
                            hazardCoords: alert.coordinates,
                            hazardName: alert.locationName,
                            offlineMode: true,
                          },
                        });
                      }}
                      className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold hover:bg-emerald-800 transition-colors flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Show Safe Spot on Map</span>
                    </button>
                    <button
                      onClick={() => resolveIncident(alert.id)}
                      className="px-2.5 py-1.5 border border-border rounded-lg text-stone hover:bg-surface-subtle font-semibold"
                    >
                      Resolve Hazard
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Officer Emergency Dispatcher (Cryptographically Signed) */}
      {activeTab === 'dispatch' && (
        <div className="space-y-4">
          {!commanderSession ? (
            <div className="p-6 bg-surface border border-border rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-600 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-ink">Disaster Commander Clearance Required</h3>
              <p className="text-xs text-stone max-w-md mx-auto">
                Only authenticated Level-4 Disaster Commanders can initiate division-wide emergency broadcasts. Please log in with your official officer credentials.
              </p>
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthError(null);
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs shadow-sm transition-all"
              >
                Authenticate Commander Account
              </button>
            </div>
          ) : (
            <form onSubmit={handleBroadcastDispatch} className="p-4 sm:p-5 bg-surface border border-border rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-ink">Broadcast Signed Civic Emergency Alert</h3>
                    <span className="text-[11px] text-stone">
                      Dispatched under authority of {commanderSession.officerName} [{commanderSession.officerId}]
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                  HMAC SIGNING READY
                </span>
              </div>

              {dispatchFeedback && (
                <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  dispatchFeedback.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-danger/10 border-danger/30 text-danger'
                }`}>
                  {dispatchFeedback.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                  <span>{dispatchFeedback.msg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Alert Headline / Title</label>
                  <input
                    type="text"
                    value={dispatchTitle}
                    onChange={(e) => setDispatchTitle(e.target.value)}
                    placeholder="e.g. URGENT: Flash Flood Alert at Tawi River Causeway"
                    className="w-full px-3 py-2 bg-surface-subtle border border-border rounded-xl text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Incident Type</label>
                  <select
                    value={dispatchType}
                    onChange={(e) => setDispatchType(e.target.value as IncidentType)}
                    className="w-full px-3 py-2 bg-surface-subtle border border-border rounded-xl text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="landslide">Mountain Landslide</option>
                    <option value="overcrowding">Corridor Overcrowding / Surge</option>
                    <option value="flash_flood">Flash Flood / Cloudburst</option>
                    <option value="weather">Severe Mountain Blizzard / Weather</option>
                    <option value="road_block">Highway Road Block / Bridge Closure</option>
                    <option value="stampede_risk">Stampede Risk Avoidance</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Target Location Zone</label>
                  <input
                    type="text"
                    value={dispatchLocation}
                    onChange={(e) => setDispatchLocation(e.target.value)}
                    placeholder="e.g. NH-44 Banihal Sector"
                    className="w-full px-3 py-2 bg-surface-subtle border border-border rounded-xl text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-ink block mb-1">Designated Safe Evacuation Haven</label>
                  <input
                    type="text"
                    value={dispatchSafeSpot}
                    onChange={(e) => setDispatchSafeSpot(e.target.value)}
                    placeholder="e.g. Banihal Community Relief Concourse"
                    className="w-full px-3 py-2 bg-surface-subtle border border-border rounded-xl text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">Mandatory Citizen Action Required</label>
                <textarea
                  value={dispatchAction}
                  onChange={(e) => setDispatchAction(e.target.value)}
                  placeholder="e.g. HALT ALL VEHICULAR MOVEMENT. Turn vehicles into Banihal Rest Area immediately."
                  rows={2}
                  className="w-full px-3 py-2 bg-surface-subtle border border-border rounded-xl text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">Description / Detailed Situation Brief</label>
                <textarea
                  value={dispatchDesc}
                  onChange={(e) => setDispatchDesc(e.target.value)}
                  placeholder="Details regarding road clearance teams, estimated delay, and langar facilities..."
                  rows={2}
                  className="w-full px-3 py-2 bg-surface-subtle border border-border rounded-xl text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Payload will be cryptographically sealed with HMAC-SHA256 upon submission.</span>
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-danger hover:bg-danger/90 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Sign & Broadcast Emergency Alert</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 4: Cyber Security Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <div className="p-3 bg-surface border border-border rounded-xl text-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-ink flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-600" />
                Immutable Cryptographic Audit Trail
              </h3>
              <p className="text-stone text-[11px] mt-0.5">
                Cryptographically records all commander logins, signature verifications, and intrusion attempts.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-subtle border border-border font-bold">
              {auditLogs.length} Events Tracked
            </span>
          </div>

          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-stone text-xs">
                No security audit events recorded yet in this session.
              </div>
            ) : (
              auditLogs.map((log) => {
                let badgeStyle = 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30';
                if (log.status === 'TAMPER_DETECTED' || log.status === 'BLOCKED') {
                  badgeStyle = 'bg-danger/15 text-danger border-danger/30 animate-pulse';
                } else if (log.status === 'FAILED') {
                  badgeStyle = 'bg-amber-500/15 text-amber-700 border-amber-500/30';
                }

                return (
                  <div key={log.id} className="p-3 bg-surface border border-border rounded-xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${badgeStyle}`}>
                          {log.status}
                        </span>
                        <strong className="text-ink font-mono text-[11px]">{log.action}</strong>
                      </div>
                      <span className="text-[10px] text-stone font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-stone text-[11px] leading-relaxed">
                      {log.details}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-border/50 text-[10px] font-mono text-stone">
                      <span>Officer ID: <strong>{log.officerId}</strong></span>
                      <span className="truncate max-w-[200px]" title={log.signature}>
                        HMAC: {log.signature.slice(0, 16)}...
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Safe Evacuation Havens Directory */}
      {activeTab === 'evacuation' && (
        <div className="space-y-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs space-y-1">
            <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verified Safe Evacuation Havens (Disaster Ready)
            </h3>
            <p className="text-stone">
              Designated reinforced assembly spots equipped with uninterrupted potable water, emergency medicine, satellite SOS, and helicopter evacuation platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {locations.flatMap((loc) =>
              loc.evacuationRoutes.map((route, idx) => (
                <div key={`${loc.id}-${idx}`} className="p-3.5 bg-surface border border-border rounded-xl shadow-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-stone uppercase block">
                        Serving: {loc.name.en}
                      </span>
                      <h4 className="font-bold text-sm text-ink">{route.safeSpotName}</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/15 text-emerald-700 font-bold px-2 py-0.5 rounded">
                      ~{route.distanceMeters}m
                    </span>
                  </div>

                  <p className="text-xs text-stone leading-relaxed bg-surface-subtle p-2 rounded-lg">
                    {route.guidance}
                  </p>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone">
                      Recommended: <strong className="text-ink uppercase">{route.recommendedMode}</strong>
                    </span>
                    <button
                      onClick={() => {
                        navigate('/map', {
                          state: {
                            focusSafeSpot: route.safeSpotCoords,
                            safeSpotName: route.safeSpotName,
                            offlineMode: true,
                          },
                        });
                      }}
                      className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg font-bold text-xs hover:bg-emerald-800 transition-colors flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Locate Haven</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Commander Authentication Gateway Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-ink">
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Disaster Commander Authentication</h3>
                  <span className="text-[10px] text-emerald-300 font-mono">JKDMA Level-4 Command Gateway</span>
                </div>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-1 text-white/70 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogin} className="p-4 sm:p-5 space-y-3.5">
              {authError && (
                <div className="p-2.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-ink block mb-1">Officer Badge ID</label>
                <input
                  type="text"
                  value={badgeInput}
                  onChange={(e) => setBadgeInput(e.target.value)}
                  placeholder="e.g. JKDMA-CMD-9021"
                  className="w-full px-3 py-2 bg-surface-subtle border border-border rounded-xl text-xs text-ink uppercase font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-ink block mb-1">Security PIN / Access Key</label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 6-digit PIN"
                  className="w-full px-3 py-2 bg-surface-subtle border border-border rounded-xl text-xs text-ink font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div className="p-2.5 bg-surface-subtle rounded-xl border border-border/80 text-[11px] text-stone space-y-1">
                <div className="flex items-center justify-between font-bold text-ink">
                  <span>Authorized Personnel:</span>
                  <span className="text-emerald-700 dark:text-emerald-400">DSP Rajeshwar Singh</span>
                </div>
                <div>Station: JKDMA Central Command, Jammu HQ</div>
                <div className="text-[10px] text-amber-700 dark:text-amber-400">
                  Rate limiting: 5 failed attempts will lock terminal for 15 minutes.
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleFillDemoCreds}
                  className="flex-1 py-2 px-3 border border-border rounded-xl text-xs font-semibold text-stone hover:bg-surface-subtle transition-colors"
                >
                  Auto-fill Demo Credentials
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Authenticate</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
