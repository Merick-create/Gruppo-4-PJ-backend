import { Router } from "express";
import { add, login } from "./auth.controller";
import { validate } from "../../lib/validation.middleware";
import { AddUserDTO } from "./auth.dto";

const router = Router();

router.post('/register', validate(AddUserDTO), add);
router.post('/login', login);

export default router;
