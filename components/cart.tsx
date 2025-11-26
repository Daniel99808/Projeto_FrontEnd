'use client'

import { useCart } from '@/contexts/cart-context'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Cart() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-6 sm:max-w-lg p-6 sm:p-8">
        <SheetHeader className="space-y-1 text-left">
          <SheetTitle className="text-2xl font-bold tracking-tight">Meu Carrinho</SheetTitle>
          {totalItems > 0 && (
            <p className="text-sm text-muted-foreground">
              Você tem <span className="font-semibold text-orange-600">{totalItems}</span> item{totalItems > 1 && 's'} no carrinho
            </p>
          )}
        </SheetHeader>

        <div className="flex-1 min-h-0">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingCart className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-base font-medium text-gray-700">Seu carrinho está vazio</p>
              <p className="mt-2 max-w-[260px] text-xs text-gray-400">
                Adicione produtos deliciosos ao seu pedido e finalize quando estiver pronto.
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-4">
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/80 p-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)]"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-200 sm:h-24 sm:w-24">
                      {item.foto ? (
                        <Image
                          src={item.foto}
                          alt={item.nome}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl">
                          🍕
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">
                          {item.nome}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="ml-1 rounded-full p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-orange-600 sm:text-base">
                        R$ {item.preco.toFixed(2)}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 rounded-full border border-transparent hover:border-gray-200"
                            onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-semibold">
                            {item.quantidade}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 rounded-full border border-transparent hover:border-gray-200"
                            onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <span className="text-sm font-semibold text-gray-900 sm:text-base">
                          R$ {(item.preco * item.quantidade).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_-4px_12px_rgba(15,23,42,0.12)] sm:p-5">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Itens</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span className="text-lg font-bold text-orange-600">
                  R$ {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <SheetClose asChild>
                <Link href="/checkout" className="flex-1">
                  <Button className="h-11 w-full rounded-full bg-orange-600 text-base font-semibold hover:bg-orange-700">
                    Finalizar Pedido
                  </Button>
                </Link>
              </SheetClose>

              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-full border-gray-200 text-sm font-medium text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:w-auto sm:flex-none"
                onClick={clearCart}
              >
                Limpar Carrinho
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
