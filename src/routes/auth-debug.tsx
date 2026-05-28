import { createFileRoute } from '@tanstack/react-router'
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/auth-debug')({
  component: AuthDebugPage,
})

function AuthDebugPage() {
  const { isLoading, isAuthenticated } = useConvexAuth()
  const user = useQuery(api.users.viewer)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString()
    const log = `[${timestamp}] Loading: ${isLoading}, Auth: ${isAuthenticated}, User: ${user === undefined ? 'Fetching' : (user === null ? 'Null' : 'Found')}`
    setLogs(prev => [...prev, log])
  }, [isLoading, isAuthenticated, user])

  return (
    <div className="p-8 font-mono text-xs">
      <h1 className="text-xl font-bold mb-4">Auth Debugger</h1>
      <div className="space-y-2 mb-8 bg-blue-50 p-4 rounded border border-blue-200">
        <p><strong>Configured Convex URL:</strong> {(import.meta as any).env.VITE_CONVEX_URL}</p>
        <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}</p>
        <p><strong>LocalStorage Status:</strong> {typeof window !== 'undefined' ? (Object.keys(localStorage).some(k => k.startsWith('__convexAuthJWT')) ? 'Found JWT Key' : 'No JWT Found') : 'SSR'}</p>
        <p><strong>All LocalStorage Keys:</strong> {typeof window !== 'undefined' ? Object.keys(localStorage).join(', ') || 'Empty' : 'SSR'}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded border">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Reload Page
        </button>
        <button 
          onClick={() => {
            localStorage.clear()
            sessionStorage.clear()
            // Clear cookies if any
            document.cookie.split(";").forEach(function(c) { 
              document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            window.location.href = '/register'
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Factory Reset & Go Login
        </button>
      </div>
    </div>
  )
}
