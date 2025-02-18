import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./ResumeReview.css";

const ResumeReview = () => {
  const [resume, setResume] = useState(null);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return;

    const formData = new FormData();
    formData.append("resumeFile", resume, resume.name);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/cover-letter-generator`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setScore(response.data.score);
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Error during resume review:", error);
      setScore("Error: Could not complete review");
    }
  };

  return (
    <div className="resume-review">
      <h1>Resume Review</h1>
      <p>Upload your resume to get a detailed review score and feedback.</p>
      <form onSubmit={handleSubmit} className="resume-review-form">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Submit Resume</button>
      </form>
      {score !== null && (
        <div className="score-display">
          {typeof score === "string" && score.startsWith("Error:") ? (
            <h2 className="error-message">Oops! {score}</h2>
          ) : (
            <>
              <motion.h2
                className="score-message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Score: {score}%
              </motion.h2>
              <motion.p
                className="feedback-message"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Feedback: {feedback}
              </motion.p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeReview;
