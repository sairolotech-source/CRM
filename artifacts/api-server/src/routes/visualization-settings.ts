import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { visualizationSettingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import {
  UpdateVisualizationSettingsBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateSettings() {
  const [existing] = await db.select().from(visualizationSettingsTable);
  if (existing) return existing;

  const [created] = await db
    .insert(visualizationSettingsTable)
    .values({
      enable2dView: true,
      enable3dView: true,
      enableAnimation: true,
      enablePartHighlight: true,
      enableTechnicalDrawingDownload: true,
    })
    .returning();
  return created;
}

router.get("/visualization-settings", async (_req, res) => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

router.put("/visualization-settings", async (req, res) => {
  const body = UpdateVisualizationSettingsBody.parse(req.body);
  const settings = await getOrCreateSettings();

  const [updated] = await db
    .update(visualizationSettingsTable)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(visualizationSettingsTable.id, settings.id))
    .returning();

  res.json(updated);
});

export default router;
