import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import config from "../config";

const UpdateUserDialog = ({ open, user, onClose, onSubmit, onInputChange }) => {
  const roles = ["Admin", "User"]; // List of roles

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update User</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select label="Role" name="role" value={user.role} onChange={onInputChange}>
                {roles.map((role, index) => (
                  <MenuItem key={index} value={role.toLowerCase()}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ExistingUsersTable = forwardRef((props, ref) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const rowsPerPage = 3;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.backendAPI}/auth/`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchUsers,
  }));

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(0); // Reset page to 0 when search results change
  }, [users, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedUser),
      });

      if (response.ok) {
        fetchUsers();
        setOpenDialog(false);
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevState) => ({
      ...prevState,
      [name]: value.toLowerCase(), // Convert the input value to lowercase
    }));
  };

  return (
    <Box
      sx={{
        border: "1px solid grey",
        padding: 2,
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
        width: "74%", // Reduced the width to make the container smaller
        margin: "20px auto", // Added margin to move the container up
        marginTop: "0px",
      }}
    >
      <Typography variant="h5" align="center" component="div" gutterBottom style={{ color: "#333" }}>
        Existing Users
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        <TextField label="Search by User" variant="outlined" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} size="small" style={{ maxWidth: "200px" }} />
      </Box>
      <TableContainer component={Paper} style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
        <Table aria-label="existing users table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
              <TableRow key={index} hover>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button onClick={() => handleUpdateClick(user)}>Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
        <Typography variant="body1" style={{ color: "#333" }}>
          Page {page + 1} of {totalPages}
        </Typography>
        <Box>
          <Button variant="contained" disabled={page === 0} onClick={() => setPage(page - 1)} style={{ backgroundColor: "#333", color: "#fff" }}>
            Prev
          </Button>
          <Button variant="contained" disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} style={{ backgroundColor: "#333", color: "#fff", marginLeft: "8px" }}>
            Next
          </Button>
        </Box>
      </Box>

      {/* Use the UpdateUserDialog component */}
      <UpdateUserDialog open={openDialog} user={selectedUser} onClose={handleDialogClose} onSubmit={handleDialogSubmit} onInputChange={handleInputChange} />
    </Box>
  );
});

export default ExistingUsersTable;
