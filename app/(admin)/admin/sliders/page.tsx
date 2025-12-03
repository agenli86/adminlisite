'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Slider } from '@/lib/types'
import ImageUpload from '@/components/ImageUpload'

const emptySlider: Partial<Slider> = {
  title: '',
  subtitle: '',
  description: '',
  image_url: '',
  button1_text: '',
  button1_url: '',
  button2_text: '',
  button2_url: '',
  sort_order: 0,
  is_active: true,
}

export default function SlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSlider, setEditingSlider] = useState<Partial<Slider> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    const { data } = await supabase.from('sliders').select('*').order('sort_order')
    setSliders(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!editingSlider) return
    setSaving(true)

    try {
      if (editingSlider.id) {
        await supabase.from('sliders').update({ ...editingSlider, updated_at: new Date().toISOString() }).eq('id', editingSlider.id)
      } else {
        await supabase.from('sliders').insert([{ ...editingSlider, created_at: new Date().toISOString() }])
      }
      fetchSliders()
      setEditingSlider(null)
    } catch (error) {
      console.error('Error:', error)
      alert('Kaydetme hatası!')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await supabase.from('sliders').delete().eq('id', id)
    fetchSliders()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('sliders').update({ is_active: !current }).eq('id', id)
    setSliders(sliders.map(s => s.id === id ? { ...s, is_active: !current } : s))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Slider Yönetimi</h1>
            <p className="text-gray-500">Anasayfa slider'larını yönetin</p>
          </div>
          <button
            onClick={() => setEditingSlider(emptySlider)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Slider
          </button>
        </div>

        {/* Slider Listesi */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
          ) : sliders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Henüz slider yok.</div>
          ) : (
            <div className="divide-y">
              {sliders.map((slider) => (
                <div key={slider.id} className="p-4 flex items-center gap-4">
                  <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {slider.image_url ? (
                      <img src={slider.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{slider.title}</h3>
                    <p className="text-sm text-gray-500">{slider.subtitle}</p>
                    <span className="text-xs text-gray-400">Sıra: {slider.sort_order}</span>
                  </div>
                  <button
                    onClick={() => toggleActive(slider.id, slider.is_active)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${slider.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                    {slider.is_active ? 'Aktif' : 'Pasif'}
                  </button>
                  <button onClick={() => setEditingSlider(slider)} className="text-primary-600 hover:text-primary-700 font-medium">Düzenle</button>
                  <button onClick={() => handleDelete(slider.id)} className="text-red-600 hover:text-red-700 font-medium">Sil</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingSlider && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editingSlider.id ? 'Slider Düzenle' : 'Yeni Slider'}</h2>
                <button onClick={() => setEditingSlider(null)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                  <input type="text" value={editingSlider.title || ''} onChange={(e) => setEditingSlider({...editingSlider, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt Başlık</label>
                  <input type="text" value={editingSlider.subtitle || ''} onChange={(e) => setEditingSlider({...editingSlider, subtitle: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                  <textarea value={editingSlider.description || ''} onChange={(e) => setEditingSlider({...editingSlider, description: e.target.value})}
                    rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Görsel</label>
                  <ImageUpload value={editingSlider.image_url || ''} onChange={(url) => setEditingSlider({...editingSlider, image_url: url})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buton 1 Yazısı</label>
                    <input type="text" value={editingSlider.button1_text || ''} onChange={(e) => setEditingSlider({...editingSlider, button1_text: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buton 1 URL</label>
                    <input type="text" value={editingSlider.button1_url || ''} onChange={(e) => setEditingSlider({...editingSlider, button1_url: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buton 2 Yazısı</label>
                    <input type="text" value={editingSlider.button2_text || ''} onChange={(e) => setEditingSlider({...editingSlider, button2_text: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buton 2 URL</label>
                    <input type="text" value={editingSlider.button2_url || ''} onChange={(e) => setEditingSlider({...editingSlider, button2_url: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
                    <input type="number" value={editingSlider.sort_order || 0} onChange={(e) => setEditingSlider({...editingSlider, sort_order: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editingSlider.is_active || false} onChange={(e) => setEditingSlider({...editingSlider, is_active: e.target.checked})}
                        className="w-4 h-4 text-primary-600 rounded" />
                      <span>Aktif</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setEditingSlider(null)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">İptal</button>
                <button onClick={handleSave} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
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
