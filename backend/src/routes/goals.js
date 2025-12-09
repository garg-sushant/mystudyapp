import express from 'express'
import Goal from '../models/Goal.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user.id })
    res.status(201).json(goal)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(goals)
})

router.put('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )
    if (!goal) return res.status(404).json({ error: 'Goal not found' })
    res.json(goal)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  if (!goal) return res.status(404).json({ error: 'Goal not found' })
  res.json({ success: true })
})

export default router



