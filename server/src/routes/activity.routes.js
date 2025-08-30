import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getBoardActivity } from '../controllers/activity.controller.js';

const router = Router();
router.use(protect);

router.get('/:boardId', getBoardActivity);

export default router;
