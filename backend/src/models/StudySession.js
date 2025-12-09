import mongoose from 'mongoose'

const StudySessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String },
    topic: { type: String },
    duration: { type: Number, required: true }, // minutes
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

export default mongoose.model('StudySession', StudySessionSchema)



