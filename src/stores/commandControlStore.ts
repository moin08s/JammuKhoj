import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  OFFICIAL_DISASTER_COMMANDER,
  COMMANDER_ACCESS_PIN,
  type DisasterCommanderProfile,
  type AlertSigningPayload,
  signAlertPayload,
  verifyAlertIntegrity,
  sanitizeText,
  securityLimiter,
  securityAudit,
} from '@/services/securityService';
import { notificationService } from '@/services/notificationService';

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type IncidentType = 'landslide' | 'overcrowding' | 'flash_flood' | 'weather' | 'road_block' | 'stampede_risk';
export type CrowdLevel = 'normal' | 'moderate' | 'high' | 'critical';

export interface LocationCrowdState {
  id: string;
  name: { en: string; hi: string; doi: string };
  category: 'temple' | 'transit_hub' | 'heritage' | 'mountain_track';
  coordinates: [number, number]; // [lng, lat]
  currentCount: number;
  safeCapacity: number;
  maxSurgeCapacity: number;
  crowdLevel: CrowdLevel;
  festivalMode: boolean;
  festivalName?: string;
  activeDispatches: number;
  lastUpdated: string;
  entryGatesStatus: 'open' | 'regulated' | 'closed';
  holdingAreaAvailable: boolean;
  evacuationRoutes: {
    safeSpotName: string;
    safeSpotCoords: [number, number];
    distanceMeters: number;
    recommendedMode: 'walking' | 'e-rickshaw' | 'shuttle';
    guidance: string;
  }[];
}

export interface DisasterHazardAlert {
  id: string;
  title: string;
  incidentType: IncidentType;
  severity: AlertSeverity;
  locationName: string;
  coordinates: [number, number]; // [lng, lat]
  affectedRadiusMeters: number;
  description: string;
  actionRequired: string;
  alternativeRouteName?: string;
  alternativeRoutePath?: [number, number][];
  safeHoldingArea: {
    name: string;
    coordinates: [number, number];
    capacity: number;
    amenities: string[];
  };
  isActive: boolean;
  issuedAt: string;
  issuedBy: string; // e.g., 'J&K Disaster Management Authority / SMVDSB'
  emergencyHotline: string;

  // Cryptographic Security & Anti-Tampering Attributes
  signature?: string;
  signedByOfficerId?: string;
  signatureStatus?: 'verified' | 'unverified' | 'tampered';
  payloadHash?: string;
  issuedTimestamp?: number;
  securityClearance?: string;
}

export interface ControlRoomStats {
  totalMonitoredLocations: number;
  totalLiveVisitorsTracked: number;
  criticalZonesCount: number;
  activeHazardsCount: number;
  festivalSurgeModeActive: boolean;
  safeEvacuationHubsOnline: number;
  emergencyRespondersStandby: number;
}

interface CommandControlState {
  locations: LocationCrowdState[];
  activeAlerts: DisasterHazardAlert[];
  festivalSurgeActive: boolean;
  selectedFestival: string;
  activeEmergencyPopup: DisasterHazardAlert | null;
  dismissedAlertIds: string[];

  // Authenticated Special Commander Session
  commanderSession: DisasterCommanderProfile | null;

  // Actions
  authenticateCommander: (
    officerId: string,
    pin: string
  ) => { success: boolean; error?: string; remainingAttempts?: number; lockoutSeconds?: number };
  logoutCommander: () => void;
  signAndBroadcastAlert: (alertData: {
    title: string;
    incidentType: IncidentType;
    severity: AlertSeverity;
    locationName: string;
    coordinates: [number, number];
    affectedRadiusMeters: number;
    description: string;
    actionRequired: string;
    alternativeRouteName?: string;
    safeHoldingArea: {
      name: string;
      coordinates: [number, number];
      capacity: number;
      amenities: string[];
    };
    emergencyHotline?: string;
  }) => { success: boolean; alert?: DisasterHazardAlert; error?: string };
  injectTamperedAlertTest: (alertId: string) => void;
  triggerEmergencyModal: (alert: DisasterHazardAlert) => void;
  dismissEmergencyModal: () => void;
  dismissAlertBanner: (id: string) => void;
  toggleFestivalSurge: (active: boolean, festivalName?: string) => void;
  updateLocationCrowd: (locationId: string, currentCount: number) => void;
  simulateIncident: (type: IncidentType, locationId: string, severity?: AlertSeverity) => void;
  resolveIncident: (alertId: string) => void;
  getSafeSpotForLocation: (locationId: string) => LocationCrowdState['evacuationRoutes'][0] | null;
  getNearbyAlerts: (coords: [number, number], radiusKm?: number) => DisasterHazardAlert[];
  isRouteBlocked: (start: [number, number], end: [number, number]) => DisasterHazardAlert | null;
}

