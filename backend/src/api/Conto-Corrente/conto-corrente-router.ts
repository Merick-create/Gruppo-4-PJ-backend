import {Router}from "express";
import { getCognome, getDataApertura, getEmail, getFullProfile, getIBAN, getNome } from "./conto-corrente-controller";
const router= Router();

router.get("/:id/email",getEmail);
router.get("/:id/nome",getNome);
router.get("/:id/cognome",getCognome);
router.get("/:id/dataApertura",getDataApertura);
router.get("/:id/iban",getIBAN);
router.get("/:id/fullprofile",getFullProfile);


export default router;