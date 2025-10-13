import { Router } from 'express';
import githubRouter from './github.routes';

const router = Router();
router.use('/github', githubRouter);

export default router;