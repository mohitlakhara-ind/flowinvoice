'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

const currencies = ['INR', 'USD', 'EUR', 'GBP'] as const

export default function NewClientPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', address: '',
    currency: 'INR' as typeof currencies[number], notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Format phone number to start with +91 and only allow digits
  const formatPhone = (val: string) => {
    // Remove all non-digits except +
    let cleaned = val.replace(/[^\d+]/g, '')
    
    // If empty or user just deleted everything
    if (!cleaned || cleaned === '+') return ''

    // Ensure it starts with +91 if they start typing a number
    if (!cleaned.startsWith('+')) {
      cleaned = '+91' + cleaned
    }

    // Format as +91 XXXXX XXXXX
    const match = cleaned.match(/^(\+91)(\d{0,5})(\d{0,5})$/)
    if (match) {
      const part1 = match[1]
      const part2 = match[2] ? ' ' + match[2] : ''
      const part3 = match[3] ? ' ' + match[3] : ''
      return part1 + part2 + part3
    }
    
    return cleaned.slice(0, 15) // Fallback max length
  }

  function validateField(name: string, value: string) {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email address' : ''
      case 'phone':
        if (!value) return '' // Optional
        const digitsOnly = value.replace(/\D/g, '')
        return digitsOnly.length < 12 ? 'Invalid phone number format (+91 XXXXX XXXXX)' : ''
      default:
        return ''
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    let newValue = value

    if (name === 'phone') {
      newValue = formatPhone(value)
    }

    setForm(prev => ({ ...prev, [name]: newValue }))
    
    // Clear field error when user starts typing again
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target
    const errorMsg = validateField(name, value)
    if (errorMsg) {
      setErrors(prev => ({ ...prev, [name]: errorMsg }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    Object.keys(form).forEach(key => {
      const errorMsg = validateField(key, form[key as keyof typeof form])
      if (errorMsg) newErrors[key] = errorMsg
    })

    if (Object.values(newErrors).some(err => err)) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error ?? 'Failed to create client'); return }
      router.push('/dashboard/clients')
      router.refresh()
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Using the themed utilities we created in globals.css
  const labelCls = 'block text-xs font-medium text-[var(--text-2)] mb-1.5'

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/clients" className="p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-1)]">Add Client</h1>
          <p className="text-[var(--text-2)] text-sm mt-0.5">Fill in the client details below</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        {submitError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] text-sm mb-5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                onBlur={handleBlur}
                placeholder="Rahul Sharma" 
                className={`input-base ${errors.name ? 'input-error' : ''}`} 
              />
              {errors.name && <p className="text-xs text-[var(--danger)] mt-1 animate-fade-in">{errors.name}</p>}
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                onBlur={handleBlur}
                placeholder="rahul@company.com" 
                className={`input-base ${errors.email ? 'input-error' : ''}`} 
              />
              {errors.email && <p className="text-xs text-[var(--danger)] mt-1 animate-fade-in">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Phone</label>
              <input 
                name="phone" 
                type="tel"
                value={form.phone} 
                onChange={handleChange} 
                onBlur={handleBlur}
                placeholder="+91 98765 43210" 
                className={`input-base ${errors.phone ? 'input-error' : ''}`} 
              />
              {errors.phone && <p className="text-xs text-[var(--danger)] mt-1 animate-fade-in">{errors.phone}</p>}
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input 
                name="company" 
                value={form.company} 
                onChange={handleChange} 
                placeholder="Acme Corp" 
                className="input-base" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Address</label>
              <input 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                placeholder="Mumbai, Maharashtra" 
                className="input-base" 
              />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className="input-base">
                {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Notes</label>
            <textarea 
              name="notes" 
              value={form.notes} 
              onChange={handleChange} 
              rows={3}
              placeholder="Any notes about this client..." 
              className="input-base resize-none" 
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/dashboard/clients"
              className="flex-1 py-2.5 rounded-xl text-center text-sm font-medium text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--surface-2)] transition-all">
              Cancel
            </Link>
            <button type="submit" id="create-client-submit" disabled={isLoading}
              className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
