import Link from 'next/link'
import { blogPosts } from '@/lib/site-data'

export default function BlogPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">Blog</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
          <article key={post.slug} className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-bold text-xl mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-primary-700">Yazıyı Oku</Link>
          </article>
        ))}
      </div>
    </section>
  )
}
