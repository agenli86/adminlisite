import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: blog } = await supabase.from('blogs').select('*').eq('slug', slug).single()
  
  if (!blog) return { title: 'Blog Yazısı Bulunamadı' }
  
  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || blog.excerpt,
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || blog.excerpt,
      images: blog.og_image ? [blog.og_image] : blog.image_url ? [blog.image_url] : [],
      type: 'article',
      publishedTime: blog.created_at,
    },
  }
}

export async function generateStaticParams() {
  const { data: blogs } = await supabase.from('blogs').select('slug').eq('is_active', true)
  return blogs?.map((b) => ({ slug: b.slug })) || []
}

async function getData(slug: string) {
  const [blogRes, recentBlogsRes] = await Promise.all([
    supabase.from('blogs').select('*').eq('slug', slug).single(),
    supabase.from('blogs').select('id, title, slug, image_url, created_at').eq('is_active', true).order('created_at', { ascending: false }).limit(5),
  ])
  return { blog: blogRes.data, recentBlogs: recentBlogsRes.data || [] }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const { blog, recentBlogs } = await getData(slug)

  if (!blog) notFound()

  const otherBlogs = recentBlogs.filter(b => b.id !== blog.id).slice(0, 4)

  return (
    <>
      {/* Hero Breadcrumb */}
      <div className="relative bg-gradient-to-r from-primary-800 to-primary-900 py-12">
        {/* Arka plan pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs><pattern id="grid-blog" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
            <rect width="100" height="100" fill="url(#grid-blog)"/>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-gray-300 hover:text-secondary-400 transition-colors">Anasayfa</Link>
            <span className="text-gray-500">/</span>
            <Link href="/blog" className="text-gray-300 hover:text-secondary-400 transition-colors">Blog</Link>
            <span className="text-gray-500">/</span>
            <span className="text-secondary-400 font-medium">{blog.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mt-3">
            {blog.category && (
              <span className="bg-secondary-400/20 text-secondary-400 px-3 py-1 rounded-full">{blog.category}</span>
            )}
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(blog.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {blog.read_time && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {blog.read_time}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="lg:w-2/3">
            {/* Hero Image */}
            {blog.image_url && (
              <div className="rounded-2xl overflow-hidden mb-8">
                <img src={blog.image_url} alt={blog.title} className="w-full h-auto" />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: blog.content || '' }} />

            {/* Share */}
            <div className="border-t border-b py-6 mt-8 flex items-center gap-4">
              <span className="font-semibold text-gray-700">Paylaş:</span>
              <a href={`https://wa.me/?text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(blog.title)}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </article>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              {/* CTA Card */}
              <div className="bg-primary-900 text-white rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Asansör Kiralama Hizmeti</h3>
                <p className="text-gray-300 mb-6">Profesyonel asansör kiralama için hemen teklif alın.</p>
                <a href="tel:+905374092406" className="block w-full bg-secondary-400 text-primary-900 py-3 rounded-lg font-bold text-center hover:bg-secondary-500 transition-colors">
                  Hemen Ara
                </a>
              </div>

              {/* Recent Posts */}
              {otherBlogs.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-800 mb-4">Son Yazılar</h3>
                  <div className="space-y-4">
                    {otherBlogs.map((b) => (
                      <Link key={b.id} href={`/blog/${b.slug}`} className="flex gap-4 group">
                        <div className="w-20 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {b.image_url && <img src={b.image_url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 group-hover:text-primary-600 line-clamp-2 text-sm">{b.title}</h4>
                          <span className="text-xs text-gray-500">{new Date(b.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
