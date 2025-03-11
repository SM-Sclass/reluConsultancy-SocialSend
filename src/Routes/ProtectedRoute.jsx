import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const currentUser = true
  return currentUser ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute