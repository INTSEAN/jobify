import React from 'react';
import "./Loader.css";

const Loading = () => {
  return (
    <>
      <div class="loader">
        <span></span>
      </div>
      <h1 style={{ color: "#06d6a0", position: "fixed", top: "70%", left: "55%", transform: "translate(-50%, -50%)" }}>Loading...</h1>
    </>
  );
}

export default Loading;
