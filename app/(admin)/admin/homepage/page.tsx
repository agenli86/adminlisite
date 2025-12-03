'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { HomepageSection, CtaSection } from '@/lib/types'

export default function HomepagePage() {
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [ctaSections, setCtaSections] = useState<CtaSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [sectionsRes, ctaRes] = await Promise.all([
      supabase.from('homepage_sections').select('*'),
      supabase.from('cta_sections').select('*'),
    ])
    setSections(sectionsRes.data || [])
    setCtaSections(ctaRes.data || [])
    setLoading(false)
  }

  const updateSection = (key: string, field: string, value: string) => {
    setSections(sections.map(s => s.section_key === key ? { ...s, [field]: value } : s))
  }

  const updateCta = (key: string, field: string, value: string) => {
    setCtaSections(ctaSections.map(c => c.section_key === key ? { ...c, [field]: value } : c))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      // Sections güncelle
      for (const section of sections) {
        await supabase.from('homepage_sections').update({
          title: section.title,
          subtitle: section.subtitle,
          content: section.content,
          updated_at: new Date().toISOString()
        }).eq('id', section.id)
      }

      // CTA güncelle
      for (const cta of ctaSections) {
        await supabase.from('cta_sections').update({
          title: cta.title,
          description: cta.description,
          button1_text: cta.button1_text,
          button1_url: cta.button1_url,
          button2_text: cta.button2_text,
          button2_url: cta.button2_url,
          updated_at: new Date().toISOString()
        }).eq('id', cta.id)
      }

      setMessage({ type: 'success', text: 'Değişiklikler kaydedildi!' })
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', text: 'Kaydetme hatası!' })
    }
    setSaving(false)
  }

  const getSection = (key: string) => sections.find(s => s.section_key === key)
  const getCta = (key: string) => ctaSections.find(c => c.section_key === key)

  if (loading) {
    return <AdminLayout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></AdminLayout>
  }

  const mainArticle = getSection('main_article')
  const servicesSection = getSection('services_section')
  const testimonialsSection = getSection('testimonials_section')
  const blogSection = getSection('blog_section')
  const homepageCta = getCta('homepage_cta')

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Anasayfa İçerikleri</h1>
            <p className="text-gray-500">Anasayfa bölümlerini düzenleyin</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Ana Makale */}
        {mainArticle && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ana Makale (Slider Altı)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık (H1)</label>
                <input type="text" value={mainArticle.title || ''} onChange={(e) => updateSection('main_article', 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">İçerik (HTML destekli)</label>
                <textarea value={mainArticle.content || ''} onChange={(e) => updateSection('main_article', 'content', e.target.value)}
                  rows={10} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm" />
                <p className="text-xs text-gray-500 mt-1">SEO için 400-600 kelime önerilir. HTML etiketleri kullanabilirsiniz.</p>
              </div>
            </div>
          </div>
        )}

        {/* Hizmetler Bölümü */}
        {servicesSection && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Öne Çıkan Hizmetler Bölümü</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input type="text" value={servicesSection.title || ''} onChange={(e) => updateSection('services_section', 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                <input type="text" value={servicesSection.subtitle || ''} onChange={(e) => updateSection('services_section', 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Not: Burada gösterilen hizmetler, Hizmetler sayfasından "Öne Çıkan" olarak işaretlenen ilk 3 hizmettir.</p>
          </div>
        )}

        {/* Yorumlar Bölümü */}
        {testimonialsSection && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Müşteri Yorumları Bölümü</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input type="text" value={testimonialsSection.title || ''} onChange={(e) => updateSection('testimonials_section', 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                <input type="text" value={testimonialsSection.subtitle || ''} onChange={(e) => updateSection('testimonials_section', 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Not: Yorumları "Yorumlar" menüsünden yönetebilirsiniz.</p>
          </div>
        )}

        {/* Blog Bölümü */}
        {blogSection && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Blog Bölümü</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input type="text" value={blogSection.title || ''} onChange={(e) => updateSection('blog_section', 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                <input type="text" value={blogSection.subtitle || ''} onChange={(e) => updateSection('blog_section', 'subtitle', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Not: Son 3 blog yazısı otomatik olarak gösterilir.</p>
          </div>
        )}

        {/* CTA Bölümü */}
        {homepageCta && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">CTA (Aksiyon Çağrısı) Alanı</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input type="text" value={homepageCta.title || ''} onChange={(e) => updateCta('homepage_cta', 'title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea value={homepageCta.description || ''} onChange={(e) => updateCta('homepage_cta', 'description', e.target.value)}
                  rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buton 1 Yazısı</label>
                  <input type="text" value={homepageCta.button1_text || ''} onChange={(e) => updateCta('homepage_cta', 'button1_text', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buton 1 URL</label>
                  <input type="text" value={homepageCta.button1_url || ''} onChange={(e) => updateCta('homepage_cta', 'button1_url', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buton 2 Yazısı</label>
                  <input type="text" value={homepageCta.button2_text || ''} onChange={(e) => updateCta('homepage_cta', 'button2_text', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buton 2 URL</label>
                  <input type="text" value={homepageCta.button2_url || ''} onChange={(e) => updateCta('homepage_cta', 'button2_url', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
