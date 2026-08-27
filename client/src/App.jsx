import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoadingState } from './components/LoadingState';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { InterviewSetup } from './pages/InterviewSetup';
import { InterviewRoom } from './pages/InterviewRoom';
import { InterviewHistory } from './pages/InterviewHistory';
import { Report } from './pages/Report';

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingState message="Checking authentication state..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

// Authenticated Layout Container
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF8F3]">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/setup"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <InterviewSetup />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <InterviewRoom />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviews"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <InterviewHistory />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/report/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Report />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
