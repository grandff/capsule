interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem>();

  // 캐시 데이터 가져오기
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // 캐시 만료 확인
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // 캐시 데이터 설정
  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // 캐시 삭제
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // 특정 패턴의 캐시 삭제 (예: 특정 쓰레드의 모든 캐시)
  deletePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  // 전체 캐시 삭제
  clear(): void {
    this.cache.clear();
  }

  // 캐시 크기 확인
  size(): number {
    return this.cache.size;
  }

  // 만료된 캐시 정리
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// 싱글톤 인스턴스
export const memoryCache = new MemoryCache();

// 캐시 키 생성 함수들
export const cacheKeys = {
  replies: (threadId: number) => `replies:${threadId}`,
  mentions: (threadId: number) => `mentions:${threadId}`,
  insights: (threadId: number) => `insights:${threadId}`,
  thread: (threadId: number) => `thread:${threadId}`,
};

// 캐시 TTL 상수 (밀리초)
export const CACHE_TTL = {
  REPLIES: 1 * 60 * 1000, // 10분 (테스트 중으로 1분 FIXME)
  MENTIONS: 10 * 60 * 1000, // 10분
  INSIGHTS: 30 * 60 * 1000, // 30분
  THREAD: 60 * 60 * 1000, // 1시간
};

// 캐시된 API 호출 래퍼 함수
export async function cachedApiCall<T>(
  key: string,
  ttl: number,
  apiCall: () => Promise<T>,
): Promise<T> {
  // 캐시에서 먼저 확인
  const cached = memoryCache.get(key);
  if (cached) {
    console.log(`Cache hit: ${key}`);
    return cached;
  }

  // API 호출
  console.log(`Cache miss: ${key}`);
  const data = await apiCall();

  // 캐시에 저장
  memoryCache.set(key, data, ttl);

  return data;
}
