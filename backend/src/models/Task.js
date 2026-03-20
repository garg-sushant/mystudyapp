import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true }, // ✅ trim added
    description: { type: String },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    subject: { type: String },
    duration: { type: Number, default: 0, min: 0 } // ✅ added min
  },
  { timestamps: true } // ❗ already includes createdAt
)

export default mongoose.model('Task', TaskSchema)