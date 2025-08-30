import Workspace from '../models/Workspace.js';
import User from '../models/User.js';

export const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    const ws = await Workspace.create({ name, owner: req.user._id, members: [req.user._id] });

    res.status(201).json(ws);

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const myWorkspaces = async (req, res) => {
  try {
    const list = await Workspace.find({ members: req.user._id });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const ws = await Workspace.findById(id);

    if (!ws) return res.status(404).json({ message: 'Workspace not found' });
    if (ws.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only owner can delete workspace' });
    }

    await Workspace.findByIdAndDelete(id);
    res.json({ message: 'Workspace deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export const addMemberToWorkspace = async (req, res) => {
  try {
    const { email } = req.body;
    const workspaceId = req.params.id;
    console.log(workspaceId);
    
    const userToAdd = await User.findOne({ email });
    
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const ws = await Workspace.findById(workspaceId);
    if (!ws) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    if (!ws?.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Only owner can add members" });
    }


    if (!ws?.members.includes(userToAdd._id)) {
      ws.members.push(userToAdd._id);
      await ws.save();
    }

    res.status(200).json({ message: "Member added successfully", workspace: ws });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getMembers = async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.id)
      .populate('members', 'name email');

    if (!ws) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    if (!ws.members.some(m => m._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this workspace' });
    }

    res.json({ members: ws.members });
  } catch (err) {
    console.error('Error fetching workspace members:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeMember = async (req, res) => {
  const { id, memberId } = req.params;

  try {
    const ws = await Workspace.findById(id);
    if (!ws) return res.status(404).send('Workspace not found');

    const memberIndex = ws.members.findIndex(m => m.toString() === memberId);
    if (memberIndex === -1) return res.status(404).send('Member not found in workspace');

    ws.members.splice(memberIndex, 1);
    await ws.save();

    const updatedWs = await Workspace.findById(id).populate('members', 'name email');
    res.send(updatedWs.members);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
