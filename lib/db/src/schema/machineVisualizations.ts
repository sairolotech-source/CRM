import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { machinesTable } from "./machines";

export const machineVisualizationsTable = pgTable("machine_visualizations", {
  id: serial("id").primaryKey(),
  machineId: integer("machine_id")
    .notNull()
    .references(() => machinesTable.id, { onDelete: "cascade" }),
  fileType: text("file_type").notNull(),
  fileUrl: text("file_url").notNull(),
  objectPath: text("object_path"),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type"),
  label: text("label"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMachineVisualizationSchema = createInsertSchema(machineVisualizationsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMachineVisualization = z.infer<typeof insertMachineVisualizationSchema>;
export type MachineVisualization = typeof machineVisualizationsTable.$inferSelect;
