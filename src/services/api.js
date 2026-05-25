//const API_URL = import.meta.env.VITE_API_URL //'https://localhost:7087' // -Radi Farisa
const API_URL = 'https://localhost:7087'
const getToken = () => localStorage.getItem('token')

const headers = (withAuth = true) => {
    const h = { 'Content-Type': 'application/json' }
    if (withAuth) h['Authorization'] = `Bearer ${getToken()}`
    return h
}

const handleResponse = async (res) => {
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`)
    return data
}

// ── AUTH ──────────────────────────────────────────────
export const authApi = {
    login: (username, password) =>
        fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: headers(false),
            body: JSON.stringify({ username, password })
        }).then(handleResponse),

    register: (dto) =>
        fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: headers(false),
            body: JSON.stringify(dto)
        }).then(handleResponse),
}

// ── MEMBERSHIP ────────────────────────────────────────
export const membershipApi = {
    getMine: () =>
        fetch(`${API_URL}/api/membership/mine`, {
            headers: headers()
        }).then(handleResponse),

    request: (trainingType) =>
        fetch(`${API_URL}/api/membership/request`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ trainingType })
        }).then(handleResponse),
}

// ── TRAINING SESSIONS ─────────────────────────────────
export const trainingSessionsApi = {
    getAll: () =>
        fetch(`${API_URL}/api/trainingsessions`, {
            headers: headers()
        }).then(handleResponse),

    create: (dto) =>
        fetch(`${API_URL}/api/trainingsessions`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(dto)
        }).then(handleResponse),

    update: (id, dto) =>
        fetch(`${API_URL}/api/trainingsessions/${id}`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(dto)
        }).then(handleResponse),

    delete: (id) =>
        fetch(`${API_URL}/api/trainingsessions/${id}`, {
            method: 'DELETE',
            headers: headers()
        }).then(handleResponse),
}

// ── TRAINING REGISTRATIONS ────────────────────────────
export const trainingRegistrationsApi = {
    getMine: () =>
        fetch(`${API_URL}/api/trainingregistrations/mine`, {
            headers: headers()
        }).then(handleResponse),

    book: (trainingSessionId, sessionDate) =>
        fetch(`${API_URL}/api/trainingregistrations`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ trainingSessionId, sessionDate })
        }).then(handleResponse),

    cancel: (registrationId) =>
        fetch(`${API_URL}/api/trainingregistrations/${registrationId}`, {
            method: 'DELETE',
            headers: headers()
        }).then(handleResponse),

    getBySession: (sessionId) =>
        fetch(`${API_URL}/api/trainingregistrations/session/${sessionId}`, {
            headers: headers()
        }).then(handleResponse),
}

// ── ADMIN ─────────────────────────────────────────────
export const adminApi = {
    getDashboard: () =>
        fetch(`${API_URL}/api/admin/dashboard`, {
            headers: headers()
        }).then(handleResponse),

    getMembers: () =>
        fetch(`${API_URL}/api/admin/members`, {
            headers: headers()
        }).then(handleResponse),

    updateMembership: (userId, dto) =>
        fetch(`${API_URL}/api/admin/members/${userId}/membership`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(dto)
        }).then(handleResponse),

    // Aktivacija/deaktivacija korisničkog računa (IsActive u bazi)
    updateUserStatus: (userId, isActive) =>
        fetch(`${API_URL}/api/admin/members/${userId}/status`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify({ isActive })
        }).then(handleResponse),

    resetMemberPassword: (userId, newPassword) =>
        fetch(`${API_URL}/api/admin/members/${userId}/reset-password`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify({ newPassword })
        }).then(handleResponse),

    deleteMember: (userId) =>
        fetch(`${API_URL}/api/admin/members/${userId}`, {
            method: 'DELETE',
            headers: headers()
        }).then(handleResponse),
}

// ── NUTRITION ─────────────────────────────────────────
export const nutritionApi = {
    // Admin
    getMembers: () =>
        fetch(`${API_URL}/api/nutrition/members`, {
            headers: headers()
        }).then(handleResponse),

    uploadPdf: (userId, pdfFileName, pdfBase64, pdfFileSize) =>
        fetch(`${API_URL}/api/nutrition/${userId}/upload`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify({ pdfFileName, pdfBase64, pdfFileSize })
        }).then(handleResponse),

    deletePdf: (userId) =>
        fetch(`${API_URL}/api/nutrition/${userId}/pdf`, {
            method: 'DELETE',
            headers: headers()
        }).then(handleResponse),

    // Clanica
    getMine: () =>
        fetch(`${API_URL}/api/nutrition/mine`, {
            headers: headers()
        }).then(handleResponse),

    download: (planId) =>
        fetch(`${API_URL}/api/nutrition/${planId}/download`, {
            headers: headers()
        }).then(handleResponse),
}

// ── CHALLENGES ────────────────────────────────────────────
export const challengesApi = {
    // Public
    getAll: () =>
        fetch(`${API_URL}/api/challenges`).then(handleResponse),

    getById: (id) =>
        fetch(`${API_URL}/api/challenges/${id}`).then(handleResponse),

    // Member
    getMy: () =>
        fetch(`${API_URL}/api/challenges/my`, {
            headers: headers()
        }).then(handleResponse),

    getAvailable: () =>
        fetch(`${API_URL}/api/challenges/available`, {
            headers: headers()
        }).then(handleResponse),

    join: (id) =>
        fetch(`${API_URL}/api/challenges/${id}/join`, {
            method: 'POST',
            headers: headers()
        }).then(handleResponse),

    leave: (id) =>
        fetch(`${API_URL}/api/challenges/${id}/leave`, {
            method: 'POST',
            headers: headers()
        }).then(handleResponse),

    getLeaderboard: (id) =>
        fetch(`${API_URL}/api/challenges/${id}/leaderboard`, {
            headers: headers()
        }).then(handleResponse),

    // Admin
    getAllAdmin: () =>
        fetch(`${API_URL}/api/challenges/admin/all`, {
            headers: headers()
        }).then(handleResponse),

    create: (data) =>
        fetch(`${API_URL}/api/challenges`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(data)
        }).then(handleResponse),

    update: (id, data) =>
        fetch(`${API_URL}/api/challenges/${id}`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(data)
        }).then(handleResponse),

    getParticipants: (id) =>
        fetch(`${API_URL}/api/challenges/${id}/participants`, {
            headers: headers()
        }).then(handleResponse),

    delete: (id) =>
        fetch(`${API_URL}/api/challenges/${id}`, {
            method: 'DELETE',
            headers: headers()
        }).then(handleResponse),

    updateParticipantStatus: (challengeId, userId, status) =>
        fetch(`${API_URL}/api/challenges/${challengeId}/participants/${userId}`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify({ status })
        }).then(handleResponse),
}

// ── PROGRESS ──────────────────────────────────────────────
export const progressApi = {
    // Member
    getMine: () =>
        fetch(`${API_URL}/api/progress/mine`, {
            headers: headers()
        }).then(handleResponse),

    add: (data) =>
        fetch(`${API_URL}/api/progress`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(data)
        }).then(handleResponse),

    update: (id, data) =>
        fetch(`${API_URL}/api/progress/${id}`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(data)
        }).then(handleResponse),

    // Admin
    getByUser: (userId) =>
        fetch(`${API_URL}/api/progress/user/${userId}`, {
            headers: headers()
        }).then(handleResponse),

    addForUser: (userId, data) =>
        fetch(`${API_URL}/api/progress/user/${userId}`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(data)
        }).then(handleResponse),

    updateForUser: (userId, entryId, data) =>
        fetch(`${API_URL}/api/progress/user/${userId}/${entryId}`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(data)
        }).then(handleResponse),
}

// ── USERS ─────────────────────────────────────────────
export const usersApi = {
    getMembers: () =>
        fetch(`${API_URL}/api/users/members`, {
            headers: headers()
        }).then(handleResponse),
}

// ── PROFILE ────────────────────────────────────────────────────────────────
export const profileApi = {
    get: () =>
        fetch(`${API_URL}/api/users/profile`, {
            headers: headers()
        }).then(handleResponse),

    update: (data) =>
        fetch(`${API_URL}/api/users/profile`, {
            method: 'PUT',
            headers: headers(),
            body: JSON.stringify(data)
        }).then(handleResponse),
}