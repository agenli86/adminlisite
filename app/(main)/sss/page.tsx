import { faqs } from '@/lib/site-data'

export default function SssPage() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold text-primary-800 mb-8">Sıkça Sorulan Sorular</h1>
      <div className="space-y-4">
        {faqs.map((item) => (
          <details key={item.q} className="bg-gray-50 rounded-xl p-4">
            <summary className="font-semibold cursor-pointer">{item.q}</summary>
            <p className="text-gray-700 mt-3">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
