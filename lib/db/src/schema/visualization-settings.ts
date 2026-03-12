import { pgTable, serial, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const visualizationSettingsTable = pgTable("visualization_settings", {
  id: serial("id").primaryKey(),
  enable2dView: boolean("enable_2d_view").default(true).notNull(),
  enable3dView: boolean("enable_3d_view").default(true).notNull(),
  enableAnimation: boolean("enable_animation").default(true).notNull(),
  enablePartHighlight: boolean("enable_part_highlight").default(true).notNull(),
  enableTechnicalDrawingDownload: boolean("enable_technical_drawing_download").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVisualizationSettingsSchema = createInsertSchema(visualizationSettingsTable).omit({ id: true, updatedAt: true });
export type InsertVisualizationSettings = z.infer<typeof insertVisualizationSettingsSchema>;
export type VisualizationSettings = typeof visualizationSettingsTable.$inferSelect;
