'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { SiteSettings } from '@/lib/types'

export default function FloatingButtons() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*') // <-- sadece phone_raw, whatsapp değil, tüm alanları çekiyoruz
        .single()

      if (error) {
        console.error('site_settings error:', error)
        return
      }

      if (data) {
        setSettings(data as SiteSettings)
      }
    }

    loadSettings()
  }, [])

  const whatsappNumber = settings?.whatsapp || '905374092406'
  const phoneNumber = settings?.phone_raw || '905374092406'

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#128C7E] transition-all hover:scale-110 animate-pulse-slow"
        aria-label="WhatsApp ile iletişime geçin"
      >
        {/* Gerçek WhatsApp Logo */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
        </svg>
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          WhatsApp ile yazın
        </span>
      </a>

      <a
        href={`tel:+${phoneNumber}`}
        className="group relative w-14 h-14 bg-secondary-400 rounded-full flex items-center justify-center shadow-lg hover:bg-secondary-500 transition-all hover:scale-110"
        aria-label="Hemen arayın"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="absolute right-full mr-3 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Hemen Ara
        </span>
      </a>
    </div>
  )
}
