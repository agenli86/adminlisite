import { createServerSupabaseClient } from '@/lib/supabase'
import { Metadata } from 'next'
import GalleryClient from './GalleryClient'

// Cache'i devre dışı bırak
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Galeri | Adana Asansör Kiralama',
  description: 'Tamamladığımız asansör kiralama projelerinden fotoğraflar ve çalışmalarımız.',
}

async function getData() {
  const supabase = createServerSupabaseClient()
  const [galleryRes, heroRes] = await Promise.all([
    supabase.from('gallery').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('page_settings').select('*').eq('page_key', 'galeri').single()
  ])
  return { 
    gallery: galleryRes.data || [],
    hero: heroRes.data
  }
}

export default async function GaleriPage() {
  const { gallery, hero } = await getData()

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20 overflow-hidden">
        {/* Arka plan resmi */}
        {hero?.hero_image && (
          <div className="absolute inset-0">
            <img 
              src={hero.hero_image} 
              alt={hero.hero_title || 'Galeri'}
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
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{hero?.hero_title || 'Galeri'}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {hero?.hero_subtitle || 'Tamamladığımız projelerden kareler'}
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {gallery.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Henüz görsel eklenmemiş.</div>
          ) : (
            <GalleryClient items={gallery} />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Projeniz İçin Bizi Arayın</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Sizin projeniz de galerimizde yer alsın! Hemen teklif alın.
          </p>
          <a href="tel:+905374092406" className="bg-secondary-400 text-primary-900 px-8 py-4 rounded-xl font-bold hover:bg-secondary-500 transition-all inline-flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Hemen Ara
          </a>
        </div>
      </section>
    </>
  )
}
