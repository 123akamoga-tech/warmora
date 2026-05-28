import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthActions } from "@convex-dev/auth/react"
import { useEffect } from 'react'
import { Loader2, LogOut } from 'lucide-react'

export const Route = createFileRoute('/logout')({
  component: LogoutPage,
})

function LogoutPage() {
  const { signOut } = useAuthActions()
  const navigate = useNavigate()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut()
        // Small delay for UX so it doesn't feel like a glitch
        setTimeout(() => {
          navigate({ to: '/register' })
        }, 1000)
      } catch (error) {
        console.error("Logout failed", error)
        navigate({ to: '/' })
      }
    }
    performLogout()
  }, [signOut, navigate])

  return (
    <div className="min-h-screen bg-orange-50/30 flex items-center justify-center font-sans">
      <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center mx-auto relative z-10">
            <LogOut className="w-10 h-10 text-orange-500" />
          </div>
          <div className="absolute inset-0 bg-orange-200 rounded-full blur-2xl opacity-50 scale-150 animate-pulse" />
        </div>
        
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Signing Out</h1>
          <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
            Securing your agent session... <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
          </p>
        </div>
      </div>
    </div>
  )
}
