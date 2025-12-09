import mongoose from 'mongoose'

const GoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    targetProgress: { type: Number, default: 100, min: 1, max: 100 },
    completed: { type: Boolean, default: false },
    subject: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

export default mongoose.model('Goal', GoalSchema)



