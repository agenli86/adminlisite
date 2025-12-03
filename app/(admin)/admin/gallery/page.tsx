'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { GalleryItem } from '@/lib/types'
import ImageUpload from '@/components/ImageUpload'

const emptyItem: Partial<GalleryItem> = { title: '', description: '', image_url: '', sort_order: 0, is_active: true }

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('gallery').select('*').order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      if (editing.id) {
        await supabase.from('gallery').update({ ...editing, updated_at: new Date().toISOString() }).eq('id', editing.id)
      } else {
        await supabase.from('gallery').insert([{ ...editing, created_at: new Date().toISOString() }])
      }
      fetchData()
      setEditing(null)
    } catch (error) { alert('Hata!') }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await supabase.from('gallery').delete().eq('id', id)
    fetchData()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('gallery').update({ is_active: !current }).eq('id', id)
    setItems(items.map(i => i.id === id ? { ...i, is_active: !current } : i))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Galeri Yönetimi</h1>
            <p className="text-gray-500">Galeri görsellerini yönetin</p>
          </div>
          <button onClick={() => setEditing({ ...emptyItem, sort_order: items.length + 1 })}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Yeni Görsel
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {loading ? (
            <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Henüz görsel yok.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative group rounded-lg overflow-hidden border">
                  <div className="aspect-[4/3] bg-gray-100">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => setEditing(item)} className="bg-white text-gray-800 px-3 py-1 rounded text-sm font-medium">Düzenle</button>
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">Sil</button>
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Sıra: {item.sort_order}</span>
                      <button onClick={() => toggleActive(item.id, item.is_active)}
                        className={`text-xs px-2 py-0.5 rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="p-6 border-b"><h2 className="text-lg font-semibold">{editing.id ? 'Görsel Düzenle' : 'Yeni Görsel'}</h2></div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                  <input type="text" value={editing.title || ''} onChange={(e) => setEditing({...editing, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea value={editing.description || ''} onChange={(e) => setEditing({...editing, description: e.target.value})}
                    rows={2} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Görsel</label>
                  <ImageUpload value={editing.image_url || ''} onChange={(url) => setEditing({...editing, image_url: url})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
                    <input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({...editing, sort_order: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={editing.is_active !== false}
                      onChange={(e) => setEditing({...editing, is_active: e.target.checked})} className="w-4 h-4" /><span>Aktif</span></label>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setEditing(null)} className="px-4 py-2 border rounded-lg">İptal</button>
                <button onClick={handleSave} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
