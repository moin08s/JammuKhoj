import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { ConnectivityBanner } from '../ConnectivityBanner';
import { HelpFab } from '../HelpFab';
import { GlobalAudioMiniPlayer } from '@/features/audio/GlobalAudioMiniPlayer';
import { bundleManager } from '@/domain/offline/bundleManager';
import { useAppStore } from '@/stores/appStore';
import { PermissionRequestModal } from '@/features/permissions/PermissionRequestModal';
import { deviceService } from '@/services/deviceService';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const { currentUser, isGuest, permissionsReviewed, setPermissionsReviewed } = useAppStore();

  // If the user is unauthenticated at root or on /login, hide app chrome
  const isAuthGate = (!currentUser && !isGuest && location.pathname === '/') || location.pathname === '/login' || location.pathname === '/welcome';
  const isHome = location.pathname === '/';
  const isMap = location.pathname === '/map';
  const isCleanHeader = isHome || location.pathname === '/saved' || location.pathname === '/settings';

  // Seed data on first load if IndexedDB is empty & monitor device
  useEffect(() => {
    bundleManager.initializeDefaultsIfEmpty().catch((err) => {
      console.error('Error auto-seeding offline database:', err);
    });

    // Auto-init battery status
    deviceService.initBatteryMonitor();

    // If permissions already reviewed, monitor location
    if (permissionsReviewed) {
      deviceService.startWatchPosition();
    }
  }, [permissionsReviewed]);

  if (isAuthGate) {
    return (
      <div className="min-h-[100dvh] bg-surface text-ink transition-colors flex flex-col">
        <main className="w-full flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-surface text-ink transition-colors">
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-1 relative bg-surface shadow-xs">
        {!isCleanHeader && <TopBar />}
        <ConnectivityBanner />

        <main className={`flex-1 ${isMap ? 'p-0 flex flex-col' : isCleanHeader ? 'px-3 sm:px-6 pt-2 pb-24' : 'px-4 sm:px-6 pb-24 pt-3'}`}>
          <Outlet />
        </main>

        <HelpFab />
        <GlobalAudioMiniPlayer />
        <BottomNav />

        {/* First ask device permissions after login/guest access */}
        <PermissionRequestModal
          isOpen={Boolean((currentUser || isGuest) && !permissionsReviewed)}
          onComplete={() => setPermissionsReviewed(true)}
        />
      </div>
    </div>
  );
};

