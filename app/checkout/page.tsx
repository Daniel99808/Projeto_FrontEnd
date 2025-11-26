'use client'

import { useCart } from '@/contexts/cart-context'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { criarPedido } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const checkoutSchema = z.object({
  nomeCliente: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').max(15, 'Telefone inválido'),
  endereco: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres')
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur'
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Carrinho Vazio</h1>
          <p className="text-gray-600 mb-6">Adicione produtos ao carrinho para fazer um pedido</p>
          <Link href="/">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Ver Produtos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  async function onSubmit(data: CheckoutFormData) {
    const formData = new FormData()
    formData.append('nomeCliente', data.nomeCliente)
    formData.append('email', data.email)
    formData.append('telefone', data.telefone)
    formData.append('endereco', data.endereco)
    formData.append('items', JSON.stringify(
      items.map(item => ({
        produtoId: item.id,
        quantidade: item.quantidade,
        precoUnit: item.preco
      }))
    ))

    startTransition(async () => {
      const result = await criarPedido(formData)

      if (result.error) {
        toast.error(result.error)
      } else if (result.success) {
        toast.success(result.message || 'Pedido realizado com sucesso!', {
          description: `Pedido #${result.pedidoId?.slice(0, 8).toUpperCase()}`
        })
        clearCart()
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:py-12">
      <div className="container mx-auto max-w-6xl">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </Link>

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Finalizar Pedido
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl">
            Revise seus dados e confirme as informações de entrega antes de concluir o pedido.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Dados do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nomeCliente">Nome Completo *</Label>
                    <Input
                      id="nomeCliente"
                      placeholder="Seu nome completo"
                      disabled={isPending}
                      {...register('nomeCliente')}
                    />
                    {errors.nomeCliente && (
                      <p className="text-sm text-red-500">{errors.nomeCliente.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      disabled={isPending}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      disabled={isPending}
                      {...register('telefone')}
                    />
                    {errors.telefone && (
                      <p className="text-sm text-red-500">{errors.telefone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço de Entrega *</Label>
                    <Input
                      id="endereco"
                      placeholder="Rua, número, bairro, cidade"
                      disabled={isPending}
                      {...register('endereco')}
                    />
                    {errors.endereco && (
                      <p className="text-sm text-red-500">{errors.endereco.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700"
                    disabled={isPending}
                  >
                    {isPending ? 'Processando...' : 'Finalizar Pedido'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card className="lg:sticky lg:top-20 shadow-sm">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b">
                      <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                        {item.foto ? (
                          <Image
                            src={item.foto}
                            alt={item.nome}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🍕
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{item.nome}</h4>
                        <p className="text-sm text-gray-600">
                          {item.quantidade}x R$ {item.preco.toFixed(2)}
                        </p>
                        <p className="text-sm font-bold text-orange-600">
                          R$ {(item.quantidade * item.preco).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxa de Entrega:</span>
                    <span className="font-semibold text-green-600">Grátis</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-orange-600">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
