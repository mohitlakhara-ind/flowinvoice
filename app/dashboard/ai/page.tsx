'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bot, Sparkles, Copy, Check, Loader2, History, ChevronDown, ChevronUp, Trash2, Briefcase, Smile, ZapIcon } from 'lucide-react'
import { clsx } from 'clsx'

const tones = [
  { value: 'professional', label: 'Professional', icon: Briefcase, desc: 'Formal & polished' },
  { value: 'friendly', label: 'Friendly', icon: Smile, desc: 'Warm & approachable' },
  { value: 'assertive', label: 'Assertive', icon: ZapIcon, desc: 'Direct & confident' },
] as const

type Tone = typeof tones[number]['value']

interface SavedProposal {
  id: string
  clientName: string
  projectName: string
  tone: string
  content: string
  createdAt: string
}

export default function AIToolsPage() {
  const [form, setForm] = useState({
    clientName: '',
    projectName: '',
    projectScope: '',
    budget: '',
    timeline: '',
    tone: 'professional' as Tone,
  })
  const [proposal, setProposal] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  // History state
  const [history, setHistory] = useState<SavedProposal[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/proposals')
      if (res.ok) setHistory(await res.json())
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setProposal('')
    setIsGenerating(true)

    try {
      const res = await fetch('/api/ai/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Generation failed')
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return

      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) setProposal((prev) => prev + parsed.text)
            } catch { /* skip */ }
          }
        }
      }

      // Refresh history after generation completes
      fetchHistory()
    } catch {
      setError('Failed to generate proposal. Check your API key.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(proposal)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleCopyHistory(id: string, content: string) {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await fetch(`/api/ai/proposals/${id}`, { method: 'DELETE' })
      setHistory((prev) => prev.filter((p) => p.id !== id))
      if (expandedId === id) setExpandedId(null)
    } finally {
      setDeletingId(null)
    }
  }

  const isFormValid = form.clientName && form.projectName && form.projectScope.length >= 10

  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-5 h-5 text-[var(--primary)]" />
          <h1 className="text-2xl font-bold text-[var(--text-1)]">AI Tools</h1>
        </div>
        <p className="text-[var(--text-2)] text-sm">GPT-4o powered tools to supercharge your freelance business</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass rounded-2xl p-6 border border-[var(--primary)]/20">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <h2 className="font-semibold text-[var(--text-1)]">Proposal Generator</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Client Name *</label>
                <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Acme Corp"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--primary)] text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Project Name *</label>
                <input name="projectName" value={form.projectName} onChange={handleChange} placeholder="E-commerce Redesign"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--primary)] text-sm transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Project Scope *</label>
              <textarea name="projectScope" value={form.projectScope} onChange={handleChange} rows={4}
                placeholder="Describe what the client needs. Include tech stack, features, goals..."
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--primary)] text-sm transition-colors resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Budget (optional)</label>
                <input name="budget" value={form.budget} onChange={handleChange} placeholder="₹50,000"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--primary)] text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">Timeline (optional)</label>
                <input name="timeline" value={form.timeline} onChange={handleChange} placeholder="4 weeks"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--primary)] text-sm transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-2">Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button key={t.value} type="button" onClick={() => setForm((prev) => ({ ...prev, tone: t.value }))}
                    className={clsx('p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center',
                      form.tone === t.value
                        ? 'border-[var(--primary)]/50 bg-[var(--primary)]/15 text-[var(--primary-light)]'
                        : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] hover:border-[var(--border-hov)]')}>
                    <t.icon className="w-4 h-4 mb-1.5" />
                    <div className="text-xs font-medium">{t.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button type="submit" id="generate-proposal-btn" disabled={isGenerating || !isFormValid}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm">
              {isGenerating
                ? <><Loader2 className="w-4 h-4 animate-spin" />Generating with GPT-4o...</>
                : <><Sparkles className="w-4 h-4" />Generate Proposal</>}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="glass rounded-2xl p-6 border border-[var(--border)] flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--text-1)]">Generated Proposal</h2>
            {proposal && (
              <button onClick={handleCopy} id="copy-proposal-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--border-hov)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-all">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

          {!proposal && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-[var(--primary)]" />
              </div>
              <p className="text-sm text-[var(--text-2)] font-medium">Fill in the details and click generate</p>
              <p className="text-xs text-[var(--text-3)] mt-1">GPT-4o will write a professional proposal in seconds</p>
            </div>
          )}

          {(proposal || isGenerating) && (
            <div className="flex-1 overflow-y-auto">
              <div className="text-sm text-[var(--text-1)] leading-relaxed whitespace-pre-wrap font-mono">
                {proposal}
                {isGenerating && (
                  <span className="inline-block w-0.5 h-4 bg-purple-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proposal History */}
      <div className="glass rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[#1e1e2e]">
          <History className="w-4 h-4 text-[var(--text-2)]" />
          <h2 className="font-semibold text-[var(--text-1)] text-sm">Proposal History</h2>
          <span className="ml-auto text-xs text-[var(--text-3)]">{history.length} saved</span>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--text-3)]" />
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-[var(--text-3)] text-sm">
            No proposals yet — generate one above and it will be saved here automatically.
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e2e]">
            {history.map((p) => (
              <div key={p.id}>
                {/* Collapsed row */}
                <div
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--surface)]/[0.02] transition-colors cursor-pointer group"
                  onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-1)] truncate">{p.projectName}</p>
                    <p className="text-xs text-[var(--text-3)] mt-0.5">{p.clientName} · {p.tone}</p>
                  </div>
                  <p className="text-xs text-[var(--text-3)] flex-shrink-0">
                    {new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleCopyHistory(p.id, p.content)}
                      className="p-1.5 rounded-lg text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--surface-2)] transition-all"
                      title="Copy proposal"
                    >
                      {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="p-1.5 rounded-lg text-[var(--text-3)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete proposal"
                    >
                      {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {expandedId === p.id
                    ? <ChevronUp className="w-4 h-4 text-[var(--text-3)] flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-[var(--text-3)] flex-shrink-0" />}
                </div>

                {/* Expanded content */}
                {expandedId === p.id && (
                  <div className="px-5 pb-5 bg-[#0d0d14]">
                    <div className="rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--text-1)] leading-relaxed whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">
                      {p.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
