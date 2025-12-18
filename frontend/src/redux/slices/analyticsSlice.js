import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dailyStats: {},
  weeklyStats: {},
  monthlyStats: {},
  subjectStats: {},
  productivityScore: 0,
  studyStreak: 0,
  totalStudyTime: 0,
  loading: false,
  error: null
}

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateDailyStats: (state, action) => {
      const { date, stats } = action.payload
      state.dailyStats[date] = { ...state.dailyStats[date], ...stats }
    },
    updateWeeklyStats: (state, action) => {
      const { week, stats } = action.payload
      state.weeklyStats[week] = { ...state.weeklyStats[week], ...stats }
    },
    updateMonthlyStats: (state, action) => {
      const { month, stats } = action.payload
      state.monthlyStats[month] = { ...state.monthlyStats[month], ...stats }
    },
    updateSubjectStats: (state, action) => {
      const { subject, stats } = action.payload
      state.subjectStats[subject] = { ...state.subjectStats[subject], ...stats }
    },
    updateProductivityScore: (state, action) => {
      state.productivityScore = action.payload
    },
    updateStudyStreak: (state, action) => {
      state.studyStreak = action.payload
    },
    updateTotalStudyTime: (state, action) => {
      state.totalStudyTime = action.payload
    },
    calculateAnalytics: (state, action) => {
      const { studySessions, goals, tasks } = action.payload
      
      // Calculate total study time
      const totalTime = Array.isArray(studySessions)
        ? studySessions.reduce((total, session) => {
            const duration = Number(session?.duration) || 0
            return total + (isNaN(duration) ? 0 : duration)
          }, 0)
        : 0
      state.totalStudyTime = totalTime

      // Productivity: overall completion rate of goals and tasks
      const completedGoals = goals.filter(goal => goal.completed).length
      const totalGoals = goals.length
      const completedTasks = tasks.filter(task => task.completed).length
      const totalTasks = tasks.length

      const totalItems = totalGoals + totalTasks
      const completedItems = completedGoals + completedTasks

      state.productivityScore = totalItems > 0
        ? Math.round((completedItems / totalItems) * 100)
        : 0

      // Calculate subject-wise statistics
      const subjectData = {}
      studySessions.forEach(session => {
        if (session.subject) {
          if (!subjectData[session.subject]) {
            subjectData[session.subject] = { totalTime: 0, sessions: 0 }
          }
          subjectData[session.subject].totalTime += session.duration || 0
          subjectData[session.subject].sessions += 1
        }
      })
      state.subjectStats = subjectData
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const {
  updateDailyStats,
  updateWeeklyStats,
  updateMonthlyStats,
  updateSubjectStats,
  updateProductivityScore,
  updateStudyStreak,
  updateTotalStudyTime,
  calculateAnalytics,
  setLoading,
  setError
} = analyticsSlice.actions

export default analyticsSlice.reducer 