'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

interface Client { id: string; name: string }
const statuses = ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'] as const

export default function NewProjectPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [form, setForm] = useState({
    clientId: '', name: '', description: '', status: 'ACTIVE' as typeof statuses[number],
    hourlyRate: '', fixedBudget: '', startDate: '', dueDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => { 
    fetch('/api/clients').then((r) => r.json()).then(setClients) 
  }, [])

  function validateField(name: string, value: string, formState = form) {
    switch (name) {
      case 'clientId':
        return !value ? 'Please select a client' : ''
      case 'name':
        return value.trim().length < 2 ? 'Project name must be at least 2 characters' : ''
      case 'hourlyRate':
        if (!value) return ''
        return isNaN(parseFloat(value)) || parseFloat(value) < 0 ? 'Rate must be a positive number' : ''
      case 'fixedBudget':
        if (!value) return ''
        return isNaN(parseFloat(value)) || parseFloat(value) < 0 ? 'Budget must be a positive number' : ''
      case 'dueDate':
        if (!value || !formState.startDate) return ''
        return new Date(value) < new Date(formState.startDate) ? 'Due date cannot be before start date' : ''
      default:
        return ''
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    const newForm = { ...form, [name]: value }
    setForm(newForm)
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Cross-field validation check for dates
    if (name === 'startDate' && errors['dueDate']) {
      setErrors(prev => ({ ...prev, dueDate: validateField('dueDate', form.dueDate, newForm) }))
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    const errorMsg = validateField(name, value)
    if (errorMsg) {
      setErrors(prev => ({ ...prev, [name]: errorMsg }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')
    
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
      const payload: Record<string, unknown> = {
        clientId: form.clientId, name: form.name, description: form.description, status: form.status,
      }
      if (form.hourlyRate) payload.hourlyRate = parseFloat(form.hourlyRate)
      if (form.fixedBudget) payload.fixedBudget = parseFloat(form.fixedBudget)
      if (form.startDate) payload.startDate = form.startDate
      if (form.dueDate) payload.dueDate = form.dueDate

      const res = await fetch('/api/projects', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error ?? 'Failed to create project'); return }
      router.push('/dashboard/projects')
      router.refresh()
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const labelCls = 'block text-xs font-medium text-[var(--text-2)] mb-1.5'

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/projects" className="p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-1)]">New Project</h1>
          <p className="text-[var(--text-2)] text-sm mt-0.5">Set up a new project and link it to a client</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        {submitError && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--danger)]/10 border border-[var(--danger)]/20 text-[var(--danger)] text-sm mb-5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Client *</label>
              <select 
                name="clientId" 
                value={form.clientId} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={`input-base ${errors.clientId ? 'input-error' : ''}`}
              >
                <option value="">Select client...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.clientId && <p className="text-xs text-[var(--danger)] mt-1 animate-fade-in">{errors.clientId}</p>}
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-base">
                {statuses.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Project Name *</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              onBlur={handleBlur}
              placeholder="E-commerce Redesign" 
              className={`input-base ${errors.name ? 'input-error' : ''}`} 
            />
            {errors.name && <p className="text-xs text-[var(--danger)] mt-1 animate-fade-in">{errors.name}</p>}
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              rows={3}
              placeholder="What does this project involve?" 
              className="input-base resize-none" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Hourly Rate (₹)</label>
              <input 
                name="hourlyRate" 
                type="number" 
                min="0" 
                step="0.01" 
                value={form.hourlyRate} 
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="1500" 
                className={`input-base ${errors.hourlyRate ? 'input-error' : ''}`} 
              />
              {errors.hourlyRate && <p className="text-xs text-[var(--danger)] mt-1 animate-fade-in">{errors.hourlyRate}</p>}
            </div>
            <div>
              <label className={labelCls}>Fixed Budget (₹)</label>
              <input 
                name="fixedBudget" 
                type="number" 
                min="0" 
                step="0.01" 
                value={form.fixedBudget} 
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="50000" 
                className={`input-base ${errors.fixedBudget ? 'input-error' : ''}`} 
              />
              {errors.fixedBudget && <p className="text-xs text-[var(--danger)] mt-1 animate-fade-in">{errors.fixedBudget}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Start Date</label>
              <input 
                name="startDate" 
                type="date" 
                value={form.startDate} 
                onChange={handleChange} 
                className="input-base" 
              />
            </div>
            <div>
              <label className={labelCls}>Due Date</label>
              <input 
                name="dueDate" 
                type="date" 
                value={form.dueDate} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={`input-base ${errors.dueDate ? 'input-error' : ''}`} 
              />
              {errors.dueDate && <p className="text-xs text-[var(--danger)] mt-1 animate-fade-in">{errors.dueDate}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/dashboard/projects"
              className="flex-1 py-2.5 rounded-xl text-center text-sm font-medium text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--surface-2)] transition-all">
              Cancel
            </Link>
            <button type="submit" id="create-project-submit" disabled={isLoading}
              className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
