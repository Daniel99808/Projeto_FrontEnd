import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma-client'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoria = await prisma.categorias.findFirst({
    where: {
      slug: slug
    },
    include: {
      produtos: true
    }
  })

  if (!categoria) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
              style={{ backgroundColor: categoria.cor }}
            >
              {categoria.nome.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{categoria.nome}</h1>
          </div>
        </div>

        {categoria.produtos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto disponível nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoria.produtos.map((produto) => (
              <Link
                key={produto.id}
                href={`/produto/${produto.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative w-full h-48 bg-gray-100">
                  {produto.foto ? (
                    <Image
                      src={produto.foto}
                      alt={produto.nome}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🍕</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
                    {produto.nome}
                  </h3>
                  {produto.descricao && (
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                      {produto.descricao}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-orange-600">
                    R$ {produto.preco.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  const categorias = await prisma.categorias.findMany({
    select: {
      slug: true
    }
  })

  return categorias.map((categoria) => ({
    slug: categoria.slug
  }))
}
