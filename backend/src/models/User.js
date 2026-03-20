import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // ✅ trim added
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    streak: { type: Number, default: 0 },
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

// ❗ IMPORTANT: never return password in queries
UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password
    return ret
  }
})

export default mongoose.model('User', UserSchema)