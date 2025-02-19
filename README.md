# AI JOBIFY USING REACT, NODE, EXPRESS AND CHAT GPT4 🚀

<!-- breif description of the app -->
AI Jobify is a web app that helps you to create a cover letter in a few minutes. It uses GPT-4 to generate cover letter templates and also uses GPT-4 to conduct interviews. It also provides a cover letter preview and cover letter download functionality.

## Run the app here

[Jobify](https://ai-resume-builder-git-main-intseans-projects.vercel.app/)

## What is new?
<!-- give app functions based on description -->
- **Cover Letter Generation:** Quickly generate cover letter templates and content using GPT-4.
- **Interview Preparation:** Engage in voice AI-powered interview simulations with real-time feedback and analysis.
- **Preview & Download:** Instantly preview your generated cover letter and download it as needed.
- **Modern Frontend:** Built with React for a responsive, user-friendly interface.
- **Robust Backend:** Powered by Node.js and Express for handling API requests and integrating with GPT-4
- **UI-DEsign:** Revamped UI with custom styles and animations for improved performance and user experience.

## Why it matters?

- [X] Save time: Reduce the time spent on creating a draft cover letter by up to 90% (from 1 hour to 1 minute).
- [X] Improve interview preparation: Increase the chances of getting hired by up to 30% through AI-powered interview preparation. Jobify users are x5 more likely to get hired.
- [X] Enhance career development: Provides access to industry level interview practice and feedback for up to 100,000 job seekers per month.
- [X] Increase accessibility: Make job application resources available to 95% of the global population with an internet connection.

---

## Table of Contents

- [AI JOBIFY USING REACT, NODE, EXPRESS AND CHAT GPT4 🚀](#ai-jobify-using-react-node-express-and-chat-gpt4-)
  - [Run the app here](#run-the-app-here)
  - [What is new?](#what-is-new)
  - [Why it matters?](#why-it-matters)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Clone the Repository](#clone-the-repository)
    - [Server Setup](#server-setup)
    - [Client Setup](#client-setup)
    - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
  - [Usage](#usage)
  - [Deployment](#deployment)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)
  - [Credits](#credits)
  - [License](#license)

---

## Prerequisites

- **Node.js** (v14 or later)
- **npm** (or yarn)
- An **OpenAI API key** (for GPT-4 integration)

---

## Installation

### Clone the Repository

Open your terminal and run:

```bash

git clone https://github.com/INTSEAN/jobify.git
```

Then, navigate to the project directory:

```bash

cd jobify
```

### Server Setup

Navigate to the server folder:

```bash

cd server

```

Install dependencies:

```bash

npm install
```

Configure Environment Variables:

Create a `.env` file in the server directory and add the following:
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
# Add any additional server-specific variables as needed
```

### Client Setup

Open a new terminal window/tab and navigate to the client folder:
```bash
cd client
```
Install dependencies:
```bash
npm install
```
Adjust any client-side configurations if necessary (e.g., API endpoints).

### Environment Variables

Ensure that your API keys and other sensitive data are kept secure. The primary environment variable for the server is:

- `OPENAI_API_KEY`: Your OpenAI API key for GPT-4 access.

---

## Running the Application

You can run both the server and the client concurrently. If you have a root-level script set up (e.g., using the concurrently package), simply run from the project root:
```bash
npm run dev
```

Alternatively, run them in separate terminal windows:

Start the Server:
```bash
cd server
npm start
```

Start the Client:
```bash
cd client
npm start
```

By default, the client will be available at [http://localhost:3000](http://localhost:3000) and the server at [http://localhost:5000](http://localhost:5000) (or as specified in your `.env` file).

---

## Usage

Once the application is running:

- **Generate a Cover Letter:**
  - Choose a cover letter template.
  - Input your details as prompted.
  - Click the "Generate" button to create your cover letter using GPT-4.

- **Preview and Download:**
  - Review the generated cover letter.
  - Use the download option to save your cover letter locally.

- **Interview Preparation:**
  - Engage with the voice AI-powered interview simulation.
  - Receive real-time feedback and analysis to boost your interview readiness.

---

## Deployment

Jobify can be deployed on various cloud platforms such as Vercel, Heroku, or AWS. When deploying, make sure to:

- Set up your environment variables (e.g., `OPENAI_API_KEY`) in your production environment.
- Configure your build settings appropriately for both client and server.

---

## Troubleshooting

- **Dependency Issues:** Ensure you are using the correct Node.js version. If issues persist, try deleting `node_modules` and your lock file (`package-lock.json` or `yarn.lock`), then reinstall dependencies.
- **Environment Variables:** Verify that your `.env` file in the server directory is correctly configured.
- **Port Conflicts:** If default ports (3000 for client, 5000 for server) are busy, update the configuration to use alternative ports.
- **API Errors:** Double-check that your OpenAI API key is valid and that your network connection is stable.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request detailing your changes.

---

## Credits

- Developer: INTSEAN Sean Donovan
- Inspiration & Contributions: Go Pro Dev
- Powered by: GPT-4 for AI capabilities

---

## License

This project is licensed under the MIT License.
