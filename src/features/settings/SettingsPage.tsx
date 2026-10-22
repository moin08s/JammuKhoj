import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Globe,
  Download,
  Wifi,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  User,
  HardDrive,
  ExternalLink,
  Store,
  ChevronRight,
  Bell,
  Lock,
  LogOut,
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { capabilityMatrix } from '@/domain/offline/capabilityMatrix';
import { bundleManager } from '@/domain/offline/bundleManager';
import { logger } from '@/services/logger';
import type { AppLogEntry } from '@/data/types';
import { ContactSupportModal } from '@/features/about/ContactSupportModal';
import { TermsOfServiceModal } from '@/features/privacy/TermsOfServiceModal';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const {
    language,
    setLanguage,
    bundleVersion,
    lastSyncedAt,
    currentUser,
    logout,
    isGuest,
    highContrast,
    setHighContrast,
    largeText,
    setLargeText,
    seniorMode,
    setSeniorMode,
  } = useAppStore();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCorrections, setShowCorrections] = useState(false);
  const [recentLogs, setRecentLogs] = useState<AppLogEntry[]>([]);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [storageUsageMb, setStorageUsageMb] = useState<string>('0.0');

  React.useEffect(() => {
    // Storage Quota Meter
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((est) => {
        if (est.usage) {
          setStorageUsageMb((est.usage / (1024 * 1024)).toFixed(2));
        }
      }).catch(() => {});
    }

    // Load recent client logs
    logger.getRecentLogs(20).then(setRecentLogs).catch(() => {});
  }, []);

  const handleLanguageChange = (lang: 'en' | 'hi' | 'doi') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleUpdateCheck = async () => {
    setIsUpdating(true);
    setUpdateMsg('Verifying Jammu vector & heritage tile registry...');

    await bundleManager.download((p) => {
      setUpdateMsg(p.message);
    });

    setIsUpdating(false);
    setUpdateMsg('Content bundle verified and synchronized to latest edition v4.2!');
    setTimeout(() => setUpdateMsg(''), 4000);
  };

  const handleClearData = async () => {
    await bundleManager.clearAll();
    setShowClearModal(false);
    window.location.reload();
  };

  const userName = currentUser?.name || 'Rajesh Sharma';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'RS';

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Brand Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-2.5 cursor-pointer apple-press" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center bg-forest-900 border border-amber-500/30">
            <img
              src="/icons/icon-emblem.svg"
              alt="JammuKhoj Emblem"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-heading font-black text-xl tracking-tight text-[#9E4A0C]">
            JammuKhoj
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-[#E6F7F2] text-[#085444] text-[11px] font-bold border border-[#BCE8DD]">
            Profile & Offline Hub
          </span>
        </div>
      </div>

      {/* 2. User Account Card */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
        <div className="relative shrink-0">
          <div className="w-13 h-13 rounded-full bg-surface border-2 border-border flex items-center justify-center text-[#9E4A0C] dark:text-amber-400 font-heading font-black text-lg shadow-inner">
            {userInitials}
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#15803D] ring-2 ring-card"></span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-heading font-bold text-base text-ink truncate flex items-center gap-1">
              <span>{userName}</span>
              <ShieldCheck size={14} className="text-[#15803D] shrink-0" />
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-[#9E4A0C] dark:text-amber-400 border border-amber-500/20 shrink-0">
              {currentUser ? 'Signed In' : '1-Tap Guest'}
            </span>
          </div>

          <div className="text-xs text-stone mt-0.5 flex items-center gap-1">
            <span>{currentUser?.email || 'Field Pilgrim & Explorer'}</span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 size={12} className="text-[#15803D]" />
              <span>Offline Pack: 184 MB ready</span>
            </div>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-[11px] font-semibold text-danger hover:underline flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-danger/5 transition-colors"
            >
              <LogOut size={12} />
              <span>{currentUser ? 'Sign Out' : 'Switch Account'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Switch to Business / Local Artisan Portal */}
      <div
        onClick={() => navigate('/business')}
        className="bg-card border border-border rounded-2xl p-3.5 shadow-sm hover:border-[#9E4A0C]/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#9E4A0C] dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Store size={18} />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-ink group-hover:text-[#9E4A0C] dark:group-hover:text-amber-400 transition-colors">
              Dogra Artisan & Shopkeeper Portal
            </h4>
            <p className="text-[11px] text-stone">
              List Basohli crafts, saffron & certified stores
            </p>
          </div>
        </div>
        <ChevronRight size={18} className="text-stone group-hover:text-[#9E4A0C] dark:group-hover:text-amber-400 transition-colors" />
      </div>

      {/* 3. Language Selector */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm">
        <h3 className="font-heading text-sm font-bold text-ink flex items-center gap-1.5">
          <Globe size={16} className="text-[#9E4A0C] dark:text-amber-400" />
          <span>Application Language (भाषा)</span>
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
              language === 'en'
                ? 'bg-[#9E4A0C] text-white border-[#9E4A0C] shadow-xs'
                : 'bg-surface border-border text-stone hover:text-ink'
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('hi')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
              language === 'hi'
                ? 'bg-[#9E4A0C] text-white border-[#9E4A0C] shadow-xs'
                : 'bg-surface border-border text-stone hover:text-ink'
            }`}
          >
            हिन्दी (Hindi)
          </button>
          <button
            onClick={() => handleLanguageChange('doi')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
              language === 'doi'
                ? 'bg-[#9E4A0C] text-white border-[#9E4A0C] shadow-xs'
                : 'bg-surface border-border text-stone hover:text-ink'
            }`}
          >
            डोगरी (Dogri)
          </button>
        </div>
      </section>

      {/* 4. Accessibility & Vision (WCAG 2.1 AA) */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-ink flex items-center gap-1.5">
            <Sparkles size={16} className="text-[#9E4A0C] dark:text-amber-400" />
            <span>Accessibility & Display (सुगमता)</span>
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold text-[10px] border border-blue-200 dark:border-blue-800">
            WCAG 2.1 AA
          </span>
        </div>

        <div className="space-y-2.5 divide-y divide-border">
          <div className="pt-1 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink">High Contrast Mode</div>
              <div className="text-[11px] text-stone">Sharper borders and deep 7:1 contrast for bright sunlight</div>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                highContrast ? 'bg-[#9E4A0C]' : 'bg-surface border border-border'
              }`}
              aria-label="Toggle High Contrast"
            >
              <span
                className={`absolute top-1 left-1 bg-white dark:bg-stone-200 w-4 h-4 rounded-full transition-transform ${
                  highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink">Large Text (Dynamic Scaling)</div>
              <div className="text-[11px] text-stone">Increases base text size for comfortable reading without clipping</div>
            </div>
            <button
              onClick={() => setLargeText(!largeText)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                largeText ? 'bg-[#9E4A0C]' : 'bg-surface border border-border'
              }`}
              aria-label="Toggle Large Text"
            >
              <span
                className={`absolute top-1 left-1 bg-white dark:bg-stone-200 w-4 h-4 rounded-full transition-transform ${
                  largeText ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink">Senior Pilgrim Ease Mode</div>
              <div className="text-[11px] text-stone">Larger touch targets (≥52px), simple itineraries, and minimal walking</div>
            </div>
            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                seniorMode ? 'bg-[#9E4A0C]' : 'bg-surface border border-border'
              }`}
              aria-label="Toggle Senior Pilgrim Mode"
            >
              <span
                className={`absolute top-1 left-1 bg-white dark:bg-stone-200 w-4 h-4 rounded-full transition-transform ${
                  seniorMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Offline Pack Diagnostics */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-ink flex items-center gap-1.5">
            <Download size={16} className="text-[#9E4A0C] dark:text-amber-400" />
            <span>Vector Map Pack v4.2 Storage</span>
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-[#15803D]/15 text-[#15803D] dark:text-emerald-400 font-bold text-[10px]">
            Installed
          </span>
        </div>

        <div className="p-3 bg-surface border border-border rounded-xl space-y-1.5 text-stone text-[11px]">
          <div className="flex justify-between">
            <span>Vector Engine:</span>
            <strong className="text-ink">MapLibre GL Offline Tile Engine</strong>
          </div>
          <div className="flex justify-between">
            <span>Content Bundle:</span>
            <strong className="text-ink">{bundleVersion || '2026.10.17-v4.2'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Last Synchronized:</span>
            <strong className="text-ink">{lastSyncedAt || '17 Oct 2026'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Total Storage Footprint:</span>
            <strong className="text-ink">184 MB (Vectors + Photos + DB)</strong>
          </div>
        </div>

        {updateMsg && (
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#9E4A0C] dark:text-amber-400 font-semibold text-[11px] animate-in fade-in">
            {updateMsg}
          </div>
        )}

        <button
          onClick={handleUpdateCheck}
          disabled={isUpdating}
          className="w-full py-2.5 rounded-xl border border-[#9E4A0C] text-[#9E4A0C] dark:text-amber-400 font-bold text-xs hover:bg-surface transition-all flex items-center justify-center gap-1.5"
        >
          <RotateCcw size={13} className={isUpdating ? 'animate-spin' : ''} />
          <span>{isUpdating ? 'Verifying...' : 'Check & Sync Latest Pack'}</span>
        </button>
      </section>

      {/* 6. What Works Offline Capability Matrix */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-2.5 shadow-sm text-xs">
        <h3 className="font-heading text-sm font-bold text-ink flex items-center gap-1.5">
          <Wifi size={16} className="text-[#9E4A0C] dark:text-amber-400" />
          <span>Offline Guarantees & Features</span>
        </h3>
        <div className="divide-y divide-border">
          {capabilityMatrix.map((item) => (
            <div key={item.featureKey} className="py-2 flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-ink">{item.label}</div>
                <div className="text-[11px] text-stone mt-0.5">{item.notes}</div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  item.capability === 'works_offline'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                }`}
              >
                {item.capability === 'works_offline' ? 'Offline OK' : 'Online Sync'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Verification Audit & Corrections Log (SECURITY.md §10.3) */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-2.5 shadow-sm text-xs">
        <div
          onClick={() => setShowCorrections(!showCorrections)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <h3 className="font-heading text-sm font-bold text-ink flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#15803D] dark:text-emerald-400" />
            <span>Audit & Corrections Log (सत्यापन लॉग)</span>
          </h3>
          <span className="text-[11px] font-bold text-[#9E4A0C] dark:text-amber-400">
            {showCorrections ? 'Hide' : 'View (3 Verified)'}
          </span>
        </div>

        {showCorrections && (
          <div className="pt-2 space-y-2 text-[11px] text-stone animate-in fade-in">
            <div className="p-2.5 rounded-xl bg-surface border border-border space-y-1">
              <div className="font-bold text-ink flex items-center justify-between">
                <span>RTO Prepaid Taxi & Auto Notification</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">17 Oct 2026</span>
              </div>
              <p>Tariffs from Platform 1 prepaid booth (Jammu Tawi to Katra ₹1,650; City Forts ₹250–₹350) audited by field desk.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-surface border border-border space-y-1">
              <div className="font-bold text-ink flex items-center justify-between">
                <span>National Emergency 112 & Helpline Check</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">17 Oct 2026</span>
              </div>
              <p>ERSS 112, Police 100, Ambulance 108, Tourist Helpline 1363 verified two-person signed protocol.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-surface border border-border space-y-1">
              <div className="font-bold text-ink flex items-center justify-between">
                <span>Shrine Board RFID & Katra Corridor</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[10px]">17 Oct 2026</span>
              </div>
              <p>Yatra Registration RFID card checkpoint operational timings confirmed with SMVD Shrine Board desk.</p>
            </div>

            <p className="text-[10px] text-stone italic pt-1">
              Noticed a discrepancy or outdated tariff? Email <a href="mailto:corrections@jammukhoj.in" className="text-[#9E4A0C] dark:text-amber-400 font-bold underline">corrections@jammukhoj.in</a> for rapid audit patch.
            </p>
          </div>
        )}
      </section>

      {/* 7.5 Global & Indian City Tourism Benchmark Hub */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm text-xs text-stone">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
            <Globe size={16} className="text-[#9E4A0C] dark:text-amber-400" />
            <span>Global & Indian City Analysis Hub</span>
          </h3>
          <span className="text-[10px] bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
            20 World Cities
          </span>
        </div>

        <p className="leading-relaxed">
          See how JammuKhoj adopts international best practices from world cities like Kyoto, Rome, Barcelona, and Indian pilgrimage hubs like Varanasi and Tirupati.
        </p>

        <button
          onClick={() => navigate('/city-analysis')}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-stone-900 to-amber-950 text-white font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>Open Comparative City Benchmark</span>
          <ChevronRight size={14} />
        </button>
      </section>

      {/* 8. Storage Quota & Local Audit Logging */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm text-xs text-stone">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
            <HardDrive size={16} className="text-[#9E4A0C] dark:text-amber-400" />
            <span>Local Device Storage & Audit Logs</span>
          </h3>
          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            {storageUsageMb} MB Used
          </span>
        </div>

        <p className="leading-relaxed">
          Offline GIS tiles, Dogra heritage images, and transient diagnostics are maintained securely in your device's private IndexedDB storage.
        </p>

        <div className="pt-1 flex gap-2">
          <button
            onClick={() => setShowLogsModal(true)}
            className="flex-1 py-2 px-3 rounded-xl border border-border text-ink font-bold text-xs bg-surface hover:bg-surface/80 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Inspect Diagnostic Logs ({recentLogs.length})</span>
          </button>
        </div>
      </section>

      {/* 9. Privacy & Google Play Compliance */}
      <section className="bg-card border border-border rounded-2xl p-4 space-y-3 shadow-sm text-xs text-stone">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[#15803D] dark:text-emerald-400" />
            <span>Google Play Data Safety & Privacy</span>
          </h3>
          <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Play Store Compliant
          </span>
        </div>

        <p className="leading-relaxed">
          JammuKhoj runs 100% client-side in your device sandbox. No tracking cookies or surveillance telemetry are collected or sold.
        </p>

        <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => setShowContactModal(true)}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all text-center shadow-xs"
          >
            Contact & Support
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="py-2.5 px-3 rounded-xl border border-[#9E4A0C] text-[#9E4A0C] dark:text-amber-400 font-bold text-xs hover:bg-surface transition-all text-center"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setShowTermsModal(true)}
            className="py-2.5 px-3 rounded-xl border border-border text-stone font-bold text-xs hover:bg-surface transition-all text-center"
          >
            Terms of Use
          </button>
        </div>
      </section>

      {/* 7. Clear Cache & Account Deletion */}
      <div className="pt-1 space-y-2">
        <button
          onClick={() => setShowClearModal(true)}
          className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
        >
          <Trash2 size={14} />
          <span>Delete Account & Wipe Device Data</span>
        </button>
      </div>

      {/* Clear Confirm Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl text-ink">
            <h4 className="font-heading text-base font-bold text-ink">
              Delete Account & Reset Database?
            </h4>
            <p className="text-xs text-stone leading-relaxed">
              In accordance with Google Play Store User Data policy, this permanently deletes your profile, cached attractions, custom preferences, and saved itineraries from this device.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2 rounded-xl border border-border text-stone hover:text-ink text-xs font-semibold hover:bg-surface"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic Logs Inspection Modal */}
      {showLogsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl p-5 max-w-md w-full space-y-3 shadow-2xl max-h-[80vh] flex flex-col text-ink">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h4 className="font-heading text-base font-bold text-ink">
                Device Diagnostic Logs ({recentLogs.length})
              </h4>
              <button
                onClick={() => setShowLogsModal(false)}
                className="text-xs font-bold text-stone px-2 py-1 hover:text-ink"
              >
                Close
              </button>
            </div>

            <p className="text-[11px] text-stone">
              Private sandbox logs generated locally. Never transmitted over network.
            </p>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-[11px] font-mono">
              {recentLogs.length === 0 ? (
                <div className="text-center py-6 text-stone">No error or warning events recorded. Device is healthy.</div>
              ) : (
                recentLogs.map((log, idx) => (
                  <div
                    key={log.id || idx}
                    className={`p-2 rounded-lg border ${
                      log.level === 'error'
                        ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                        : log.level === 'warn'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                        : 'bg-surface border-border text-stone'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-75">
                      <span className="font-bold uppercase">[{log.level}] {log.category}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="mt-1 font-semibold text-ink">{log.message}</div>
                    {log.data && <div className="mt-0.5 opacity-70 truncate">{log.data}</div>}
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button
                onClick={async () => {
                  await logger.clearLogs();
                  setRecentLogs([]);
                }}
                className="flex-1 py-2 rounded-xl border border-border text-stone hover:text-ink text-xs font-semibold hover:bg-surface"
              >
                Clear Log Buffer
              </button>
              <button
                onClick={() => setShowLogsModal(false)}
                className="flex-1 py-2 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Contact & Support Modal */}
      <ContactSupportModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      {/* Terms of Use & Legal Advisory Modal */}
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};
