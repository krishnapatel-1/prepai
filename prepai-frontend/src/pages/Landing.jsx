import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Landing.css";
import Footer from "../components/Footer";
import CompanyOrbit from "../components/CompanyMarquee";
import FeedBack from "../components/FeedBack";

const Landing = () => {
  const nav = useNavigate();
  const { user } = useAuth(); // ✅ auth-aware

  return (
    <div className="landing-wrapper">
      <section className="hero">
        <h1>
          AI Platform for Better <br /> Interviews
        </h1>

        <p className="hero-subtext">
         A better way to
         improve your interview chances and skills
        </p>

        {/* ✅ CTA changes based on login */}
        <div className="cta-box">
          {!user ? (
            <>
              <button
                className="search-btn"
                onClick={() => nav("/login")}
              >
                Start Interview
              </button>

              <button
                className="secondary-btn"
                onClick={() => nav("/signup")}
              >
                Sign Up Free
              </button>
            </>
          ) : (
            <>
              <button
                className="search-btn"
                onClick={() => nav("/create")}
              >
                Start New Interview
              </button>
            </>
          )}
        </div>

        <div className="info-card">
          <p className="card-title">Why PrepAI?</p>
          <ul>
            <li>🎯 Role-based interview questions</li>
            <li>📊 AI evaluation with score & feedback</li>
            <li>📈 Interview summary & progress tracking</li>
          </ul>
        </div>

   < CompanyOrbit />

   <FeedBack/>  

      </section>
      <Footer />
    </div>
  );
};

export default Landing;
 