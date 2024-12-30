import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/Usermanagement/LoginPage';
import SignupPage from './components/Usermanagement/SignupPage';
import ExistingUsersTable from './components/Usermanagement/ExistingUsersTable';
import ProtectedRoute from './components/Usermanagement/ProtectedRoute';
import PdfViewer from './components/Resources/PdfViewer';
import Youtube from './components/Resources/Youtube';
import Formdata from './components/Resources/Formdata';
import Userdashboard from './components/Userdashboards/Userrequesting';

function App() {
  return (
    <Routes>
      <Route path="/resources" element={<LoginPage />} />
      <Route
        path="/resources/Formdata"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Maintainer']}>
            <Formdata />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/Assign"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <SignupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/existing-users-table"
        element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ExistingUsersTable />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/Pdfviewer"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'User', 'Maintainer']} requiredOptions={['Pdfviewer']}>
            <PdfViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/Youtube"
        element={
          <ProtectedRoute allowedRoles={['Admin', 'User', 'Maintainer']} requiredOptions={['Youtube']}>
            <Youtube />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/Userdashboard"
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