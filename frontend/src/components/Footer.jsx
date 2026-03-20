import React from 'react'
import './Navbar.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer-modern">
      &copy; {year} MyStudyApp. All rights reserved.
    </footer>
  )
}

export default Footer