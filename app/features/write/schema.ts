import {
  bigint,
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { z } from "zod";

import { PROPERTY_TYPES, TARGET_TYPES } from "~/constants";

import { profiles } from "../users/schema";

export const targetType = pgEnum(
  "target_type",
  TARGET_TYPES.map((type) => type.value) as [string, ...string[]],
);

export const propertyType = pgEnum(
  "property_type",
  PROPERTY_TYPES.map((type) => type.value) as [string, ...string[]],
);

export const threads = pgTable("threads", {
  thread_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  short_text: text().notNull(),
  thread: text().notNull(),
  property_id: bigint({ mode: "number" }).references(
    () => properties.property_id,
    {
      onDelete: "cascade",
    },
  ),
  keyword_id: bigint({ mode: "number" }).references(() => keywords.keyword_id, {
    onDelete: "cascade",
  }),
  target_type: targetType().notNull(),
  send_flag: boolean().notNull().default(false),
  result_id: text(),
  profile_id: uuid().references(() => profiles.profile_id, {
    onDelete: "cascade",
  }),
  share_cnt: integer().notNull().default(0),
  like_cnt: integer().notNull().default(0),
  comment_cnt: integer().notNull().default(0),
  view_cnt: integer().notNull().default(0),
  now_follow_cnt: integer().notNull().default(0),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const keywords = pgTable("keywords", {
  keyword_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  sort_seq: integer().notNull().default(0),
  keyword: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const properties = pgTable("properties", {
  property_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  sort_seq: integer().notNull().default(0),
  property_type: propertyType().notNull(),
  property: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

// 프롬프트 관련 스키마
export const PromptTypeSchema = z.enum([
  "SOCIAL_MEDIA_POST", // 소셜미디어 포스트
  "PRODUCT_PROMOTION", // 제품 홍보
  "EVENT_ANNOUNCEMENT", // 이벤트 안내
  "DAILY_SHARE", // 일상 공유
  "REVIEW", // 후기/리뷰
  "BRANDING", // 브랜딩
  "CUSTOMER_ACQUISITION", // 고객 유치
  "NEWS_SHARE", // 뉴스 공유
  "INSIGHT_DELIVERY", // 인사이트 전달
  "SERVICE_INTRO", // 서비스 소개
]);

export const PromptCategorySchema = z.enum([
  "BASIC", // 기본 프롬프트
  "ADVANCED", // 고급 프롬프트
  "CUSTOM", // 사용자 정의 프롬프트
]);

export const PromptTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: PromptTypeSchema,
  category: PromptCategorySchema,
  template: z.string(), // 프롬프트 템플릿
  variables: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      required: z.boolean(),
      defaultValue: z.string().optional(),
    }),
  ),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PromptRequestSchema = z.object({
  promptId: z.string(),
  variables: z.record(z.string(), z.string()),
  userText: z.string(),
  settings: z.object({
    moods: z.array(z.string()),
    industries: z.array(z.string()),
    tones: z.array(z.string()),
    keywords: z.array(z.string()),
    intents: z.array(z.string()).optional(),
    length: z.string().optional(),
    timeframe: z.string().optional(),
    weather: z.string().optional(),
  }),
});

export const PromptResponseSchema = z.object({
  success: z.boolean(),
  content: z.string(),
  promptUsed: z.string(),
  metadata: z
    .object({
      model: z.string(),
      tokens: z.number(),
      processingTime: z.number(),
    })
    .optional(),
  error: z.string().optional(),
});

// 기존 스키마들
export const WriteRequestSchema = z.object({
  text: z.string().min(10, "최소 10자 이상 작성해주세요"),
  moods: z.array(z.string()).min(1, "분위기를 선택해주세요"),
  industries: z.array(z.string()).min(1, "산업군을 선택해주세요"),
  tones: z.array(z.string()).min(1, "톤을 선택해주세요"),
  keywords: z.array(z.string()).min(1, "키워드를 입력해주세요"),
  intents: z.array(z.string()).optional(),
  length: z.string().optional(),
  timeframe: z.string().optional(),
  weather: z.string().optional(),
});

export const WriteResponseSchema = z.object({
  content: z.string(),
  originalText: z.string(),
  moods: z.array(z.string()),
  industries: z.array(z.string()),
  tones: z.array(z.string()),
  keywords: z.array(z.string()),
  intents: z.array(z.string()).optional(),
  length: z.string().optional(),
  timeframe: z.string().optional(),
  weather: z.string().optional(),
});

// 타입 정의
export type PromptType = z.infer<typeof PromptTypeSchema>;
export type PromptCategory = z.infer<typeof PromptCategorySchema>;
export type PromptTemplate = z.infer<typeof PromptTemplateSchema>;
export type PromptRequest = z.infer<typeof PromptRequestSchema>;
export type PromptResponse = z.infer<typeof PromptResponseSchema>;
export type WriteRequest = z.infer<typeof WriteRequestSchema>;
export type WriteResponse = z.infer<typeof WriteResponseSchema>;
