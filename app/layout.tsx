import type { Metadata } from 'next'
import './globals.css'
import { siteConfig } from '@/lib/site-data'

export const metadata: Metadata = {
  metadataBase: new URL('https://hizlinakliyat.com'),
  title: {
    default: `${siteConfig.name} | ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: 'Adana merkezli profesyonel nakliyat hizmetleri: evden eve, ofis taşıma ve şehirler arası taşımacılık.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
