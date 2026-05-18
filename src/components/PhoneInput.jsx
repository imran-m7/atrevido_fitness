import React, { useState } from 'react'

// Bosanski operatori i prefixes
const BA_PREFIXES = ['060', '061', '062', '063', '064', '065', '066']

function validateBAPhone(phone) {
    // Ukloni razmake i crtice
    const clean = phone.replace(/[\s\-]/g, '')

    // Mora počinjati sa +387 ili 0
    if (clean.startsWith('+387')) {
        // +387 61 123 456 → provjeri ostatak
        const local = '0' + clean.slice(4)
        return validateLocal(local)
    }

    if (clean.startsWith('0')) {
        return validateLocal(clean)
    }

    return { valid: false, message: 'Broj mora počinjati sa +387 ili 0.' }
}

function validateLocal(local) {
    // Mora imati prefix iz liste
    const prefix = BA_PREFIXES.find(p => local.startsWith(p))
    if (!prefix) {
        return {
            valid: false,
            message: `Broj mora počinjati sa: ${BA_PREFIXES.join(', ')}`
        }
    }

    // Minimalno 8 cifara poslije 0 (ukupno 9 sa 0)
    // npr. 061 123 456 = 10 cifara
    const digits = local.replace(/\D/g, '')
    if (digits.length < 9) {
        return { valid: false, message: 'Broj mora imati 9 ili 10 cifara (npr. 061 123 456).' }
    }
    if (digits.length > 10) {
        return { valid: false, message: 'Broj je predugačak.' }
    }
    return { valid: true, message: '' }
}

export function formatBAPhone(value) {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
    if (digits.length <= 9) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`
}

export function isValidBAPhone(phone) {
    if (!phone) return true // opcionalno polje
    return validateBAPhone(phone).valid
}

export default function PhoneInput({ value, onChange, required = false, id = 'phoneNumber', className = '' }) {
    const [touched, setTouched] = useState(false)

    const inputClass = `w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${className}`

    const handleChange = (e) => {
        let raw = e.target.value

        // Ako korisnik briše +387 prefix, dozvoli
        if (raw === '+38' || raw === '+3' || raw === '+' || raw === '') {
            onChange(raw)
            return
        }

        // Ako počinje sa +387, ostavi prefix i formatiraj ostatak
        if (raw.startsWith('+387')) {
            onChange(raw)
            return
        }

        // Inače formatiraj kao lokalni broj
        const digits = raw.replace(/\D/g, '')
        onChange(formatBAPhone(digits))
    }

    const validation = value ? validateBAPhone(value) : { valid: true, message: '' }
    const showError = touched && value && !validation.valid

    return (
        <div>
            <div className="flex gap-2">
                {/* Zastava + prefiks */}
                <div className="flex items-center gap-1.5 rounded-lg border border-input bg-muted px-3 py-2 text-sm shrink-0">
                    <span className="text-base">🇧🇦</span>
                    <span className="text-muted-foreground font-medium">+387</span>
                </div>
                {/* Input */}
                <input
                    id={id}
                    type="tel"
                    className={`${inputClass} ${showError ? 'border-destructive' : 'border-input'}`}
                    placeholder="061 123 456"
                    value={value}
                    onChange={handleChange}
                    onBlur={() => setTouched(true)}
                    required={required}
                />
            </div>
            {showError && (
                <p className="mt-1 text-xs text-destructive">{validation.message}</p>
            )}
            {!showError && (
                <p className="mt-1 text-xs text-muted-foreground">
                    Operatori: 060 (Haloo), 061/062 (BH Telecom), 063/064 (HT Eronet), 065/066
                </p>
            )}
        </div>
    )
}