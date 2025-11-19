const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function updateMussarela() {
  try {
    const result = await prisma.produtos.updateMany({
      where: {
        nome: {
          contains: 'mussarela'
        }
      },
      data: {
        foto: '/pizzadequeijo.png'
      }
    })

    console.log(`✅ ${result.count} produto(s) de mussarela atualizado(s) com foto: /pizzadequeijo.png`)
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateMussarela()
