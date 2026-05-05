import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, TrendingUp, Clock, Target, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { membershipApi, trainingRegistrationsApi, trainingSessionsApi } from '../../services/api'

export default function MemberDashboard() {
  const { user } = useAuth()
  const [membership, setMembership] = useState(null)
  const [myRegistrations, setMyRegistrations] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [mem, regs, sess] = await Promise.all([
          membershipApi.getMine(),
          trainingRegistrationsApi.getMine(),
          trainingSessionsApi.getAll(),
        ])
        setMembership(mem)
        setMyRegistrations(Array.isArray(regs) ? regs : [])
        setSessions(Array.isArray(sess) ? sess : [])
      } catch (err) {
        console.error('Greška pri učitavanju dashboarda', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Sljedeća rezervacija (prva buduća)
  const today = new Date().toISOString().split('T')[0]
  const upcomingRegs = myRegistrations
    .filter(r => r.sessionDate >= today && r.status === 'Registered')
    .sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))

  const nextReg = upcomingRegs[0]
  const nextSession = nextReg
    ? sessions.find(s => s.id === nextReg.trainingSessionId)
    : null

  // Rezervacije ovaj tjedan
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const weekRegs = myRegistrations.filter(r => {
    const d = new Date(r.sessionDate)
    return d >= weekStart && d <= weekEnd && r.status === 'Registered'
  })

  const getMembershipLabel = () => {
    if (!membership) return null
    if (membership.trainingType === 'Individual' && membership.nutritionEnabled)
      return 'Individualni + Ishrana'
    if (membership.trainingType === 'Individual') return 'Individualni Trening'
    return 'Grupni Trening'
  }

  const getMembershipColor = () => {
    if (!membership) return 'bg-gray-100 text-gray-600'
    if (membership.status === 'Active') return 'bg-green-100 text-green-700'
    if (membership.status === 'Pending') return 'bg-yellow-100 text-yellow-700'
    return 'bg-gray-100 text-gray-600'
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          Dobro došla nazad, {user?.firstName || 'Članice'}! 👋
        </h1>
        <p className="text-muted-foreground">Pregled tvojih aktivnosti</p>
      </div>

      {/* Membership status banner */}
      {membership?.status === 'Pending' && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <AlertCircle size={20} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Čekanje odobrenja</p>
            <p className="text-sm text-yellow-700 mt-0.5">
              Tvoja prijava za <strong>{getMembershipLabel()}</strong> čeka odobrenje od admina.
              Bit ćeš obaviještena čim bude aktivirana.
            </p>
          </div>
        </div>
      )}

      {!membership && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Nema aktivnog plana</p>
            <p className="text-sm text-blue-700 mt-0.5">
              Kontaktiraj admina za odabir trening programa.
            </p>
          </div>
        </div>
      )}

      {membership?.status === 'Active' && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Aktivno članstvo</p>
            <p className="text-sm text-green-700 mt-0.5">
              Tvoj plan: <strong>{getMembershipLabel()}</strong>
              {membership.nutritionEnabled}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <p className="text-sm font-medium text-muted-foreground">Plan</p>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getMembershipColor()}`}>
              {membership?.status === 'Active' ? 'Aktivan' :
                membership?.status === 'Pending' ? 'Na čekanju' : 'Nema plana'}
            </span>
          </div>
          <div className="text-lg font-bold text-foreground">{getMembershipLabel() || '—'}</div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <p className="text-sm font-medium text-muted-foreground">Treninzi ove sedmice</p>
            <div className="rounded-full bg-primary/10 p-2">
              <Calendar size={16} className="text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">{weekRegs.length}</div>
          <p className="text-xs text-muted-foreground mt-1">rezervisano</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <p className="text-sm font-medium text-muted-foreground">Ukupno treninga</p>
            <div className="rounded-full bg-primary/10 p-2">
              <TrendingUp size={16} className="text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {myRegistrations.filter(r => r.status === 'Registered').length}
          </div>
          <p className="text-xs text-muted-foreground mt-1">ukupno rezervisano</p>
        </div>
      </div>

      {/* Sljedeći trening + Upcoming */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Sljedeći trening */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Sljedeći trening</h3>
          </div>
          <div className="p-5">
            {nextReg && nextSession ? (
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <Calendar size={28} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{nextSession.groupName}</h4>
                  <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Clock size={14} />
                      {nextSession.startTime?.substring(0, 5)} – {nextSession.endTime?.substring(0, 5)}
                    </p>
                    <p>{new Date(nextReg.sessionDate).toLocaleDateString('bs-BA', {
                      weekday: 'long', day: 'numeric', month: 'long'
                    })}</p>
                    {nextSession.location && (
                      <span className="inline-block rounded border border-border px-2 py-0.5 text-xs">
                        {nextSession.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Nema nadolazećih treninga</p>
              </div>
            )}
            <Link to="/member/book"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
              Rezerviši trening <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Upcoming reservations */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h3 className="font-semibold text-foreground">Nadolazeće rezervacije</h3>
            <Link to="/member/book" className="text-sm font-medium text-primary hover:underline">
              Dodaj
            </Link>
          </div>
          <div className="p-5">
            {upcomingRegs.length > 0 ? (
              <div className="space-y-3">
                {upcomingRegs.slice(0, 4).map((reg) => {
                  const sess = sessions.find(s => s.id === reg.trainingSessionId)
                  return (
                    <div key={reg.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Calendar size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {sess?.groupName || 'Trening'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reg.sessionDate).toLocaleDateString('bs-BA', {
                            weekday: 'short', day: 'numeric', month: 'short'
                          })}
                          {sess && ` · ${sess.startTime?.substring(0, 5)}`}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 shrink-0">
                        Potvrđeno
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Target size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Nema rezervacija</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">Brze akcije</h3>
        </div>
        <div className="p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/member/book"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Calendar size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Rezerviši trening</p>
              <p className="text-xs text-muted-foreground">Odaberi termin</p>
            </div>
          </Link>
          <Link to="/member/progress"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Pregled napretka</p>
              <p className="text-xs text-muted-foreground">Tvoji rezultati</p>
            </div>
          </Link>
          {membership?.nutritionEnabled && (
            <Link to="/member/nutrition"
              className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Target size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Plan ishrane</p>
                <p className="text-xs text-muted-foreground">Tvoj nutritivni plan</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}