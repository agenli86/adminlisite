'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { AboutPage } from '@/lib/types'
import ImageUpload from '@/components/ImageUpload'

export default function AboutPageAdmin() {
  const [about, setAbout] = useState<AboutPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('about_page').select('*').single()
    setAbout(data)
    setLoading(false)
  }

  const handleChange = (field: keyof AboutPage, value: string) => {
    if (!about) return
    setAbout({ ...about, [field]: value })
  }

  const handleSave = async () => {
    if (!about) return
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      await supabase.from('about_page').update({
        ...about,
        updated_at: new Date().toISOString()
      }).eq('id', about.id)
      setMessage({ type: 'success', text: 'Kaydedildi!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Hata!' })
    }
    setSaving(false)
  }

  if (loading) {
    return <AdminLayout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></AdminLayout>
  }

  if (!about) {
    return <AdminLayout><div className="text-center py-20 text-gray-500">Sayfa bulunamadı.</div></AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hakkımızda Sayfası</h1>
            <p className="text-gray-500">Hakkımızda sayfasını düzenleyin</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Hero */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Hero Bölümü</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input type="text" value={about.hero_title || ''} onChange={(e) => handleChange('hero_title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <textarea value={about.hero_description || ''} onChange={(e) => handleChange('hero_description', e.target.value)}
                rows={2} className="w-full px-4 py-2 border rounded-lg" />
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Ana İçerik</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
              <input type="text" value={about.main_title || ''} onChange={(e) => handleChange('main_title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">İçerik (HTML)</label>
              <textarea value={about.main_content || ''} onChange={(e) => handleChange('main_content', e.target.value)}
                rows={8} className="w-full px-4 py-2 border rounded-lg font-mono text-sm" />
            </div>
          </div>
        </div>

        {/* Misyon & Vizyon */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Misyon & Vizyon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Misyon Başlığı</label>
                <input type="text" value={about.mission_title || ''} onChange={(e) => handleChange('mission_title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Misyon İçeriği</label>
                <textarea value={about.mission_content || ''} onChange={(e) => handleChange('mission_content', e.target.value)}
                  rows={4} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vizyon Başlığı</label>
                <input type="text" value={about.vision_title || ''} onChange={(e) => handleChange('vision_title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vizyon İçeriği</label>
                <textarea value={about.vision_content || ''} onChange={(e) => handleChange('vision_content', e.target.value)}
                  rows={4} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO Ayarları</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Başlık</label>
              <input type="text" value={about.meta_title || ''} onChange={(e) => handleChange('meta_title', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Açıklama</label>
              <textarea value={about.meta_description || ''} onChange={(e) => handleChange('meta_description', e.target.value)}
                rows={2} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
              <ImageUpload value={about.og_image || ''} onChange={(url) => handleChange('og_image', url)} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
