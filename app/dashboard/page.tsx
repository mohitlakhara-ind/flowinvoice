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

    // Monthly revenue (last 6 months)
    prisma.$queryRaw<Array<{ month: Date; revenue: number }>>`
      SELECT
        DATE_TRUNC('month', p."paidAt") AS month,
        SUM(p.amount)::float AS revenue
      FROM payments p
      JOIN invoices i ON p."invoiceId" = i.id
      WHERE i."userId" = ${userId}
        AND p.status = 'COMPLETED'
        AND p."paidAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', p."paidAt")
      ORDER BY month ASC
    `,
  ])

  return {
    totalRevenue: Number(totalRevenue._sum.amount ?? 0),
    monthRevenue: Number(monthRevenue._sum.amount ?? 0),
    lastMonthRevenue: Number(lastMonthRevenue._sum.amount ?? 0),
    pendingAmount: Number(pendingAmount._sum.total ?? 0),
    activeClients,
    totalInvoices,
    overdueInvoices,
    recentInvoices,
    monthlyRevenue,
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
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Your business at a glance</p>
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
