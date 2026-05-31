import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar.jsx'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="pt-16 lg:ml-64 lg:pt-0">
        <Outlet />
      </main>
    </div>
  )
}