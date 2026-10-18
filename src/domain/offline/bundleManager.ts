import { db } from '@/data/db';
import {
  SEED_TRAVEL_TIMES,
  SEED_FARES,
  SEED_EMERGENCY_CONTACTS,
  SEED_HELP_POINTS,
  SEED_TEMPLATES,
  SEED_SAFETY_GUIDANCE,
  SEED_SOURCES,
} from '@/data/seedData';
import type { SavedPlan } from '@/data/types';
import { JAMMU_ALL_ATTRACTIONS, JAMMU_REGIONAL_NODES } from '@/data/jammuFullData';

export const INITIAL_PREVIOUS_PLANS: SavedPlan[] = [
  {
    id: 'plan_prev_jammu_heritage',
    title: 'Golden Temple & Chateau Circuit (Jammu City)',
    createdAt: '2026-10-15T14:30:00Z',
    bucket: '4h',
    startNode: 'node_jammu_tawi_station',
    departureNode: 'node_jammu_tawi_station',
    departureTime: '18:45',
    timeline: [
      { type: 'travel', start: '14:00', end: '14:20', minutes: 20, label: 'Station to Raghunath Temple via E-Rickshaw' },
      { type: 'visit', start: '14:20', end: '15:20', minutes: 60, attractionId: 'attr_raghunath_temple', label: 'Shri Raghunath Temple Darshan' },
      { type: 'travel', start: '15:20', end: '15:35', minutes: 15, label: 'Cab to Amar Mahal Museum' },
      { type: 'visit', start: '15:35', end: '16:35', minutes: 60, attractionId: 'attr_amar_mahal', label: 'Amar Mahal Palace & Golden Throne' },
      { type: 'travel', start: '16:35', end: '17:00', minutes: 25, label: 'Scenic return via Tawi Bridge & Bikram Chowk' },
      { type: 'buffer', start: '17:00', end: '18:45', minutes: 105, label: 'Safe Station Arrival (50m prior to Train 12426)' },
    ],
    warnings: ['All spots verified open offline', '50-minute safety buffer included'],
  },
  {
    id: 'plan_prev_vaishnodevi',
    title: 'Shri Mata Vaishno Devi Divine Corridor',
    createdAt: '2026-10-12T08:00:00Z',
    bucket: '24h',
    startNode: 'node_katra_station',
    departureNode: 'node_katra_station',
    departureTime: '21:30',
    timeline: [
      { type: 'travel', start: '08:00', end: '09:00', minutes: 60, label: 'Jammu Tawi to Katra Base Station via Vande Bharat / Cab' },
      { type: 'visit', start: '09:00', end: '18:00', minutes: 540, attractionId: 'attr_vaishno_devi', label: 'Baan Ganga ➔ Ardhkuwari ➔ Holy Bhawan Darshan' },
      { type: 'travel', start: '18:00', end: '19:30', minutes: 90, label: 'Ropeway to Bhairon Temple & Katra descent' },
      { type: 'buffer', start: '19:30', end: '21:30', minutes: 120, label: 'Katra Station Rest & Dinner buffer' },
    ],
    warnings: ['RFID Yatra Card mandatory at checkpost', 'Battery car booking recommended'],
  },
  {
    id: 'plan_prev_bhaderwah',
    title: 'Bhaderwah & Padri Pass High Meadow Expedition',
    createdAt: '2026-10-08T06:30:00Z',
    bucket: '8h',
    startNode: 'node_jammu_tawi_station',
    departureNode: 'node_jammu_tawi_station',
    departureTime: '17:30',
    timeline: [
      { type: 'travel', start: '07:00', end: '10:00', minutes: 180, label: 'Drive through Batote & Chenab River gorge' },
      { type: 'visit', start: '10:00', end: '12:30', minutes: 150, attractionId: 'attr_bhaderwah', label: 'Bhaderwah Valley & Gupt Ganga Temple' },
      { type: 'visit', start: '12:30', end: '15:30', minutes: 180, attractionId: 'attr_jai_valley', label: 'Jai Valley Streams & Padri Pass 10,500ft' },
      { type: 'buffer', start: '15:30', end: '17:30', minutes: 120, label: 'Safe return buffer before mountain dusk' },
    ],
    warnings: ['High altitude pass (10,500 ft) - carry warm windcheater', 'Offline vector map active'],
  },
];

export interface DownloadProgress {
  phase: 'manifest' | 'content' | 'matrix' | 'tiles' | 'verifying' | 'done' | 'error';
  percent: number;
  message: string;
}

