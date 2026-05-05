import React, { useState, useEffect } from 'react'
import { Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react'
import { membershipApi, trainingSessionsApi, trainingRegistrationsApi } from '../../services/api'

const englishToBosanski = {
  Monday: 'Ponedjeljak', Tuesday: 'Utorak', Wednesday: 'Srijeda',
  Thursday: 'Četvrtak', Friday: 'Petak', Saturday: 'Subota', Sunday: 'Nedjelja'
}

// Radno vrijeme — null = zatvoreno

const kraткiDan = {
  Monday: 'Pon', Tuesday: 'Uto', Wednesday: 'Sri',
  Thursday: 'Čet', Friday: 'Pet', Saturday: 'Sub', Sunday: 'Ned'
}
const kraткiMjesec = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

const puniMjesec = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']

const workingHours = {
  Monday: ['07:00–09:00', '16:30–20:15'],
  Tuesday: ['08:00–09:00', '17:00–19:00'],
  Wednesday: ['07:00–09:00', '16:30–20:15'],
  Thursday: ['08:00–09:00', '17:00–19:00'],
  Friday: ['07:00–09:00', '16:30–20:15'],
  Saturday: null,
  Sunday: null,
}

// Vrati ponedjeljak za sedmicu sa offsetom (0 = ova, 1 = sljedeća...)
function getWeekStart(offset = 0) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = today.getDay() // 0=Ned, 1=Pon ... 6=Sub
  // Koliko dana nazad do ponedjeljka
  const diffToMon = day === 0 ? -6 : 1 - day
  const mon = new Date(today)
  mon.setDate(today.getDate() + diffToMon + offset * 7)
  return mon
}

// Generiši 7 dana sedmice počevši od weekStart (ponedjeljak)
function getWeekDays(weekStart) {
  const engDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    const engDay = engDays[i]
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const dayNum = String(d.getDate()).padStart(2, '0')
    return {
      dateKey: `${year}-${month}-${dayNum}`,
      bosDay: englishToBosanski[engDay],
      engDay,
      dayNum: d.getDate(),
      isClosed: workingHours[engDay] === null,
    }
  })
}

function getWeekLabel(weekStart) {
  const end = new Date(weekStart)
  end.setDate(weekStart.getDate() + 6)
  const fmt = (d) => `${d.getDate()}. ${['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'][d.getMonth()]}`
  return `${fmt(weekStart)} – ${fmt(end)}`
}

// Uvijek prikazuj ovu sedmicu
function getInitialOffset() {
  return 0
}


// Provjeri da li je konkretan termin (datum + vrijeme) vec prosao
function isSessionTimePast(dateKey, startTime) {
  if (!startTime) return false
  const now = new Date()
  const today = now.toISOString().split('T')[0]

  // Ako je datum u proslosti - definitivno prosao
  if (dateKey < today) return true

  // Ako je danas - provjeri sat
  if (dateKey === today) {
    const [hours, minutes] = startTime.substring(0, 5).split(':').map(Number)
    const sessionTime = new Date()
    sessionTime.setHours(hours, minutes, 0, 0)
    return now >= sessionTime
  }

  // Buduci datum - nije prosao
  return false
}

