import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    required: true,
    trim: true,
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  targetItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  },
  details: {
    type: String,
    trim: true,
    default: '',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ actor: 1, createdAt: -1 });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
