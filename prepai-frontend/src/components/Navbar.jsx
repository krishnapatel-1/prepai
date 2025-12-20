import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import "./Navbar.css";

const Navbar = () => {
  const nav = useNavigate();

  return (
    <header className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => nav("/")}>
        PrepAI
      </div>

      {/* Center links */}
      <nav className="navbar-links">
        <span onClick={() => nav("/")}>Home</span>
        <span>Features</span>
        <span>Benefits</span>
        <span>Pricing</span>
        <span>Contact</span>
      </nav>

      {/* Right */}
      <div className="navbar-actions">
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
