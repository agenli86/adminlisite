import Link from 'next/link'
import { blogPosts, services, siteConfig } from '@/lib/site-data'

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Güvenilir Nakliyat Çözümü</h1>
          <p className="text-xl text-gray-200 mb-8">{siteConfig.slogan}</p>
          <div className="flex justify-center gap-4">
            <a href={`tel:+${siteConfig.phoneRaw}`} className="bg-secondary-400 text-primary-900 px-6 py-3 rounded-lg font-semibold">Hemen Ara</a>
            <Link href="/iletisim" className="bg-white/15 px-6 py-3 rounded-lg">Teklif Al</Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-primary-800 mb-8">Hizmetlerimiz</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.slug} className="bg-gray-50 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-xl mb-2">{s.title}</h3>
              <p className="text-gray-600 mb-4">{s.short}</p>
              <Link href={`/hizmetler/${s.slug}`} className="text-primary-700 font-semibold">Detay →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-800 mb-8">Son Yazılar</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className="text-primary-700">Oku</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
