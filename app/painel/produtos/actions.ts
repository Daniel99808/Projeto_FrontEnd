'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const produtoSchema = z.object({
  nome: z.string().min(1, 'Nome do produto é obrigatório').trim(),
  descricao: z.string().optional(),
  preco: z.number().positive('Preço deve ser maior que zero'),
  categoriaId: z.string().min(1, 'Categoria é obrigatória'),
  foto: z.string().optional(),
})

export async function criarProduto(formData: FormData) {
  const data = {
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string,
    preco: parseFloat(formData.get('preco') as string),
    categoriaId: formData.get('categoriaId') as string,
    foto: formData.get('foto') as string,
  }

  const validation = produtoSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    await prisma.produtos.create({
      data: {
        nome: validation.data.nome,
        descricao: validation.data.descricao || null,
        preco: validation.data.preco,
        categoriaId: validation.data.categoriaId,
        foto: validation.data.foto || null,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return { error: 'Erro ao criar produto' }
  }
}

export async function editarProduto(id: string, formData: FormData) {
  const data = {
    nome: formData.get('nome') as string,
    descricao: formData.get('descricao') as string,
    preco: parseFloat(formData.get('preco') as string),
    categoriaId: formData.get('categoriaId') as string,
    foto: formData.get('foto') as string,
  }

  const validation = produtoSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    await prisma.produtos.update({
      where: { id },
      data: {
        nome: validation.data.nome,
        descricao: validation.data.descricao || null,
        preco: validation.data.preco,
        categoriaId: validation.data.categoriaId,
        foto: validation.data.foto || null,
      },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar produto:', error)
    return { error: 'Erro ao editar produto' }
  }
}

export async function excluirProduto(id: string) {
  try {
    await prisma.produtos.delete({
      where: { id },
    })

    revalidatePath('/painel/produtos')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return { error: 'Erro ao excluir produto' }
  }
}