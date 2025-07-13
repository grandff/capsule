export const TARGET_TYPES = [
  { value: "thread", label: "쓰레드" },
  { value: "X", label: "X" },
];

export const PROPERTY_TYPES = [
  { value: "mood", label: "분위기" },
  { value: "work", label: "산업군" },
];

export const TREND_TYPES = [
  { value: "trending", label: "트렌드" },
  { value: "topic", label: "토픽" },
  { value: "users", label: "사용자" },
  { value: "hot", label: "핫" },
];

export const NOTIFICATION_TYPES = [
  { value: "thread", label: "쓰레드" },
  { value: "X", label: "X" },
  { value: "following", label: "팔로잉" },
  { value: "challenge", label: "챌린지" },
];

// 분위기 옵션 (확장)
export const MOOD_OPTIONS = [
  "친근한",
  "전문적인",
  "재미있는",
  "감성적인",
  "신뢰감 있는",
  "활기찬",
  "차분한",
  "열정적인",
  "신중한",
  "창의적인",
  "우아한",
  "힘있는",
  "편안한",
  "긴장감 있는",
  "희망찬",
  "진지한",
  "유쾌한",
  "감사한",
  "자신감 있는",
  "따뜻한",
];

export const INDUSTRY_OPTIONS = [
  "IT/기술",
  "금융",
  "의료",
  "교육",
  "엔터테인먼트",
  "패션",
  "음식",
  "여행",
  "부동산",
  "자동차",
  "뷰티",
  "스포츠",
  "게임",
  "미디어",
  "마케팅",
  "법무",
  "건설",
  "제조업",
  "물류",
  "환경",
  "에너지",
  "농업",
  "반도체",
  "AI/머신러닝",
  "블록체인",
];

export const INTENT_OPTIONS = [
  "제품홍보",
  "이벤트 안내",
  "일상 공유",
  "후기/리뷰",
  "경험 공유", // ✅ 자연스러운 후기 톤 유도
  "추천/입소문", // ✅ 지인 추천처럼 말하게 유도
  "브랜딩",
  "고객유치",
  "단골 소통",
  "뉴스 공유",
  "인사이트 전달",
  "서비스 소개",
];

export const LENGTH_OPTIONS = ["짧게 임팩트 있게", "표준형", "설명위주로 길게"];

export const TIMEFRAME_OPTIONS = ["오늘", "이번주말", "다음주", "특정일자"];

export const WEATHER_OPTIONS = [
  "맑음",
  "흐림",
  "비",
  "눈",
  "더움",
  "추움",
  "시원함",
  "따뜻함",
];
