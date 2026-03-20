import express from 'express'
import Task from '../models/Task.js'
import User from '../models/User.js'

const router = express.Router()

export async function processStreakForUser(userId, { mode = 'yesterday', TaskModel = Task, UserModel = User } = {}) {
  if (!userId) throw new Error('Missing userId')

  const user = await UserModel.findById(userId)
  if (!user) throw new Error('User not found')

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  let targetDayStart
  if (mode === 'today') {
    targetDayStart = todayStart
  } else {
    targetDayStart = new Date(todayStart)
    targetDayStart.setDate(targetDayStart.getDate() - 1)
  }

  let processFrom = new Date(targetDayStart)
  if (user.lastStreakProcessed) {
    const last = new Date(user.lastStreakProcessed)
    const nextDay = new Date(last.getFullYear(), last.getMonth(), last.getDate())
    nextDay.setDate(nextDay.getDate() + 1)

    if (nextDay <= targetDayStart) processFrom = nextDay
    else {
      if (mode !== 'today') return user.streak || 0
    }
  }

  let streakCount = 0
  let inspectDay = new Date(targetDayStart)

  while (true) {
    const dayStartIter = new Date(inspectDay.getFullYear(), inspectDay.getMonth(), inspectDay.getDate())
    const dayEndIter = new Date(dayStartIter)
    dayEndIter.setDate(dayEndIter.getDate() + 1)
    dayEndIter.setMilliseconds(dayEndIter.getMilliseconds() - 1)

    const tasks = await TaskModel.find({
      userId,
      $or: [
        { createdAt: { $gte: dayStartIter, $lte: dayEndIter } },
        { updatedAt: { $gte: dayStartIter, $lte: dayEndIter } }
      ]
    })

    if (!tasks || tasks.length === 0) break

    const completedCount = tasks.filter(t => t.completed).length

    if (completedCount === tasks.length && completedCount > 0) {
      streakCount += 1
      inspectDay.setDate(inspectDay.getDate() - 1)
      continue
    }

    break
  }

  user.streak = streakCount
  user.lastStreakProcessed = targetDayStart
  await user.save()

  return user.streak || 0
}

// GET /streak
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id // ✅ safer access
    if (!userId) return res.status(401).json({ error: 'Unauthorized' })

    const mode = req.query.mode || 'yesterday'
    const debug = req.query.debug === '1'

    const streak = await processStreakForUser(userId, { mode })

    if (!debug) return res.json({ streak })

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    let targetDayStart = mode === 'today' ? todayStart : new Date(todayStart)
    if (mode !== 'today') targetDayStart.setDate(targetDayStart.getDate() - 1)

    const targetDayEnd = new Date(targetDayStart)
    targetDayEnd.setDate(targetDayEnd.getDate() + 1)
    targetDayEnd.setMilliseconds(targetDayEnd.getMilliseconds() - 1)

    const tasks = await Task.find({
      userId,
      $or: [
        { createdAt: { $gte: targetDayStart, $lte: targetDayEnd } },
        { updatedAt: { $gte: targetDayStart, $lte: targetDayEnd } }
      ]
    }).select('title completed createdAt updatedAt completedAt')

    console.log('[streak debug]', { userId, mode, tasksCount: tasks.length }) // ✅ cleaner log

    return res.json({ streak, tasks })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})

export default router