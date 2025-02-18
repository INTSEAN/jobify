import { useState, useRef, useEffect } from "react";
import VoiceInterface from "./VoiceInterface";

const InterviewConversation = () => {
  const [userName, setUserName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [conversationHistory, setConversationHistory] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const recognition = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (error) {
      alert(`Error: ${error}`);
    }
  }, [error]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name); // Default to the first available voice
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Initialize SpeechRecognition if available
  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported on this browser.");
      return;
    }
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";
    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Append candidate's response using a person emoji
      setConversationHistory((prev) => prev + "\n🧑: " + transcript);
      stopListening(); // Stop the timer when the candidate finishes speaking
      // Trigger the next interview step with the candidate's input
      fetchInterviewStep(transcript);
    };
    recog.onerror = (event) => {
      setError("Speech recognition error: " + event.error);
    };
    recognition.current = recog;
  };

  const startListening = () => {
    if (!recognition.current) {
      initRecognition();
    }
    // Reset and start the timer for the current response
    setResponseTime(0);
    timerIntervalRef.current = setInterval(() => {
      setResponseTime((prev) => prev + 1);
    }, 1000);
    setListening(true);
    recognition.current.start();
  };

  const stopListening = () => {
    setListening(false);
    if (recognition.current) {
      recognition.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setResponseTime(0);
  };

  const fetchInterviewStep = async (latestCandidateResponse = "") => {
    if (questionCount >= 5) {
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/interview-conversation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName,
            jobDescription,
            conversationHistory:
              conversationHistory +
              (latestCandidateResponse
                ? "\n🧑: " + latestCandidateResponse
                : ""),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const newAiResponse = data.aiResponse;
        const newCount = questionCount + 1;
        if (newCount === 5) {
          const finalMessage =
            newAiResponse +
            " Thank you for your time, this concludes our interview.";
          setConversationHistory((prev) => prev + "\n🤖: " + finalMessage);
          speak(finalMessage);
        } else {
          setConversationHistory((prev) => prev + "\n🤖: " + newAiResponse);
          speak(newAiResponse);
        }
        setQuestionCount(newCount);
      } else {
        setError("Error: " + data.message);
      }
    } catch (error) {
      setError("Interview step fetch error: " + error.message);
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const textToSpeak = text
        .replace(/🤖:/g, "Interviewer:")
        .replace(/🧑:/g, "Candidate:");
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voice = voices.find((v) => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Text-to-speech not supported.");
    }
  };

  const handleSubmitJobDescription = (e) => {
    e.preventDefault();
    if (!userName) {
      alert("Please enter your name to start the interview.");
      return;
    }
    // Reset conversation history and question count; then start the interview
    setConversationHistory("");
    setQuestionCount(0);
    fetchInterviewStep();
  };

  const handleEndInterview = () => {
    stopListening();
    setConversationHistory("Interview ended by the user.");
    setQuestionCount(5); // Ensure no more questions are asked
  };

  const handleVoiceToggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
        color: "white",
        marginTop: "40px",
      }}
    >
      <h2>Mock Big Tech Behavioral Interview</h2>
      <p>Answer the following questions. Your responses are timed.</p>
      <form
        onSubmit={handleSubmitJobDescription}
        style={{ marginBottom: "10px" }}
      >
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name..."
          style={{
            width: "100%",
            marginBottom: "10px",
            fontSize: "1.2rem",
            color: "white",
            backgroundColor: "transparent",
            border: "1px solid #06d6a0",
          }}
          required
        />
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          rows="2"
          style={{
            width: "100%",
            fontSize: "1.2rem",
            backgroundColor: "transparent",
            color: "white",
            border: "1px solid #06d6a0",
            marginBottom: "10px",
            textAlign: "left",
            textWrap: "balance",
          }}
        />
        <label htmlFor="voiceSelect">Select Voice:</label>
        <select
          id="voiceSelect"
          className="voiceSelect"
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          Start Interview
        </button>
      </form>
      <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
        <VoiceInterface
          isRecording={listening}
          onToggleRecording={handleVoiceToggle}
        />
        <button
          className="end-interview"
          onClick={handleEndInterview}
          style={{ marginLeft: "10px" }}
        >
          End Interview
        </button>
        {listening && (
          <span style={{ marginLeft: "10px" }}>
            Response Time: {responseTime}s
          </span>
        )}
      </div>
      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ccc",
          color: "white",
          padding: "10px",
          height: "300px",
          overflowY: "scroll",
          whiteSpace: "pre-wrap",
        }}
      >
        {conversationHistory || "Conversation will appear here..."}
      </div>
    </div>
  );
};

export default InterviewConversation;
