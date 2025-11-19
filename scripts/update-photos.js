const { PrismaClient } = require('../generated/prisma')

const prisma = new PrismaClient()

async function updateProductPhotos() {
  try {
    // Mapear nomes de produtos para fotos
    const photoMap = {
      'Pizza de Calabresa': '/pizzadecalabresa.png',
      'Pizza de Frango': '/pizzadefrango.png',
      'Pizza de Queijo': '/pizzadequeijo.png',
    }

    console.log('🔄 Atualizando fotos dos produtos...\n')

    for (const [nome, foto] of Object.entries(photoMap)) {
      const result = await prisma.produtos.updateMany({
        where: {
          nome: {
            contains: nome
          }
        },
        data: {
          foto: foto
        }
      })

      if (result.count > 0) {
        console.log(`✅ ${result.count} produto(s) "${nome}" atualizado(s) com foto: ${foto}`)
      } else {
        console.log(`⚠️  Nenhum produto encontrado com nome similar a "${nome}"`)
      }
    }

    console.log('\n✨ Atualização concluída!')
  } catch (error) {
    console.error('❌ Erro ao atualizar fotos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductPhotos()
