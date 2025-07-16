import { sql } from "drizzle-orm";
import {
  bigint,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUid, authenticatedRole } from "drizzle-orm/supabase";
import { z } from "zod";

import { NOTIFICATION_TYPES } from "~/constants";

import { profiles } from "../users/schema";

// Zod 스키마
export const settingSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontSize: z.enum(["default", "large", "larger"]),
  colorBlindMode: z.boolean(),
});

export type SettingFormData = z.infer<typeof settingSchema>;

export const notificationType = pgEnum(
  "notification_type",
  NOTIFICATION_TYPES.map((type) => type.value) as [string, ...string[]],
);

export const notifications = pgTable(
  "notifications",
  {
    notification_id: bigint({ mode: "number" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),
    notification_type: notificationType().notNull(),
    notification_content: text().notNull(),
    profile_id: uuid().references(() => profiles.profile_id, {
      onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
  },
  (table) => [
    // RLS Policy: Users can only view their own notifications
    pgPolicy("select-notifications-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only insert their own notifications
    pgPolicy("insert-notifications-policy", {
      for: "insert",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only update their own notifications
    pgPolicy("update-notifications-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own notifications
    pgPolicy("delete-notifications-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);
