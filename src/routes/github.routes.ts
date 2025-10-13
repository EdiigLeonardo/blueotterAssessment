import { Router } from 'express';
import { GithubController } from '../controllers/github.controller';

const router = Router();
const controller = new GithubController();

router.post('/sync/:user', controller.sync);
router.post('/sync/:user/:repo', controller.syncRepo);
router.get('/:user/repos', controller.listUserRepos);
router.get('/search', controller.searchRepos);
router.get('/stats', controller.stats);

export default router;