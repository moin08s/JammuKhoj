import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppShell } from '@/ui/layout/AppShell';
import { AppErrorBoundary } from '@/ui/AppErrorBoundary';

import { HomePage } from '@/features/home/HomePage';
import { WelcomeAuthGate } from '@/features/auth/WelcomeAuthGate';
import { useAppStore } from '@/stores/appStore';

// Lazy load non-critical route chunks to prevent 800kB+ initial bundle bloat
const PlanSetupPage = React.lazy(() => import('@/features/plan/PlanSetupPage').then(m => ({ default: m.PlanSetupPage })));
const ItineraryPage = React.lazy(() => import('@/features/plan/ItineraryPage').then(m => ({ default: m.ItineraryPage })));
const ExplorePage = React.lazy(() => import('@/features/explore/ExplorePage').then(m => ({ default: m.ExplorePage })));
const AttractionDetail = React.lazy(() => import('@/features/explore/AttractionDetail').then(m => ({ default: m.AttractionDetail })));
const MapPage = React.lazy(() => import('@/features/map/MapPage').then(m => ({ default: m.MapPage })));
const TransportPage = React.lazy(() => import('@/features/transport/TransportPage').then(m => ({ default: m.TransportPage })));
const TransitPassPage = React.lazy(() => import('@/features/transport/TransitPassPage').then(m => ({ default: m.TransitPassPage })));
const SafetyPage = React.lazy(() => import('@/features/safety/SafetyPage').then(m => ({ default: m.SafetyPage })));
const SavedPage = React.lazy(() => import('@/features/saved/SavedPage').then(m => ({ default: m.SavedPage })));
const SettingsPage = React.lazy(() => import('@/features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })));
const OnboardingPage = React.lazy(() => import('@/features/onboarding/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const DownloadPage = React.lazy(() => import('@/features/onboarding/DownloadPage').then(m => ({ default: m.DownloadPage })));
const BusinessPortal = React.lazy(() => import('@/features/business/BusinessPortal').then(m => ({ default: m.BusinessPortal })));
const TripPlannerPage = React.lazy(() => import('@/features/suggestions/TripPlannerPage').then(m => ({ default: m.TripPlannerPage })));
const PrivacyPolicyPage = React.lazy(() => import('@/features/privacy/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const CityAnalysisPage = React.lazy(() => import('@/features/benchmark/CityAnalysisPage').then(m => ({ default: m.CityAnalysisPage })));
const CommandPortalPage = React.lazy(() => import('@/features/admin/CommandPortalPage').then(m => ({ default: m.CommandPortalPage })));
const DarshanComfortIndex = React.lazy(() => import('@/features/spiritual/DarshanComfortIndex').then(m => ({ default: m.DarshanComfortIndex })));
const GreenPilgrimTracker = React.lazy(() => import('@/features/explore/GreenPilgrimTracker').then(m => ({ default: m.GreenPilgrimTracker })));
const NotFoundPage = React.lazy(() => import('@/ui/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const SuspenseFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
    <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
      Loading Jammu Khoj Module...
    </p>
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <AppErrorBoundary>
    <Suspense fallback={<SuspenseFallback />}>
      <Component />
    </Suspense>
  </AppErrorBoundary>
);

// Root Index Component that acts as an intelligent entry gate
const RootIndexGate: React.FC = () => {
  const { currentUser, isGuest } = useAppStore();

  // If user is neither logged in nor chosen guest mode, present the high-converting Play Store Google Welcome Gate
  if (!currentUser && !isGuest) {
    return <WelcomeAuthGate />;
  }

  return <HomePage />;
};

const router = createBrowserRouter([
  {
    path: '/welcome',
    element: <WelcomeAuthGate />,
  },
  {
    path: '/onboarding',
    element: withSuspense(OnboardingPage),
  },
  {
    path: '/download',
    element: withSuspense(DownloadPage),
  },
  {
    path: '/privacy',
    element: withSuspense(PrivacyPolicyPage),
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <RootIndexGate />,
      },
      {
        path: 'plan',
        element: withSuspense(PlanSetupPage),
      },
      {
        path: 'plan/result',
        element: withSuspense(ItineraryPage),
      },
      {
        path: 'explore',
        element: withSuspense(ExplorePage),
      },
      {
        path: 'explore/:id',
        element: withSuspense(AttractionDetail),
      },
      {
        path: 'map',
        element: withSuspense(MapPage),
      },
      {
        path: 'suggestions',
        element: withSuspense(TripPlannerPage),
      },
      {
        path: 'transport',
        element: withSuspense(TransportPage),
      },
      {
        path: 'transit-pass',
        element: withSuspense(TransitPassPage),
      },
      {
        path: 'crowd-radar',
        element: withSuspense(DarshanComfortIndex),
      },
      {
        path: 'green-yatra',
        element: withSuspense(GreenPilgrimTracker),
      },
      {
        path: 'safety',
        element: withSuspense(SafetyPage),
      },
      {
        path: 'command',
        element: withSuspense(CommandPortalPage),
      },
      {
        path: 'admin',
        element: withSuspense(CommandPortalPage),
      },
      {
        path: 'saved',
        element: withSuspense(SavedPage),
      },
      {
        path: 'settings',
        element: withSuspense(SettingsPage),
      },
      {
        path: 'login',
        element: <WelcomeAuthGate />,
      },
      {
        path: 'business',
        element: withSuspense(BusinessPortal),
      },
      {
        path: 'benchmark',
        element: withSuspense(CityAnalysisPage),
      },
      {
        path: 'city-analysis',
        element: withSuspense(CityAnalysisPage),
      },
      {
        path: '*',
        element: withSuspense(NotFoundPage),
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
