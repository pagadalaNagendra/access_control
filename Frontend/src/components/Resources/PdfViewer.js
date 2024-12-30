import React, { useEffect, useState } from "react";
import "./PdfViewer.css"; // Ensure the CSS file is correctly linked
import Adminnavbar from "../Adminnavbar";
import config from "../config";
function PdfViewer() {
  const [pdfFiles, setPdfFiles] = useState([]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await fetch(`${config.backendapi}/auth/pdf-files`); // Replace with your backend URL
        const data = await response.json();

        if (data.success && data.files) {
          setPdfFiles(data.files);
        } else {
          console.error("Failed to fetch PDF files or invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      }
    };

    fetchPdfs();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <Adminnavbar className="admin-navbar" />

      {/* PDF Viewer */}
      <div className="pdf-viewer-container">
        {/* <h1>PDF Viewer</h1> */}
        {pdfFiles && pdfFiles.length > 0 ? (
          <div className="pdf-grid">
            {pdfFiles.map((file) => (
              <div key={file.id} className="pdf-item">
                <h2>{file.title}</h2>
                <iframe
                  src={`data:application/pdf;base64,${file.data}`}
                  width="300"
                  height="400"
                  title={file.title}
                ></iframe>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading PDF files...</p>
        )}
      </div>
    </div>
  );
}

export default PdfViewer;