// Initial Monitored Locations with Live Geo-Fences, Capacities and Safe Evacuation Havens
export const INITIAL_MONITORED_LOCATIONS: LocationCrowdState[] = [
  {
    id: 'loc_vaishno_devi_bhawan',
    name: {
      en: 'Shri Mata Vaishno Devi Bhawan (Holy Cave)',
      hi: 'श्री माता वैष्णो देवी भवन (पवित्र गुफा)',
      doi: 'श्री माता वैष्णो देवी भवन',
    },
    category: 'temple',
    coordinates: [74.9525, 33.0308],
    currentCount: 38500,
    safeCapacity: 40000,
    maxSurgeCapacity: 50000,
    crowdLevel: 'high',
    festivalMode: true,
    festivalName: 'Navratri Maha Parv Surge Management',
    activeDispatches: 24,
    lastUpdated: 'Live Feed: 2 mins ago',
    entryGatesStatus: 'regulated',
    holdingAreaAvailable: true,
    evacuationRoutes: [
      {
        safeSpotName: 'Mano Kamna Bhawan Safe Hall & Helipad Terrace',
        safeSpotCoords: [74.955, 33.029],
        distanceMeters: 450,
        recommendedMode: 'walking',
        guidance: 'Take Gate 3 ramp towards Mano Kamna Bhawan. Emergency shelter, drinking water and medical outpost operational.',
      },
      {
        safeSpotName: 'Sanjichhat Emergency Medical Haven',
        safeSpotCoords: [74.961, 33.018],
        distanceMeters: 1800,
        recommendedMode: 'walking',
        guidance: 'Follow the Himkoti battery car track downwards. Flat gradient with continuous railing shelter.',
      },
    ],
  },
  {
    id: 'loc_ardhkuwari_temple',
    name: {
      en: 'Ardhkuwari Garbhjoon Corridor',
      hi: 'अर्धकुंवारी गर्भजून गलियारा',
      doi: 'अर्धकुंवारी मंदिर',
    },
    category: 'mountain_track',
    coordinates: [74.958, 33.008],
    currentCount: 16200,
    safeCapacity: 15000,
    maxSurgeCapacity: 20000,
    crowdLevel: 'critical',
    festivalMode: true,
    festivalName: 'Navratri Yatra Surge',
    activeDispatches: 18,
    lastUpdated: 'Live Feed: 1 min ago',
    entryGatesStatus: 'regulated',
    holdingAreaAvailable: true,
    evacuationRoutes: [
      {
        safeSpotName: 'Ardhkuwari Main Holding Plaza & Dispensary',
        safeSpotCoords: [74.959, 33.007],
        distanceMeters: 220,
        recommendedMode: 'walking',
        guidance: 'Move towards Western Shed Platform 4. Holding capacity 3,500 people with first aid attendants.',
      },
    ],
  },
  {
    id: 'loc_raghunath_temple',
    name: {
      en: 'Raghunath Temple & Heritage Bazaars',
      hi: 'रघुनाथ मंदिर एवं प्राचीन बाज़ार',
      doi: 'रघुनाथ मंदिर',
    },
    category: 'temple',
    coordinates: [74.868, 32.726],
    currentCount: 8400,
    safeCapacity: 12000,
    maxSurgeCapacity: 18000,
    crowdLevel: 'moderate',
    festivalMode: false,
    activeDispatches: 6,
    lastUpdated: 'Live Feed: 3 mins ago',
    entryGatesStatus: 'open',
    holdingAreaAvailable: true,
    evacuationRoutes: [
      {
        safeSpotName: 'Old City Parade Ground Open Safe Concourse',
        safeSpotCoords: [74.862, 32.731],
        distanceMeters: 750,
        recommendedMode: 'walking',
        guidance: 'Exit via Raghunath Bazaar North Gate. Wide open grounds free of falling hazards.',
      },
    ],
  },
  {
    id: 'loc_bahu_fort_bawe',
    name: {
      en: 'Bahu Fort & Bawe Wali Mata Shrine',
      hi: 'बाहू किला एवं बावे वाली माता मंदिर',
      doi: 'बाहू किला',
    },
    category: 'heritage',
    coordinates: [74.882, 32.728],
    currentCount: 9200,
    safeCapacity: 10000,
    maxSurgeCapacity: 15000,
    crowdLevel: 'moderate',
    festivalMode: false,
    activeDispatches: 8,
    lastUpdated: 'Live Feed: 4 mins ago',
    entryGatesStatus: 'open',
    holdingAreaAvailable: true,
    evacuationRoutes: [
      {
        safeSpotName: 'Bagh-e-Bahu Amphitheatre Grounds',
        safeSpotCoords: [74.885, 32.724],
        distanceMeters: 380,
        recommendedMode: 'walking',
        guidance: 'Follow tiered stone pathway to Bagh-e-Bahu terrace lawn. Spacious open greens.',
      },
    ],
  },
  {
    id: 'loc_jammu_tawi_station',
    name: {
      en: 'Jammu Tawi Railway Station Concourse (JAT)',
      hi: 'जम्मू तवी रेलवे स्टेशन मुख्य प्रांगण',
      doi: 'जम्मू तवी स्टेशन',
    },
    category: 'transit_hub',
    coordinates: [74.878, 32.706],
    currentCount: 14500,
    safeCapacity: 25000,
    maxSurgeCapacity: 35000,
    crowdLevel: 'normal',
    festivalMode: false,
    activeDispatches: 12,
    lastUpdated: 'Live Feed: 2 mins ago',
    entryGatesStatus: 'open',
    holdingAreaAvailable: true,
    evacuationRoutes: [
      {
        safeSpotName: 'Station Outer Parking & Yatri Niwas Open Hub',
        safeSpotCoords: [74.876, 32.708],
        distanceMeters: 200,
        recommendedMode: 'walking',
        guidance: 'Exit via Platform 1 main foyer towards prepaid taxi terminal open bay.',
      },
    ],
  },
  {
    id: 'loc_himkoti_track',
    name: {
      en: 'Himkoti High-Altitude Mountain Track',
      hi: 'हिमकोटी पर्वत मार्ग (बैटरी कार ट्रैक)',
      doi: 'हिमकोटी मार्ग',
    },
    category: 'mountain_track',
    coordinates: [74.966, 33.024],
    currentCount: 7100,
    safeCapacity: 8000,
    maxSurgeCapacity: 12000,
    crowdLevel: 'moderate',
    festivalMode: true,
    festivalName: 'Navratri Safe Corridor',
    activeDispatches: 14,
    lastUpdated: 'Live Feed: 1 min ago',
    entryGatesStatus: 'open',
    holdingAreaAvailable: true,
    evacuationRoutes: [
      {
        safeSpotName: 'Himkoti Central Shelter Shed & Viewpoint Post',
        safeSpotCoords: [74.965, 33.023],
        distanceMeters: 150,
        recommendedMode: 'walking',
        guidance: 'Reinforced rockfall netting canopy shelter with wireless satellite SOS terminal.',
      },
    ],
  },
];

