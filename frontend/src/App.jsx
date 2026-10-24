import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/marketing/LandingPage';
import CoursesCatalog from './pages/marketing/CoursesCatalog';
import PricingPage from './pages/marketing/PricingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/student/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import { useAuth } from './context/AuthContext';

import CourseDetailsPage from './pages/courses/CourseDetailsPage';
import CourseClassroomPage from './pages/courses/CourseClassroomPage';

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-[#02050e] dark:text-gray-100 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Marketing */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CoursesCatalog />} />
          <Route path="/courses/:slug" element={<CourseDetailsPage />} />
          <Route path="/courses/:slug/learn" element={<CourseClassroomPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Student Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
