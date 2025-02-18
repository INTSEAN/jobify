import React, { useEffect, useState, useRef } from "react";
import ErrorPage from "./ErrorPage";
import { useReactToPrint } from "react-to-print";

const CoverLetter = ({ result }) => {
  const [data, setData] = useState(result);
  const componentRef = useRef();

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
    </>
  );
};

export default CoverLetter;
