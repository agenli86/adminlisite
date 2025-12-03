'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'

interface Announcement {
  id: string
  text: string
  link: string
  sort_order: number
  is_active: boolean
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ text: '', link: '', sort_order: 0, is_active: true })
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('sort_order')
    setAnnouncements(data || [])
    setLoading(false)
  }

  const resetForm = () => {
    setEditId(null)
    setForm({ text: '', link: '', sort_order: 0, is_active: true })
  }

  const handleEdit = (a: Announcement) => {
    setEditId(a.id)
    setForm({ text: a.text, link: a.link || '', sort_order: a.sort_order, is_active: a.is_active })
  }

  const handleSave = async () => {
    if (!form.text.trim()) {
      setMessage({ type: 'error', text: 'Duyuru metni gerekli!' })
      return
    }

    try {
      if (editId) {
        await supabase.from('announcements').update({
          text: form.text,
          link: form.link || null,
          sort_order: form.sort_order,
          is_active: form.is_active,
          updated_at: new Date().toISOString()
        }).eq('id', editId)
        setMessage({ type: 'success', text: 'Duyuru güncellendi!' })
      } else {
        await supabase.from('announcements').insert({
          text: form.text,
          link: form.link || null,
          sort_order: form.sort_order,
          is_active: form.is_active
        })
        setMessage({ type: 'success', text: 'Duyuru eklendi!' })
      }
      resetForm()
      fetchAnnouncements()
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu!' })
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return
    await supabase.from('announcements').delete().eq('id', id)
    fetchAnnouncements()
    setMessage({ type: 'success', text: 'Duyuru silindi!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('announcements').update({ is_active: !current }).eq('id', id)
    fetchAnnouncements()
  }

  if (loading) {
    return <AdminLayout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Duyurular</h1>
          <p className="text-gray-500">Footer üstünde kayan duyuru metinleri</p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editId ? 'Duyuru Düzenle' : 'Yeni Duyuru Ekle'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duyuru Metni *</label>
              <input
                type="text"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="🎉 Kampanya! %20 indirim..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link (opsiyonel)</label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="/iletisim veya tel:+90..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 text-primary-600"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">Aktif</label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700">
              {editId ? 'Güncelle' : 'Ekle'}
            </button>
            {editId && (
              <button onClick={resetForm} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300">
                İptal
              </button>
            )}
          </div>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sıra</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duyuru</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Durum</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {announcements.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">Henüz duyuru eklenmemiş</td></tr>
              ) : (
                announcements.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{a.sort_order}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{a.text}</div>
                      {a.link && <div className="text-xs text-gray-500">{a.link}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(a.id, a.is_active)} className={`px-2 py-1 rounded text-xs font-medium ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {a.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(a)} className="text-blue-600 hover:text-blue-800 mr-3">Düzenle</button>
                      <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800">Sil</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
