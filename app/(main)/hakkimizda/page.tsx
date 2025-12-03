import { createServerSupabaseClient } from '@/lib/supabase'
import { Metadata } from 'next'
import Link from 'next/link'

// Cache'i devre dışı bırak
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from('about_page').select('meta_title, meta_description, og_image').single()
  return {
    title: data?.meta_title || 'Hakkımızda | Adana Asansör Kiralama',
    description: data?.meta_description,
    openGraph: { images: data?.og_image ? [data.og_image] : [] },
  }
}

async function getData() {
  const supabase = createServerSupabaseClient()
  const [aboutRes, testimonialsRes] = await Promise.all([
    supabase.from('about_page').select('*').single(),
    supabase.from('testimonials').select('*').eq('is_active', true).eq('is_featured', true).limit(3),
  ])
  return { about: aboutRes.data, testimonials: testimonialsRes.data || [] }
}

export default async function HakkimizdaPage() {
  const { about, testimonials } = await getData()

  // Default değerler
  const stats = about?.stats || [
    { number: '500+', label: 'Tamamlanan Proje' },
    { number: '15+', label: 'Yıllık Deneyim' },
    { number: '50+', label: 'Aktif Ekipman' },
    { number: '%100', label: 'Müşteri Memnuniyeti' },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{about?.hero_title || 'Hakkımızda'}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">{about?.hero_description}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-800 mb-6">{about?.main_title}</h2>
            <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: about?.main_content || '' }} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat: { number: string; label: string }, idx: number) => (
              <div key={idx} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      {(about?.mission_title || about?.vision_title) && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {about?.mission_title && (
                <div className="bg-primary-50 rounded-2xl p-8">
                  <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-800 mb-4">{about.mission_title}</h3>
                  <p className="text-gray-700">{about.mission_content}</p>
                </div>
              )}
              {about?.vision_title && (
                <div className="bg-secondary-50 rounded-2xl p-8">
                  <div className="w-16 h-16 bg-secondary-400 rounded-xl flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-primary-800 mb-4">{about.vision_title}</h3>
                  <p className="text-gray-700">{about.vision_content}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-primary-800 mb-12">Müşterilerimiz Ne Diyor?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{t.comment}"</p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-primary-800">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bizimle Çalışmak İster misiniz?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Profesyonel ekibimiz sizin için hazır. Hemen iletişime geçin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+905374092406" className="bg-secondary-400 text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-secondary-500 transition-all inline-flex items-center justify-center gap-2">
              Hemen Ara
            </a>
            <Link href="/iletisim" className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
              İletişim Formu
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
