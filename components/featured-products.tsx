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
    <section className="bg-gray-50 px-4 pb-16 pt-10 md:pb-20 md:pt-14">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center md:mb-10 md:flex-row md:text-left">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-500/90">
              Recomendados para você
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
              Produtos em destaque
            </h2>
            <p className="mt-2 max-w-xl text-sm text-gray-600 md:text-base">
              Uma seleção especial com os itens mais pedidos pelos clientes. Experimente e descubra seus novos favoritos.
            </p>
          </div>
          <div className="hidden text-sm font-medium text-gray-600 md:block">
            Atualizado em tempo real com o painel administrativo.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {produtos.map((produto) => (
            <Link
              key={produto.id}
              href={`/produto/${produto.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-2 hover:border-orange-500/70 hover:shadow-[0_20px_45px_rgba(234,88,12,0.35)]"
            >
              <div className="relative h-52 w-full overflow-hidden bg-gray-100 md:h-56">
                {produto.foto ? (
                  <Image
                    src={produto.foto}
                    alt={produto.nome}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl">
                    🍕
                  </div>
                )}
                <div className="absolute right-3 top-3">
                  <span 
                    className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-orange-900/30"
                    style={{ backgroundColor: produto.categoria.cor }}
                  >
                    {produto.categoria.nome}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="mb-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-orange-600 md:text-xl">
                  {produto.nome}
                </h3>
                {produto.descricao && (
                  <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                    {produto.descricao}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      A partir de
                    </span>
                    <span className="text-2xl font-extrabold text-orange-600 md:text-3xl">
                      R$ {produto.preco.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white shadow-md shadow-orange-900/25 transition group-hover:bg-orange-700 md:h-11 md:w-11">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center md:mt-12">
          <Link
            href="/categoria/pizza"
            className="inline-block rounded-full bg-orange-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:bg-orange-700 hover:shadow-xl md:px-10 md:py-3.5"
          >
            Ver Todos os Produtos
          </Link>
        </div>
      </div>
    </section>
  )
}
