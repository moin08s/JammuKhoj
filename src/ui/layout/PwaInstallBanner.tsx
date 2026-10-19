import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosTip, setShowIosTip] = useState(false);

  useEffect(() => {
    // Check if user already dismissed recently
    const dismissedUntil = localStorage.getItem('pwa_prompt_dismissed_until');
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
      return;
    }

    // Check if already in standalone display mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      return;
    }

    // Check for iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    if (isIosDevice) {
      setIsIos(true);
      setShowBanner(true);
      return;
    }

    // Catch Chrome/Android install event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosTip(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    // Dismiss for 48 hours
    localStorage.setItem(
      'pwa_prompt_dismissed_until',
      (Date.now() + 48 * 60 * 60 * 1000).toString()
    );
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="w-full bg-gradient-to-r from-primary to-[#123E38] text-white px-3 sm:px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs animate-in slide-in-from-top duration-300 z-40 relative">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0">
          <Smartphone size={17} className="text-amber-300" />
        </div>
        <div className="min-w-0">
          <div className="font-bold truncate text-[12px] flex items-center gap-1.5">
            <span>Install JammuKhoj App</span>
            <span className="text-[10px] bg-amber-400 text-stone-900 font-bold px-1.5 py-0.2 rounded-full">
              Offline Ready
            </span>
          </div>
          <div className="text-[11px] text-white/85 truncate">
            {isIos ? 'Fast access & full offline Vaishno Devi maps' : 'Save yatra maps & live fares directly to your home screen'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all apple-press"
        >
          <Download size={13} />
          <span>{isIos ? 'How to Add' : 'Install'}</span>
        </button>

        <button
          onClick={handleDismiss}
          className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Dismiss banner"
        >
          <X size={15} />
        </button>
      </div>

      {/* iOS Safari instructions tooltip modal */}
      {showIosTip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card text-ink border border-border rounded-3xl max-w-sm w-full p-5 space-y-3 shadow-2xl">
            <h4 className="font-heading font-bold text-sm text-ink flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <span>Install on iPhone / iPad</span>
            </h4>
            <ol className="text-xs text-stone space-y-2 list-decimal pl-4 leading-relaxed">
              <li>Tap the <strong>Share</strong> button (box with upward arrow) at the bottom of Safari.</li>
              <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
              <li>Tap <strong>Add</strong> in the top-right corner.</li>
            </ol>
            <button
              onClick={() => setShowIosTip(false)}
              className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
