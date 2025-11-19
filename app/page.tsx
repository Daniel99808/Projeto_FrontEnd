import Banner from '@/components/banner'
import CategoriesGrid from '@/components/categories-grid'
import prisma from '@/lib/prisma-client'

export default async function Home() {
  const categorias = await prisma.categorias.findMany({
    orderBy: {
      nome: 'asc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-6 space-y-8">
        <Banner />
        <CategoriesGrid categorias={categorias} />
      </main>
    </div>
  )
}
