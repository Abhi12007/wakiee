import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ✅ Your existing artistic wakiee text */}
        <div className="navbar-logo">
          <Link to="/" onClick={closeMenu} className="brand-text">
            wakiee
          </Link>
        </div>

        {/* 🍔 Hamburger icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          <div className={isOpen ? "bar bar1 open" : "bar bar1"}></div>
          <div className={isOpen ? "bar bar2 open" : "bar bar2"}></div>
          <div className={isOpen ? "bar bar3 open" : "bar bar3"}></div>
        </div>

        {/* 📱 Dropdown Menu (Mobile) / Inline Menu (Desktop) */}
        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/voice" onClick={closeMenu}>Voice</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About Us</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact Us</Link></li>
          <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
