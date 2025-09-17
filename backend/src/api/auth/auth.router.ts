import { Router } from "express";
import { add, login } from "./auth.controller";

const router = Router();

router.post('/register', add);
router.post('/login', login);

export default router;
