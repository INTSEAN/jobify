import { useState, useEffect } from "react";
import "./VoiceInterface.css";

const VoiceInterface = ({ isRecording, onToggleRecording }) => {
  const [audioLevel, setAudioLevel] = useState(0);

  // Simulate audio level changes
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setAudioLevel(Math.random() * 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="voice-container">
      <div className="smooth-interface">
        <button
          className={`chic-orb ${isRecording ? "recording" : ""}`}
          onClick={onToggleRecording}
          aria-label={isRecording ? "Stop recording" : "Start recording"}
        >
          <div
            className="orb-aura"
            style={{ "--audio-level": `${audioLevel}%` }}
          ></div>
          <div className="orb-border"></div>
          <div className="orb-core">
            <div className={`mic-icon ${isRecording ? "hidden" : ""}`} />
            <div className={`stop-icon ${isRecording ? "visible" : ""}`} />
          </div>
        </button>
        <div className="soundwave" data-recording={isRecording}>
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="wave-bar"
              style={{ "--delay": `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;
