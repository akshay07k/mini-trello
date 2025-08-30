import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { 
    createWorkspace, 
    myWorkspaces, 
    deleteWorkspace,
    addMemberToWorkspace,
    removeMember,
    getMembers
 } from '../controllers/workspace.controller.js';

const router = Router();
router.use(protect);
router.post('/', createWorkspace);
router.get('/', myWorkspaces);
router.get('/:id/members', getMembers)
router.delete('/:id', deleteWorkspace); 
router.post("/:id/add-member", addMemberToWorkspace);
router.delete('/:id/remove-member/:memberId', removeMember);

export default router;
