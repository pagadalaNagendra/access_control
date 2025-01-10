import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Formdata.css"; // Add styling here
import Adminnavbar from "../Adminnavbar"
import config from "../config";
function UploadSwitcher() {
  const [currentForm, setCurrentForm] = useState("youtube");
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [message, setMessage] = useState("");
  const [tableData, setTableData] = useState([]); // To store table data

  // Fetch table data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.backendAPI}/auth/logos-data`);
        if (response.data.success) {
          setTableData(response.data.requests); // Use the requests array from the response
        } else {
          console.error("Failed to fetch table data");
        }
      } catch (error) {
        console.error("Failed to fetch table data", error);
      }
    };

    fetchData();
  }, []);

  // Handle YouTube form submission
  const handleYouTubeSubmit = async (e) => {
    e.preventDefault();
    if (!youtubeTitle || !youtubeUrl) {
      setMessage("Please provide both a title and URL for the YouTube video.");
      return;
    }

    try {
      await axios.post(`${config.backendAPI}/auth/youtube`, {
        title: youtubeTitle,
        url: youtubeUrl,
      });

      setMessage("YouTube video uploaded successfully!");
      setYoutubeTitle("");
      setYoutubeUrl("");
    } catch (error) {
      setMessage("Failed to upload YouTube video.");
    }
  };

  // Handle PDF form submission
  const handlePDFSubmit = async (e) => {
    e.preventDefault();
    if (!pdfTitle || !pdfFile) {
      setMessage("Please provide both a title and PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", pdfTitle);
    formData.append("pdf", pdfFile);

    try {
      await axios.post(`${config.backendAPI}/auth/upload-pdf`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("PDF uploaded successfully!");
      setPdfTitle("");
      setPdfFile(null);
    } catch (error) {
      setMessage("Failed to upload PDF file.");
    }
  };

  return (
    <div className="upload-container">
      <Adminnavbar />
      <div className="form-container">
        <h2>{currentForm === "youtube" ? "YouTube Form" : "PDF Form"}</h2>
        {currentForm === "youtube" ? (
          // YouTube Upload Form
          <form onSubmit={handleYouTubeSubmit} className="form">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                placeholder="Enter video title"
                value={youtubeTitle}
                onChange={(e) => setYoutubeTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>URL:</label>
              <input
                type="url"
                placeholder="Enter video URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn upload-btn">
                Upload Video
              </button>
              <button
                type="button"
                className="btn switch-btn"
                onClick={() => setCurrentForm("pdf")}
              >
                Change Form
              </button>
            </div>
          </form>
        ) : (
          // PDF Upload Form
          <form onSubmit={handlePDFSubmit} className="form">
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                placeholder="Enter PDF title"
                value={pdfTitle}
                onChange={(e) => setPdfTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>PDF File:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn upload-btn">
                Upload PDF
              </button>
              <button
                type="button"
                className="btn switch-btn"
                onClick={() => setCurrentForm("youtube")}
              >
                Change Form
              </button>
            </div>
          </form>
        )}
        {message && <p className="message">{message}</p>}
      </div>

      {/* Table Section */}
      <div className="table-container">
        <h2>Uploaded Data</h2>
        <div className="table-wrapper">
          {tableData.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Option</th>
                  <th>Deadline</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.option}</td>
                    <td>{new Date(item.deadline).toLocaleString()}</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadSwitcher;