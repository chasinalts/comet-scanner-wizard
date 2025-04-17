import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { WizardProvider } from './contexts/WizardContext';
import { ToastProvider } from './components/ui/Toast';
import { ThemeProvider } from './contexts/ThemeContext';
import { SupabaseProvider } from './components/SupabaseProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import SuspenseFallback from './components/ui/SuspenseFallback';
import PerformanceMonitor from './components/dev/PerformanceMonitor';
import DebugConsole from './components/dev/DebugConsole';

// Lazy load page components with prefetching
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ScannerWizard = lazy(() => import('./pages/ScannerWizard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Prefetch components after initial load
const prefetchComponents = () => {
  // Wait for the main page to load first
  window.addEventListener('load', () => {
    // Use setTimeout to delay prefetching until after the main page is interactive
    setTimeout(() => {
      // Prefetch other routes in the background
      import('./pages/Login');
      import('./pages/Signup');
      import('./pages/AdminDashboard');
    }, 2000);
  });
};

// Call prefetch function
prefetchComponents();

function App() {
  return (
    <Router>
      <SupabaseProvider>
        <AuthProvider>
          <WizardProvider>
            <ThemeProvider>
              <ToastProvider>
                {/* Development tools (only visible in development) */}
                <PerformanceMonitor />
                <DebugConsole />
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
    </SupabaseProvider>
  </Router>
  );
}

export default App;