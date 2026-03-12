import { pgTable, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { machinesTable } from "./machines";

export const adminSettingsTable = pgTable("admin_settings", {
  id: serial("id").primaryKey(),
  machineId: integer("machine_id")
    .notNull()
    .references(() => machinesTable.id, { onDelete: "cascade" })
    .unique(),
  enable2dView: boolean("enable_2d_view").default(true).notNull(),
  enable3dView: boolean("enable_3d_view").default(true).notNull(),
  enableAnimation: boolean("enable_animation").default(true).notNull(),
  enablePartHighlight: boolean("enable_part_highlight").default(true).notNull(),
  enableDrawingDownload: boolean("enable_drawing_download").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdminSettingsSchema = createInsertSchema(adminSettingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdminSettings = z.infer<typeof insertAdminSettingsSchema>;
export type AdminSettings = typeof adminSettingsTable.$inferSelect;
