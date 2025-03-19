import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const currentUser = true
  return currentUser ? children : <Navigate to="/auth/login" replace />
}

export default ProtectedRoute