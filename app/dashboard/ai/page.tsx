'use client'

import { useState } from 'react'
import { Bot, Sparkles, Copy, Check, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

const tones = [
  { value: 'professional', label: '🎩 Professional', desc: 'Formal & polished' },
  { value: 'friendly', label: '😊 Friendly', desc: 'Warm & approachable' },
  { value: 'assertive', label: '💪 Assertive', desc: 'Direct & confident' },
] as const

type Tone = typeof tones[number]['value']

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

      // Stream the response
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
              if (parsed.text) {
                setProposal((prev) => prev + parsed.text)
              }
            } catch { /* skip */ }
          }
        }
      }
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

  const isFormValid = form.clientName && form.projectName && form.projectScope.length >= 10

  return (
    <div className="max-w-5xl space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-5 h-5 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">AI Tools</h1>
        </div>
        <p className="text-slate-400 text-sm">GPT-4o powered tools to supercharge your freelance business</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="font-semibold text-white">Proposal Generator</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Client Name *</label>
                <input
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Project Name *</label>
                <input
                  name="projectName"
                  value={form.projectName}
                  onChange={handleChange}
                  placeholder="E-commerce Redesign"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Project Scope *</label>
              <textarea
                name="projectScope"
                value={form.projectScope}
                onChange={handleChange}
                rows={4}
                placeholder="Describe what the client needs. Include tech stack, features, goals, and any specific requirements..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Budget (optional)</label>
                <input
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="₹50,000"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Timeline (optional)</label>
                <input
                  name="timeline"
                  value={form.timeline}
                  onChange={handleChange}
                  placeholder="4 weeks"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#1a1a24] border border-[#2a2a3a] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm transition-colors"
                />
              </div>
            </div>

            {/* Tone selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Tone</label>
              <div className="grid grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, tone: t.value }))}
                    className={clsx(
                      'p-2.5 rounded-xl border text-center transition-all text-xs',
                      form.tone === t.value
                        ? 'border-purple-500/50 bg-purple-500/15 text-purple-300'
                        : 'border-[#2a2a3a] bg-[#1a1a24] text-slate-400 hover:border-[#3a3a50]'
                    )}
                  >
                    <div className="font-medium">{t.label}</div>
                    <div className="text-[10px] mt-0.5 opacity-70">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              id="generate-proposal-btn"
              disabled={isGenerating || !isFormValid}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating with GPT-4o...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Proposal
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="glass rounded-2xl p-6 border border-[#2a2a3a] flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Generated Proposal</h2>
            {proposal && (
              <button
                onClick={handleCopy}
                id="copy-proposal-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[#1a1a24] border border-[#2a2a3a] hover:border-[#3a3a50] text-slate-400 hover:text-white transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>

          {!proposal && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-sm text-slate-400 font-medium">Fill in the details and click generate</p>
              <p className="text-xs text-slate-500 mt-1">GPT-4o will write a professional proposal in seconds</p>
            </div>
          )}

          {(proposal || isGenerating) && (
            <div className="flex-1 overflow-y-auto">
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-mono">
                {proposal}
                {isGenerating && (
                  <span className="inline-block w-0.5 h-4 bg-purple-400 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
