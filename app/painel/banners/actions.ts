'use server'

import prisma from '@/lib/prisma-client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const bannerSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').trim(),
  subtitulo: z.string().optional(),
  imageUrl: z.string().min(1, 'URL da imagem é obrigatória'),
  link: z.string().optional(),
  ativo: z.boolean().default(true),
  ordem: z.number().int().default(0),
})

export async function criarBanner(formData: FormData) {
  const data = {
    titulo: formData.get('titulo') as string,
    subtitulo: formData.get('subtitulo') as string,
    imageUrl: formData.get('imageUrl') as string,
    link: formData.get('link') as string,
    ativo: formData.get('ativo') === 'true',
    ordem: parseInt(formData.get('ordem') as string) || 0,
  }

  const validation = bannerSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    await prisma.banner.create({
      data: {
        titulo: validation.data.titulo,
        subtitulo: validation.data.subtitulo || null,
        imageUrl: validation.data.imageUrl,
        link: validation.data.link || null,
        ativo: validation.data.ativo,
        ordem: validation.data.ordem,
      },
    })

    revalidatePath('/painel/banners')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Erro ao criar banner:', error)
    return { error: 'Erro ao criar banner' }
  }
}

export async function editarBanner(id: string, formData: FormData) {
  const data = {
    titulo: formData.get('titulo') as string,
    subtitulo: formData.get('subtitulo') as string,
    imageUrl: formData.get('imageUrl') as string,
    link: formData.get('link') as string,
    ativo: formData.get('ativo') === 'true',
    ordem: parseInt(formData.get('ordem') as string) || 0,
  }

  const validation = bannerSchema.safeParse(data)

  if (!validation.success) {
    return { error: validation.error.issues[0].message }
  }

  try {
    await prisma.banner.update({
      where: { id },
      data: {
        titulo: validation.data.titulo,
        subtitulo: validation.data.subtitulo || null,
        imageUrl: validation.data.imageUrl,
        link: validation.data.link || null,
        ativo: validation.data.ativo,
        ordem: validation.data.ordem,
      },
    })

    revalidatePath('/painel/banners')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Erro ao editar banner:', error)
    return { error: 'Erro ao editar banner' }
  }
}

export async function excluirBanner(id: string) {
  try {
    await prisma.banner.delete({
      where: { id },
    })

    revalidatePath('/painel/banners')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir banner:', error)
    return { error: 'Erro ao excluir banner' }
  }
}

export async function toggleBannerAtivo(id: string, ativo: boolean) {
  try {
    await prisma.banner.update({
      where: { id },
      data: { ativo },
    })

    revalidatePath('/painel/banners')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Erro ao alterar status do banner:', error)
    return { error: 'Erro ao alterar status' }
  }
}
