import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, avatarUrl } = req.body;
  
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
  
  
    const user = await User.create({ name, email, password, avatarUrl });
  
    
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token: generateToken(user._id)
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });


    res.json({
      user: { id: user._id, name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
