import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['Lost', 'Found'],
    required: [true, 'Type is required'],
  },
  category: {
    type: String,
    enum: ['ID Card', 'Electronics', 'Books', 'Clothing', 'Keys', 'Wallet', 'Bag', 'Jewelry', 'Others'],
    required: [true, 'Category is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  building: {
    type: String,
    trim: true,
  },
  floor: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  imageData: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Open', 'Claimed', 'Returned', 'Closed'],
    default: 'Open',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contactEmail: {
    type: String,
    trim: true,
  },
  contactPhone: {
    type: String,
    trim: true,
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  claimedAt: {
    type: Date,
  },
  qrCode: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  tags: [{
    type: String,
    trim: true,
  }],
  reward: {
    type: String,
    trim: true,
  },
  identifyingFeatures: {
    type: String,
    trim: true,
  },
  claims: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  foundReports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    foundAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt before saving
itemSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search optimization
itemSchema.index({ title: 'text', description: 'text', location: 'text', tags: 'text' });
itemSchema.index({ type: 1, status: 1, createdAt: -1 });

export default mongoose.models.Item || mongoose.model('Item', itemSchema);
