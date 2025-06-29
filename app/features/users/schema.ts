/**
 * User Profile Schema
 *
 * This file defines the database schema for user profiles and sets up
 * Supabase Row Level Security (RLS) policies to control data access.
 */
import { sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";

import { TARGET_TYPES } from "~/constants";
import { timestamps } from "~/core/db/helpers.server";

export const targetType = pgEnum(
  "target_type",
  TARGET_TYPES.map((type) => type.value) as [string, ...string[]],
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
