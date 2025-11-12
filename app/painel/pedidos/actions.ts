'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

interface ProdutoItem {
  produtoId: string
  quantidade: number
}

const pedidoSchema = z.object({
  nomeCliente: z.string().min(1, 'Nome do cliente é obrigatório').trim(),
  endereco: z.string().min(1, 'Endereço é obrigatório').trim(),
  telefone: z.string().min(1, 'Telefone é obrigatório').trim(),
  produtos: z.array(
    z.object({
      produtoId: z.string().min(1, 'Produto é obrigatório'),
      quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
    })
  ).min(1, 'Adicione pelo menos um produto ao pedido'),
})

export async function criarPedido(
  nomeCliente: string,
  endereco: string,
  telefone: string,
  produtos: ProdutoItem[]
) {
  const validation = pedidoSchema.safeParse({
    nomeCliente,
    endereco,
    telefone,
    produtos,
  })

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    // Buscar preços dos produtos
    const produtosData = await prisma.produtos.findMany({
      where: {
        id: {
          in: validation.data.produtos.map((p) => p.produtoId),
        },
      },
    })

    const pedido = await prisma.pedidos.create({
      data: {
        nomeCliente: validation.data.nomeCliente,
        endereco: validation.data.endereco,
        telefone: validation.data.telefone,
        items: {
          create: validation.data.produtos.map((item) => {
            const produto = produtosData.find((p) => p.id === item.produtoId)
            return {
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              precoUnit: produto?.preco || 0,
            }
          }),
        },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true, pedido }
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    return { error: 'Erro ao criar pedido' }
  }
}

export async function editarPedido(
  id: string,
  nomeCliente: string,
  endereco: string,
  telefone: string,
  produtos: ProdutoItem[]
) {
  const validation = pedidoSchema.safeParse({
    nomeCliente,
    endereco,
    telefone,
    produtos,
  })

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    // Buscar preços dos produtos
    const produtosData = await prisma.produtos.findMany({
      where: {
        id: {
          in: validation.data.produtos.map((p) => p.produtoId),
        },
      },
    })

    // Deletar itens antigos e criar novos
    await prisma.pedidoItem.deleteMany({
      where: { pedidoId: id },
    })

    await prisma.pedidos.update({
      where: { id },
      data: {
        nomeCliente: validation.data.nomeCliente,
        endereco: validation.data.endereco,
        telefone: validation.data.telefone,
        items: {
          create: validation.data.produtos.map((item) => {
            const produto = produtosData.find((p) => p.id === item.produtoId)
            return {
              produtoId: item.produtoId,
              quantidade: item.quantidade,
              precoUnit: produto?.preco || 0,
            }
          }),
        },
      },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar pedido:', error)
    return { error: 'Erro ao editar pedido' }
  }
}

export async function excluirPedido(id: string) {
  try {
    await prisma.pedidos.delete({
      where: { id },
    })

    revalidatePath('/painel/pedidos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir pedido:', error)
    return { error: 'Erro ao excluir pedido' }
  }
}
