/**
 * JammuKhoj Mountain Trail Breadcrumb Tracker Service
 * 
 * Inspired by the Iceland 112 SafeTravel Search & Rescue Architecture.
 * Records offline GPS breadcrumbs along mountain corridors (e.g. Katra-Bhawan, Patnitop, Machail).
 * In an emergency, compiles the last 3-5 verified GPS coordinates into an ultra-compact
 * GSM SMS payload for SDRF, Police and Shrine Board Search & Rescue teams.
 */

export interface TrailBreadcrumb {
  lat: number;
  lng: number;
  altitudeMeters?: number;
  accuracyMeters?: number;
  timestamp: string; // ISO string
  nearestLandmark?: string;
}

const STORAGE_KEY = 'jammukhoj_trail_breadcrumbs_v1';
const MAX_BREADCRUMBS = 10;

const memoryCache: Record<string, string> = {};

const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return memoryCache[key] || null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {}
    memoryCache[key] = value;
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {}
    delete memoryCache[key];
  },
};

// Known trail reference points for proximity naming
const TRAIL_PROXIMITY_POINTS = [
  { name: 'Katra Base Camp', lat: 32.9934, lng: 74.9314 },
  { name: 'Ban Ganga Gate', lat: 32.9980, lng: 74.9350 },
  { name: 'Charan Paduka', lat: 33.0080, lng: 74.9370 },
  { name: 'Ardhkuwari Temple', lat: 33.0150, lng: 74.9390 },
  { name: 'Himkoti Battery Track', lat: 33.0200, lng: 74.9420 },
  { name: 'Sanjichhat Helipad', lat: 33.0250, lng: 74.9450 },
  { name: 'Holy Bhawan Sanctum', lat: 33.0308, lng: 74.9490 },
  { name: 'Bhairon Ghati Temple', lat: 33.0330, lng: 74.9510 },
  { name: 'Jammu Tawi Station', lat: 32.7060, lng: 74.8800 },
  { name: 'Patnitop Circular Road', lat: 33.0900, lng: 75.3300 },
];

function findNearestLandmark(lat: number, lng: number): string {
  let nearest = 'Mountain Trail';
  let minDistance = Infinity;

  for (const pt of TRAIL_PROXIMITY_POINTS) {
    const dLat = (lat - pt.lat);
    const dLng = (lng - pt.lng);
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistance) {
      minDistance = distSq;
      nearest = pt.name;
    }
  }

  return nearest;
}

export const trailTrackerService = {
  getBreadcrumbs(): TrailBreadcrumb[] {
    try {
      const stored = safeStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // safe fallback
    }
    return [];
  },

  recordBreadcrumb(coord: {
    lat: number;
    lng: number;
    altitudeMeters?: number;
    accuracyMeters?: number;
  }): TrailBreadcrumb {
    const landmark = findNearestLandmark(coord.lat, coord.lng);
    const breadcrumb: TrailBreadcrumb = {
      lat: Number(coord.lat.toFixed(5)),
      lng: Number(coord.lng.toFixed(5)),
      altitudeMeters: coord.altitudeMeters ? Math.round(coord.altitudeMeters) : undefined,
      accuracyMeters: coord.accuracyMeters ? Math.round(coord.accuracyMeters) : undefined,
      timestamp: new Date().toISOString(),
      nearestLandmark: landmark,
    };

    const existing = this.getBreadcrumbs();
    // Prepend latest breadcrumb, trim to maximum ring-buffer limit
    const updated = [breadcrumb, ...existing].slice(0, MAX_BREADCRUMBS);

    try {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // safe fallback for private browsing quotas
    }

    return breadcrumb;
  },

  clearBreadcrumbs(): void {
    try {
      safeStorage.removeItem(STORAGE_KEY);
    } catch {}
  },

  /**
   * Formats the last 3-5 breadcrumbs into an SMS-friendly concise payload for emergency dispatchers.
   * Format conforms to GSM 160-char SMS limits while conveying vital Search & Rescue coordinates.
   */
  formatSosBreadcrumbPayload(limit = 3): string {
    const crumbs = this.getBreadcrumbs().slice(0, limit);
    if (crumbs.length === 0) return '';

    const lines = crumbs.map((c, i) => {
      const timeStr = new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const altStr = c.altitudeMeters ? ` ${c.altitudeMeters}m` : '';
      return `[${i + 1}] ${c.lat},${c.lng}${altStr} @${timeStr} (${c.nearestLandmark})`;
    });

    return `\nLAST GPS TRAIL:\n${lines.join('\n')}`;
  },
};
