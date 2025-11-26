'use client'

import { CartProvider } from '@/contexts/cart-context'
import { Toaster } from '@/components/ui/sonner'
import Cart from '@/components/cart'
import Navbar from '@/components/navbar'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const isAdminOrAuthRoute =
    pathname?.startsWith('/painel') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/register')

  return (
    <CartProvider>
      {!isAdminOrAuthRoute && (
        <>
          <Navbar />
          <div className="fixed top-20 right-4 z-50">
            <Cart />
          </div>
        </>
      )}
      {children}
      <Toaster />
    </CartProvider>
  )
}
