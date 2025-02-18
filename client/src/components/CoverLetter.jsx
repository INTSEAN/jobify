import React, { useEffect, useState, useRef } from "react";
import ErrorPage from "./ErrorPage";
import { useReactToPrint } from "react-to-print";
import VoiceInterface from "./VoiceInterface";

const CoverLetter = ({ result }) => {
  const [data, setData] = useState(result);
  const componentRef = useRef();
  const [listening, setListening] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const recognition = useRef(null);
  const timerIntervalRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${data.fullName} Cover Letter`,
    onAfterPrint: () => alert("Print Successful!"),
  });

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      const storedResult = localStorage.getItem("coverLetterResult");
      if (storedResult) {
        setData(JSON.parse(storedResult));
      }
    }
  }, [data]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        // Default to the first available voice
        const selectedVoice = availableVoices[0].name;
        setData((prevData) => ({ ...prevData, selectedVoice }));
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
      alert("Speech recognition not supported on this browser.");
      return;
    }
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";
    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Append candidate's response using a person emoji
      setData((prevData) => ({
        ...prevData,
        conversationHistory: prevData.conversationHistory + "\n🧑: " + transcript,
      }));
      stopListening(); // Stop the timer when the candidate finishes speaking
      // Trigger the next interview step with the candidate's input
      fetchInterviewStep(transcript);
    };
    recog.onerror = (event) => {
      alert("Speech recognition error: " + event.error);
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

  const handleVoiceToggle = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const fetchInterviewStep = async (latestCandidateResponse = "") => {
    if (data.questionCount >= 5) {
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/interview-conversation`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: data.fullName,
            jobDescription: data.jobDescription,
            conversationHistory:
              data.conversationHistory +
              (latestCandidateResponse
                ? "\n🧑: " + latestCandidateResponse
                : ""),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        const newAiResponse = data.aiResponse;
        const newCount = data.questionCount + 1;
        if (newCount === 5) {
          const finalMessage =
            newAiResponse +
            " Thank you for your time, this concludes our interview.";
          setData((prevData) => ({
            ...prevData,
            conversationHistory: prevData.conversationHistory + "\n🤖: " + finalMessage,
          }));
          speak(finalMessage);
        } else {
          setData((prevData) => ({
            ...prevData,
            conversationHistory: prevData.conversationHistory + "\n🤖: " + newAiResponse,
          }));
          speak(newAiResponse);
        }
        setData((prevData) => ({ ...prevData, questionCount: newCount }));
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Interview step fetch error: " + error.message);
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const textToSpeak = text
        .replace(/🤖:/g, "Interviewer:")
        .replace(/🧑:/g, "Candidate:");
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voice = window.speechSynthesis.getVoices().find((v) => v.name === data.selectedVoice);
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
    if (!data.fullName) {
      alert("Please enter your name to start the interview.");
      return;
    }
    // Reset conversation history and question count; then start the interview
    setData((prevData) => ({
      ...prevData,
      conversationHistory: "",
      questionCount: 0,
    }));
    fetchInterviewStep();
  };

  const handleEndInterview = () => {
    stopListening();
    setData((prevData) => ({
      ...prevData,
      conversationHistory: "Interview ended by the user.",
      questionCount: 5, // Ensure no more questions are asked
    }));
  };

  if (!data || Object.keys(data).length === 0) {
    return <ErrorPage />;
  }

  const replaceWithBr = (string) => {
    return string.replace(/\n/g, "<br />");
  };

  return (
    <>
      <main className="container" ref={componentRef}>
        <header className="header">
          <div>
            <h1>{data.fullName}</h1>
            <p className="resumeTitle headerTitle">
              {data.currentPosition} ({data.currentTechnologies})
            </p>
            <p className="resumeTitle">
              {data.currentLength} year(s) work experience
            </p>
          </div>
        </header>
        <div className="resumeBody">
          <div>
            <h2 className="resumeBodyTitle">COVER LETTER</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: replaceWithBr(data.objective),
              }}
              className="resumeBodyContent"
            />
          </div>
          <div>
            <h2 className="resumeBodyTitle">KEY STRENGTHS</h2>
            <p
              dangerouslySetInnerHTML={{
                __html: replaceWithBr(data.keypoints),
              }}
              className="resumeBodyContent"
            />
          </div>
        </div>
      </main>
      <button className="print-button" onClick={handlePrint}>Print Cover Letter</button>
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
    </>
  );
};

export default CoverLetter;
