import { DateTime } from "luxon";

export function formatDate(
  dateString: string,
  locale: string = "ko-KR",
): string {
  const date = DateTime.fromISO(dateString, { zone: "Asia/Seoul" });

  if (!date.isValid) {
    console.warn("Invalid date string:", dateString);
    return "날짜 오류";
  }

  return date.setLocale(locale).toFormat("yyyy년 M월 d일 a h:mm");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function getPlatformDisplayName(platform: string): string {
  switch (platform) {
    case "thread":
      return "Threads";
    case "X":
      return "X (Twitter)";
    default:
      return platform;
  }
}

/**
 * 오늘(한국시간) 기준으로 날짜 차이만큼 이동한 날짜의 0시 0분 0초(KST) unix 타임스탬프(초)를 반환
 * @param dayDiff 날짜 차이 (0: 오늘, 1: 어제, -1: 내일 등)
 * @returns unix timestamp (초)
 */
export function getUnixTimestampByDayDiff(dayDiff?: number): number {
  let diff = 0;
  if (typeof dayDiff === "number" && Number.isInteger(dayDiff)) {
    diff = dayDiff;
  }
  // 오늘(한국시간) 0시 기준에서 diff만큼 이동
  const date = DateTime.now()
    .setZone("Asia/Seoul")
    .startOf("day")
    .minus({ days: diff });
  return Math.floor(date.toSeconds());
}
