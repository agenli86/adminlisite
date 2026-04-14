import { galleryItems } from '@/lib/site-data'

export default function GaleriPage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">Galeri</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryItems.map((item) => (
          <div key={item.id} className="aspect-square bg-gray-100 rounded-xl p-4 flex flex-col justify-end">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
