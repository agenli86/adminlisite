import { notFound } from 'next/navigation'
import { services, siteConfig } from '@/lib/site-data'

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = services.find((item) => item.slug === slug)
  if (!service) notFound()

  return (
    <section className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary-800 mb-4">{service.title}</h1>
      <p className="text-gray-700 mb-6">{service.content}</p>
      <ul className="space-y-2 mb-8">
        {service.features.map((f) => <li key={f}>✅ {f}</li>)}
      </ul>
      <a href={`tel:+${siteConfig.phoneRaw}`} className="bg-secondary-400 text-primary-900 px-6 py-3 rounded-lg font-semibold inline-block">Bu hizmet için ara</a>
    </section>
  )
}
