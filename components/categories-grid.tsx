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
    <div className="py-12">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Categorias</h2>
        
        {categorias.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma categoria disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group flex flex-col items-center p-6 rounded-xl transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ backgroundColor: `${categoria.cor}15` }}
              >
                <div
                  className="w-16 h-16 rounded-full mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-md"
                  style={{ backgroundColor: categoria.cor }}
                >
                  {categoria.nome.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm md:text-base font-semibold text-center text-gray-800 group-hover:text-gray-900">
                  {categoria.nome}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
