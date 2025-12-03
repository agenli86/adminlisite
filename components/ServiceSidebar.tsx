'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Service {
  id: string
  title: string
  slug: string
}

interface SiteSettings {
  phone: string
  phone_raw: string
  whatsapp: string
  working_hours: string
}

interface ServiceSidebarProps {
  currentSlug?: string
}

const ServiceSidebar = ({ currentSlug }: ServiceSidebarProps) => {
  const [services, setServices] = useState<Service[]>([])
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [servicesRes, settingsRes] = await Promise.all([
        supabase.from('services').select('id, title, slug').eq('is_active', true).order('sort_order'),
        supabase.from('site_settings').select('phone, phone_raw, whatsapp, working_hours').single()
      ])
      
      setServices(servicesRes.data || [])
      setSettings(settingsRes.data)
    } catch (error) {
      console.error('Error fetching sidebar data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <aside className="lg:sticky lg:top-28 space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </aside>
    )
  }

  return (
    <aside className="lg:sticky lg:top-28 space-y-6">
      {/* Services List */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Hizmetlerimiz
        </h3>
        <ul className="space-y-2">
          {services.map((service) => (
            <li key={service.id}>
              <Link
                href={`/hizmetler/${service.slug}`}
                className={`block px-4 py-2.5 rounded-lg transition-colors ${
                  currentSlug === service.slug
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-3">Hemen Teklif Al</h3>
        <p className="text-gray-200 text-sm mb-4">
          Ücretsiz keşif ve fiyat teklifi için hemen bize ulaşın.
        </p>
        <div className="space-y-3">
          <a
            href={`tel:+${settings?.phone_raw || '905374092406'}`}
            className="w-full bg-secondary-400 text-primary-900 px-4 py-3 rounded-lg font-semibold hover:bg-secondary-500 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {settings?.phone || '0 (537) 409 24 06'}
          </a>
          <a
            href={`https://wa.me/${settings?.whatsapp || '905374092406'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Çalışma Saatleri
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Pazartesi - Cuma</span>
            <span className="font-semibold text-primary-800">07:00 - 22:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cumartesi</span>
            <span className="font-semibold text-primary-800">08:00 - 20:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pazar</span>
            <span className="font-semibold text-primary-800">09:00 - 18:00</span>
          </div>
          <div className="pt-2 mt-2 border-t border-gray-100">
            <span className="text-green-600 font-semibold">Acil durumlar için 7/24 hizmet</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default ServiceSidebar
