'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Tab, TabTestimonial } from '@/lib/types'

export default function TabsPage() {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [testimonials, setTestimonials] = useState<TabTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTab, setEditingTab] = useState<Partial<Tab> | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<TabTestimonial> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [tabsRes, testimonialsRes] = await Promise.all([
      supabase.from('tabs').select('*').order('sort_order'),
      supabase.from('tab_testimonials').select('*').order('sort_order'),
    ])
    setTabs(tabsRes.data || [])
    setTestimonials(testimonialsRes.data || [])
    setLoading(false)
  }

  const handleSaveTab = async () => {
    if (!editingTab) return
    setSaving(true)
    try {
      if (editingTab.id) {
        await supabase.from('tabs').update({ ...editingTab, updated_at: new Date().toISOString() }).eq('id', editingTab.id)
      } else {
        await supabase.from('tabs').insert([{ ...editingTab, created_at: new Date().toISOString() }])
      }
      fetchData()
      setEditingTab(null)
    } catch (error) {
      alert('Kaydetme hatası!')
    }
    setSaving(false)
  }

  const handleSaveTestimonial = async () => {
    if (!editingTestimonial) return
    setSaving(true)
    try {
      if (editingTestimonial.id) {
        await supabase.from('tab_testimonials').update(editingTestimonial).eq('id', editingTestimonial.id)
      } else {
        await supabase.from('tab_testimonials').insert([{ ...editingTestimonial, created_at: new Date().toISOString() }])
      }
      fetchData()
      setEditingTestimonial(null)
    } catch (error) {
      alert('Kaydetme hatası!')
    }
    setSaving(false)
  }

  const deleteTab = async (id: string) => {
    if (!confirm('Bu tab ve altındaki yorumlar silinecek. Emin misiniz?')) return
    await supabase.from('tab_testimonials').delete().eq('tab_id', id)
    await supabase.from('tabs').delete().eq('id', id)
    fetchData()
  }

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await supabase.from('tab_testimonials').delete().eq('id', id)
    fetchData()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tab Yönetimi</h1>
            <p className="text-gray-500">Anasayfa tab bölümünü düzenleyin</p>
          </div>
          <button onClick={() => setEditingTab({ title: '', content: '', sort_order: tabs.length, is_active: true })}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Tab
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
        ) : (
          <div className="space-y-4">
            {tabs.map((tab) => (
              <div key={tab.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{tab.title}</h3>
                    <span className="text-sm text-gray-500">Sıra: {tab.sort_order}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingTestimonial({ tab_id: tab.id, name: '', location: '', comment: '', sort_order: 0 })}
                      className="text-green-600 hover:text-green-700 text-sm font-medium">+ Yorum Ekle</button>
                    <button onClick={() => setEditingTab(tab)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">Düzenle</button>
                    <button onClick={() => deleteTab(tab.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">Sil</button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">{tab.content}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Tab Yorumları:</h4>
                    {testimonials.filter(t => t.tab_id === tab.id).length === 0 ? (
                      <p className="text-sm text-gray-400">Henüz yorum yok</p>
                    ) : (
                      testimonials.filter(t => t.tab_id === tab.id).map((testimonial) => (
                        <div key={testimonial.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-medium text-gray-800">{testimonial.name}</span>
                            <span className="text-sm text-gray-500 ml-2">- {testimonial.location}</span>
                            <p className="text-sm text-gray-600 mt-1">{testimonial.comment}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingTestimonial(testimonial)} className="text-primary-600 text-sm">Düzenle</button>
                            <button onClick={() => deleteTestimonial(testimonial.id)} className="text-red-600 text-sm">Sil</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab Edit Modal */}
        {editingTab && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="p-6 border-b"><h2 className="text-lg font-semibold">{editingTab.id ? 'Tab Düzenle' : 'Yeni Tab'}</h2></div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tab Başlığı</label>
                  <input type="text" value={editingTab.title || ''} onChange={(e) => setEditingTab({...editingTab, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                  <textarea value={editingTab.content || ''} onChange={(e) => setEditingTab({...editingTab, content: e.target.value})}
                    rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
                    <input type="number" value={editingTab.sort_order || 0} onChange={(e) => setEditingTab({...editingTab, sort_order: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={editingTab.is_active !== false}
                      onChange={(e) => setEditingTab({...editingTab, is_active: e.target.checked})} className="w-4 h-4" /><span>Aktif</span></label>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setEditingTab(null)} className="px-4 py-2 border rounded-lg">İptal</button>
                <button onClick={handleSaveTab} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Testimonial Edit Modal */}
        {editingTestimonial && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full">
              <div className="p-6 border-b"><h2 className="text-lg font-semibold">{editingTestimonial.id ? 'Yorum Düzenle' : 'Yeni Yorum'}</h2></div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">İsim</label>
                  <input type="text" value={editingTestimonial.name || ''} onChange={(e) => setEditingTestimonial({...editingTestimonial, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokasyon</label>
                  <input type="text" value={editingTestimonial.location || ''} onChange={(e) => setEditingTestimonial({...editingTestimonial, location: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg" placeholder="Seyhan / Adana" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yorum</label>
                  <textarea value={editingTestimonial.comment || ''} onChange={(e) => setEditingTestimonial({...editingTestimonial, comment: e.target.value})}
                    rows={3} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setEditingTestimonial(null)} className="px-4 py-2 border rounded-lg">İptal</button>
                <button onClick={handleSaveTestimonial} disabled={saving} className="bg-primary-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
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
