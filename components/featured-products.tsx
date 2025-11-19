import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'

interface Produto {
  id: string
  nome: string
  descricao: string | null
  preco: number
  foto: string | null
  categoria: {
    nome: string
    slug: string
    cor: string
  }
}

interface FeaturedProductsProps {
  produtos: Produto[]
}

export default function FeaturedProducts({ produtos }: FeaturedProductsProps) {
  if (produtos.length === 0) return null

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Produtos em Destaque
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Os favoritos dos nossos clientes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {produtos.map((produto) => (
            <Link
              key={produto.id}
              href={`/produto/${produto.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                {produto.foto ? (
                  <Image
                    src={produto.foto}
                    alt={produto.nome}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🍕
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
                    style={{ backgroundColor: produto.categoria.cor }}
                  >
                    {produto.categoria.nome}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {produto.nome}
                </h3>
                {produto.descricao && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {produto.descricao}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-orange-600">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white group-hover:bg-orange-700 transition-colors shadow-md">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/categoria/pizza"
            className="inline-block px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full transition-colors shadow-lg hover:shadow-xl"
          >
            Ver Todos os Produtos
          </Link>
        </div>
      </div>
    </section>
  )
}
