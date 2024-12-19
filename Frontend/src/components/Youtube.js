import React, { useEffect, useState } from "react";
import "./Youtube.css"; // Grid styles
import Adminnavbar from "./Adminnavbar"
function VideoGallery() {
  const [videos, setVideos] = useState([]);

  // Fetch videos from the backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("http://localhost:8000/auth/youtube"); // Backend route
        const data = await response.json();

        if (data.success && data.videos) {
          // Convert video URLs to embed-friendly format
          const formattedVideos = data.videos.map((video) => ({
            ...video,
            embedUrl: convertToEmbedUrl(video.url),
          }));
          setVideos(formattedVideos);
        } else {
          console.error("Failed to fetch videos");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Function to convert video URLs to embed format
  const convertToEmbedUrl = (url) => {
    if (url.includes("youtube.com/watch")) {
      const videoID = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoID}`;
    } else if (url.includes("youtu.be")) {
      const videoID = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoID}`;
    }
    return ""; // Default for invalid URLs
  };

  return (
    <div className="video-gallery-container">
    <Adminnavbar/>
      {/* <h1>YouTube Video Gallery</h1> */}
      {videos.length > 0 ? (
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video.id} className="video-item">
              <h3>{video.title}</h3>
              {video.embedUrl ? (
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  width="100%"
                  height="200px"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>Invalid video URL</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading videos...</p>
      )}
    </div>
  );
}

export default VideoGallery;
