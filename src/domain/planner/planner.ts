import { db } from '@/data/db';
import type { Attraction, TravelTime, TimelineEntry } from '@/data/types';
import { defaultConfig, type PlannerConfig } from './config';

export interface PlanInput {
  startNode: string;
  arrivalTime: string; // "06:10"
  departureNode: string;
  departureTime: string; // "14:00"
  departureMode: 'rail' | 'bus' | 'air';
  preferences: string[];
  mobility: 'walk_ok' | 'minimal_walk' | 'wheelchair';
  groupFlags: string[];
  luggage?: 'carrying' | 'stored';
}

export interface ExcludedStop {
  attractionId: string;
  name: string;
  reason: string;
}

export interface PlanOutput {
  planId: string;
  generatedAt: string;
  bucket: '4h' | '8h' | '24h' | 'not_enough';
  mustLeaveBy: string;
  mustBeAtDepartureBy: string;
  timeline: TimelineEntry[];
  warnings: string[];
  explanations: string[];
  excluded: ExcludedStop[];
  assumptions: Record<string, number | string>;
  totalWalkKm: number;
  usableMinutes: number;
}

function parseTimeToMinutes(t: string): number {
  const parts = t.split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

function formatMinutesToTime(mins: number): string {
  const normalized = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export async function generatePlan(
  input: PlanInput,
  config: PlannerConfig = defaultConfig
): Promise<PlanOutput> {
  const arrivalMin = parseTimeToMinutes(input.arrivalTime);
  let departureMin = parseTimeToMinutes(input.departureTime);

  // If departure is earlier than arrival (e.g. 23:00 to 07:00 next day)
  if (departureMin < arrivalMin) {
    departureMin += 1440;
  }

  const available = departureMin - arrivalMin;
  const depBuffer = config.departureBuffer[input.departureMode] ?? 45;
  const hasSlowdown =
    input.groupFlags.includes('children') ||
    input.groupFlags.includes('senior') ||
    input.mobility === 'minimal_walk';
  const slowdown = hasSlowdown ? config.groupSlowdown : 1.0;

  const settleTime = Math.round(config.settleTime * slowdown);

  // Load all data
  const allAttractions = await db.attractions.toArray();
  const allTravelTimes = await db.travelTimes.toArray();

  const travelMap = new Map<string, TravelTime>();
  for (const tt of allTravelTimes) {
    travelMap.set(`${tt.from}|${tt.to}|${tt.mode}`, tt);
  }

  function getTravelDuration(from: string, to: string): { minutes: number; mode: string; distanceKm: number } {
    if (from === to) return { minutes: 0, mode: 'walk', distanceKm: 0 };

    // Try auto_taxi first
    const autoKey = `${from}|${to}|auto_taxi`;
    if (travelMap.has(autoKey)) {
      const tt = travelMap.get(autoKey)!;
      return { minutes: Math.round(tt.minutes.typical * slowdown), mode: 'auto_taxi', distanceKm: tt.distanceKm };
    }

    // Try walk
    const walkKey = `${from}|${to}|walk`;
    if (travelMap.has(walkKey)) {
      const tt = travelMap.get(walkKey)!;
      return { minutes: Math.round(tt.minutes.typical * slowdown), mode: 'walk', distanceKm: tt.distanceKm };
    }

    // Fallback estimate based on city distances
    return { minutes: 15, mode: 'auto_taxi', distanceKm: 3.5 };
  }

  // Pre-filter candidates
  const excluded: ExcludedStop[] = [];
  const candidates: Attraction[] = [];

  for (const attr of allAttractions) {
    if (attr.verification.status === 'disputed') {
      excluded.push({ attractionId: attr.id, name: attr.name.en, reason: 'Information under dispute/verification' });
      continue;
    }

    if (input.mobility === 'wheelchair' && attr.accessibility.stepFree === false) {
      excluded.push({ attractionId: attr.id, name: attr.name.en, reason: 'Step-free access not confirmed for wheelchair' });
      continue;
    }

    candidates.push(attr);
  }

  // Budget calculations
  const estReturnTravel = getTravelDuration(input.startNode, input.departureNode).minutes || 20;
  const initialDelayBuffer = Math.max(config.delayBuffer.minMinutes, Math.round(estReturnTravel * config.delayBuffer.percentOfTravel));
  const fixedCosts = settleTime + depBuffer + estReturnTravel + initialDelayBuffer;
  const usableMinutes = available - fixedCosts;

  let bucket: '4h' | '8h' | '24h' | 'not_enough';
  if (usableMinutes < config.buckets.notEnoughMax) {
    bucket = 'not_enough';
  } else if (usableMinutes < config.buckets.fourHourMax) {
    bucket = '4h';
  } else if (usableMinutes < config.buckets.eightHourMax) {
    bucket = '8h';
  } else {
    bucket = '24h';
  }

  const mustBeAtDepartureBy = departureMin - depBuffer;
  const mustLeaveBy = mustBeAtDepartureBy - 10;

  if (bucket === 'not_enough') {
    return {
      planId: `plan_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      bucket: 'not_enough',
      mustLeaveBy: formatMinutesToTime(mustLeaveBy),
      mustBeAtDepartureBy: formatMinutesToTime(mustBeAtDepartureBy),
      timeline: [
        {
          type: 'settle',
          start: formatMinutesToTime(arrivalMin),
          end: formatMinutesToTime(arrivalMin + 30),
          minutes: 30,
          label: 'Tea & Refreshment nearby',
        },
      ],
      warnings: ['Time window too short for distant exploration without missing transit.'],
      explanations: [
        `You have ${Math.floor(available / 60)}h ${available % 60}m. With the required ${depBuffer}m buffer before departure and settle time, venturing into the old city risks delay.`,
        'Recommendation: Visit railway station waiting lounge, nearby market or river promenade directly adjacent to your departure hub.',
      ],
      excluded,
      assumptions: {
        departureBufferMins: depBuffer,
        settleTimeMins: settleTime,
        groupSlowdown: slowdown,
      },
      totalWalkKm: 0.2,
      usableMinutes,
    };
  }

  // Greedy Selection
  const selected: { attraction: Attraction; travelTo: { minutes: number; mode: string; distanceKm: number }; visitMinutes: number }[] = [];
  const visited = new Set<string>();

  let currentNode = input.startNode;
  let currentClock = arrivalMin + settleTime;
  let cumulativeWalkKm = 0;

  const maxStops = bucket === '4h' ? 2 : bucket === '8h' ? 4 : 6;

  while (selected.length < maxStops) {
    let bestAttr: Attraction | null = null;
    let bestScore = -1;
    let bestTravel = { minutes: 0, mode: 'auto_taxi', distanceKm: 0 };

    for (const attr of candidates) {
      if (visited.has(attr.id)) continue;

      const travel = getTravelDuration(currentNode, attr.nodeId);
      const visitTime = Math.round(attr.visit.typicalMinutes * slowdown);

      // Check return feasibility from this hypothetical stop
      const returnTrip = getTravelDuration(attr.nodeId, input.departureNode);
      const delayBuf = Math.max(config.delayBuffer.minMinutes, Math.round(returnTrip.minutes * config.delayBuffer.percentOfTravel));
      const finishTime = currentClock + travel.minutes + visitTime;
      const totalArrivalAtDeparture = finishTime + returnTrip.minutes + delayBuf;

      if (totalArrivalAtDeparture > mustBeAtDepartureBy) {
        continue;
      }

      // Check walk budget
      const nextWalk = cumulativeWalkKm + (travel.mode === 'walk' ? travel.distanceKm : 0.2);
      const walkLimit = config.walkLimits[input.mobility] ?? 3.5;
      if (nextWalk > walkLimit) {
        continue;
      }

      // Scoring: Priority + Tag Match / Cost
      const tagMatches = attr.tags.filter((t) => input.preferences.includes(t)).length;
      const prefBonus = 1 + tagMatches * 0.5;
      const score = (attr.priority * prefBonus) / (travel.minutes + visitTime);

      if (score > bestScore) {
        bestScore = score;
        bestAttr = attr;
        bestTravel = travel;
      }
    }

    if (!bestAttr) break;

    const visitMins = Math.round(bestAttr.visit.typicalMinutes * slowdown);
    selected.push({
      attraction: bestAttr,
      travelTo: bestTravel,
      visitMinutes: visitMins,
    });
    visited.add(bestAttr.id);

    currentClock += bestTravel.minutes + visitMins;
    currentNode = bestAttr.nodeId;
    if (bestTravel.mode === 'walk') {
      cumulativeWalkKm += bestTravel.distanceKm;
    }
  }

  // Construct Timeline
  const timeline: TimelineEntry[] = [];
  let clock = arrivalMin;

  // 1. Settle
  timeline.push({
    type: 'settle',
    start: formatMinutesToTime(clock),
    end: formatMinutesToTime(clock + settleTime),
    minutes: settleTime,
    label: 'Freshen up, luggage storage & tea',
  });
  clock += settleTime;

  let prevNode = input.startNode;

  for (const stop of selected) {
    // Travel Leg
    timeline.push({
      type: 'travel',
      from: prevNode,
      to: stop.attraction.nodeId,
      mode: stop.travelTo.mode,
      start: formatMinutesToTime(clock),
      end: formatMinutesToTime(clock + stop.travelTo.minutes),
      minutes: stop.travelTo.minutes,
      fareRefId: stop.travelTo.mode === 'walk' ? null : 'fare_station_bahu_auto',
    });
    clock += stop.travelTo.minutes;

    // Visit Leg
    timeline.push({
      type: 'visit',
      attractionId: stop.attraction.id,
      label: stop.attraction.name.en,
      start: formatMinutesToTime(clock),
      end: formatMinutesToTime(clock + stop.visitMinutes),
      minutes: stop.visitMinutes,
    });
    clock += stop.visitMinutes;

    prevNode = stop.attraction.nodeId;
  }

  // Return Leg
  const finalReturn = getTravelDuration(prevNode, input.departureNode);
  timeline.push({
    type: 'return',
    from: prevNode,
    to: input.departureNode,
    mode: finalReturn.mode,
    start: formatMinutesToTime(clock),
    end: formatMinutesToTime(clock + finalReturn.minutes),
    minutes: finalReturn.minutes,
    label: 'Head back to departure point',
  });
  clock += finalReturn.minutes;

  // Buffer Leg
  const finalDelayBuf = Math.max(config.delayBuffer.minMinutes, Math.round(finalReturn.minutes * config.delayBuffer.percentOfTravel));
  timeline.push({
    type: 'buffer',
    start: formatMinutesToTime(clock),
    end: formatMinutesToTime(clock + finalDelayBuf),
    minutes: finalDelayBuf,
    label: 'Traffic & platform security buffer',
  });

  const warnings: string[] = [];
  const explanations = [
    `Crafted around ${selected.length} high-priority destinations fitting your ${input.departureMode} transit buffer.`,
    `Strict ${depBuffer}-minute departure safety margin preserved.`,
  ];

  for (const item of selected) {
    if (item.attraction.verification.status !== 'verified') {
      warnings.push(`Opening hours for ${item.attraction.name.en} should be verified on-site.`);
    }
  }

  return {
    planId: `plan_${Date.now()}`,
    generatedAt: new Date().toISOString(),
    bucket,
    mustLeaveBy: formatMinutesToTime(mustLeaveBy),
    mustBeAtDepartureBy: formatMinutesToTime(mustBeAtDepartureBy),
    timeline,
    warnings,
    explanations,
    excluded,
    assumptions: {
      peakFactor: config.peakMultiplier,
      groupSlowdown: slowdown,
      settleTime,
      departureBuffer: depBuffer,
    },
    totalWalkKm: Math.round(cumulativeWalkKm * 10) / 10,
    usableMinutes,
  };
}
