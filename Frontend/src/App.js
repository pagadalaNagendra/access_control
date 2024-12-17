import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/Usermanagement/LoginPage';
import SignupPage from './components/Usermanagement/SignupPage';
import AppBar from './components/Usermanagement/AppBar';
import Admin from './components/Usermanagement/Admin';
import SideDrawer from './components/SideDrawer';
import ExistingUsersPage from './components/Usermanagement/ExistingUsersPage';
import ExistingUsersTable from './components/Usermanagement/ExistingUsersTable';
import AppBarComponent from './components/Usermanagement/Appbar2';
import DataDisplay from './components/Usermanagement/DataDisplay';
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/Admin" element={<Admin />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
      <Route path="/Assign" element={<SignupPage />} />
      <Route path="/existing-users" element={<ExistingUsersPage />} />
      <Route path="/existing-users" element={<ExistingUsersTable />} />
      <Route path="/Appbar2" element={<AppBarComponent />} />
      <Route path="/appbar" element={<AppBar />} />
      <Route path="/sidedrawer" element={<SideDrawer />} />
      <Route path="/DataDisplay" element={<DataDisplay />} />
    </Routes>
  );
}

export default App;