import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ProfileDropdown.css";

const ProfileDropdown = () => {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="profile-wrapper" ref={ref}>
      {/* Profile Icon */}
      <div
        className="profile-circle"
        onClick={() => setOpen((o) => !o)}
        title={user?.email || "Account"}
      >
        👤
      </div>

      {/* Dropdown */}
      {open && (
        <div className="profile-dropdown">
          {!user ? (
            <>
              <button onClick={() => nav("/login")}>Login</button>
              <button onClick={() => nav("/signup")}>Sign up</button>
            </>
          ) : (
            <>
              <p className="profile-email">{user.email}</p>


              <button onClick={() => nav("/dashboard")}>
                Dashboard
              </button>

              <button onClick={() => nav("/settings")}>
                Settings
              </button>

              <button className="danger" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
