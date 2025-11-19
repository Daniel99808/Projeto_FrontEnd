import Image from 'next/image'

export default function Banner() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg shadow-lg">
      <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-red-500">
        <div className="container mx-auto h-full flex flex-col justify-center items-start px-8 md:px-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Bem-vindo ao Nosso Delivery
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 max-w-2xl">
            Peça agora e receba na sua casa com rapidez e qualidade!
          </p>
          <button className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold text-lg hover:bg-orange-50 transition-colors shadow-md">
            Ver Cardápio
          </button>
        </div>
      </div>
    </div>
  )
}
