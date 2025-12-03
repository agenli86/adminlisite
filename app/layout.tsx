import type { Metadata } from 'next'
import './globals.css'
import { createServerSupabaseClient } from '@/lib/supabase'

// Site ayarlarını çek
async function getSiteSettings() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .single()
  return data
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  
  return {
    metadataBase: new URL(settings?.canonical_url || 'https://adanaasansorkiralama.com'),
    title: {
      default: settings?.meta_title || 'Adana Asansör Kiralama | Kiralık Asansör, Ev Taşıma Asansörü, Mobil Asansör',
      template: '%s',
    },
    description: settings?.meta_description || 'Adana asansör kiralama hizmeti. Ev taşıma asansörü, mobil asansör kiralama, eşya taşıma asansörü kiralama, asansörlü nakliye ve nakliye asansörü ile profesyonel taşımacılık.',
    keywords: settings?.meta_keywords?.split(',').map((k: string) => k.trim()) || [
      'Adana asansör kiralama',
      'asansör taşıma',
      'kiralık asansör',
      'ev taşıma asansörü',
      'asansörlü nakliye',
    ],
    authors: [{ name: settings?.site_name || 'Adana Asansör Kiralama' }],
    creator: settings?.site_name || 'Adana Asansör Kiralama',
    publisher: settings?.site_name || 'Adana Asansör Kiralama',
    icons: {
      icon: settings?.favicon_url || '/favicon.ico',
      apple: settings?.favicon_url || '/apple-touch-icon.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'tr_TR',
      url: settings?.canonical_url || 'https://adanaasansorkiralama.com',
      siteName: settings?.site_name || 'Adana Asansör Kiralama',
      title: settings?.meta_title || 'Adana Asansör Kiralama | Kiralık Asansör, Ev Taşıma Asansörü',
      description: settings?.meta_description || 'Adana asansör kiralama hizmeti.',
      images: [
        {
          url: settings?.og_image || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: settings?.site_name || 'Adana Asansör Kiralama',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings?.meta_title || 'Adana Asansör Kiralama | Kiralık Asansör, Ev Taşıma Asansörü',
      description: settings?.meta_description || 'Adana asansör kiralama hizmeti.',
      images: [settings?.og_image || '/og-image.jpg'],
    },
    alternates: {
      canonical: settings?.canonical_url || 'https://adanaasansorkiralama.com',
    },
    verification: {
      google: 'google-site-verification-code',
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings?.site_name || 'Adana Asansör Kiralama',
    description: settings?.meta_description || 'Adana asansör kiralama hizmeti. Ev taşıma asansörü, mobil asansör kiralama, eşya taşıma asansörü ve asansörlü nakliye.',
    image: settings?.og_image || 'https://adanaasansorkiralama.com/og-image.jpg',
    telephone: settings?.phone_raw ? `+${settings.phone_raw}` : '+905374092406',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || '',
      addressLocality: 'Çukurova',
      addressRegion: 'Adana',
      addressCountry: 'TR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.0,
      longitude: 35.3213,
    },
    url: settings?.canonical_url || 'https://adanaasansorkiralama.com',
    priceRange: '₺₺',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [],
    areaServed: {
      '@type': 'City',
      name: 'Adana',
    },
    serviceType: [
      'Asansör Kiralama',
      'Ev Taşıma Asansörü',
      'Mobil Asansör Kiralama',
      'Eşya Taşıma Asansörü',
      'Asansörlü Nakliye',
    ],
  }

  return (
    <html lang="tr">
      <head>
        <meta name="theme-color" content="#1e40af" />
        <meta name="geo.region" content="TR-01" />
        <meta name="geo.placename" content="Adana" />
        <meta name="geo.position" content="37.0000;35.3213" />
        <meta name="ICBM" content="37.0000, 35.3213" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