export default function MemberBook() {
  const [sessions, setSessions] = useState([])
  const [myRegistrations, setMyRegistrations] = useState([])
  const [membership, setMembership] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingId, setBookingId] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  const weekOffset = 0
  const weekStart = getWeekStart(0)
  const weekDays = getWeekDays(weekStart)

  // Defaultni odabrani dan — prvi dostupni radni dan u sedmici
  const getDefaultDay = (days) =>
    days.find(d => !d.isClosed && d.dateKey >= today)?.dateKey || days.find(d => !d.isClosed)?.dateKey

  const [selectedDateKey, setSelectedDateKey] = useState(() => {
    const offset = getInitialOffset()
    return getDefaultDay(getWeekDays(getWeekStart(offset)))
  })

  const fetchData = async () => {
    try {
      const [sessData, regData, memData] = await Promise.all([
        trainingSessionsApi.getAll(),
        trainingRegistrationsApi.getMine(),
        membershipApi.getMine(),
      ])
      setSessions(Array.isArray(sessData) ? sessData : [])
      setMyRegistrations(Array.isArray(regData) ? regData : [])
      setMembership(memData)
    } catch (err) {
      console.error('Greška pri učitavanju')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const selectedDay = weekDays.find(d => d.dateKey === selectedDateKey)
  const isPastDay = selectedDateKey < today

  // Sesije za izabrani dan filtrirane po membership tipu
  const daySessions = sessions.filter(s => {
    if (!selectedDay) return false
    if (s.dayOfWeek !== selectedDay.engDay) return false
    if (!membership || membership.status !== 'Active') return false
    if (membership.trainingType === 'Group') return s.type === 'Group'
    if (membership.trainingType === 'Individual') return s.type === 'Individual'
    return true
  })

  const isBooked = (sessionId) =>
    myRegistrations.some(r =>
      r.trainingSessionId === sessionId &&
      r.sessionDate === selectedDateKey &&
      r.status === 'Registered'
    )

  // Da li user ima rezervisan DRUGI termin za taj datum
  const hasOtherBookingThatDay = (sessionId) =>
    myRegistrations.some(r =>
      r.sessionDate === selectedDateKey &&
      r.status === 'Registered' &&
      r.trainingSessionId !== sessionId
    )

  const getRegistrationId = (sessionId) =>
    myRegistrations.find(r =>
      r.trainingSessionId === sessionId &&
      r.sessionDate === selectedDateKey &&
      r.status === 'Registered'
    )?.id

  const handleBook = async (session) => {
    if (!membership || membership.status !== 'Active' || isPastDay) return
    if (isSessionTimePast(selectedDateKey, session.startTime)) return
    const booked = isBooked(session.id)
    setBookingId(session.id)
    try {
      if (booked) {
        await trainingRegistrationsApi.cancel(getRegistrationId(session.id))
      } else {
        await trainingRegistrationsApi.book(session.id, selectedDateKey)
      }
      await fetchData()
    } catch (err) {
      alert(err.message || 'Greška pri rezervaciji.')
    } finally {
      setBookingId(null)
    }
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )

  if (!membership || membership.status !== 'Active') {
    return (
      <div className="p-4 lg:p-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl mb-8">Rezervacija treninga</h1>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 flex items-start gap-4">
          <AlertCircle size={24} className="text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">
              {membership?.status === 'Pending' ? 'Čekanje odobrenja' : 'Nema aktivnog plana'}
            </h3>
            <p className="text-sm text-yellow-700">
              {membership?.status === 'Pending'
                ? 'Tvoja prijava čeka odobrenje od admina.'
                : 'Kontaktiraj admina za odabir trening programa.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Rezervacija treninga</h1>
        <p className="text-muted-foreground">
          Tvoj plan:{' '}
          <span className="font-medium text-foreground">
            {membership.trainingType === 'Group' ? 'Grupni treninzi'
              : membership.nutritionEnabled ? 'Individualni + Ishrana'
                : 'Individualni treninzi'}
          </span>
        </p>
      </div>

      {/* ── Sedmica info ── */}
      <div className="mb-6 rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Ova sedmica</p>
          <p className="font-semibold text-foreground mt-0.5">{getWeekLabel(weekStart)}</p>
        </div>
      </div>

      {/* ── Tabovi za dane ── */}
      <div className="mb-6 grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const isPast = day.dateKey < today
          const isSelected = selectedDateKey === day.dateKey
          const isToday = day.dateKey === today
          const isDisabled = day.isClosed || isPast

          // Ima li treninga za ovaj dan (prema membership tipu)
          const hasSessions = sessions.some(s =>
            s.dayOfWeek === day.engDay &&
            (membership.trainingType === 'Group' ? s.type === 'Group' : s.type === 'Individual')
          )

          return (
            <button
              key={day.dateKey}
              onClick={() => !isDisabled && setSelectedDateKey(day.dateKey)}
              disabled={isDisabled}
              className={`flex flex-col items-center rounded-lg py-3 px-1 text-center transition-colors border
                ${isSelected
                  ? 'bg-primary text-primary-foreground border-primary'
                  : isToday && !isDisabled
                    ? 'border-primary bg-primary/10 text-foreground'
                    : isDisabled
                      ? 'border-border bg-muted/20 text-muted-foreground cursor-not-allowed opacity-40'
                      : 'border-border bg-card text-foreground hover:bg-muted'
                }`}
            >
              <span className="text-[11px] font-medium leading-none">
                {kraткiDan[day.engDay]}
              </span>
              <span className="text-base font-bold leading-tight mt-0.5">
                {day.dayNum}.
              </span>
              <span className="text-[10px] leading-none text-center">
                {kraткiMjesec[new Date(day.dateKey + 'T12:00:00').getMonth()]}
              </span>
              {/* Tačkica ili "Zat" */}
              {day.isClosed ? (
                <span className="text-[9px] leading-tight mt-0.5 opacity-60">Zat.</span>
              ) : (
                <span className={`mt-1 h-1.5 w-1.5 rounded-full ${hasSessions
                  ? isSelected ? 'bg-primary-foreground' : 'bg-primary'
                  : 'bg-transparent'
                  }`} />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Radno vrijeme info ── */}
      {selectedDay && !selectedDay.isClosed && workingHours[selectedDay.engDay] && (
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={12} />
          <span>Radno vrijeme: {workingHours[selectedDay.engDay].join(' · ')}</span>
        </div>
      )}

      {/* ── Lista treninga ── */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">
            {selectedDay
              ? (() => { const d = new Date(selectedDay.dateKey + 'T12:00:00'); return `${selectedDay.bosDay}, ${d.getDate()}. ${puniMjesec[d.getMonth()]} ${d.getFullYear()}.` })()
              : '—'
            }
          </h3>
          {isPastDay && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Prošli datum
            </span>
          )}
        </div>
        <div className="p-4">
          {selectedDay?.isClosed ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="font-medium">Vikend — Zatvoreno</p>
              <p className="text-sm mt-1">Treninzi nisu dostupni subotom i nedjeljom.</p>
            </div>
          ) : isPastDay ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm">Ne možeš rezervisati treninge za prošle datume.</p>
            </div>
          ) : daySessions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Clock size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Admin još nije dodao treninge za ovaj dan.</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {daySessions.map((session) => {
                const booked = isBooked(session.id)
                const isBooking = bookingId === session.id
                const registeredCount = session.registrations?.filter(
                  r => r.sessionDate === selectedDateKey && r.status === 'Registered'
                ).length ?? 0
                const available = session.maxCapacity - registeredCount
                const timePast = isSessionTimePast(selectedDateKey, session.startTime)
                const otherBooked = !booked && hasOtherBookingThatDay(session.id)
                const isFull = (available <= 0 && !booked) || timePast || otherBooked

                return (
                  <div key={session.id}
                    className={`rounded-lg border p-4 transition-colors ${booked ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground">
                        {session.groupName}
                      </span>
                      {booked ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 size={12} /> Rezervisano
                        </span>
                      ) : timePast ? (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">Isteklo</span>
                      ) : otherBooked ? (
                        <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">Već imate trening</span>
                      ) : available <= 0 ? (
                        <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">Popunjeno</span>
                      ) : available <= 3 ? (
                        <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700">{available} mjesta</span>
                      ) : (
                        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">{available} mjesta</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-foreground">{session.groupName}</h4>
                    {session.notes && <p className="text-xs text-muted-foreground mt-0.5">{session.notes}</p>}
                    <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />{session.startTime?.substring(0, 5)} – {session.endTime?.substring(0, 5)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />{registeredCount}/{session.maxCapacity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleBook(session)}
                      disabled={isFull || isBooking}
                      className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${booked
                        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        : isFull
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:opacity-90'
                        }`}>
                      {isBooking ? 'Obrađuje se...'
                        : booked ? 'Otkaži rezervaciju'
                          : timePast ? 'Isteklo'
                            : otherBooked ? 'Već imate trening taj dan'
                              : available <= 0 ? 'Popunjeno'
                                : 'Rezerviši'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}