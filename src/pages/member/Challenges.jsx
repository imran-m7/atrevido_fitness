import React, { useEffect, useRef, useState } from 'react'
import { Trophy, Calendar, Users, Target, Medal, Flame, CheckCircle2 } from 'lucide-react'
import { challengesApi } from '../../services/api'

function RankBadge({ rank }) {
  const base = 'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium'
  if (rank === 1) return <div className={`${base} bg-yellow-100 text-yellow-600`}><Medal size={16} /></div>
  if (rank === 2) return <div className={`${base} bg-gray-100 text-gray-600`}><Medal size={16} /></div>
  if (rank === 3) return <div className={`${base} bg-orange-100 text-orange-600`}><Medal size={16} /></div>
  return <div className={`${base} bg-muted text-muted-foreground`}>{rank}</div>
}

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('bs-BA', { day: 'numeric', month: 'long', year: 'numeric' })
}

function normalizeChallenge(c) {
  return {
    id: c.id ?? c.Id,
    title: c.title ?? c.Title ?? 'Izazov',
    description: c.description ?? c.Description ?? '',
    rules: c.rules ?? c.Rules ?? '',
    startDate: c.startDate ?? c.StartDate ?? null,
    endDate: c.endDate ?? c.EndDate ?? null,
    status: c.status ?? c.Status ?? '',
    type: 'Izazov',
    participants: c.participants ?? c.participantCount ?? c.ParticipantCount ?? 0,
    rank: c.rank ?? null,
    totalParticipants: c.totalParticipants ?? null,
    participationStatus: c.participationStatus ?? c.ParticipationStatus ?? null,
  }
}

function parseMyChallengesResponse(data) {
  if (Array.isArray(data)) return { active: data.map(normalizeChallenge), completed: [], dropped: [] }
  return {
    active: Array.isArray(data?.active) ? data.active.map(normalizeChallenge)
      : Array.isArray(data?.Active) ? data.Active.map(normalizeChallenge) : [],
    completed: Array.isArray(data?.completed) ? data.completed.map(normalizeChallenge)
      : Array.isArray(data?.Completed) ? data.Completed.map(normalizeChallenge) : [],
    dropped: Array.isArray(data?.dropped) ? data.dropped.map(normalizeChallenge)
      : Array.isArray(data?.Dropped) ? data.Dropped.map(normalizeChallenge) : [],
  }
}

