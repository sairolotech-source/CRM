import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { machinesTable } from "./machines";

export const visualizationAssetsTable = pgTable("visualization_assets", {
  id: serial("id").primaryKey(),
  machineId: integer("machine_id").notNull().references(() => machinesTable.id, { onDelete: "cascade" }),
  assetType: text("asset_type").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  displayName: text("display_name"),
  filePath: text("file_path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVisualizationAssetSchema = createInsertSchema(visualizationAssetsTable).omit({ id: true, createdAt: true });
export type InsertVisualizationAsset = z.infer<typeof insertVisualizationAssetSchema>;
export type VisualizationAsset = typeof visualizationAssetsTable.$inferSelect;
