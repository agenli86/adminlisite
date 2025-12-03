'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'

interface PageSetting {
  id: string
  page_key: string
  page_name: string
  hero_title: string
  hero_subtitle: string
  hero_image: string
}

export default function PageSettingsPage() {
  const [pages, setPages] = useState<PageSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('page_settings')
        .select('*')
        .order('page_name')

      if (error) throw error
      setPages(data || [])
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (page: PageSetting) => {
    setSaving(page.id)
    setMessage({ type: '', text: '' })

    try {
      const { error } = await supabase
        .from('page_settings')
        .update({
          hero_title: page.hero_title,
          hero_subtitle: page.hero_subtitle,
          hero_image: page.hero_image,
          updated_at: new Date().toISOString(),
        })
        .eq('id', page.id)

      if (error) throw error

      setMessage({ type: 'success', text: `${page.page_name} sayfası güncellendi!` })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (error) {
      console.error('Error saving page:', error)
      setMessage({ type: 'error', text: 'Kaydetme sırasında bir hata oluştu!' })
    } finally {
      setSaving(null)
    }
  }

  const handleChange = (id: string, field: keyof PageSetting, value: string) => {
    setPages(pages.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sayfa Ayarları</h1>
          <p className="text-gray-500">Her sayfanın hero bölümünü özelleştirin</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {pages.map((page) => (
            <div key={page.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">{page.page_name} Sayfası</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">/{page.page_key}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Başlık</label>
                  <input
                    type="text"
                    value={page.hero_title || ''}
                    onChange={(e) => handleChange(page.id, 'hero_title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Sayfa başlığı"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Alt Başlık</label>
                  <input
                    type="text"
                    value={page.hero_subtitle || ''}
                    onChange={(e) => handleChange(page.id, 'hero_subtitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Kısa açıklama"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Arka Plan Resmi</label>
                  <ImageUpload
                    value={page.hero_image || ''}
                    onChange={(url) => handleChange(page.id, 'hero_image', url)}
                    placeholder="Arka plan resmi URL veya yükle"
                  />
                  <p className="text-xs text-gray-500 mt-1">Önerilen: 1920x600 piksel, yatay görsel</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleSave(page)}
                  disabled={saving === page.id}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving === page.id ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Kaydet
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {pages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Henüz sayfa ayarı yok. Veritabanına page_settings tablosunu ekleyin.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
