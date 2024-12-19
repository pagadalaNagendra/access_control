import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Dialog, Container, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Analytics from '@mui/icons-material/Analytics';
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from '@mui/icons-material/Replay';
import logo from './logos.png';
import axios from 'axios';

const styles = {
  appBar: {
    backgroundColor: '#002e41',
    zIndex: 1201,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: 40,
    marginRight: 16,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
    color: '#fff',
  },
  button: {
    color: '#fff',
    marginLeft: 16,
    textDecoration: 'none',
  },
  container: {
    padding: '20px',
  },
  drawer: {
    width: 250,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 250,
    marginTop: 64,
  },
  body: {
    backgroundColor: '#F5F5F5',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionTimeoutDialog: {
    width: "600px",
    padding: "48px",
    backgroundColor: "#f3e5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  errorIcon: {
    fontSize: "96px",
    color: "#c51162",
    marginBottom: "24px",
  },
  sessionTimeoutText: {
    marginBottom: "16px",
    fontWeight: "bold",
  },
  loginAgainText: {
    display: "flex",
    alignItems: "center",
    marginBottom: "32px",
    fontSize: "18px",
  },
  loginAgainIcon: {
    marginRight: "8px",
  },
  formContainer: {
    marginBottom: '20px', // Add margin to the bottom of the form container
  },
  tableContainer: {
    marginTop: '20px', // Add margin to the top of the table container
  },
};

const Admin = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sessionTimeoutAlert, setSessionTimeoutAlert] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [logoData, setLogoData] = useState([]);
  const navigate = useNavigate();
  const sessionTimer = useRef(null);

  useEffect(() => {
    const startSessionTimer = () => {
      const sessionDuration = 1 * 24 * 60 * 60 * 1000;
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

  useEffect(() => {
    const fetchLogoData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/auth/logos-data');
        if (response.data.success) {
          setLogoData(response.data.requests);
        } else {
          alert('Failed to fetch logo data.');
        }
      } catch (error) {
        console.error('Error fetching logo data:', error);
        alert('Failed to fetch logo data.');
      }
    };

    fetchLogoData();
  }, []);

  const handleSessionTimeoutAlertClose = () => {
    setSessionTimeoutAlert(false);
    navigate("/login");
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    navigate('/login');
  };

  const handleYoutubeLinkChange = (event) => {
    setYoutubeLink(event.target.value);
  };

  const handleYoutubeTitleChange = (event) => {
    setYoutubeTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch('http://localhost:8000/auth/youtube', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: youtubeLink, title: youtubeTitle }),
    });

    const result = await response.json();
    if (result.success) {
      alert('YouTube link and title uploaded successfully!');
      setYoutubeLink('');
      setYoutubeTitle('');
    } else {
      alert('Failed to upload YouTube link and title.');
    }
  };

  return (
    <Box style={styles.body}>
      <AppBar position="fixed" style={styles.appBar}>
        <Toolbar style={styles.toolbar}>
          <IconButton color="inherit" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <img src={logo} alt="Logo" style={styles.logo} />
          <Typography variant="h5" component="div" style={styles.title}>
            Admin Dashboard
          </Typography>

          <IconButton color="inherit" onClick={handleUserClick}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{ ...styles.drawer, ...styles.drawerPaper }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
          <IconButton color="inherit" onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
  
          <ListItem button component={Link} to="/accesscontrol/Pdfviewer">
            <ListItemIcon>
              {/* <Description /> */}
            </ListItemIcon>
            <ListItemText primary="Pdfviewer" />
          </ListItem>
          <ListItem button component={Link} to="/accesscontrol/Youtube">
            <ListItemIcon>
              <PersonAddAltIcon />
            </ListItemIcon>
            <ListItemText primary="Youtube" />
          </ListItem>

          <ListItem button component={Link} to="/accesscontrol/Assign">
            <ListItemIcon>
              <PersonAddAltIcon />
            </ListItemIcon>
            <ListItemText primary="Assign" />
          </ListItem>
        </List>
      </Drawer>
      <Container maxWidth="lg" style={styles.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box style={styles.formContainer}>
              <Typography variant="h4" component="div" gutterBottom>
                Upload YouTube Link and Title
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <TextField
                  label="YouTube Link"
                  variant="outlined"
                  fullWidth
                  value={youtubeLink}
                  onChange={handleYoutubeLinkChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="YouTube Title"
                  variant="outlined"
                  fullWidth
                  value={youtubeTitle}
                  onChange={handleYoutubeTitleChange}
                  required
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" type="submit">
                  Upload
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box style={styles.tableContainer}>
              <Typography variant="h4" component="div" gutterBottom>
                Logo Data
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Option</TableCell>
                      <TableCell>Deadline</TableCell>
                      <TableCell>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logoData && logoData.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.email}</TableCell>
                        <TableCell>{request.option}</TableCell>
                        <TableCell>{new Date(request.deadline).toLocaleString()}</TableCell>
                        <TableCell>{new Date(request.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
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

export default Admin;