import assert from 'assert'
import { processStreakForUser } from '../src/routes/streak.js'

async function run() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Case A
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
  assert.strictEqual(resultA, 0)
  assert.strictEqual(savedA, true)
  assert.ok(mockUserA.lastStreakProcessed instanceof Date) // ✅ FIX: strict check

  // Case B
  let savedB = false
  const mockUserB = { _id: 'userB', streak: 2, lastStreakProcessed: null, save: async function () { savedB = true } }

  const TaskModelB = { find: async () => [{ completed: true }, { completed: true }] }
  const UserModelB = { findById: async (id) => (id === 'userB' ? mockUserB : null) }

  const resultB = await processStreakForUser('userB', { TaskModel: TaskModelB, UserModel: UserModelB })
  assert.strictEqual(resultB, 3)
  assert.strictEqual(savedB, true)

  // Case C
  let savedC = false
  const mockUserC = { _id: 'userC', streak: 4, lastStreakProcessed: null, save: async function () { savedC = true } }

  const TaskModelC = { find: async () => [{ completed: true }, { completed: false }] }
  const UserModelC = { findById: async (id) => (id === 'userC' ? mockUserC : null) }

  const resultC = await processStreakForUser('userC', { TaskModel: TaskModelC, UserModel: UserModelC })
  assert.strictEqual(resultC, 0)
  assert.strictEqual(savedC, true)

  console.log('All tests passed')
}

run().catch(err => {
  console.error('Tests failed:', err)
  process.exit(1)
})