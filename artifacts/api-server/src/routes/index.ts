import { Router, type IRouter } from "express";
import healthRouter from "./health";
import storageRouter from "./storage";
import machinesRouter from "./machines";
import visualizationsRouter from "./visualizations";
import adminSettingsRouter from "./adminSettings";
import viewerDataRouter from "./viewerData";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(machinesRouter);
router.use(visualizationsRouter);
router.use(adminSettingsRouter);
router.use(viewerDataRouter);

export default router;
