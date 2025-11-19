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
import { criarPedido } from '../actions'
import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

interface AddPedidosProps {
  produtos: Array<{ id: string; nome: string; preco: number }>
}

interface ProdutoSelecionado {
  produtoId: string
  quantidade: number
}

const pedidoSchema = z.object({
  nomeCliente: z.string().min(1, 'O nome do cliente é obrigatório').min(3, 'O nome deve ter pelo menos 3 caracteres'),
  endereco: z.string().min(1, 'O endereço é obrigatório').min(5, 'O endereço deve ter pelo menos 5 caracteres'),
  telefone: z.string().min(1, 'O telefone é obrigatório').regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Formato inválido. Use: (11) 99999-9999')
})

type PedidoFormData = z.infer<typeof pedidoSchema>

export default function AddPedidos({ produtos }: AddPedidosProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([])
  const [produtoErros, setProdutoErros] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema),
    mode: 'onBlur'
  })

  const telefoneValue = watch('telefone')

  function formatarTelefone(valor: string) {
    // Remove tudo que não é número
    const numero = valor.replace(/\D/g, '')
    
    // Limita a 11 dígitos (DDD + 9 dígitos)
    const numeroLimitado = numero.slice(0, 11)
    
    // Aplica a máscara
    if (numeroLimitado.length <= 10) {
      // Formato: (XX) XXXX-XXXX
      return numeroLimitado
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    } else {
      // Formato: (XX) XXXXX-XXXX
      return numeroLimitado
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
    }
  }

  function adicionarProduto() {
    setProdutosSelecionados([...produtosSelecionados, { produtoId: '', quantidade: 1 }])
  }

  function removerProduto(index: number) {
    setProdutosSelecionados(produtosSelecionados.filter((_, i) => i !== index))
  }

  function atualizarProduto(index: number, campo: 'produtoId' | 'quantidade', valor: string | number) {
    const novos = [...produtosSelecionados]
    if (campo === 'produtoId') {
      novos[index].produtoId = valor as string
    } else {
      novos[index].quantidade = Number(valor)
    }
    setProdutosSelecionados(novos)
    // Limpa erros quando atualizar
    setProdutoErros([])
  }

  function validarProdutos(): boolean {
    const erros: string[] = []
    
    if (produtosSelecionados.length === 0) {
      toast.error('Adicione pelo menos um produto ao pedido')
      return false
    }

    produtosSelecionados.forEach((item, index) => {
      if (!item.produtoId) {
        erros[index] = 'Selecione um produto'
      } else if (item.quantidade < 1) {
        erros[index] = 'Quantidade deve ser maior que zero'
      }
    })

    setProdutoErros(erros)
    return erros.length === 0
  }

  async function onSubmit(data: PedidoFormData) {
    if (!validarProdutos()) {
      return
    }

    startTransition(async () => {
      const result = await criarPedido(data.nomeCliente, data.endereco, data.telefone, produtosSelecionados)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pedido criado com sucesso!')
        reset()
        setProdutosSelecionados([])
        setProdutoErros([])
        setOpen(false)
      }
    })
  }

  const calcularTotal = () => {
    return produtosSelecionados.reduce((total, item) => {
      const produto = produtos.find((p) => p.id === item.produtoId)
      return total + (produto?.preco || 0) * item.quantidade
    }, 0)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Novo Pedido</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
          <DialogDescription>
            Crie um novo pedido com os dados do cliente e produtos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCliente">Nome do Cliente</Label>
              <Input
                id="nomeCliente"
                placeholder="Ex: João Silva"
                disabled={isPending}
                aria-invalid={!!errors.nomeCliente}
                {...register('nomeCliente')}
              />
              {errors.nomeCliente && (
                <p className="text-sm text-red-500">{errors.nomeCliente.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Ex: Rua das Flores, 123"
                disabled={isPending}
                aria-invalid={!!errors.endereco}
                {...register('endereco')}
              />
              {errors.endereco && (
                <p className="text-sm text-red-500">{errors.endereco.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                maxLength={15}
                disabled={isPending}
                aria-invalid={!!errors.telefone}
                {...register('telefone', {
                  onChange: (e) => {
                    const formatted = formatarTelefone(e.target.value)
                    setValue('telefone', formatted)
                  }
                })}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500">{errors.telefone.message}</p>
              )}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label>Produtos do Pedido</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarProduto}
                  disabled={isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Produto
                </Button>
              </div>

              {produtosSelecionados.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum produto adicionado
                </p>
              ) : (
                <div className="space-y-2">
                  {produtosSelecionados.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label className="text-xs">Produto</Label>
                        <select
                          value={item.produtoId}
                          onChange={(e) => atualizarProduto(index, 'produtoId', e.target.value)}
                          disabled={isPending}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">Selecione</option>
                          {produtos.map((produto) => (
                            <option key={produto.id} value={produto.id}>
                              {produto.nome} - R$ {produto.preco.toFixed(2)}
                            </option>
                          ))}
                        </select>
                        {produtoErros[index] && (
                          <p className="text-xs text-red-500 mt-1">{produtoErros[index]}</p>
                        )}
                      </div>
                      <div className="w-24">
                        <Label className="text-xs">Qtd</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) => atualizarProduto(index, 'quantidade', e.target.value)}
                          disabled={isPending}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removerProduto(index)}
                        disabled={isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {produtosSelecionados.length > 0 && (
                <div className="flex justify-between items-center pt-2 border-t font-semibold">
                  <span>Total do Pedido:</span>
                  <span className="text-lg text-primary">R$ {calcularTotal().toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setProdutosSelecionados([])
                setProdutoErros([])
                setOpen(false)
              }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || produtosSelecionados.length === 0}>
              {isPending ? 'Criando...' : 'Criar Pedido'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
