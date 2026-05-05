import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Layouts
import PublicLayout from './layouts/PublicLayout.jsx'
import MemberLayout from './layouts/MemberLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'

// Public pages
import Home from './pages/public/Home.jsx'
import About from './pages/public/About.jsx'
import Programs from './pages/public/Programs.jsx'
import Blog from './pages/public/Blog.jsx'
import BlogDetail from './pages/public/BlogDetail.jsx'
import Contact from './pages/public/Contact.jsx'
import Login from './pages/public/Login.jsx'
import Register from './pages/public/Register.jsx'

// Member pages
import MemberDashboard from './pages/member/Dashboard.jsx'
import MemberSchedule from './pages/member/Schedule.jsx'
import MemberBook from './pages/member/Book.jsx'
import MemberChallenges from './pages/member/Challenges.jsx'
import MemberProgress from './pages/member/Progress.jsx'
import MemberNutrition from './pages/member/Nutrition.jsx'
import MemberBlog from './pages/member/Blog.jsx'
import MemberProfile from './pages/member/Profile.jsx'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard.jsx'
import AdminTrainings from './pages/admin/Trainings.jsx'
import AdminMembers from './pages/admin/Members.jsx'
import AdminProgress from './pages/admin/Progress.jsx'
import AdminChallenges from './pages/admin/Challenges.jsx'
import AdminNutrition from './pages/admin/Nutrition.jsx'
import AdminBlog from './pages/admin/Blog.jsx'
import AdminReports from './pages/admin/Reports.jsx'
import AdminSettings from './pages/admin/Settings.jsx'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ── Public routes ─────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Member routes (zaštićene) ──────────────── */}
          <Route
            path="/member"
            element={
              <ProtectedRoute requiredRole="Member">
                <MemberLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/member/dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="schedule" element={<MemberSchedule />} />
            <Route path="book" element={<MemberBook />} />
            <Route path="challenges" element={<MemberChallenges />} />
            <Route path="progress" element={<MemberProgress />} />
            <Route path="nutrition" element={<MemberNutrition />} />
            <Route path="blog" element={<MemberBlog />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>

          {/* ── Admin routes (zaštićene) ───────────────── */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="trainings" element={<AdminTrainings />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="progress" element={<AdminProgress />} />
            <Route path="challenges" element={<AdminChallenges />} />
            <Route path="nutrition" element={<AdminNutrition />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* ── Fallback ──────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}