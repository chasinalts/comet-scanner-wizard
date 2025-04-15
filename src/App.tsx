import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { WizardProvider } from './contexts/WizardContext';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import SuspenseFallback from './components/ui/SuspenseFallback';
import PerformanceMonitor from './components/dev/PerformanceMonitor';

// Lazy load page components
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ScannerWizard = lazy(() => import('./pages/ScannerWizard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <WizardProvider>
          <ThemeProvider>
            <ToastProvider>
              {/* Performance monitor (only visible in development) */}
              <PerformanceMonitor />
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <Layout>
                      <Suspense fallback={<SuspenseFallback message="Loading login page..." />}>
                        <Login />
                      </Suspense>
                    </Layout>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <Layout>
                      <Suspense fallback={<SuspenseFallback message="Loading signup page..." />}>
                        <Signup />
                      </Suspense>
                    </Layout>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/scanner"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<SuspenseFallback message="Loading scanner wizard..." />}>
                          <ScannerWizard />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Owner-Only Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireOwner>
                      <Layout>
                        <Suspense fallback={<SuspenseFallback message="Loading admin dashboard..." />}>
                          <AdminDashboard />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                {/* Redirect root to scanner or login based on auth state */}
                <Route
                  path="/"
                  element={<Navigate to="/scanner" replace />}
                />

                {/* Catch all route - redirect to scanner */}
                <Route
                  path="*"
                  element={<Navigate to="/scanner" replace />}
                />
              </Routes>
            </ToastProvider>
          </ThemeProvider>
        </WizardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;