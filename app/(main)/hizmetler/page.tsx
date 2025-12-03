import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import { Metadata } from 'next'

// Cache'i devre dışı bırak
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Hizmetlerimiz | Adana Asansör Kiralama',
  description: 'Adana\'da profesyonel asansör kiralama, insan asansörü, yük asansörü, cephe asansörü ve platform kiralama hizmetleri.',
}

async function getData() {
  const supabase = createServerSupabaseClient()
  const [servicesRes, heroRes] = await Promise.all([
    supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('page_settings').select('*').eq('page_key', 'hizmetler').single()
  ])
  return { 
    services: servicesRes.data || [],
    hero: heroRes.data
  }
}

export default async function HizmetlerPage() {
  const { services, hero } = await getData()

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20 overflow-hidden">
        {/* Arka plan resmi */}
        {hero?.hero_image && (
          <div className="absolute inset-0">
            <img 
              src={hero.hero_image} 
              alt={hero.hero_title || 'Hizmetlerimiz'}
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
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{hero?.hero_title || 'Hizmetlerimiz'}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {hero?.hero_subtitle || 'Adana ve çevresinde profesyonel asansör kiralama hizmetleri sunuyoruz'}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {services.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Henüz hizmet eklenmemiş.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="aspect-video bg-primary-100 relative overflow-hidden">
                    {service.image_url ? (
                      <img src={service.image_url} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                    {service.is_featured && (
                      <span className="absolute top-3 right-3 bg-secondary-400 text-primary-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Öne Çıkan
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-primary-800 mb-3 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">{service.short_description}</p>
                    <Link 
                      href={`/hizmetler/${service.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Detaylı Bilgi
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Hangi Hizmete İhtiyacınız Var?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Size en uygun asansör çözümünü bulmak için hemen bizi arayın. Ücretsiz keşif ve fiyat teklifi alın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+905374092406" className="bg-secondary-400 text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-secondary-500 transition-all inline-flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hemen Ara
            </a>
            <Link href="/iletisim" className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
              Teklif Al
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
