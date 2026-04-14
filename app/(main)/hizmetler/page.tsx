import Link from 'next/link'
import { services } from '@/lib/site-data'

export default function HizmetlerPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">Hizmetler</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.slug} className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-3">{service.title}</h2>
            <p className="text-gray-600 mb-4">{service.short}</p>
            <Link href={`/hizmetler/${service.slug}`} className="text-primary-700 font-semibold">Detaylı Bilgi</Link>
          </div>
        ))}
      </div>
    </section>
  )
}
