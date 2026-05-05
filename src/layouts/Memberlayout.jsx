import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import MemberSidebar from '../components/MemberSidebar.jsx'
import { useAuth } from '../context/AuthContext'
import { membershipApi } from '../services/api'
import { AlertCircle, Clock, LogOut } from 'lucide-react'

export default function MemberLayout() {
  const { user, logout, updateIsActive } = useAuth()
  const navigate = useNavigate()
  const [membershipStatus, setMembershipStatus] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Provjeri membership status iz baze svaki put
        const mem = await membershipApi.getMine()
        setMembershipStatus(mem)
      } catch (err) {
        // 401 — token invalid ili user deaktiviran
        if (err.message?.includes('401') || err.message?.includes('403')) {
          logout()
          navigate('/login')
        }
      } finally {
        setChecking(false)
      }
    }
    checkStatus()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // User nije aktivan (isActive = false u bazi)
  if (!user?.isActive) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-sm">
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <Clock size={32} className="text-yellow-600" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              {membershipStatus?.status === 'Pending' || !membershipStatus
                ? 'Čekanje odobrenja'
                : 'Račun deaktiviran'}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {membershipStatus?.status === 'Pending' || !membershipStatus
                ? 'Vaša prijava je primljena i čeka odobrenje od admina. Bit ćete obaviješteni kada admin aktivira vaš račun.'
                : 'Vaš račun je trenutno deaktiviran. Kontaktirajte admina za više informacija.'}
            </p>
            <div className="rounded-lg border border-border bg-muted/30 p-4 mb-6 text-left">
              <p className="text-xs text-muted-foreground font-medium mb-2">Detalji računa:</p>
              <p className="text-sm text-foreground">
                <span className="text-muted-foreground">Ime: </span>
                {user?.firstName}
              </p>
              {membershipStatus && (
                <p className="text-sm text-foreground mt-1">
                  <span className="text-muted-foreground">Plan: </span>
                  {membershipStatus.trainingType === 'Individual' && membershipStatus.nutritionEnabled
                    ? 'Individualni + Ishrana'
                    : membershipStatus.trainingType === 'Individual'
                      ? 'Individualni trening'
                      : 'Grupni trening'}
                </p>
              )}
              <p className="text-sm mt-1">
                <span className="text-muted-foreground">Status: </span>
                <span className="text-yellow-600 font-medium">
                  {membershipStatus?.status === 'Active' ? 'Aktivan' :
                    membershipStatus?.status === 'Pending' ? 'Na čekanju' : 'Neaktivan'}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <LogOut size={16} />
              Odjava
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Membership nije aktivan (isActive=true ali membership Inactive/Pending)
  if (membershipStatus && membershipStatus.status !== 'Active') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-card shadow-sm">
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <AlertCircle size={32} className="text-yellow-600" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              {membershipStatus.status === 'Pending' ? 'Čekanje odobrenja' : 'Membership neaktivan'}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">
              {membershipStatus.status === 'Pending'
                ? 'Vaša prijava čeka odobrenje od admina. Bit ćete obaviješteni kada se aktivira.'
                : 'Vaš membership je deaktiviran. Kontaktirajte admina za više informacija.'}
            </p>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <LogOut size={16} />
              Odjava
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MemberSidebar />
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  )
}