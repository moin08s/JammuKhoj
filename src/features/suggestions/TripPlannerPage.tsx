import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Clock,
  Compass,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Bookmark,
  Share2,
  Navigation,
  Eye,
  Filter,
  Check,
} from 'lucide-react';
import { db } from '@/data/db';
import type { Attraction, TripSuggestion, SavedPlan, TimelineEntry } from '@/data/types';
import { JAMMU_CURATED_SUGGESTIONS } from '@/data/jammuFullData';
import { getSpotImage } from '@/data/spotImages';
import { useAppStore } from '@/stores/appStore';
import { SourceBadge } from '@/ui/trust/SourceBadge';

export const TripPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();

  const [activeTab, setActiveTab] = useState<'suggestions' | 'custom'>('suggestions');
  const [allAttractions, setAllAttractions] = useState<Attraction[]>([]);
  const [attractionMap, setAttractionMap] = useState<Map<string, Attraction>>(new Map());

  // Filter for suggestions
  const [selectedZone, setSelectedZone] = useState<string>('all');

  // Custom Trip Builder State
  const [customStops, setCustomStops] = useState<string[]>([]);
  const [spotFilter, setSpotFilter] = useState<'all' | 'classic' | 'offbeat'>('all');
  const [selectedAddId, setSelectedAddId] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    db.attractions.toArray().then((attrs) => {
      setAllAttractions(attrs);
      const map = new Map<string, Attraction>();
      attrs.forEach((a) => map.set(a.id, a));
      setAttractionMap(map);
    });
  }, []);

  const suggestions = JAMMU_CURATED_SUGGESTIONS.filter((s) => {
    if (selectedZone !== 'all' && s.zone !== selectedZone) return false;
    return true;
  });

  const filteredCandidateSpots = allAttractions.filter((a) => {
    if (spotFilter === 'classic') return !a.isOffbeat;
    if (spotFilter === 'offbeat') return a.isOffbeat;
    return true;
  });

  const handleLoadSuggestion = (sugg: TripSuggestion) => {
    setCustomStops([...sugg.attractionIds]);
    setActiveTab('custom');
  };

  const handleAddStop = () => {
    if (!selectedAddId || customStops.includes(selectedAddId)) return;
    setCustomStops([...customStops, selectedAddId]);
    setSelectedAddId('');
  };

  const handleRemoveStop = (id: string) => {
    setCustomStops(customStops.filter((s) => s !== id));
  };

  // Calculate total estimated duration
  const totalMinutes = customStops.reduce((sum, id) => {
    const attr = attractionMap.get(id);
    return sum + (attr ? attr.visit.typicalMinutes + 25 : 50); // 25m transit buffer
  }, 30); // 30m base settle

  const handleSaveCustomPlan = async () => {
    if (customStops.length === 0) return;

    let timeCursor = 9 * 60; // 09:00 AM
    const timeline: TimelineEntry[] = [
      {
        type: 'settle',
        start: '09:00',
        end: '09:30',
        minutes: 30,
        label: 'Departure hub preparation & briefing',
      },
    ];
    timeCursor += 30;

    customStops.forEach((id) => {
      const attr = attractionMap.get(id);
      const visitMins = attr?.visit.typicalMinutes || 45;
      const travelMins = 25;

      // travel
      const travelStartH = Math.floor(timeCursor / 60);
      const travelStartM = timeCursor % 60;
      timeCursor += travelMins;
      const travelEndH = Math.floor(timeCursor / 60);
      const travelEndM = timeCursor % 60;

      timeline.push({
        type: 'travel',
        start: `${String(travelStartH).padStart(2, '0')}:${String(travelStartM).padStart(2, '0')}`,
        end: `${String(travelEndH).padStart(2, '0')}:${String(travelEndM).padStart(2, '0')}`,
        minutes: travelMins,
        mode: 'auto_taxi',
      });

      // visit
      const visitStartH = Math.floor(timeCursor / 60);
      const visitStartM = timeCursor % 60;
      timeCursor += visitMins;
      const visitEndH = Math.floor(timeCursor / 60);
      const visitEndM = timeCursor % 60;

      timeline.push({
        type: 'visit',
        attractionId: id,
        label: attr?.name.en,
        start: `${String(visitStartH).padStart(2, '0')}:${String(visitStartM).padStart(2, '0')}`,
        end: `${String(visitEndH).padStart(2, '0')}:${String(visitEndM).padStart(2, '0')}`,
        minutes: visitMins,
      });
    });

    const returnHour = Math.floor(timeCursor / 60);
    const returnMin = timeCursor % 60;
    const returnTime = `${String(returnHour).padStart(2, '0')}:${String(returnMin).padStart(2, '0')}`;

    const savedRecord: SavedPlan = {
      id: `custom_${Date.now()}`,
      title: `Jammu Custom Explorer Plan (${customStops.length} stops)`,
      createdAt: new Date().toISOString(),
      city: 'jammu',
      bucket: totalMinutes <= 360 ? '4h' : '8h',
      startNode: 'node_jammu_tawi_station',
      departureNode: 'node_jammu_tawi_station',
      departureTime: returnTime,
      timeline,
      warnings: [],
    };

    await db.savedPlans.put(savedRecord);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLaunchInMap = () => {
    if (customStops.length > 0) {
      const first = attractionMap.get(customStops[0]);
      navigate('/map', { state: { targetNode: first?.nodeId } });
    } else {
      navigate('/map');
    }
  };

  return (
    <div className="space-y-4 py-2 animate-in fade-in duration-200">
      {/* Header and User Greeting */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-bold text-ink">
            Jammu Trip Planner & Suggestions
          </h2>
          <p className="text-xs text-stone">
            Curated regional circuits and custom offline day itinerary builder.
          </p>
        </div>

        {currentUser && (
          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {currentUser.role === 'business' ? '🏪 Business Partner' : '🧳 Traveler'}
            </span>
            <div className="text-xs font-semibold text-ink truncate max-w-[120px]">
              {currentUser.name}
            </div>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-surface border border-border rounded-card">
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`py-2 px-3 rounded-control text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'suggestions'
              ? 'bg-card text-primary shadow-sm border border-border'
              : 'text-stone hover:text-ink'
          }`}
        >
          <Sparkles size={15} />
          <span>Curated Suggestions ({JAMMU_CURATED_SUGGESTIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`py-2 px-3 rounded-control text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'custom'
              ? 'bg-card text-primary shadow-sm border border-border'
              : 'text-stone hover:text-ink'
          }`}
        >
          <Compass size={15} />
          <span>Custom Builder ({customStops.length})</span>
        </button>
      </div>

      {/* TAB 1: CURATED SUGGESTIONS */}
      {activeTab === 'suggestions' && (
        <div className="space-y-3.5">
          {/* Zone Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none text-xs">
            {[
              { id: 'all', label: 'All Circuits' },
              { id: 'city', label: '🏛️ Jammu City' },
              { id: 'day_trip', label: '🚗 Day Trips' },
              { id: 'offbeat_valley', label: '🌲 Offbeat Valleys' },
              { id: 'border_nature', label: '🦅 Border & Forts' },
            ].map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all shrink-0 ${
                  selectedZone === z.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card border border-border text-stone hover:text-ink'
                }`}
              >
                {z.label}
              </button>
            ))}
          </div>

          {suggestions.map((sugg) => {
            const heroImg = getSpotImage(sugg.attractionIds[0]);
            return (
              <div
                key={sugg.id}
                className="overflow-hidden bg-card border border-border rounded-2xl shadow-sm hover:border-primary/40 transition-all group"
              >
                {/* Spot Hero Image First */}
                <div className="relative w-full h-36 bg-surface overflow-hidden">
                  <img
                    src={heroImg}
                    alt={sugg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-accent text-accent-ink shadow-sm">
                      {sugg.vibe}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1 text-white text-[11px] font-semibold shadow-sm">
                    <Clock size={12} className="text-primary" />
                    <span>{sugg.duration}</span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <h3 className="font-heading font-bold text-base leading-tight drop-shadow-md">
                      {sugg.title}
                    </h3>
                    <div className="text-[11px] text-white/80 font-medium">
                      {sugg.subtitle}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-stone leading-relaxed">
                    {sugg.description}
                  </p>

                  {/* Highlights */}
                  <div className="p-2.5 rounded-control bg-surface border border-border/80 text-xs space-y-1">
                    <div className="font-bold text-ink text-[11px]">Key Highlights:</div>
                    <ul className="list-disc pl-4 text-stone text-[11px] space-y-0.5">
                      {sugg.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="text-[11px] text-stone bg-primary-soft/40 p-2 rounded text-primary">
                    💡 <strong>Local Tip:</strong> {sugg.tips[0]}
                  </div>

                  {/* Included POI chips preview */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sugg.attractionIds.map((id) => {
                      const a = attractionMap.get(id);
                      if (!a) return null;
                      return (
                        <span
                          key={id}
                          className="px-2 py-0.5 rounded-full bg-surface border border-border text-[10px] font-medium text-ink flex items-center gap-1"
                        >
                          <span>{a.isOffbeat ? '✨' : '🏛️'}</span>
                          <span>{a.name.en}</span>
                        </span>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-border flex gap-2">
                    <button
                      onClick={() => handleLoadSuggestion(sugg)}
                      className="flex-1 py-2 rounded-control bg-primary text-white text-xs font-bold hover:bg-primary/95 shadow-sm transition-all flex items-center justify-center gap-1"
                    >
                      <Compass size={13} />
                      <span>Load Into Custom Builder</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: CUSTOM INTERACTIVE TRIP PLANNER */}
      {activeTab === 'custom' && (
        <div className="space-y-4">
          {saveSuccess && (
            <div className="bg-success/15 text-success text-xs font-semibold px-3 py-2 rounded-card text-center animate-in fade-in flex items-center justify-center gap-1">
              <Check size={14} />
              <span>Plan successfully saved to your offline Saved Itineraries!</span>
            </div>
          )}

          {/* Builder Controls */}
          <div className="bg-card border border-border rounded-card p-3.5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-ink">
                Add Places to Your Day Plan
              </h3>
              <span className="text-[11px] font-semibold text-primary">
                Est: {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </span>
            </div>

            {/* Filter by Classic vs Offbeat */}
            <div className="flex gap-1.5">
              {[
                { id: 'all' as const, label: 'All Places' },
                { id: 'classic' as const, label: '🏛️ Popular Must-Visits' },
                { id: 'offbeat' as const, label: '✨ Hidden Gems' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSpotFilter(f.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    spotFilter === f.id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface text-stone border-border hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <select
                value={selectedAddId}
                onChange={(e) => setSelectedAddId(e.target.value)}
                className="flex-1 px-3 py-2 rounded-control border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
              >
                <option value="">-- Choose place to add ({filteredCandidateSpots.length} options) --</option>
                {filteredCandidateSpots.map((a) => (
                  <option key={a.id} value={a.id} disabled={customStops.includes(a.id)}>
                    {a.isOffbeat ? '✨ [Hidden] ' : '🏛️ [Must-Visit] '} {a.name.en} (~{a.visit.typicalMinutes}m)
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAddStop}
                disabled={!selectedAddId}
                className="px-3.5 py-2 rounded-control bg-primary text-white text-xs font-bold hover:bg-primary/95 disabled:opacity-50 transition-all flex items-center gap-1 shrink-0"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Ordered Stops List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone px-1">
              <span className="font-bold uppercase tracking-wider">
                Planned Route Sequence ({customStops.length} stops)
              </span>
              <span>Tap trash icon to remove</span>
            </div>

            {customStops.length === 0 ? (
              <div className="p-6 rounded-card bg-surface border border-dashed border-border text-center space-y-2 text-stone text-xs">
                <Compass size={28} className="mx-auto text-stone" />
                <p>No places added to your plan yet.</p>
                <p className="text-[11px]">Select destinations above or load a curated trail from the Suggestions tab.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {customStops.map((id, index) => {
                  const attr = attractionMap.get(id);
                  if (!attr) return null;
                  return (
                    <div
                      key={id}
                      className="p-2.5 bg-card border border-border rounded-xl flex items-center justify-between gap-3 shadow-sm hover:border-primary/40 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface border border-border">
                          <img
                            src={getSpotImage(attr.id, attr.type)}
                            alt={attr.name.en}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-tl bg-primary text-white text-[9px] font-bold flex items-center justify-center shadow">
                            {index + 1}
                          </span>
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-ink">{attr.name.en}</span>
                            {attr.isOffbeat && (
                              <span className="text-[10px] bg-accent/20 text-accent-ink font-semibold px-1.5 py-0.2 rounded-full">
                                Hidden Gem
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone">
                            Visit: ~{attr.visit.typicalMinutes}m · {attr.visit.bestTime}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveStop(id)}
                        className="p-1.5 text-stone hover:text-danger rounded hover:bg-danger/10 transition-colors shrink-0"
                        title="Remove stop"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {customStops.length > 0 && (
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveCustomPlan}
                className="flex-1 py-3 rounded-control bg-primary text-white text-xs font-bold hover:bg-primary/95 shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Bookmark size={15} />
                <span>Save to Offline Plans</span>
              </button>

              <button
                onClick={handleLaunchInMap}
                className="flex-1 py-3 rounded-control border border-primary bg-card text-primary text-xs font-bold hover:bg-primary-soft shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Navigation size={15} />
                <span>View Pins on Map</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
