import { Link } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-2 rounded-xl">
            <MessageCircle className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Warmora</span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <div className="flex items-center gap-8 text-gray-400 font-bold text-sm">
            <Link to="/mechanics" className="hover:text-orange-500 transition">Transparency</Link>
            <a 
              href="https://wa.me/256707457606" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition font-black"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600" />
              WhatsApp Support
            </a>
          </div>
          <div className="text-gray-400 text-sm font-medium">
            © 2024 Warmora. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
