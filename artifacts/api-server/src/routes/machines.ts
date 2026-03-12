import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, machinesTable, adminSettingsTable } from "@workspace/db";
import { CreateMachineBody, UpdateMachineBody } from "@workspace/api-zod";

const router: IRouter = Router();

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
    res.json(machines);
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
    res.json(machine);
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

    res.status(201).json(result);
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
    res.json(machine);
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
