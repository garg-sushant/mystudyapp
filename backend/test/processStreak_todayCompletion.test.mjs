import assert from 'assert'
import { processStreakForUser } from '../src/routes/streak.js'

async function run() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Case D
  let savedD = false
  const mockUserD = { _id: 'userD', streak: 0, lastStreakProcessed: null, save: async function() { savedD = true } }

  const TaskModelD = {
    find: async () => [
      { completed: true, createdAt: new Date(), updatedAt: new Date() } // ✅ FIX: use Date instead of string
    ]
  }

  const UserModelD = { findById: async (id) => (id === 'userD' ? mockUserD : null) }

  const resD = await processStreakForUser('userD', { mode: 'today', TaskModel: TaskModelD, UserModel: UserModelD })
  assert.strictEqual(resD, 1)
  assert.strictEqual(savedD, true)

  // Case E
  let savedE = false
  const yesterday = new Date(todayStart); yesterday.setDate(yesterday.getDate() - 1)

  const mockUserE = { _id: 'userE', streak: 5, lastStreakProcessed: yesterday, save: async function() { savedE = true } }

  const TaskModelE = {
    find: async () => [
      { completed: true, createdAt: new Date(), updatedAt: new Date() } // ✅ same fix
    ]
  }

  const UserModelE = { findById: async (id) => (id === 'userE' ? mockUserE : null) }

  const resE = await processStreakForUser('userE', { mode: 'today', TaskModel: TaskModelE, UserModel: UserModelE })
  assert.strictEqual(resE, 6)
  assert.strictEqual(savedE, true)

  // Case F
  let savedF = false
  const mockUserF = { _id: 'userF', streak: 2, lastStreakProcessed: null, save: async function() { savedF = true } }

  const oldDate = new Date(todayStart); oldDate.setDate(oldDate.getDate() - 5)

  const TaskModelF = {
    find: async () => [
      {
        completed: true,
        createdAt: oldDate,
        updatedAt: new Date() // ✅ same fix
      }
    ]
  }

  const UserModelF = { findById: async (id) => (id === 'userF' ? mockUserF : null) }

  const resF = await processStreakForUser('userF', { mode: 'today', TaskModel: TaskModelF, UserModel: UserModelF })
  assert.strictEqual(resF, 3)
  assert.strictEqual(savedF, true)

  console.log('Today-completion tests passed')
}

run().catch(err => {
  console.error('Tests failed:', err)
  process.exit(1)
})