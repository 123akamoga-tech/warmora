import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from 'react'
import { MessageCircle, ShieldCheck, ArrowRight, LogOut } from 'lucide-react'

export const Route = createFileRoute('/payment')({
  component: PaymentPage,
})

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

import { Footer } from '~/components/Footer'

function PaymentPage() {
  const user = useQuery(api.users.viewer)
  const navigate = useNavigate()
  const markPaid = useMutation(api.users.markFeePaid)
  
  const [locationData, setLocationData] = useState({
    country: 'Global',
    currency: 'USD',
    amount: 30,
    symbol: '$'
  })

  useEffect(() => {
    if (user?.onboardingFeePaid || user?.paymentStatus === 'pending_approval') {
      navigate({ to: '/dashboard' })
    }
  }, [user, navigate])

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/')
        const data = await res.json()
        const currencyMap: Record<string, { currency: string, rate: number, symbol: string }> = {
          'UG': { currency: 'UGX', rate: 3800, symbol: 'UGX' },
          'KE': { currency: 'KES', rate: 130, symbol: 'KSh' },
          'TZ': { currency: 'TZS', rate: 2600, symbol: 'TSh' },
          'NG': { currency: 'NGN', rate: 1500, symbol: '₦' },
          'ZA': { currency: 'ZAR', rate: 19, symbol: 'R' },
          'GH': { currency: 'GHS', rate: 14, symbol: 'GH₵' },
        }
        if (currencyMap[data.country_code]) {
          const config = currencyMap[data.country_code]
          setLocationData({
            country: data.country_name,
            currency: config.currency,
            amount: Math.round(30 * config.rate / 100) * 100 || (30 * config.rate),
            symbol: config.symbol
          })
        }
      } catch (err) { console.error(err) }
    }
    detectLocation()
  }, [])

  const handleFlutterwavePayment = () => {
    if (!window.FlutterwaveCheckout) return;
    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-SANDBOX-X",
      tx_ref: `WAR-${user?._id}-${Date.now()}`,
      amount: locationData.amount,
      currency: locationData.currency,
      customer: {
        email: user?.email || '',
        name: user?.name || '',
      },
      callback: async () => {
        await markPaid({ payoutMethod: 'Flutterwave' })
        navigate({ to: '/dashboard' })
      },
    });
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-orange-50/30 font-sans p-6">
      <div className="max-w-xl mx-auto py-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-orange-100 overflow-hidden">
          <div className="bg-orange-500 p-10 text-white text-center">
            <h1 className="text-3xl font-bold mb-2">Account Activation</h1>
            <p className="opacity-90">One step away from starting your career.</p>
          </div>
          
          <div className="p-10 space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Activation Fee Required</h2>
              <p className="text-gray-600 text-sm">Detected Location: <b>{locationData.country}</b></p>
              <p className="text-gray-600 mt-4">To fund background checks and account setup, a one-time fee of <span className="font-bold text-orange-600 text-xl">{locationData.symbol} {locationData.amount.toLocaleString()}</span> is required.</p>
            </div>

            <div className="grid gap-4">
              <button 
                onClick={handleFlutterwavePayment}
                className="flex items-center justify-between p-5 bg-orange-50 border border-orange-200 rounded-2xl hover:bg-orange-100 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl border border-orange-100 flex items-center justify-center font-black text-orange-500 italic text-xl">FW</div>
                  <div className="text-left">
                    <span className="block font-bold text-gray-800 text-lg">Pay {locationData.symbol} {locationData.amount.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">M-Pesa, Card, Mobile Money</span>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-orange-400 group-hover:translate-x-1 transition" />
              </button>

              <a 
                href="https://paypal.me/fickfrank050"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl border border-blue-100 flex items-center justify-center font-black text-blue-800 italic text-xl">PP</div>
                  <div className="text-left">
                    <span className="block font-bold text-gray-800 text-lg">PayPal Checkout</span>
                    <span className="text-xs text-gray-500">Pay to: fickfrank050@gmail.com</span>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-1 transition" />
              </a>

              <a 
                href={`https://wa.me/+256707457606?text=${encodeURIComponent(`Hello, I'm ${user.name} and I need help paying the ${locationData.symbol}${locationData.amount} activation fee from ${locationData.country}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-emerald-50 border border-emerald-200 rounded-2xl hover:bg-emerald-100 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl border border-emerald-100 flex items-center justify-center">
                    <MessageCircle className="w-7 h-7 text-emerald-600 fill-emerald-600" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-gray-800 text-lg">Contact Agent</span>
                    <span className="text-xs text-gray-500">Manual payment assistance</span>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition" />
              </a>
            </div>

            <div className="pt-6 border-t border-gray-100 text-center">
              <Link 
                to="/logout"
                className="inline-flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-orange-500 transition"
              >
                <LogOut className="w-4 h-4" /> Sign out and return to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
