'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'

interface ProdutoItem {
  produtoId: string
  quantidade: number
}

export async function criarPedido(
  nomeCliente: string,
  endereco: string,
  telefone: string,
  produtos: ProdutoItem[]
) {
  if (!nomeCliente || nomeCliente.trim() === '') {
    return { error: 'Nome do cliente é obrigatório' }
  }

  if (!endereco || endereco.trim() === '') {
    return { error: 'Endereço é obrigatório' }
  }

  if (!telefone || telefone.trim() === '') {
    return { error: 'Telefone é obrigatório' }
  }

  if (!produtos || produtos.length === 0) {
    return { error: 'Adicione pelo menos um produto ao pedido' }
  }

  try {
    // Buscar preços dos produtos
    const produtosData = await prisma.produtos.findMany({
      where: {
        id: {
          in: produtos.map((p) => p.produtoId),
        },
      },
    })

    const pedido = await prisma.pedidos.create({
      data: {
        nomeCliente: nomeCliente.trim(),
        endereco: endereco.trim(),
        telefone: telefone.trim(),
        items: {
          create: produtos.map((item) => {
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
  if (!nomeCliente || nomeCliente.trim() === '') {
    return { error: 'Nome do cliente é obrigatório' }
  }

  if (!endereco || endereco.trim() === '') {
    return { error: 'Endereço é obrigatório' }
  }

  if (!telefone || telefone.trim() === '') {
    return { error: 'Telefone é obrigatório' }
  }

  if (!produtos || produtos.length === 0) {
    return { error: 'Adicione pelo menos um produto ao pedido' }
  }

  try {
    // Buscar preços dos produtos
    const produtosData = await prisma.produtos.findMany({
      where: {
        id: {
          in: produtos.map((p) => p.produtoId),
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
        nomeCliente: nomeCliente.trim(),
        endereco: endereco.trim(),
        telefone: telefone.trim(),
        items: {
          create: produtos.map((item) => {
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
