import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldCheck, Info, MessageCircle, DollarSign, CheckCircle, ArrowRight, Lock, UserCheck } from 'lucide-react'
import { Footer } from '~/components/Footer'

export const Route = createFileRoute('/mechanics')({
  component: MechanicsPage,
})

function MechanicsPage() {
  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full border-b border-gray-100">
        <Link to="/" className="text-2xl font-bold text-orange-500 flex items-center gap-2">
          <MessageCircle className="w-8 h-8 fill-orange-500 text-white" />
          <span>Warmora</span>
        </Link>
        <Link 
          to="/register" 
          className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-lg shadow-orange-200"
        >
          Apply Now
        </Link>
      </nav>

      {/* Hero Header */}
      <header className="py-16 bg-orange-50 border-b border-orange-100 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">How Warmora Works</h1>
          <p className="text-xl text-gray-600">Everything you need to know about becoming a professional remote chat agent.</p>
        </div>
      </header>

      {/* Core Rules Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="grid gap-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-orange-100 p-4 rounded-2xl shrink-0">
              <ShieldCheck className="w-10 h-10 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">1. A Strictly Clean Ecosystem</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                At Warmora, we pride ourselves on professional, safe, and meaningful communication. Unlike other platforms, our chat ecosystem is <span className="font-bold text-gray-900 italic">100% non-sexual and moderated.</span> We deal exclusively with customer service, virtual companionship, and business assistance.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-emerald-100 p-4 rounded-2xl shrink-0">
              <DollarSign className="w-10 h-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">2. Weekly Guaranteed Payouts</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-4">
                We value your time. All agents are paid every Friday. There are no hidden fees or "thresholds" to meet—if you earn, you get paid.
              </p>
              <ul className="grid grid-cols-2 gap-4">
                <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> M-Pesa Instant
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> PayPal Global
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Payoneer
                </li>
                <li className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Bank Transfer
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The "Why the Fee" Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 text-orange-500 mb-6 font-bold uppercase tracking-widest text-sm">
            <span className="flex items-center gap-2"><Info className="w-5 h-5" /> Transparency & Trust</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Understanding the Onboarding Fee</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            You may notice a <span className="text-white font-bold">$35 (approx. 4,600 KES)</span> activation fee. While some sites offer free registration, we've found that a one-time onboarding fee is essential for maintaining a high-quality workforce.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700">
              <UserCheck className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">Identity Verification</h3>
              <p className="text-gray-400">
                This fee covers the cost of background checks and identity verification. This ensures that every agent on joinwarmora.com is a real person and prevents platform abuse.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700">
              <Lock className="w-10 h-10 text-orange-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">Combatting Fraud</h3>
              <p className="text-gray-400">
                The fee acts as a filter to ensure we only attract high-intent, professional candidates. It helps us dedicate our resources to people who are serious about starting a career.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">Frequently Asked Questions</h2>
        <div className="grid gap-6 text-left">
          {[
            {
              q: "How soon can I start earning?",
              a: "Most agents complete their onboarding and start their first shift within 2 hours of account activation."
            },
            {
              q: "Do I need any special equipment?",
              a: "No. You only need a smartphone or a laptop with a stable internet connection."
            },
            {
              q: "Can I choose my own hours?",
              a: "Yes. Warmora operates 24/7. You can log in and out whenever it suits your schedule."
            }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">{item.q}</h4>
              <p className="text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:bg-orange-600 transition shadow-2xl shadow-orange-200"
          >
            Ready to Start? Register Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
