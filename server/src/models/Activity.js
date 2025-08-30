import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  boardId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Board', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  action: { 
    type: String, 
    required: true 
  },
  targetId: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  details: String,
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

ActivitySchema.index({ boardId: 1, timestamp: -1 });

export default mongoose.model('Activity', ActivitySchema);
