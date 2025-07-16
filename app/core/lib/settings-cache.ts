interface CachedSettings {
  data: any;
  timestamp: number;
  userId: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5분
const settingsCache = new Map<string, CachedSettings>();

export class SettingsCache {
  static get(userId: string): any | null {
    const cached = settingsCache.get(userId);

    if (!cached) {
      return null;
    }

    // 캐시 만료 확인
    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      settingsCache.delete(userId);
      return null;
    }

    return cached.data;
  }

  static set(userId: string, data: any): void {
    settingsCache.set(userId, {
      data,
      timestamp: Date.now(),
      userId,
    });
  }

  static invalidate(userId: string): void {
    settingsCache.delete(userId);
  }

  static clear(): void {
    settingsCache.clear();
  }
}