// Pre-calculated Cryptographic Signatures for Initial Live Hazard Alerts
const alert1Timestamp = 1761105000000;
const alert1SigningPayload: AlertSigningPayload = {
  title: 'EMERGENCY: Active Landslide & Shooting Stones at NH-44 Nashri-Chanderkote',
  incidentType: 'landslide',
  severity: 'critical',
  locationName: 'NH-44 Mountain Highway (Nashri - Ramban Sector)',
  coordinates: [75.242, 33.155],
  actionRequired: 'HALT TRAVEL IMMEDIATELY. Do not approach Nashri tunnel approach. Divert vehicles to designated safe holding concourses at Udhampur Yatri Niwas or Chanderkote Shelter.',
  safeHoldingAreaName: 'Udhampur Highway Civic Yatri Niwas Complex',
  timestamp: alert1Timestamp,
};
const alert1Sig = signAlertPayload(alert1SigningPayload, OFFICIAL_DISASTER_COMMANDER.officerId);

const alert2Timestamp = 1761111300000;
const alert2SigningPayload: AlertSigningPayload = {
  title: 'CROWD SURGE ADVISORY: Ardhkuwari Corridor Exceeding Safe Density',
  incidentType: 'overcrowding',
  severity: 'warning',
  locationName: 'Ardhkuwari Junction & Garbhjoon Queue Area',
  coordinates: [74.958, 33.008],
  actionRequired: 'Yatris requested to rest at Adhkuwari Main Holding Sheds. Entry through Sector 2 gated at 30-minute regulated intervals. Direct onward yatra via Alternate Tarakote Track.',
  safeHoldingAreaName: 'Adhkuwari Shed Sector 4 Open Amphitheatre',
  timestamp: alert2Timestamp,
};
const alert2Sig = signAlertPayload(alert2SigningPayload, OFFICIAL_DISASTER_COMMANDER.officerId);

