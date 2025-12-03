'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { Menu } from '@/lib/types'

const emptyMenu: Partial<Menu> = {
  title: '',
  url: '',
  parent_id: null,
  sort_order: 0,
  is_active: true,
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMenu, setEditingMenu] = useState<Partial<Menu> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    const { data } = await supabase.from('menus').select('*').order('sort_order')
    setMenus(data || [])
    setLoading(false)
  }

  const getMenuTree = () => {
    const parentMenus = menus.filter(m => !m.parent_id)
    return parentMenus.map(parent => ({
      ...parent,
      children: menus.filter(m => m.parent_id === parent.id).sort((a, b) => a.sort_order - b.sort_order)
    }))
  }

  const handleSave = async () => {
    if (!editingMenu) return
    setSaving(true)

    try {
      if (editingMenu.id) {
        await supabase.from('menus').update({ ...editingMenu, updated_at: new Date().toISOString() }).eq('id', editingMenu.id)
      } else {
        await supabase.from('menus').insert([{ ...editingMenu, created_at: new Date().toISOString() }])
      }
      fetchMenus()
      setEditingMenu(null)
    } catch (error) {
      console.error('Error:', error)
      alert('Kaydetme hatası!')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const hasChildren = menus.some(m => m.parent_id === id)
    if (hasChildren) {
      alert('Bu menünün alt menüleri var. Önce onları silmelisiniz.')
      return
    }
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await supabase.from('menus').delete().eq('id', id)
    fetchMenus()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('menus').update({ is_active: !current }).eq('id', id)
    setMenus(menus.map(m => m.id === id ? { ...m, is_active: !current } : m))
  }

  const parentMenus = menus.filter(m => !m.parent_id)
  const menuTree = getMenuTree()

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Menü Yönetimi</h1>
            <p className="text-gray-500">Site menülerini düzenleyin (açılır menü destekli)</p>
          </div>
          <button
            onClick={() => setEditingMenu(emptyMenu)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Menü
          </button>
        </div>

        {/* Menü Listesi */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
          ) : menuTree.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Henüz menü yok.</div>
          ) : (
            <div className="divide-y">
              {menuTree.map((menu) => (
                <div key={menu.id}>
                  {/* Parent Menu */}
                  <div className="p-4 flex items-center gap-4 bg-gray-50">
                    <div className="w-8 text-center text-gray-400 font-mono text-sm">{menu.sort_order}</div>
                    <div className="flex-1">
                      <span className="font-semibold text-gray-800">{menu.title}</span>
                      <span className="text-sm text-gray-500 ml-2">({menu.url})</span>
                    </div>
                    <button
                      onClick={() => toggleActive(menu.id, menu.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${menu.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                      {menu.is_active ? 'Aktif' : 'Pasif'}
                    </button>
                    <button onClick={() => setEditingMenu(menu)} className="text-primary-600 hover:text-primary-700 font-medium text-sm">Düzenle</button>
                    <button onClick={() => handleDelete(menu.id)} className="text-red-600 hover:text-red-700 font-medium text-sm">Sil</button>
                  </div>
                  {/* Child Menus */}
                  {menu.children && menu.children.length > 0 && (
                    <div className="bg-white">
                      {menu.children.map((child: Menu) => (
                        <div key={child.id} className="p-4 pl-16 flex items-center gap-4 border-t border-gray-100">
                          <div className="w-8 text-center text-gray-400 font-mono text-sm">{child.sort_order}</div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <div className="flex-1">
                            <span className="text-gray-700">{child.title}</span>
                            <span className="text-sm text-gray-500 ml-2">({child.url})</span>
                          </div>
                          <button
                            onClick={() => toggleActive(child.id, child.is_active)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${child.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                          >
                            {child.is_active ? 'Aktif' : 'Pasif'}
                          </button>
                          <button onClick={() => setEditingMenu(child)} className="text-primary-600 hover:text-primary-700 font-medium text-sm">Düzenle</button>
                          <button onClick={() => handleDelete(child.id)} className="text-red-600 hover:text-red-700 font-medium text-sm">Sil</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingMenu && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">{editingMenu.id ? 'Menü Düzenle' : 'Yeni Menü'}</h2>
                <button onClick={() => setEditingMenu(null)} className="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Menü Adı *</label>
                  <input type="text" value={editingMenu.title || ''} onChange={(e) => setEditingMenu({...editingMenu, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                  <input type="text" value={editingMenu.url || ''} onChange={(e) => setEditingMenu({...editingMenu, url: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" placeholder="/sayfa-adi" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Üst Menü (Açılır menü için)</label>
                  <select value={editingMenu.parent_id || ''} onChange={(e) => setEditingMenu({...editingMenu, parent_id: e.target.value || null})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="">Ana Menü (Üst seviye)</option>
                    {parentMenus.filter(m => m.id !== editingMenu.id).map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Bir üst menü seçerseniz, bu menü o menünün altında açılır menü olarak görünür.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sıra</label>
                    <input type="number" value={editingMenu.sort_order || 0} onChange={(e) => setEditingMenu({...editingMenu, sort_order: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editingMenu.is_active !== false} onChange={(e) => setEditingMenu({...editingMenu, is_active: e.target.checked})}
                        className="w-4 h-4 text-primary-600 rounded" />
                      <span>Aktif</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button onClick={() => setEditingMenu(null)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">İptal</button>
                <button onClick={handleSave} disabled={saving || !editingMenu.title || !editingMenu.url}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50">
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
