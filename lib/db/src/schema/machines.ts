import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const machinesTable = pgTable("machines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  category: text("category").notNull(),
  capacity: text("capacity"),
  power: text("power"),
  speed: text("speed"),
  price: text("price"),
  description: text("description"),
  weight: text("weight"),
  dimensions: text("dimensions"),
  rollers: text("rollers"),
  color: text("color"),
  detailedDescription: text("detailed_description"),
  warranty: text("warranty"),
  tags: jsonb("tags").$type<string[]>().default([]),
  specs: jsonb("specs").$type<{ label: string; value: string }[]>().default([]),
  features: jsonb("features").$type<string[]>().default([]),
  applications: jsonb("applications").$type<string[]>().default([]),
  accessories: jsonb("accessories").$type<string[]>().default([]),
  images: jsonb("images").$type<{ id: string; url: string; label: string; type: string }[]>().default([]),
  videos: jsonb("videos").$type<{ id: string; title: string; duration: string; thumbnail: string; youtubeId: string; type: string }[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMachineSchema = createInsertSchema(machinesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMachine = z.infer<typeof insertMachineSchema>;
export type Machine = typeof machinesTable.$inferSelect;
