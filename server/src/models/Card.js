import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema(
  {
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: String,
    labels: [String],
    assignees: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    dueDate: Date,
    listId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'List', 
        required: true 
    },
    boardId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Board', 
        required: true 
    },
    position: { 
        type: Number, 
        required: true
    }
  },
  { 
    timestamps: true 
  }
);

CardSchema.index({ boardId: 1, listId: 1, position: 1 });
CardSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Card', CardSchema);
