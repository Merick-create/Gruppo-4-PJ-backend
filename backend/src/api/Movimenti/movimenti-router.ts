import { Router } from "express";
import { bonifico,exportMovimenti,ricarica,RicercaMov1, RicercaMov2, RicercaMov3 } from "./movimenti-controller";
import { BonificoDto } from "../Bonfico/bonifico-dto";

const router = Router();

router.post("/bonifico", bonifico);
router.post("/ricarica", ricarica);

router.get('/ricerca', RicercaMov1);
router.get('/categoria', RicercaMov2);
router.get('/date', RicercaMov3);
router.get('/export', exportMovimenti);

export default router;  