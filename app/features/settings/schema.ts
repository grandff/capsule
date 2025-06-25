import {
  bigint,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { NOTIFICATION_TYPES } from "~/constants";

import { profiles } from "../users/schema";

export const notificationType = pgEnum(
  "notification_type",
  NOTIFICATION_TYPES.map((type) => type.value) as [string, ...string[]],
);

export const notifications = pgTable("notifications", {
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
});
