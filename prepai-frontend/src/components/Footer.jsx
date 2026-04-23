 import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <h3>PrepAI</h3>
          <p>AI-powered mock interviews to help you crack your next job.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#benefits">Benefits</a>
          </div>

          <div>
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
            <a href="#privacy">Privacy</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} PrepAI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
 