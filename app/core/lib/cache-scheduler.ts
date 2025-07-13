import { memoryCache } from "./cache";

// 캐시 정리 스케줄러
export function startCacheCleanupScheduler() {
  // 30분마다 만료된 캐시 정리
  setInterval(
    () => {
      memoryCache.cleanup();
      console.log(
        `Cache cleanup completed. Current cache size: ${memoryCache.size()}`,
      );
    },
    30 * 60 * 1000,
  ); // 30분

  // 서버 시작 시에도 한 번 정리
  memoryCache.cleanup();
  console.log(
    `Initial cache cleanup completed. Cache size: ${memoryCache.size()}`,
  );
}

// 수동 캐시 정리 함수 (디버깅용)
export function manualCacheCleanup() {
  memoryCache.cleanup();
  return {
    size: memoryCache.size(),
    message: "Cache cleanup completed",
  };
}

// 캐시 상태 확인 함수 (디버깅용)
export function getCacheStatus() {
  return {
    size: memoryCache.size(),
    timestamp: new Date().toISOString(),
  };
}
