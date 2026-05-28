import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useState, useEffect } from 'react'
import { MessageCircle, Loader2, Lock, User, Mail, CheckCircle, Star, Quote } from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: AuthPage,
})

const READY_PEOPLE = [
  { name: 'Sarah', status: 'Online', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop' },
  { name: 'Michael', status: 'Active', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&auto=format&fit=crop' },
  { name: 'Elena', status: 'Online', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&auto=format&fit=crop' },
  { name: 'David', status: 'Waiting', img: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150&h=150&auto=format&fit=crop' },
  { name: 'Priya', status: 'Active', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&auto=format&fit=crop' },
  { name: 'Kevin', status: 'Online', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&auto=format&fit=crop' },
]

const TESTIMONIES = [
  { text: "Warmora changed my life. I earn 39,000 KSh/week from home.", author: "James K.", location: "Nairobi", img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=100&h=100&auto=format&fit=crop" },
  { text: "The best remote job I've ever had. Payouts of 450,000 ₦ are always on time.", author: "Maria S.", location: "Lagos", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&auto=format&fit=crop" },
  { text: "Finally a platform that actually pays on time. I get 5,700 R every Friday.", author: "Robert L.", location: "Cape Town", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop" },
  { text: "I can support my family earning 1.1M UGX/week while staying home.", author: "Anita P.", location: "Kampala", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&auto=format&fit=crop" },
  { text: "The onboarding was smooth. Earning 4,200 GH₵ has been a blessing.", author: "David O.", location: "Accra", img: "https://images.unsplash.com/photo-1548372290-8d01b6c8e78c?w=100&h=100&auto=format&fit=crop" },
  { text: "Started as a student, now I earn 780,000 TSh weekly full time.", author: "Sarah J.", location: "Dar es Salaam", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&auto=format&fit=crop" },
  { text: "Professional clients. I've already earned 5,700 R this week.", author: "Kevin M.", location: "Johannesburg", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&auto=format&fit=crop" },
  { text: "Highest paying chat agent job. Earning £240/week part-time.", author: "Linda W.", location: "London", img: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&auto=format&fit=crop" },
  { text: "Transparent and secure. €275/week is perfect for my needs.", author: "Thomas B.", location: "Berlin", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop" },
  { text: "Increased my monthly income by 4x. €275 weekly is amazing.", author: "Elena R.", location: "Madrid", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop" },
]

import { Footer } from '~/components/Footer'

function AuthPage() {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth()
  const [step, setStep] = useState<'sign_up' | 'sign_in' | 'forgot_password'>('sign_in')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuthActions();
  const navigate = useNavigate()

  useEffect(() => {
    // If the user is authenticated, definitely go to dashboard
    if (isAuthenticated && !loading) {
      navigate({ to: '/dashboard', replace: true })
    }
  }, [isAuthenticated, navigate, loading])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    const formData = new FormData(e.currentTarget)
    
    try {
      if (step === 'sign_up') {
        setMessage('Creating account...')
        await signIn("password", {
          name: formData.get("fullName") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          flow: "signUp",
        });
        
        setSuccess(true)
        setMessage('Account created! Entering dashboard...')
        
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500)
      } else if (step === 'sign_in') {
        setMessage('Authenticating...')
        await signIn("password", {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          flow: "signIn",
        });
        
        setSuccess(true)
        setMessage('Login successful! Entering dashboard...')
        
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 500)
      } else if (step === 'forgot_password') {
        await signIn("password", {
          email: formData.get("email") as string,
          flow: "reset",
        });
        setSuccess(true)
        setMessage('If an account exists, a reset link has been sent to your email.')
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("InvalidSecret")) {
        setError('Encryption error: Please contact support or try clearing your browser cache.')
      } else {
        setError(err.message || 'Authentication failed. Please check your details.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-orange-50/30 font-sans">
      {!isAuthenticated && !authLoading && (
        <div className="fixed top-0 left-0 right-0 bg-emerald-500 text-white text-[10px] font-bold text-center py-1 z-50 uppercase tracking-widest">
          Warmora Secure Authentication System Active
        </div>
      )}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
          <MessageCircle className="w-8 h-8 fill-orange-500 text-white" />
          <span>Warmora</span>
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Trust Elements */}
          <div className="space-y-12 order-2 lg:order-1">
            {/* Ready to Chat People */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-emerald-500 w-3 h-3 rounded-full animate-pulse" />
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Ready to Chat</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {READY_PEOPLE.map((person, i) => (
                  <div key={i} className="text-center group">
                    <div className="relative mb-2">
                      <div className="w-16 h-16 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-gray-100 group-hover:scale-105 transition duration-300 mx-auto">
                        <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${person.status === 'Active' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                    </div>
                    <p className="text-xs font-bold text-gray-800">{person.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{person.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonies Grid */}
            <div className="space-y-6">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                Verified Agent Success
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {TESTIMONIES.map((testimony, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition group">
                    <Quote className="w-5 h-5 text-orange-200 mb-3 group-hover:text-orange-400 transition" />
                    <p className="text-sm text-gray-700 font-medium leading-relaxed mb-4">"{testimony.text}"</p>
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
                      <div className="w-10 h-10 rounded-full border border-orange-100 overflow-hidden shrink-0">
                        <img src={testimony.img} alt={testimony.author} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-gray-900">{testimony.author}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{testimony.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Auth Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-orange-100 border border-orange-100 overflow-hidden sticky top-24">
              <div className="bg-orange-500 p-8 md:p-10 text-white text-center">
                <h1 className="text-3xl md:text-4xl font-black mb-3">
                  {step === 'sign_up' ? 'Join Warmora' : step === 'sign_in' ? 'Welcome Back' : 'Reset Password'}
                </h1>
                <p className="text-orange-100 font-medium">
                  {step === 'sign_up' ? 'Start your remote career today.' : step === 'sign_in' ? 'Login to access your agent dashboard.' : 'Enter your email to receive a reset link.'}
                </p>
              </div>

              <div className="p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100 animate-shake">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-5 bg-emerald-50 text-emerald-700 text-sm rounded-2xl border border-emerald-100 flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-emerald-500 text-white rounded-full p-2 shrink-0">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-black text-lg">Update</div>
                          <p className="font-medium">{message}</p>
                        </div>
                      </div>
                      {step === 'sign_in' && (
                        <button 
                          onClick={() => window.location.href = "/dashboard"}
                          className="text-xs text-emerald-600 font-bold underline text-left ml-14"
                        >
                          Click here if you aren't redirected automatically
                        </button>
                      )}
                    </div>
                  )}
                  
                  {!success && step === 'sign_up' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-400" /> Full Name
                      </label>
                      <input
                        required
                        name="fullName"
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-50/50 transition outline-hidden bg-gray-50/50 font-medium"
                      />
                    </div>
                  )}

                  {!success && (
                    <>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-orange-400" /> Email Address
                        </label>
                        <input
                          required
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-50/50 transition outline-hidden bg-gray-50/50 font-medium"
                        />
                      </div>

                      {step !== 'forgot_password' && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                              <Lock className="w-4 h-4 text-orange-400" /> Password
                            </label>
                            {step === 'sign_in' && (
                              <button 
                                type="button" 
                                onClick={() => setStep('forgot_password')}
                                className="text-xs text-orange-600 font-black hover:underline"
                              >
                                Forgot Password?
                              </button>
                            )}
                          </div>
                          <input
                            required
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-50/50 transition outline-hidden bg-gray-50/50 font-medium"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black text-xl hover:bg-orange-600 transition shadow-xl shadow-orange-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                          step === 'sign_up' ? 'Create Account' : step === 'sign_in' ? 'Secure Login' : 'Send Reset Link'
                        )}
                      </button>
                    </>
                  )}
                </form>

                <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm font-bold text-gray-400 space-y-4">
                  {step === 'sign_up' ? (
                    <p>
                      Already have an account?{' '}
                      <button onClick={() => setStep('sign_in')} className="text-orange-600 font-black hover:underline">
                        Login here
                      </button>
                    </p>
                  ) : step === 'sign_in' ? (
                    <p>
                      Don't have an account?{' '}
                      <button onClick={() => setStep('sign_up')} className="text-orange-600 font-black hover:underline">
                        Register now
                      </button>
                    </p>
                  ) : (
                    <p>
                      Remembered your password?{' '}
                      <button onClick={() => setStep('sign_in')} className="text-orange-600 font-black hover:underline">
                        Back to Login
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
