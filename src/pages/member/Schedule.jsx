import React, { useState, useEffect } from 'react'
import { Clock, Users, CheckCircle2, Calendar } from 'lucide-react'
import { trainingRegistrationsApi, trainingSessionsApi } from '../../services/api'

const weekdays = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned']
const _mj = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar']
const _daniPuni = ['Nedjelja', 'Ponedjeljak', 'Utorak', 'Srijeda', 'Četvrtak', 'Petak', 'Subota']

function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Generiši sve dane koji se prikazuju:
// cijeli trenutni mjesec + 14 dana sljedećeg mjeseca
function getCalendarDays() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  // Broj dana u trenutnom mjesecu
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate()

  // Offset za ponedjeljak (0=Pon, 6=Ned)
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7

  // Dani trenutnog mjeseca
  const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => {
    const day = i + 1
    return {
      dateKey: formatDateKey(year, month, day),
      day,
      month,
      year,
      isNextMonth: false
    }
  })

  // 14 dana sljedećeg mjeseca
  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  const nextMonthDays = Array.from({ length: 14 }, (_, i) => {
    const day = i + 1
    return {
      dateKey: formatDateKey(nextYear, nextMonth, day),
      day,
      month: nextMonth,
      year: nextYear,
      isNextMonth: true
    }
  })

  return { startOffset, days: [...currentMonthDays, ...nextMonthDays], year, month, nextMonth, nextYear }
}

export default function MemberSchedule() {
  const [registrations, setRegistrations] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDateKey, setSelectedDateKey] = useState(
    new Date().toISOString().split('T')[0]
  )

  const today = new Date().toISOString().split('T')[0]
  const { startOffset, days, year, month, nextMonth, nextYear } = getCalendarDays()

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [regs, sess] = await Promise.all([
          trainingRegistrationsApi.getMine(),
          trainingSessionsApi.getAll(),
        ])
        setRegistrations(Array.isArray(regs) ? regs : [])
        setSessions(Array.isArray(sess) ? sess : [])
      } catch (err) {
        console.error('Greška pri učitavanju rasporeda')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const bookedDates = new Set(
    registrations
      .filter(r => r.status === 'Registered')
      .map(r => r.sessionDate)
  )

  const selectedRegistrations = registrations.filter(
    r => r.sessionDate === selectedDateKey && r.status === 'Registered'
  )

  const selectedWithSessions = selectedRegistrations.map(reg => ({
    reg,
    session: sessions.find(s => s.id === reg.trainingSessionId)
  }))

  const isPast = (dateKey) => dateKey < today

  const _sd = new Date(selectedDateKey + 'T12:00:00')
  const selectedLabel = `${_daniPuni[_sd.getDay()]}, ${_sd.getDate()}. ${_mj[_sd.getMonth()]} ${_sd.getFullYear()}.`

  // Broj rezervacija u trenutnom i sljedecem mjesecu
  const currentMonthBookings = [...bookedDates].filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length
  const nextMonthBookings = [...bookedDates].filter(d => d.startsWith(`${nextYear}-${String(nextMonth + 1).padStart(2, '0')}`)).length

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Moj raspored</h1>
        <p className="text-muted-foreground">Tvoji rezervisani treninzi</p>
      </div>

      <div className="grid gap-6">

        {/* ── Kalendar ── */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">
                {_mj[month]} – {_mj[nextMonth]} {nextYear}
              </h3>
              <p className="text-sm text-muted-foreground">
                Izaberite datum da vidite rezervacije
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {currentMonthBookings > 0 && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {currentMonthBookings} u {_mj[month]}
                </span>
              )}
              {nextMonthBookings > 0 && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {nextMonthBookings} u {_mj[nextMonth]}
                </span>
              )}
            </div>
          </div>
          <div className="p-4">
            {/* Dani u sedmici header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase text-muted-foreground mb-2">
              {weekdays.map(w => (
                <div key={w} className="font-semibold py-1">{w}</div>
              ))}
            </div>

            {/* Kalendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Prazne ćelije za offset */}
              {Array.from({ length: startOffset }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-12 rounded-lg" />
              ))}

              {days.map(({ dateKey, day, month: dayMonth, isNextMonth }) => {
                const isSelected = selectedDateKey === dateKey
                const isToday = dateKey === today
                const hasBooking = bookedDates.has(dateKey)
                const past = isPast(dateKey)

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => setSelectedDateKey(dateKey)}
                    className={`relative flex h-12 flex-col items-center justify-center rounded-lg border text-sm transition focus:outline-none
                      ${isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isToday
                          ? 'border-primary bg-primary/10 text-foreground font-bold'
                          : isNextMonth
                            ? 'border-border bg-muted/30 text-muted-foreground hover:bg-muted'
                            : 'border-border bg-card hover:bg-muted text-foreground'
                      }
                      ${past && !isSelected ? 'opacity-50' : ''}
                    `}
                  >
                    <span className="font-medium leading-none">{day}</span>
                    {/* Naziv mjeseca za prvi dan sljedeceg mjeseca */}
                    {isNextMonth && day === 1 && (
                      <span className="text-[9px] leading-none mt-0.5 opacity-70">
                        {_mj[dayMonth].substring(0, 3)}
                      </span>
                    )}
                    {/* Tačkica ako ima rezervacija */}
                    {hasBooking && (
                      <span className={`mt-0.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-primary'
                        }`} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legenda */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Ima rezervaciju
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border-2 border-primary bg-transparent" />
                Danas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                Sljedeći mjesec
              </span>
            </div>
          </div>
        </div>

        {/* ── Treninzi za izabrani dan ── */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground capitalize">{selectedLabel}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedWithSessions.length > 0
                  ? `${selectedWithSessions.length} rezervisan${selectedWithSessions.length === 1 ? '' : 'ih'} trening${selectedWithSessions.length === 1 ? '' : 'a'}`
                  : 'Nema rezervacija za ovaj datum'
                }
              </p>
            </div>
          </div>
          <div className="p-4">
            {selectedWithSessions.length > 0 ? (
              <div className="space-y-3">
                {selectedWithSessions.map(({ reg, session }) => {
                  const past = isPast(reg.sessionDate)
                  return (
                    <div key={reg.id}
                      className={`flex items-center justify-between rounded-lg border p-4 ${past ? 'bg-muted/30 border-border' : 'bg-card border-border'
                        }`}>
                      <div className="flex items-center gap-4">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${past ? 'bg-green-100' : 'bg-primary/10'
                          }`}>
                          {past
                            ? <CheckCircle2 size={20} className="text-green-600" />
                            : <Clock size={20} className="text-primary" />
                          }
                        </div>
                        <div>
                          <p className={`font-medium ${past ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {session?.groupName || 'Trening'}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                            {session && (
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {session.startTime?.substring(0, 5)} – {session.endTime?.substring(0, 5)}
                              </span>
                            )}
                            {session?.location && (
                              <span className="flex items-center gap-1">
                                <Users size={12} />
                                {session.location}
                              </span>
                            )}
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${session?.type === 'Group'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                              }`}>
                              {session?.type === 'Group' ? 'Grupni' : 'Individualni'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 ${past
                          ? 'bg-secondary text-secondary-foreground'
                          : 'bg-primary text-primary-foreground'
                        }`}>
                        {past ? 'Završeno' : 'Rezervisano'}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Calendar size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Nema rezervisanih treninga za ovaj datum.</p>
                <p className="text-xs mt-1">
                  Idi na <span className="text-primary font-medium">Rezervacija treninga</span> da odabereš termin.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}