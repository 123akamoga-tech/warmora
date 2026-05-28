import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle, MessageCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

export const Route = createFileRoute('/success')({
  component: SuccessPage,
})

import { Footer } from '~/components/Footer'

function SuccessPage() {
  const whatsappGroupLink = "https://chat.whatsapp.com/YOUR_GROUP_INVITE_CODE"

  return (
    <div className="min-h-screen bg-emerald-50/30 font-sans flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-100 border border-emerald-100 overflow-hidden text-center">
        <div className="bg-emerald-500 p-12 text-white flex flex-col items-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Payment Verified!</h1>
          <p className="text-emerald-50 font-medium">Welcome to the Warmora Agent Team.</p>
        </div>

        <div className="p-10 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Next Steps</h2>
            <p className="text-gray-600 leading-relaxed">
              Your account is now being activated. To receive your first matching shifts, you must join our official **Agent Matching Group** on WhatsApp.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl space-y-4">
            <div className="flex items-center gap-4 text-left">
              <div className="bg-emerald-500 p-3 rounded-full">
                <MessageCircle className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <span className="block font-bold text-emerald-900">Official Matching Group</span>
                <span className="text-xs text-emerald-600">Join to start receiving chat shifts</span>
              </div>
            </div>
            <a 
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block bg-emerald-500 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
            >
              Join WhatsApp Group
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-left">
              <Zap className="w-5 h-5 text-orange-500 mb-2" />
              <span className="block font-bold text-orange-900 text-sm">Shift Ready</span>
              <span className="text-[10px] text-orange-700">Available 24/7</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-left">
              <ShieldCheck className="w-5 h-5 text-blue-500 mb-2" />
              <span className="block font-bold text-blue-900 text-sm">Verified Agent</span>
              <span className="text-[10px] text-blue-700">Priority Support</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            A copy of your receipt and onboarding guide has been sent to your email. If you have any issues joining the group, contact support.
          </p>
        </div>
      </div>

      <Link to="/" className="my-8 text-gray-500 hover:text-orange-500 transition font-medium">
        Return to Homepage
      </Link>
      <Footer />
    </div>
  )
}
