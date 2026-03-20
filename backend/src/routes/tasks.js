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
  try { // ✅ added error handling
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id })
    if (!task) return res.status(404).json({ error: 'Task not found' })

    const updates = req.body || {}

    for (const key of Object.keys(updates)) {
      task[key] = updates[key]
    }

    // ❗ FIX: store previous state before update
    const wasCompleted = task.completed

    if (typeof updates.completed === 'boolean') {
      if (updates.completed && !wasCompleted) {
        task.completedAt = new Date()
      }
      if (!updates.completed) {
        task.completedAt = undefined
      }
    }

    await task.save()
    res.json(task)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try { // ✅ added error handling
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id })
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

export default router