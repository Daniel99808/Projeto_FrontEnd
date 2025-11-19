import Image from 'next/image'

export default function Banner() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <Image
        src="/banner.png"
        alt="Banner do Delivery"
        fill
        className="object-cover"
        priority
      />
    </div>
  )
}
