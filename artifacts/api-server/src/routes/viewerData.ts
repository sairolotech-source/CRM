import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  machinesTable,
  machineVisualizationsTable,
  adminSettingsTable,
} from "@workspace/db";

const router: IRouter = Router();

router.get("/machines/:machineId/viewer-data", async (req, res) => {
  try {
    const machineId = parseInt(req.params.machineId, 10);
    if (isNaN(machineId)) {
      res.status(400).json({ error: "Invalid machine ID" });
      return;
    }

    const [machine] = await db
      .select()
      .from(machinesTable)
      .where(eq(machinesTable.id, machineId));

    if (!machine) {
      res.status(404).json({ error: "Machine not found" });
      return;
    }

    let allVisualizations = await db
      .select()
      .from(machineVisualizationsTable)
      .where(eq(machineVisualizationsTable.machineId, machineId));

    let [settings] = await db
      .select()
      .from(adminSettingsTable)
      .where(eq(adminSettingsTable.machineId, machineId));

    if (!settings) {
      [settings] = await db
        .insert(adminSettingsTable)
        .values({ machineId })
        .returning();
    }

    const filteredVisualizations = allVisualizations.filter((viz) => {
      if (viz.fileType === "2d" && !settings.enable2dView) return false;
      if (viz.fileType === "3d" && !settings.enable3dView) return false;
      return true;
    });

    res.json({
      machine,
      visualizations: filteredVisualizations,
      settings,
    });
  } catch (err) {
    console.error("Error getting viewer data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
