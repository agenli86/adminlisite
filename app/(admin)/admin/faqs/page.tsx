'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Faq } from '@/lib/types'

const emptyFaq: Partial<Faq> = { question: '', answer: '', sort_order: 0, is_active: true }

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<Faq> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const { data } = await supabase.from('faqs').select('*').order('sort_order')
    setFaqs(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      if (editing.id) {
        await supabase.from('faqs').update({ ...editing, updated_at: new Date().toISOString() }).eq('id', editing.id)
      } else {
        await supabase.from('faqs').insert([{ ...editing, created_at: new Date().toISOString() }])
      }
      fetchData()
      setEditing(null)
    } catch (error) { alert('Hata!') }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await supabase.from('faqs').delete().eq('id', id)
    fetchData()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('faqs').update({ is_active: !current }).eq('id', id)
    setFaqs(faqs.map(f => f.id === id ? { ...f, is_active: !current } : f))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">SSS Yönetimi</h1>
            <p className="text-gray-500">Sıkça sorulan soruları düzenleyin</p>
          </div>
          <button onClick={() => setEditing({ ...emptyFaq, sort_order: faqs.length + 1 })}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Yeni Soru
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
          ) : faqs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Henüz soru yok.</div>
          ) : (
            <div className="divide-y">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-mono text-sm">{faq.sort_order}.</span>
                        <span className="font-medium text-gray-800">{faq.question}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 ml-6">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button onClick={() => toggleActive(faq.id, faq.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${faq.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {faq.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                      <button onClick={() => setEditing(faq)} className="text-primary-600 hover:text-primary-700 font-medium text-sm">Düzenle</button>
                      <button onClick={() => handleDelete(faq.id)} className="text-red-600 hover:text-red-700 font-medium text-sm">Sil</button>
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
              <div className="p-6 border-b"><h2 className="text-lg font-semibold">{editing.id ? 'Soru Düzenle' : 'Yeni Soru'}</h2></div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soru</label>
                  <input type="text" value={editing.question || ''} onChange={(e) => setEditing({...editing, question: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cevap</label>
                  <textarea value={editing.answer || ''} onChange={(e) => setEditing({...editing, answer: e.target.value})}
                    rows={4} className="w-full px-4 py-2 border rounded-lg" />
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
