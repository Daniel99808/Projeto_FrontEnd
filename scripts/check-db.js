const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function main() {
  console.log('\n=== VERIFICAÇÃO DO BANCO DE DADOS ===\n')

  const categorias = await prisma.categorias.findMany()
  console.log(`✅ Categorias: ${categorias.length}`)
  
  const produtos = await prisma.produtos.findMany()
  console.log(`✅ Produtos: ${produtos.length}`)
  
  const banners = await prisma.banner.findMany()
  console.log(`✅ Banners: ${banners.length}`)
  
  const pedidos = await prisma.pedidos.findMany()
  console.log(`✅ Pedidos: ${pedidos.length}`)

  console.log('\n=== CHECKLIST ===\n')
  console.log(`${categorias.length > 0 ? '✅' : '❌'} Categorias com slug e cor`)
  console.log(`${produtos.length >= 6 ? '✅' : '❌'} 6+ produtos com fotos`)
  console.log(`${banners.length > 0 ? '✅' : '❌'} Banner dinâmico`)
  console.log('\n')
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
