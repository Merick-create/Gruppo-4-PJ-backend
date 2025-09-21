import {Router} from "express";
import { createCategoria,getCategoriaById,getAllCategorie,deleteCategoria,updateCategoria,getCategoriaByNome } from "./categorie-controller";

const router= Router();
router.get('/',getAllCategorie);
router.get('/:id',getCategoriaById);
router.post('/',createCategoria);
router.put('/:id', updateCategoria);
router.delete('/:id', deleteCategoria);
router.get("/nome/:nome", getCategoriaByNome);
export default router;