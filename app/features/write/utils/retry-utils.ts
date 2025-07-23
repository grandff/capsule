import { THREADS_RETRY_CONFIG } from "~/constants";

// 재시도 유틸리티 함수
export const retryWithDelay = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = THREADS_RETRY_CONFIG.maxRetries,
  delayMs: number = THREADS_RETRY_CONFIG.retryDelayMs,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();

      // Threads API 오류 응답 확인
      if (result && typeof result === "object" && "error" in result) {
        throw new Error(
          `Threads API Error: ${(result as any).error?.message || "Unknown error"}`,
        );
      }

      // threadId가 undefined인지 확인
      if (
        result &&
        typeof result === "object" &&
        "id" in result &&
        !result.id
      ) {
        throw new Error("threadId is undefined");
      }

      return result;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Threads API 시도 ${attempt}/${maxRetries} 실패:`, error);

      if (attempt < maxRetries) {
        console.log(`${delayMs}ms 후 재시도...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError!;
};
