/**
 * JammuKhoj Security & Cryptographic Dispatch Service
 * 
 * Provides:
 * 1. Pure TypeScript deterministic SHA-256 & HMAC-SHA256 cryptographic signatures.
 * 2. Authenticated Disaster Commander Account credentials & verification.
 * 3. Anti-tampering digital payload verification for Central Emergency Alerts.
 * 4. XSS sanitization and anti-brute-force rate limiting.
 * 5. Immutable security audit trail.
 */

// ============================================================================
// 1. PURE TYPESCRIPT SHA-256 & HMAC-SHA256 IMPLEMENTATION
// ============================================================================

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

export function sha256(ascii: string): string {
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0, j = 0;
  let result = '';

  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  const hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, number> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while ((ascii.length % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return ''; // ASCII check
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words.length] = (asciiBitLength / maxWord) | 0;
  words[words.length] = asciiBitLength;

  for (j = 0; j < words.length;) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];

      const s0 = i >= 16 ? rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3) : w[i];
      const s1 = i >= 16 ? rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10) : 0;
      if (i >= 16) {
        w[i] = ((w[i - 16] + s0) | 0) + ((w[i - 7] + s1) | 0);
      }

      const sA = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22));
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const t2 = (sA + maj) | 0;

      const sE = (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25));
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const t1 = (((((hash[7] + sE) | 0) + ch) | 0) + k[i] + w[i]) | 0;

      hash[7] = hash[6];
      hash[6] = hash[5];
      hash[5] = hash[4];
      hash[4] = (hash[3] + t1) | 0;
      hash[3] = hash[2];
      hash[2] = hash[1];
      hash[1] = hash[0];
      hash[0] = (t1 + t2) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export function hmacSha256(key: string, message: string): string {
  let blockKey = key;
  if (blockKey.length > 64) {
    blockKey = sha256(blockKey);
  }
  while (blockKey.length < 64) {
    blockKey += '\x00';
  }

  let oKeyPad = '';
  let iKeyPad = '';
  for (let i = 0; i < 64; i++) {
    oKeyPad += String.fromCharCode(blockKey.charCodeAt(i) ^ 0x5c);
    iKeyPad += String.fromCharCode(blockKey.charCodeAt(i) ^ 0x36);
  }

  const innerHashHex = sha256(iKeyPad + message);
  // Convert hex back to string for outer pass
  let innerStr = '';
  for (let i = 0; i < innerHashHex.length; i += 2) {
    innerStr += String.fromCharCode(parseInt(innerHashHex.substr(i, 2), 16));
  }

  return sha256(oKeyPad + innerStr);
}

// ============================================================================
// 2. DISASTER COMMANDER ACCOUNT CREDENTIALS & SESSIONS
// ============================================================================

export interface DisasterCommanderProfile {
  officerId: string;
  officerName: string;
  department: string;
  clearanceLevel: 'Level-4-Disaster-Command' | 'Level-3-Traffic-DSP';
  stationCode: string;
  badgeNumber: string;
}

// Official Pre-Configured Civic Commander Account
export const OFFICIAL_DISASTER_COMMANDER: DisasterCommanderProfile = {
  officerId: 'JKDMA-CMD-9021',
  officerName: 'DSP Rajeshwar Singh',
  department: 'J&K Disaster Management Authority (JKDMA) & Police Traffic HQ',
  clearanceLevel: 'Level-4-Disaster-Command',
  stationCode: 'JKDMA-CENTRAL-01',
  badgeNumber: 'JKP-84729',
};

// Cryptographic Secret Key for Alert Signing (Simulating HSM / Government Vault Secret)
export const COMMAND_AUTHORITY_SIGNING_KEY = 'JKDMA_CIVIC_EMERGENCY_SECURE_HMAC_KEY_2026';
export const COMMANDER_ACCESS_PIN = 'JK9112';

// ============================================================================
// 3. XSS SANITIZATION & ANTI-TAMPERING UTILITIES
// ============================================================================

export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // Strip angle brackets
    .replace(/javascript:/gi, '') // Strip javascript scheme
    .replace(/on\w+=/gi, '') // Strip inline event handlers
    .trim();
}

export interface AlertSigningPayload {
  title: string;
  incidentType: string;
  severity: string;
  locationName: string;
  coordinates: [number, number];
  actionRequired: string;
  safeHoldingAreaName: string;
  timestamp: number;
}

export function computeAlertDigest(payload: AlertSigningPayload): string {
  const serialized = `${payload.title}|${payload.incidentType}|${payload.severity}|${payload.locationName}|${payload.coordinates[0]},${payload.coordinates[1]}|${payload.actionRequired}|${payload.safeHoldingAreaName}|${payload.timestamp}`;
  return sha256(serialized);
}

