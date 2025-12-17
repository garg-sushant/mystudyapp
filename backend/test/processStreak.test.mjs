import assert from 'assert'
import { processStreakForUser } from '../src/routes/streak.js'

async function run() {
  // Helper to get today's midnight date for comparison
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Case A: no tasks yesterday -> per new rule, streak resets to 0
  let savedA = false
  const mockUserA = {
    _id: 'userA',
    streak: 3,
    lastStreakProcessed: null,
    save: async function () { savedA = true }
  }
  const TaskModelA = { find: async () => [] }
  const UserModelA = { findById: async (id) => (id === 'userA' ? mockUserA : null) }

  const resultA = await processStreakForUser('userA', { TaskModel: TaskModelA, UserModel: UserModelA })
  assert.strictEqual(resultA, 0, 'Case A: streak should reset to 0 when no tasks/completions that day')
  assert.strictEqual(savedA, true, 'Case A: user.save should have been called')
  assert.ok(mockUserA.lastStreakProcessed instanceof Date || typeof mockUserA.lastStreakProcessed === 'string', 'Case A: lastStreakProcessed should be set')

  // Case B: tasks yesterday all completed -> streak increments
  let savedB = false
  const mockUserB = { _id: 'userB', streak: 2, lastStreakProcessed: null, save: async function () { savedB = true } }
  const TaskModelB = { find: async () => [{ completed: true }, { completed: true }] }
  const UserModelB = { findById: async (id) => (id === 'userB' ? mockUserB : null) }

  const resultB = await processStreakForUser('userB', { TaskModel: TaskModelB, UserModel: UserModelB })
  assert.strictEqual(resultB, 3, 'Case B: streak should increment by 1')
  assert.strictEqual(savedB, true, 'Case B: user.save should have been called')

  // Case C: tasks yesterday not all completed -> streak resets to 0
  let savedC = false
  const mockUserC = { _id: 'userC', streak: 4, lastStreakProcessed: null, save: async function () { savedC = true } }
  const TaskModelC = { find: async () => [{ completed: true }, { completed: false }] }
  const UserModelC = { findById: async (id) => (id === 'userC' ? mockUserC : null) }

  const resultC = await processStreakForUser('userC', { TaskModel: TaskModelC, UserModel: UserModelC })
  assert.strictEqual(resultC, 0, 'Case C: streak should reset to 0')
  assert.strictEqual(savedC, true, 'Case C: user.save should have been called')

  console.log('All tests passed')
}

run().catch(err => {
  console.error('Tests failed:', err)
  process.exit(1)
})
