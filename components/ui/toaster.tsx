'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group glass border border-[#2a2a3a] text-white',
          description: 'text-slate-400',
          actionButton: 'bg-indigo-600 text-white',
          cancelButton: 'bg-[#1a1a24] text-slate-400',
        },
      }}
    />
  )
}
