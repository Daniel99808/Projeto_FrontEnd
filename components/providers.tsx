'use client'

import { CartProvider } from '@/contexts/cart-context'
import { Toaster } from '@/components/ui/sonner'
import Cart from '@/components/cart'
import Navbar from '@/components/navbar'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <div className="fixed top-20 right-4 z-50">
        <Cart />
      </div>
      {children}
      <Toaster />
    </CartProvider>
  )
}
