import { sql } from "drizzle-orm";
import {
  bigint,
  date,
  integer,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole } from "drizzle-orm/supabase";

import { TREND_TYPES } from "~/constants";

export const trendType = pgEnum(
  "trend_type",
  TREND_TYPES.map((type) => type.value) as [string, ...string[]],
);

export const trends = pgTable(
  "trends",
  {
    trend_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
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
  },
  (table) => [
    // RLS Policy: All authenticated users can view trends (read-only)
    pgPolicy("select-trends-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
    // RLS Policy: Only admins can insert trends
    pgPolicy("insert-trends-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    // RLS Policy: Only admins can update trends
    pgPolicy("update-trends-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`auth.jwt() ->> 'role' = 'admin'`,
      using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    // RLS Policy: Only admins can delete trends
    pgPolicy("delete-trends-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
  ],
);

export const trendKeywords = pgTable(
  "trend_keywords",
  {
    trend_keyword_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    sort_seq: integer().notNull(),
    trend_keyword: text().notNull(),
    trend_keyword_rank: integer().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: All authenticated users can view trend keywords (read-only)
    pgPolicy("select-trend-keywords-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
    // RLS Policy: Only admins can insert trend keywords
    pgPolicy("insert-trend-keywords-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    // RLS Policy: Only admins can update trend keywords
    pgPolicy("update-trend-keywords-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`auth.jwt() ->> 'role' = 'admin'`,
      using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    // RLS Policy: Only admins can delete trend keywords
    pgPolicy("delete-trend-keywords-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
  ],
);
