import Image from 'next/image'

export default function Banner() {
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
      {/* Overlay escuro para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black/20"></div>
    </div>
  )
}
