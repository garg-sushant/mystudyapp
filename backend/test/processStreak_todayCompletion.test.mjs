import assert from 'assert'
import { processStreakForUser } from '../src/routes/streak.js'

async function run() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Case D: user with no last processed, tasks for today all completed -> streak becomes 1
  let savedD = false
  const mockUserD = { _id: 'userD', streak: 0, lastStreakProcessed: null, save: async function() { savedD = true } }
  const TaskModelD = { find: async (query) => [ { completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } ] }
  const UserModelD = { findById: async (id) => (id === 'userD' ? mockUserD : null) }

  const resD = await processStreakForUser('userD', { mode: 'today', TaskModel: TaskModelD, UserModel: UserModelD })
  assert.strictEqual(resD, 1, 'Case D: streak should increment from 0 to 1 when all today tasks completed')
  assert.strictEqual(savedD, true, 'Case D: user.save should be called')

  // Case E: user with existing streak 5, last processed yesterday, tasks today all completed -> streak becomes 6
  let savedE = false
  const yesterday = new Date(todayStart); yesterday.setDate(yesterday.getDate() - 1)
  const mockUserE = { _id: 'userE', streak: 5, lastStreakProcessed: yesterday, save: async function() { savedE = true } }
  const TaskModelE = { find: async (query) => [ { completed: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } ] }
  const UserModelE = { findById: async (id) => (id === 'userE' ? mockUserE : null) }

  const resE = await processStreakForUser('userE', { mode: 'today', TaskModel: TaskModelE, UserModel: UserModelE })
  assert.strictEqual(resE, 6, 'Case E: streak should increment from 5 to 6')
  assert.strictEqual(savedE, true, 'Case E: user.save should be called')

  // Case F: task created earlier but updated today -> should be counted and increment
  let savedF = false
  const mockUserF = { _id: 'userF', streak: 2, lastStreakProcessed: null, save: async function() { savedF = true } }
  const oldDate = new Date(todayStart); oldDate.setDate(oldDate.getDate() - 5)
  // simulate task with older createdAt but updatedAt today
  const TaskModelF = { find: async (query) => [ { completed: true, createdAt: oldDate.toISOString(), updatedAt: new Date().toISOString() } ] }
  const UserModelF = { findById: async (id) => (id === 'userF' ? mockUserF : null) }

  const resF = await processStreakForUser('userF', { mode: 'today', TaskModel: TaskModelF, UserModel: UserModelF })
  assert.strictEqual(resF, 3, 'Case F: task updated today should be counted; streak increments')
  assert.strictEqual(savedF, true, 'Case F: user.save should be called')

  console.log('Today-completion tests passed')
}

run().catch(err => {
  console.error('Tests failed:', err)
  process.exit(1)
})
