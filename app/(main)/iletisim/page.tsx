import { siteConfig } from '@/lib/site-data'
import ContactForm from './ContactForm'

export default function IletisimPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">İletişim</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3 text-gray-700">
          <p><strong>Telefon:</strong> {siteConfig.phoneDisplay}</p>
          <p><strong>E-posta:</strong> {siteConfig.email}</p>
          <p><strong>Adres:</strong> {siteConfig.address}</p>
          <p><strong>Çalışma:</strong> {siteConfig.workingHours}</p>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
