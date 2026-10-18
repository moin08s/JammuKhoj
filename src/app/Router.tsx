import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppShell } from '@/ui/layout/AppShell';

import { HomePage } from '@/features/home/HomePage';
import { PlanSetupPage } from '@/features/plan/PlanSetupPage';
import { ItineraryPage } from '@/features/plan/ItineraryPage';
import { ExplorePage } from '@/features/explore/ExplorePage';
import { AttractionDetail } from '@/features/explore/AttractionDetail';
import { MapPage } from '@/features/map/MapPage';
import { TransportPage } from '@/features/transport/TransportPage';
import { SafetyPage } from '@/features/safety/SafetyPage';
import { SavedPage } from '@/features/saved/SavedPage';
import { SettingsPage } from '@/features/settings/SettingsPage';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { DownloadPage } from '@/features/onboarding/DownloadPage';
import { WelcomeAuthGate } from '@/features/auth/WelcomeAuthGate';
import { LoginPage } from '@/features/auth/LoginPage';
import { BusinessPortal } from '@/features/business/BusinessPortal';
import { TripPlannerPage } from '@/features/suggestions/TripPlannerPage';
import { PrivacyPolicyPage } from '@/features/privacy/PrivacyPolicyPage';
import { CityAnalysisPage } from '@/features/benchmark/CityAnalysisPage';
import { useAppStore } from '@/stores/appStore';

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
    element: <OnboardingPage />,
  },
  {
    path: '/download',
    element: <DownloadPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPolicyPage />,
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
        element: <PlanSetupPage />,
      },
      {
        path: 'plan/result',
        element: <ItineraryPage />,
      },
      {
        path: 'explore',
        element: <ExplorePage />,
      },
      {
        path: 'explore/:id',
        element: <AttractionDetail />,
      },
      {
        path: 'map',
        element: <MapPage />,
      },
      {
        path: 'suggestions',
        element: <TripPlannerPage />,
      },
      {
        path: 'transport',
        element: <TransportPage />,
      },
      {
        path: 'safety',
        element: <SafetyPage />,
      },
      {
        path: 'saved',
        element: <SavedPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'login',
        element: <WelcomeAuthGate />,
      },
      {
        path: 'business',
        element: <BusinessPortal />,
      },
      {
        path: 'benchmark',
        element: <CityAnalysisPage />,
      },
      {
        path: 'city-analysis',
        element: <CityAnalysisPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
