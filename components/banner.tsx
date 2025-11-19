import Image from 'next/image'

export default function Banner() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg shadow-lg">
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
