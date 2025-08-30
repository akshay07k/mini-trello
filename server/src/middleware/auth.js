import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';

  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;
  if (!token) return res.status(401).json({ message: 'No token' });


  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user;
    next();
    
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
