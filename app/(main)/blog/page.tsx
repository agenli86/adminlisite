import { createServerSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'
import { Metadata } from 'next'

// Cache'i devre dışı bırak
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Blog | Adana Asansör Kiralama',
  description: 'Asansör kiralama, yapı sektörü ve iş güvenliği hakkında faydalı bilgiler ve güncel haberler.',
}

async function getData() {
  const supabase = createServerSupabaseClient()
  const [blogsRes, heroRes] = await Promise.all([
    supabase
      .from('blogs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('page_settings')
      .select('*')
      .eq('page_key', 'blog')
      .single()
  ])

  return { 
    blogs: blogsRes.data || [],
    hero: heroRes.data
  }
}

export default async function BlogPage() {
  const { blogs, hero } = await getData()

  // Kategorileri çıkar (ES2015 Set -> Array.from ile)
  const categories = Array.from(
    new Set(
      (blogs || [])
        .map((b: any) => b.category as string | null)
        .filter(Boolean)
    )
  ) as string[]

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-900 text-white py-20 overflow-hidden">
        {/* Arka plan resmi */}
        {hero?.hero_image && (
          <div className="absolute inset-0">
            <img 
              src={hero.hero_image} 
              alt={hero.hero_title || 'Blog'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/80 to-primary-900/70"></div>
          </div>
        )}
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {hero?.hero_title || 'Blog'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {hero?.hero_subtitle || 'Asansör kiralama ve yapı sektörü hakkında faydalı bilgiler'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                Tümü
              </span>
              {categories.map((cat) => (
                <span 
                  key={cat} 
                  className="bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-100 cursor-pointer"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Blog Grid */}
          {blogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Henüz blog yazısı yok.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog: any) => (
                <div
                  key={blog.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    {blog.image_url ? (
                      <img 
                        src={blog.image_url} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    {blog.is_featured && (
                      <span className="absolute top-3 left-3 bg-secondary-400 text-primary-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Öne Çıkan
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      {blog.category && (
                        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {blog.category}
                        </span>
                      )}
                      {blog.read_time && <span>{blog.read_time}</span>}
                      <span>
                        {blog.created_at 
                          ? new Date(blog.created_at).toLocaleDateString('tr-TR') 
                          : ''}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3 mb-6 flex-grow">
                      {blog.excerpt}
                    </p>
                    <Link 
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Devamını Oku
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
    </>
  )
}
