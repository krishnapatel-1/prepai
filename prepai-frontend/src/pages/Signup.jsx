import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      nav("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Create your account</h2>

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary">
            Create account
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <span onClick={() => nav("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
