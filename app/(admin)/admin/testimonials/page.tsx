'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Testimonial } from '@/lib/types'

const emptyTestimonial: Partial<Testimonial> = {
  name: '', location: '', comment: '', rating: 5, is_featured: false, is_active: true, sort_order: 0
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order')
    setTestimonials(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      if (editing.id) {
        await supabase.from('testimonials').update({ ...editing, updated_at: new Date().toISOString() }).eq('id', editing.id)
      } else {
        await supabase.from('testimonials').insert([{ ...editing, created_at: new Date().toISOString() }])
      }
      fetchData()
      setEditing(null)
    } catch (error) { alert('Hata!') }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchData()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('testimonials').update({ is_featured: !current }).eq('id', id)
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, is_featured: !current } : t))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Müşteri Yorumları</h1>
            <p className="text-gray-500">Anasayfada gösterilecek yorumları yönetin</p>
          </div>
          <button onClick={() => setEditing(emptyTestimonial)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Yeni Yorum
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
          ) : testimonials.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Henüz yorum yok.</div>
          ) : (
            <div className="divide-y">
              {testimonials.map((item) => (
                <div key={item.id} className="p-4 flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{item.name}</span>
                      <span className="text-sm text-gray-500">- {item.location}</span>
                      <div className="flex text-yellow-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{item.comment}</p>
                  </div>
                  <button onClick={() => toggleFeatured(item.id, item.is_featured)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${item.is_featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.is_featured ? '⭐ Öne Çıkan' : 'Normal'}
                  </button>
                  <button onClick={() => setEditing(item)} className="text-primary-600 hover:text-primary-700 font-medium text-sm">Düzenle</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-700 font-medium text-sm">Sil</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {editing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="p-6 border-b"><h2 className="text-lg font-semibold">{editing.id ? 'Yorum Düzenle' : 'Yeni Yorum'}</h2></div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
                    <input type="text" value={editing.name || ''} onChange={(e) => setEditing({...editing, name: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lokasyon</label>
                    <input type="text" value={editing.location || ''} onChange={(e) => setEditing({...editing, location: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Seyhan / Adana" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yorum</label>
                  <textarea value={editing.comment || ''} onChange={(e) => setEditing({...editing, comment: e.target.value})}
                    rows={4} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Puan</label>
                    <select value={editing.rating || 5} onChange={(e) => setEditing({...editing, rating: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg">
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Yıldız</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
                    <input type="number" value={editing.sort_order || 0} onChange={(e) => setEditing({...editing, sort_order: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={editing.is_active !== false}
                    onChange={(e) => setEditing({...editing, is_active: e.target.checked})} className="w-4 h-4" /><span>Aktif</span></label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={editing.is_featured || false}
                    onChange={(e) => setEditing({...editing, is_featured: e.target.checked})} className="w-4 h-4" /><span>Öne Çıkan</span></label>
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
