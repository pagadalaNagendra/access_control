import React, { useState, useRef, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Dialog, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Analytics from "@mui/icons-material/Analytics";
import ReplayIcon from "@mui/icons-material/Replay";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import YouTubeIcon from "@mui/icons-material/YouTube";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import logo from "./Usermanagement/logos.png";
// import logos from "./logos3.png";
import "./Adminnavbar.css";

const styles = {
  appBar: {
    backgroundColor: "#123462",
    zIndex: 1201,
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: 50,
    marginRight: 16,
  },
  logos:{
    height: 70,
    marginRight: 16,
  },
  title: {
    flexGrow: 1,
    textAlign: "center",
    color: "#fff",
  },
  drawer: {
    width: 250,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 250,
    marginTop: 64,
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
};

const Adminnavbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sessionTimeoutAlert, setSessionTimeoutAlert] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const navigate = useNavigate();
  const sessionTimer = useRef(null);

  useEffect(() => {
    // Retrieve user role and options from localStorage
    const role = localStorage.getItem("role");
    const options = JSON.parse(localStorage.getItem("options")) || [];
    setUserRole(role);
    setUserOptions(options.map((option) => option.option));

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
    localStorage.clear();
    handleClose();
    navigate("/resources");
  };

  return (
    <Box>
      <AppBar position="fixed" style={styles.appBar}>
        <Toolbar style={styles.toolbar}>
          <IconButton color="inherit" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          {/* <img src={logos} alt="Logos" style={styles.logos} /> */}
         <img src={logo} alt="Logo" style={styles.logo} />
         
          <Typography variant="h5" component="div" style={styles.title}>
          References
          </Typography>

          <IconButton color="inherit" onClick={handleUserClick}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose} sx={{ ...styles.drawer, ...styles.drawerPaper }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 1 }}>
          <IconButton color="inherit" onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {userRole === "Admin" && (
            <>
              <ListItem button component={Link} to="/resources/Pdfviewer">
                <ListItemIcon>
                  <PictureAsPdfIcon />
                </ListItemIcon>
                <ListItemText primary="Pdfviewer" />
              </ListItem>
              <ListItem button component={Link} to="/resources/Youtube">
                <ListItemIcon>
                  <YouTubeIcon />
                </ListItemIcon>
                <ListItemText primary="Youtube" />
              </ListItem>
              <ListItem button component={Link} to="/resources/Assign">
                <ListItemIcon>
                  <PersonAddAltIcon />
                </ListItemIcon>
                <ListItemText primary="Assign" />
              </ListItem>
            </>
          )}
          {userRole === "User" && (
            <>
              {/* {userOptions.includes('Youtube') && ( */}
              <ListItem button component={Link} to="/resources/Youtube">
                <ListItemIcon>
                  <YouTubeIcon />
                </ListItemIcon>
                <ListItemText primary="Youtube" />
              </ListItem>

              {/* {userOptions.includes('Pdfviewer') && ( */}
              <ListItem button component={Link} to="/resources/Pdfviewer">
                <ListItemIcon>
                  <PictureAsPdfIcon />
                </ListItemIcon>
                <ListItemText primary="Pdfviewer" />
              </ListItem>
            </>
          )}
          {userRole === "Maintainer" && (
            <>
              <ListItem button component={Link} to="/resources/Pdfviewer">
                <ListItemIcon>
                  <PictureAsPdfIcon />
                </ListItemIcon>
                <ListItemText primary="Pdfviewer" />
              </ListItem>
              <ListItem button component={Link} to="/resources/Youtube">
                <ListItemIcon>
                  <YouTubeIcon />
                </ListItemIcon>
                <ListItemText primary="Youtube" />
              </ListItem>
              <ListItem button component={Link} to="/resources/Formdata">
                <ListItemIcon>
                  <Analytics />
                </ListItemIcon>
                <ListItemText primary="Formdata" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
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
        <Button variant="contained" color="primary" onClick={handleSessionTimeoutAlertClose} autoFocus>
          OK
        </Button>
      </Dialog>
    </Box>
  );
};

export default Adminnavbar;
