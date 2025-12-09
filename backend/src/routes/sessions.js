import express from 'express'
import StudySession from '../models/StudySession.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const session = await StudySession.create({ ...req.body, userId: req.user.id })
    res.status(201).json(session)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  const sessions = await StudySession.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(sessions)
})

export default router



