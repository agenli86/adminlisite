import Link from 'next/link'

const recentPosts = [
  {
    title: 'Asansör Kiralama Kaçıncı Kata Kadar Çıkar?',
    slug: 'asansor-kiralama-kacinci-kata-kadar-cikar',
    date: '15 Ocak 2025',
  },
  {
    title: 'Ev Taşıma Asansörü ile Taşınmanın Avantajları',
    slug: 'ev-tasima-asansoru-avantajlari',
    date: '10 Ocak 2025',
  },
  {
    title: 'Adana\'da Kiralık Asansör Fiyatlarını Neler Belirler?',
    slug: 'adana-kiralik-asansor-fiyatlari',
    date: '5 Ocak 2025',
  },
]

interface BlogSidebarProps {
  currentSlug?: string
}

const BlogSidebar = ({ currentSlug }: BlogSidebarProps) => {
  return (
    <aside className="lg:sticky lg:top-28 space-y-6">
      {/* Recent Posts */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Son Yazılar
        </h3>
        <ul className="space-y-4">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className={`block group ${currentSlug === post.slug ? 'pointer-events-none' : ''}`}
              >
                <h4 className={`font-medium text-sm leading-tight mb-1 transition-colors ${
                  currentSlug === post.slug 
                    ? 'text-primary-600' 
                    : 'text-gray-700 group-hover:text-primary-600'
                }`}>
                  {post.title}
                </h4>
                <span className="text-xs text-gray-500">{post.date}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/blog" className="mt-4 text-primary-600 font-semibold text-sm hover:text-primary-700 inline-flex items-center gap-1">
          Tüm Yazılar
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-3">Hemen Teklif Al</h3>
        <p className="text-gray-200 text-sm mb-4">
          Asansör kiralama hizmetimiz hakkında detaylı bilgi ve fiyat teklifi için bizi arayın.
        </p>
        <div className="space-y-3">
          <a
            href="tel:+905374092406"
            className="w-full bg-secondary-400 text-primary-900 px-4 py-3 rounded-lg font-semibold hover:bg-secondary-500 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            0 (537) 409 24 06
          </a>
          <a
            href="https://wa.me/905374092406"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-primary-800 mb-4">Kategoriler</h3>
        <ul className="space-y-2">
          {['Rehber', 'İpuçları', 'Fiyatlandırma', 'Haberler'].map((category) => (
            <li key={category}>
              <span className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {category}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default BlogSidebar
