'use client'

import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  produto: {
    id: string
    nome: string
    preco: number
    foto: string | null
  }
}

export default function AddToCartButton({ produto }: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      foto: produto.foto,
    })
    toast.success(`${produto.nome} adicionado ao carrinho!`, {
      description: 'Veja seu carrinho no canto superior direito'
    })
  }

  return (
    <Button 
      className="w-full h-14 text-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white"
      size="lg"
      onClick={handleAddToCart}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Adicionar ao Carrinho
    </Button>
  )
}
