import { useAppStore } from '@/stores/appStore';

export interface DeviceGpsPosition {
  lat: number;
  lng: number;
  accuracy: number;
  altitude?: number | null;
  speed?: number | null;
  heading?: number | null;
  timestamp: number;
}

export interface DeviceBatteryStatus {
  level: number;
  isCharging: boolean;
  chargingTime?: number;
  dischargingTime?: number;
}

class DeviceService {
  private watchId: number | null = null;
  private batteryListenerInitialized = false;

  /**
   * Request live GPS position with high accuracy
   */
  async requestGpsLocation(): Promise<{ success: boolean; data?: DeviceGpsPosition; error?: string }> {
    if (!('geolocation' in navigator)) {
      return { success: false, error: 'Geolocation is not supported by your browser or device.' };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gpsData: DeviceGpsPosition = {
            lat: Number(position.coords.latitude.toFixed(6)),
            lng: Number(position.coords.longitude.toFixed(6)),
            accuracy: Math.round(position.coords.accuracy),
            altitude: position.coords.altitude,
            speed: position.coords.speed,
            heading: position.coords.heading,
            timestamp: position.timestamp,
          };

          // Save into store
          useAppStore.getState().setDeviceGps(gpsData);

          // Start watching position
          this.startWatchPosition();

          resolve({ success: true, data: gpsData });
        },
        (error) => {
          let errorMsg = 'Failed to retrieve location.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Location permission was denied by user.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMsg = 'Location information is currently unavailable.';
          } else if (error.code === error.TIMEOUT) {
            errorMsg = 'Location request timed out.';
          }
          resolve({ success: false, error: errorMsg });
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 5000,
        }
      );
    });
  }

  /**
   * Watch location changes
   */
  startWatchPosition() {
    if (this.watchId !== null || !('geolocation' in navigator)) return;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const gpsData: DeviceGpsPosition = {
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
          accuracy: Math.round(position.coords.accuracy),
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          heading: position.coords.heading,
          timestamp: position.timestamp,
        };
        useAppStore.getState().setDeviceGps(gpsData);
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
      }
    );
  }

  /**
   * Monitor live device battery status (Battery Status API)
   */
  async initBatteryMonitor(): Promise<DeviceBatteryStatus | null> {
    if (!('getBattery' in navigator)) {
      // Fallback for browsers without Battery API
      const defaultBattery = { level: 85, isCharging: false };
      useAppStore.getState().setDeviceBattery(defaultBattery);
      return defaultBattery;
    }

    try {
      const battery: any = await (navigator as any).getBattery();

      const updateBattery = () => {
        const status: DeviceBatteryStatus = {
          level: Math.round(battery.level * 100),
          isCharging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime,
        };
        useAppStore.getState().setDeviceBattery(status);
      };

      updateBattery();

      if (!this.batteryListenerInitialized) {
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
        this.batteryListenerInitialized = true;
      }

      return {
        level: Math.round(battery.level * 100),
        isCharging: battery.charging,
      };
    } catch (e) {
      console.warn('Error reading device battery status:', e);
      return null;
    }
  }

  /**
   * Request Push / Local Notification Permission
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Get Storage Usage Estimate
   */
  async getStorageEstimate(): Promise<{ usedMB: number; quotaMB: number } | null> {
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        const usedMB = Math.round((estimate.usage || 0) / (1024 * 1024));
        const quotaMB = Math.round((estimate.quota || 0) / (1024 * 1024));
        return { usedMB, quotaMB };
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const deviceService = new DeviceService();
