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
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nosso Cardápio
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha sua categoria favorita e descubra nossos deliciosos produtos
          </p>
        </div>
        
        {categorias.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg">Em breve novas categorias!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center h-full">
                  <div
                    className="w-20 h-20 rounded-full mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
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
