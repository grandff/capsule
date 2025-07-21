/**
 * User Profile Schema
 *
 * This file defines the database schema for user profiles and sets up
 * Supabase Row Level Security (RLS) policies to control data access.
 */
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";

import { FOLLOWERS_EVENT_TYPES, TARGET_TYPES } from "~/constants";
import { timestamps } from "~/core/db/helpers.server";

export const targetType = pgEnum(
  "target_type",
  TARGET_TYPES.map((type) => type.value) as [string, ...string[]],
);

export const followersEventType = pgEnum(
  "followers_event_type",
  FOLLOWERS_EVENT_TYPES.map((type) => type.value) as [string, ...string[]],
);
/**
 * Profiles Table
 *
 * Stores additional user profile information beyond the core auth data.
 * Links to Supabase auth.users table via profile_id foreign key.
 *
 * Includes Row Level Security (RLS) policies to ensure users can only
 * access and modify their own profile data.
 */
export const profiles = pgTable(
  "profiles",
  {
    // Primary key that references the Supabase auth.users id
    // Using CASCADE ensures profile is deleted when user is deleted
    profile_id: uuid()
      .primaryKey()
      .references(() => authUsers.id, {
        onDelete: "cascade",
      }),
    name: text().notNull(),
    marketing_consent: boolean().notNull().default(false),
    avatar_url: text(),
    // Adds created_at and updated_at timestamp columns
    ...timestamps,
  },
  (table) => [
    // RLS Policy: Users can only update their own profile
    pgPolicy("edit-profile-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own profile
    pgPolicy("delete-profile-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only view their own profile
    pgPolicy("select-profile-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);

export const snsProfiles = pgTable(
  "sns_profiles",
  {
    profile_id: uuid()
      .notNull()
      .primaryKey()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      }),
    target_type: targetType().notNull(),
    access_token: text().notNull(),
    expires_at: timestamp(),
    user_id: text().notNull(),
    ...timestamps,
  },
  (table) => [
    // RLS Policy: Users can only insert their own settings
    pgPolicy("insert-sns-profile-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own settings
    pgPolicy("edit-sns-profile-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own settings
    pgPolicy("delete-sns-profile-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only view their own settings
    pgPolicy("select-sns-profile-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);

export const setting = pgTable(
  "setting",
  {
    // Primary key that references the Supabase auth.users id
    // Using CASCADE ensures profile is deleted when user is deleted
    profile_id: uuid()
      .notNull()
      .primaryKey()
      .references(() => profiles.profile_id, {
        onDelete: "cascade",
      }),
    theme: text().notNull().default("dark"),
    font_size: text().notNull().default("default"),
    color_blind_mode: boolean().notNull().default(false),
    // Adds created_at and updated_at timestamp columns
    ...timestamps,
  },
  (table) => [
    // RLS Policy: Users can only insert their own settings
    pgPolicy("insert-setting-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own settings
    pgPolicy("edit-setting-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own settings
    pgPolicy("delete-setting-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only view their own settings
    pgPolicy("select-setting-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);

// 사용자 인사이트 시계열 데이터 테이블
export const userInsights = pgTable(
  "user_insights",
  {
    insight_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    thread_id: bigint({ mode: "number" }).notNull(), // threads 테이블 참조는 write/schema.ts에서 처리
    metric_name: text().notNull(), // "views", "followers_count" 등
    metric_type: text().notNull(), // "timeseries" 또는 "total"
    period: text().notNull(), // "day", "week", "month"
    value: integer().notNull(),
    end_time: timestamp().notNull(),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: Users can only view their own insights
    pgPolicy("select-user-insights-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only insert their own insights
    pgPolicy("insert-user-insights-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own insights
    pgPolicy("update-user-insights-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own insights
    pgPolicy("delete-user-insights-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // 인덱스들
    index("profile_thread_idx").on(table.profile_id, table.thread_id),
    index("metric_idx").on(table.metric_name),
    index("end_time_idx").on(table.end_time),
  ],
);

// 사용자 총계 지표 테이블 (메인 화면 통계용)
export const userMetrics = pgTable(
  "user_metrics",
  {
    metric_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    metric_name: text().notNull(), // "total_views", "total_reposts", "total_quotes"
    total_value: integer().notNull(),
    last_updated: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: Users can only view their own metrics
    pgPolicy("select-user-metrics-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only insert their own metrics
    pgPolicy("insert-user-metrics-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own metrics
    pgPolicy("update-user-metrics-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own metrics
    pgPolicy("delete-user-metrics-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // 인덱스
    index("profile_metric_idx").on(table.profile_id, table.metric_name),
  ],
);

// 사용자 관심 키워드 테이블
export const userInterestKeywords = pgTable(
  "user_interest_keywords",
  {
    keyword_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    keyword: text().notNull(), // 관심 키워드
    sort_order: integer().notNull().default(0), // 정렬 순서
    is_active: boolean().notNull().default(true), // 활성화 여부
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: Users can only view their own interest keywords
    pgPolicy("select-user-interest-keywords-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only insert their own interest keywords
    pgPolicy("insert-user-interest-keywords-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own interest keywords
    pgPolicy("update-user-interest-keywords-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own interest keywords
    pgPolicy("delete-user-interest-keywords-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // 인덱스들
    index("profile_keyword_idx").on(table.profile_id, table.keyword),
    index("profile_active_idx").on(table.profile_id, table.is_active),
    index("sort_order_idx").on(table.sort_order),
  ],
);

// GPT 분석 결과 테이블
export const gptAnalysisResults = pgTable(
  "gpt_analysis_results",
  {
    analysis_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    analysis_text: text().notNull(), // GPT 분석 결과 텍스트
    analysis_date: timestamp().notNull().defaultNow(), // 분석 날짜
    is_helpful: boolean(), // 도움이 됐는지 피드백 (nullable)
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: Users can only view their own analysis results
    pgPolicy("select-gpt-analysis-results-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only insert their own analysis results
    pgPolicy("insert-gpt-analysis-results-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own analysis results
    pgPolicy("update-gpt-analysis-results-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own analysis results
    pgPolicy("delete-gpt-analysis-results-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // 인덱스들
    index("profile_analysis_date_idx").on(
      table.profile_id,
      table.analysis_date,
    ),
    index("analysis_date_idx").on(table.analysis_date),
  ],
);

// 팔로워 이력 테이블 (followers_history)
export const followersHistory = pgTable(
  "followers_history",
  {
    history_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    thread_id: bigint({ mode: "number" }), // nullable, threads 테이블 참조는 write/schema.ts에서 처리
    follower_count: integer().notNull(),
    event_type: followersEventType(),
    created_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: Users can only view their own follower history
    pgPolicy("select-followers-history-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only insert their own follower history
    pgPolicy("insert-followers-history-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own follower history
    pgPolicy("update-followers-history-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own follower history
    pgPolicy("delete-followers-history-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // 인덱스들
    index("profile_id_idx").on(table.profile_id),
    index("thread_id_idx").on(table.thread_id),
    index("created_at_idx").on(table.created_at),
    index("event_type_idx").on(table.event_type),
  ],
);

// 테이블 타입 정의
export type UserInsight = typeof userInsights.$inferSelect;
export type NewUserInsight = typeof userInsights.$inferInsert;
export type UserMetric = typeof userMetrics.$inferSelect;
export type NewUserMetric = typeof userMetrics.$inferInsert;
export type UserInterestKeyword = typeof userInterestKeywords.$inferSelect;
export type NewUserInterestKeyword = typeof userInterestKeywords.$inferInsert;
export type GptAnalysisResult = typeof gptAnalysisResults.$inferSelect;
export type NewGptAnalysisResult = typeof gptAnalysisResults.$inferInsert;
export type FollowerHistory = typeof followersHistory.$inferSelect;
export type NewFollowerHistory = typeof followersHistory.$inferInsert;
