import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import LoginPage from './components/Usermanagement/LoginPage';
import SignupPage from './components/Usermanagement/SignupPage';
// import AppBar from './components/Usermanagement/AppBar';
// import Admin from './components/Usermanagement/Admin';
// import SideDrawer from './components/SideDrawer';
// import ExistingUsersPage from './components/Usermanagement/ExistingUsersPage';
import ExistingUsersTable from './components/Usermanagement/ExistingUsersTable';
// import AppBarComponent from './components/Usermanagement/Appbar2';
// import DataDisplay from './components/Usermanagement/DataDisplay';
// import CheckRequest from './components/Usermanagement/CheckRequest';
import ProtectedRoute from './components/Usermanagement/ProtectedRoute';
import PdfViewer from './components/Resources/PdfViewer';
import Youtube from './components/Youtube';
import Formdata from './components/Resources/Formdata';
import Userdashboard from './components/Userdashboards/Userrequesting';

function App() {
  return (
    <Routes>
      <Route path="/accesscontrol" element={<LoginPage />} />
      <Route
        path="/accesscontrol/Formdata"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'User']}>
            <Formdata />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accesscontrol/Assign"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <SignupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accesscontrol/existing-users-table"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ExistingUsersTable />
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/accesscontrol/Appbar2"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'User', 'Maintainer']}>
            <AppBarComponent />
          </ProtectedRoute>
        }
      /> */}
      {/* <Route
        path="/accesscontrol/appbar"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'User', 'Maintainer']}>
            <AppBar />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/accesscontrol/Pdfviewer"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'User', 'Maintainer']} requiredOptions={['Pdfviewer']}>
            <PdfViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accesscontrol/Youtube"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'User', 'Maintainer']} requiredOptions={['Youtube']}>
            <Youtube />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accesscontrol/Formdata"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Maintainer']}>
            <Formdata />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accesscontrol/Userdashboard"
        element={
          <ProtectedRoute allowedRoles={['User']}>
            <Userdashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;