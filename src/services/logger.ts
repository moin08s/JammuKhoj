import { db } from '@/data/db';
import type { AppLogEntry } from '@/data/types';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class AppLogger {
  private isDev = Boolean((import.meta as any).env?.DEV);
  private maxLogs = 100;

  private formatMessage(category: string, message: string): string {
    return `[JammuKhoj:${category}] ${message}`;
  }

  private async persistLog(level: LogLevel, category: string, message: string, data?: any) {
    try {
      const entry: AppLogEntry = {
        level,
        category,
        message,
        data: data ? (typeof data === 'object' ? JSON.stringify(data).slice(0, 500) : String(data)) : undefined,
        timestamp: new Date().toISOString(),
      };

      if (db && db.appLogs) {
        await db.appLogs.add(entry);

        // Keep buffer bounded (max 100 records) to protect offline device storage
        const count = await db.appLogs.count();
        if (count > this.maxLogs) {
          const excess = count - this.maxLogs;
          const oldest = await db.appLogs.orderBy('id').limit(excess).primaryKeys();
          await db.appLogs.bulkDelete(oldest);
        }
      }
    } catch {
      // Fail silently to never disrupt UI
    }
  }

  debug(category: string, message: string, data?: any) {
    if (this.isDev) {
      console.debug(this.formatMessage(category, message), data ?? '');
    }
  }

  info(category: string, message: string, data?: any) {
    if (this.isDev) {
      console.info(this.formatMessage(category, message), data ?? '');
    }
    this.persistLog('info', category, message, data);
  }

  warn(category: string, message: string, data?: any) {
    console.warn(this.formatMessage(category, message), data ?? '');
    this.persistLog('warn', category, message, data);
  }

  error(category: string, message: string, data?: any) {
    console.error(this.formatMessage(category, message), data ?? '');
    this.persistLog('error', category, message, data);
  }

  async getRecentLogs(limit = 50): Promise<AppLogEntry[]> {
    try {
      if (db && db.appLogs) {
        return await db.appLogs.orderBy('id').reverse().limit(limit).toArray();
      }
    } catch {
      // return empty
    }
    return [];
  }

  async clearLogs(): Promise<void> {
    try {
      if (db && db.appLogs) {
        await db.appLogs.clear();
      }
    } catch {
      // pass
    }
  }
}

export const logger = new AppLogger();
