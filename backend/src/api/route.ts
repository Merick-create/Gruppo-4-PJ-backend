import {Router} from 'express';
import movimentiRouter from './Movimenti/movimenti-router';
import authRouter from './auth/auth.router';
import contoCorrenteRouter from './Conto-Corrente/conto-corrente-router';
import categorieRouter from './Categorie-Movimenti/categorie-router';

const router = Router();
router.use('/movimenti', movimentiRouter);
router.use('/categorie', categorieRouter);
router.use(authRouter);
export default router;