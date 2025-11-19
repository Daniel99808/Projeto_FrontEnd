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
import { criarCategoria } from '../actions'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const categoriaSchema = z.object({
  nome: z.string().min(1, 'O nome da categoria é obrigatório').min(3, 'O nome deve ter pelo menos 3 caracteres')
})

type CategoriaFormData = z.infer<typeof categoriaSchema>

export default function AddCategorias() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    mode: 'onChange'
  })

  async function onSubmit(data: CategoriaFormData) {
    const formData = new FormData()
    formData.append('nome', data.nome)

    startTransition(async () => {
      const result = await criarCategoria(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Categoria criada com sucesso!')
        reset()
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Adicionar Categoria</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Categoria</DialogTitle>
          <DialogDescription>
            Crie uma nova categoria para organizar seus produtos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Categoria</Label>
              <Input
                id="nome"
                placeholder="Ex: Pizzas, Bebidas, Sobremesas..."
                disabled={isPending}
                aria-invalid={!!errors.nome}
                {...register('nome')}
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setOpen(false)
              }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Criando...' : 'Criar Categoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}