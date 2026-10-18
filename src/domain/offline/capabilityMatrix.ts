export type OfflineCapability = 'works_offline' | 'needs_internet' | 'degraded_offline';

export interface FeatureCapability {
  featureKey: string;
  label: string;
  capability: OfflineCapability;
  notes: string;
}

export const capabilityMatrix: FeatureCapability[] = [
  {
    featureKey: 'browse_attractions',
    label: 'Browse Attractions & Cultural Depth',
    capability: 'works_offline',
    notes: 'Stored in IndexedDB with full verified opening hours and photos',
  },
  {
    featureKey: 'generate_plan',
    label: '4h / 8h / 24h Itinerary Planner',
    capability: 'works_offline',
    notes: 'Calculates on-device orienteering graph with non-negotiable return buffer',
  },
  {
    featureKey: 'offline_map',
    label: 'Interactive Map & Pilot Area POIs',
    capability: 'works_offline',
    notes: 'Offline vector map tiles for central Jammu & departure corridors',
  },
  {
    featureKey: 'fare_cards',
    label: 'Transport Fares & Scam Verification',
    capability: 'works_offline',
    notes: 'Dated reference cards with verification method and negotiation tips',
  },
  {
    featureKey: 'emergency_sos',
    label: 'Emergency 112 & Tourist Helpline',
    capability: 'works_offline',
    notes: 'Numbers cached in PWA app shell; direct tel: dialing without network',
  },
  {
    featureKey: 'help_points',
    label: 'Nearest Hospitals & Police Posts',
    capability: 'works_offline',
    notes: 'Offline coordinates and distances from current landmark',
  },
  {
    featureKey: 'copy_location',
    label: 'Copy Exact GPS Coordinates',
    capability: 'works_offline',
    notes: 'Produces readable text dispatch description without sending telemetry',
  },
  {
    featureKey: 'pack_update',
    label: 'Over-the-Air Bundle Updates',
    capability: 'needs_internet',
    notes: 'Downloads latest rate revisions and temporary festival advisories',
  },
];
