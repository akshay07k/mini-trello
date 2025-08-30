import Comment from '../models/Comment.js';
import Card from '../models/Card.js';
import Activity from '../models/Activity.js';
import { io } from '../socket/index.js';

export const addComment = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { text } = req.body;
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    const comment = await Comment.create({ cardId, author: req.user._id, text });
  
    await Activity.create({
      boardId: card.boardId, userId: req.user._id, action: 'COMMENT_ADDED', targetId: comment._id
    });
  
    const out = await Comment.findById(comment._id).populate('author', 'name email avatarUrl');
    io().to(card.boardId.toString()).emit('comment:created', { comment: out, cardId });
  
    res.status(201).json(out);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getComments = async (req, res) => {
  try {
    const { cardId } = req.params;
    
    const comments = await Comment.find({ cardId }).sort('-createdAt')
      .limit(50)
      .populate('author', 'name email avatarUrl');

    res.json(comments);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

