import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { 
    createCard, 
    updateCard, 
    moveCard, 
    getCardsInBoard, 
    searchCards 
} from '../controllers/card.controller.js';

const router = Router();
router.use(protect);

router.get('/board/:boardId', getCardsInBoard);
router.get('/board/:boardId/search', searchCards);
router.post('/board/:boardId/list/:listId', createCard);
router.patch('/:cardId', updateCard);
router.post('/:cardId/move', moveCard);

export default router;
