import {Router} from 'express';
import movimentiRouter from './Movimenti/movimenti-router';
import authRouter from './auth/auth.router';
import logRouter from './log/log-router';

const router = Router();
router.use('/movimenti', movimentiRouter);
router.use(authRouter);
router.use(logRouter);
export default router;