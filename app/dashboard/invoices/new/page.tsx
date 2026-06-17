'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Loader2, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

interface Client { id: string; name: string; currency: string }

function NewInvoiceForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedClientId = searchParams.get('clientId') ?? ''

  const [clients, setClients] = useState<Client[]>([])
  const [form, setForm] = useState({
    clientId: preselectedClientId,
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: 'INR',
    taxRate: 18,
    discountAmount: 0,
    notes: '',
    terms: 'Payment due within 30 days of invoice date.',
  })
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/clients').then((r) => r.json()).then(setClients)
    // Auto-generate invoice number
    const num = `INV-${Date.now().toString().slice(-6)}`
    setForm((prev) => ({ ...prev, invoiceNumber: num }))
    // Default due date 30 days from now
    const due = new Date(); due.setDate(due.getDate() + 30)
    setForm((prev) => ({ ...prev, dueDate: due.toISOString().split('T')[0] }))
  }, [])

  useEffect(() => {
    const client = clients.find((c) => c.id === form.clientId)
    if (client) setForm((prev) => ({ ...prev, currency: client.currency }))
  }, [form.clientId, clients])

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const taxAmount = (subtotal * form.taxRate) / 100
  const total = subtotal + taxAmount - form.discountAmount

  function updateItem(idx: number, field: string, value: string | number) {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }
  function addItem() { setItems((prev) => [...prev, { description: '', quantity: 1, unitPrice: 0 }]) }
  function removeItem(idx: number) { setItems((prev) => prev.filter((_, i) => i !== idx)) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!form.clientId) { setError('Please select a client'); return }
    if (items.some((i) => !i.description || i.unitPrice <= 0)) { setError('All line items need a description and price'); return }
    setIsLoading(true)
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, taxRate: Number(form.taxRate), discountAmount: Number(form.discountAmount), items }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to create invoice'); return }
      router.push(`/dashboard/invoices/${data.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 text-sm transition-colors'
  const labelCls = 'block text-xs font-medium text-[var(--text-2)] mb-1.5'
  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: form.currency, maximumFractionDigits: 2 }).format(n)

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/invoices" className="p-2 rounded-xl hover:bg-[var(--surface-2)] text-[var(--text-2)] hover:text-[var(--text-1)] transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-1)]">New Invoice</h1>
          <p className="text-[var(--text-2)] text-sm mt-0.5">Create a professional invoice for your client</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Invoice details */}
        <div className="glass rounded-2xl p-6 border border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text-1)] text-sm mb-5">Invoice Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Client *</label>
              <select name="clientId" value={form.clientId} onChange={(e) => setForm((p) => ({ ...p, clientId: e.target.value }))} className={inputCls} required>
                <option value="">Select a client...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Invoice Number *</label>
              <input value={form.invoiceNumber} onChange={(e) => setForm((p) => ({ ...p, invoiceNumber: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <select value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))} className={inputCls}>
                {['INR', 'USD', 'EUR', 'GBP'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Issue Date *</label>
              <input type="date" value={form.issueDate} onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Due Date *</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} className={inputCls} required />
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="glass rounded-2xl p-6 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-[var(--text-1)] text-sm">Line Items</h2>
            <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-xs text-[var(--primary)] hover:text-indigo-300 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-3 text-xs font-medium text-[var(--text-3)] uppercase px-1">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-6">
                  <input value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)}
                    placeholder="Service description..." className={inputCls} />
                </div>
                <div className="col-span-2">
                  <input type="number" min="0.01" step="0.01" value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    className={`${inputCls} text-center`} />
                </div>
                <div className="col-span-2">
                  <input type="number" min="0" step="0.01" value={item.unitPrice}
                    onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className={inputCls} />
                </div>
                <div className="col-span-1 text-right text-sm text-[var(--text-1)] font-medium">
                  {fmt(item.quantity * item.unitPrice)}
                </div>
                <div className="col-span-1 flex justify-end">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-[var(--text-2)] hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-5 border-t border-[#1e1e2e]">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm text-[var(--text-2)]">
                  <span>Subtotal</span><span className="text-[var(--text-1)]">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-[var(--text-2)]">
                  <span>Tax (%)</span>
                  <input type="number" min="0" max="100" step="0.1" value={form.taxRate}
                    onChange={(e) => setForm((p) => ({ ...p, taxRate: parseFloat(e.target.value) || 0 }))}
                    className="w-16 px-2 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] text-right text-sm focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div className="flex justify-between text-sm text-[var(--text-2)]">
                  <span>Tax ({form.taxRate}%)</span><span>{fmt(taxAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-[var(--text-2)]">
                  <span>Discount</span>
                  <input type="number" min="0" step="0.01" value={form.discountAmount}
                    onChange={(e) => setForm((p) => ({ ...p, discountAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-24 px-2 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] text-right text-sm focus:outline-none focus:border-[var(--primary)]" />
                </div>
                <div className="flex justify-between text-base font-bold text-[var(--text-1)] pt-2 border-t border-[var(--border)]">
                  <span>Total</span><span className="text-indigo-300">{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="glass rounded-2xl p-6 border border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text-1)] text-sm mb-5">Notes & Terms</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                rows={3} placeholder="Thank you for your business!" className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>Payment Terms</label>
              <textarea value={form.terms} onChange={(e) => setForm((p) => ({ ...p, terms: e.target.value }))}
                rows={3} className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/dashboard/invoices" className="flex-1 py-3 rounded-xl text-center text-sm font-medium text-[var(--text-2)] border border-[var(--border)] hover:bg-[var(--surface-2)] transition-all">
            Cancel
          </Link>
          <button type="submit" id="create-invoice-submit" disabled={isLoading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[var(--primary)] hover:bg-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating...</> : 'Create Invoice'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" /></div>}>
      <NewInvoiceForm />
    </Suspense>
  )
}
