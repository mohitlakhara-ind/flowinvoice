import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, Zap, Shield, FileText, CreditCard, Bot,
  BarChart3, Users, Folder, Clock, CheckCircle2, PlayCircle,
  Sparkles, PenTool, LayoutDashboard, Calendar, Search,
  Rocket, Phone, Star, User
} from 'lucide-react'
import { ModeToggle } from '@/components/mode-toggle'
import { LandingProfileDropdown } from '@/components/landing-profile-dropdown'

import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Soloflow — Smart Invoicing, AI Proposals & Client Portal SaaS',
  description: 'AI-powered invoicing and project suite for freelancers. Log billable hours, generate custom contracts, accept Razorpay payments, and stream GPT-4o proposals.',
  alternates: {
    canonical: '/',
  },
}

// Section 4: Problem Data
const problems = [
  { icon: Search, title: 'Scattered Client Data', desc: 'Contact info lost in emails and notes' },
  { icon: FileText, title: 'Manual Invoicing', desc: 'Hours wasted creating invoices in Word' },
  { icon: Clock, title: 'Lost Billable Hours', desc: 'Forgetting to log time costs you money' },
  { icon: CreditCard, title: 'Payment Chaos', desc: "Never sure what's been paid or what's overdue" },
  { icon: BarChart3, title: 'Zero Revenue Visibility', desc: "No idea if you're actually profitable" },
  { icon: LayoutDashboard, title: 'Tool Overload', desc: 'Paying for 5 different subscriptions' },
]

