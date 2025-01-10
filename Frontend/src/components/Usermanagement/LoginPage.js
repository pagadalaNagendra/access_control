import React, { useState, useEffect, useRef } from "react";
import { AppBar, Toolbar, Box, Typography, TextField, Checkbox, FormControlLabel, Button, Container, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "./logos.png";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import config from "../config";
const styles = {
  appBar: {
    backgroundColor: "#123462", // Changed color to #123462
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: 40,
    marginRight: 16,
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
    fontSize: "2.5rem",
    color: "#fff",
    marginLeft: "-150px", 

  },
  button: {
    color: "#fff",
    marginLeft: 16,
    textDecoration: "none",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "calc(100vh - 64px)",
  },
  loginForm: {
    border: "1px solid grey",
    padding: 6,
    borderRadius: 3,
    width: "500px",
    backgroundColor: "#fff",
  },
  loginFormItem: {
    marginBottom: 25,
  },
  forgotPasswordLink: {
    textAlign: "right",
    color: "#002e41",
    marginBottom: 10,
    cursor: "pointer",
  },
  modal: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalCloseButton: {
    cursor: "pointer",
  },
  sessionTimeoutDialog: {
    width: "600px",
    padding: "48px",
    backgroundColor: "#f3e5f5", // Light purple background color
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  errorIcon: {
    fontSize: "96px", // Increased icon size
    color: "#c51162", // Attractive red color
    marginBottom: "24px",
  },
  sessionTimeoutText: {
    marginBottom: "16px",
    fontWeight: "bold", // Bold text for better visibility
  },
  loginAgainText: {
    display: "flex",
    alignItems: "center",
    marginBottom: "32px", // Increased bottom margin for better spacing
    fontSize: "18px", // Increased font size for better readability
  },
  loginAgainIcon: {
    marginRight: "8px",
  },
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [sessionTimeoutAlert, setSessionTimeoutAlert] = useState(false);
  const navigate = useNavigate();
  const sessionTimer = useRef(null);

  useEffect(() => {
    const startSessionTimer = () => {
      const sessionDuration = 1 * 24 * 60 * 60 * 1000; // 1 day
      return setTimeout(() => {
        setSessionTimeoutAlert(true);
      }, sessionDuration);
    };

    const resetTimer = () => {
      clearTimeout(sessionTimer.current);
      sessionTimer.current = startSessionTimer();
    };

    sessionTimer.current = startSessionTimer();

    document.addEventListener("mousemove", resetTimer);
    document.addEventListener("keypress", resetTimer);

    return () => {
      clearTimeout(sessionTimer.current);
      document.removeEventListener("mousemove", resetTimer);
      document.removeEventListener("keypress", resetTimer);
    };
  }, []);

  const handleSessionTimeoutAlertClose = () => {
    setSessionTimeoutAlert(false);
    navigate("/login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be at least 6 characters with at least one uppercase letter, one lowercase letter, and one special character');
      return;
    }

    setPasswordError('');

    const response = await fetch(`${config.backendAPI}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username, password: password }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.token); // Store the token in localStorage
      localStorage.setItem("email", json.email); // Store the email in localStorage
      localStorage.setItem("role", json.role); // Store the role in localStorage
      localStorage.setItem("options", JSON.stringify(json.options)); // Store the options in localStorage

      // Navigate based on role and options
      if (json.role === "Admin") {
        navigate("/resources/Formdata");
      } else if (json.role === "User") {
        navigate("/resources/Userdashboard");
      } else if (json.role === "Maintainer") {
        navigate("/resources/Formdata");
      }
    } else {
      alert("Please provide valid credentials!!");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
            <AppBar position="fixed" style={styles.appBar}>
        <Toolbar style={styles.toolbar}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src="https://res.cloudinary.com/dxoq1rrh4/image/upload/v1721754287/left_xfp4qb.png"
                alt="Logo 1"
                style={{ height: 60, marginRight: 10 }}
              />
              <img
                src="https://res.cloudinary.com/dxoq1rrh4/image/upload/v1730886247/SMART_CITY_LOGO.8f8e3abe7957eafb9ff6_hcnlrr.png"
                alt="Logo 2"
                style={{ height: 60 }}
              />
            </Box>
         
          <Typography variant="h5" component="div" style={styles.title}>
            Resources
          </Typography>

        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" style={styles.container}>
        <Box sx={styles.loginForm}>
          <Typography variant="h5" component="div" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.loginFormItem}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.loginFormItem}
              error={!!passwordError}
              helperText={passwordError}
            />
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Remember me"
            />
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </Box>
        </Box>
      </Container>
      <Dialog
        open={sessionTimeoutAlert}
        onClose={handleSessionTimeoutAlertClose}
        PaperProps={{
          style: styles.sessionTimeoutDialog,
        }}
      >
        <ErrorOutlineIcon style={styles.errorIcon} />
        <Typography variant="h5" gutterBottom style={styles.sessionTimeoutText}>
          Oops!
        </Typography>
        <Typography variant="body1" gutterBottom style={styles.sessionTimeoutText}>
          Your session is expired.
        </Typography>
        <Box style={styles.loginAgainText}>
          <ReplayIcon style={styles.loginAgainIcon} />
          <Typography variant="body1">Please kindly login again</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSessionTimeoutAlertClose}
          autoFocus
        >
          OK
        </Button>
      </Dialog>
    </Box>
  );
};

export default LoginPage;