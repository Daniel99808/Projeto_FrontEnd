import Link from 'next/link'

interface Categoria {
  id: string
  nome: string
  slug: string
  cor: string
}

interface CategoriesGridProps {
  categorias: Categoria[]
}

export default function CategoriesGrid({ categorias }: CategoriesGridProps) {
  return (
    <section className="py-16 px-4 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Nossas Categorias
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra uma variedade incrível de produtos para todos os gostos
          </p>
        </div>
        
        {categorias.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg">Nenhuma categoria disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center h-full">
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-4 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: categoria.cor }}
                  >
                    {categoria.nome.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                    {categoria.nome}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
