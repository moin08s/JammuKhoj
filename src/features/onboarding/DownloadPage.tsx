import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  ShieldCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { bundleManager, type DownloadProgress } from '@/domain/offline/bundleManager';
import { useAppStore } from '@/stores/appStore';

export const DownloadPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSetupStatus, setBundleVersion, setLastSynced } = useAppStore();

  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const startDownload = async () => {
    setDownloading(true);
    setError(null);

    try {
      await bundleManager.download((p) => {
        setProgress(p);
        if (p.phase === 'done') {
          setCompleted(true);
          setSetupStatus('downloaded');
          setBundleVersion('2026.10.17-1');
          setLastSynced('17 Oct 2026');
        }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col justify-between p-6 max-w-content mx-auto animate-in fade-in">
      <div className="pt-4 space-y-1 text-center">
        <h2 className="font-heading text-2xl font-bold text-ink">
          {completed ? t('offline.download_complete') : t('offline.download_title')}
        </h2>
        <p className="text-xs text-stone">
          One-time installation stores the complete pilot offline map, verified schedules, and emergency registry.
        </p>
      </div>

      <div className="my-auto space-y-5">
        {/* Main Status Graphic */}
        <div className="p-5 rounded-card bg-card border border-border shadow-sm text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
            {completed ? (
              <CheckCircle2 size={36} className="text-success" />
            ) : downloading ? (
              <Download size={32} className="animate-bounce" />
            ) : (
              <Download size={32} />
            )}
          </div>

          <div>
            <div className="font-heading text-base font-bold text-ink">
              Central Jammu Pilot Bounding Pack
            </div>
            <div className="text-xs text-stone mt-0.5">
              Size: ~42 MB · Offline Vector Tiles & IndexedDB
            </div>
          </div>

          {/* Progress Bar */}
          {downloading && progress && (
            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-surface border border-border rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-stone">
                <span>{progress.message}</span>
                <span className="tabular-nums">{progress.percent}%</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded-control bg-danger/10 border border-danger/25 text-xs text-danger flex items-center gap-2 text-left">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Feature Checkpoints */}
        <div className="space-y-2 bg-card border border-border rounded-card p-3.5 shadow-sm text-xs">
          <div className="font-bold text-ink text-xs mb-1">What's Packed Inside:</div>
          <div className="flex items-center gap-2 text-stone">
            <CheckCircle2 size={14} className="text-success shrink-0" />
            <span>MapLibre offline OpenStreetMap pilot vector corridor</span>
          </div>
          <div className="flex items-center gap-2 text-stone">
            <CheckCircle2 size={14} className="text-success shrink-0" />
            <span>8+ Curated Heritage & Temple POIs with verified hours</span>
          </div>
          <div className="flex items-center gap-2 text-stone">
            <CheckCircle2 size={14} className="text-success shrink-0" />
            <span>Dated auto/taxi fare reference bands from station surveys</span>
          </div>
          <div className="flex items-center gap-2 text-stone">
            <CheckCircle2 size={14} className="text-success shrink-0" />
            <span>Emergency 112, Police, and 24x7 GMCH casualty contacts</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pb-6">
        {completed ? (
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 px-4 rounded-control bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
          >
            <span>Launch JammuKhoj Companion</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={startDownload}
            disabled={downloading}
            className="w-full py-3.5 px-4 rounded-control bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {downloading ? (
              <span>Installing Pack...</span>
            ) : (
              <>
                <Download size={16} />
                <span>Install Jammu Pack (~42 MB)</span>
              </>
            )}
          </button>
        )}

        {!completed && !downloading && (
          <button
            onClick={() => {
              setSetupStatus('downloaded');
              navigate('/');
            }}
            className="w-full text-center text-xs text-stone hover:text-ink font-semibold py-1"
          >
            Skip for now (Use Emergency App Shell)
          </button>
        )}
      </div>
    </div>
  );
};
