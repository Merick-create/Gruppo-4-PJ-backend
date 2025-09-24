import { Router } from "express";
import { bonifico,exportMovimenti,ricarica,RicercaMov1, RicercaMov2, RicercaMov3 } from "./movimenti-controller";
import { BonificoDto } from "../Bonfico/bonifico-dto";
import { isAuthenticated } from "../../lib/auth/auth.middleware";
import { getSaldo } from "./movimenti-controller";

const router = Router();

router.post("/bonifico", isAuthenticated, bonifico);
router.post("/ricarica", isAuthenticated,ricarica);
router.get('/ricerca',isAuthenticated, RicercaMov1);
router.get('/categoria',isAuthenticated, RicercaMov2);
router.get('/date',isAuthenticated, RicercaMov3);
router.get('/export',isAuthenticated, exportMovimenti);
router.get('/saldo/:iban',isAuthenticated, getSaldo);

export default router;  