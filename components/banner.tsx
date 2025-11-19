import Image from 'next/image'
import prisma from '@/lib/prisma-client'
import Link from 'next/link'

export default async function Banner() {
  const banners = await prisma.banner.findMany({
    where: {
      ativo: true
    },
    orderBy: {
      ordem: 'asc'
    },
    take: 1
  })

  const banner = banners[0]

  if (!banner) {
    // Fallback para banner padrão se não houver nenhum no banco
    return (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        <Image
          src="/banner.png"
          alt="Banner do Delivery"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    )
  }

  const content = (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden group">
      <Image
        src={banner.imageUrl}
        alt={banner.titulo}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority
        unoptimized
      />
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Texto do banner */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-4 drop-shadow-lg">
          {banner.titulo}
        </h1>
        {banner.subtitulo && (
          <p className="text-xl md:text-2xl lg:text-3xl text-center drop-shadow-lg">
            {banner.subtitulo}
          </p>
        )}
      </div>
    </div>
  )

  if (banner.link) {
    return (
      <Link href={banner.link}>
        {content}
      </Link>
    )
  }

  return content
}
