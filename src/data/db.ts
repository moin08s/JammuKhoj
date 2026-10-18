import Dexie, { type Table } from 'dexie';
import type {
  Attraction,
  Node,
  TravelTime,
  FareReference,
  EmergencyContact,
  HelpPoint,
  ItineraryTemplate,
  SafetyGuidance,
  SourceRecord,
  SavedPlan,
  UserPreference,
  BundleMeta,
} from './types';

export class JammuKhojDB extends Dexie {
  attractions!: Table<Attraction, string>;
  nodes!: Table<Node, string>;
  travelTimes!: Table<TravelTime, [string, string, string]>;
  fareReferences!: Table<FareReference, string>;
  emergencyContacts!: Table<EmergencyContact, string>;
  helpPoints!: Table<HelpPoint, string>;
  itineraryTemplates!: Table<ItineraryTemplate, string>;
  safetyGuidance!: Table<SafetyGuidance, string>;
  sources!: Table<SourceRecord, string>;

  savedPlans!: Table<SavedPlan, string>;
  preferences!: Table<UserPreference, string>;
  bundleMeta!: Table<BundleMeta, string>;
  appLogs!: Table<import('./types').AppLogEntry, number>;

  constructor() {
    super('JammuKhojDB');

    this.version(1).stores({
      attractions: 'id, type, areaId, *tags, priority',
      nodes: 'id, kind',
      travelTimes: '[from+to+mode], from, to',
      fareReferences: 'id, routePairId, vehicle',
      emergencyContacts: 'id, category',
      helpPoints: 'id, kind, nodeId',
      itineraryTemplates: 'id, durationBucket, startArea',
      safetyGuidance: 'id, scenario',
      sources: 'id',

      savedPlans: 'id, createdAt, bucket',
      preferences: 'key',
      bundleMeta: 'key',
    });

    this.version(2).stores({
      attractions: 'id, type, areaId, city, isOffbeat, *tags, priority',
      nodes: 'id, kind, city',
      savedPlans: 'id, createdAt, bucket, city',
    });

    this.version(3).stores({
      appLogs: '++id, level, category, timestamp',
    });
  }
}

export const db = new JammuKhojDB();

export async function getBundleVersion(): Promise<string | null> {
  try {
    const meta = await db.bundleMeta.get('contentVersion');
    return meta?.value ?? null;
  } catch {
    return null;
  }
}

export async function getLastSyncTime(): Promise<string | null> {
  try {
    const meta = await db.bundleMeta.get('lastSyncedAt');
    return meta?.value ?? null;
  } catch {
    return null;
  }
}
