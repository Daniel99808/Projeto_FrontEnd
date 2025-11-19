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
import { Edit } from 'lucide-react'
import { useState, useTransition } from 'react'
import { editarProduto } from '../actions'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { cn } from '@/lib/utils'

interface EditProdutoProps {
  produto: {
    id: string
    nome: string
    descricao: string | null
    preco: number
    categoriaId: string
  }
  categorias: Array<{ id: string; nome: string }>
}

const produtoSchema = z.object({
  nome: z.string().min(1, 'O nome do produto é obrigatório').min(3, 'O nome deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  preco: z.string().min(1, 'O preço é obrigatório').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'O preço deve ser maior que zero'
  ),
  categoriaId: z.string().min(1, 'Selecione uma categoria')
})

type ProdutoFormData = z.infer<typeof produtoSchema>

export default function EditProduto({ produto, categorias }: EditProdutoProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const { register, handleSubmit, formState: { errors } } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    mode: 'onChange',
    defaultValues: {
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco.toString(),
      categoriaId: produto.categoriaId
    }
  })

  async function onSubmit(data: ProdutoFormData) {
    const formData = new FormData()
    formData.append('nome', data.nome)
    formData.append('descricao', data.descricao || '')
    formData.append('preco', data.preco)
    formData.append('categoriaId', data.categoriaId)

    startTransition(async () => {
      const result = await editarProduto(produto.id, formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Produto atualizado com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Altere as informações do produto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <Input
                id="nome"
                placeholder="Ex: Pizza Margherita, Coca-Cola..."
                disabled={isPending}
                aria-invalid={!!errors.nome}
                {...register('nome')}
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Input
                id="descricao"
                placeholder="Descreva o produto..."
                disabled={isPending}
                aria-invalid={!!errors.descricao}
                {...register('descricao')}
              />
              {errors.descricao && (
                <p className="text-sm text-red-500">{errors.descricao.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                placeholder="0.00"
                disabled={isPending}
                aria-invalid={!!errors.preco}
                {...register('preco')}
              />
              {errors.preco && (
                <p className="text-sm text-red-500">{errors.preco.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoriaId">Categoria</Label>
              <select
                id="categoriaId"
                disabled={isPending}
                aria-invalid={!!errors.categoriaId}
                className={cn(
                  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  errors.categoriaId ? "border-destructive ring-destructive/20" : "border-input"
                )}
                {...register('categoriaId')}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </select>
              {errors.categoriaId && (
                <p className="text-sm text-red-500">{errors.categoriaId.message}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}