// Section 5: Features Data
const features = [
  { icon: Users, title: 'Client Management', desc: 'Store details, contact history, quick search, notes', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  { icon: Folder, title: 'Project Tracking', desc: 'Organize projects, track status, budgets, milestones', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { icon: Clock, title: 'Time Tracking', desc: 'Log hours, billable tracking, timer, productivity insights', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { icon: FileText, title: 'Smart Invoicing', desc: 'Professional invoices, PDF export, GST support, reminders', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: CreditCard, title: 'Payment Tracking', desc: 'Track paid invoices, outstanding amounts, revenue reports', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { icon: Sparkles, title: 'AI Proposal Generator', desc: 'Generate proposals instantly, professional templates, save hours', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', badge: 'NEW' },
]

// Section 8: AI Tools Data
const aiTools = [
  { icon: Sparkles, title: 'Proposal Generator', desc: 'Generate winning proposals in seconds tailored to the client.' },
  { icon: LayoutDashboard, title: 'Project Scope Builder', desc: 'Auto-generate detailed requirements from a brief.' },
  { icon: PenTool, title: 'Client Response Writer', desc: 'Professional replies crafted instantly for tough emails.' },
  { icon: FileText, title: 'Invoice Description AI', desc: 'Smart line item suggestions based on your logged time.' },
]

export default async function LandingPage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-1)] selection:bg-[var(--primary)]/20 antialiased overflow-x-hidden">
      
      {/* 1. STICKY NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border)] shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--primary)] fill-[var(--primary)]" />
            <span className="text-xl font-extrabold tracking-tight text-[var(--text-1)]">Soloflow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-[var(--text-2)] hover:text-[var(--primary)] transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-semibold text-[var(--text-2)] hover:text-[var(--primary)] transition-colors">Pricing</a>
            <a href="#ai-tools" className="text-sm font-semibold text-[var(--primary)] border-b-2 border-[var(--primary)] pb-0.5">AI Tools</a>
            <a href="#" className="text-sm font-semibold text-[var(--text-2)] hover:text-[var(--primary)] transition-colors">Blog</a>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            {session?.user ? (
                <LandingProfileDropdown user={session.user} />
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-sm font-semibold text-[var(--text-2)] hover:text-[var(--text-1)] transition-colors">Sign In</Link>
                <Link href="/register" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-5 py-2.5 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5">
                  Start Free <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden bg-[var(--bg)]">
        {/* Subtle Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-sm font-semibold mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            Now with AI Proposal Generator
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-[80px] leading-[1.1] font-extrabold tracking-tight mb-6 text-[var(--text-1)]">
            Run Your Freelance Business From <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] via-violet-500 to-cyan-500">One Dashboard</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-2)] mb-10 max-w-2xl mx-auto leading-relaxed">
            Manage clients, track projects, log billable hours, generate invoices, receive payments, and monitor revenue — all in one powerful workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session?.user ? (
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-semibold shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg">
                <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
              </Link>
            ) : (
              <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-semibold shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg">
                <Rocket className="w-5 h-5" /> Start Free <span className="text-sm opacity-80 font-normal ml-1">— No credit card needed</span>
              </Link>
            )}
            <button className="w-full sm:w-auto px-8 py-4 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text-1)] rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 text-lg shadow-sm">
              <PlayCircle className="w-5 h-5 text-[var(--text-3)]" /> Watch Demo
            </button>
          </div>

          <p className="mt-8 text-sm font-medium text-[var(--text-3)] flex items-center justify-center gap-2">
            <span className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </span>
            Trusted by 10,000+ freelancers worldwide
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-20 max-w-6xl mx-auto relative z-10 perspective-1000 px-4">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)] bg-[#0F172A] transform rotate-x-2 hover:rotate-x-0 transition-transform duration-700">
            {/* Browser Header */}
            <div className="bg-[var(--surface-2)] px-4 py-3 flex items-center gap-2 border-b border-[var(--border)]">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <div className="mx-auto text-xs text-[var(--text-3)] font-medium px-4 py-1 bg-[var(--surface)] rounded-md border border-[var(--border)]">app.soloflow.com</div>
            </div>
            
            {/* Fake Dashboard Body */}
            <div className="h-[400px] md:h-[600px] bg-[var(--bg)] relative overflow-hidden flex">
              
              {/* UI Wireframe: Sidebar */}
              <div className="w-64 bg-[var(--surface)] border-r border-[var(--border)] p-4 hidden md:block opacity-50 grayscale">
                <div className="flex items-center gap-2 mb-8 px-2">
                  <div className="w-6 h-6 rounded-md bg-[var(--primary)]/20" />
                  <div className="w-24 h-4 rounded bg-[var(--surface-2)]" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 rounded bg-[var(--primary)]/10" />
                  <div className="h-8 rounded bg-[var(--surface-2)]" />
                  <div className="h-8 rounded bg-[var(--surface-2)]" />
                  <div className="h-8 rounded bg-[var(--surface-2)]" />
                </div>
              </div>

              {/* UI Wireframe: Main Content */}
              <div className="flex-1 flex flex-col opacity-50 grayscale">
                <div className="h-16 border-b border-[var(--border)] bg-[var(--surface)]/50 flex items-center justify-between px-6">
                   <div className="w-32 h-4 rounded bg-[var(--surface-2)]" />
                   <div className="w-8 h-8 rounded-full bg-[var(--surface-2)]" />
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="h-24 rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col justify-between">
                      <div className="w-20 h-3 rounded bg-[var(--surface-2)]" />
                      <div className="w-24 h-6 rounded bg-[var(--text-1)]/20" />
                      <div className="w-16 h-2 rounded bg-emerald-500/20" />
                    </div>
                    <div className="h-24 rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col justify-between">
                      <div className="w-20 h-3 rounded bg-[var(--surface-2)]" />
                      <div className="w-24 h-6 rounded bg-[var(--text-1)]/20" />
                      <div className="w-16 h-2 rounded bg-amber-500/20" />
                    </div>
                    <div className="h-24 rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col justify-between">
                      <div className="w-20 h-3 rounded bg-[var(--surface-2)]" />
                      <div className="w-24 h-6 rounded bg-[var(--text-1)]/20" />
                      <div className="w-16 h-2 rounded bg-[var(--primary)]/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 h-64 rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4 flex flex-col">
                      <div className="w-32 h-4 rounded bg-[var(--surface-2)] mb-4" />
                      <div className="flex-1 flex items-end gap-2">
                        {[40, 70, 45, 90, 65, 120, 85].map((h, i) => (
                          <div key={i} className="flex-1 bg-[var(--primary)]/20 rounded-t-sm" style={{ height: `${(h/120)*100}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="h-64 rounded-xl bg-[var(--surface)] border border-[var(--border)] p-4">
                      <div className="w-24 h-4 rounded bg-[var(--surface-2)] mb-6" />
                      <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--surface-2)]" />
                            <div className="space-y-1.5 flex-1">
                              <div className="w-full h-2 rounded bg-[var(--surface-2)]" />
                              <div className="w-1/2 h-2 rounded bg-[var(--surface-2)]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Overlay overlaying the wireframe */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5 pointer-events-none mix-blend-overlay" />
              
              {/* Floating Cards (Glassmorphism) */}
              <div className="absolute bottom-16 left-4 md:left-12 glass border border-[var(--border)] p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500"><CheckCircle2 className="w-6 h-6" /></div>
                <div>
                  <p className="text-[var(--text-1)] font-semibold text-sm">Invoice Paid</p>
                  <p className="text-[var(--text-3)] text-xs">₹25,000 • Acme Corp</p>
                </div>
              </div>

              <div className="absolute top-24 right-4 md:right-16 glass border border-[var(--primary)]/30 p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }}>
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]"><Sparkles className="w-5 h-5" /></div>
                <div>
                  <p className="text-[var(--text-1)] font-semibold text-sm">AI Proposal Ready</p>
                  <p className="text-[var(--text-3)] text-xs">E-commerce Redesign</p>
                </div>
              </div>

              <div className="absolute bottom-32 right-8 md:right-32 glass border border-[var(--border)] p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}>
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)]"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="text-[var(--text-1)] font-semibold text-sm">New Client Added</p>
                  <p className="text-[var(--text-3)] text-xs">Stark Industries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL PROOF STRIP */}
      <section className="bg-[var(--surface)] py-12 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm font-semibold text-[var(--text-3)] uppercase tracking-wider mb-8">Trusted By Modern Freelancers Across Industries</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {['Developer', 'Designer', 'Writer', 'Consultant', 'Video Editor', 'Marketer'].map((role) => (
              <div key={role} className="flex items-center gap-2 font-bold text-[var(--text-1)] text-lg">
                <div className="w-8 h-8 rounded-lg bg-[var(--surface-2)] flex items-center justify-center">
                  <div className="w-4 h-4 bg-[var(--text-3)] rounded-sm" />
                </div>
                {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROBLEM SECTION */}
      <section className="py-24 px-6 bg-[var(--bg)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm mb-2 block">The Problem</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[var(--text-1)]">Freelancers Waste Hours Managing Business</h2>
            <p className="text-lg text-[var(--text-2)] max-w-2xl mx-auto">Without the right tools, you&apos;re losing money and time every single day.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((prob) => (
              <div key={prob.title} className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <prob.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-1)] mb-2">{prob.title}</h3>
                <p className="text-[var(--text-2)]">{prob.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SOLUTION / FEATURES SECTION */}
      <section id="features" className="py-24 px-6 bg-[var(--surface)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] font-semibold tracking-wider uppercase text-sm mb-2 block">The Solution</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[var(--text-1)]">Everything Your Freelance Business Needs</h2>
            <p className="text-lg text-[var(--text-2)] max-w-2xl mx-auto">One platform that replaces 5 tools and saves you hours every week.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat) => (
              <div key={feat.title} className="bg-[var(--bg)] border border-[var(--border)] p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 relative">
                {feat.badge && (
                  <span className="absolute top-6 right-6 bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold px-2 py-1 rounded-md">
                    {feat.badge}
                  </span>
                )}
                <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center mb-6`}>
                  <feat.icon className={`w-7 h-7 ${feat.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-1)] mb-3">{feat.title}</h3>
                <p className="text-[var(--text-2)] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WORKFLOW SECTION */}
      <section className="py-24 px-6 bg-[var(--surface-2)] text-[var(--text-1)] overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Your Entire Business Workflow, Simplified</h2>
          <p className="text-lg text-[var(--text-2)] max-w-2xl mx-auto mb-20">From first client contact to final payment — Soloflow handles it all.</p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-10 right-10 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-30 rounded-full" />
            
            {[
              { icon: Users, label: 'Add Client' },
              { icon: Folder, label: 'Create Project' },
              { icon: Clock, label: 'Track Time' },
              { icon: FileText, label: 'Generate Invoice' },
              { icon: CreditCard, label: 'Receive Payment' },
              { icon: BarChart3, label: 'Analyze Revenue' },
            ].map((step, i) => (
              <div key={step.label} className="flex flex-col items-center relative z-10 group">
                <div className="w-24 h-24 rounded-full bg-[var(--bg)] border-4 border-[var(--surface-2)] flex items-center justify-center mb-4 shadow-xl group-hover:scale-110 group-hover:bg-[var(--primary)] transition-all duration-300">
                  <step.icon className="w-10 h-10 text-[var(--text-3)] group-hover:text-white" />
                </div>
                <h4 className="font-bold text-lg">{step.label}</h4>
                <p className="text-[var(--text-3)] text-sm mt-1">Step 0{i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. STATISTICS SECTION */}
      <section className="py-20 px-6 bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[var(--border)]">
            {[
              { num: '10,000+', label: 'Invoices Generated' },
              { num: '₹5M+', label: 'Payments Tracked' },
              { num: '50,000+', label: 'Hours Logged' },
              { num: '98%', label: 'User Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4">
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-cyan-500 mb-2">
                  {stat.num}
                </div>
                <div className="text-[var(--text-3)] font-semibold uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. AI TOOLS SECTION */}
      <section id="ai-tools" className="py-24 px-6 bg-[var(--surface)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--primary)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[var(--primary)] font-bold tracking-wider uppercase text-sm mb-2">
                <Bot className="w-4 h-4" /> Powered by GPT-4o
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[var(--text-1)]">Work Smarter With AI</h2>
              <p className="text-lg text-[var(--text-2)] max-w-xl">Let AI handle the writing, formatting, and heavy lifting so you can focus on doing the actual work.</p>
            </div>
            <Link href="/register" className="px-6 py-3 bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-1)] rounded-xl font-bold transition-colors shadow-sm whitespace-nowrap">
              Try AI Tools Free →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiTools.map((tool) => (
              <div key={tool.title} className="bg-[var(--bg)] backdrop-blur-sm rounded-2xl p-6 border border-[var(--border)] border-t-4 border-t-[var(--primary)] hover:-translate-y-1 transition-transform shadow-xl">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/20 flex items-center justify-center mb-4">
                  <tool.icon className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h3 className="font-bold text-lg text-[var(--text-1)] mb-2">{tool.title}</h3>
                <p className="text-[var(--text-2)] text-sm leading-relaxed">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[var(--text-1)]">Simple, Transparent Pricing</h2>
          <p className="text-lg text-[var(--text-2)] mb-12">No hidden fees. Cancel anytime. Start for free.</p>

          <div className="flex justify-center mb-16">
            <div className="bg-[var(--surface-2)] p-1 rounded-xl inline-flex items-center">
              <button className="px-6 py-2.5 bg-[var(--surface)] shadow-sm rounded-lg font-bold text-[var(--text-1)] border border-[var(--border)]">Monthly</button>
              <button className="px-6 py-2.5 rounded-lg font-bold text-[var(--text-3)] hover:text-[var(--text-1)]">Annually <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full ml-1">Save 20%</span></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Starter */}
            <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              <h3 className="text-2xl font-bold text-[var(--text-1)] mb-2">Starter</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black">₹0</span><span className="text-[var(--text-3)] mb-1">/month</span>
              </div>
              <p className="text-[var(--text-2)] mb-8 pb-8 border-b border-[var(--border)]">Perfect for freelancers just starting out.</p>
              <ul className="space-y-4 mb-8">
                {['Up to 5 clients', 'Unlimited invoices', 'Time tracking', 'Basic dashboard', 'Email support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[var(--text-2)] font-medium"><CheckCircle2 className="w-5 h-5 text-[var(--primary)]" /> {f}</li>
                ))}
              </ul>
              <Link href="/register" className="block w-full py-3.5 px-4 text-center rounded-xl border-2 border-[var(--border)] text-[var(--text-2)] font-bold hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors">Get Started Free</Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-3xl border-2 border-[var(--primary)] bg-[var(--surface)] shadow-[0_0_40px_-10px_rgba(79,70,229,0.2)] relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--primary)] text-white px-4 py-1 rounded-full text-sm font-bold tracking-wide">MOST POPULAR</div>
              <h3 className="text-2xl font-bold text-[var(--text-1)] mb-2">Professional</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black">₹499</span><span className="text-[var(--text-3)] mb-1">/month</span>
              </div>
              <p className="text-[var(--text-2)] mb-8 pb-8 border-b border-[var(--border)]">Everything you need to scale your business.</p>
              <ul className="space-y-4 mb-8">
                {['Unlimited clients', 'AI proposal generator', 'Advanced analytics', 'Payment tracking', 'PDF export', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[var(--text-2)] font-medium"><CheckCircle2 className="w-5 h-5 text-[var(--primary)]" /> {f}</li>
                ))}
              </ul>
              <Link href="/register" className="block w-full py-3.5 px-4 text-center rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary)]/90 shadow-md transition-colors">Start 14-Day Free Trial</Link>
            </div>

            {/* Agency */}
            <div className="p-8 rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
              <h3 className="text-2xl font-bold text-[var(--text-1)] mb-2">Agency</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black">₹1,499</span><span className="text-[var(--text-3)] mb-1">/month</span>
              </div>
              <p className="text-[var(--text-2)] mb-8 pb-8 border-b border-[var(--border)]">For small teams and growing agencies.</p>
              <ul className="space-y-4 mb-8">
                {['Everything in Pro', 'Team collaboration', 'Custom branding', 'White-label options', 'Dedicated account manager'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[var(--text-2)] font-medium"><CheckCircle2 className="w-5 h-5 text-[var(--primary)]" /> {f}</li>
                ))}
              </ul>
              <Link href="/register" className="block w-full py-3.5 px-4 text-center rounded-xl border-2 border-[var(--border)] text-[var(--text-2)] font-bold hover:border-[var(--text-1)] transition-colors">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. TESTIMONIALS SECTION */}
      <section className="py-24 px-6 bg-[var(--surface)] border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-[var(--text-1)]">Loved By Freelancers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { name: 'Rahul M.', role: 'Freelance Developer', init: 'R', color: 'bg-indigo-500/20 text-indigo-400', text: "Soloflow replaced 4 different tools I was paying for. The invoice + time tracking alone saved me ₹3000/month in subscriptions." },
              { name: 'Priya S.', role: 'UI/UX Designer', init: 'P', color: 'bg-violet-500/20 text-violet-400', text: "I save at least 5 hours every week on admin work. The AI proposal generator is insane — I sent my first proposal in 30 seconds." },
              { name: 'Arjun K.', role: 'Marketing Consultant', init: 'A', color: 'bg-cyan-500/20 text-cyan-400', text: "My entire invoicing process is automated now. Clients pay online, I get notified, the dashboard updates. Magical." }
            ].map(t => (
              <div key={t.name} className="bg-[var(--bg)] p-8 rounded-2xl shadow-sm border border-[var(--border)]">
                <div className="flex gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                </div>
                <p className="text-[var(--text-2)] font-medium mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center font-bold text-xl`}>{t.init}</div>
                  <div>
                    <h4 className="font-bold text-[var(--text-1)]">{t.name}</h4>
                    <p className="text-sm text-[var(--text-3)]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FINAL CTA SECTION */}
      <section className="py-24 px-6 bg-[var(--surface-2)] relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--primary)]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-1)] mb-6 leading-tight">
            Stop Managing Tools.<br/>Start Managing Your Business.
          </h2>
          <p className="text-xl text-[var(--text-2)] mb-10">Everything freelancers need to stay organized, get paid faster, and grow their business.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            {session?.user ? (
              <Link href="/dashboard" className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white rounded-xl font-bold shadow-lg shadow-[var(--primary)]/25 transition-all hover:scale-105 text-lg flex items-center justify-center gap-2">
                <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
              </Link>
            ) : (
              <Link href="/register" className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white rounded-xl font-bold shadow-lg shadow-[var(--primary)]/25 transition-all hover:scale-105 text-lg flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5" /> Start Free Today
              </Link>
            )}
            <button className="px-10 py-4 bg-transparent border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--text-1)] rounded-xl font-bold transition-all text-lg flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> Book a Demo
            </button>
          </div>
          <p className="text-sm text-[var(--text-3)] font-medium">Free forever plan · No credit card required · Setup in 2 minutes</p>
        </div>
      </section>

      {/* 14. FOOTER */}
      <footer className="bg-[var(--bg)] pt-20 pb-10 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-[var(--primary)] fill-[var(--primary)]" />
                <span className="text-xl font-extrabold text-[var(--text-1)]">Soloflow</span>
              </div>
              <p className="text-[var(--text-3)] text-sm max-w-xs mb-6">Smart billing and business management for modern freelancers.</p>
            </div>
            <div>
              <h4 className="text-[var(--text-1)] font-bold mb-4 uppercase tracking-wider text-sm">Product</h4>
              <ul className="space-y-3">
                {['Dashboard', 'Clients', 'Projects', 'Invoices', 'Time Tracking', 'AI Tools'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-[var(--text-3)] hover:text-[var(--primary)] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[var(--text-1)] font-bold mb-4 uppercase tracking-wider text-sm">Resources</h4>
              <ul className="space-y-3">
                {['Documentation', 'Help Center', 'Blog', 'Changelog'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-[var(--text-3)] hover:text-[var(--primary)] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[var(--text-1)] font-bold mb-4 uppercase tracking-wider text-sm">Company</h4>
              <ul className="space-y-3">
                {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service'].map(l => (
                  <li key={l}><a href="#" className="text-sm text-[var(--text-3)] hover:text-[var(--primary)] transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[var(--text-3)] text-sm">© 2026 Soloflow. Built for freelancers, by freelancers.</p>
            <p className="text-[var(--text-3)] text-sm font-medium">Made in India</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
