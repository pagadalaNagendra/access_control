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
import CheckRequest from './components/Usermanagement/CheckRequest';
import ProtectedRoute from './components/Usermanagement/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/Admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Assign"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <SignupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/existing-users"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ExistingUsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/existing-users-table"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ExistingUsersTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Appbar2"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'OH', 'CH', 'DH', 'SDH']}>
            <AppBarComponent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appbar"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'OH', 'CH', 'DH', 'SDH']}>
            <AppBar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sidedrawer"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'OH', 'CH', 'DH', 'SDH']}>
            <SideDrawer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/DataDisplay"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'OH', 'CH', 'DH', 'SDH']}>
            <DataDisplay />
          </ProtectedRoute>
        }
      />
      <Route
        path="/CheckRequest"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'OH', 'CH', 'DH', 'SDH']}>
            <CheckRequest />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;