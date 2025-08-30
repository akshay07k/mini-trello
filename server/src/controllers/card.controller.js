import Card from '../models/Card.js';
import List from '../models/List.js';
import Activity from '../models/Activity.js';
import { nextPosition, between } from '../utils/position.js';
import { io } from '../socket/index.js';

export const createCard = async (req, res) => {
  try {
    const { boardId, listId } = req.params;
    const { title, description, labels = [], assignees = [], dueDate } = req.body;

    const last = await Card.find({ listId }).sort('-position').limit(1);
    const position = nextPosition(last[0]?.position);

    const card = await Card.create({
      title, description, labels, assignees, dueDate, listId, boardId, position
    });

    await Activity.create({ boardId, userId: req.user._id, action: 'CARD_CREATED', targetId: card._id });
    io().to(boardId.toString()).emit('card:created', { card });

    res.status(201).json(card);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.cardId, req.body, { new: true });

    if (!card) return res.status(404).json({ message: 'Card not found' });
    
    await Activity.create({ boardId: card.boardId, userId: req.user._id, action: 'CARD_UPDATED', targetId: card._id });
    
    io().to(card.boardId.toString()).emit('card:updated', { card });

    res.json(card);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export const moveCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { toListId, beforeCardId, afterCardId } = req.body;
    
    const card = await Card.findById(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });
  
    const before = beforeCardId ? await Card.findById(beforeCardId) : null;
    const after = afterCardId ? await Card.findById(afterCardId) : null;
  
    card.position = between(before?.position ?? null, after?.position ?? null);
    if (toListId) card.listId = toListId;
    await card.save();
  
    await Activity.create({
      boardId: card.boardId,
      userId: req.user._id,
      action: 'CARD_MOVED',
      targetId: card._id,
      details: JSON.stringify({ toListId })
    });
  
    io().to(card.boardId.toString()).emit('card:moved', {
      cardId: card._id, toListId: card.listId, position: card.position
    });
  
    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getCardsInBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const cards = await Card.find({ boardId }).sort('position');

    res.json(cards);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const searchCards = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { text, label, assignee } = req.query;
    const filter = { boardId };

    if (text) filter.$text = { $search: text };
    if (label) filter.labels = label;
    if (assignee) filter.assignees = assignee;

    const cards = await Card.find(filter).limit(100);

    res.json(cards);
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
