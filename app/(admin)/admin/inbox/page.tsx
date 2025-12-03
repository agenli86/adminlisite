'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { supabase } from '@/lib/supabase'
import { ContactMessage, QuoteRequest } from '@/lib/types'

type Message = (ContactMessage | QuoteRequest) & { type: 'contact' | 'quote' }

export default function InboxPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'contact' | 'quote'>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const [contactRes, quoteRes] = await Promise.all([
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('quote_requests').select('*').order('created_at', { ascending: false }),
      ])

      const allMessages: Message[] = [
        ...(contactRes.data || []).map(m => ({ ...m, type: 'contact' as const })),
        ...(quoteRes.data || []).map(m => ({ ...m, type: 'quote' as const })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setMessages(allMessages)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (msg: Message) => {
    if (msg.is_read) return

    const table = msg.type === 'contact' ? 'contact_messages' : 'quote_requests'
    await supabase.from(table).update({ is_read: true }).eq('id', msg.id)
    setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
  }

  const toggleStar = async (msg: Message) => {
    const table = msg.type === 'contact' ? 'contact_messages' : 'quote_requests'
    await supabase.from(table).update({ is_starred: !msg.is_starred }).eq('id', msg.id)
    setMessages(messages.map(m => m.id === msg.id ? { ...m, is_starred: !m.is_starred } : m))
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...selectedMessage, is_starred: !msg.is_starred })
    }
  }

  const deleteMessage = async (msg: Message) => {
    if (!confirm('Bu mesajı silmek istediğinize emin misiniz?')) return

    const table = msg.type === 'contact' ? 'contact_messages' : 'quote_requests'
    await supabase.from(table).delete().eq('id', msg.id)
    setMessages(messages.filter(m => m.id !== msg.id))
    if (selectedMessage?.id === msg.id) setSelectedMessage(null)
  }

  const openMessage = (msg: Message) => {
    setSelectedMessage(msg)
    markAsRead(msg)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const filteredMessages = messages.filter(m => {
    if (activeTab === 'all') return true
    return m.type === activeTab
  })

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gelen Kutusu</h1>
          <p className="text-gray-500">İletişim mesajları ve teklif talepleri</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Tümü', count: messages.length },
            { key: 'contact', label: 'İletişim', count: messages.filter(m => m.type === 'contact').length },
            { key: 'quote', label: 'Teklif Talepleri', count: messages.filter(m => m.type === 'quote').length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <span className="font-medium text-gray-700">{unreadCount} okunmamış mesaj</span>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Mesaj yok</div>
              ) : (
                filteredMessages.map(msg => (
                  <div
                    key={msg.id}
                    onClick={() => openMessage(msg)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === msg.id ? 'bg-primary-50' : ''
                    } ${!msg.is_read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${!msg.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {msg.name}
                          </span>
                          {!msg.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{msg.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            msg.type === 'contact' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {msg.type === 'contact' ? 'İletişim' : 'Teklif'}
                          </span>
                          <span className="text-xs text-gray-400">{formatDate(msg.created_at)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStar(msg) }}
                        className={`p-1 ${msg.is_starred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={msg.is_starred ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800">{selectedMessage.name}</h2>
                    <p className="text-sm text-gray-500">{selectedMessage.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStar(selectedMessage)}
                      className={`p-2 rounded-lg ${selectedMessage.is_starred ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={selectedMessage.is_starred ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-6 flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full ${
                        selectedMessage.type === 'contact' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {selectedMessage.type === 'contact' ? 'İletişim Formu' : 'Teklif Talebi'}
                      </span>
                      <span className="text-gray-500">{formatDate(selectedMessage.created_at)}</span>
                    </div>

                    {'subject' in selectedMessage && selectedMessage.subject && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Konu:</span>
                        <p className="text-gray-800">{selectedMessage.subject}</p>
                      </div>
                    )}

                    {'service' in selectedMessage && selectedMessage.service && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Hizmet:</span>
                        <p className="text-gray-800">{selectedMessage.service}</p>
                      </div>
                    )}

                    {'floor_count' in selectedMessage && selectedMessage.floor_count && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Kat Sayısı:</span>
                        <p className="text-gray-800">{selectedMessage.floor_count}</p>
                      </div>
                    )}

                    {'address' in selectedMessage && selectedMessage.address && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Adres:</span>
                        <p className="text-gray-800">{selectedMessage.address}</p>
                      </div>
                    )}

                    <div>
                      <span className="text-sm font-medium text-gray-500">Mesaj:</span>
                      <p className="text-gray-800 whitespace-pre-wrap mt-1">{selectedMessage.message}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t flex gap-3">
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Ara
                    </a>
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 flex items-center gap-2"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p>Görüntülemek için bir mesaj seçin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
