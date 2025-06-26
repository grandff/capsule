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
