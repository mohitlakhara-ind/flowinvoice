'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Plus, Loader2, Trash2, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'

interface Project { id: string; name: string; client: { name: string } }
interface TimeLog {
  id: string; description: string; hours: string; date: string; billable: boolean; invoiced: boolean
  project: { id: string; name: string; client: { name: string } }
}

export default function TimeLogsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [logs, setLogs] = useState<TimeLog[]>([])
  const [form, setForm] = useState({
    projectId: '', description: '', hours: '', date: new Date().toISOString().split('T')[0], billable: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const fetchData = useCallback(async () => {
    const [p, l] = await Promise.all([fetch('/api/projects').then((r) => r.json()), fetch('/api/time-logs').then((r) => r.json())])
    setProjects(p)
    setLogs(l)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.projectId) { setError('Please select a project'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/time-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, hours: parseFloat(form.hours) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to log time'); return }
      setForm({ projectId: '', description: '', hours: '', date: new Date().toISOString().split('T')[0], billable: true })
      setShowForm(false)
      fetchData()
    } catch {
      setError('Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id: string) {
    setIsDeleting(id)
    try {
      await fetch(`/api/time-logs/${id}`, { method: 'DELETE' })
      fetchData()
    } finally {
      setIsDeleting(null)
    }
  }

  const totalHours = logs.reduce((sum, l) => sum + parseFloat(l.hours), 0)
  const billableHours = logs.filter((l) => l.billable).reduce((sum, l) => sum + parseFloat(l.hours), 0)

  const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--primary)] text-sm transition-colors'

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-1)]">Time Logs</h1>
          <p className="text-[var(--text-2)] text-sm mt-1">Track time spent on projects</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} id="log-time-btn"
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary)] rounded-xl text-sm font-medium transition-all hover:scale-105">
          <Plus className="w-4 h-4" /> Log Time
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Hours', value: totalHours.toFixed(1) + 'h' },
          { label: 'Billable', value: billableHours.toFixed(1) + 'h' },
          { label: 'Entries', value: logs.length.toString() },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-4 border border-[var(--border)]">
            <p className="text-xs text-[var(--text-3)] mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-[var(--text-1)]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Log form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 border border-[var(--primary)]/20 animate-fade-in">
          <h2 className="font-semibold text-[var(--text-1)] text-sm mb-5">Log Time</h2>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Project *</label>
              <select value={form.projectId} onChange={(e) => setForm((p) => ({ ...p, projectId: e.target.value }))} className={inputCls} required>
                <option value="">Select project...</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.client.name} — {p.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Description *</label>
              <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="What did you work on?" className={inputCls} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Hours *</label>
              <input type="number" step="0.25" min="0.25" max="24" value={form.hours}
                onChange={(e) => setForm((p) => ({ ...p, hours: e.target.value }))} placeholder="2.5" className={inputCls} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Date *</label>
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className={inputCls} required />
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div className={clsx('w-9 h-5 rounded-full transition-colors relative', form.billable ? 'bg-[var(--primary)]' : 'bg-[var(--surface-2)]')}
                  onClick={() => setForm((p) => ({ ...p, billable: !p.billable }))}>
                  <div className={clsx('absolute top-0.5 w-4 h-4 rounded-full bg-[var(--surface)] shadow transition-transform', form.billable ? 'translate-x-4' : 'translate-x-0.5')} />
                </div>
                <span className="text-sm text-[var(--text-2)]">Billable</span>
              </label>
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--surface-2)] transition-all">
                Cancel
              </button>
              <button type="submit" disabled={isLoading}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[var(--primary)] hover:bg-[var(--primary)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-white">
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save Log'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log list */}
      {logs.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-[var(--text-3)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-1)] mb-2">No time logged yet</h3>
          <p className="text-sm text-[var(--text-2)]">Start tracking time to bill clients accurately.</p>
        </div>
      ) : (
        <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Date', 'Project', 'Description', 'Hours', 'Billable', ''].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-medium text-[var(--text-3)] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--surface)]/[0.02] transition-colors group">
                  <td className="px-5 py-3.5 text-sm text-[var(--text-2)] whitespace-nowrap">
                    {new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-[var(--text-1)]">{log.project.name}</p>
                    <p className="text-xs text-[var(--text-3)]">{log.project.client.name}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[var(--text-2)] max-w-[220px] truncate">{log.description}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-[var(--text-1)]">{parseFloat(log.hours).toFixed(2)}h</td>
                  <td className="px-5 py-3.5">
                    <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-lg border', log.billable ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-[var(--text-3)] bg-[var(--bg)]0/5 border-slate-500/10')}>
                      {log.billable ? 'Billable' : 'Non-billable'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDelete(log.id)} disabled={isDeleting === log.id}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--text-2)] hover:text-red-400 transition-all rounded-lg hover:bg-red-500/10">
                      {isDeleting === log.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
