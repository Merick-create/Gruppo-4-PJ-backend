import {Router} from 'express';
import movimentiRouter from './Movimenti/movimenti-router';
const router = Router();
router.use('/movimenti', movimentiRouter);
import authRouter from './auth/auth.router';
const router = Router();
router.use(authRouter);
export default router;