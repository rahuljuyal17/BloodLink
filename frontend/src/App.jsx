import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import './index.css'

// Placeholder for components we will build
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    <div className="text-center max-w-2xl">
      <h1 className="text-5xl font-extrabold text-primary-600 mb-6 drop-shadow-sm">BloodLink</h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        Real-Time Emergency Blood Donation Platform. Connect with donors within minutes.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:-translate-y-1">
          Login
        </Link>
        <Link to="/signup" className="bg-white hover:bg-gray-50 text-primary-600 font-bold py-3 px-8 rounded-full shadow-lg border border-primary-200 transform transition hover:-translate-y-1">
          Sign Up
        </Link>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
