import React from 'react'
import { Outlet } from 'react-router-dom'
 
// These will be built in Sprint 2
// import PublicNavbar from '../components/PublicNavbar.jsx'
// import PublicFooter from '../components/PublicFooter.jsx'
 
export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* <PublicNavbar /> */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* <PublicFooter /> */}
    </div>
  )
}