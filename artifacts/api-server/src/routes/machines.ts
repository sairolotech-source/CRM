import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, machinesTable, adminSettingsTable, visualizationAssetsTable } from "@workspace/db";
import { CreateMachineBody, UpdateMachineBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function getAssetInfo(machineId: number) {
  const assets = await db
    .select({
      assetType: visualizationAssetsTable.assetType,
      count: sql<number>`count(*)::int`,
    })
    .from(visualizationAssetsTable)
    .where(eq(visualizationAssetsTable.machineId, machineId))
    .groupBy(visualizationAssetsTable.assetType);

  let has2d = false;
  let has3d = false;
  let assetCount = 0;
  for (const a of assets) {
    if (a.assetType === "2d") has2d = true;
    if (a.assetType === "3d") has3d = true;
    assetCount += a.count;
  }
  return { has2d, has3d, assetCount };
}

router.get("/machines", async (req, res) => {
  try {
    const category = req.query.category as string | undefined;
    let machines;
    if (category) {
      machines = await db
        .select()
        .from(machinesTable)
        .where(eq(machinesTable.category, category));
    } else {
      machines = await db.select().from(machinesTable);
    }

    const allAssets = await db
      .select({
        machineId: visualizationAssetsTable.machineId,
        assetType: visualizationAssetsTable.assetType,
        count: sql<number>`count(*)::int`,
      })
      .from(visualizationAssetsTable)
      .groupBy(visualizationAssetsTable.machineId, visualizationAssetsTable.assetType);

    const assetMap = new Map<number, { has2d: boolean; has3d: boolean; assetCount: number }>();
    for (const a of allAssets) {
      const entry = assetMap.get(a.machineId) || { has2d: false, has3d: false, assetCount: 0 };
      if (a.assetType === "2d") entry.has2d = true;
      if (a.assetType === "3d") entry.has3d = true;
      entry.assetCount += a.count;
      assetMap.set(a.machineId, entry);
    }

    const result = machines.map((m) => {
      const assetInfo = assetMap.get(m.id) || { has2d: false, has3d: false, assetCount: 0 };
      return { ...m, ...assetInfo };
    });

    res.json(result);
  } catch (err) {
    console.error("Error listing machines:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/machines/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid machine ID" });
      return;
    }
    const [machine] = await db
      .select()
      .from(machinesTable)
      .where(eq(machinesTable.id, id));
    if (!machine) {
      res.status(404).json({ error: "Machine not found" });
      return;
    }
    const assetInfo = await getAssetInfo(id);
    res.json({ ...machine, ...assetInfo });
  } catch (err) {
    console.error("Error getting machine:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/machines", async (req, res) => {
  try {
    const parseResult = CreateMachineBody.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.message });
      return;
    }

    const result = await db.transaction(async (tx) => {
      const [machine] = await tx
        .insert(machinesTable)
        .values(parseResult.data)
        .returning();

      await tx.insert(adminSettingsTable).values({
        machineId: machine.id,
      });

      return machine;
    });

    res.status(201).json({ ...result, has2d: false, has3d: false, assetCount: 0 });
  } catch (err) {
    console.error("Error creating machine:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/machines/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid machine ID" });
      return;
    }
    const parseResult = UpdateMachineBody.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.message });
      return;
    }
    const [machine] = await db
      .update(machinesTable)
      .set({ ...parseResult.data, updatedAt: new Date() })
      .where(eq(machinesTable.id, id))
      .returning();
    if (!machine) {
      res.status(404).json({ error: "Machine not found" });
      return;
    }
    const assetInfo = await getAssetInfo(id);
    res.json({ ...machine, ...assetInfo });
  } catch (err) {
    console.error("Error updating machine:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/machines/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid machine ID" });
      return;
    }
    const parseResult = UpdateMachineBody.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.message });
      return;
    }
    const [machine] = await db
      .update(machinesTable)
      .set({ ...parseResult.data, updatedAt: new Date() })
      .where(eq(machinesTable.id, id))
      .returning();
    if (!machine) {
      res.status(404).json({ error: "Machine not found" });
      return;
    }
    const assetInfo = await getAssetInfo(id);
    res.json({ ...machine, ...assetInfo });
  } catch (err) {
    console.error("Error updating machine:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/machines/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid machine ID" });
      return;
    }
    const [machine] = await db
      .delete(machinesTable)
      .where(eq(machinesTable.id, id))
      .returning();
    if (!machine) {
      res.status(404).json({ error: "Machine not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting machine:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
