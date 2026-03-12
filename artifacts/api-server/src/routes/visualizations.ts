import { Router, type IRouter } from "express";
import multer from "multer";
import { eq, and } from "drizzle-orm";
import { db, machineVisualizationsTable, machinesTable } from "@workspace/db";
import { ObjectStorageService } from "../lib/objectStorage";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

const ALLOWED_2D_MIMES = [
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/webp",
];
const ALLOWED_3D_EXTENSIONS = [".glb", ".gltf", ".obj"];

const router: IRouter = Router();

router.get("/machines/:machineId/visualizations", async (req, res) => {
  try {
    const machineId = parseInt(req.params.machineId, 10);
    if (isNaN(machineId)) {
      res.status(400).json({ error: "Invalid machine ID" });
      return;
    }
    const visualizations = await db
      .select()
      .from(machineVisualizationsTable)
      .where(eq(machineVisualizationsTable.machineId, machineId));
    res.json(visualizations);
  } catch (err) {
    console.error("Error listing visualizations:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post(
  "/machines/:machineId/visualizations",
  upload.single("file"),
  async (req, res) => {
    try {
      const rawMachineId = req.params.machineId;
      const machineId = parseInt(String(rawMachineId), 10);
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

      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "No file provided" });
        return;
      }

      const fileType = req.body.fileType as string;
      if (!fileType || !["2d", "3d"].includes(fileType)) {
        res.status(400).json({ error: "fileType must be '2d' or '3d'" });
        return;
      }

      if (fileType === "2d" && !ALLOWED_2D_MIMES.includes(file.mimetype)) {
        res.status(400).json({
          error: "Invalid 2D file type. Allowed: SVG, PNG, JPEG, WebP",
        });
        return;
      }

      if (fileType === "3d") {
        const ext = "." + (file.originalname.split(".").pop() || "").toLowerCase();
        if (!ALLOWED_3D_EXTENSIONS.includes(ext)) {
          res.status(400).json({
            error: "Invalid 3D file type. Allowed: GLB, GLTF, OBJ",
          });
          return;
        }
      }

      const storageService = new ObjectStorageService();
      const uploadUrl = await storageService.getObjectEntityUploadURL();

      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.mimetype },
        body: file.buffer,
      });

      if (!response.ok) {
        res.status(500).json({ error: "Failed to upload file to storage" });
        return;
      }

      const objectPath = storageService.normalizeObjectEntityPath(uploadUrl);

      const fileUrl = `/api/storage${objectPath}`;

      const [visualization] = await db
        .insert(machineVisualizationsTable)
        .values({
          machineId,
          fileType,
          fileUrl,
          objectPath,
          fileName: file.originalname,
          mimeType: file.mimetype,
          label: req.body.label || null,
        })
        .returning();

      res.status(201).json(visualization);
    } catch (err) {
      console.error("Error uploading visualization:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

router.delete(
  "/machines/:machineId/visualizations/:vizId",
  async (req, res) => {
    try {
      const machineId = parseInt(req.params.machineId, 10);
      const vizId = parseInt(req.params.vizId, 10);
      if (isNaN(machineId) || isNaN(vizId)) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }
      const [viz] = await db
        .delete(machineVisualizationsTable)
        .where(
          and(
            eq(machineVisualizationsTable.id, vizId),
            eq(machineVisualizationsTable.machineId, machineId),
          ),
        )
        .returning();
      if (!viz) {
        res.status(404).json({ error: "Visualization not found" });
        return;
      }

      if (viz.objectPath) {
        try {
          const storageService = new ObjectStorageService();
          const file = await storageService.getObjectEntityFile(viz.objectPath);
          await file.delete();
        } catch (storageErr) {
          console.error("Warning: failed to delete storage object:", storageErr);
        }
      }

      res.status(204).send();
    } catch (err) {
      console.error("Error deleting visualization:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
