import Activity from '../models/Activity.js';

export const getBoardActivity = async (req, res) => {
  try {
    const { boardId } = req.params;
    const items = await Activity.find({ boardId }).sort('-timestamp').limit(20);
    
    res.json(items);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
