import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CalendarClock,
  ArrowRight,
  Bookmark,
  Share2,
  AlertTriangle,
  RotateCcw,
  Footprints,
  Car,
  MapPin,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Sparkles,
  ArrowLeftRight,
  PlusCircle,
  BadgeIndianRupee,
  Map as MapIcon,
} from 'lucide-react';
import { usePlanStore } from '@/stores/planStore';
import { ReturnByBar } from '@/ui/ReturnByBar';
import { DisclaimerNote } from '@/ui/DisclaimerNote';
import { db } from '@/data/db';
import type { Attraction, SavedPlan, TimelineEntry } from '@/data/types';
import { generatePlan } from '@/domain/planner/planner';

export const ItineraryPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { result, input, setResult, setGenerating } = usePlanStore();

  const [attractionMap, setAttractionMap] = useState<Map<string, Attraction>>(new Map());
  const [allAttractionsList, setAllAttractionsList] = useState<Attraction[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapTargetIndex, setSwapTargetIndex] = useState<number | null>(null);
  const [copyNotice, setCopyNotice] = useState(false);

  useEffect(() => {
    db.attractions.toArray().then((all) => {
      setAllAttractionsList(all);
      const map = new Map<string, Attraction>();
      all.forEach((a) => map.set(a.id, a));
      setAttractionMap(map);
    });
  }, []);

  if (!result) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <CalendarClock size={32} />
        </div>
        <h3 className="font-heading text-lg font-bold">No active itinerary</h3>
        <p className="text-xs text-stone max-w-xs mx-auto">
          Set your arrival and onward departure times to generate a realistic, time-boxed schedule.
        </p>
        <button
          onClick={() => navigate('/plan')}
          className="px-5 py-2.5 rounded-control bg-primary text-white text-xs font-bold shadow hover:bg-primary/95 transition-all"
        >
          Plan My Stop Now
        </button>
      </div>
    );
  }

  // Handle "Not Enough Time" case
  if (result.bucket === 'not_enough') {
    return (
      <div className="space-y-4 py-4 animate-in fade-in">
        <div className="p-4 rounded-card bg-warn/10 border border-warn/30 space-y-3">
          <div className="flex items-center gap-2 text-warn font-bold text-sm">
            <AlertTriangle size={18} />
            <span>{t('plan.not_enough_time')}</span>
          </div>
          <p className="text-xs text-ink leading-relaxed">
            {result.explanations[0]}
          </p>
          <p className="text-xs text-stone leading-relaxed">
            {result.explanations[1]}
          </p>
        </div>

        <div className="p-4 rounded-card bg-card border border-border space-y-3 shadow-sm">
          <h4 className="font-heading text-sm font-bold text-ink">
            Nearby Low-Stress Recommendations:
          </h4>
          <ul className="text-xs text-stone space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Jammu Tawi Executive Lounge:</strong> Rest, charge devices and store luggage right on Platform 1.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Tawi Riverfront Promenade:</strong> 15-minute quick walking trip to the river view without risking traffic.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span><strong>Local Sweet & Tea Shops:</strong> Try authentic Dogra Rajma-Chawal or Sund-Panjeeri directly outside the station gate.</span>
            </li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/plan')}
          className="w-full py-3 rounded-control border border-primary text-primary font-bold text-xs hover:bg-primary-soft transition-all"
        >
          Adjust Transit Time Window
        </button>
      </div>
    );
  }

  const handleRunningLate = async () => {
    // Recalculate late plan by cutting time window
    const now = new Date();
    const currHH = String(now.getHours()).padStart(2, '0');
    const currMM = String(now.getMinutes()).padStart(2, '0');
    setGenerating(true);

    try {
      const latePlan = await generatePlan({
        ...input,
        arrivalTime: `${currHH}:${currMM}`,
        groupFlags: [...input.groupFlags, 'running_late'],
      });
      setResult(latePlan);
    } catch (err) {
      console.error('Failed to recalibrate late plan:', err);
    }
  };

  const handleDelayedDeparture = async (extraMins: number = 30) => {
    const baseTime = result?.mustBeAtDepartureBy || input.departureTime || '18:00';
    const [dh, dm] = baseTime.split(':').map(Number);
    const totalMins = ((dh || 18) * 60 + (dm || 0) + extraMins) % 1440;
    const newHH = String(Math.floor(totalMins / 60)).padStart(2, '0');
    const newMM = String(totalMins % 60).padStart(2, '0');
    const newDepTime = `${newHH}:${newMM}`;
    setGenerating(true);
    try {
      const updatedPlan = await generatePlan({
        ...input,
        departureTime: newDepTime,
      });
      setResult(updatedPlan);
    } catch (err) {
      console.error('Failed to calibrate delayed departure:', err);
    }
  };

  const handleSwapStop = (itemIndex: number, newAttr: Attraction) => {
    if (!result) return;
    const updatedTimeline = result.timeline.map((entry, idx) => {
      if (idx === itemIndex && entry.type === 'visit') {
        return {
          ...entry,
          attractionId: newAttr.id,
          label: newAttr.name.en,
          minutes: newAttr.visit.typicalMinutes || entry.minutes,
        };
      }
      return entry;
    });

    setResult({
      ...result,
      timeline: updatedTimeline,
      explanations: [...result.explanations, `Swapped stop to ${newAttr.name.en} as requested.`],
    });
    setShowSwapModal(false);
    setSwapTargetIndex(null);
  };

  const handleSavePlan = async () => {
    const planRecord: SavedPlan = {
      id: result.planId,
      title: `${result.bucket.toUpperCase()} Jammu Exploration Circuit`,
      createdAt: new Date().toISOString(),
      bucket: result.bucket,
      startNode: input.startNode,
      departureNode: input.departureNode,
      departureTime: result.mustBeAtDepartureBy,
      timeline: result.timeline,
      warnings: result.warnings,
    };

    await db.savedPlans.put(planRecord);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleShare = () => {
    const text = `My Jammu transit plan (${result.bucket}):\n${result.timeline
      .filter((s) => s.type === 'visit' || s.type === 'return')
      .map((s) => `${s.start} - ${s.label || s.attractionId}`)
      .join('\n')}\nMust return by ${result.mustBeAtDepartureBy}. JammuKhoj app.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyNotice(true);
      setTimeout(() => setCopyNotice(false), 2500);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Return By Bar - Time Boxed Promise */}
      <ReturnByBar
        deadline={result.mustBeAtDepartureBy}
        departureHubName="Departure Hub"
        onHeadBackClick={() => navigate('/map', { state: { target: input.departureNode } })}
      />

      {/* Action Strip */}
      <div className="flex items-center justify-between gap-2 py-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {result.bucket.toUpperCase()} Circuit
          </span>
          <span className="text-[11px] text-stone">
            {result.timeline.filter((s) => s.type === 'visit').length} verified stops
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const firstVisit = result.timeline.find((s) => s.type === 'visit');
              const targetNode = firstVisit?.attractionId
                ? attractionMap.get(firstVisit.attractionId)?.nodeId || input.startNode
                : input.startNode;
              navigate('/map', { state: { targetNode } });
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-control bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all border border-primary/20 apple-press"
            title="View itinerary stops on interactive map"
          >
            <MapIcon size={12} />
            <span>Map Circuit</span>
          </button>

          <button
            onClick={handleRunningLate}
            className="flex items-center gap-1 px-2.5 py-1 rounded-control bg-warn/15 text-warn hover:bg-warn/25 text-xs font-bold transition-all border border-warn/30"
            title="Recalculate plan if delayed"
          >
            <RotateCcw size={12} />
            <span>Late?</span>
          </button>

          <button
            onClick={() => handleDelayedDeparture(30)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-control bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-all border border-primary/25"
            title="Train or flight delayed? Add 30 mins to layover"
          >
            <PlusCircle size={12} />
            <span>+30m</span>
          </button>

          <button
            onClick={handleSavePlan}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-control text-xs font-semibold border transition-all ${
              isSaved
                ? 'bg-success text-white border-success'
                : 'bg-card text-ink border-border hover:border-primary/40'
            }`}
          >
            {isSaved ? <CheckCircle2 size={13} /> : <Bookmark size={13} />}
            <span>{isSaved ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-control bg-card text-stone hover:text-ink border border-border"
            title="Copy plan summary"
          >
            <Share2 size={14} />
          </button>
        </div>
      </div>

      {copyNotice && (
        <div className="bg-primary-soft text-primary text-xs font-medium px-3 py-1.5 rounded-card text-center animate-in fade-in">
          Itinerary summary copied to clipboard!
        </div>
      )}

      {/* Warnings & Advisories */}
      {result.warnings.length > 0 && (
        <div className="p-3 rounded-card bg-warn/10 border border-warn/20 text-xs text-warn space-y-1">
          {result.warnings.map((w, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Sequential Timeline Component */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border before:pointer-events-none">
        {result.timeline.map((item, index) => {
          if (item.type === 'settle') {
            return (
              <div key={index} className="relative flex items-start gap-3 pl-1">
                <div className="w-6 h-6 rounded-full bg-stone/20 text-stone border border-border flex items-center justify-center shrink-0 z-10 text-[10px] font-bold">
                  ☕
                </div>
                <div className="flex-1 bg-card border border-border rounded-card p-3 shadow-sm text-xs">
                  <div className="flex items-center justify-between text-stone font-semibold mb-0.5">
                    <span>{item.label}</span>
                    <span className="tabular-nums font-bold text-ink">{item.start}</span>
                  </div>
                  <p className="text-[11px] text-stone">Freshen up, deposit baggage if needed, morning tea.</p>
                </div>
              </div>
            );
          }

          if (item.type === 'travel') {
            const isWalk = item.mode === 'walk';
            return (
              <div key={index} className="relative flex items-center gap-3 pl-1">
                <div className="w-6 h-6 rounded-full bg-surface border border-border text-stone flex items-center justify-center shrink-0 z-10">
                  {isWalk ? <Footprints size={12} /> : <Car size={12} />}
                </div>
                <div className="flex-1 flex items-center justify-between px-3 py-1.5 rounded-control bg-surface border border-dashed border-border text-xs text-stone">
                  <span className="flex items-center gap-1.5">
                    <span>{isWalk ? 'Walk' : 'Auto / Ride'}</span>
                    <span>·</span>
                    <span className="font-semibold">{item.minutes} mins</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/transport')}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold text-[10px] hover:bg-primary/20 transition-colors"
                      title="View verified prepaid tariff for this route"
                    >
                      <BadgeIndianRupee size={10} />
                      <span>₹ Fare Ref</span>
                    </button>
                    <span className="tabular-nums font-medium">{item.start} → {item.end}</span>
                  </div>
                </div>
              </div>
            );
          }

          if (item.type === 'visit') {
            const attr = item.attractionId ? attractionMap.get(item.attractionId) : null;
            return (
              <div key={index} className="relative flex items-start gap-3 pl-1">
                <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 z-10 text-xs font-bold shadow-sm">
                  {index}
                </div>
                <div className="flex-1 bg-card border border-border rounded-card p-3.5 shadow-sm space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-ink leading-tight">
                        {attr ? attr.name.en : item.label}
                      </h4>
                      <p className="text-[11px] text-stone mt-0.5">
                        Planned visit: {item.minutes} mins · Best: {attr?.visit.bestTime || 'Anytime'}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-primary tabular-nums shrink-0">
                      {item.start}
                    </span>
                  </div>

                  {attr && (
                    <p className="text-xs text-stone line-clamp-2 leading-relaxed">
                      {attr.summary.en}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-border/60">
                    <button
                      onClick={() => attr && navigate(`/explore/${attr.id}`)}
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      <span>Explore details</span>
                      <ExternalLink size={12} />
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSwapTargetIndex(index);
                          setShowSwapModal(true);
                        }}
                        className="text-[11px] font-semibold px-2 py-1 rounded border border-border bg-surface text-stone hover:text-ink hover:border-primary/40 flex items-center gap-1 transition-colors"
                        title="Swap this stop for another verified attraction"
                      >
                        <ArrowLeftRight size={11} />
                        <span>Swap stop</span>
                      </button>
                      <button
                        onClick={() => navigate('/map', { state: { targetNode: attr?.nodeId } })}
                        className="text-xs font-semibold px-2 py-1 rounded bg-primary-soft text-primary hover:bg-primary/20 transition-colors"
                      >
                        Map pin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (item.type === 'buffer') {
            return (
              <div key={index} className="relative flex items-center gap-3 pl-1">
                <div className="w-6 h-6 rounded-full bg-warn/20 text-warn border border-warn/40 flex items-center justify-center shrink-0 z-10 text-xs font-bold">
                  ⏱
                </div>
                <div className="flex-1 bg-warn/10 border border-warn/30 rounded-control px-3 py-2 text-xs flex items-center justify-between text-warn">
                  <span className="font-semibold">{item.label}</span>
                  <span className="font-bold tabular-nums">+{item.minutes} mins</span>
                </div>
              </div>
            );
          }

          if (item.type === 'return') {
            return (
              <div key={index} className="relative flex items-start gap-3 pl-1">
                <div className="w-6 h-6 rounded-full bg-accent text-accent-ink flex items-center justify-center shrink-0 z-10 text-xs font-bold shadow-sm">
                  ✓
                </div>
                <div className="flex-1 bg-accent/15 border border-accent/40 rounded-card p-3 shadow-sm text-accent-ink space-y-1">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>{item.label}</span>
                    <span className="tabular-nums">{item.start} → {item.end}</span>
                  </div>
                  <p className="text-[11px] opacity-90">
                    Arrive with clean {result.assumptions.departureBuffer || 45} mins buffer before your train/bus departure.
                  </p>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Explanations & Transparency */}
      <div className="pt-2">
        <button
          onClick={() => setShowWhyModal(true)}
          className="w-full py-2.5 px-3 rounded-control border border-border bg-card text-xs font-semibold text-stone hover:text-ink hover:border-primary/40 flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <HelpCircle size={14} className="text-primary" />
          <span>{t('plan.why_this_plan')}</span>
        </button>
      </div>

      <DisclaimerNote kind="map" />

      {/* Why This Plan Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in">
          <div className="bg-card border border-border rounded-card p-4 max-w-sm w-full space-y-3 shadow-toast max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
                <Sparkles size={16} className="text-primary" />
                <span>Engine Validation & Assumptions</span>
              </h3>
              <button
                onClick={() => setShowWhyModal(false)}
                className="text-stone hover:text-ink text-xs font-bold px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone">
              <p className="font-semibold text-ink">Selected Rationale:</p>
              <ul className="space-y-1 list-disc pl-4">
                {result.explanations.map((exp, i) => (
                  <li key={i}>{exp}</li>
                ))}
              </ul>

              {result.excluded.length > 0 && (
                <>
                  <p className="font-semibold text-ink pt-1">Safely Excluded from Plan:</p>
                  <ul className="space-y-1 text-[11px] pl-4">
                    {result.excluded.map((exc, i) => (
                      <li key={i} className="list-disc">
                        <strong>{exc.name}:</strong> {exc.reason}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="bg-surface p-2.5 rounded-control border border-border text-[11px] space-y-0.5 mt-2">
                <div>• Total Walking Distance: <strong>~{result.totalWalkKm} km</strong></div>
                <div>• Settle / Freshen-up Buffer: <strong>{result.assumptions.settleTime || 20}m</strong></div>
                <div>• Mandatory Transit Buffer: <strong>{result.assumptions.departureBuffer || 45}m</strong></div>
                <div>• Peak Factor: <strong>x{result.assumptions.peakFactor || 1.3}</strong></div>
              </div>
            </div>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full py-2 rounded-control bg-primary text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Swap Stop Modal (USER_FLOWS.md §3) */}
      {showSwapModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in">
          <div className="bg-card border border-border rounded-card p-4 max-w-sm w-full space-y-3 shadow-toast max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
                <ArrowLeftRight size={16} className="text-primary" />
                <span>Swap Attraction Stop</span>
              </h3>
              <button
                onClick={() => {
                  setShowSwapModal(false);
                  setSwapTargetIndex(null);
                }}
                className="text-stone hover:text-ink text-xs font-bold px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone">
              Select an alternative verified Jammu destination to replace this circuit stop:
            </p>

            <div className="space-y-2 pt-1">
              {allAttractionsList
                .filter(
                  (cand) =>
                    !result.timeline.some(
                      (t) => t.type === 'visit' && t.attractionId === cand.id
                    )
                )
                .slice(0, 8)
                .map((cand) => (
                  <div
                    key={cand.id}
                    onClick={() => swapTargetIndex !== null && handleSwapStop(swapTargetIndex, cand)}
                    className="p-3 bg-surface hover:bg-primary-soft/50 border border-border rounded-control cursor-pointer transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-ink">{cand.name.en}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                        ~{cand.visit.typicalMinutes}m
                      </span>
                    </div>
                    <p className="text-[11px] text-stone line-clamp-1">{cand.summary.en}</p>
                  </div>
                ))}
            </div>

            <button
              onClick={() => {
                setShowSwapModal(false);
                setSwapTargetIndex(null);
              }}
              className="w-full py-2 rounded-control border border-border text-xs font-semibold text-stone hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
