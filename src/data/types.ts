export type SourceType = 'official' | 'verified_partner' | 'third_party' | 'community' | 'promoted';
export type VerificationStatus = 'verified' | 'unverified' | 'disputed';
export type FreshnessState = 'fresh' | 'aging' | 'stale';

export type UserRole = 'visitor' | 'business';

export interface BusinessProfile {
  businessName: string;
  category: 'hotel' | 'restaurant' | 'guide' | 'artisan' | 'transport' | 'shop';
  contactPhone: string;
  address: string;
  description: string;
  city?: string;
  isVerified: boolean;
  specialOffers?: string[];
  registeredOn: string;
}

export interface UserAccount {
  email: string;
  name: string;
  role: UserRole;
  authProvider?: 'email' | 'google';
  avatar?: string;
  businessDetails?: BusinessProfile;
  createdAt: string;
}

export interface Source {
  name: string;
  url: string;
  type: SourceType;
  retrievedOn: string;
}

export interface Verification {
  status: VerificationStatus;
  verifiedOn: string | null;
  verifiedBy: string | null;
  method: string;
}

export interface I18nString {
  en: string;
  hi: string;
}

export interface OpeningRule {
  days: string[];
  open: string | null;
  close: string | null;
}

export interface Attraction {
  id: string;
  type: 'heritage' | 'religious' | 'riverfront' | 'market' | 'food' | 'museum' | 'park' | 'nature' | 'monument' | 'lake' | 'valley' | 'waterfall' | 'wildlife';
  zone?: 'city' | 'day_trip' | 'offbeat_valley' | 'spiritual_hidden' | 'border_nature';
  isOffbeat?: boolean;
  name: I18nString;
  summary: I18nString;
  nodeId: string;
  areaId: string;
  tags: string[];
  visit: {
    typicalMinutes: number;
    minMinutes: number;
    bestTime: string;
    indoorOutdoor: 'indoor' | 'outdoor' | 'both';
  };
  priority: number;
  accessibility: {
    stepFree: boolean | null;
    restrooms: boolean | null;
    seating: boolean | null;
    walkingLoad: 'low' | 'medium' | 'high';
  };
  opening: OpeningRule[];
  entryFee: {
    amountInr: number | null;
    note: string;
  };
  cautions: string[];
  media: string[];
  source: Source;
  sourceType: SourceType;
  verification: Verification;
  updatedAt: string;
  reviewDueOn: string;
}

export interface Node {
  id: string;
  kind: 'departure' | 'attraction' | 'help' | 'junction';
  lat: number;
  lng: number;
  name: I18nString;
}

export interface TravelTime {
  from: string;
  to: string;
  mode: 'walk' | 'auto_taxi' | 'bus';
  minutes: {
    typical: number;
    peak: number;
  };
  distanceKm: number;
  basis: string;
  computedOn: string;
}

export interface FareReference {
  id: string;
  routePairId: string;
  vehicle: string;
  amount: {
    min: number | null;
    max: number | null;
    currency: 'INR';
  };
  basis: 'official_notified' | 'meter_estimate' | 'observed_survey';
  conditions: string;
  source: Source;
  sourceType: SourceType;
  verification: Verification;
  updatedAt: string;
  reviewDueOn: string;
  disclaimer: string;
}

export interface EmergencyContact {
  id: string;
  category: string;
  name: I18nString;
  number: string;
  availableOffline: boolean;
  notes: string;
  source: Source;
  verification: Verification;
}

export interface HelpPoint {
  id: string;
  kind: 'hospital' | 'police' | 'pharmacy' | 'railway_help' | 'tourist_help';
  nodeId: string;
  name: I18nString;
  phone: string | null;
  hours24x7: boolean;
  address: string;
  source: Source;
  verification: Verification;
}

export interface ItineraryTemplate {
  id: string;
  durationBucket: '4h' | '8h' | '24h';
  startArea: string;
  stops: {
    attractionId: string;
    order: number;
  }[];
  mobility: string[];
  notes: string;
}

export interface SafetyGuidance {
  id: string;
  scenario: string;
  steps: string[];
  relatedContacts: string[];
  source: Source;
  verification: Verification;
}

export interface SourceRecord {
  id: string;
  name: string;
  url: string;
  type: SourceType;
  lastChecked: string;
  contactPerson: string;
}

export interface TimelineEntry {
  type: 'settle' | 'travel' | 'visit' | 'buffer' | 'return';
  from?: string;
  to?: string;
  attractionId?: string;
  mode?: string;
  start: string;
  end?: string;
  minutes: number;
  fareRefId?: string | null;
  label?: string;
}

export interface SavedPlan {
  id: string;
  title: string;
  createdAt: string;
  bucket: '4h' | '8h' | '24h' | 'not_enough';
  city?: string;
  startNode: string;
  departureNode: string;
  departureTime: string;
  timeline: TimelineEntry[];
  warnings: string[];
}

export interface TripSuggestion {
  id: string;
  title: string;
  subtitle: string;
  zone: string;
  duration: string;
  vibe: 'popular' | 'offbeat' | 'nature' | 'pilgrimage' | 'heritage';
  attractionIds: string[];
  description: string;
  highlights: string[];
  tips: string[];
}

export interface UserPreference {
  key: string;
  value: string;
}

export interface BundleMeta {
  key: string;
  value: string;
}
