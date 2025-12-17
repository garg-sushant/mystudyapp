import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

const signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'devsecret'
  return jwt.sign({ id }, secret, { expiresIn: '7d' })
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ error: 'Email already registered' })
    const user = await User.create({ name, email, password })
    const token = signToken(user._id)
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, streak: user.streak || 0, lastStreakProcessed: user.lastStreakProcessed } })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })
    const ok = await user.comparePassword(password)
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' })
    const token = signToken(user._id)
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, streak: user.streak || 0, lastStreakProcessed: user.lastStreakProcessed } })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router




