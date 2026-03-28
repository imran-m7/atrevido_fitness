import React from 'react'
import { Outlet } from 'react-router-dom'
import MemberSidebar from '../components/MemberSidebar.jsx'

export default function MemberLayout() {
  return (
    <div className="min-h-screen bg-background">
      <MemberSidebar />
      <main className="pt-16 lg:ml-64 lg:pt-0">
        <Outlet />
      </main>
    </div>
  )
}
