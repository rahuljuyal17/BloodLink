import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import useAuthStore from './store/useAuthStore'
import useSocket from './hooks/useSocket'
import './index.css'

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    <div className="text-center max-w-3xl">
      <h1 className="text-7xl font-black text-gray-900 mb-6 drop-shadow-xl tracking-tighter leading-none">
        Every Drop Counts. <br />
        <span className="text-primary-600 italic">Every Second Matters.</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
        BloodLink is a high-precision real-time coordination platform designed to bridge the gap between life-saving donors and patients in critical need through <span className="text-primary-600 font-bold">intelligent geolocation matching.</span>
      </p>
      <div className="flex gap-6 justify-center">
        <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white font-black py-5 px-12 rounded-2xl shadow-2xl shadow-primary-200 transform transition hover:-translate-y-1 active:scale-95 text-lg">
          Get Started
        </Link>
        <Link to="/signup" className="bg-white hover:bg-gray-50 text-gray-900 font-black py-5 px-12 rounded-2xl shadow-xl border border-gray-100 transform transition hover:-translate-y-1 active:scale-95 text-lg">
          Join the Network
        </Link>
      </div>
    </div>
  </div>
)

function App() {
  const { isAuthenticated } = useAuthStore();
  useSocket();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
