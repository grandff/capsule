import {
  bigint,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { TREND_TYPES } from "~/constants";

export const trendType = pgEnum(
  "trend_type",
  TREND_TYPES.map((type) => type.value) as [string, ...string[]],
);

export const trends = pgTable("trends", {
  trend_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  trend_date: date().notNull(),
  trend_content: text().notNull(),
  trend_type: trendType().notNull(),
  trend_rank: integer().notNull(),
  trend_keyword_id: bigint({ mode: "number" }).references(
    () => trendKeywords.trend_keyword_id,
    {
      onDelete: "cascade",
    },
  ),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const trendKeywords = pgTable("trend_keywords", {
  trend_keyword_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  sort_seq: integer().notNull(),
  trend_keyword: text().notNull(),
  trend_keyword_rank: integer().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
