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
    <div className="text-center max-w-2xl">
      <h1 className="text-6xl font-black text-primary-600 mb-6 drop-shadow-xl tracking-tighter">BloodLink</h1>
      <p className="text-xl text-gray-600 mb-8 leading-relaxed font-medium">
        Connecting lives in real-time. Find donors within <span className="text-primary-600 font-bold underline decoration-wavy">5km</span> during emergencies.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/login" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl transform transition hover:-translate-y-1 active:scale-95">
          Login
        </Link>
        <Link to="/signup" className="bg-white hover:bg-gray-50 text-primary-600 font-bold py-4 px-10 rounded-2xl shadow-xl border border-primary-100 transform transition hover:-translate-y-1 active:scale-95">
          Sign Up
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
