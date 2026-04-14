import { notFound } from 'next/navigation'
import { blogPosts } from '@/lib/site-data'

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts.find((item) => item.slug === slug)
  if (!post) notFound()

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-800 mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{post.createdAt}</p>
      <p className="text-gray-700 leading-8">{post.content}</p>
    </article>
  )
}
