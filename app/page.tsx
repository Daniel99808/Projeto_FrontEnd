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
    <div className="min-h-screen bg-white">
      <Banner />
      <CategoriesGrid categorias={categorias} />
    </div>
  )
}
