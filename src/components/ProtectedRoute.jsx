import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Zaštićena ruta — preusmjeri na login ako nije logovan
export function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if (requiredRole && user.role !== requiredRole) {
        // Preusmjeri na odgovarajući dashboard
        if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />
        return <Navigate to="/member/dashboard" replace />
    }

    return children
}