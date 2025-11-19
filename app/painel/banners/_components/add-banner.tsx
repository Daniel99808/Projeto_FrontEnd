'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useTransition } from 'react'
import { criarBanner } from '../actions'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'

const bannerSchema = z.object({
  titulo: z.string().min(1, 'O título é obrigatório'),
  subtitulo: z.string().optional(),
  imageUrl: z.string().min(1, 'A URL da imagem é obrigatória'),
  link: z.string().optional(),
  ativo: z.boolean().default(true),
  ordem: z.string().refine((val) => !isNaN(parseInt(val)), 'Ordem deve ser um número').default('0'),
})

type BannerFormData = z.infer<typeof bannerSchema>

export default function AddBanner() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [imageUrl, setImageUrl] = useState<string>('')
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    mode: 'onChange',
    defaultValues: {
      ativo: true,
      ordem: '0'
    }
  })

  async function onSubmit(data: BannerFormData) {
    const formData = new FormData()
    formData.append('titulo', data.titulo)
    formData.append('subtitulo', data.subtitulo || '')
    formData.append('imageUrl', imageUrl)
    formData.append('link', data.link || '')
    formData.append('ativo', data.ativo.toString())
    formData.append('ordem', data.ordem)

    startTransition(async () => {
      const result = await criarBanner(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Banner criado com sucesso!')
        reset()
        setImageUrl('')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Banner</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Adicionar Banner</DialogTitle>
            <DialogDescription>
              Crie um novo banner para exibir na página inicial
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo" className={cn(errors.titulo && 'text-red-500')}>
                Título *
              </Label>
              <Input
                id="titulo"
                placeholder="Ex: Promoção de Pizzas"
                disabled={isPending}
                {...register('titulo')}
                className={cn(errors.titulo && 'border-red-500')}
              />
              {errors.titulo && (
                <p className="text-sm text-red-500">{errors.titulo.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitulo">Subtítulo</Label>
              <Input
                id="subtitulo"
                placeholder="Ex: Até 30% de desconto"
                disabled={isPending}
                {...register('subtitulo')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className={cn(errors.imageUrl && 'text-red-500')}>
                Imagem do Banner *
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="imageUrl"
                  placeholder="URL da imagem (ex: /banners/promo.jpg)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isPending}
                  className="flex-1"
                />
                {imageUrl && (
                  <div className="relative h-16 w-24 rounded border overflow-hidden bg-gray-50">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.png'
                      }}
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Digite a URL da imagem ou coloque o arquivo na pasta public/banners
              </p>
              {errors.imageUrl && (
                <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link (opcional)</Label>
              <Input
                id="link"
                placeholder="Ex: /categoria/pizza"
                disabled={isPending}
                {...register('link')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ordem">Ordem de Exibição</Label>
                <Input
                  id="ordem"
                  type="number"
                  placeholder="0"
                  disabled={isPending}
                  {...register('ordem')}
                />
                <p className="text-xs text-muted-foreground">
                  Menor número aparece primeiro
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="ativo"
                  disabled={isPending}
                  {...register('ativo')}
                  className="h-4 w-4"
                />
                <Label htmlFor="ativo" className="font-normal cursor-pointer">
                  Banner ativo
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setImageUrl('')
                setOpen(false)
              }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || !imageUrl}>
              {isPending ? 'Criando...' : 'Criar Banner'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
