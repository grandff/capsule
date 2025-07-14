import { sql } from "drizzle-orm";
import {
  bigint,
  integer,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";

import { profiles } from "../users/schema";

export const challenges = pgTable(
  "challenges",
  {
    challenge_id: uuid().primaryKey().defaultRandom(),
    challenge_ttl: text().notNull(),
    challenge_ctt: text().notNull(),
    start_date: timestamp().notNull(),
    end_date: timestamp().notNull(),
    max_member_cnt: integer().notNull(),
    now_member_cnt: integer().notNull().default(0),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: All authenticated users can view challenges
    pgPolicy("select-challenges-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`true`,
    }),
    // RLS Policy: Only admins can insert challenges
    pgPolicy("insert-challenges-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    // RLS Policy: Only admins can update challenges
    pgPolicy("update-challenges-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`auth.jwt() ->> 'role' = 'admin'`,
      using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
    // RLS Policy: Only admins can delete challenges
    pgPolicy("delete-challenges-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`auth.jwt() ->> 'role' = 'admin'`,
    }),
  ],
);

export const challengeMembers = pgTable(
  "challenge_members",
  {
    member_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    challenge_id: uuid()
      .notNull()
      .references(() => challenges.challenge_id, { onDelete: "cascade" }),
    sort_seq: integer().notNull().default(0),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    joined_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: Users can only view challenge members for challenges they're part of
    pgPolicy("select-challenge-members-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only insert themselves as challenge members
    pgPolicy("insert-challenge-members-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own challenge member records
    pgPolicy("update-challenge-members-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own challenge member records
    pgPolicy("delete-challenge-members-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);

export const challengeSubmits = pgTable(
  "challenge_submits",
  {
    submit_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    challenge_id: uuid()
      .notNull()
      .references(() => challenges.challenge_id, { onDelete: "cascade" }),
    sort_seq: integer().notNull().default(0),
    profile_id: uuid()
      .notNull()
      .references(() => profiles.profile_id, { onDelete: "cascade" }),
    submit_ctt: text().notNull(),
    submitted_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: Users can only view challenge submits for challenges they're part of
    pgPolicy("select-challenge-submits-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only insert their own challenge submits
    pgPolicy("insert-challenge-submits-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own challenge submits
    pgPolicy("update-challenge-submits-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own challenge submits
    pgPolicy("delete-challenge-submits-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);
