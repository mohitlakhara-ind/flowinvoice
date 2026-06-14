# FlowInvoice 🧾

> **AI-Powered Freelancer Client Portal & Billing SaaS**

A production-ready SaaS application for freelancers to manage clients, projects, time logs, and invoices — with Razorpay payment integration and GPT-4o AI proposal generation.

**Live Demo:** [flowinvoice.vercel.app](https://flowinvoice.vercel.app) *(deploy link here)*

---

## 🎯 Problem Statement

Freelancers lose an average of **15% of their revenue** to late or unpaid invoices. Existing tools (FreshBooks, Zoho) are expensive and over-engineered for solo developers. FlowInvoice is a lean, developer-friendly billing tool that covers everything you need.

---

## ✨ Features

- **Client Management** — Add, edit, and track clients with full contact details
- **Project Tracking** — Create projects per client with status, hourly rate, and fixed budget
- **Time Logging** — Log billable hours, mark as invoiced automatically
- **Invoice Generation** — Build professional invoices with line items, tax, discounts
- **Razorpay Payments** — Payment links embedded in invoices; webhook handles payment confirmation
- **Client Portal** — Magic link so clients can view/pay invoices without an account
- **AI Proposal Writer** — GPT-4o drafts proposals with 3 tone modes (streaming SSE)
- **Revenue Dashboard** — Recharts area chart showing 6-month revenue trends
- **Role-Based Access** — JWT sessions, protected routes via middleware

---

## 🛠️ Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 15 (App Router) | Server components, streaming, SEO |
| Database | PostgreSQL (Railway) | Transactional integrity for billing |
| ORM | Prisma | Type-safe queries, migrations |
| Auth | NextAuth v5 (JWT) | Session management, credentials provider |
| Payments | Razorpay | Indian market, UPI + cards |
| AI | OpenAI GPT-4o (SSE streaming) | Real-time proposal generation |
| Styling | Tailwind CSS v4 | Design system tokens |
| Charts | Recharts | Revenue visualization |
| Email | Resend | Invoice email notifications |

---

## 🏗️ Architecture Decisions

**Why PostgreSQL over MongoDB?**
Invoice generation requires transactional integrity. When an invoice is created and a payment fails to record, we need database-level rollback guarantees. PostgreSQL + Prisma transactions handle this reliably.

**Why Razorpay webhooks are idempotent:**
A payment can trigger multiple webhook events. The handler checks `payment.status !== 'COMPLETED'` before updating, preventing duplicate payment records.

**Why SSE for AI proposals:**
Using Server-Sent Events for the proposal generator provides a typewriter effect, giving immediate feedback rather than waiting 5-10 seconds for a complete response.

---

## 🚀 Getting Started

```bash
# Clone and install
git clone https://github.com/mohitlakhara-ind/flowinvoice
cd flowinvoice
npm install

# Setup environment
cp .env.example .env.local
# Fill in DATABASE_URL, NEXTAUTH_SECRET, RAZORPAY_KEY_ID, OPENAI_API_KEY

# Push DB schema and start
npm run db:push
npm run dev
```

---

## 📁 Project Structure

```
flowinvoice/
├── app/
│   ├── login/ register/   # Auth pages
│   ├── dashboard/         # Protected routes
│   │   ├── page.tsx       # Overview + stats + charts
│   │   ├── clients/       # Client CRUD
│   │   ├── projects/      # Project management
│   │   ├── invoices/      # Invoice builder
│   │   ├── time-logs/     # Time tracking
│   │   └── ai/            # AI proposal generator
│   └── api/
│       ├── auth/          # NextAuth + registration
│       ├── clients/       # REST API
│       ├── invoices/      # Invoice + Razorpay
│       └── ai/proposal/   # GPT-4o streaming
├── components/dashboard/  # Sidebar, header, charts
├── lib/prisma.ts          # Singleton Prisma client
├── prisma/schema.prisma   # Full data model
├── auth.ts                # NextAuth v5 config
└── middleware.ts          # Route protection
```

---

## 🔐 Security Notes

- Passwords hashed with bcrypt (cost factor 12)
- All API routes verify JWT session before DB operations
- Razorpay webhooks verified with HMAC-SHA256 signature
- Client portal uses signed magic tokens (not exposing user IDs)

---

Built by [Mohit Lakhara](https://github.com/mohitlakhara-ind)
