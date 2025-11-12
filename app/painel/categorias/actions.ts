'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const categoriaSchema = z.object({
  nome: z.string().min(1, 'Nome da categoria é obrigatório').trim(),
})

export async function criarCategoria(formData: FormData) {
  const nome = formData.get('nome') as string

  const validation = categoriaSchema.safeParse({ nome })

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    await prisma.categorias.create({
      data: {
        nome: validation.data.nome,
      },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return { error: 'Erro ao criar categoria' }
  }
}

export async function editarCategoria(id: string, formData: FormData) {
  const nome = formData.get('nome') as string

  const validation = categoriaSchema.safeParse({ nome })

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    await prisma.categorias.update({
      where: { id },
      data: {
        nome: validation.data.nome,
      },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar categoria:', error)
    return { error: 'Erro ao editar categoria' }
  }
}

export async function excluirCategoria(id: string) {
  try {
    await prisma.categorias.delete({
      where: { id },
    })

    revalidatePath('/painel/categorias')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir categoria:', error)
    return { error: 'Erro ao excluir categoria' }
  }
}