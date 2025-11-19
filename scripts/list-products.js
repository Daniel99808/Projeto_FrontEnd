const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function listProducts() {
  try {
    const produtos = await prisma.produtos.findMany({
      select: {
        id: true,
        nome: true,
        foto: true
      }
    })

    console.log('📦 Produtos no banco de dados:\n')
    produtos.forEach(p => {
      console.log(`ID: ${p.id}`)
      console.log(`Nome: ${p.nome}`)
      console.log(`Foto: ${p.foto || '(sem foto)'}`)
      console.log('---')
    })
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listProducts()
