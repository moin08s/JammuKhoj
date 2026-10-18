import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Database,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Download,
  Share2,
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, deleteAccountAndData } = useAppStore();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleDeleteAll = async () => {
    await deleteAccountAndData();
    setDeleteConfirmOpen(false);
    setDeleteSuccess(true);
    setTimeout(() => {
      navigate('/welcome');
    }, 2000);
  };

  const handleExportData = () => {
    const backup = {
      app: 'JammuKhoj',
      version: '2026.10.17',
      exportedAt: new Date().toISOString(),
      user: currentUser,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jammukhoj_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 py-3 animate-in fade-in max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-xl border border-border text-stone hover:text-ink"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-heading text-xl font-bold text-ink">
            Privacy Policy & Data Safety
          </h2>
          <p className="text-xs text-stone">Google Play Developer Policy Compliance</p>
        </div>
      </div>

      {deleteSuccess && (
        <div className="p-3.5 rounded-2xl bg-success/15 border border-success/30 text-success text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>All local account data and offline plans permanently deleted.</span>
        </div>
      )}

      {/* Overview Card */}
      <div className="p-4 bg-card border border-border rounded-3xl shadow-sm space-y-3 text-xs leading-relaxed">
        <div className="flex items-center gap-2 text-primary font-bold">
          <ShieldCheck size={18} />
          <span>Offline-First Data Architecture</span>
        </div>
        <p className="text-stone">
          JammuKhoj is designed with a strict privacy-first principle. All user data, itineraries, preferences, and offline maps are stored locally on your device via <strong>IndexedDB (Dexie)</strong>. We do not sell, rent, or monetize your personal travel data.
        </p>
      </div>

      {/* Permissions Breakdown */}
      <div className="p-4 bg-card border border-border rounded-3xl shadow-sm space-y-3 text-xs">
        <h3 className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
          <Lock size={16} className="text-primary" />
          <span>Android Permissions Explained</span>
        </h3>

        <div className="space-y-2">
          <div className="p-3 rounded-2xl bg-surface border border-border/70 space-y-1">
            <div className="font-bold text-ink">📍 Precise Location (GPS)</div>
            <p className="text-[11px] text-stone">
              Used strictly client-side to calculate distance to Jammu destinations, show your blue dot on the map, and generate landmark coordinates for 24x7 ERSS 112 emergency calls. Never uploaded to remote tracking servers.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-surface border border-border/70 space-y-1">
            <div className="font-bold text-ink">💾 Local Device Storage</div>
            <p className="text-[11px] text-stone">
              Used to cache high-resolution vector and terrain map tiles, opening hours, and fair transport tariff tables for 100% offline usage in remote areas.
            </p>
          </div>
        </div>
      </div>

      {/* Google Play Mandatory Account & Data Deletion */}
      <div className="p-4 bg-card border border-border rounded-3xl shadow-sm space-y-3 text-xs">
        <h3 className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
          <Database size={16} className="text-rose-500" />
          <span>Data Ownership & Account Deletion</span>
        </h3>
        <p className="text-stone text-[11px]">
          In compliance with Google Play Store User Data policies, you have complete control over your data and can export or permanently delete your account at any time.
        </p>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleExportData}
            className="flex-1 py-2.5 px-3 rounded-xl border border-border bg-surface hover:bg-card text-ink font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <Download size={14} className="text-primary" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="flex-1 py-2.5 px-3 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <Trash2 size={14} />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-sm w-full p-5 space-y-3.5 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-1">
              <h4 className="font-heading font-bold text-base text-ink">
                Permanently Delete Account?
              </h4>
              <p className="text-xs text-stone">
                This will delete your registered profile, all offline saved itineraries, custom route alarms, and local bookmarks from this device. This cannot be undone.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-stone font-semibold text-xs hover:bg-surface"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
