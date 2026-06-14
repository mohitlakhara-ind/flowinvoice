import { TrendingUp, TrendingDown, DollarSign, Clock, Users, AlertTriangle, FileText } from 'lucide-react'
import { clsx } from 'clsx'

interface StatsCardsProps {
  totalRevenue: number
  monthRevenue: number
  revenueGrowth: number
  pendingAmount: number
  activeClients: number
  overdueInvoices: number
  totalInvoices: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function StatsCards({
  totalRevenue,
  monthRevenue,
  revenueGrowth,
  pendingAmount,
  activeClients,
  overdueInvoices,
  totalInvoices,
}: StatsCardsProps) {
  const isGrowthPositive = revenueGrowth >= 0

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      subtitle: 'All time earnings',
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10',
      border: 'border-emerald-500/10',
      glow: 'hover:border-emerald-500/30',
    },
    {
      title: 'This Month',
      value: formatCurrency(monthRevenue),
      subtitle: (
        <span className={clsx('flex items-center gap-1', isGrowthPositive ? 'text-emerald-400' : 'text-red-400')}>
          {isGrowthPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(revenueGrowth).toFixed(1)}% vs last month
        </span>
      ),
      icon: TrendingUp,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10',
      border: 'border-indigo-500/10',
      glow: 'hover:border-indigo-500/30',
    },
    {
      title: 'Pending',
      value: formatCurrency(pendingAmount),
      subtitle: 'Awaiting payment',
      icon: Clock,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10',
      border: 'border-amber-500/10',
      glow: 'hover:border-amber-500/30',
    },
    {
      title: 'Clients',
      value: activeClients.toString(),
      subtitle: 'Active clients',
      icon: Users,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      border: 'border-cyan-500/10',
      glow: 'hover:border-cyan-500/30',
    },
    {
      title: 'Invoices',
      value: totalInvoices.toString(),
      subtitle: 'Total created',
      icon: FileText,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      border: 'border-purple-500/10',
      glow: 'hover:border-purple-500/30',
    },
    {
      title: 'Overdue',
      value: overdueInvoices.toString(),
      subtitle: 'Need follow-up',
      icon: AlertTriangle,
      iconColor: overdueInvoices > 0 ? 'text-red-400' : 'text-slate-500',
      iconBg: overdueInvoices > 0 ? 'bg-red-500/10' : 'bg-slate-500/5',
      border: overdueInvoices > 0 ? 'border-red-500/10' : 'border-slate-500/10',
      glow: overdueInvoices > 0 ? 'hover:border-red-500/30' : 'hover:border-slate-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 stagger-children">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className={clsx(
              'glass rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] cursor-default',
              stat.border,
              stat.glow
            )}
          >
            <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center mb-4', stat.iconBg)}>
              <Icon className={clsx('w-4 h-4', stat.iconColor)} />
            </div>
            <p className="text-xs text-slate-500 font-medium mb-1">{stat.title}</p>
            <p className="text-xl font-bold text-white mb-1">{stat.value}</p>
            <div className="text-xs text-slate-500">{stat.subtitle}</div>
          </div>
        )
      })}
    </div>
  )
}
