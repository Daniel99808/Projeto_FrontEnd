import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // Criar banner de exemplo
  await prisma.banner.create({
    data: {
      titulo: 'Bem-vindo ao Delivery',
      subtitulo: 'As melhores pizzas e hambúrgueres da cidade',
      imageUrl: '/banner.png',
      ativo: true,
      ordem: 0
    }
  })

  console.log('✅ Banner de exemplo criado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
