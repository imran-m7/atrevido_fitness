import { profileApi } from '../services/api'
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')
        const firstName = localStorage.getItem('firstName')
        const username = localStorage.getItem('username')
        const userId = localStorage.getItem('userId')
        const isActive = localStorage.getItem('isActive') === 'true'
        const profileImage = localStorage.getItem('profileImage') || null

        if (token && role) {
            setUser({ token, role, firstName, username, userId: userId ? parseInt(userId) : null, isActive, profileImage })
        }
        setLoading(false)
    }, [])

    const login = async (data) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        localStorage.setItem('firstName', data.firstName)
        localStorage.setItem('username', data.username || '')
        localStorage.setItem('userId', data.id)
        localStorage.setItem('isActive', data.isActive ? 'true' : 'false')

        let profileImage = null
        try {
            const profile = await profileApi.get()
            profileImage = profile.profileImageBase64 || null
            if (profileImage) localStorage.setItem('profileImage', profileImage)
        } catch { }

        setUser({
            token: data.token,
            role: data.role,
            firstName: data.firstName,
            username: data.username,
            userId: data.id,
            isActive: data.isActive,
            profileImage,
        })
    }

    const refreshStatus = async () => {
        const token = localStorage.getItem('token')
        if (!token) return
        try {
            const res = await fetch('https://localhost:7087/api/membership/mine', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.status === 401) {
                logout()
                return
            }
        } catch (err) {
            console.error('Greška pri provjeri statusa')
        }
    }

    const updateIsActive = (isActive) => {
        localStorage.setItem('isActive', isActive ? 'true' : 'false')
        setUser(prev => prev ? { ...prev, isActive } : null)
    }

    const updateProfile = (firstName, username, profileImage) => {
        localStorage.setItem('firstName', firstName)
        if (username) localStorage.setItem('username', username)
        if (profileImage !== undefined) {
            if (profileImage) localStorage.setItem('profileImage', profileImage)
            else localStorage.removeItem('profileImage')
        }
        setUser(prev => prev ? {
            ...prev,
            firstName,
            username: username || prev.username,
            ...(profileImage !== undefined ? { profileImage } : {})
        } : null)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('firstName')
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
        localStorage.removeItem('isActive')
        localStorage.removeItem('profileImage')
        setUser(null)
    }

    const isAdmin = () => user?.role === 'Admin'
    const isMember = () => user?.role === 'Member'
    const isLoggedIn = () => !!user
    const isAccountActive = () => user?.isActive === true

    return (
        <AuthContext.Provider value={{
            user, login, logout, isAdmin, isMember, isLoggedIn,
            isAccountActive, updateIsActive, refreshStatus, updateProfile, loading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth mora biti unutar AuthProvider')
    return ctx
}