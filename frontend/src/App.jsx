import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import AppNavbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import Schedule from './components/Schedule'
import Goals from './components/Goals'
import Analytics from './components/Analytics'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function Layout() {
  const location = useLocation()

  return (
    <div className="App">
      
      {/* ✅ Hide navbar on login */}
      {location.pathname !== '/login' && <AppNavbar />}

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Optional: also hide footer on login */}
      {location.pathname !== '/login' && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout />
      </Router>
    </Provider>
  )
}

export default App