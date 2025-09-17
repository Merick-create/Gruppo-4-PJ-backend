import { Router } from "express";
import { bonifico,ricarica } from "./movimenti-controller";
import { BonificoDto } from "../Bonfico/bonifico-dto";
const router = Router();
router.post("/bonifico", bonifico);
router.post("/ricarica", ricarica);

export default router;  