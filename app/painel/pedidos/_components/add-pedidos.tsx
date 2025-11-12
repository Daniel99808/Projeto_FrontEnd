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

interface AddPedidosProps {
  produtos: Array<{ id: string; nome: string; preco: number }>
}

interface ProdutoSelecionado {
  produtoId: string
  quantidade: number
}

export default function AddPedidos({ produtos }: AddPedidosProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([])

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
  }

  async function handleSubmit(formData: FormData) {
    const nomeCliente = formData.get('nomeCliente') as string
    const endereco = formData.get('endereco') as string
    const telefone = formData.get('telefone') as string

    startTransition(async () => {
      const result = await criarPedido(nomeCliente, endereco, telefone, produtosSelecionados)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Pedido criado com sucesso!')
        setOpen(false)
        setProdutosSelecionados([])
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
        <form action={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCliente">Nome do Cliente</Label>
              <Input
                id="nomeCliente"
                name="nomeCliente"
                placeholder="Ex: João Silva"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                name="endereco"
                placeholder="Ex: Rua das Flores, 123"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                name="telefone"
                placeholder="Ex: (11) 99999-9999"
                required
                disabled={isPending}
              />
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
                          required
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
                      </div>
                      <div className="w-24">
                        <Label className="text-xs">Qtd</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={(e) => atualizarProduto(index, 'quantidade', e.target.value)}
                          required
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
                setOpen(false)
                setProdutosSelecionados([])
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
