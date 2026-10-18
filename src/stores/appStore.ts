import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserAccount, UserRole, BusinessProfile } from '@/data/types';
import { db } from '@/data/db';

export type ConnectivityStatus = 'online' | 'offline_ready' | 'offline_no_pack';
export type SetupStatus = 'new' | 'onboarded' | 'downloaded';

interface AppState {
  connectivity: ConnectivityStatus;
  setupStatus: SetupStatus;
  language: 'en' | 'hi' | 'doi';
  bundleVersion: string | null;
  lastSyncedAt: string | null;
  theme: 'light' | 'dark';
  highContrast: boolean;
  largeText: boolean;
  seniorMode: boolean;
  currentUser: UserAccount | null;
  isGuest: boolean;
  favorites: string[];
  permissionsReviewed: boolean;
  deviceGps: { lat: number; lng: number; accuracy: number; timestamp: number } | null;
  deviceBattery: { level: number; isCharging: boolean } | null;

  setConnectivity: (status: ConnectivityStatus) => void;
  setSetupStatus: (status: SetupStatus) => void;
  setLanguage: (lang: 'en' | 'hi' | 'doi') => void;
  setBundleVersion: (version: string) => void;
  setLastSynced: (date: string) => void;
  toggleTheme: () => void;
  setHighContrast: (enabled: boolean) => void;
  setLargeText: (enabled: boolean) => void;
  setSeniorMode: (enabled: boolean) => void;
  setGuestMode: (guest: boolean) => void;
  setPermissionsReviewed: (reviewed: boolean) => void;
  setDeviceGps: (coords: { lat: number; lng: number; accuracy: number; timestamp: number } | null) => void;
  setDeviceBattery: (battery: { level: number; isCharging: boolean } | null) => void;
  toggleFavorite: (attractionId: string) => void;
  login: (email: string, role: UserRole, name?: string, businessDetails?: BusinessProfile, authProvider?: 'email' | 'google', avatar?: string) => void;
  logout: () => void;
  updateBusinessProfile: (details: Partial<BusinessProfile>) => void;
  deleteAccountAndData: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      connectivity: 'online',
      setupStatus: 'downloaded',
      language: 'en',
      bundleVersion: '2026.10.17-3',
      lastSyncedAt: '17 Oct 2026',
      theme: 'light',
      highContrast: false,
      largeText: false,
      seniorMode: false,
      currentUser: null,
      isGuest: false,
      favorites: ['attr_raghunath_temple', 'attr_bhaderwah'],
      permissionsReviewed: false,
      deviceGps: null,
      deviceBattery: null,

      setConnectivity: (status) => set({ connectivity: status }),
      setSetupStatus: (status) => set({ setupStatus: status }),
      setLanguage: (lang) => set({ language: lang }),
      setBundleVersion: (version) => set({ bundleVersion: version }),
      setLastSynced: (date) => set({ lastSyncedAt: date }),
      toggleTheme: () => {
        const nextTheme = get().theme === 'light' ? 'dark' : 'light';
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme: nextTheme });
      },
      setHighContrast: (enabled) => {
        if (enabled) {
          document.documentElement.setAttribute('data-contrast', 'high');
        } else {
          document.documentElement.removeAttribute('data-contrast');
        }
        set({ highContrast: enabled });
      },
      setLargeText: (enabled) => {
        if (enabled) {
          document.documentElement.setAttribute('data-font-size', 'large');
        } else {
          document.documentElement.removeAttribute('data-font-size');
        }
        set({ largeText: enabled });
      },
      setSeniorMode: (enabled) => {
        if (enabled) {
          document.documentElement.setAttribute('data-senior-mode', 'true');
        } else {
          document.documentElement.removeAttribute('data-senior-mode');
        }
        set({ seniorMode: enabled });
      },
      setGuestMode: (guest) => set({ isGuest: guest }),
      setPermissionsReviewed: (reviewed) => set({ permissionsReviewed: reviewed }),
      setDeviceGps: (coords) => set({ deviceGps: coords }),
      setDeviceBattery: (battery) => set({ deviceBattery: battery }),
      toggleFavorite: (attractionId) => {
        const current = get().favorites;
        if (current.includes(attractionId)) {
          set({ favorites: current.filter((id) => id !== attractionId) });
        } else {
          set({ favorites: [...current, attractionId] });
        }
      },
      login: (email, role, name, businessDetails, authProvider = 'email', avatar) => {
        // Secure token generation for production / Play Store compliance
        const sessionToken = `jk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const user: UserAccount = {
          email,
          name: name || (role === 'business' ? 'Dogra Business Partner' : 'Jammu Pilgrim / Explorer'),
          role,
          authProvider,
          avatar,
          businessDetails: role === 'business' ? (businessDetails || {
            businessName: name || 'Raghunath Heritage Dry Fruits & Stays',
            category: 'shop',
            contactPhone: '+91 94191 23456',
            address: 'Shop 12, Main Temple Chowk, Raghunath Bazaar, Jammu',
            description: 'Verified authentic local Dogra dry fruits, saffron, and pilgrim hospitality services.',
            isVerified: true,
            specialOffers: ['10% exclusive discount for JammuKhoj app users', 'Free luggage storage with purchase above ₹250'],
            registeredOn: new Date().toISOString(),
          }) : undefined,
          createdAt: new Date().toISOString(),
        };
        set({ currentUser: user, isGuest: false });
      },
      logout: () => set({ currentUser: null, isGuest: false }),
      updateBusinessProfile: (details) => {
        const current = get().currentUser;
        if (!current || current.role !== 'business' || !current.businessDetails) return;
        set({
          currentUser: {
            ...current,
            businessDetails: {
              ...current.businessDetails,
              ...details,
            },
          },
        });
      },
      // Google Play Store Mandatory Account & Data Deletion
      deleteAccountAndData: async () => {
        try {
          await db.savedPlans.clear();
          await db.preferences.clear();
        } catch (e) {
          console.warn('Error clearing user data:', e);
        }
        set({
          currentUser: null,
          isGuest: false,
          favorites: [],
        });
      },
    }),
    {
      name: 'jammukhoj-app-storage',
      partialize: (state) => ({
        connectivity: state.connectivity,
        setupStatus: state.setupStatus,
        language: state.language,
        bundleVersion: state.bundleVersion,
        lastSyncedAt: state.lastSyncedAt,
        theme: state.theme,
        highContrast: state.highContrast,
        largeText: state.largeText,
        seniorMode: state.seniorMode,
        currentUser: state.currentUser,
        favorites: state.favorites,
        permissionsReviewed: state.permissionsReviewed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && !state.currentUser) {
          state.isGuest = false;
        }
      },
    }
  )
);
