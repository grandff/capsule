/**
 * Cron job 헤더 검증 함수
 * cronjob에서만 호출 가능하도록 헤더의 secret 값을 검증합니다.
 */

const secretKey = process.env.CRON_SECRET_KEY ?? "default-cron-secret";

export function validateCronSecret(
  request: Request,
  secretKey: string,
): boolean {
  const cronSecret = request.headers.get("X-Cron-Secret");
  const expectedSecret = process.env[secretKey] || "default-cron-secret";
  return cronSecret === expectedSecret;
}

/**
 * Perplexity 트렌드 분석용 cron secret 검증
 */
export function validatePerplexityCronSecret(request: Request): boolean {
  return validateCronSecret(request, secretKey);
}