export default function MemberChallenges() {
  const [activeChallenges, setActiveChallenges] = useState([])
  const [availableChallenges, setAvailableChallenges] = useState([])
  const [completedChallenges, setCompletedChallenges] = useState([])
  const [joiningChallengeId, setJoiningChallengeId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardMessage, setLeaderboardMessage] = useState(null)
  const isMountedRef = useRef(true)

  async function fetchLeaderboard(challenge) {
    if (!challenge?.id) { setLeaderboard([]); setLeaderboardMessage(null); return }
    setLeaderboard([])
    setLeaderboardMessage(null)
    try {
      const data = await challengesApi.getLeaderboard(challenge.id)
      setLeaderboard(Array.isArray(data) ? data : [])
    } catch (err) {
      setLeaderboard([])
      setLeaderboardMessage(err.message || 'Greška pri učitavanju rang-liste')
    }
  }

  async function handleSelectChallenge(challenge) {
    setSelectedChallenge(challenge ?? null)
    await fetchLeaderboard(challenge)
  }

  async function loadChallenges(isMounted = () => true, preferredId = null) {
    if (isMounted()) { setLoading(true); setError(null) }
    try {
      const [myResult, availableResult] = await Promise.all([
        challengesApi.getMy(),
        challengesApi.getAvailable(),
      ])
      if (!isMounted()) return
      const parsed = parseMyChallengesResponse(myResult)
      const available = Array.isArray(availableResult) ? availableResult.map(normalizeChallenge) : []
      setActiveChallenges(parsed.active)
      setAvailableChallenges(available)
      setCompletedChallenges(parsed.completed)
      const pref = preferredId ?? selectedChallenge?.id
      const all = [...parsed.active, ...available, ...parsed.completed]
      const next = all.find(c => c?.id === pref) ?? parsed.active[0] ?? available[0] ?? null
      if (next) await handleSelectChallenge(next)
      else { setSelectedChallenge(null); setLeaderboard([]); setLeaderboardMessage(null) }
    } catch (err) {
      if (!isMounted()) return
      setActiveChallenges([]); setAvailableChallenges([]); setCompletedChallenges([])
      setSelectedChallenge(null); setLeaderboard([]); setLeaderboardMessage(null)
      setError(err.message || 'Greška pri učitavanju izazova')
    } finally {
      if (isMounted()) setLoading(false)
    }
  }

  useEffect(() => {
    isMountedRef.current = true
    loadChallenges(() => isMountedRef.current)
    return () => { isMountedRef.current = false }
  }, [])

  async function joinChallenge(id) {
    setJoiningChallengeId(id); setError(null)
    try {
      await challengesApi.join(id)
      await loadChallenges(() => isMountedRef.current, id)
    } catch (err) {
      if (isMountedRef.current) setError(err.message || 'Greška pri prijavi.')
    } finally {
      if (isMountedRef.current) setJoiningChallengeId(null)
    }
  }

  async function leaveChallenge(id) {
    setJoiningChallengeId(id); setError(null)
    try {
      await challengesApi.leave(id)
      await loadChallenges(() => isMountedRef.current, id)
    } catch (err) {
      if (isMountedRef.current) setError(err.message || 'Greška pri odjavi.')
    } finally {
      if (isMountedRef.current) setJoiningChallengeId(null)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Učitavanje izazova...</div>

  const activeMonthlyChallenges = [...activeChallenges, ...availableChallenges]

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Izazovi</h1>
        <p className="text-muted-foreground">Prati svoje izazove i takmici se na rang-listi</p>
      </div>
      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Aktivni */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Aktivni mjesečni izazov</h2>
            <div className="grid gap-4">
              {activeMonthlyChallenges.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">Nema aktivnog mjesečnog izazova</p>
                </div>
              ) : activeMonthlyChallenges.map(c => (
                <div key={c.id ?? c.title} onClick={() => handleSelectChallenge(c)}
                  className={`cursor-pointer rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/30 ${selectedChallenge?.id === c.id ? 'ring-2 ring-primary/30' : ''}`}>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      {c.participationStatus === 'Active' && (
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 size={12} /> Prijavljena
                        </span>
                      )}
                      <h3 className="text-lg font-semibold text-foreground">{c.title}</h3>
                    </div>
                    <div className="ml-4 shrink-0 text-right">
                      <p className="text-2xl font-bold text-primary">{c.rank ? `#${c.rank}` : '-'}</p>
                      <p className="text-xs text-muted-foreground">{c.totalParticipants ? `of ${c.totalParticipants}` : '-'}</p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">{c.description}</p>
                  <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar size={14} /> {formatDate(c.startDate)} - {formatDate(c.endDate)}
                  </div>
                  {c.participationStatus === 'Active' ? (
                    <button onClick={e => { e.stopPropagation(); leaveChallenge(c.id) }}
                      disabled={joiningChallengeId === c.id}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70">
                      <Target size={16} /> Napusti izazov
                    </button>
                  ) : (
                    <button onClick={e => { e.stopPropagation(); joinChallenge(c.id) }}
                      disabled={joiningChallengeId === c.id}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70">
                      <Target size={16} /> Pridruzi se izazovu
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Prosli */}
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Prošli izazovi</h2>
            <div className="grid gap-4">
              {completedChallenges.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">Nema prošlih izazova</p>
                </div>
              ) : completedChallenges.map(c => (
                <div key={c.id ?? c.title} onClick={() => handleSelectChallenge(c)}
                  className={`cursor-pointer rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/30 ${selectedChallenge?.id === c.id ? 'ring-2 ring-primary/30' : ''}`}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{c.type}</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users size={14} />{c.participants} pridruzenih</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{c.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{c.description}</p>
                  <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar size={14} /> {formatDate(c.startDate)} - {formatDate(c.endDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Rang-lista */}
        <div>
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="border-b border-border p-5">
              <div className="mb-1 flex items-center gap-2">
                <Trophy size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">Rang-lista</h3>
              </div>
              <p className="text-sm text-muted-foreground">{selectedChallenge?.title ?? 'Odaberi izazov'}</p>
            </div>
            <div>
              {leaderboardMessage ? (
                <div className="px-4 py-6 text-sm text-muted-foreground">{leaderboardMessage}</div>
              ) : leaderboard.length === 0 ? (
                <div className="px-4 py-6 text-sm text-muted-foreground">Nema rezultata za prikaz.</div>
              ) : leaderboard.map((entry, i) => (
                <div key={entry.userId}
                  className={['flex items-center justify-between px-4 py-3', i < leaderboard.length - 1 ? 'border-b border-border' : ''].join(' ')}>
                  <div className="flex items-center gap-3">
                    <RankBadge rank={entry.rank} />
                    <p className="text-sm font-medium text-foreground">#{entry.rank} - {entry.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame size={16} className="text-primary" />
                    <span className="font-semibold text-foreground">{entry.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
