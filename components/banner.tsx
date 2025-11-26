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
    return (
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700">
        <div className="absolute inset-0">
          <Image
            src="/banner.png"
            alt="Banner do Delivery"
            fill
            className="object-cover opacity-70 mix-blend-multiply"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.2),_transparent_60%),_linear-gradient(to_bottom,_rgba(15,23,42,0.65),_rgba(15,23,42,0.9))]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center text-white md:min-h-[520px] lg:min-h-[580px]">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-orange-100/90">
            Entrega rápida · Comida quentinha
          </p>
          <h1 className="mb-4 max-w-3xl text-balance text-4xl font-extrabold drop-shadow-sm md:text-5xl lg:text-6xl">
            Peça seus favoritos sem sair de casa
          </h1>
          <p className="mb-8 max-w-2xl text-sm text-orange-50/90 md:text-base">
            Escolha sua categoria, monte o pedido em poucos cliques e acompanhe tudo em tempo real.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#categorias"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-orange-600 shadow-lg shadow-orange-900/20 transition hover:bg-orange-50 hover:shadow-xl"
            >
              Ver cardápio
            </Link>
            <span className="rounded-full bg-black/20 px-4 py-2 text-xs font-medium text-orange-100">
              Entregas hoje em toda a cidade
            </span>
          </div>
        </div>
      </section>
    )
  }

  const content = (
    <section className="relative w-full overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Image
          src={banner.imageUrl}
          alt={banner.titulo}
          fill
          className="object-cover opacity-80"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[420px] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center text-white md:min-h-[520px] lg:min-h-[580px]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-orange-200/90">
          Delivery em poucos cliques
        </p>
        <h1 className="mb-4 max-w-3xl text-balance text-4xl font-extrabold drop-shadow-sm md:text-5xl lg:text-6xl">
          {banner.titulo}
        </h1>
        {banner.subtitulo && (
          <p className="mb-8 max-w-2xl text-sm text-gray-100/90 md:text-base">
            {banner.subtitulo}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#categorias"
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition hover:bg-orange-600 hover:shadow-xl"
          >
            Ver cardápio
          </Link>
          <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-gray-100">
            Frete grátis em pedidos selecionados
          </span>
        </div>
      </div>
    </section>
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
