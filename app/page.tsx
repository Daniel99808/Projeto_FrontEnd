import Banner from '@/components/banner'
import CategoriesGrid from '@/components/categories-grid'
import FeaturedProducts from '@/components/featured-products'
import Footer from '@/components/footer'
import prisma from '@/lib/prisma-client'

export default async function Home() {
  const categorias = await prisma.categorias.findMany({
    orderBy: {
      nome: 'asc'
    }
  })

  const produtosDestaque = await prisma.produtos.findMany({
    take: 6,
    orderBy: {
      criadoEm: 'desc'
    },
    include: {
      categoria: true
    }
  })

  return (
    <div className="min-h-screen bg-white">
      <Banner />
      <CategoriesGrid categorias={categorias} />
      <FeaturedProducts produtos={produtosDestaque} />
      <Footer />
    </div>
  )
}
