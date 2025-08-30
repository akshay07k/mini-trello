import List from '../models/List.js';
import { nextPosition, between } from '../utils/position.js';
import Activity from '../models/Activity.js';

export const createList = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    const last = await List.find({ board: boardId }).sort('-position').limit(1);

    const position = nextPosition(last[0]?.position);
    const list = await List.create({ title, board: boardId, position });

    await Activity.create({ boardId, userId: req.user._id, action: 'LIST_CREATED', targetId: list._id });

    res.status(201).json(list);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const renameList = async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.listId, { title: req.body.title }, { new: true });
    
    if (!list) return res.status(404).json({ message: 'List not found' });
    
    res.json(list);
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const reorderList = async (req, res) => {
  try {
    const { beforeId, afterId } = req.body;
    const list = await List.findById(req.params.listId);
    if (!list) return res.status(404).json({ message: 'List not found' });
  
    const before = beforeId ? await List.findById(beforeId) : null;
    const after = afterId ? await List.findById(afterId) : null;
    const newPos = between(before?.position ?? null, after?.position ?? null);
  
    list.position = newPos;
    await list.save();
    
    res.json(list);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getLists = async (req, res) => {
  try {
    const lists = await List.find({ board: req.params.boardId }).sort('position');
    
    res.json(lists);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
