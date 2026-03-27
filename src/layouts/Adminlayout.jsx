import React from 'react'
import { Outlet } from 'react-router-dom'
 
// Will be built in Sprint 4
// import AdminSidebar from '../components/AdminSidebar.jsx'
 
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* <AdminSidebar /> */}
      <main className="lg:pl-64">
        <Outlet />
      </main>
    </div>
  )
}