// Initial Real-Time Hazard Alerts (including active mountain landslide & road blocks)
export const INITIAL_HAZARD_ALERTS: DisasterHazardAlert[] = [
  {
    id: 'alert_landslide_nh44',
    title: 'EMERGENCY: Active Landslide & Shooting Stones at NH-44 Nashri-Chanderkote',
    incidentType: 'landslide',
    severity: 'critical',
    locationName: 'NH-44 Mountain Highway (Nashri - Ramban Sector)',
    coordinates: [75.242, 33.155],
    affectedRadiusMeters: 4500,
    description: 'Fresh debris slide and continuous shooting stones reported near Nashri-Peera corridor after overnight rainfall. Road traffic blocked in both directions by Traffic Police.',
    actionRequired: 'HALT TRAVEL IMMEDIATELY. Do not approach Nashri tunnel approach. Divert vehicles to designated safe holding concourses at Udhampur Yatri Niwas or Chanderkote Shelter.',
    alternativeRouteName: 'Mughal Road / Reasi-Pouni-Sunderbani Axis (Light Vehicles Only)',
    safeHoldingArea: {
      name: 'Udhampur Highway Civic Yatri Niwas Complex',
      coordinates: [75.132, 32.925],
      capacity: 4500,
      amenities: ['Free Community Langar', 'Rest Rooms', 'Medical Outpost', 'Heavy Vehicle Parking', 'BSNL Satellite Phone'],
    },
    isActive: true,
    issuedAt: '21 Oct 2026, 09:30 AM',
    issuedBy: 'J&K Disaster Management Authority (JKDMA) & Traffic Police HQ',
    emergencyHotline: '01992-272728 / 112',
    signature: alert1Sig.signature,
    signedByOfficerId: OFFICIAL_DISASTER_COMMANDER.officerId,
    signatureStatus: 'verified',
    payloadHash: alert1Sig.payloadHash,
    issuedTimestamp: alert1Timestamp,
    securityClearance: OFFICIAL_DISASTER_COMMANDER.clearanceLevel,
  },
  {
    id: 'alert_surge_ardhkuwari',
    title: 'CROWD SURGE ADVISORY: Ardhkuwari Corridor Exceeding Safe Density',
    incidentType: 'overcrowding',
    severity: 'warning',
    locationName: 'Ardhkuwari Junction & Garbhjoon Queue Area',
    coordinates: [74.958, 33.008],
    affectedRadiusMeters: 800,
    description: 'Yatra queue time exceeds 6 hours at Garbhjoon. Pilgrim density reached 108% of rated corridor safety. Stampede prevention protocols activated.',
    actionRequired: 'Yatris requested to rest at Adhkuwari Main Holding Sheds. Entry through Sector 2 gated at 30-minute regulated intervals. Direct onward yatra via Alternate Tarakote Track.',
    alternativeRouteName: 'Tarakote Marg Track (Step-Free Gentle Slope)',
    safeHoldingArea: {
      name: 'Adhkuwari Shed Sector 4 Open Amphitheatre',
      coordinates: [74.959, 33.007],
      capacity: 3500,
      amenities: ['Continuous Drinking Water', 'Free Tea & Biscuits', 'First Aid Center', 'Charging Stations'],
    },
    isActive: true,
    issuedAt: '21 Oct 2026, 11:15 AM',
    issuedBy: 'SMVDSB Central Control Room, Katra',
    emergencyHotline: '01991-232075',
    signature: alert2Sig.signature,
    signedByOfficerId: OFFICIAL_DISASTER_COMMANDER.officerId,
    signatureStatus: 'verified',
    payloadHash: alert2Sig.payloadHash,
    issuedTimestamp: alert2Timestamp,
    securityClearance: OFFICIAL_DISASTER_COMMANDER.clearanceLevel,
  },
];

