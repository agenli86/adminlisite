import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

// Cache'i devre dışı bırak
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { slug } = await params
  const { data: service } = await supabase.from('services').select('*').eq('slug', slug).single()
  
  if (!service) return { title: 'Hizmet Bulunamadı' }
  
  return {
    title: service.meta_title || service.title,
    description: service.meta_description || service.short_description,
    keywords: service.meta_keywords,
    openGraph: {
      title: service.meta_title || service.title,
      description: service.meta_description || service.short_description,
      images: service.og_image ? [service.og_image] : service.image_url ? [service.image_url] : [],
    },
    alternates: {
      canonical: service.canonical_url,
    },
  }
}

async function getData(slug: string) {
  const supabase = createServerSupabaseClient()
  const [serviceRes, faqsRes, allServicesRes] = await Promise.all([
    supabase.from('services').select('*').eq('slug', slug).single(),
    supabase.from('service_faqs').select('*').order('sort_order'),
    supabase.from('services').select('id, title, slug').eq('is_active', true).order('sort_order'),
  ])
  return { service: serviceRes.data, faqs: faqsRes.data || [], allServices: allServicesRes.data || [] }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params
  const { service, faqs, allServices } = await getData(slug)

  if (!service) notFound()

  const serviceFaqs = faqs.filter(f => f.service_id === service.id)
  const otherServices = allServices.filter(s => s.id !== service.id).slice(0, 5)
  const features = service.features || []

  return (
    <>
      {/* Hero Breadcrumb */}
      <div className="relative bg-gradient-to-r from-primary-800 to-primary-900 py-12">
        {/* Arka plan pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs><pattern id="grid-service" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100" height="100" fill="url(#grid-service)"/>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-gray-300 hover:text-secondary-400 transition-colors">Anasayfa</Link>
            <span className="text-gray-500">/</span>
            <Link href="/hizmetler" className="text-gray-300 hover:text-secondary-400 transition-colors">Hizmetler</Link>
            <span className="text-gray-500">/</span>
            <span className="text-secondary-400 font-medium">{service.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{service.title}</h1>
          {service.short_description && (
            <p className="text-gray-300 mt-2 max-w-2xl">{service.short_description}</p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Hero Image */}
            {service.image_url && (
              <div className="rounded-2xl overflow-hidden mb-8">
                <img src={service.image_url} alt={service.title} className="w-full h-auto" />
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-primary-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-primary-800 mb-4">Özellikler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: service.content || '' }} />

            {/* Service FAQs */}
            {serviceFaqs.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-primary-800 mb-6">Sıkça Sorulan Sorular</h2>
                <div className="space-y-4">
                  {serviceFaqs.map((faq) => (
                    <details key={faq.id} className="bg-gray-50 rounded-xl p-4 group">
                      <summary className="font-semibold text-gray-800 cursor-pointer list-none flex items-center justify-between">
                        {faq.question}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <p className="mt-3 text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="bg-primary-900 text-white rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Hemen Teklif Alın</h3>
                <p className="text-gray-300 mb-6">Bu hizmet hakkında bilgi almak ve fiyat teklifi için bizi arayın.</p>
                <a href="tel:+905374092406" className="block w-full bg-secondary-400 text-primary-900 py-3 rounded-lg font-bold text-center hover:bg-secondary-500 transition-colors mb-3">
                  0 (537) 409 24 06
                </a>
                <a href="https://wa.me/905374092406" target="_blank" rel="noopener noreferrer" className="block w-full bg-green-500 text-white py-3 rounded-lg font-bold text-center hover:bg-green-600 transition-colors">
                  WhatsApp ile Yazın
                </a>
              </div>

              {/* Other Services */}
              {otherServices.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Diğer Hizmetlerimiz</h3>
                  <ul className="space-y-2">
                    {otherServices.map((s) => (
                      <li key={s.id}>
                        <Link href={`/hizmetler/${s.slug}`} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 py-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
