import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RevenueChart } from '@/components/dashboard/revenue-chart'
import { RecentInvoices } from '@/components/dashboard/recent-invoices'
import { QuickActions } from '@/components/dashboard/quick-actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Overview',
}

async function getDashboardData(userId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalRevenue,
    monthRevenue,
    lastMonthRevenue,
    pendingAmount,
    activeClients,
    totalInvoices,
    overdueInvoices,
    recentInvoices,
    // Monthly revenue for last 6 months chart
    monthlyRevenue,
  ] = await Promise.all([
    // Total all-time revenue
    prisma.payment.aggregate({
      where: { invoice: { userId }, status: 'COMPLETED' },
      _sum: { amount: true },
    }),

    // This month's revenue
    prisma.payment.aggregate({
      where: {
        invoice: { userId },
        status: 'COMPLETED',
        paidAt: { gte: startOfMonth },
      },
      _sum: { amount: true },
    }),

    // Last month's revenue
    prisma.payment.aggregate({
      where: {
        invoice: { userId },
        status: 'COMPLETED',
        paidAt: { gte: startOfLastMonth, lte: endOfLastMonth },
      },
      _sum: { amount: true },
    }),

    // Pending invoices total
    prisma.invoice.aggregate({
      where: { userId, status: { in: ['SENT', 'VIEWED', 'OVERDUE'] } },
      _sum: { total: true },
    }),

    // Active clients count
    prisma.client.count({ where: { userId } }),

    // Total invoices
    prisma.invoice.count({ where: { userId } }),

    // Overdue invoices
    prisma.invoice.count({
      where: {
        userId,
        status: 'OVERDUE',
      },
    }),

    // Recent 5 invoices
    prisma.invoice.findMany({
      where: { userId },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),

    // Monthly revenue for last 6 months — fetch completed payments and group in JS
    // ($queryRaw is not supported by @prisma/adapter-pg driver adapter)
    prisma.payment.findMany({
      where: {
        invoice: { userId },
        status: 'COMPLETED',
        paidAt: { gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) },
      },
      select: { paidAt: true, amount: true },
    }),
  ])

  // Group payments by month for the chart
  const monthlyMap = new Map<string, number>()
  for (const p of monthlyRevenue) {
    if (!p.paidAt) continue
    const key = `${p.paidAt.getFullYear()}-${String(p.paidAt.getMonth() + 1).padStart(2, '0')}`
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + Number(p.amount))
  }
  const monthlyRevenueData = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, revenue]) => ({
      month: new Date(`${key}-01`),
      revenue,
    }))

  return {
    totalRevenue: Number(totalRevenue._sum.amount ?? 0),
    monthRevenue: Number(monthRevenue._sum.amount ?? 0),
    lastMonthRevenue: Number(lastMonthRevenue._sum.amount ?? 0),
    pendingAmount: Number(pendingAmount._sum.total ?? 0),
    activeClients,
    totalInvoices,
    overdueInvoices,
    recentInvoices,
    monthlyRevenue: monthlyRevenueData,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const data = await getDashboardData(session.user.id)

  const revenueGrowth =
    data.lastMonthRevenue > 0
      ? ((data.monthRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100
      : data.monthRevenue > 0
        ? 100
        : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-1)]">Overview</h1>
        <p className="text-[var(--text-2)] text-sm mt-1">Your business at a glance</p>
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* Stats */}
      <StatsCards
        totalRevenue={data.totalRevenue}
        monthRevenue={data.monthRevenue}
        revenueGrowth={revenueGrowth}
        pendingAmount={data.pendingAmount}
        activeClients={data.activeClients}
        overdueInvoices={data.overdueInvoices}
        totalInvoices={data.totalInvoices}
      />

      {/* Charts + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart data={data.monthlyRevenue} />
        </div>
        <div>
          <RecentInvoices invoices={data.recentInvoices} />
        </div>
      </div>
    </div>
  )
}
