export interface TokenCheckResult {
  success: boolean;
  message?: string;
}

export async function checkThreadsToken(): Promise<TokenCheckResult> {
  try {
    const response = await fetch("/api/write/check-token", {
      method: "POST",
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("토큰 확인 중 오류:", error);
    return {
      success: false,
      message: "토큰 확인 중 오류가 발생했습니다.",
    };
  }
}
