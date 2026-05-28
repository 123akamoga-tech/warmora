import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState } from 'react'
import { MessageCircle, ArrowRight, CheckCircle2, ShieldCheck, Zap, Star, Quote, Loader2, Phone, User, Mail, CreditCard } from 'lucide-react'
import { Footer } from '~/components/Footer'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const WAITING_PEOPLE = [
  { name: 'Sarah', status: 'Waiting', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop' },
  { name: 'Michael', status: 'Online', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&auto=format&fit=crop' },
  { name: 'Elena', status: 'Waiting', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&auto=format&fit=crop' },
  { name: 'David', status: 'Waiting', img: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150&h=150&auto=format&fit=crop' },
  { name: 'Priya', status: 'Online', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&auto=format&fit=crop' },
  { name: 'Kevin', status: 'Waiting', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&auto=format&fit=crop' },
]

const TESTIMONIES = [
  { text: "Warmora changed my life. I earn 39,000 KSh/week from home.", author: "James K.", location: "Nairobi", img: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=100&h=100&auto=format&fit=crop" },
  { text: "The best remote job I've ever had. Payouts of 450,000 ₦ are always on time.", author: "Maria S.", location: "Lagos", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&auto=format&fit=crop" },
  { text: "Finally a platform that actually pays on time. I get 5,700 R every Friday.", author: "Robert L.", location: "Cape Town", img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=100&h=100&auto=format&fit=crop" },
  { text: "I can support my family earning 1.1M UGX/week while staying home.", author: "Anita P.", location: "Kampala", img: "https://images.unsplash.com/photo-1529946179074-87642f6204d7?w=100&h=100&auto=format&fit=crop" },
  { text: "The onboarding was smooth. Earning 4,200 GH₵ has been a blessing.", author: "David O.", location: "Accra", img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=100&h=100&auto=format&fit=crop" },
  { text: "Started as a student, now I earn 780,000 TSh weekly full time.", author: "Sarah J.", location: "Dar es Salaam", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&auto=format&fit=crop" },
]

function LandingPage() {
  const [loading, setLoading] = useState(false)
  const [success] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    payoutMethod: 'Mobile Money'
  })
  
  const createApplicant = useMutation(api.applicants.create)

  const handleRegisterAndPay = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (loading) return

    // Basic length validation (digits only, 9-15 range covers most international formats)
    const phoneDigits = formData.phone.replace(/\D/g, '')
    const whatsappDigits = formData.whatsapp.replace(/\D/g, '')

    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
      alert("Please enter a valid phone number (9-15 digits).")
      setLoading(false)
      return
    }

    if (whatsappDigits.length < 9 || whatsappDigits.length > 15) {
      alert("Please enter a valid WhatsApp number (9-15 digits).")
      setLoading(false)
      return
    }

    try {
      // Save applicant details to Convex so admin can track leads
      await createApplicant({
        ...formData,
        transactionRef: "OFFLINE_PAYMENT_REQUESTED",
        paid: false
      })
      
      // Redirect to WhatsApp with a pre-filled message for payment instructions
      const message = encodeURIComponent(`Hi, I would like to pay the $35 onboarding fee for Warmora Recruitment. My name is ${formData.fullName}. Please provide me with the payment instructions.`);
      window.location.href = `https://wa.me/256707457606?text=${message}`;
    } catch (err) {
      console.error(err)
      alert("There was an error saving your details. Please try again or contact support.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl">
            <MessageCircle className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Warmora</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-500">
          <a href="#how-it-works" className="hover:text-orange-500 transition">How it Works</a>
          <a href="#testimonies" className="hover:text-orange-500 transition">Success Stories</a>
          <a href="#register" className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">Get Started</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold mb-8">
              <Zap className="w-4 h-4 fill-orange-600" />
              <span>Hiring Now: 45 Open Slots</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
              Work From Home as a <span className="text-orange-500 italic">Chat Agent</span>
            </h1>
            <p className="text-2xl font-bold text-gray-800 mb-6">
              Earn $250 - $450 weekly answering client messages.
            </p>
            <p className="text-xl text-gray-500 mb-12 max-w-xl leading-relaxed">
              No experience required. We provide full training. Work on your own schedule from anywhere in the world.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a 
                href="#register" 
                className="w-full sm:w-auto bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-orange-600 transition shadow-xl shadow-orange-200 flex items-center justify-center gap-2"
              >
                Start Registration <ArrowRight className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="bg-orange-50 rounded-[3rem] p-8 relative z-10 border border-orange-100">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-emerald-500 w-3 h-3 rounded-full animate-pulse" />
                <h2 className="text-xl font-black text-gray-900">Waiting for a Chat</h2>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {WAITING_PEOPLE.map((person, i) => (
                  <div key={i} className="text-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden mx-auto mb-2">
                      <img src={person.img} className="w-full h-full object-cover" alt={person.name} />
                    </div>
                    <p className="text-sm font-black text-gray-900">{person.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{person.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-white border-t border-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Simple 3-Step Process</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
              Joining Warmora is fast and secure. Follow these steps to start your remote career.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-3xl bg-orange-50/50 border border-orange-100 hover:shadow-xl transition duration-500">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-8 shadow-lg shadow-orange-200">1</div>
              <h3 className="text-2xl font-black mb-4">Register & Pay</h3>
              <p className="text-gray-600 font-bold leading-relaxed">
                Fill in your profile details and pay the one-time $35 onboarding fee securely via Flutterwave.
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-orange-50/50 border border-orange-100 hover:shadow-xl transition duration-500">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-8 shadow-lg shadow-orange-200">2</div>
              <h3 className="text-2xl font-black mb-4">WhatsApp Briefing</h3>
              <p className="text-gray-600 font-bold leading-relaxed">
                After payment, you'll be connected to our coordinator on WhatsApp for a quick identity check and training.
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-orange-50/50 border border-orange-100 hover:shadow-xl transition duration-500">
              <div className="w-16 h-16 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-8 shadow-lg shadow-orange-200">3</div>
              <h3 className="text-2xl font-black mb-4">Start Earning</h3>
              <p className="text-gray-600 font-bold leading-relaxed">
                Receive your first client assignment and start earning $250 - $450 weekly, paid every Friday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Registration & Payment Section */}
      <section id="register" className="py-24 px-6 bg-orange-50/50">
        <div className="max-w-3xl mx-auto">
          {success ? (
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center border-4 border-emerald-500">
              <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Registration Successful!</h2>
              <p className="text-xl text-gray-600 mb-8 font-bold">
                Thank you for joining Warmora. Our admin team will contact you via WhatsApp or Email within 24 hours to begin your onboarding.
              </p>
              <div className="bg-orange-50 p-6 rounded-2xl text-left border border-orange-100">
                <h3 className="font-black text-orange-600 mb-2 uppercase text-sm">Next Steps:</h3>
                <ul className="space-y-3 font-bold text-gray-700">
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs shrink-0">1</div>
                    Check your WhatsApp for a message from our team.
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs shrink-0">2</div>
                    Complete your profile verification link.
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs shrink-0">3</div>
                    Receive your first client assignment.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-orange-100">
              <div className="bg-orange-500 p-10 text-white text-center">
                <h2 className="text-3xl font-black mb-2">Create Your Agent Profile</h2>
                <p className="font-bold text-orange-100 italic">One-time registration & onboarding fee: $35.00</p>
              </div>
              
              <form onSubmit={handleRegisterAndPay} className="p-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-orange-500" /> Full Name
                    </label>
                    <input
                      required
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-hidden font-bold"
                      placeholder="Jane Doe"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-500" /> Email Address
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-hidden font-bold"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-orange-500" /> Phone Number
                    </label>
                    <input
                      required
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-hidden font-bold"
                      placeholder="+254..."
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-orange-500" /> WhatsApp Number
                    </label>
                    <input
                      required
                      className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-hidden font-bold"
                      placeholder="+254..."
                      value={formData.whatsapp}
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-orange-500" /> Preferred Payout Method
                  </label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-orange-500 outline-hidden font-bold appearance-none bg-white"
                    value={formData.payoutMethod}
                    onChange={e => setFormData({...formData, payoutMethod: e.target.value})}
                  >
                    <option>Mobile Money (M-Pesa, MTN, Airtel)</option>
                    <option>Western Union</option>
                    <option>WorldRemit / Remitly</option>
                    <option>Chipper Cash / Sendwave</option>
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Mukuru</option>
                  </select>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-500 text-white py-6 rounded-2xl font-black text-2xl hover:bg-emerald-600 transition shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                      <>Pay $35 & Get Instructions</>
                    )}
                  </button>
                  <p className="text-center mt-4 text-gray-400 text-sm font-bold flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Secure Onboarding Portal
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Testimonies */}
      <section id="testimonies" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
              <Star className="w-8 h-8 text-orange-500 fill-orange-500" />
              Agent Success Stories
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIES.map((t, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <Quote className="w-8 h-8 text-orange-200 mb-4" />
                <p className="font-bold text-gray-700 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.img} className="w-12 h-12 rounded-full object-cover" alt={t.author} />
                  <div>
                    <p className="font-black text-gray-900">{t.author}</p>
                    <p className="text-xs text-orange-600 font-bold uppercase">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
