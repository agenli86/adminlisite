import { createServerSupabaseClient } from '@/lib/supabase'
import { Metadata } from 'next'
import ContactForm from './ContactForm'

// Cache'i devre dışı bırak
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'İletişim | Adana Asansör Kiralama',
  description: 'Adana asansör kiralama hizmetleri için bizimle iletişime geçin. Ücretsiz keşif ve teklif alın.',
}

async function getData() {
  const supabase = createServerSupabaseClient()
  const [settingsRes, servicesRes, heroRes] = await Promise.all([
    supabase.from('site_settings').select('*').single(),
    supabase.from('services').select('id, title').eq('is_active', true).order('sort_order'),
    supabase.from('page_settings').select('*').eq('page_key', 'iletisim').single()
  ])
  return { 
    settings: settingsRes.data,
    services: servicesRes.data || [],
    hero: heroRes.data
  }
}

export default async function IletisimPage() {
  const { settings, services, hero } = await getData()

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20 overflow-hidden">
        {/* Arka plan resmi */}
        {hero?.hero_image && (
          <div className="absolute inset-0">
            <img 
              src={hero.hero_image} 
              alt={hero.hero_title || 'İletişim'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/80 to-primary-900/70"></div>
          </div>
        )}
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{hero?.hero_title || 'İletişim'}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {hero?.hero_subtitle || 'Size en kısa sürede ulaşacağız. Hemen mesaj bırakın veya bizi arayın.'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-primary-800 mb-6">İletişim Bilgileri</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Telefon</h3>
                      <a href={`tel:+${settings?.phone_raw}`} className="text-primary-600 hover:text-primary-700">{settings?.phone}</a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">WhatsApp</h3>
                      <a href={`https://wa.me/${settings?.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">Mesaj Gönder</a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Adres</h3>
                      <p className="text-gray-600">{settings?.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Çalışma Saatleri</h3>
                      <p className="text-gray-600">{settings?.working_hours}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <a
                    href={`tel:+${settings?.phone_raw}`}
                    className="block w-full bg-secondary-400 text-primary-900 py-4 rounded-xl font-bold text-center hover:bg-secondary-500 transition-colors"
                  >
                    Hemen Ara
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-primary-800 mb-2">Bize Ulaşın</h2>
                <p className="text-gray-600 mb-8">Formu doldurun, en kısa sürede size dönüş yapalım.</p>
                <ContactForm services={services} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-96 bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101086.02046755668!2d35.2433!3d37.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1528916c0d51a76f%3A0x1348f1d8fb41d5db!2sAdana%2C%20Turkey!5e0!3m2!1sen!2s!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  )
}
