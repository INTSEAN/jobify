import OpenAI from 'openai';
import express from 'express';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

// Optionally add a default GET route to handle "/"
app.get("/", (req, res) => {
  res.send("Hello, welcome to my API!");
});

// Utility to generate a simple ID.
const generateID = () => Math.random().toString(36).substring(2, 10);

// Configure Multer for file uploads.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
});

// Initialize OpenAI API client (using a supported model such as gpt-3.5-turbo)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// In-memory database for demo purposes.
const database = [];

/**
 * Calls the ChatGPT API with a prompt and returns the message content.
 */
async function ChatGPTFunction(text) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: text }],
      max_tokens: 2048,
      temperature: 0.7
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your billing details.');
    }
    throw error;
  }
}

// Utility function to parse resume text into sections based on headers.
function parseResumeSections(text) {
  // Define common resume section headers.
  const sectionNames = [
    "OBJECTIVE", "SUMMARY", "EDUCATION", "EXPERIENCE", "WORK EXPERIENCE",
    "SKILLS", "PROJECTS", "CERTIFICATIONS", "ACHIEVEMENTS", "INTERESTS",
    "ACTIVITIES", "CONTACT"
  ];
  const lines = text.split('\n');
  const sections = [];
  let currentSection = { header: "GENERAL", content: "" };

  lines.forEach(line => {
    let trimmed = line.trim();
    // Check if the line matches one of the section headers (ignoring any trailing colon)
    if (sectionNames.includes(trimmed.replace(/:$/, '').toUpperCase())) {
      if (currentSection.content.trim()) {
        sections.push(currentSection);
      }
      currentSection = { header: trimmed.replace(/:$/, '').toUpperCase(), content: "" };
    } else {
      currentSection.content += line + "\n";
    }
  });
  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }
  return sections;
}

// Function to extract text from a PDF using pdftotext.
function extractTextWithPdfExtract(filePath) {
  return new Promise((resolve, reject) => {
    const pdfExtract = spawn('pdftotext', [filePath, '-']);
    let data = '';

    pdfExtract.stdout.on('data', (chunk) => {
      data += chunk;
    });

    pdfExtract.stderr.on('data', (error) => {
      console.error('Error:', error.toString());
    });

    pdfExtract.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`pdftotext process exited with code ${code}`));
      } else {
        resolve(data.trim());
      }
    });
  });
}

// --- Existing resume creation endpoint (unchanged) ---
app.post("/cover-letter-generator", upload.none(), async (req, res) => {
  const { fullName, currentPosition, currentLength, currentTechnologies, workHistory } = req.body;
  let workArray;
  try {
    workArray = JSON.parse(workHistory);
  } catch (e) {
    return res.status(400).json({ message: "Invalid workHistory JSON" });
  }

  const newEntry = {
    id: generateID(),
    fullName,
    currentPosition,
    currentLength,
    currentTechnologies,
    workHistory: workArray,
  };

  const prompt1 = `I am writing a resume. My details are:
Name: ${fullName}
Role: ${currentPosition} (${currentLength} years)
Technologies: ${currentTechnologies}
Please write a 100-word description for the top of my resume in the first person.`;

  const prompt2 = `I am writing a resume. My details are:
Name: ${fullName}
Role: ${currentPosition} (${currentLength} years)
Technologies: ${currentTechnologies}
Please list 10 bullet points highlighting my strengths.`;

  const remainderText = workArray.map(item => ` ${item.name} as a ${item.position}.`).join("");
  const prompt3 = `I am writing a resume. My details are:
Name: ${fullName}
Role: ${currentPosition} (${currentLength} years)
I have worked at ${workArray.length} companies:${remainderText}
Please write 50 words for each company (in order of my employment) in the first person.`;

  try {
    const objective = await ChatGPTFunction(prompt1);
    const keypoints = await ChatGPTFunction(prompt2);
    const jobResponsibilities = await ChatGPTFunction(prompt3);
    const chatgptData = { objective, keypoints, jobResponsibilities };
    const data = { ...newEntry, ...chatgptData };
    database.push(data);

    res.json({
      message: "Request successful!",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message
    });
  }
});

// --- New Cover Letter Generation Endpoint ---
app.post("/cover-letter", async (req, res) => {
  const { fullName, jobTitle, companyName, resumeSummary, additionalInfo } = req.body;
  const prompt = `I am applying for the position of ${jobTitle} at ${companyName}. My name is ${fullName} and I have the following background:
${resumeSummary}

Additional Information: ${additionalInfo}

Please generate a compelling and professional cover letter tailored for this job application.`;
  try {
    const coverLetter = await ChatGPTFunction(prompt);
    res.json({
      message: "Cover letter generated successfully!",
      coverLetter
    });
  } catch (error) {
    console.error("Cover letter generation error:", error.message);
    res.status(500).json({
      message: "An error occurred during cover letter generation",
      error: error.message
    });
  }
});

// --- New Interview Conversation Endpoint ---
app.post("/interview-conversation", async (req, res) => {
  const { userName, jobDescription, conversationHistory } = req.body;
  let prompt = "";
  if (!conversationHistory || conversationHistory.trim() === "") {
    prompt = `You are a professional interviewer. The candidate, ${userName}, has applied for a position with the following job description:
${jobDescription}

Please start the interview by greeting ${userName} and asking a tailored initial interview question.`;
  } else {
    prompt = `Based on the following conversation so far:
${conversationHistory}

And considering the job description:
${jobDescription}

Please generate the next interview question to continue the conversation with ${userName}. Mention the user's name in your response. Do not include any interviewer word in your response.`;
  }
  try {
    const aiResponse = await ChatGPTFunction(prompt);
    res.json({
      message: "Interview conversation step generated successfully!",
      aiResponse
    });
  } catch (error) {
    console.error("Interview conversation error:", error.message);
    res.status(500).json({
      message: "An error occurred during interview conversation generation",
      error: error.message
    });
  }
});

// Instead of app.listen, export the app for Vercel
export default app;
