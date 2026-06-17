/**
 * prisma/seed-demo.ts
 * Seeds a fixed demo user with rich data for screenshot capture.
 * Run: npx tsx --env-file=.env.local prisma/seed-demo.ts
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const DEMO_EMAIL    = 'demo@soloflow.app'
const DEMO_PASSWORD = 'Demo1234!'
const DEMO_NAME     = 'Alex Rivera'

async function main() {
  console.log('🌱 Seeding demo data…')

  // ── 1. Upsert demo user ────────────────────────────────────────────────
  const hashedPw = await bcrypt.hash(DEMO_PASSWORD, 12)
  const user = await prisma.user.upsert({
    where:  { email: DEMO_EMAIL },
    update: { name: DEMO_NAME, password: hashedPw },
    create: { name: DEMO_NAME, email: DEMO_EMAIL, password: hashedPw },
  })
  console.log(`✅ User: ${user.email} (id: ${user.id})`)

  // ── 2. Clear existing data for this user (idempotent re-run) ────────────
  await prisma.proposal.deleteMany({ where: { userId: user.id } })
  await prisma.payment.deleteMany({ where: { invoice: { userId: user.id } } })
  await prisma.invoiceItem.deleteMany({ where: { invoice: { userId: user.id } } })
  await prisma.invoice.deleteMany({ where: { userId: user.id } })
  await prisma.timeLog.deleteMany({ where: { project: { userId: user.id } } })
  await prisma.project.deleteMany({ where: { userId: user.id } })
  await prisma.client.deleteMany({ where: { userId: user.id } })
  console.log('🗑  Cleared previous demo data')

  // ── 3. Clients ──────────────────────────────────────────────────────────
  const clientsData = [
    { name: 'Stripe Inc.',     email: 'billing@stripe.com',    company: 'Stripe',         currency: 'USD', phone: '+1-415-000-0001' },
    { name: 'Vercel Corp.',    email: 'accounts@vercel.com',   company: 'Vercel',         currency: 'USD', phone: '+1-415-000-0002' },
    { name: 'IndiaMart Ltd.',  email: 'pay@indiamart.com',     company: 'IndiaMart',      currency: 'INR', phone: '+91-9800000001'  },
    { name: 'Meesho Pvt Ltd.', email: 'finance@meesho.com',    company: 'Meesho',         currency: 'INR', phone: '+91-9800000002'  },
    { name: 'Nova AI Labs',    email: 'dev@novaailabs.io',     company: 'Nova AI Labs',   currency: 'USD', phone: '+1-650-000-0005' },
  ]

  const clients = await Promise.all(
    clientsData.map(c => prisma.client.create({ data: { ...c, userId: user.id } }))
  )
  console.log(`✅ Created ${clients.length} clients`)

  // ── 4. Projects ─────────────────────────────────────────────────────────
  const now = new Date()
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400_000)
  const daysFromNow = (n: number) => new Date(now.getTime() + n * 86400_000)

  const projectsData = [
    {
      clientId: clients[0].id, name: 'Stripe Dashboard Redesign',
      description: 'Full redesign of the merchant analytics dashboard using React & TailwindCSS.',
      status: 'ACTIVE' as const, hourlyRate: 120, startDate: daysAgo(45), dueDate: daysFromNow(15),
    },
    {
      clientId: clients[1].id, name: 'Vercel Edge Functions',
      description: 'Migrate legacy Lambda functions to Vercel Edge Runtime with Rust optimisations.',
      status: 'ACTIVE' as const, hourlyRate: 150, startDate: daysAgo(20), dueDate: daysFromNow(30),
    },
    {
      clientId: clients[2].id, name: 'IndiaMart Seller Portal',
      description: 'Build a multi-tenant seller portal with real-time inventory sync.',
      status: 'COMPLETED' as const, fixedBudget: 280000, startDate: daysAgo(90), dueDate: daysAgo(5),
    },
    {
      clientId: clients[3].id, name: 'Meesho Mobile App',
      description: 'React Native app for Meesho resellers with push notifications & analytics.',
      status: 'PAUSED' as const, hourlyRate: 95, startDate: daysAgo(60), dueDate: daysFromNow(60),
    },
    {
      clientId: clients[4].id, name: 'Nova AI Chat Widget',
      description: 'Embeddable AI chat widget SDK with streaming support and custom theming.',
      status: 'ACTIVE' as const, fixedBudget: 15000, startDate: daysAgo(10), dueDate: daysFromNow(50),
    },
  ]

  const projects = await Promise.all(
    projectsData.map(p => prisma.project.create({ data: { ...p, userId: user.id } }))
  )
  console.log(`✅ Created ${projects.length} projects`)

  // ── 5. Time Logs ────────────────────────────────────────────────────────
  const timeLogsData = [
    // Stripe project
    { projectId: projects[0].id, description: 'Initial wireframing & stakeholder sync', hours: 4,   date: daysAgo(40), billable: true  },
    { projectId: projects[0].id, description: 'Component library setup (Storybook)',    hours: 6,   date: daysAgo(35), billable: true  },
    { projectId: projects[0].id, description: 'Dashboard charts implementation',        hours: 8,   date: daysAgo(28), billable: true  },
    { projectId: projects[0].id, description: 'Code review & PR feedback',              hours: 2.5, date: daysAgo(20), billable: true  },
    { projectId: projects[0].id, description: 'Internal demo prep',                     hours: 1.5, date: daysAgo(15), billable: false },
    { projectId: projects[0].id, description: 'Dark mode implementation',               hours: 5,   date: daysAgo(7),  billable: true  },
    // Vercel project
    { projectId: projects[1].id, description: 'Architecture design & tech spike',       hours: 6,   date: daysAgo(18), billable: true  },
    { projectId: projects[1].id, description: 'Rust WASM module development',           hours: 10,  date: daysAgo(12), billable: true  },
    { projectId: projects[1].id, description: 'Integration tests & CI pipeline',        hours: 4,   date: daysAgo(5),  billable: true  },
    // IndiaMart (completed)
    { projectId: projects[2].id, description: 'Backend API development',                hours: 40,  date: daysAgo(80), billable: true,  invoiced: true },
    { projectId: projects[2].id, description: 'Frontend seller dashboard',              hours: 35,  date: daysAgo(60), billable: true,  invoiced: true },
    { projectId: projects[2].id, description: 'QA & bug fixes',                        hours: 12,  date: daysAgo(15), billable: true,  invoiced: true },
    // Meesho (paused)
    { projectId: projects[3].id, description: 'React Native setup & navigation',        hours: 8,   date: daysAgo(55), billable: true  },
    { projectId: projects[3].id, description: 'Push notification integration',          hours: 6,   date: daysAgo(50), billable: true  },
    // Nova AI
    { projectId: projects[4].id, description: 'SDK architecture & streaming POC',       hours: 5,   date: daysAgo(8),  billable: true  },
    { projectId: projects[4].id, description: 'Widget theming system',                  hours: 3,   date: daysAgo(3),  billable: true  },
  ]

  await prisma.timeLog.createMany({ data: timeLogsData })
  console.log(`✅ Created ${timeLogsData.length} time logs`)

  // ── 6. Invoices ─────────────────────────────────────────────────────────
  // Invoice 1 — Stripe, PAID
  const inv1 = await prisma.invoice.create({
    data: {
      userId: user.id, clientId: clients[0].id, projectId: projects[0].id,
      invoiceNumber: 'INV-2025-001',
      status: 'PAID',
      issueDate: daysAgo(30), dueDate: daysAgo(15),
      currency: 'USD', taxRate: 0, taxAmount: 0, discountAmount: 0,
      subtotal: 3240, total: 3240,
      notes: 'Thank you for the great collaboration!',
      terms: 'Payment due within 15 days.',
      items: {
        create: [
          { description: 'UI Wireframing & Design',      quantity: 4,   unitPrice: 120, total: 480  },
          { description: 'Component Library (Storybook)', quantity: 6,   unitPrice: 120, total: 720  },
          { description: 'Dashboard Charts',              quantity: 8,   unitPrice: 120, total: 960  },
          { description: 'Dark Mode Implementation',      quantity: 8.5, unitPrice: 120, total: 1020 },
        ],
      },
    },
  })

  // Invoice 2 — IndiaMart, PAID
  const inv2 = await prisma.invoice.create({
    data: {
      userId: user.id, clientId: clients[2].id, projectId: projects[2].id,
      invoiceNumber: 'INV-2025-002',
      status: 'PAID',
      issueDate: daysAgo(20), dueDate: daysAgo(5),
      currency: 'INR', taxRate: 18, taxAmount: 50400, discountAmount: 0,
      subtotal: 280000, total: 330400,
      notes: 'Fixed price delivery — all milestones met.',
      terms: 'Net 15. GST @18% applicable.',
      items: {
        create: [
          { description: 'Backend API Development (Milestone 1)',    quantity: 1, unitPrice: 120000, total: 120000 },
          { description: 'Frontend Seller Dashboard (Milestone 2)',   quantity: 1, unitPrice: 100000, total: 100000 },
          { description: 'QA, Testing & Deployment (Milestone 3)',    quantity: 1, unitPrice: 60000,  total: 60000  },
        ],
      },
    },
  })

  // Invoice 3 — Vercel, SENT (awaiting payment)
  const inv3 = await prisma.invoice.create({
    data: {
      userId: user.id, clientId: clients[1].id, projectId: projects[1].id,
      invoiceNumber: 'INV-2025-003',
      status: 'SENT',
      issueDate: daysAgo(5), dueDate: daysFromNow(25),
      currency: 'USD', taxRate: 0, taxAmount: 0, discountAmount: 500,
      subtotal: 3000, total: 2500,
      notes: 'Early delivery discount applied.',
      terms: 'Net 30.',
      items: {
        create: [
          { description: 'Architecture Design & Tech Spike', quantity: 6,  unitPrice: 150, total: 900  },
          { description: 'Rust WASM Module Development',     quantity: 10, unitPrice: 150, total: 1500 },
          { description: 'Integration Tests & CI Pipeline',  quantity: 4,  unitPrice: 150, total: 600  },
        ],
      },
    },
  })

  // Invoice 4 — Nova AI, DRAFT
  await prisma.invoice.create({
    data: {
      userId: user.id, clientId: clients[4].id, projectId: projects[4].id,
      invoiceNumber: 'INV-2025-004',
      status: 'DRAFT',
      issueDate: now, dueDate: daysFromNow(30),
      currency: 'USD', taxRate: 0, taxAmount: 0, discountAmount: 0,
      subtotal: 1200, total: 1200,
      items: {
        create: [
          { description: 'SDK Architecture & Streaming POC', quantity: 5, unitPrice: 150, total: 750 },
          { description: 'Widget Theming System',             quantity: 3, unitPrice: 150, total: 450 },
        ],
      },
    },
  })

  // Invoice 5 — Meesho, OVERDUE
  await prisma.invoice.create({
    data: {
      userId: user.id, clientId: clients[3].id, projectId: projects[3].id,
      invoiceNumber: 'INV-2025-005',
      status: 'OVERDUE',
      issueDate: daysAgo(45), dueDate: daysAgo(15),
      currency: 'INR', taxRate: 18, taxAmount: 24510, discountAmount: 0,
      subtotal: 136167, total: 160677,
      notes: 'Phase 1 delivery — navigation & push notifications.',
      items: {
        create: [
          { description: 'React Native Setup & Navigation',    quantity: 8, unitPrice: 9500, total: 76000  },
          { description: 'Push Notification Integration',      quantity: 6, unitPrice: 9500, total: 57000  },
          { description: 'Analytics Dashboard Integration',    quantity: 0.33, unitPrice: 9500, total: 3167 },
        ],
      },
    },
  })

  console.log('✅ Created 5 invoices')

  // ── 7. Payments for paid invoices ──────────────────────────────────────
  await prisma.payment.create({
    data: {
      invoiceId: inv1.id, amount: 3240, currency: 'USD',
      status: 'COMPLETED',
      razorpayOrderId: 'order_stripe_demo_001', razorpayPaymentId: 'pay_stripe_demo_001',
      paidAt: daysAgo(14),
    },
  })

  await prisma.payment.create({
    data: {
      invoiceId: inv2.id, amount: 330400, currency: 'INR',
      status: 'COMPLETED',
      razorpayOrderId: 'order_indiamart_demo_002', razorpayPaymentId: 'pay_indiamart_demo_002',
      paidAt: daysAgo(3),
    },
  })

  await prisma.payment.create({
    data: {
      invoiceId: inv3.id, amount: 2500, currency: 'USD',
      status: 'PENDING',
      razorpayOrderId: 'order_vercel_demo_003',
    },
  })
  console.log('✅ Created 3 payment records')

  // ── 8. AI Proposals ─────────────────────────────────────────────────────
  await prisma.proposal.createMany({
    data: [
      {
        userId: user.id, clientName: 'Stripe Inc.', projectName: 'Analytics Dashboard v2',
        projectScope: 'Redesign the merchant analytics dashboard with real-time charts, custom date ranges, and CSV export.',
        budget: '$15,000–$20,000', timeline: '6 weeks', tone: 'professional',
        content: `# Project Proposal: Analytics Dashboard v2

Dear Stripe Team,

I understand you're looking to modernise the merchant analytics experience to better serve your growing customer base. Here's my proposed approach.

## Proposed Approach

**Week 1–2:** Discovery, wireframing, and component audit  
**Week 3–4:** Core dashboard implementation with Recharts & React Query  
**Week 5:** Real-time data streaming via WebSockets  
**Week 6:** CSV export, accessibility audit, and handoff

## Deliverables
- Fully responsive React dashboard
- Reusable chart component library (Storybook)
- E2E test suite (Playwright)
- Performance budget: LCP < 2s

## Investment
Estimated range: **$15,000–$20,000** based on final scope.

I'd love to kick off with a 30-minute discovery call. Let me know your availability!

Best,  
Alex Rivera`,
        createdAt: daysAgo(12),
      },
      {
        userId: user.id, clientName: 'Nova AI Labs', projectName: 'AI Chat Widget SDK',
        projectScope: 'Build an embeddable chat widget SDK that streams AI responses and supports custom theming via CSS variables.',
        budget: '$12,000', timeline: '8 weeks', tone: 'assertive',
        content: `# Project Proposal: AI Chat Widget SDK

Nova AI Labs — you need a production-grade widget SDK, not another prototype. Here's what I deliver.

## What You Get
A battle-tested, TypeScript-first SDK that:
- Streams responses via SSE with automatic reconnection
- Ships in <15 KB gzipped
- Supports React, Vue, and vanilla JS
- Offers full CSS variable theming

## Timeline
8 weeks to production-ready SDK with docs, examples, and npm package.

## Investment
**$12,000 fixed price** — no scope creep, no surprises.

Ready to start next Monday. Shall we lock it in?

— Alex Rivera`,
        createdAt: daysAgo(5),
      },
    ],
  })
  console.log('✅ Created 2 proposals')

  console.log(`\n🎉 Demo seeding complete!`)
  console.log(`   Login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
