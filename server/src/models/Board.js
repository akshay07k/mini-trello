import mongoose from 'mongoose';

const BoardSchema = new mongoose.Schema(
  {
    title: { 
        type: String, 
        required: true 
    },
    visibility: { 
        type: String, 
        enum: ['private', 'workspace'], 
        default: 'private' 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    workspace: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Workspace' 
    }
  },
  { 
    timestamps: true 
  }
);

BoardSchema.index({ workspace: 1 });
BoardSchema.index({ members: 1 });

export default mongoose.model('Board', BoardSchema);
