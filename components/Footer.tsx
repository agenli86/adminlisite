import Link from 'next/link'
import { menuItems, siteConfig, services } from '@/lib/site-data'

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white mt-10">
      <div className="container mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-xl mb-3">{siteConfig.name}</h3>
          <p className="text-gray-300">{siteConfig.slogan}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Hızlı Menü</h4>
          <ul className="space-y-1 text-gray-300">
            {menuItems.map((item) => (
              <li key={item.href}><Link href={item.href}>{item.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Hizmetler</h4>
          <ul className="space-y-1 text-gray-300">
            {services.map((service) => (
              <li key={service.slug}><Link href={`/hizmetler/${service.slug}`}>{service.title}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
