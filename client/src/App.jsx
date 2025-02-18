import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import CoverLetter from "./components/CoverLetter";
import Hero from "./components/Hero";
import Root from "./components/Root";
import InterviewConversation from "./components/InterviewConversation";
import ErrorPage from "./components/ErrorPage";

function App() {
  const [result, setResult] = useState({});
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          index: true,
          element: <Hero />,
        },
        {
          path: "home",
          element: <Home setResult={setResult} />,
        },
        {
          path: "resume",
          element: <CoverLetter result={result} />,
        },
        {
          path: "interview",
          element: <InterviewConversation />,
        },
      ],
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
