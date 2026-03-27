import React from 'react'
import { Outlet } from 'react-router-dom'
 
// Will be built in Sprint 3
// import MemberSidebar from '../components/MemberSidebar.jsx'
 
export default function MemberLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* <MemberSidebar /> */}
      <main className="lg:pl-64">
        <Outlet />
      </main>
    </div>
  )
}