import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../redux/slices/authSlice';
import { api } from '../api/client';
import "../components/Navbar.css";

function AppNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(state => state.auth?.token);
  const user = useSelector(state => state.auth?.user);

  const [streak, setStreak] = useState(user?.streak || 0);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ NEW

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (!token) return;

    api.get('/streak?mode=today')
      .then(res => {
        const s = res?.streak ?? 0;
        setStreak(s);

        if (user) {
          dispatch(setCredentials({ token, user: { ...user, streak: s } }));
        }
      })
      .catch(err => {
        console.error('Failed to fetch streak', err);
      });
  }, [token, dispatch]);

  return (
    <nav className="navbar-modern">

      {/* Top row */}
      <div className="navbar-top">
        <div className="navbar-logo">📚 MyStudyApp</div>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </div>

      {/* Menu */}
      <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>

        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>Schedule</NavLink>
          <NavLink to="/goals" className={({ isActive }) => isActive ? 'active' : ''}>Goals</NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>Analytics</NavLink>
        </div>

        <div className="auth-actions">
          <span className="streak-chip">🔥 {Number.isFinite(streak) ? streak : 0}</span>

          {token ? (
            <>
              <span className="user-chip" title={user?.email || 'Signed in'}>
                👤 {user?.name || 'User'}
              </span>
              <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <NavLink to="/login" className="auth-link">Sign In</NavLink>
          )}
        </div>

      </div>
    </nav>
  );
}

export default AppNavbar;