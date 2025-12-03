import { createServerSupabaseClient } from '@/lib/supabase'
import { Metadata } from 'next'

// Cache'i devre dışı bırak
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular | Adana Asansör Kiralama',
  description: 'Asansör kiralama hizmetleri hakkında merak edilen sorular ve cevapları.',
}

async function getData() {
  const supabase = createServerSupabaseClient()
  const [faqsRes, heroRes] = await Promise.all([
    supabase.from('faqs').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('page_settings').select('*').eq('page_key', 'sss').single()
  ])
  return { 
    faqs: faqsRes.data || [],
    hero: heroRes.data
  }
}

export default async function SSSPage() {
  const { faqs, hero } = await getData()

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20 overflow-hidden">
        {/* Arka plan resmi */}
        {hero?.hero_image && (
          <div className="absolute inset-0">
            <img 
              src={hero.hero_image} 
              alt={hero.hero_title || 'SSS'}
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
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{hero?.hero_title || 'Sıkça Sorulan Sorular'}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {hero?.hero_subtitle || 'Asansör kiralama hizmetlerimiz hakkında merak ettikleriniz'}
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faqs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">Henüz soru eklenmemiş.</div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <details key={faq.id} className="bg-white rounded-xl shadow-sm group" open={idx === 0}>
                    <summary className="p-6 font-semibold text-gray-800 cursor-pointer list-none flex items-center justify-between hover:text-primary-600">
                      <span className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                          {idx + 1}
                        </span>
                        {faq.question}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600 pl-11">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Başka Sorunuz mu Var?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Aradığınız cevabı bulamadıysanız, bize ulaşın. Size yardımcı olmaktan mutluluk duyarız.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+905374092406" className="bg-secondary-400 text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-secondary-500 transition-all inline-flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Bizi Arayın
            </a>
            <a href="https://wa.me/905374092406" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-600 transition-all inline-flex items-center justify-center gap-2">
              WhatsApp ile Yazın
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
