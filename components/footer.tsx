import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Sobre */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Nosso Delivery</h3>
            <p className="mb-4 text-sm text-gray-400">
              Oferecemos os melhores produtos com entrega rápida e qualidade garantida.
            </p>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Categorias</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/categoria/pizza" className="hover:text-orange-500 transition-colors">
                  Pizzas
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Ver Todas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Contato</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500" />
                <span>(00) 0000-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>contato@delivery.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>Sua cidade, Estado</span>
              </li>
            </ul>
          </div>

          {/* Horário */}
          <div>
            <h3 className="mb-4 text-xl font-bold text-white">Horário</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="font-semibold text-white">Seg - Sex</p>
                  <p>11:00 - 23:00</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="font-semibold text-white">Sáb - Dom</p>
                  <p>11:00 - 00:00</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500 md:text-sm">
          <p>&copy; 2025 Delivery. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
