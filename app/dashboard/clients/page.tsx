import type { Metadata } from 'next'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Plus, Mail, Phone, Building, ArrowRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Clients' }

export default async function ClientsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const clients = await prisma.client.findMany({
    where: { userId: session.user.id },
    include: {
      _count: { select: { projects: true, invoices: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-slate-400 text-sm mt-1">{clients.length} client{clients.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/dashboard/clients/new"
          id="add-client-btn"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="glass rounded-2xl border border-[#2a2a3a] p-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#1a1a24] flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="font-semibold text-white mb-2">No clients yet</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
            Add your first client to start creating invoices and tracking projects.
          </p>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Your First Client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/dashboard/clients/${client.id}`}
              className="glass glass-hover rounded-2xl p-5 border border-[#2a2a3a] hover:border-[#3a3a50] transition-all hover:scale-[1.01] group block"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-white font-bold text-sm">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{client.name}</h3>
                    {client.company && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3" />
                        {client.company}
                      </p>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </div>

              <div className="space-y-1.5 mb-4">
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <Mail className="w-3 h-3 text-slate-500" />
                  {client.email}
                </p>
                {client.phone && (
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-slate-500" />
                    {client.phone}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-[#1e1e2e]">
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{client._count.projects}</p>
                  <p className="text-[10px] text-slate-500">Project{client._count.projects !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white">{client._count.invoices}</p>
                  <p className="text-[10px] text-slate-500">Invoice{client._count.invoices !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-center ml-auto">
                  <span className="text-[10px] font-medium px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {client.currency}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
