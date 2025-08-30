import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BoardView from './pages/BoardView';
import WorkspaceDetails from './pages/WorkspaceDetails';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/workspaces/:id" element={<ProtectedRoute><WorkspaceDetails /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/board/:id" element={<ProtectedRoute><BoardView /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
