'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface Props {
  invoice: { id: string; status: string }
}

export default function InvoiceActions({ invoice }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function updateStatus(status: string) {
    setLoading(status)
    try {
      await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  const btnCls = 'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <div className="flex items-center gap-2">
      {invoice.status === 'DRAFT' && (
        <button
          id="mark-sent-btn"
          onClick={() => updateStatus('SENT')}
          disabled={loading !== null}
          className={`${btnCls} bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/20`}
        >
          {loading === 'SENT' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          Mark as Sent
        </button>
      )}

      {['SENT', 'VIEWED', 'OVERDUE'].includes(invoice.status) && (
        <button
          id="mark-paid-btn"
          onClick={() => updateStatus('PAID')}
          disabled={loading !== null}
          className={`${btnCls} bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20`}
        >
          {loading === 'PAID' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
          Mark as Paid
        </button>
      )}

      {!['PAID', 'CANCELLED'].includes(invoice.status) && (
        <button
          id="cancel-invoice-btn"
          onClick={() => updateStatus('CANCELLED')}
          disabled={loading !== null}
          className={`${btnCls} bg-[var(--bg)]0/10 hover:bg-red-500/10 text-[var(--text-3)] hover:text-red-400 border border-slate-500/10 hover:border-red-500/20`}
        >
          {loading === 'CANCELLED' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
          Cancel
        </button>
      )}
    </div>
  )
}
