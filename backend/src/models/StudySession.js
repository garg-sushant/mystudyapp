import mongoose from 'mongoose'

const StudySessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String },
    topic: { type: String },
    duration: { type: Number, required: true, min: 0 }, // ✅ added min
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date } // ❗ FIX: removed default
  },
  { timestamps: true }
)

export default mongoose.model('StudySession', StudySessionSchema)