import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 }
    ,
    // Streak tracking: number of consecutive days the user completed all assigned tasks
    streak: { type: Number, default: 0 },
    // Date when streak was last processed (stored as midnight local server time)
    lastStreakProcessed: { type: Date }
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', UserSchema)




