import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const DataDisplay = ({ email, selectedOption, deadline }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedOption === 'Youtube') {
        const response = await fetch('http://localhost:8000/auth/youtube');
        const result = await response.json();
        if (result.success) {
          setData(result.videos);
        } else {
          alert('Failed to fetch data.');
        }
      }
      // Add more conditions for other options if needed
    };

    fetchData();
  }, [selectedOption]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Data (accessible until {deadline && deadline.toLocaleString()}):
      </Typography>
      {data && data.map((video, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {video.title}
          </Typography>
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${new URL(video.url).searchParams.get('v')}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          ></iframe>
        </Box>
      ))}
    </Box>
  );
};

export default DataDisplay;