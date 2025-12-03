'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Announcement {
  id: string
  text: string
  link: string | null
}

// URL'i düzgün formata çevir
const formatUrl = (url: string | null): string => {
  if (!url) return '/'
  if (url.startsWith('/') || url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:')) {
    return url
  }
  return '/' + url
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    supabase
      .from('announcements')
      .select('id, text, link')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => setAnnouncements(data || []))
  }, [])

  if (announcements.length === 0) return null

  return (
    <div className="bg-primary-800 text-white py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {/* İlk set */}
        {announcements.map((a, i) => (
          <span key={a.id} className="mx-8 inline-flex items-center">
            {a.link ? (
              <Link href={formatUrl(a.link)} className="hover:text-secondary-400 transition-colors">
                {a.text}
              </Link>
            ) : (
              <span>{a.text}</span>
            )}
            {i < announcements.length - 1 && <span className="mx-8 text-secondary-400">•</span>}
          </span>
        ))}
        {/* Tekrar (seamless döngü için) */}
        {announcements.map((a, i) => (
          <span key={`dup-${a.id}`} className="mx-8 inline-flex items-center">
            {a.link ? (
              <Link href={formatUrl(a.link)} className="hover:text-secondary-400 transition-colors">
                {a.text}
              </Link>
            ) : (
              <span>{a.text}</span>
            )}
            {i < announcements.length - 1 && <span className="mx-8 text-secondary-400">•</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
