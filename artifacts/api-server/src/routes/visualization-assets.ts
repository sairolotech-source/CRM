import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { visualizationAssetsTable, machinesTable } from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import {
  ListMachineAssetsParams,
  UploadMachineAssetParams,
  DeleteMachineAssetParams,
} from "@workspace/api-zod";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_2D_EXTENSIONS = [".svg", ".png"];
const ALLOWED_3D_EXTENSIONS = [".glb", ".gltf", ".obj"];
const MAX_2D_SIZE = 10 * 1024 * 1024;
const MAX_3D_SIZE = 50 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_3D_SIZE },
});

const router: IRouter = Router();

router.get("/machines/:machineId/assets", async (req, res) => {
  const { machineId } = ListMachineAssetsParams.parse(req.params);
  const assets = await db
    .select()
    .from(visualizationAssetsTable)
    .where(eq(visualizationAssetsTable.machineId, machineId))
    .orderBy(visualizationAssetsTable.createdAt);

  res.json(assets);
});

router.post("/machines/:machineId/assets/upload", upload.single("file"), async (req, res) => {
  const { machineId } = UploadMachineAssetParams.parse(req.params);

  const [machine] = await db.select().from(machinesTable).where(eq(machinesTable.id, machineId));
  if (!machine) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(404).json({ message: "Machine not found" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  const assetType = req.body.assetType as string;
  if (!assetType || !["2d", "3d"].includes(assetType)) {
    fs.unlinkSync(req.file.path);
    res.status(400).json({ message: "assetType must be '2d' or '3d'" });
    return;
  }

  const ext = path.extname(req.file.originalname).toLowerCase();
  const allowedExts = assetType === "2d" ? ALLOWED_2D_EXTENSIONS : ALLOWED_3D_EXTENSIONS;
  if (!allowedExts.includes(ext)) {
    fs.unlinkSync(req.file.path);
    res.status(400).json({
      message: `Invalid file type. Allowed: ${allowedExts.join(", ")}`,
    });
    return;
  }

  const maxSize = assetType === "2d" ? MAX_2D_SIZE : MAX_3D_SIZE;
  if (req.file.size > maxSize) {
    fs.unlinkSync(req.file.path);
    res.status(400).json({
      message: `File too large. Max size: ${maxSize / (1024 * 1024)}MB`,
    });
    return;
  }

  const [asset] = await db
    .insert(visualizationAssetsTable)
    .values({
      machineId,
      assetType,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      displayName: req.body.displayName || req.file.originalname,
      filePath: `/api/uploads/${req.file.filename}`,
    })
    .returning();

  res.status(201).json(asset);
});

router.delete("/machines/:machineId/assets/:assetId", async (req, res) => {
  const { machineId, assetId } = DeleteMachineAssetParams.parse(req.params);

  const [asset] = await db
    .select()
    .from(visualizationAssetsTable)
    .where(
      and(
        eq(visualizationAssetsTable.id, assetId),
        eq(visualizationAssetsTable.machineId, machineId)
      )
    );

  if (!asset) {
    res.status(404).json({ message: "Asset not found" });
    return;
  }

  const filename = asset.filePath.split("/").pop();
  if (filename) {
    const fullPath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }

  await db.delete(visualizationAssetsTable).where(eq(visualizationAssetsTable.id, assetId));
  res.status(204).send();
});

export default router;
