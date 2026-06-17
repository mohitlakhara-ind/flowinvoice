'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Settings, User, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) setProfile({ name: data.user.name ?? '', email: data.user.email ?? '' })
      })
  }, [])

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg(null)
    setProfileLoading(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profile.name }),
      })
      if (res.ok) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully.' })
      } else {
        const d = await res.json()
        setProfileMsg({ type: 'error', text: d.error ?? 'Failed to update profile.' })
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setProfileLoading(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPassMsg(null)
    if (passwords.newPass !== passwords.confirm) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    if (passwords.newPass.length < 8) {
      setPassMsg({ type: 'error', text: 'Password must be at least 8 characters.' })
      return
    }
    setPassLoading(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      })
      if (res.ok) {
        setPassMsg({ type: 'success', text: 'Password changed successfully.' })
        setPasswords({ current: '', newPass: '', confirm: '' })
      } else {
        const d = await res.json()
        setPassMsg({ type: 'error', text: d.error ?? 'Failed to change password.' })
      }
    } catch {
      setPassMsg({ type: 'error', text: 'Something went wrong.' })
    } finally {
      setPassLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/30 text-sm transition-colors'
  const labelCls = 'block text-xs font-medium text-[var(--text-2)] mb-1.5'

  function Alert({ msg }: { msg: { type: 'success' | 'error'; text: string } }) {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
        {msg.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
        {msg.text}
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-[var(--text-2)]" />
        <h1 className="text-2xl font-bold text-[var(--text-1)]">Settings</h1>
      </div>

      {/* Profile */}
      <div className="glass rounded-2xl p-6 border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-[var(--text-2)]" />
          <h2 className="font-semibold text-[var(--text-1)] text-sm">Profile</h2>
        </div>
        {profileMsg && <div className="mb-4"><Alert msg={profileMsg} /></div>}
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name" className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input value={profile.email} disabled className={`${inputCls} opacity-50 cursor-not-allowed`} />
            <p className="text-xs text-[var(--text-2)] mt-1">Email cannot be changed.</p>
          </div>
          <button type="submit" id="save-profile-btn" disabled={profileLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--primary)] hover:bg-[var(--primary)] disabled:opacity-50 transition-all flex items-center gap-2">
            {profileLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="glass rounded-2xl p-6 border border-[var(--border)]">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-[var(--text-2)]" />
          <h2 className="font-semibold text-[var(--text-1)] text-sm">Change Password</h2>
        </div>
        {passMsg && <div className="mb-4"><Alert msg={passMsg} /></div>}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className={labelCls}>Current Password</label>
            <input type="password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              placeholder="••••••••" className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>New Password</label>
            <input type="password" value={passwords.newPass} onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
              placeholder="Min. 8 characters" className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <input type="password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="••••••••" className={inputCls} required />
          </div>
          <button type="submit" id="change-password-btn" disabled={passLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[var(--primary)] hover:bg-[var(--primary)] disabled:opacity-50 transition-all flex items-center gap-2">
            {passLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</> : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
