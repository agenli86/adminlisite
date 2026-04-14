'use client'

export default function ContactForm() {
  return (
    <form className="bg-gray-50 p-6 rounded-xl space-y-4">
      <input className="w-full border rounded-lg px-4 py-2" placeholder="Ad Soyad" />
      <input className="w-full border rounded-lg px-4 py-2" placeholder="Telefon" />
      <textarea className="w-full border rounded-lg px-4 py-2" rows={5} placeholder="Taşıma detaylarınızı yazın" />
      <button type="button" className="bg-primary-600 text-white px-5 py-2 rounded-lg">Gönder (Demo)</button>
    </form>
  )
}
