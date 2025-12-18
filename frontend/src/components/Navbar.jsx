import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setCredentials } from '../redux/slices/authSlice';
import './Navbar.css';
import { api } from '../api/client';

function AppNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);
  const [streak, setStreak] = useState(user?.streak || 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (!token) return;

    // ✅ FIX: /api prefix is REQUIRED
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
  }, [token]);

  return (
    <nav className="navbar-modern">
      <div className="navbar-logo">📚 MyStudyApp</div>

      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Dashboard
        </NavLink>
        <NavLink to="/schedule" className={({ isActive }) => isActive ? 'active' : ''}>
          Schedule
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => isActive ? 'active' : ''}>
          Goals
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>
          Analytics
        </NavLink>
      </div>

      <div className="auth-actions">
        <span className="streak-chip" title="Study streak">
          🔥 {Number.isFinite(streak) ? streak : 0}
        </span>

        {token ? (
          <>
            <span className="user-chip" title={user?.email || 'Signed in'}>
              👤 {user?.username || 'User'}
            </span>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <NavLink to="/login" className="auth-link">
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default AppNavbar;
