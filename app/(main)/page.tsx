import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import TabSectionClient from '@/components/TabSectionClient'

// Sayfayı dinamik yap - cache'leme
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Dinamik metadata
export async function generateMetadata(): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data: settings } = await supabase.from('site_settings').select('*').single()
  
  return {
    title: settings?.meta_title || 'Adana Asansör Kiralama',
    description: settings?.meta_description,
    keywords: settings?.meta_keywords,
    openGraph: {
      title: settings?.meta_title,
      description: settings?.meta_description,
      url: settings?.canonical_url,
      images: settings?.og_image ? [settings.og_image] : [],
    },
    alternates: {
      canonical: settings?.canonical_url,
    },
  }
}

async function getData() {
  const supabase = createServerSupabaseClient()
  const [settingsRes, slidersRes, sectionsRes, tabsRes, tabTestimonialsRes, testimonialsRes, servicesRes, blogsRes, ctaRes] = await Promise.all([
    supabase.from('site_settings').select('*').single(),
    supabase.from('sliders').select('*').eq('is_active', true).order('sort_order').limit(5),
    supabase.from('homepage_sections').select('*'),
    supabase.from('tabs').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('tab_testimonials').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').eq('is_active', true).eq('is_featured', true).order('sort_order').limit(3),
    supabase.from('services').select('*').eq('is_active', true).eq('is_featured', true).order('sort_order').limit(3),
    supabase.from('blogs').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(3),
    supabase.from('cta_sections').select('*').eq('section_key', 'homepage_cta').single(),
  ])

  return {
    settings: settingsRes.data,
    sliders: slidersRes.data || [],
    sections: sectionsRes.data || [],
    tabs: tabsRes.data || [],
    tabTestimonials: tabTestimonialsRes.data || [],
    testimonials: testimonialsRes.data || [],
    services: servicesRes.data || [],
    blogs: blogsRes.data || [],
    cta: ctaRes.data,
  }
}

export default async function HomePage() {
  const { settings, sliders, sections, tabs, tabTestimonials, testimonials, services, blogs, cta } = await getData()

  const mainArticle = sections.find(s => s.section_key === 'main_article')
  const servicesSection = sections.find(s => s.section_key === 'services_section')
  const testimonialsSection = sections.find(s => s.section_key === 'testimonials_section')
  const blogSection = sections.find(s => s.section_key === 'blog_section')

  return (
    <>
      {/* Hero/Slider */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-900 text-white overflow-hidden">
        {sliders[0] && (
          <div className="relative min-h-[500px] lg:min-h-[600px]">
            {/* Arka plan resmi */}
            {sliders[0].image_url && (
              <div className="absolute inset-0">
                <img 
                  src={sliders[0].image_url} 
                  alt={sliders[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/70 to-primary-900/50"></div>
              </div>
            )}
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
                <rect width="100" height="100" fill="url(#grid)"/>
              </svg>
            </div>
            
            {/* İçerik */}
            <div className="container mx-auto px-4 relative z-10 py-20 lg:py-32">
              <div className="max-w-4xl">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">{sliders[0].title}</h1>
                {sliders[0].subtitle && <p className="text-xl lg:text-2xl text-secondary-400 mb-4">{sliders[0].subtitle}</p>}
                {sliders[0].description && <p className="text-lg text-gray-300 mb-8 max-w-2xl">{sliders[0].description}</p>}
                <div className="flex flex-col sm:flex-row gap-4">
                  {sliders[0].button1_text && (
                    <a href={sliders[0].button1_url || '#'} className="bg-secondary-400 text-primary-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-secondary-500 transition-all hover:scale-105 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {sliders[0].button1_text}
                    </a>
                  )}
                  {sliders[0].button2_text && (
                    <a href={sliders[0].button2_url || '#'} className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-all hover:scale-105 flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                      {sliders[0].button2_text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Slider yoksa varsayılan hero */}
        {!sliders[0] && (
          <div className="container mx-auto px-4 relative z-10 py-20 lg:py-32">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs><pattern id="grid2" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
                <rect width="100" height="100" fill="url(#grid2)"/>
              </svg>
            </div>
            <div className="max-w-4xl mx-auto text-center relative">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">Adana Asansör Kiralama</h1>
              <p className="text-xl lg:text-2xl text-secondary-400 mb-4">7/24 Hizmetinizdeyiz</p>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">Profesyonel asansör kiralama hizmeti ile taşınma işlerinizi kolaylaştırıyoruz.</p>
            </div>
          </div>
        )}
      </section>

      {/* Ana Makale */}
      {mainArticle && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl lg:text-4xl font-bold text-primary-800 mb-6">{mainArticle.title}</h1>
              <div className="prose prose-lg max-w-none text-gray-700 mx-auto text-center" dangerouslySetInnerHTML={{ __html: mainArticle.content || '' }} />
            </div>
          </div>
        </section>
      )}

      {/* Tab Bölümü */}
      {tabs.length > 0 && <TabSection tabs={tabs} tabTestimonials={tabTestimonials} />}

      {/* Müşteri Yorumları */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">{testimonialsSection?.title || 'Müşteri Yorumları'}</h2>
              {testimonialsSection?.subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{testimonialsSection.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-2xl shadow-lg">
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{t.comment}"</p>
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

      {/* Öne Çıkan Hizmetler */}
      {services.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">{servicesSection?.title || 'Öne Çıkan Hizmetlerimiz'}</h2>
              {servicesSection?.subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{servicesSection.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((s) => (
                <div key={s.id} className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col">
                  <div className="aspect-video bg-primary-100 flex items-center justify-center overflow-hidden">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-primary-800 mb-2 group-hover:text-primary-600">{s.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{s.short_description}</p>
                    <Link 
                      href={`/hizmetler/${s.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
                    >
                      Detaylı Bilgi
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/hizmetler" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Tüm Hizmetler
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {blogs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary-800 mb-4">{blogSection?.title || 'Blog Yazılarımız'}</h2>
              {blogSection?.subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{blogSection.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {blogs.map((b) => (
                <div key={b.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    {b.image_url ? (
                      <img src={b.image_url} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      {b.category && <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">{b.category}</span>}
                      {b.read_time && <span>{b.read_time} okuma</span>}
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 mb-2">{b.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">{b.excerpt}</p>
                    <Link 
                      href={`/blog/${b.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
                    >
                      Devamını Oku
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/blog" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Tüm Yazılar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {cta && (
        <section className="py-16 bg-gradient-to-br from-primary-600 to-primary-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">{cta.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {cta.button1_text && (
                <a href={cta.button1_url || '#'} className="bg-secondary-400 text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-secondary-500 transition-all inline-flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  {cta.button1_text}
                </a>
              )}
              {cta.button2_text && (
                <a href={cta.button2_url || '#'} className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all inline-flex items-center justify-center gap-2">
                  {cta.button2_text}
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

// Tab Section wrapper
function TabSection({ tabs, tabTestimonials }: { tabs: any[], tabTestimonials: any[] }) {
  return <TabSectionClient tabs={tabs} tabTestimonials={tabTestimonials} />
}
