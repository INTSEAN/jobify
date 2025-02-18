import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css"; // Create a separate CSS file for Hero styles

const Hero = () => {
  return (
    <div className="hero">
      <h1>Your No. 1 Job Application Tool</h1>
      <p>
        Create your professional cover letter and mock interview in minutes
        using AI.
      </p>
      <Link to="/interview" className="hero-button">
        Try out the Mock Interview Tool
      </Link>
    </div>
  );
};

export default Hero;
