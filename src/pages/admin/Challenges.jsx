import React, { useState } from 'react'
import { Plus, Edit, Trash2, Users, Calendar, Trophy, Eye, X } from 'lucide-react'

const initialChallenges = [
  { id: 1, title: '30-Day Fitness Challenge',  status: 'Active',    startDate: 'March 1, 2024',   endDate: 'March 30, 2024',  participants: 45, progress: 65,  type: 'Consistency', description: 'Challenge yourself to stay consistent for 30 days' },
  { id: 2, title: 'Spring Strength Challenge', status: 'Active',    startDate: 'March 15, 2024',  endDate: 'April 26, 2024',  participants: 28, progress: 25,  type: 'Strength', description: 'Build strength with this spring challenge' },
  { id: 3, title: 'Team Cardio Blitz',         status: 'Active',    startDate: 'April 1, 2024',   endDate: 'April 30, 2024',  participants: 60, progress: 0,   type: 'Team Cardio', description: 'Team up for an intense cardio challenge' },
  { id: 4, title: 'New Year Challenge',        status: 'Completed', startDate: 'January 1, 2024', endDate: 'January 31, 2024',participants: 52, progress: 100, type: 'Consistency', description: 'New year, new you challenge' },
]

const statusColors = {
  Active:    'bg-green-100 text-green-700',
  Upcoming:  'bg-blue-100 text-blue-700',
  Completed: 'bg-gray-100 text-gray-700',
}

const challengeTypes = ['Consistency', 'Strength', 'Cardio', 'Flexibility', 'Team Cardio', 'Endurance']
const challengeStatuses = ['Active', 'Upcoming', 'Completed']

const inputClass = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const labelClass = 'block mb-1.5 text-sm font-medium text-foreground'

export default function AdminChallenges() {
  const [challengesList, setChallengesList] = useState(initialChallenges)
  const [showModal, setShowModal] = useState(false)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    type: 'Consistency',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Active'
  })

  const stats = [
    { label: 'Total Challenges', value: challengesList.length, bg: 'bg-primary/10', color: 'text-primary', icon: Trophy },
    { label: 'Active', value: challengesList.filter(c => c.status === 'Active').length, bg: 'bg-green-100', color: 'text-green-600', icon: Trophy },
    { label: 'Total Participants', value: challengesList.reduce((sum, c) => sum + c.participants, 0), bg: 'bg-purple-100', color: 'text-purple-600', icon: Users },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleOpenAddModal = () => {
    setEditingId(null)
    setFormData({ title: '', type: 'Consistency', description: '', startDate: '', endDate: '', status: 'Active' })
    setShowModal(true)
  }

  const handleOpenEditModal = (challenge) => {
    setEditingId(challenge.id)
    setFormData({
      title: challenge.title,
      type: challenge.type,
      description: challenge.description,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      status: challenge.status
    })
    setShowModal(true)
  }

  const handleOpenParticipantsModal = (challenge) => {
    setSelectedChallenge(challenge)
    setShowParticipantsModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setChallengesList(prev =>
        prev.map(c =>
          c.id === editingId
            ? { ...c, ...formData, progress: c.progress, participants: c.participants }
            : c
        )
      )
    } else {
      const newChallenge = {
        id: Math.max(...challengesList.map(c => c.id), 0) + 1,
        ...formData,
        participants: 0,
        progress: 0
      }
      setChallengesList(prev => [newChallenge, ...prev])
    }
    setShowModal(false)
    setFormData({ title: '', type: 'Consistency', description: '', startDate: '', endDate: '', status: 'Active' })
  }

  const handleDelete = (id) => {
    setChallengesList(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">Manage Challenges</h1>
          <p className="text-muted-foreground">Create and manage fitness challenges</p>
        </div>
        <button onClick={handleOpenAddModal} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={16} /> Create Challenge
        </button>
      </div>

      {/* Challenge Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">{editingId ? 'Edit Challenge' : 'Create New Challenge'}</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Challenge Name */}
              <div>
                <label htmlFor="title" className={labelClass}>Challenge Name</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className={inputClass}
                  placeholder="Enter challenge name"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Type and Status */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="type" className={labelClass}>Challenge Type</label>
                  <select
                    id="type"
                    name="type"
                    className={inputClass}
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    {challengeTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className={labelClass}>Status</label>
                  <select
                    id="status"
                    name="status"
                    className={inputClass}
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    {challengeStatuses.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className={labelClass}>Description</label>
                <textarea
                  id="description"
                  name="description"
                  className={`${inputClass} min-h-32 resize-none`}
                  placeholder="Enter challenge description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Start and End Date */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="startDate" className={labelClass}>Start Date</label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    className={inputClass}
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className={labelClass}>End Date</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    className={inputClass}
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {editingId ? 'Update Challenge' : 'Create Challenge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipantsModal && selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowParticipantsModal(false)} />
          <div className="relative z-10 w-full max-w-2xl rounded-lg border border-border bg-card p-8 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Challenge Participants</h2>
                <p className="text-sm text-muted-foreground mt-1">{selectedChallenge.title}</p>
              </div>
              <button onClick={() => setShowParticipantsModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            {/* Participants List - Empty for now */}
            <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
              <Users size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Participants will appear here</p>
              <p className="text-sm text-muted-foreground mt-1">Total participants: {selectedChallenge.participants}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 md:grid-cols-3 w-fit mx-auto">
        {stats.map(({ label, value, bg, color, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg}`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Challenges List */}
      <div className="grid gap-6">
        {challengesList.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-card shadow-sm p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <Trophy size={28} className="text-primary" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{c.title}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[c.status]}`}>{c.status}</span>
                    <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">{c.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Calendar size={14} />{c.startDate} – {c.endDate}</span>
                    <span className="flex items-center gap-1"><Users size={14} />{c.participants} participants</span>
                  </div>
                  {c.status !== 'Upcoming' && (
                    <div className="w-64">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground">{c.progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleOpenParticipantsModal(c)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <Eye size={14} /> View Participants
                </button>
                <button onClick={() => handleOpenEditModal(c)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(c.id)} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-destructive hover:bg-muted transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