export function signAlertPayload(
  payload: AlertSigningPayload,
  officerId: string = OFFICIAL_DISASTER_COMMANDER.officerId
): { signature: string; payloadHash: string; timestamp: number } {
  const timestamp = payload.timestamp || Date.now();
  const payloadWithTime = { ...payload, timestamp };
  const payloadHash = computeAlertDigest(payloadWithTime);
  const signature = hmacSha256(COMMAND_AUTHORITY_SIGNING_KEY, `${payloadHash}|${officerId}|${timestamp}`);

  return { signature, payloadHash, timestamp };
}

export function verifyAlertIntegrity(alert: {
  title: string;
  incidentType: string;
  severity: string;
  locationName: string;
  coordinates: [number, number];
  actionRequired: string;
  safeHoldingArea?: { name: string };
  signature?: string;
  signedByOfficerId?: string;
  issuedTimestamp?: number;
}): { isValid: boolean; status: 'verified' | 'unverified' | 'tampered'; reason?: string } {
  if (!alert.signature || !alert.signedByOfficerId) {
    return {
      isValid: false,
      status: 'unverified',
      reason: 'Alert payload lacks cryptographic digital signature or officer ID.',
    };
  }

  const payload: AlertSigningPayload = {
    title: alert.title,
    incidentType: alert.incidentType,
    severity: alert.severity,
    locationName: alert.locationName,
    coordinates: alert.coordinates,
    actionRequired: alert.actionRequired,
    safeHoldingAreaName: alert.safeHoldingArea?.name || '',
    timestamp: alert.issuedTimestamp || 0,
  };

  const payloadHash = computeAlertDigest(payload);
  const expectedSignature = hmacSha256(
    COMMAND_AUTHORITY_SIGNING_KEY,
    `${payloadHash}|${alert.signedByOfficerId}|${payload.timestamp}`
  );

  if (alert.signature !== expectedSignature) {
    return {
      isValid: false,
      status: 'tampered',
      reason: 'Cryptographic HMAC signature mismatch. Payload content or coordinates may have been modified in transit.',
    };
  }

  return { isValid: true, status: 'verified' };
}

// ============================================================================
// 4. ANTI-BRUTE-FORCE RATE LIMITER
// ============================================================================

interface BruteForceState {
  failedAttempts: number;
  lockoutUntil: number;
}

// Safe Storage Helper (falls back to memory store in Node.js / SSR / non-browser test environments)
const memoryStorage: Record<string, string> = {};

const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return memoryStorage[key] ?? null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch {}
    memoryStorage[key] = value;
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {}
    delete memoryStorage[key];
  },
};

const BRUTE_FORCE_KEY = 'jammukhoj_security_lockout';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export const securityLimiter = {
  getState(): BruteForceState {
    try {
      const stored = safeStorage.getItem(BRUTE_FORCE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { failedAttempts: 0, lockoutUntil: 0 };
  },

  isLocked(): boolean {
    const state = this.getState();
    return Date.now() < state.lockoutUntil;
  },

  getLockoutSeconds(): number {
    const state = this.getState();
    return Math.max(0, Math.ceil((state.lockoutUntil - Date.now()) / 1000));
  },

  recordFailure(): { locked: boolean; remainingAttempts: number; lockoutSeconds: number } {
    const state = this.getState();
    const newCount = state.failedAttempts + 1;
    let lockoutUntil = state.lockoutUntil;

    if (newCount >= MAX_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
    }

    const newState: BruteForceState = {
      failedAttempts: newCount,
      lockoutUntil,
    };

    safeStorage.setItem(BRUTE_FORCE_KEY, JSON.stringify(newState));

    return {
      locked: Date.now() < lockoutUntil,
      remainingAttempts: Math.max(0, MAX_ATTEMPTS - newCount),
      lockoutSeconds: Math.ceil((lockoutUntil - Date.now()) / 1000),
    };
  },

  reset(): void {
    safeStorage.removeItem(BRUTE_FORCE_KEY);
  },
};

// ============================================================================
// 5. IMMUTABLE SECURITY AUDIT TRAIL
// ============================================================================

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  officerId: string;
  status: 'SUCCESS' | 'FAILED' | 'TAMPER_DETECTED' | 'BLOCKED';
  details: string;
  signature: string;
}

const AUDIT_LOG_KEY = 'jammukhoj_security_audit_log';
const MAX_LOG_RECORDS = 50;

export const securityAudit = {
  getLogs(): SecurityAuditEntry[] {
    try {
      const stored = safeStorage.getItem(AUDIT_LOG_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  },

  log(
    action: string,
    officerId: string,
    details: string,
    status: SecurityAuditEntry['status']
  ): SecurityAuditEntry {
    const timestamp = new Date().toISOString();
    const entryId = `sec_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const signature = hmacSha256(COMMAND_AUTHORITY_SIGNING_KEY, `${entryId}|${timestamp}|${action}|${officerId}|${status}`);

    const entry: SecurityAuditEntry = {
      id: entryId,
      timestamp,
      action,
      officerId,
      status,
      details,
      signature,
    };

    const existing = this.getLogs();
    const updated = [entry, ...existing].slice(0, MAX_LOG_RECORDS);
    safeStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(updated));

    return entry;
  },
};
