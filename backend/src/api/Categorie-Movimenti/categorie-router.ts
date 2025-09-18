import {Router} from "express";
import { createCategoria,getCategoriaById,getAllCategorie,deleteCategoria,updateCategoria } from "./categorie-controller";

const router= Router();
router.get('/',getAllCategorie);
router.get('/:id',getCategoriaById);
router.post('/',createCategoria);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);
export default router;