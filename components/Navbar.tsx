'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Menu, SiteSettings } from '@/lib/types'

interface MenuWithChildren extends Menu {
  children?: Menu[]
}

// URL'i düzgün formata çevir
const formatUrl = (url: string): string => {
  if (!url) return '/'
  // Zaten mutlak veya özel URL ise dokunma
  if (url.startsWith('/') || url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:')) {
    return url
  }
  // Başına / ekle
  return '/' + url
}

export default function Navbar() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [menus, setMenus] = useState<MenuWithChildren[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [settingsRes, menusRes] = await Promise.all([
      supabase.from('site_settings').select('*').single(),
      supabase.from('menus').select('*').eq('is_active', true).order('sort_order'),
    ])
    setSettings(settingsRes.data)
    
    const allMenus = menusRes.data || []
    const parentMenus = allMenus.filter(m => !m.parent_id)
    const menuTree = parentMenus.map(parent => ({
      ...parent,
      children: allMenus.filter(m => m.parent_id === parent.id)
    }))
    setMenus(menuTree)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-primary-800 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href={`tel:+${settings?.phone_raw}`} className="flex items-center gap-1 hover:text-secondary-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {settings?.phone || '0 (537) 409 24 06'}
            </a>
            <span className="hidden sm:flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {settings?.address || 'Çukurova / Adana'}
            </span>
          </div>
          <a href={`https://wa.me/${settings?.whatsapp || '905374092406'}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
        </div>
      </div>

      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {settings?.logo_url ? (
              <img src={settings.logo_url} alt={settings.site_name} className="h-12" />
            ) : (
              <>
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-primary-800 text-lg">{settings?.site_name || 'Adana Asansör'}</span>
                  <span className="block text-xs text-gray-500">{settings?.slogan}</span>
                </div>
              </>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {menus.map((menu) => (
              <div key={menu.id} className="relative group"
                onMouseEnter={() => menu.children?.length && setOpenDropdown(menu.id)}
                onMouseLeave={() => setOpenDropdown(null)}>
                {menu.children && menu.children.length > 0 ? (
                  <>
                    <button className="flex items-center gap-1 text-gray-700 hover:text-primary-600 font-medium py-2">
                      {menu.title}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 bg-white shadow-lg rounded-lg py-2 min-w-[200px] transition-all ${openDropdown === menu.id ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                      {menu.children.map((child) => (
                        <Link key={child.id} href={formatUrl(child.url)} className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={formatUrl(menu.url)} className="text-gray-700 hover:text-primary-600 font-medium py-2">{menu.title}</Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:+${settings?.phone_raw}`} className="bg-secondary-400 text-primary-900 px-4 py-2 rounded-lg font-semibold hover:bg-secondary-500 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hemen Ara
            </a>
          </div>

          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t pt-4 space-y-2">
            {menus.map((menu) => (
              <div key={menu.id}>
                {menu.children?.length ? (
                  <div>
                    <button onClick={() => setOpenDropdown(openDropdown === menu.id ? null : menu.id)}
                      className="w-full flex items-center justify-between py-2 font-medium">
                      {menu.title}
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${openDropdown === menu.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openDropdown === menu.id && (
                      <div className="pl-4">
                        {menu.children.map((child) => (
                          <Link key={child.id} href={formatUrl(child.url)} className="block py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>{child.title}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={formatUrl(menu.url)} className="block py-2 font-medium" onClick={() => setMobileMenuOpen(false)}>{menu.title}</Link>
                )}
              </div>
            ))}
            <a href={`tel:+${settings?.phone_raw}`} className="block w-full text-center bg-secondary-400 text-primary-900 px-4 py-3 rounded-lg font-semibold mt-4">
              Hemen Ara: {settings?.phone}
            </a>
          </div>
        )}
      </nav>
    </header>
  )
}
