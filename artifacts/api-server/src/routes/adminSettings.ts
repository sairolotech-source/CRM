import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, adminSettingsTable, machinesTable } from "@workspace/db";
import { UpdateAdminSettingsBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/machines/:machineId/admin-settings", async (req, res) => {
  try {
    const machineId = parseInt(req.params.machineId, 10);
    if (isNaN(machineId)) {
      res.status(400).json({ error: "Invalid machine ID" });
      return;
    }

    let [settings] = await db
      .select()
      .from(adminSettingsTable)
      .where(eq(adminSettingsTable.machineId, machineId));

    if (!settings) {
      const [machine] = await db
        .select()
        .from(machinesTable)
        .where(eq(machinesTable.id, machineId));
      if (!machine) {
        res.status(404).json({ error: "Machine not found" });
        return;
      }
      [settings] = await db
        .insert(adminSettingsTable)
        .values({ machineId })
        .returning();
    }

    res.json(settings);
  } catch (err) {
    console.error("Error getting admin settings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/machines/:machineId/admin-settings", async (req, res) => {
  try {
    const machineId = parseInt(req.params.machineId, 10);
    if (isNaN(machineId)) {
      res.status(400).json({ error: "Invalid machine ID" });
      return;
    }

    const parseResult = UpdateAdminSettingsBody.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.message });
      return;
    }

    const existing = await db
      .select()
      .from(adminSettingsTable)
      .where(eq(adminSettingsTable.machineId, machineId));

    let settings;
    if (existing.length === 0) {
      const [machine] = await db
        .select()
        .from(machinesTable)
        .where(eq(machinesTable.id, machineId));
      if (!machine) {
        res.status(404).json({ error: "Machine not found" });
        return;
      }
      [settings] = await db
        .insert(adminSettingsTable)
        .values({ machineId, ...parseResult.data })
        .returning();
    } else {
      [settings] = await db
        .update(adminSettingsTable)
        .set({ ...parseResult.data, updatedAt: new Date() })
        .where(eq(adminSettingsTable.machineId, machineId))
        .returning();
    }

    res.json(settings);
  } catch (err) {
    console.error("Error updating admin settings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
