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

export const RECOMMEND_TEXT = [
  "오늘 어디 다녀왔어? 사진만 올리기 아쉬우면, 간단하게 후기 써보는 것도 좋아. 사람들한테 추천하고 싶은 포인트 하나만 넣어봐!",
  "요즘 뭐에 푹 빠져 있어? 책, 운동, 드라마, 뭐든 좋아. 그거 하면서 느낀 점을 가볍게 적어봐도 재밌을 거야!",
  "오늘 하루 중 유난히 기억에 남는 장면이 있다면, 그 얘기 써보는 건 어때? 짧게라도 감정이 담기면 사람들 반응 좋아!",
  "요즘 자꾸 머릿속에 맴도는 주제 있지 않아? 일, 인간관계, 여름, 나이… 가볍게 툭 하나 꺼내봐. 글 소재는 그런 데서 나오더라구!",
  "글 어렵게 생각 말고, 그냥 ‘요즘 진짜 덥다’, ‘이 말 어디다 하고 싶다’ 같은 한 줄 감정이라도 올려보는 거 어때?",
];

export const FOLLOWERS_EVENT_TYPES = [
  { value: "upload", label: "업로드" },
  { value: "refresh", label: "새로고침" },
  { value: "daily_snapshot", label: "일일 스냅샷" },
];

export const MAX_FILES = 10;
export const MAX_FILE_SIZE = 500; // 500MB (동영상 최대 크기)

export const MAX_IMAGE_SIZE = 6 * 1024 * 1024; // 6MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
export const MAX_IMAGE_SIZE_MB = "6MB";
export const MAX_VIDEO_SIZE_MB = "500MB";
export const ALLOWED_IMAGE_TYPES = ["image/*"];
// 이미지만 허용
export const ALLOWED_VIDEO_TYPES = [];

export const SHORT_TOAST_DURATION = 1500;
export const LONG_TOAST_DURATION = 3000;

// Threads API 재시도 설정
export const THREADS_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 30000,
} as const;

export const STATS_REFRESH_COOLDOWN = 30;
