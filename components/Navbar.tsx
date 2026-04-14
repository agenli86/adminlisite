'use client'

import Link from 'next/link'
import { useState } from 'react'
import { menuItems, siteConfig } from '@/lib/site-data'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="bg-primary-800 text-white text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between">
          <span>{siteConfig.workingHours}</span>
          <a href={`tel:+${siteConfig.phoneRaw}`} className="font-semibold">{siteConfig.phoneDisplay}</a>
        </div>
      </div>
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-primary-800">{siteConfig.name}</Link>
        <div className="hidden md:flex gap-6">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-gray-700 hover:text-primary-600">
              {item.title}
            </Link>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>Menü</button>
      </nav>
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="block py-2" onClick={() => setOpen(false)}>
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
