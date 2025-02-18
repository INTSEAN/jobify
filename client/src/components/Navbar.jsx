import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <a href="/" className="navbar-home">Home</a>
        <div className="navbar-buttons">
          <a href="/home" className="navbar-button">Build Cover Letter</a>
          <a href="/interview" className="navbar-button inverted">Try Mock Interview</a>
        </div>
      </nav>
      <hr className="navbar-divider" />
    </>
  );
};

export default Navbar; 