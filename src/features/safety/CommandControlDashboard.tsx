import React, { useState } from 'react';
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
} from 'lucide-react';
import { useCommandControlStore, type IncidentType, type AlertSeverity } from '@/stores/commandControlStore';
import { useNavigate } from 'react-router-dom';

export const CommandControlDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    locations,
    activeAlerts,
    festivalSurgeActive,
    selectedFestival,
    toggleFestivalSurge,
    updateLocationCrowd,
    simulateIncident,
    resolveIncident,
    triggerEmergencyModal,
  } = useCommandControlStore();

  const [activeTab, setActiveTab] = useState<'crowd' | 'hazards' | 'evacuation'>('crowd');
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0].id);

  const totalVisitors = locations.reduce((sum, loc) => sum + loc.currentCount, 0);
  const totalSafeCapacity = locations.reduce((sum, loc) => sum + loc.safeCapacity, 0);
  const criticalCount = locations.filter((loc) => loc.crowdLevel === 'critical').length;
  const highCount = locations.filter((loc) => loc.crowdLevel === 'high').length;

  const selectedLoc = locations.find((l) => l.id === selectedLocationId) || locations[0];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
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
            <span className="text-[10px] text-white/60">Early warning broadcasted</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('crowd')}
          className={`pb-2.5 px-3 sm:px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'crowd'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Location Crowd Regulator ({locations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hazards')}
          className={`pb-2.5 px-3 sm:px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'hazards'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Landslide & Hazard Alerter ({activeAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evacuation')}
          className={`pb-2.5 px-3 sm:px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'evacuation'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>Safe Evacuation Havens</span>
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
                Active Early Warning Dispatcher
              </h3>
              <p className="text-xs text-stone mt-0.5">
                Automatically triggers high-priority audio & visual pop-up banners for travelers approaching danger zones.
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => simulateIncident('landslide', 'loc_vaishno_devi_bhawan')}
                className="px-2.5 py-1.5 text-xs bg-danger text-white rounded-lg font-bold hover:bg-danger/90 transition-colors flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Simulate Mountain Landslide</span>
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
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase bg-danger/15 text-danger px-2 py-0.5 rounded">
                        {alert.severity} • {alert.incidentType.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-stone">Issued: {alert.issuedAt}</span>
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

      {/* Tab 3: Safe Evacuation Havens Directory */}
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
    </div>
  );
};
