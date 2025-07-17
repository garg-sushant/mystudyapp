import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

function AppNavbar() {
  return (
    <nav className="navbar-modern">
      <div className="navbar-logo">📚 MyStudyApp</div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>Schedule</NavLink>
        <NavLink to="/goals" className={({ isActive }) => isActive ? 'active' : ''}>Goals</NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>Analytics</NavLink>
      </div>
    </nav>
  )
}

export default AppNavbar 