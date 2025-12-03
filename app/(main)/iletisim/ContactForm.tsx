'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Service {
  id: string
  title: string
}

export default function ContactForm({ services }: { services: Service[] }) {
  const [formType, setFormType] = useState<'contact' | 'quote'>('contact')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const formData = new FormData(e.currentTarget)

    try {
      if (formType === 'contact') {
        const { error, data } = await supabase.from('contact_messages').insert([{
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email') || null,
          subject: formData.get('subject') || null,
          message: formData.get('message'),
        }]).select()
        
        if (error) {
          console.error('Supabase error:', error)
          throw new Error(error.message)
        }
        console.log('Message saved:', data)
      } else {
        const { error, data } = await supabase.from('quote_requests').insert([{
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email') || null,
          service: formData.get('service'),
          floor_count: formData.get('floor_count') ? parseInt(formData.get('floor_count') as string) : null,
          address: formData.get('address') || null,
          message: formData.get('message'),
        }]).select()
        
        if (error) {
          console.error('Supabase error:', error)
          throw new Error(error.message)
        }
        console.log('Quote saved:', data)
      }

      setSuccess(true)
      e.currentTarget.reset()
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
    }

    setLoading(false)
  }

  return (
    <>
      {/* Form Type Tabs */}
      <div className="flex gap-2 mb-8">
        <button
          type="button"
          onClick={() => setFormType('contact')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            formType === 'contact' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          İletişim Formu
        </button>
        <button
          type="button"
          onClick={() => setFormType('quote')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            formType === 'quote' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Teklif Al
        </button>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold">Mesajınız alındı!</p>
            <p className="text-sm">En kısa sürede size dönüş yapacağız.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad *</label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Adınız Soyadınız"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
            <input
              type="tel"
              name="phone"
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="0 (5XX) XXX XX XX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
          <input
            type="email"
            name="email"
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="ornek@email.com"
          />
        </div>

        {formType === 'contact' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konu</label>
            <input
              type="text"
              name="subject"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Mesajınızın konusu"
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hizmet *</label>
                <select
                  name="service"
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Seçiniz</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kat Sayısı</label>
                <input
                  type="number"
                  name="floor_count"
                  min="1"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Kaç katlı bina?"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proje Adresi</label>
              <input
                type="text"
                name="address"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="İlçe / Mahalle"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mesajınız *</label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder={formType === 'contact' ? 'Mesajınızı yazın...' : 'Projeniz hakkında detay verin (süre, tarih, özel istekler...)'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-4 rounded-lg font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gönderiliyor...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              {formType === 'contact' ? 'Mesaj Gönder' : 'Teklif İste'}
            </>
          )}
        </button>
      </form>
    </>
  )
}
