import {Router} from 'express';
import movimentiRouter from './Movimenti/movimenti-router';
const router = Router();
router.use('/movimenti', movimentiRouter);
export default router;