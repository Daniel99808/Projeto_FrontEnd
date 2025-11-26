"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, UtensilsCrossed } from 'lucide-react'
import UserMenu from '@/components/user-menu'

export default function Navbar() {
  const pathname = usePathname()

  // Não mostrar navbar em páginas de login/painel
  if (pathname?.startsWith('/login') || pathname?.startsWith('/painel') || pathname?.startsWith('/dashboard') || pathname?.startsWith('/register')) {
    return null
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-orange-100/60 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-orange-600 transition-colors"
          >
            <UtensilsCrossed className="w-7 h-7 text-orange-600" />
            <span className="tracking-tight">
              Delivery
              <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600 align-middle">
                Online
              </span>
            </span>
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-orange-600' 
                  : 'text-gray-600 hover:text-orange-600'
              }`}
            >
              <Home className="w-4 h-4" />
              Início
            </Link>
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
