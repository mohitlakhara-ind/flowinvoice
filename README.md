# Soloflow 🧾

![Soloflow Banner](https://res.cloudinary.com/dhjkbcdfm/image/upload/v1781679012/portfolio_projects/soloflow/dashboard_dark.png)

> **AI-Powered Freelancer Client Portal & Billing SaaS**

A production-ready SaaS application for freelancers to manage clients, projects, time logs, and invoices — with Razorpay payment integration and GPT-4o AI proposal generation.

**Live Demo:** [soloflow.vercel.app](https://soloflow.vercel.app) *(deploy link here)*

---

## 🎯 Problem Statement

Freelancers lose an average of **15% of their revenue** to late or unpaid invoices. Existing tools (FreshBooks, Zoho) are expensive and over-engineered for solo developers. Soloflow is a lean, developer-friendly billing tool that covers everything you need.

---

## 📸 Screenshots

Here is a look at Soloflow across different pages in both Light and Dark modes.

### 🖥️ Desktop (1440px)

#### Landing & Authentication
| Dark Mode | Light Mode |
|-----------|------------|
| ![Landing Dark](screenshots/landing-dark.png) | ![Landing Light](screenshots/landing-light.png) |
| ![Sign In Dark](screenshots/login-dark.png) | ![Sign In Light](screenshots/login-light.png) |
| ![Sign Up Dark](screenshots/register-dark.png) | ![Sign Up Light](screenshots/register-light.png) |
| ![404 Dark](screenshots/not-found-dark.png) | ![404 Light](screenshots/not-found-light.png) |

#### Dashboard (Protected)
| Dark Mode | Light Mode |
|-----------|------------|
| ![Home Dark](screenshots/dashboard-home-dark.png) | ![Home Light](screenshots/dashboard-home-light.png) |
| ![Projects Dark](screenshots/dashboard-projects-dark.png) | ![Projects Light](screenshots/dashboard-projects-light.png) |
| ![Invoices Dark](screenshots/dashboard-invoices-dark.png) | ![Invoices Light](screenshots/dashboard-invoices-light.png) |
| ![Clients Dark](screenshots/dashboard-clients-dark.png) | ![Clients Light](screenshots/dashboard-clients-light.png) |
| ![AI Tools Dark](screenshots/dashboard-ai-dark.png) | ![AI Tools Light](screenshots/dashboard-ai-light.png) |
| ![Time Logs Dark](screenshots/dashboard-time-logs-dark.png) | ![Time Logs Light](screenshots/dashboard-time-logs-light.png) |
| ![Settings Dark](screenshots/dashboard-settings-dark.png) | ![Settings Light](screenshots/dashboard-settings-light.png) |
| ![Profile Dark](screenshots/dashboard-profile-dark.png) | ![Profile Light](screenshots/dashboard-profile-light.png) |

---

### 📱 Tablet (768px)

#### Landing & Authentication
| Dark Mode | Light Mode |
|-----------|------------|
| ![Landing Dark](screenshots/medium/landing-dark.png) | ![Landing Light](screenshots/medium/landing-light.png) |
| ![Sign In Dark](screenshots/medium/login-dark.png) | ![Sign In Light](screenshots/medium/login-light.png) |
| ![Sign Up Dark](screenshots/medium/register-dark.png) | ![Sign Up Light](screenshots/medium/register-light.png) |
| ![404 Dark](screenshots/medium/not-found-dark.png) | ![404 Light](screenshots/medium/not-found-light.png) |

#### Dashboard (Tablet)
| Dark Mode | Light Mode |
|-----------|------------|
| ![Home Dark](screenshots/medium/dashboard-home-dark.png) | ![Home Light](screenshots/medium/dashboard-home-light.png) |
| ![Projects Dark](screenshots/medium/dashboard-projects-dark.png) | ![Projects Light](screenshots/medium/dashboard-projects-light.png) |
| ![Invoices Dark](screenshots/medium/dashboard-invoices-dark.png) | ![Invoices Light](screenshots/medium/dashboard-invoices-light.png) |
| ![Clients Dark](screenshots/medium/dashboard-clients-dark.png) | ![Clients Light](screenshots/medium/dashboard-clients-light.png) |
| ![AI Tools Dark](screenshots/medium/dashboard-ai-dark.png) | ![AI Tools Light](screenshots/medium/dashboard-ai-light.png) |
| ![Time Logs Dark](screenshots/medium/dashboard-time-logs-dark.png) | ![Time Logs Light](screenshots/medium/dashboard-time-logs-light.png) |
| ![Settings Dark](screenshots/medium/dashboard-settings-dark.png) | ![Settings Light](screenshots/medium/dashboard-settings-light.png) |
| ![Profile Dark](screenshots/medium/dashboard-profile-dark.png) | ![Profile Light](screenshots/medium/dashboard-profile-light.png) |

---

### 📱 Mobile (375px)

#### Landing & Authentication
| Dark Mode | Light Mode |
|-----------|------------|
| ![Landing Dark](screenshots/small/landing-dark.png) | ![Landing Light](screenshots/small/landing-light.png) |
| ![Sign In Dark](screenshots/small/login-dark.png) | ![Sign In Light](screenshots/small/login-light.png) |
| ![Sign Up Dark](screenshots/small/register-dark.png) | ![Sign Up Light](screenshots/small/register-light.png) |
| ![404 Dark](screenshots/small/not-found-dark.png) | ![404 Light](screenshots/small/not-found-light.png) |

#### Dashboard (Mobile)
| Dark Mode | Light Mode |
|-----------|------------|
| ![Home Dark](screenshots/small/dashboard-home-dark.png) | ![Home Light](screenshots/small/dashboard-home-light.png) |
| ![Projects Dark](screenshots/small/dashboard-projects-dark.png) | ![Projects Light](screenshots/small/dashboard-projects-light.png) |
| ![Invoices Dark](screenshots/small/dashboard-invoices-dark.png) | ![Invoices Light](screenshots/small/dashboard-invoices-light.png) |
| ![Clients Dark](screenshots/small/dashboard-clients-dark.png) | ![Clients Light](screenshots/small/dashboard-clients-light.png) |
| ![AI Tools Dark](screenshots/small/dashboard-ai-dark.png) | ![AI Tools Light](screenshots/small/dashboard-ai-light.png) |
| ![Time Logs Dark](screenshots/small/dashboard-time-logs-dark.png) | ![Time Logs Light](screenshots/small/dashboard-time-logs-light.png) |
| ![Settings Dark](screenshots/small/dashboard-settings-dark.png) | ![Settings Light](screenshots/small/dashboard-settings-light.png) |
| ![Profile Dark](screenshots/small/dashboard-profile-dark.png) | ![Profile Light](screenshots/small/dashboard-profile-light.png) |

---

## ✨ Features

- **Client Management** — Add, edit, and track clients with full contact details
- **Project Tracking** — Create projects per client with status, hourly rate, and fixed budget
- **Time Logging** — Log billable hours, mark as invoiced automatically
- **Invoice Generation** — Build professional invoices with line items, tax, discounts
- **Razorpay Payments** — Payment links embedded in invoices; webhook handles payment confirmation
- **Client Portal** — Magic link so clients can view/pay invoices without an account
- **AI Proposal Writer** — GPT-4o drafts proposals with 3 tone modes (streaming SSE)
- **Command Palette** — `⌘K` / `Ctrl+K` search to navigate the entire app instantly
- **Revenue Dashboard** — Recharts area chart showing 6-month revenue trends
- **Role-Based Access** — JWT sessions, protected routes via middleware
- **Fully Responsive** — Mobile drawer sidebar, tablet and desktop layouts

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

**Why a Command Palette for search:**
Instead of a server-side search that requires additional DB queries, a client-side command palette (`⌘K`) gives instant navigation to any page with zero latency.

---

## 🚀 Getting Started

```bash
# Clone and install
git clone https://github.com/mohitlakhara-ind/soloflow
cd soloflow
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
soloflow/
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
├── components/dashboard/  # Sidebar, header, charts, shell
├── lib/prisma.ts          # Singleton Prisma client
├── prisma/schema.prisma   # Full data model
├── auth.ts                # NextAuth v5 config
├── scripts/               # Screenshot automation
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
