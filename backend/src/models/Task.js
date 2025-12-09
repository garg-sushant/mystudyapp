import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    subject: { type: String },
    duration: { type: Number, default: 0 }, // minutes
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

export default mongoose.model('Task', TaskSchema)



