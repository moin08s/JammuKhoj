export interface PlannerConfig {
  settleTime: number; // minutes
  departureBuffer: {
    rail: number;
    bus: number;
    air: number;
  };
  delayBuffer: {
    percentOfTravel: number;
    minMinutes: number;
  };
  groupSlowdown: number;
  walkLimits: {
    walk_ok: number; // km
    minimal_walk: number;
    wheelchair: number;
  };
  buckets: {
    notEnoughMax: number; // minutes
    fourHourMax: number;
    eightHourMax: number;
  };
  peakMultiplier: number;
  peakHours: { start: number; end: number }[];
}

export const defaultConfig: PlannerConfig = {
  settleTime: 20,
  departureBuffer: {
    rail: 45,
    bus: 30,
    air: 150,
  },
  delayBuffer: {
    percentOfTravel: 0.15,
    minMinutes: 10,
  },
  groupSlowdown: 1.25,
  walkLimits: {
    walk_ok: 3.5,
    minimal_walk: 1.0,
    wheelchair: 0.5,
  },
  buckets: {
    notEnoughMax: 150, // under 2h 30m usable
    fourHourMax: 360,
    eightHourMax: 720,
  },
  peakMultiplier: 1.3,
  peakHours: [
    { start: 8, end: 10 },
    { start: 17, end: 19 },
  ],
};
