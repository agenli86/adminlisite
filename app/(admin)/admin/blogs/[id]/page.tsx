'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Blog } from '@/lib/types'
import ImageUpload from '@/components/ImageUpload'
import RichTextEditor from '@/components/RichTextEditor'

const emptyBlog: Partial<Blog> = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  image_url: '',
  category: '',
  read_time: '',
  is_featured: false,
  is_active: true,
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  og_image: '',
  canonical_url: '',
}

export default function BlogFormPage() {
  const router = useRouter()
  const params = useParams()
  const isEdit = params.id !== 'new'
  
  const [blog, setBlog] = useState<Partial<Blog>>(emptyBlog)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (isEdit) fetchBlog()
  }, [isEdit, params.id])

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase.from('blogs').select('*').eq('id', params.id).single()
      if (error) throw error
      setBlog(data)
    } catch (error) {
      console.error('Error:', error)
      router.push('/admin/blogs')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      if (isEdit) {
        const { error } = await supabase.from('blogs')
          .update({ ...blog, updated_at: new Date().toISOString() })
          .eq('id', params.id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Yazı güncellendi!' })
      } else {
        const { error } = await supabase.from('blogs')
          .insert([{ ...blog, created_at: new Date().toISOString() }])
        if (error) throw error
        setMessage({ type: 'success', text: 'Yazı eklendi!' })
        setTimeout(() => router.push('/admin/blogs'), 1500)
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Hata: ' + error.message })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof Blog, value: any) => {
    setBlog({ ...blog, [field]: value })
    if (field === 'title' && !isEdit) {
      setBlog(prev => ({ ...prev, [field]: value, slug: generateSlug(value) }))
    }
  }

  if (loading) {
    return <AdminLayout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{isEdit ? 'Blog Düzenle' : 'Yeni Blog Yazısı'}</h1>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Temel Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
                <input type="text" value={blog.title || ''} onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input type="text" value={blog.slug || ''} onChange={(e) => handleChange('slug', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                <input type="text" value={blog.category || ''} onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Okuma Süresi</label>
                <input type="text" value={blog.read_time || ''} onChange={(e) => handleChange('read_time', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="5 dk" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Özet</label>
                <textarea value={blog.excerpt || ''} onChange={(e) => handleChange('excerpt', e.target.value)}
                  rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                <RichTextEditor 
                  value={blog.content || ''} 
                  onChange={(value) => handleChange('content', value)}
                  placeholder="Blog içeriğini yazın..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Görsel</h2>
            <ImageUpload value={blog.image_url || ''} onChange={(url) => handleChange('image_url', url)} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Ayarlar</h2>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={blog.is_active || false} onChange={(e) => handleChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded" />
                <span>Aktif</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={blog.is_featured || false} onChange={(e) => handleChange('is_featured', e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded" />
                <span>Öne Çıkan</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Başlık</label>
                <input type="text" value={blog.meta_title || ''} onChange={(e) => handleChange('meta_title', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Açıklama</label>
                <textarea value={blog.meta_description || ''} onChange={(e) => handleChange('meta_description', e.target.value)}
                  rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OG Image</label>
                <ImageUpload value={blog.og_image || ''} onChange={(url) => handleChange('og_image', url)} />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => router.push('/admin/blogs')}
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">İptal</button>
            <button type="submit" disabled={saving}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
