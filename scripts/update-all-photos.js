const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function updateAllPhotos() {
  try {
    console.log('🔄 Atualizando fotos dos produtos...\n')

    // Mapear nomes de produtos para fotos
    const updates = [
      { nome: 'Pizza de calabresa', foto: '/pizzadecalabresa.png' },
      { nome: 'Pizza de frango', foto: '/pizzadefrango.png' },
      { nome: 'Pizza de mussarela', foto: '/pizzademussarela.png' },
      { nome: 'X-Bacon', foto: '/xbacon.png' },
      { nome: 'X-Tudo', foto: '/xtudo.png' },
      { nome: 'X-Frango', foto: '/xfrango.png' },
    ]

    for (const { nome, foto } of updates) {
      const result = await prisma.produtos.updateMany({
        where: {
          nome: {
            contains: nome
          }
        },
        data: { foto }
      })

      if (result.count > 0) {
        console.log(`✅ ${result.count}x "${nome}" → ${foto}`)
      } else {
        console.log(`⚠️  Nenhum produto encontrado: "${nome}"`)
      }
    }

    // Listar todos os produtos atualizados
    console.log('\n📦 Lista completa de produtos:\n')
    const produtos = await prisma.produtos.findMany({
      select: { nome: true, foto: true }
    })
    
    produtos.forEach(p => {
      console.log(`   ${p.nome} → ${p.foto || '(sem foto)'}`)
    })

    console.log('\n✨ Atualização concluída!')
  } catch (error) {
    console.error('❌ Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAllPhotos()