export const useCommandControlStore = create<CommandControlState>()(
  persist(
    (set, get) => ({
      locations: INITIAL_MONITORED_LOCATIONS,
      activeAlerts: INITIAL_HAZARD_ALERTS,
      festivalSurgeActive: true,
      selectedFestival: 'Navratri Maha Parv / Annual Vaishno Devi Pilgrimage Surge',
      activeEmergencyPopup: INITIAL_HAZARD_ALERTS[0], // Active on boot to guarantee emergency awareness
      dismissedAlertIds: [],
      commanderSession: null,

      authenticateCommander: (officerId, pin) => {
        if (securityLimiter.isLocked()) {
          const lockoutSeconds = securityLimiter.getLockoutSeconds();
          return {
            success: false,
            error: `Commander account temporarily locked out for security. Try again in ${lockoutSeconds}s.`,
            lockoutSeconds,
          };
        }

        const cleanOfficerId = sanitizeText(officerId).toUpperCase();
        const cleanPin = pin.trim();

        if (
          cleanOfficerId === OFFICIAL_DISASTER_COMMANDER.officerId &&
          cleanPin === COMMANDER_ACCESS_PIN
        ) {
          securityLimiter.reset();
          set({ commanderSession: OFFICIAL_DISASTER_COMMANDER });
          securityAudit.log(
            'AUTH_LOGIN',
            cleanOfficerId,
            `DSP Rajeshwar Singh authenticated with Level-4 Disaster Command Clearance.`,
            'SUCCESS'
          );
          return { success: true };
        }

        const failure = securityLimiter.recordFailure();
        securityAudit.log(
          'AUTH_FAILED',
          cleanOfficerId || 'ANONYMOUS',
          `Unauthorized authentication attempt with invalid PIN. Failure count: ${5 - failure.remainingAttempts}`,
          failure.locked ? 'BLOCKED' : 'FAILED'
        );

        return {
          success: false,
          error: failure.locked
            ? 'Access locked! 5 consecutive failed authorization attempts detected. Locked for 15 minutes.'
            : `Invalid Officer Badge ID or Security PIN. ${failure.remainingAttempts} attempts remaining.`,
          remainingAttempts: failure.remainingAttempts,
          lockoutSeconds: failure.lockoutSeconds,
        };
      },

      logoutCommander: () => {
        const session = get().commanderSession;
        if (session) {
          securityAudit.log(
            'AUTH_LOGOUT',
            session.officerId,
            `Commander session terminated normally by user.`,
            'SUCCESS'
          );
        }
        set({ commanderSession: null });
      },

      signAndBroadcastAlert: (alertData) => {
        const session = get().commanderSession;
        if (!session) {
          securityAudit.log(
            'UNAUTHORIZED_DISPATCH_ATTEMPT',
            'ANONYMOUS',
            `Blocked attempt to dispatch emergency alert without active Disaster Commander credentials.`,
            'BLOCKED'
          );
          return {
            success: false,
            error: 'Authorization Required: Only authenticated Disaster Commanders can broadcast civic emergency alerts.',
          };
        }

        const safeTitle = sanitizeText(alertData.title);
        const safeLocation = sanitizeText(alertData.locationName);
        const safeDesc = sanitizeText(alertData.description);
        const safeAction = sanitizeText(alertData.actionRequired);
        const safeHoldingName = sanitizeText(alertData.safeHoldingArea.name);
        const timestamp = Date.now();

        const signingPayload: AlertSigningPayload = {
          title: safeTitle,
          incidentType: alertData.incidentType,
          severity: alertData.severity,
          locationName: safeLocation,
          coordinates: alertData.coordinates,
          actionRequired: safeAction,
          safeHoldingAreaName: safeHoldingName,
          timestamp,
        };

        const { signature, payloadHash } = signAlertPayload(signingPayload, session.officerId);

        const newAlert: DisasterHazardAlert = {
          id: `alert_cmd_${timestamp}`,
          title: safeTitle,
          incidentType: alertData.incidentType,
          severity: alertData.severity,
          locationName: safeLocation,
          coordinates: alertData.coordinates,
          affectedRadiusMeters: alertData.affectedRadiusMeters,
          description: safeDesc,
          actionRequired: safeAction,
          alternativeRouteName: alertData.alternativeRouteName ? sanitizeText(alertData.alternativeRouteName) : undefined,
          safeHoldingArea: {
            ...alertData.safeHoldingArea,
            name: safeHoldingName,
          },
          isActive: true,
          issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          issuedBy: `${session.department} • Ref: ${session.officerId}`,
          emergencyHotline: alertData.emergencyHotline ? sanitizeText(alertData.emergencyHotline) : '112 / 0191-2544570',
          signature,
          signedByOfficerId: session.officerId,
          signatureStatus: 'verified',
          payloadHash,
          issuedTimestamp: timestamp,
          securityClearance: session.clearanceLevel,
        };

        set((state) => ({
          activeAlerts: [newAlert, ...state.activeAlerts],
          activeEmergencyPopup: newAlert,
        }));

        // Trigger native device notification (lock-screen siren)
        notificationService.sendEmergencyAlert(
          newAlert.title,
          newAlert.actionRequired,
          newAlert.safeHoldingArea.name
        ).catch(() => {});

        securityAudit.log(
          'BROADCAST_EMERGENCY_ALERT',
          session.officerId,
          `Cryptographically signed emergency alert "${safeTitle}" broadcasted across Jammu Division. HMAC signature: ${signature.slice(0, 16)}...`,
          'SUCCESS'
        );

        return { success: true, alert: newAlert };
      },

      injectTamperedAlertTest: (alertId) => {
        const target = get().activeAlerts.find((a) => a.id === alertId) || get().activeAlerts[0];
        if (!target) return;

        // Create a tampered copy with corrupted coordinates / forged instructions
        const tamperedAlert: DisasterHazardAlert = {
          ...target,
          id: `tampered_${Date.now()}`,
          title: `[FORGED / TAMPERED] ${target.title}`,
          locationName: 'FORGED EVACUATION ZONE - ATTACK SIMULATION',
          coordinates: [75.999, 33.999], // Diverted coordinates
          actionRequired: 'DANGER: Tampered payload injected by adversary simulating spoofing attack.',
          // Keep old signature so HMAC digest check will fail!
          signature: target.signature || 'invalid_fake_signature_aabbccddeeff00112233',
          signatureStatus: 'tampered',
        };

        securityAudit.log(
          'CYBER_INTRUSION_DETECTED',
          target.signedByOfficerId || 'SPOOFED_ATTACKER',
          `Tampered alert payload detected! Cryptographic digest verification failed. Alert marked as tampered.`,
          'TAMPER_DETECTED'
        );

        set({ activeEmergencyPopup: tamperedAlert });
      },

      triggerEmergencyModal: (alert) => {
        const integrity = verifyAlertIntegrity(alert);
        if (!integrity.isValid) {
          const status = integrity.status;
          securityAudit.log(
            'ALERT_VERIFICATION_CHECK',
            alert.signedByOfficerId || 'UNVERIFIED',
            `Emergency modal inspection: Alert flagged as ${status.toUpperCase()}. Reason: ${integrity.reason}`,
            status === 'tampered' ? 'TAMPER_DETECTED' : 'BLOCKED'
          );

          set({
            activeEmergencyPopup: {
              ...alert,
              signatureStatus: status,
            },
          });
          return;
        }

        set({
          activeEmergencyPopup: {
            ...alert,
            signatureStatus: 'verified',
          },
        });

        // Trigger native device notification (lock-screen siren)
        notificationService.sendEmergencyAlert(
          alert.title,
          alert.actionRequired,
          alert.safeHoldingArea?.name
        ).catch(() => {});
      },

      dismissEmergencyModal: () => {
        set({ activeEmergencyPopup: null });
      },

      dismissAlertBanner: (id) => {
        set((state) => ({
          dismissedAlertIds: [...state.dismissedAlertIds, id],
        }));
      },

      toggleFestivalSurge: (active, festivalName) => {
        set((state) => {
          const updatedLocations: LocationCrowdState[] = state.locations.map((loc) => {
            if (loc.category === 'temple' || loc.category === 'mountain_track') {
              const newCount = active ? Math.min(loc.maxSurgeCapacity, Math.round(loc.currentCount * 1.35)) : loc.safeCapacity;
              const level: CrowdLevel = active ? (newCount > loc.safeCapacity ? 'high' : 'moderate') : 'normal';
              const gates: 'open' | 'regulated' | 'closed' = active ? (level === 'high' ? 'regulated' : 'open') : 'open';

              return {
                ...loc,
                festivalMode: active,
                festivalName: active ? festivalName || 'Festival Surge Protocol' : undefined,
                currentCount: newCount,
                crowdLevel: level,
                entryGatesStatus: gates,
                activeDispatches: active ? loc.activeDispatches + 10 : Math.max(4, loc.activeDispatches - 10),
              };
            }
            return loc;
          });

          return {
            festivalSurgeActive: active,
            selectedFestival: festivalName || state.selectedFestival,
            locations: updatedLocations,
          };
        });
      },

      updateLocationCrowd: (locationId, newCount) => {
        set((state) => ({
          locations: state.locations.map((loc) => {
            if (loc.id === locationId) {
              const safeCount = Math.max(0, newCount);
              const ratio = safeCount / loc.safeCapacity;
              let level: CrowdLevel = 'normal';
              let gates: 'open' | 'regulated' | 'closed' = 'open';

              if (ratio >= 1.05) {
                level = 'critical';
                gates = 'closed';
              } else if (ratio >= 0.85) {
                level = 'high';
                gates = 'regulated';
              } else if (ratio >= 0.55) {
                level = 'moderate';
                gates = 'open';
              }

              return {
                ...loc,
                currentCount: safeCount,
                crowdLevel: level,
                entryGatesStatus: gates,
                lastUpdated: 'Live Feed: Just now',
              };
            }
            return loc;
          }),
        }));
      },

      simulateIncident: (type, locationId, severity = 'critical') => {
        const loc = get().locations.find((l) => l.id === locationId);
        if (!loc) return;

        const session = get().commanderSession || OFFICIAL_DISASTER_COMMANDER;
        const timestamp = Date.now();
        const title = `CRITICAL HAZARD: Active ${type.toUpperCase().replace('_', ' ')} Alert at ${loc.name.en}`;
        const actionRequired = `EVACUATE AREA IMMEDIATELY. Do not proceed toward ${loc.name.en}. Report to designated safe haven: ${loc.evacuationRoutes[0]?.safeSpotName || 'Nearby Police Post'}.`;
        const safeHoldingAreaName = loc.evacuationRoutes[0]?.safeSpotName || 'District Civic Relief Centre';

        const { signature, payloadHash } = signAlertPayload(
          {
            title,
            incidentType: type,
            severity,
            locationName: loc.name.en,
            coordinates: loc.coordinates,
            actionRequired,
            safeHoldingAreaName,
            timestamp,
          },
          session.officerId
        );

        const newAlert: DisasterHazardAlert = {
          id: `sim_alert_${timestamp}`,
          title,
          incidentType: type,
          severity,
          locationName: loc.name.en,
          coordinates: loc.coordinates,
          affectedRadiusMeters: type === 'landslide' ? 3000 : 800,
          description: `Disaster management automated sensors detected ${type.replace('_', ' ')} incident near ${loc.name.en}. Immediate cordon established. Follow evacuation vectors.`,
          actionRequired,
          alternativeRouteName: 'Designated Safe Haven Corridor #1',
          safeHoldingArea: {
            name: safeHoldingAreaName,
            coordinates: loc.evacuationRoutes[0]?.safeSpotCoords || [74.868, 32.726],
            capacity: 2500,
            amenities: ['First Aid Team', 'Satellite SOS', 'Emergency Water', 'Evacuation Shuttles'],
          },
          isActive: true,
          issuedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          issuedBy: `${session.department} • Ref: ${session.officerId}`,
          emergencyHotline: '112 / 0191-2544570',
          signature,
          signedByOfficerId: session.officerId,
          signatureStatus: 'verified',
          payloadHash,
          issuedTimestamp: timestamp,
          securityClearance: session.clearanceLevel,
        };

        set((state) => ({
          activeAlerts: [newAlert, ...state.activeAlerts],
          activeEmergencyPopup: newAlert,
        }));
      },

      resolveIncident: (alertId) => {
        set((state) => ({
          activeAlerts: state.activeAlerts.filter((a) => a.id !== alertId),
          activeEmergencyPopup: state.activeEmergencyPopup?.id === alertId ? null : state.activeEmergencyPopup,
        }));
      },

      getSafeSpotForLocation: (locationId) => {
        const loc = get().locations.find((l) => l.id === locationId);
        return loc?.evacuationRoutes[0] || null;
      },

      getNearbyAlerts: (coords, radiusKm = 10) => {
        const [lng, lat] = coords;
        return get().activeAlerts.filter((alert) => {
          if (!alert.isActive) return false;
          const [aLng, aLat] = alert.coordinates;
          // Approximate Haversine distance
          const dLat = (aLat - lat) * 111;
          const dLng = (aLng - lng) * 111 * Math.cos((lat * Math.PI) / 180);
          const distKm = Math.sqrt(dLat * dLat + dLng * dLng);
          return distKm <= radiusKm;
        });
      },

      isRouteBlocked: (start, end) => {
        // Checks if any active landslide / roadblock falls between start & end coordinates
        const activeBlocks = get().activeAlerts.filter(
          (a) => a.isActive && (a.incidentType === 'landslide' || a.incidentType === 'road_block')
        );

        if (activeBlocks.length === 0) return null;

        const minLng = Math.min(start[0], end[0]) - 0.05;
        const maxLng = Math.max(start[0], end[0]) + 0.05;
        const minLat = Math.min(start[1], end[1]) - 0.05;
        const maxLat = Math.max(start[1], end[1]) + 0.05;

        for (const block of activeBlocks) {
          const [bLng, bLat] = block.coordinates;
          if (bLng >= minLng && bLng <= maxLng && bLat >= minLat && bLat <= maxLat) {
            return block;
          }
        }
        return null;
      },
    }),
    {
      name: 'jammukhoj-command-control-v1',
    }
  )
);
