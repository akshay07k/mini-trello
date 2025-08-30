import Board from '../models/Board.js';

export const requireBoardMember = async (req, res, next) => {
    
  const boardId = req.params.boardId || req.body.boardId || req.query.boardId;
  if (!boardId) return res.status(400).json({ message: 'boardId required' });


  const board = await Board.findById(boardId);
  if (!board) return res.status(404).json({ message: 'Board not found' });

  const isMember = board.members.some((m) => m.toString() === req.user._id.toString());
  if (!isMember) return res.status(403).json({ message: 'Forbidden: not a board member' });

  req.board = board;
  next();

};
