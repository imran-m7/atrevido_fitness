import React, { useEffect, useRef, useState } from 'react'
import { Trophy, Calendar, Users, Target, Medal, Flame, CheckCircle2 } from 'lucide-react'

function RankBadge({ rank }) {
  const base = 'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium'
  if (rank === 1) return <div className={`${base} bg-yellow-100 text-yellow-600`}><Medal size={16} /></div>
  if (rank === 2) return <div className={`${base} bg-gray-100 text-gray-600`}><Medal size={16} /></div>
  if (rank === 3) return <div className={`${base} bg-orange-100 text-orange-600`}><Medal size={16} /></div>
  return <div className={`${base} bg-muted text-muted-foreground`}>{rank}</div>
}

function getToken() {
  return localStorage.getItem('token') || ''
}

function getRequestErrorMessage(status, defaultMessage) {
  if (status === 401) return 'Morate biti prijavljeni.'
  if (status === 403) return 'Nemate dozvolu za pristup.'
  if (status === 500) return 'Greška na serveru.'
  return defaultMessage
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('bs-BA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function normalizeChallenge(challenge) {
  return {
    id: challenge?.id ?? challenge?.Id,
    title: challenge?.title ?? challenge?.Title ?? 'Izazov',
    description: challenge?.description ?? challenge?.Description ?? '',
    rules: challenge?.rules ?? challenge?.Rules ?? '',
    startDate: challenge?.startDate ?? challenge?.StartDate ?? challenge?.start ?? challenge?.Start ?? null,
    endDate: challenge?.endDate ?? challenge?.EndDate ?? challenge?.end ?? challenge?.End ?? null,
    type: challenge?.type ?? challenge?.Type ?? 'Izazov',
    participants: challenge?.participants ?? challenge?.Participants ?? challenge?.participantCount ?? challenge?.ParticipantCount ?? 0,
    progress: challenge?.progress ?? challenge?.Progress ?? 0,
    daysCompleted: challenge?.daysCompleted ?? challenge?.DaysCompleted ?? 0,
    totalDays: challenge?.totalDays ?? challenge?.TotalDays ?? 0,
    rank: challenge?.rank ?? challenge?.Rank ?? null,
    totalParticipants: challenge?.totalParticipants ?? challenge?.TotalParticipants ?? null,
    participationStatus: challenge?.participationStatus ?? challenge?.ParticipationStatus ?? null,
  }
}

function parseMyChallengesResponse(data) {
  if (Array.isArray(data)) {
    return {
      active: data.map(normalizeChallenge),
      completed: [],
      dropped: [],
    }
  }

  return {
    active: Array.isArray(data?.active)
      ? data.active.map(normalizeChallenge)
      : Array.isArray(data?.Active)
        ? data.Active.map(normalizeChallenge)
        : [],
    completed: Array.isArray(data?.completed)
      ? data.completed.map(normalizeChallenge)
      : Array.isArray(data?.Completed)
        ? data.Completed.map(normalizeChallenge)
        : [],
    dropped: Array.isArray(data?.dropped)
      ? data.dropped.map(normalizeChallenge)
      : Array.isArray(data?.Dropped)
        ? data.Dropped.map(normalizeChallenge)
        : [],
  }
}

export default function MemberChallenges() {
  const [activeChallenges, setActiveChallenges] = useState([])
  const [availableChallenges, setAvailableChallenges] = useState([])
  const [joiningChallengeId, setJoiningChallengeId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardMessage, setLeaderboardMessage] = useState(null)
  const isMountedRef = useRef(true)

  const apiUrl = import.meta.env.VITE_API_URL
  console.log('API URL:', apiUrl)

  async function fetchAvailableChallenges() {
    const token = getToken()
    console.log('Token found:', Boolean(token))

    if (!token) {
      throw new Error('Morate biti prijavljeni.')
    }

    const response = await fetch(`${apiUrl}/api/challenges/available`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('Available endpoint status:', response.status)

    if (!response.ok) {
      throw new Error(getRequestErrorMessage(response.status, 'Failed to fetch available challenges'))
    }

    const data = await response.json()
    console.log('Public challenges:', data)
    return Array.isArray(data) ? data.map(normalizeChallenge) : []
  }

  async function fetchMyChallenges() {
    const token = getToken()
    console.log('Token found:', Boolean(token))

    if (!token) {
      throw new Error('Morate biti prijavljeni.')
    }

    const response = await fetch(`${apiUrl}/api/challenges/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(getRequestErrorMessage(response.status, 'Failed to fetch member challenges'))
    }

    const data = await response.json()
    console.log('My challenges:', data)
    return parseMyChallengesResponse(data)
  }

  async function handleSelectChallenge(challenge) {
    if (!challenge?.id || !apiUrl) {
      setSelectedChallenge(challenge ?? null)
      setLeaderboard([])
      setLeaderboardMessage(null)
      return
    }

    const token = getToken()
    const leaderboardUrl = `${apiUrl}/api/challenges/${challenge.id}/leaderboard`

    console.log('Selected challenge id:', challenge.id)
    console.log('Leaderboard URL:', leaderboardUrl)

    setSelectedChallenge(challenge)
    setLeaderboardMessage(null)

    if (!token) {
      setLeaderboard([])
      setLeaderboardMessage('Morate biti prijavljeni.')
      return
    }

    try {
      const res = await fetch(leaderboardUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('Leaderboard status:', res.status)

      if (!res.ok) {
        const responseBody = await res.text()
        console.log('Leaderboard response body:', responseBody)

        throw new Error(responseBody || getRequestErrorMessage(res.status, 'Failed to fetch leaderboard'))
      }

      const data = await res.json()
      setLeaderboardMessage(null)
      setLeaderboard(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setLeaderboard([])
      setLeaderboardMessage(err.message || 'Failed to load leaderboard')
    }
  }

  async function loadChallenges(isMounted = () => true, preferredChallengeId = null) {
    if (!apiUrl) {
      if (!isMounted()) return
      setActiveChallenges([])
      setAvailableChallenges([])
      setSelectedChallenge(null)
      setLeaderboard([])
      setLeaderboardMessage(null)
      setError(null)
      setLoading(false)
      return
    }

    if (isMounted()) {
      setLoading(true)
      setError(null)
    }

    try {
      const [myResult, availableResult] = await Promise.all([
        fetchMyChallenges(),
        fetchAvailableChallenges(),
      ])

      if (!isMounted()) return

      const nextActiveChallenges = myResult.active
      const nextAvailableChallenges = availableResult

      setActiveChallenges(nextActiveChallenges)
      setAvailableChallenges(nextAvailableChallenges)

      const preferredId = preferredChallengeId ?? selectedChallenge?.id
      const allChallenges = [...nextActiveChallenges, ...nextAvailableChallenges]
      const nextSelectedChallenge =
        allChallenges.find((challenge) => challenge?.id === preferredId) ??
        nextActiveChallenges[0] ??
        nextAvailableChallenges[0] ??
        null

      if (nextSelectedChallenge) {
        await handleSelectChallenge(nextSelectedChallenge)
      } else {
        setSelectedChallenge(null)
        setLeaderboard([])
        setLeaderboardMessage(null)
      }
    } catch (loadError) {
      console.error('Error:', loadError)
      if (!isMounted()) return
      setActiveChallenges([])
      setAvailableChallenges([])
      setSelectedChallenge(null)
      setLeaderboard([])
      setLeaderboardMessage(null)
      setError(loadError.message || 'Failed to load challenges')
    } finally {
      if (isMounted()) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    isMountedRef.current = true

    loadChallenges(() => isMountedRef.current)

    return () => {
      isMountedRef.current = false
    }
  }, [apiUrl])

  async function joinChallenge(id) {
    const token = getToken()

    if (!apiUrl || !token) {
      setError('Morate biti prijavljeni.')
      return
    }

    try {
      if (!isMountedRef.current) return

      setJoiningChallengeId(id)
      setError(null)

      const response = await fetch(`${apiUrl}/api/challenges/${id}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const responseBody = await response.text()
        console.log('Join failed status:', response.status)
        console.log('Join failed body:', responseBody)
        throw new Error(responseBody || getRequestErrorMessage(response.status, 'Failed to join challenge'))
      }

      await loadChallenges(() => isMountedRef.current, id)
    } catch (joinError) {
      console.error('Error:', joinError)
      if (isMountedRef.current) {
        setError(joinError.message || 'Failed to join challenge')
      }
    } finally {
      if (isMountedRef.current) {
        setJoiningChallengeId(null)
      }
    }
  }

  async function leaveChallenge(id) {
    const token = getToken()

    if (!apiUrl || !token) {
      setError('Morate biti prijavljeni.')
      return
    }

    try {
      if (!isMountedRef.current) return

      setJoiningChallengeId(id)
      setError(null)

      const response = await fetch(`${apiUrl}/api/challenges/${id}/leave`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const responseBody = await response.text()
        throw new Error(responseBody || getRequestErrorMessage(response.status, 'Failed to leave challenge'))
      }

      await loadChallenges(() => isMountedRef.current, id)
    } catch (leaveError) {
      console.error('Error:', leaveError)
      if (isMountedRef.current) {
        setError(leaveError.message || 'Failed to leave challenge')
      }
    } finally {
      if (isMountedRef.current) {
        setJoiningChallengeId(null)
      }
    }
  }

  if (!apiUrl) {
    return <div>API not configured</div>
  }

  if (loading) {
    return <div>Loading challenges...</div>
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Izazovi</h1>
        <p className="text-muted-foreground">Prati svoje izazove i takmici se na rang-listi</p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Moji aktivni izazovi</h2>
            <div className="grid gap-4">
              {activeChallenges.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">No active challenges</p>
                </div>
              ) : (
                activeChallenges.map((c) => (
                  <div
                    key={c.id ?? c.title}
                    onClick={() => handleSelectChallenge(c)}
                    className={`cursor-pointer rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/30 ${selectedChallenge?.id === c.id ? 'ring-2 ring-primary/30' : ''}`}
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 size={12} /> Prijavljena
                        </span>
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
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{c.daysCompleted ?? 0}/{c.totalDays ?? 0} dana</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${c.progress ?? 0}%` }} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.progress ?? 0}% zavrseno</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        leaveChallenge(c.id)
                      }}
                      disabled={joiningChallengeId === c.id}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Target size={16} /> Napusti izazov
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Dostupni izazovi</h2>
            <div className="grid gap-4">
              {availableChallenges.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">No available challenges</p>
                </div>
              ) : (
                availableChallenges.map((c) => (
                  <div
                    key={c.id ?? c.title}
                    onClick={() => handleSelectChallenge(c)}
                    className={`cursor-pointer rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:bg-muted/30 ${selectedChallenge?.id === c.id ? 'ring-2 ring-primary/30' : ''}`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">{c.type}</span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground"><Users size={14} />{c.participants ?? 0} pridruzenih</span>
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-foreground">{c.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{c.description}</p>
                    <div className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar size={14} /> {formatDate(c.startDate)} - {formatDate(c.endDate)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        joinChallenge(c.id)
                      }}
                      disabled={joiningChallengeId === c.id}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <Target size={16} /> Pridruzi se izazovu
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
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
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  {leaderboardMessage}
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="px-4 py-6 text-sm text-muted-foreground">
                  Nema rezultata za prikaz.
                </div>
              ) : (
                leaderboard.map((entry, i) => (
                  <div
                    key={entry.userId}
                    className={[
                      'flex items-center justify-between px-4 py-3',
                      i < leaderboard.length - 1 ? 'border-b border-border' : '',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      <RankBadge rank={entry.rank} />
                      <p className="text-sm font-medium text-foreground">
                        #{entry.rank} - {entry.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame size={16} className="text-primary" />
                      <span className="font-semibold text-foreground">{entry.score}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}