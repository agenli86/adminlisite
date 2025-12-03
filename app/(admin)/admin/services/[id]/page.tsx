'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Service } from '@/lib/types'
import ImageUpload from '@/components/ImageUpload'
import RichTextEditor from '@/components/RichTextEditor'

const emptyService: Partial<Service> = {
  title: '',
  slug: '',
  short_description: '',
  content: '',
  icon: '',
  image_url: '',
  features: [],
  is_featured: false,
  is_active: true,
  sort_order: 0,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  og_image: '',
  canonical_url: '',
}

export default function ServiceFormPage() {
  const router = useRouter()
  const params = useParams()
  const isEdit = params.id !== 'new'
  
  const [service, setService] = useState<Partial<Service>>(emptyService)
  const [featuresText, setFeaturesText] = useState('')
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (isEdit) {
      fetchService()
    }
  }, [isEdit, params.id])

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setService(data)
      if (data.features) {
        setFeaturesText(Array.isArray(data.features) ? data.features.join('\n') : '')
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      router.push('/admin/services')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    const features = featuresText.split('\n').filter(f => f.trim())
    const serviceData = {
      ...service,
      features,
      updated_at: new Date().toISOString(),
    }

    try {
      if (isEdit) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', params.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Hizmet başarıyla güncellendi!' })
      } else {
        const { error } = await supabase
          .from('services')
          .insert([{ ...serviceData, created_at: new Date().toISOString() }])

        if (error) throw error
        setMessage({ type: 'success', text: 'Hizmet başarıyla eklendi!' })
        setTimeout(() => router.push('/admin/services'), 1500)
      }
    } catch (error: any) {
      console.error('Error saving service:', error)
      setMessage({ type: 'error', text: 'Kaydetme hatası: ' + (error.message || 'Bilinmeyen hata') })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof Service, value: any) => {
    setService({ ...service, [field]: value })
    
    // Otomatik slug oluştur
    if (field === 'title' && !isEdit) {
      setService(prev => ({ ...prev, [field]: value, slug: generateSlug(value) }))
    }
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
          <h1 className="text-2xl font-bold text-gray-800">
            {isEdit ? 'Hizmet Düzenle' : 'Yeni Hizmet'}
          </h1>
          <p className="text-gray-500">Hizmet bilgilerini girin</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Temel Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input
                  type="text"
                  value={service.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  value={service.slug || ''}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Kısa Açıklama</label>
                <textarea
                  value={service.short_description || ''}
                  onChange={(e) => handleChange('short_description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                <RichTextEditor 
                  value={service.content || ''} 
                  onChange={(value) => handleChange('content', value)}
                  placeholder="Hizmet içeriğini yazın..."
                />
              </div>
            </div>
          </div>

          {/* Görsel ve İkon */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Görsel ve İkon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İkon Adı</label>
                <input
                  type="text"
                  value={service.icon || ''}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="cube, trash, building vb."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sıra</label>
                <input
                  type="number"
                  value={service.sort_order || 0}
                  onChange={(e) => handleChange('sort_order', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Görsel</label>
                <ImageUpload
                  value={service.image_url || ''}
                  onChange={(url) => handleChange('image_url', url)}
                />
              </div>
            </div>
          </div>

          {/* Özellikler */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Özellikler</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Özellikler (her satıra bir tane)</label>
              <textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Özellik 1&#10;Özellik 2&#10;Özellik 3"
              />
            </div>
          </div>

          {/* Ayarlar */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ayarlar</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={service.is_active || false}
                  onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Aktif</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={service.is_featured || false}
                  onChange={(e) => handleChange('is_featured', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-gray-700">Öne Çıkan</span>
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">SEO Ayarları</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Başlık</label>
                <input
                  type="text"
                  value={service.meta_title || ''}
                  onChange={(e) => handleChange('meta_title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Açıklama</label>
                <textarea
                  value={service.meta_description || ''}
                  onChange={(e) => handleChange('meta_description', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                <input
                  type="text"
                  value={service.meta_keywords || ''}
                  onChange={(e) => handleChange('meta_keywords', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG Image</label>
                <ImageUpload
                  value={service.og_image || ''}
                  onChange={(url) => handleChange('og_image', url)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
                <input
                  type="text"
                  value={service.canonical_url || ''}
                  onChange={(e) => handleChange('canonical_url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/services')}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
