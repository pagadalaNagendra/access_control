import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from "../Adminnavbar";
import './Userrequesting.css';
import config from "../config";
const Userrequesting = () => {
  const [email, setEmail] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${config.backendapi}/auth/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, message: selectedOption }),
    });

    const result = await response.json();
    if (result.success) {
      alert('Email sent successfully!');
    } else {
      alert('Failed to send email.');
    }
  };

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };



  return (
    <Container maxWidth="sm" className="container">
      <Adminnavbar />
      <Box component="form" onSubmit={handleSubmit} className="form">
        <Typography variant="h5" component="div" gutterBottom>
          Send Email
        </Typography>
        <TextField
          label="Your Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-item"
        />
        <FormControl variant="outlined" fullWidth className="form-item">
          <InputLabel id="demo-simple-select-outlined-label">Options</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={selectedOption}
            onChange={handleDropdownChange}
            label="Options"
            required
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Youtube">Youtube</MenuItem>
            <MenuItem value="Pdfviewer">Pdf_files</MenuItem>
            <MenuItem value="Reference notes">Reference notes</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit" className="button primary-button">
          Send
        </Button>
      </Box>
    </Container>
  );
};

export default Userrequesting;