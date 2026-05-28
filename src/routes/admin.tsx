import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState, useEffect } from 'react'
import { 
  Users, 
  DollarSign, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  Lock,
  RefreshCcw,
  Mail,
  Phone
} from 'lucide-react'

import { Footer } from '~/components/Footer'

export const Route = createFileRoute('/admin')({
  component: AdminPanel,
})

function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [checking, setChecking] = useState(false)

  // Use a query to check credentials on demand (not suspended so we can show login form)
  const checkResult = useQuery(api.admin.verifyAdmin, 
    username && password ? { username, password } : "skip" as any
  )

  useEffect(() => {
    const saved = localStorage.getItem('warmora_admin_session')
    if (saved === 'true') setIsLoggedIn(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setChecking(true)
    setLoginError('')
    
    if (checkResult) {
      localStorage.setItem('warmora_admin_session', 'true')
      setIsLoggedIn(true)
    } else {
      setLoginError('Invalid username or password')
    }
    setChecking(false)
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden">
          <div className="bg-orange-500 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="opacity-80">Enter your credentials to continue</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-hidden"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-hidden"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={checking}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200 flex items-center justify-center"
            >
              {checking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <AdminDashboard />
}

function AdminDashboard() {
  const { data: applicants } = useSuspenseQuery(convexQuery(api.admin.listAll, {}))
  const { data: withdrawals } = useSuspenseQuery(convexQuery(api.admin.listWithdrawals, {}))
  
  const updateStatus = useMutation(api.admin.togglePaid)
  const updateWithdrawal = useMutation(api.admin.updateWithdrawalStatus)
  const assignChat = useMutation(api.admin.assignDemoChat)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [activeAdminTab, setActiveAdminTab] = useState<'applicants' | 'withdrawals'>('applicants')

  const filteredApplicants = (applicants || []).filter((a: any) => 
    a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.phone?.includes(searchTerm)
  )

  const stats = {
    total: applicants?.length || 0,
    paid: (applicants || []).filter((a: any) => a.onboardingFeePaid).length,
    pending: (applicants || []).filter((a: any) => !a.onboardingFeePaid).length,
    revenue: (applicants || []).filter((a: any) => a.onboardingFeePaid).length * 35, // Updated to $35
    pendingWithdrawals: (withdrawals || []).filter((w: any) => w.status === 'pending').length
  }

  const handleTogglePaid = async (id: any) => {
    await updateStatus({ id })
  }

  const handleAssignChat = async (userId: any) => {
    await assignChat({ userId })
  }

  const handleUpdateWithdrawal = async (id: any, status: 'completed' | 'rejected') => {
    await updateWithdrawal({ id, status })
  }

  const handleLogout = () => {
    localStorage.removeItem('warmora_admin_session')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Warmora Admin</h1>
            </div>
            
            <nav className="flex items-center gap-2">
              <button 
                onClick={() => setActiveAdminTab('applicants')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeAdminTab === 'applicants' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Applicants
              </button>
              <button 
                onClick={() => setActiveAdminTab('withdrawals')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${activeAdminTab === 'withdrawals' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Withdrawals {stats.pendingWithdrawals > 0 && <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px]">{stats.pendingWithdrawals}</span>}
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => window.location.reload()} className="text-gray-500 hover:text-gray-700">
              <RefreshCcw className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Applicants', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Paid Agents', value: stats.paid, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Pending Withdrawals', value: stats.pendingWithdrawals, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Estimated Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {activeAdminTab === 'applicants' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-bold">Agent Management</h2>
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Agent</th>
                    <th className="px-6 py-4 font-semibold">Contact</th>
                    <th className="px-6 py-4 font-semibold">Payout</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApplicants.map((applicant: any) => (
                    <tr key={applicant._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{applicant.fullName}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                          Joined {new Date(applicant._creationTime).toLocaleDateString()}
                          {applicant.isNewAuth && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold uppercase tracking-tight">New Auth</span>}
                          {applicant.transactionRef && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-tight">Ref: {applicant.transactionRef}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Mail className="w-3.5 h-3.5" /> {applicant.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5" /> {applicant.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {applicant.payoutMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {applicant.onboardingFeePaid ? (
                            <span className="flex items-center gap-1 text-emerald-600 text-sm font-bold">
                              <CheckCircle className="w-4 h-4" /> Paid
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-orange-600 text-sm font-bold animate-pulse">
                              <Clock className="w-4 h-4" /> Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {applicant.isNewAuth && applicant.onboardingFeePaid && (
                            <button 
                              onClick={() => handleAssignChat(applicant._id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-100 text-orange-700 hover:bg-orange-200 transition"
                            >
                              Assign Chat
                            </button>
                          )}
                          <button 
                            onClick={() => handleTogglePaid(applicant._id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              applicant.onboardingFeePaid 
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {applicant.onboardingFeePaid ? 'Mark Unpaid' : 'Mark as Paid'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold">Withdrawal Requests</h2>
              <p className="text-sm text-gray-500">Pending payouts to agents</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Agent</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Method</th>
                    <th className="px-6 py-4 font-semibold">Details</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {withdrawals?.map((w: any) => (
                    <tr key={w._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{w.userName}</div>
                        <div className="text-xs text-gray-400">{w.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 font-black text-emerald-600">${w.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 font-bold text-gray-700">{w.method}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{w.details}</td>
                      <td className="px-6 py-4 text-right">
                        {w.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleUpdateWithdrawal(w._id, 'rejected')}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Reject & Refund"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleUpdateWithdrawal(w._id, 'completed')}
                              className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" /> Approve Payout
                            </button>
                          </div>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${w.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {w.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {(!withdrawals || withdrawals.length === 0) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-gray-400 italic">No withdrawal requests found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
