import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('\n=== VERIFICAÇÃO DO BANCO DE DADOS ===\n')

  // Verificar categorias
  const categorias = await prisma.categorias.findMany()
  console.log(`✅ Categorias: ${categorias.length} cadastradas`)
  categorias.forEach(cat => {
    console.log(`   - ${cat.nome} (${cat.slug}) - Cor: ${cat.cor}`)
  })

  // Verificar produtos
  const produtos = await prisma.produtos.findMany({
    include: { categoria: true }
  })
  console.log(`\n✅ Produtos: ${produtos.length} cadastrados`)
  produtos.forEach(prod => {
    console.log(`   - ${prod.nome} (${prod.categoria.nome}) - R$ ${prod.preco.toFixed(2)}`)
    console.log(`     Foto: ${prod.foto || 'Sem foto'}`)
  })

  // Verificar banners
  const banners = await prisma.banner.findMany()
  console.log(`\n✅ Banners: ${banners.length} cadastrados`)
  banners.forEach(banner => {
    console.log(`   - ${banner.titulo} - ${banner.ativo ? 'ATIVO' : 'INATIVO'}`)
  })

  // Verificar pedidos
  const pedidos = await prisma.pedidos.findMany({
    include: { items: true }
  })
  console.log(`\n✅ Pedidos: ${pedidos.length} realizados`)

  console.log('\n=== CHECKLIST DE REQUISITOS ===\n')
  
  console.log(`${categorias.length > 0 ? '✅' : '❌'} Categorias cadastradas`)
  console.log(`${categorias.every(c => c.slug) ? '✅' : '❌'} Todas categorias têm slug`)
  console.log(`${categorias.every(c => c.cor) ? '✅' : '❌'} Todas categorias têm cor`)
  console.log(`${produtos.length >= 6 ? '✅' : '❌'} Pelo menos 6 produtos cadastrados`)
  console.log(`${produtos.filter(p => p.foto).length > 0 ? '✅' : '❌'} Produtos com fotos`)
  console.log(`${banners.length > 0 ? '✅' : '❌'} Banner dinâmico configurado`)
  console.log(`${banners.filter(b => b.ativo).length > 0 ? '✅' : '❌'} Banner ativo`)

  console.log('\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
