import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, X, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type ConnectivityStatus } from '@/stores/appStore';
import { getBundleVersion } from '@/data/db';
import { Link } from 'react-router-dom';

export const ConnectivityBanner: React.FC = () => {
  const { t } = useTranslation();
  const { connectivity, setConnectivity } = useAppStore();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function updateStatus() {
      const isOnline = navigator.onLine;
      if (isOnline) {
        setConnectivity('online');
      } else {
        const version = await getBundleVersion();
        setConnectivity(version ? 'offline_ready' : 'offline_no_pack');
      }
    }

    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, [setConnectivity]);

  if (connectivity === 'online' || dismissed) {
    return null;
  }

  if (connectivity === 'offline_ready') {
    return (
      <div className="bg-primary-soft text-primary border-b border-primary/20 px-4 py-2 text-xs font-medium flex items-center justify-between gap-2 transition-all">
        <div className="flex items-center gap-2">
          <WifiOff size={15} className="shrink-0 text-primary" />
          <span>{t('offline.ready')}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-primary/10 text-primary"
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-warn/15 text-warn border-b border-warn/30 px-4 py-2.5 text-xs font-medium flex items-center justify-between gap-2 transition-all">
      <div className="flex items-center gap-2">
        <AlertCircle size={16} className="shrink-0" />
        <span>{t('offline.no_pack')}</span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/download"
          className="underline font-bold hover:opacity-80 flex items-center gap-1"
        >
          <Download size={13} />
          <span>Install</span>
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-warn/10"
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
