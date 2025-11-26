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
    <section id="categorias" className="bg-white px-4 py-14 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-500/90">
            Cardápio
          </p>
          <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
            Escolha por categoria
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-600 md:text-base">
            Selecione uma categoria para ver todos os produtos disponíveis. É rápido, simples e delicioso.
          </p>
        </div>
        
        {categorias.length === 0 ? (
          <div className="rounded-3xl bg-gray-50 py-14 text-center">
            <div className="mb-4 text-6xl">🍽️</div>
            <p className="text-base text-gray-500 md:text-lg">Em breve novas categorias!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 md:gap-5">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                href={`/categoria/${categoria.slug}`}
                className="group"
              >
                <div className="flex h-full flex-col items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-5 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-orange-400/80 hover:shadow-[0_16px_40px_rgba(234,88,12,0.35)]">
                  <div
                    className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg shadow-orange-900/25 transition group-hover:scale-110 md:h-20 md:w-20 md:text-3xl"
                    style={{ backgroundColor: categoria.cor }}
                  >
                    {categoria.nome.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 transition-colors group-hover:text-orange-600 md:text-base">
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
