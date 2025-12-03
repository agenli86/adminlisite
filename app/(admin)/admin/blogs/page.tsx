'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Blog } from '@/lib/types'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBlogs(data || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu blog yazısını silmek istediğinize emin misiniz?')) return

    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id)
      if (error) throw error
      setBlogs(blogs.filter(b => b.id !== id))
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Silme işlemi başarısız!')
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      setBlogs(blogs.map(b => b.id === id ? { ...b, is_active: !currentStatus } : b))
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Blog Yazıları</h1>
            <p className="text-gray-500">Blog içeriklerinizi yönetin</p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Yazı
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Henüz blog yazısı yok.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Başlık</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-gray-800">{blog.title}</span>
                        {blog.is_featured && (
                          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Öne Çıkan</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{blog.slug}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{blog.category || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(blog.created_at)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(blog.id, blog.is_active)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {blog.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/blogs/${blog.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                        Düzenle
                      </Link>
                      <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-700 font-medium">
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
