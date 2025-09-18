import {Router}from "express";
import { createUser, updateUser, deleteUser } from "./conto-corrente-controller";
const router= Router();

router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;