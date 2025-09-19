import { Router } from "express";
import { add, confirm, login, updPssw } from "./auth.controller";
import { validate } from "../../lib/validation.middleware";
import { AddUserDTO } from "./auth.dto";
import { isAuthenticated } from "../../lib/auth/auth.middleware";

const router = Router();

router.post('/register', validate(AddUserDTO), add);
router.post('/login', login);
router.post('/updatePassword', isAuthenticated, updPssw);
router.post('/confirmEmail', confirm);

export default router;
