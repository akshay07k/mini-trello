import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    cardId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Card', 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    }
  },
  { 
    timestamps: true 
  }
);

CommentSchema.index({ cardId: 1, createdAt: -1 });

export default mongoose.model('Comment', CommentSchema);
