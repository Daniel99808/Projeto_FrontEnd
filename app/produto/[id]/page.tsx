import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma-client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const produto = await prisma.produtos.findUnique({
    where: {
      id: id
    },
    include: {
      categoria: true
    }
  })

  if (!produto) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb/Back button */}
        <Link 
          href={`/categoria/${produto.categoria.slug}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para {produto.categoria.nome}
        </Link>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image */}
            <div className="relative w-full h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
              {produto.foto ? (
                <Image
                  src={produto.foto}
                  alt={produto.nome}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-8xl">🍕</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category Badge */}
                <Link 
                  href={`/categoria/${produto.categoria.slug}`}
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 hover:opacity-80 transition-opacity"
                  style={{ 
                    backgroundColor: `${produto.categoria.cor}20`,
                    color: produto.categoria.cor
                  }}
                >
                  {produto.categoria.nome}
                </Link>

                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {produto.nome}
                </h1>

                {/* Product Description */}
                {produto.descricao && (
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {produto.descricao}
                  </p>
                )}

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-orange-600">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-3">
                <Button 
                  className="w-full h-14 text-lg font-semibold bg-orange-600 hover:bg-orange-700 text-white"
                  size="lg"
                >
                  Adicionar ao Carrinho
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Entrega rápida e segura
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <span className="font-medium">Categoria:</span> {produto.categoria.nome}
            </div>
            <div>
              <span className="font-medium">Código:</span> {produto.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  const produtos = await prisma.produtos.findMany({
    select: {
      id: true
    }
  })

  return produtos.map((produto) => ({
    id: produto.id
  }))
}
