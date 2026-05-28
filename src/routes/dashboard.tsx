import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from "../../convex/_generated/api"
import { useEffect, useState } from 'react'
import { 
  DollarSign, 
  Users, 
  Clock, 
  MessageCircle, 
  CheckCircle, 
  Zap, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  LogOut,
  Loader2,
  CreditCard,
  Wallet,
  History,
  Phone,
  User,
  Save,
  Check
} from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

import { Footer } from '~/components/Footer'

function DashboardPage() {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth()
  
  // Use non-suspense query for the initial user check
  const user = useQuery(api.users.viewer)
  const health = useQuery(api.health.check)
  
  const navigate = useNavigate()
  const [debugLog, setDebugLog] = useState<string[]>([])
  const [timer, setTimer] = useState(0)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const jwtKey = Object.keys(localStorage).find(k => k.startsWith('__convexAuthJWT'))
    const log = `[${timer}s] Auth: ${authLoading ? 'Loading' : (isAuthenticated ? 'Authenticated' : 'Not Authenticated')}, User: ${user === undefined ? 'Fetching' : (user === null ? 'Null' : 'Found')}, Health: ${health === undefined ? 'Wait' : health}, JWT: ${jwtKey ? 'Present' : 'Missing'}`
    setDebugLog(prev => [...prev.slice(-6), log])
    console.log(log)
  }, [authLoading, isAuthenticated, user, health, timer])

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      // Add a much longer grace period and check for user data anyway
      // Sometimes isAuthenticated stays false while user query actually works
      if (timer > 15 && !user) {
        console.log("Still not authenticated after 15s and no user data, redirecting...")
        window.location.href = '/register'
      }
    }
    
    if (user && !user.onboardingFeePaid && user.paymentStatus !== 'pending_approval') {
      navigate({ to: '/payment', replace: true })
    }
  }, [authLoading, isAuthenticated, user, navigate, timer])

  // Only show loading if we really don't know who the user is yet
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center space-y-4 max-w-md w-full px-6">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto" />
          <p className="text-gray-400 font-bold animate-pulse">Establishing Secure Connection... ({timer}s)</p>
          
          <div className="pt-8 space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
             <div className="flex items-center justify-between mb-2">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Diagnostic Log</h3>
               <div className={`w-2 h-2 rounded-full ${timer % 2 === 0 ? 'bg-orange-500' : 'bg-gray-200'}`} />
             </div>
             <div className="space-y-1 text-[10px] font-mono text-gray-500">
               <p className="border-l-2 border-blue-200 pl-2">Server: {health === undefined ? 'Connecting...' : (health === 'ok' ? 'Online' : 'Error')}</p>
               <p className="border-l-2 border-blue-200 pl-2">System: {authLoading ? 'Shaking hands...' : 'Connection established'}</p>
               <p className="border-l-2 border-blue-200 pl-2">Identity: {isAuthenticated ? 'Verified' : 'Identifying...'}</p>
               <p className="border-l-2 border-blue-200 pl-2">Profile: {user === undefined ? 'Requesting data...' : (user === null ? 'No Profile' : 'Data received')}</p>
               <p className="border-l-2 border-orange-200 pl-2 mt-2 font-bold">Latest: {debugLog[debugLog.length - 1]}</p>
             </div>
          </div>

          <div className="pt-4 flex flex-col gap-2">
             {timer > 5 && (
               <button 
                onClick={() => window.location.href = '/register'}
                className="bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-100"
               >
                 Try Manual Login
               </button>
             )}
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/register';
              }}
              className="text-xs text-gray-400 hover:text-orange-600 font-medium underline"
            >
              Reset Session
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If we have a user (even if isAuthenticated is false - which happens during edge cases), proceed.
  if (!user && !authLoading && !isAuthenticated && timer > 15) {
     window.location.href = '/register'
     return null
  }

  // Handle unauthorized or unpaid states while useEffect performs redirection
  if (!isAuthenticated || user === null || (!user.onboardingFeePaid && user.paymentStatus !== 'pending_approval')) {
    return (
      <div className="min-h-screen bg-orange-50/30 flex items-center justify-center font-sans p-6">
        <div className="text-center space-y-6 max-w-sm animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center mx-auto relative">
             <ShieldCheck className="w-10 h-10 text-orange-500" />
             <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-20 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {!isAuthenticated ? 'Redirecting to Login...' : 'Preparing Profile...'}
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              {!isAuthenticated 
                ? 'Securing your session. Please wait.' 
                : 'Finalizing your agent credentials and matching your profile.'}
            </p>
          </div>
          <div className="space-y-4">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
            <div className="pt-8">
              <button 
                onClick={() => window.location.href = '/register'}
                className="text-xs text-gray-400 font-bold hover:text-orange-500 transition underline"
              >
                Back to Login if stuck
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <DashboardContent user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
}

function DashboardContent({ user, activeTab, setActiveTab }: { user: any, activeTab: string, setActiveTab: any }) {
  const { data: chats } = useSuspenseQuery(convexQuery(api.users.getAssignedChats, {}))
  const { data: withdrawals } = useSuspenseQuery(convexQuery(api.users.getWithdrawals, {}))
  
  // Re-use profile logic
  const [profileName, setProfileName] = useState(user.name || '')
  const [profilePhone, setProfilePhone] = useState(user.phone || '')
  const [payoutMethod, setPayoutMethod] = useState(user.payoutMethod || 'Mobile Money')
  const [payoutDetails, setPayoutDetails] = useState(user.payoutDetails || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Withdrawal State
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawError, setWithdrawError] = useState('')
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)

  const updateProfile = useMutation(api.users.updateProfile)
  const requestWithdrawal = useMutation(api.users.requestWithdrawal)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await updateProfile({
        name: profileName,
        phone: profilePhone,
        payoutMethod,
        payoutDetails
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    setWithdrawError('')
    setWithdrawSuccess(false)
    
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount < 10) {
      setWithdrawError('Minimum withdrawal is $10')
      return
    }

    try {
      await requestWithdrawal({
        amount,
        method: payoutMethod,
        details: payoutDetails
      })
      setWithdrawSuccess(true)
      setWithdrawAmount('')
    } catch (err: any) {
      setWithdrawError(err.message || 'Withdrawal failed')
    }
  }

  const isPendingApproval = user?.paymentStatus === 'pending_approval'

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <MessageCircle className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">Warmora<span className="text-orange-500">Agent</span></span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'overview' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'profile' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Profile Settings
              </button>
              <button 
                onClick={() => setActiveTab('payouts')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'payouts' ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Withdrawals
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-right">
              <div>
                <div className="text-sm font-bold text-gray-900">{user?.name}</div>
                <div className="text-[10px] text-emerald-600 font-bold uppercase">
                  {isPendingApproval ? 'Verification Pending' : user?.status?.replace('_', ' ')}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold overflow-hidden">
                {user?.image ? <img src={user.image} alt="" className="w-full h-full object-cover" /> : user?.name?.[0]}
              </div>
            </div>
            <Link 
              to="/logout" 
              className="p-2 text-gray-400 hover:text-orange-500 transition rounded-lg hover:bg-orange-50"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Verification Alert */}
            {isPendingApproval && (
              <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500 text-white p-3 rounded-2xl shadow-lg shadow-blue-200">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-900">Payment Received & Pending Approval</h3>
                    <p className="text-blue-700 text-sm">Our finance team is verifying your activation fee. This usually takes 1-4 hours.</p>
                  </div>
                </div>
                <div className="px-6 py-2 bg-white rounded-full text-blue-600 text-sm font-bold border border-blue-200 animate-pulse">
                  Verifying...
                </div>
              </div>
            )}

            {/* Welcome Banner */}
            <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-orange-200 relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2 text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                <p className="text-orange-100 max-w-md">Your account is currently {user?.status === 'pending_assignment' ? 'under review for client matching.' : 'active and ready.'}</p>
              </div>
              <Zap className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 rotate-12" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className="text-gray-500 font-medium text-sm">Available Balance</span>
                </div>
                <div className="text-3xl font-black text-gray-900">${user?.availableBalance?.toFixed(2) || '0.00'}</div>
                <button 
                  onClick={() => setActiveTab('payouts')}
                  className="mt-4 text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700 transition w-full"
                >
                  Withdraw Now
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="text-gray-500 font-medium text-sm">Total Earnings</span>
                </div>
                <div className="text-3xl font-black text-gray-900">${user?.totalEarnings?.toFixed(2) || '0.00'}</div>
                <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3 h-3" /> Weekly Payout: Friday
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="text-gray-500 font-medium text-sm">Matched People</span>
                </div>
                <div className="text-3xl font-black text-gray-900">{user?.assignedChatCount || 0}</div>
                <div className="mt-2 text-xs text-gray-500 font-medium">Active sessions today</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-gray-500 font-medium text-sm">Match Status</span>
                </div>
                <div className="text-lg font-black text-gray-900 uppercase">
                  {user?.status === 'pending_assignment' ? (
                    <span className="text-orange-500 flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-pulse" /> Matching...
                    </span>
                  ) : (
                    <span className="text-emerald-500 flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4" /> Ready to Chat
                    </span>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500 font-medium italic">Wait: 2-4 hours</div>
              </div>
            </div>

            {/* Assigned People Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Assigned Conversations</h2>
                  <p className="text-sm text-gray-500">Matched lonely people for your current shift</p>
                </div>
                <button className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1">
                  Refresh Matching <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {chats && chats.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {chats.map((chat: any, i: number) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shadow-inner">
                          <img src={`https://images.unsplash.com/photo-${1500648767791 + i}-00dcc994a43e?w=100&h=100&auto=format&fit=crop&q=80`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{chat.clientName}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                             Started {new Date(chat.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-600 font-black text-lg">+${chat.earnings.toFixed(2)}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{chat.durationMinutes} mins active</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-orange-50 text-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Finding lonely people for you...</h3>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm">
                    Our matching system is currently pairing your profile with active conversations. You'll be notified via WhatsApp once your first match is ready.
                  </p>
                  <div className="mt-8 flex justify-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                <p className="text-sm text-gray-500">Manage your agent credentials and payout info</p>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" /> Full Name
                    </label>
                    <input 
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-hidden transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" /> WhatsApp Number
                    </label>
                    <input 
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+256..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-hidden transition"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-orange-500" /> Payout Destination
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Preferred Method</label>
                      <select 
                        value={payoutMethod}
                        onChange={(e) => setPayoutMethod(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-hidden transition bg-white"
                      >
                        <option value="Mobile Money">Mobile Money (MTN/Airtel)</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Local Bank Transfer</option>
                        <option value="Crypto">Crypto (USDT/BTC)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        {payoutMethod === 'Mobile Money' ? 'Registered Phone Number' : 
                         payoutMethod === 'PayPal' ? 'PayPal Email Address' : 
                         'Account Details'}
                      </label>
                      <textarea 
                        value={payoutDetails}
                        onChange={(e) => setPayoutDetails(e.target.value)}
                        rows={3}
                        placeholder={payoutMethod === 'Mobile Money' ? 'Enter phone number registered for MM' : 'Enter payment details...'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-hidden transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    disabled={isSaving}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : saveSuccess ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {isSaving ? 'Saving Changes...' : saveSuccess ? 'Profile Updated!' : 'Save Profile Settings'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-500 mb-2">Available for Withdrawal</h3>
                  <div className="text-4xl font-black text-gray-900 mb-6">${user?.availableBalance?.toFixed(2) || '0.00'}</div>
                  
                  <form onSubmit={handleWithdrawal} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Amount to Withdraw (USD)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                        <input 
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-hidden transition"
                        />
                      </div>
                    </div>
                    
                    {withdrawError && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {withdrawError}</div>}
                    {withdrawSuccess && <div className="p-3 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Withdrawal Request Sent!</div>}

                    <button 
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
                    >
                      Process Withdrawal
                    </button>
                    <p className="text-[10px] text-gray-400 text-center font-medium">Processing takes 24-48 hours. Min: $10.00</p>
                  </form>
                </div>

                <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                   <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                     <ShieldCheck className="w-4 h-4" /> Verification Required
                   </h4>
                   <p className="text-xs text-orange-800 leading-relaxed">
                     Withdrawals are only processed to the registered payment method in your profile. Ensure your details are correct before requesting.
                   </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-full">
                  <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Withdrawal History</h2>
                      <p className="text-sm text-gray-500">Track your earnings and payouts</p>
                    </div>
                    <History className="w-6 h-6 text-gray-300" />
                  </div>

                  {withdrawals && withdrawals.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                      {withdrawals.map((w: any) => (
                        <div key={w._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${w.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                              <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">${w.amount.toFixed(2)} Payout</div>
                              <div className="text-xs text-gray-500">{new Date(w.requestedAt).toLocaleDateString()} • {w.method}</div>
                            </div>
                          </div>
                          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            w.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                            w.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                            'bg-orange-100 text-orange-700 animate-pulse'
                          }`}>
                            {w.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-20 text-center">
                      <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                        <History className="w-10 h-10" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No withdrawals yet</h3>
                      <p className="text-gray-500 max-w-xs mx-auto text-sm">
                        As you start earning from chat assignments, your withdrawal requests will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Support */}
        <div className="mt-8 text-center pb-12">
           <a 
            href="https://wa.me/+256707457606" 
            target="_blank"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition text-sm font-medium"
           >
            <MessageCircle className="w-4 h-4" /> Agent Support (24/7)
           </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
