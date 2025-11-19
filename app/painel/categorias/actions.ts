'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Helper function to generate slug from nome
function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

const categoriaSchema = z.object({
  nome: z.string().min(1, 'Nome da categoria é obrigatório').trim(),
  cor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inválida').default('#000000'),
})

export async function criarCategoria(formData: FormData) {
  const nome = formData.get('nome') as string
  const cor = formData.get('cor') as string || '#000000'

  const validation = categoriaSchema.safeParse({ nome, cor })

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const slug = generateSlug(validation.data.nome)

  // Check if slug already exists
  const existingCategoria = await prisma.categorias.findFirst({
    where: { slug },
  })

  if (existingCategoria) {
    return { error: 'Já existe uma categoria com este nome' }
  }

  try {
    await prisma.categorias.create({
      data: {
        nome: validation.data.nome,
        slug,
        cor: validation.data.cor,
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
  const cor = formData.get('cor') as string || '#000000'

  const validation = categoriaSchema.safeParse({ nome, cor })

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  const slug = generateSlug(validation.data.nome)

  // Check if slug already exists for another category
  const existingCategoria = await prisma.categorias.findFirst({
    where: { 
      slug,
      id: { not: id }
    },
  })

  if (existingCategoria) {
    return { error: 'Já existe uma categoria com este nome' }
  }

  try {
    await prisma.categorias.update({
      where: { id },
      data: {
        nome: validation.data.nome,
        slug,
        cor: validation.data.cor,
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