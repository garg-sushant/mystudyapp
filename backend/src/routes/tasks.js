import express from 'express'
import Task from '../models/Task.js'

const router = express.Router()

// Create
router.post('/', async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.id })
    res.status(201).json(task)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Read all
router.get('/', async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 })
  res.json(tasks)
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    )
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json({ success: true })
})

export default router



