import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';
// --- Layouts ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout'; // Ensure you have this

// --- Public Pages ---
import HomePage from './pages/HomePage.jsx';
import CoursesPage from './pages/CoursePage.jsx'; // Public Course List
import UpdatesPage from './pages/Updates.jsx'; // List View for Updates
import NotificationPage from './pages/Notification.jsx'; // Detail View for Updates
import SelectionPage from './pages/Selections.jsx'; // Hall of Fame (Results)
import CurrentAffairsPage from './pages/CurrentAffairsPage.jsx'; // New Page for Current Affairs
import CurrentAffairDetailPage from './pages/CurrentAffairDetailPage.jsx'; // Detail View for Current Affairs
import CourseDetailPage from './pages/CourseDetailpage.jsx'; // Detail View for Courses
import BookDemoPage from './pages/BookDemoPage.jsx';
// --- Admin Pages ---
import Login from './admin/Login';
import Dashboard from './admin/Dashboard.jsx';
import ManageCourses from './admin/ManageCourses';
import ManageUpdates from './admin/ManageUpdates';
import ManageResults from './admin/ManageResults'; // For Hall of Fame
import ManageCurrentAffairs from './admin/ManageCurrentAffairs'; // New Admin Page for Current Affairs
import ManageDemoRequests from './admin/ManageDemoRequests.jsx';
// --- Layout Wrapper for Public Pages ---
const PublicLayout = () => (
  <div className="font-sans text-gray-700 bg-white flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        
        {/* PUBLIC WEBSITE ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          
          {/* Updates & Notifications */}
          <Route path="/notifications" element={<UpdatesPage />} />
          <Route path="/notifications/:slug" element={<NotificationPage />} />
          
          {/* Current Affairs */}
          <Route path="/current-affairs" element={<CurrentAffairsPage />} />
          <Route path="/current-affairs/:slug" element={<CurrentAffairDetailPage />} />
          
          {/* Results / Hall of Fame */}
          <Route path="/book-demo" element={<BookDemoPage />} />
          <Route path="/Selections" element={<SelectionPage  />} />
        
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* Management Pages */}
          <Route path="courses" element={<ManageCourses />} />
          <Route path="updates" element={<ManageUpdates />} />
          <Route path="results" element={<ManageResults />} />
          <Route path="current-affairs" element={<ManageCurrentAffairs />} />
          <Route path="demo-requests" element={<ManageDemoRequests />} />
        
        </Route>

      </Routes>
    </Router>
  );
}

export default App;