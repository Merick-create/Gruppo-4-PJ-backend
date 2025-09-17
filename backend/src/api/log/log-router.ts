import { Router } from "express";
import { add } from "./log-controller";

const router = Router();

router.post('/addLog', add);

export default router;
