import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

const ErrorPage = () => {
  return (
    <div>
      <h3>You have not provided your details kindly head back</h3>
      <Link to="/">Homepage</Link>
    </div>
  );
};

export default ErrorPage;
