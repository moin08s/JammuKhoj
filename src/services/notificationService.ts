/**
 * JammuKhoj Native Web Notification & Civil Defense Dispatch Service
 * 
 * Provides:
 * 1. Native browser Notification API permission handling.
 * 2. Background lock-screen civil defense emergency alerts with vibration.
 * 3. Service Worker showNotification fallback for backgrounded tabs.
 */

class NotificationService {
  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  public async sendEmergencyAlert(
    title: string,
    body: string,
    safeHavenName?: string
  ): Promise<boolean> {
    if (!this.isSupported()) return false;

    // Check permission
    if (Notification.permission !== 'granted') {
      const res = await this.requestPermission();
      if (res !== 'granted') return false;
    }

    const notificationBody = safeHavenName
      ? `${body}\n\nSafe Evacuation Concourse: ${safeHavenName}\nDial 112 for immediate rescue.`
      : `${body}\nDial 112 for immediate rescue.`;

    const options: any = {
      body: notificationBody,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-emblem.svg',
      tag: 'jammukhoj-disaster-siren',
      renotify: true,
      requireInteraction: true,
      data: { url: '/safety' },
      // Hardware vibration pattern
      ...( 'vibrate' in navigator ? { vibrate: [400, 150, 400, 150, 800] } : {} ),
    };

    try {
      // Prefer service worker showNotification for reliable mobile lock-screen delivery
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && 'showNotification' in registration) {
          await registration.showNotification(title, options);
          return true;
        }
      }

      // Fallback to standard window Notification constructor
      new Notification(title, options);
      return true;
    } catch (err) {
      console.warn('[NotificationService] Fallback notification failed:', err);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
