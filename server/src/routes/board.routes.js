import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { 
    createBoard, 
    myBoards, 
    getBoard, 
    inviteMember, 
    getMembers 
} from '../controllers/board.controller.js';

const router = Router();
router.use(protect);
router.post('/', createBoard);
router.get('/w/:workspace', myBoards);
router.get('/:boardId', getBoard);
router.get("/:id/members", getMembers)
router.post('/:boardId/invite', inviteMember);

export default router;
