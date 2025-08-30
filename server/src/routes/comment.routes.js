import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { 
    addComment, 
    getComments 
} from '../controllers/comment.controller.js';

const router = Router();
router.use(protect);

router.get('/:cardId', getComments);
router.post('/:cardId', addComment);

export default router;
