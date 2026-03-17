import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Additional routes can be added here later */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/membership" element={<Membership />} /> */}
        {/* <Route path="/schedule" element={<Schedule />} /> */}
        {/* <Route path="/leaderboard" element={<Leaderboard />} /> */}
        {/* <Route path="/nutrition" element={<Nutrition />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
        {/* <Route path="/blog" element={<Blog />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </BrowserRouter>
  )
}