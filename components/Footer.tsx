'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { SiteSettings, Service } from '@/lib/types'

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    const loadData = async () => {
      const [settingsRes, servicesRes] = await Promise.all([
        supabase
          .from('site_settings')
          .select('*')
          .single(),
        supabase
          .from('services')
          .select('*') // burada artık tüm kolonları çekiyoruz
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .limit(5),
      ])

      if (settingsRes.error) {
        console.error('site_settings error:', settingsRes.error)
      } else if (settingsRes.data) {
        setSettings(settingsRes.data as SiteSettings)
      }

      if (servicesRes.error) {
        console.error('services error:', servicesRes.error)
      } else {
        setServices((servicesRes.data || []) as Service[])
      }
    }

    loadData()
  }, [])

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Firma Bilgisi */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-secondary-400 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="font-bold text-xl">
                {settings?.site_name || 'Adana Asansör Kiralama'}
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              {settings?.footer_about || settings?.slogan}
            </p>
            <div className="flex gap-3">
              <a
                href={`https://wa.me/${settings?.whatsapp || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </a>
              <a
                href={`tel:+${settings?.phone_raw || ''}`}
                className="w-10 h-10 bg-secondary-400 rounded-full flex items-center justify-center hover:bg-secondary-500 transition-colors text-primary-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="font-bold text-lg mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-secondary-400 transition-colors">Anasayfa</Link></li>
              <li><Link href="/hakkimizda" className="text-gray-400 hover:text-secondary-400 transition-colors">Hakkımızda</Link></li>
              <li><Link href="/hizmetler" className="text-gray-400 hover:text-secondary-400 transition-colors">Hizmetler</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-secondary-400 transition-colors">Blog</Link></li>
              <li><Link href="/sss" className="text-gray-400 hover:text-secondary-400 transition-colors">SSS</Link></li>
              <li><Link href="/galeri" className="text-gray-400 hover:text-secondary-400 transition-colors">Galeri</Link></li>
              <li><Link href="/iletisim" className="text-gray-400 hover:text-secondary-400 transition-colors">İletişim</Link></li>
            </ul>
          </div>

          {/* Hizmetler */}
          <div>
            <h3 className="font-bold text-lg mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/hizmetler/${service.slug}`}
                    className="text-gray-400 hover:text-secondary-400 transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="font-bold text-lg mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">{settings?.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href={`tel:+${settings?.phone_raw || ''}`}
                  className="text-gray-400 hover:text-secondary-400"
                >
                  {settings?.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-400">{settings?.working_hours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-primary-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} {settings?.site_name}. Tüm hakları saklıdır.
            </p>
            <p className="mt-2 md:mt-0">
              {settings?.slogan}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
