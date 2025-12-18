import { createSlice } from '@reduxjs/toolkit'

const tokenFromStorage = localStorage.getItem('token')
const userFromStorage = localStorage.getItem('user')

const initialState = {
  token: tokenFromStorage || null,
  user: userFromStorage ? JSON.parse(userFromStorage) : null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('token', state.token || '')
      localStorage.setItem('user', JSON.stringify(state.user || null))
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Clear persisted app state to avoid carrying analytics/productivity from previous user
      localStorage.removeItem('studyPlannerState')
    }
  }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer




