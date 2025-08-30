import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema(
  {
    title: { 
        type: String, 
        required: true 
    },
    board: { 
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

ListSchema.index({ board: 1, position: 1 });

export default mongoose.model('List', ListSchema);
