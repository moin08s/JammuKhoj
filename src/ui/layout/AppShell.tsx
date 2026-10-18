import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { ConnectivityBanner } from '../ConnectivityBanner';
import { HelpFab } from '../HelpFab';
import { GlobalAudioBar } from '../audio/GlobalAudioBar';
import { bundleManager } from '@/domain/offline/bundleManager';
import { useAppStore } from '@/stores/appStore';

export const AppShell: React.FC = () => {
  const location = useLocation();
  const { currentUser, isGuest } = useAppStore();

  // If the user is unauthenticated at root or on /login, hide app chrome
  const isAuthGate = (!currentUser && !isGuest && location.pathname === '/') || location.pathname === '/login' || location.pathname === '/welcome';
  const isHome = location.pathname === '/';
  const isMap = location.pathname === '/map';
  const isCleanHeader = isHome || location.pathname === '/saved' || location.pathname === '/settings';

  // Seed data on first load if IndexedDB is empty
  useEffect(() => {
    bundleManager.initializeDefaultsIfEmpty().catch((err) => {
      console.error('Error auto-seeding offline database:', err);
    });
  }, []);

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
        <GlobalAudioBar />
        <BottomNav />
      </div>
    </div>
  );
};