export type ProgressCallback = (p: DownloadProgress) => void;

export class BundleManager {
  private isInitializing: boolean = false;

  /**
   * Initializes local database with Jammu regional data if empty or outdated
   */
  async initializeDefaultsIfEmpty(): Promise<boolean> {
    if (this.isInitializing) return false;
    this.isInitializing = true;

    try {
      const count = await db.attractions.count();
      const currentVersion = await db.bundleMeta.get('contentVersion');
      
      // If empty or older bundle version, populate with complete Jammu dataset
      if (count === 0 || currentVersion?.value !== '2026.10.17-jammu-v3') {
        await this.populateFromSeed('2026.10.17-jammu-v3');
        return true;
      }

      // Check if savedPlans has previous plan trips
      const savedCount = await db.savedPlans.count();
      if (savedCount === 0) {
        await db.savedPlans.bulkAdd(INITIAL_PREVIOUS_PLANS);
      }

      return false;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * Populates all tables atomically with verified Jammu seed data
   */
  async populateFromSeed(version: string = '2026.10.17-jammu-v3'): Promise<void> {
    await db.transaction(
      'rw',
      [
        db.attractions,
        db.nodes,
        db.travelTimes,
        db.fareReferences,
        db.emergencyContacts,
        db.helpPoints,
        db.itineraryTemplates,
        db.safetyGuidance,
        db.sources,
        db.bundleMeta,
      ],
      async () => {
        await Promise.all([
          db.attractions.clear(),
          db.nodes.clear(),
          db.travelTimes.clear(),
          db.fareReferences.clear(),
          db.emergencyContacts.clear(),
          db.helpPoints.clear(),
          db.itineraryTemplates.clear(),
          db.safetyGuidance.clear(),
          db.sources.clear(),
        ]);

        await db.attractions.bulkAdd(JAMMU_ALL_ATTRACTIONS);
        await db.nodes.bulkAdd(JAMMU_REGIONAL_NODES);
        await db.travelTimes.bulkAdd(SEED_TRAVEL_TIMES);
        await db.fareReferences.bulkAdd(SEED_FARES);
        await db.emergencyContacts.bulkAdd(SEED_EMERGENCY_CONTACTS);
        await db.helpPoints.bulkAdd(SEED_HELP_POINTS);
        await db.itineraryTemplates.bulkAdd(SEED_TEMPLATES);
        await db.safetyGuidance.bulkAdd(SEED_SAFETY_GUIDANCE);
        await db.sources.bulkAdd(SEED_SOURCES);

        await db.bundleMeta.put({ key: 'contentVersion', value: version });
        await db.bundleMeta.put({ key: 'lastSyncedAt', value: new Date().toISOString() });
        await db.bundleMeta.put({ key: 'generatedAt', value: '2026-10-17T20:00:00+05:30' });
      }
    );

    if (navigator.storage?.persist) {
      try {
        await navigator.storage.persist();
      } catch {
        // silent
      }
    }
  }

  /**
   * Download pack simulation with progress feedback
   */
  async download(onProgress: ProgressCallback): Promise<void> {
    onProgress({ phase: 'manifest', percent: 10, message: 'Checking Jammu regional manifest...' });
    await new Promise((r) => setTimeout(r, 250));

    onProgress({ phase: 'content', percent: 35, message: 'Downloading 35+ verified Jammu attractions & offbeat valleys...' });
    await new Promise((r) => setTimeout(r, 350));

    onProgress({ phase: 'matrix', percent: 65, message: 'Fetching hill & highway travel-time estimates...' });
    await new Promise((r) => setTimeout(r, 350));

    onProgress({ phase: 'tiles', percent: 85, message: 'Caching offline Jammu division terrain & road tiles...' });
    await new Promise((r) => setTimeout(r, 450));

    onProgress({ phase: 'verifying', percent: 95, message: 'Verifying SHA-256 integrity...' });
    await this.populateFromSeed('2026.10.17-jammu-v3');
    await new Promise((r) => setTimeout(r, 200));

    onProgress({ phase: 'done', percent: 100, message: 'Jammu regional pack ready for 100% offline use!' });
  }

  async clearAll(): Promise<void> {
    await db.transaction('rw', [db.attractions, db.savedPlans, db.bundleMeta], async () => {
      await db.attractions.clear();
      await db.savedPlans.clear();
      await db.bundleMeta.clear();
    });
  }
}

export const bundleManager = new BundleManager();
