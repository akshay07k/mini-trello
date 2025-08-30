import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { 
    createList, 
    renameList, 
    reorderList, 
    getLists 
} from '../controllers/list.controller.js';

const router = Router();
router.use(protect);

router.get('/board/:boardId', getLists);
router.post('/board/:boardId', createList);
router.patch('/:listId', renameList);
router.patch('/:listId/reorder', reorderList);

export default router;
