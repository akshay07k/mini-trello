import Board from '../models/Board.js';
import Activity from '../models/Activity.js';
import Workspace from '../models/Workspace.js';

export const createBoard = async (req, res) => {
  try {
    let { title, visibility = 'private', memberIds = [], workspace } = req.body;

    if (visibility === 'workspace' && workspace) {
      const workspaceData = await Workspace.findById(workspace);
      if (!workspaceData) {
        return res.status(404).json({ message: 'Workspace not found' });
      }
      // Add all members from the workspace
      memberIds = workspaceData.members;
    }

    // Ensure owner is always a member and remove duplicates
    const members = Array.from(new Set([req.user._id.toString(), ...memberIds.map(id => id.toString())]));

    const board = await Board.create({
      title,
      visibility,
      owner: req.user._id,
      members,
      workspace
    });

    await Activity.create({
      boardId: board._id,
      userId: req.user._id,
      action: 'BOARD_CREATED',
      targetId: board._id
    });

    res.status(201).json(board);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const myBoards = async (req, res) => {
  try {
    const { workspace } = req.params;
    const boards = await Board.find({ workspace }).sort('-updatedAt');
    res.json(boards);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getBoard = async (req, res) => {
  try {
    
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    
    const isMember = board.members.some((m) => m.toString() === req.user._id.toString());

    if (!isMember) return res.status(403).json({ message: 'Forbidden' });
    res.json(board);
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const inviteMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    if (board.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Only owner can invite' });

    if (!board.members.some((m) => m.toString() === userId)) {
      board.members.push(userId);
      await board.save();
    }

    res.json(board);
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMembers = async (req, res) => {
  try {
    const bd = await Board.findById(req.params.id)
      .populate('members', 'name email');

    if (!bd) {
      return res.status(404).json({ message: 'board not found' });
    }

    if (!bd.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this board' });
    }

    res.json({ members: bd.members });
  } catch (err) {
    console.error('Error fetching board members:', err);
    res.status(500).json({ message: 'Server error' });
  }
};