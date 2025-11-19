'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const pedidoSchema = z.object({
  nomeCliente: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').max(15, 'Telefone inválido'),
  endereco: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres'),
  items: z.array(z.object({
    produtoId: z.string(),
    quantidade: z.number().min(1),
    precoUnit: z.number().min(0)
  })).min(1, 'Adicione pelo menos um item ao carrinho')
})

export async function criarPedido(formData: FormData) {
  const nomeCliente = formData.get('nomeCliente') as string
  const email = formData.get('email') as string
  const telefone = formData.get('telefone') as string
  const endereco = formData.get('endereco') as string
  const itemsJson = formData.get('items') as string

  let items
  try {
    items = JSON.parse(itemsJson)
  } catch {
    return { error: 'Erro ao processar itens do pedido' }
  }

  const validation = pedidoSchema.safeParse({
    nomeCliente,
    email,
    telefone,
    endereco,
    items
  })

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    // Criar o pedido com os itens
    const pedido = await prisma.pedidos.create({
      data: {
        nomeCliente: validation.data.nomeCliente,
        endereco: validation.data.endereco,
        telefone: validation.data.telefone,
        items: {
          create: validation.data.items.map(item => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnit: item.precoUnit
          }))
        }
      },
      include: {
        items: {
          include: {
            produto: true
          }
        }
      }
    })

    revalidatePath('/painel/pedidos')
    return { 
      success: true, 
      pedidoId: pedido.id,
      message: 'Pedido realizado com sucesso!' 
    }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return { error: 'Erro ao processar pedido. Tente novamente.' }
  }
}
